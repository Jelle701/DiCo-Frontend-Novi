/**
 * AdminDashboard.jsx - Provides an administrative interface for user management and analytics.
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUsers, deleteUserById, updateUserById } from '../../services/AdminService.jsx';
import Navbar from '../../components/web components/Navbar.jsx';
import EditUserModal from './EditUserModal';
import ConfirmationModal from '../../components/web components/ConfirmationModal.jsx';
import Notification from '../../components/web components/Notification.jsx';
import AnalyticsCharts from './AnalyticsCharts';
import ActivityFeed from './ActivityFeed';
import TableSkeleton from './TableSkeleton';
import './AdminDashboard.css';

/**
 * @function getRoleBadgeClass
 * @summary Returns the CSS class for a role badge based on the role name.
 */
const getRoleBadgeClass = (role) => {
    const roleName = (role || 'default').toLowerCase();
    return `user-role-badge badge-${roleName}`;
};

/**
 * @function DashboardTab
 * @summary Displays overall user statistics and includes analytics charts and activity feed.
 */
const DashboardTab = ({ users }) => {
    const stats = useMemo(() => ({
        total: users.length,
        patients: users.filter(u => u.role === 'PATIENT').length,
        guardians: users.filter(u => u.role === 'GUARDIAN').length,
        providers: users.filter(u => u.role === 'PROVIDER').length
    }), [users]);

    return (
        <div className="tab-content">
            <div className="admin-dashboard-grid mb-6">
                <div className="card stat-card">
                    <h3 className="card-title mt-0 mb-5">Totaal Gebruikers</h3>
                    <p className="stat numeric">{stats.total}</p>
                </div>
                <div className="card stat-card">
                    <h3 className="card-title mt-0 mb-5">Patiënten</h3>
                    <p className="stat numeric">{stats.patients}</p>
                </div>
                <div className="card stat-card">
                    <h3 className="card-title mt-0 mb-5">Ouders/Voogden</h3>
                    <p className="stat numeric">{stats.guardians}</p>
                </div>
                <div className="card stat-card">
                    <h3 className="card-title mt-0 mb-5">Zorgverleners</h3>
                    <p className="stat numeric">{stats.providers}</p>
                </div>
            </div>
            <div className="admin-dashboard-grid">
                <AnalyticsCharts users={users} />
                <ActivityFeed />
            </div>
        </div>
    );
};

/**
 * @function UserManagementTab
 * @summary Manages user data, including search, filter, sort, bulk actions, and pagination.
 */
const UserManagementTab = ({ users, loading, error, fetchUsers, setNotification }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [bulkRole, setBulkRole] = useState('');
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRoleChangeOpen, setIsConfirmRoleChangeOpen] = useState(false);

    const processedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
                return user.email.toLowerCase().includes(term) || fullName.includes(term);
            }
            return true;
        });
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [users, searchTerm, roleFilter, sortConfig]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, roleFilter]);

    const currentUsers = useMemo(() => processedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage), [processedUsers, currentPage, usersPerPage]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(currentUsers.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleDeleteSelected = async () => {
        await Promise.all(selectedUsers.map(id => deleteUserById(id)));
        fetchUsers();
        setNotification({ message: `${selectedUsers.length} gebruikers verwijderd.`, type: 'success' });
        setSelectedUsers([]);
        setIsConfirmDeleteOpen(false);
    };

    const handleBulkRoleChange = async () => {
        await Promise.all(selectedUsers.map(id => updateUserById(id, { role: bulkRole })));
        fetchUsers();
        setNotification({ message: `Rol succesvol gewijzigd voor ${selectedUsers.length} gebruikers.`, type: 'success' });
        setSelectedUsers([]);
        setBulkRole('');
        setIsConfirmRoleChangeOpen(false);
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Email", "FirstName", "LastName", "Role", "CreatedAt"];
        const csvRows = [
            headers.join(','),
            ...processedUsers.map(user =>
                [user.id, `\"${user.email}\"`, `\"${user.firstName || ''}\"`, `\"${user.lastName || ''}\"`, `\"${user.role}\"`, `\"${new Date(user.createdAt).toISOString()}\"`].join(','))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gebruikers.csv';
        a.click();
        URL.revokeObjectURL(url);
        setNotification({ message: 'Gebruikerslijst is geëxporteerd.', type: 'success' });
    };

    return (
        <div className="tab-content">
            <div className="card d-flex flex-wrap items-center justify-between gap-4 mb-5">
                <input type="text" placeholder="Zoek op naam of e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input admin-filter-input"/>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input admin-filter-input">
                    <option value="ALL">Alle Rollen</option><option value="PATIENT">Patiënt</option><option value="GUARDIAN">Ouder / Voogd</option><option value="PROVIDER">Zorgverlener</option><option value="ADMIN">Admin</option>
                </select>
                <button onClick={handleExportCSV} className="btn btn--secondary">Exporteer CSV</button>
            </div>

            {selectedUsers.length > 0 && (
                <div className="card d-flex flex-wrap items-center justify-between gap-4 mb-5">
                    <span className="text-100">{selectedUsers.length} geselecteerd</span>
                    <div className="d-flex items-center gap-3">
                        <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)} className="input"><option value="">Kies nieuwe rol...</option><option value="PATIENT">Patiënt</option><option value="GUARDIAN">Ouder / Voogd</option><option value="PROVIDER">Zorgverlener</option></select>
                        <button onClick={() => setIsConfirmRoleChangeOpen(true)} disabled={!bulkRole} className="btn btn--primary">Pas Rol Aan</button>
                        <button onClick={() => setIsConfirmDeleteOpen(true)} className="btn btn--danger">Verwijder</button>
                    </div>
                </div>
            )}

            <div className="card">
                {loading ? <TableSkeleton /> : error ? <p className="form-error">{error}</p> : (
                    currentUsers.length > 0 ? (
                        <> 
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="admin-table-checkbox-col"><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length > 0 && selectedUsers.length === currentUsers.length} /></th>
                                            <th onClick={() => requestSort('id')} className={`sortable ${sortConfig.key === 'id' ? sortConfig.direction : ''}`}>ID</th>
                                            <th onClick={() => requestSort('email')} className={`sortable ${sortConfig.key === 'email' ? sortConfig.direction : ''}`}>Email</th>
                                            <th onClick={() => requestSort('lastName')} className={`sortable ${sortConfig.key === 'lastName' ? sortConfig.direction : ''}`}>Naam</th>
                                            <th onClick={() => requestSort('role')} className={`sortable ${sortConfig.key === 'role' ? sortConfig.direction : ''}`}>Rol</th>
                                            <th onClick={() => requestSort('createdAt')} className={`sortable ${sortConfig.key === 'createdAt' ? sortConfig.direction : ''}`}>Geregistreerd</th>
                                            <th>Acties</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.map(user => (
                                            <UserTableRow key={user.id} user={user} selectedUsers={selectedUsers} onSelectUser={setSelectedUsers} fetchUsers={fetchUsers} setNotification={setNotification} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination usersPerPage={usersPerPage} totalUsers={processedUsers.length} paginate={(p) => setCurrentPage(p)} currentPage={currentPage}/>
                        </>
                    ) : <div className="empty-state"><p>Geen gebruikers gevonden die aan uw criteria voldoen.</p></div>
                )}
            </div>
            {isConfirmDeleteOpen && <ConfirmationModal title="Bevestig Verwijdering" message={`Weet je zeker dat je ${selectedUsers.length} gebruikers permanent wilt verwijderen?`} onConfirm={handleDeleteSelected} onCancel={() => setIsConfirmDeleteOpen(false)} />}
            {isConfirmRoleChangeOpen && <ConfirmationModal title="Bevestig Rol Wijziging" message={`Weet je zeker dat je de rol van ${selectedUsers.length} gebruikers wilt wijzigen naar ${bulkRole}?`} onConfirm={handleBulkRoleChange} onCancel={() => setIsConfirmRoleChangeOpen(false)} />}
        </div>
    );
};

/**
 * @function UserTableRow
 * @summary Renders a single row in the user management table with actions.
 */
const UserTableRow = ({ user, selectedUsers, onSelectUser, fetchUsers, setNotification }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleSaveUser = () => {
        fetchUsers();
        setNotification({ message: 'Gebruiker succesvol bijgewerkt!', type: 'success' });
    };

    const handleDelete = async () => {
        const { error } = await deleteUserById(user.id);
        if (error) {
            setNotification({ message: error.message, type: 'error' });
        } else {
            fetchUsers();
            setNotification({ message: `Gebruiker ${user.email} verwijderd.`, type: 'success' });
        }
        setIsConfirmModalOpen(false);
    };

    const handleSelect = () => {
        onSelectUser(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]);
    };

    return (
        <>
            <tr className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                <td><input type="checkbox" onChange={handleSelect} checked={selectedUsers.includes(user.id)} /></td>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                <td><span className={getRoleBadgeClass(user.role)}>{user.role || 'N/A'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="d-flex gap-2">
                    <button onClick={() => setIsEditModalOpen(true)} className="btn btn--secondary">Aanpassen</button>
                    <button onClick={() => setIsConfirmModalOpen(true)} className="btn btn--ghost">Verwijderen</button>
                </td>
            </tr>
            {isEditModalOpen && <EditUserModal user={user} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveUser} />}
            {isConfirmModalOpen && <ConfirmationModal title="Bevestig Verwijdering" message={`Weet je zeker dat je ${user.email} wilt verwijderen?`} onConfirm={handleDelete} onCancel={() => setIsConfirmModalOpen(false)} />}
        </>
    );
};

/**
 * @function Pagination
 * @summary Renders pagination controls for a table.
 */
const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) pageNumbers.push(i);
    if (pageNumbers.length <= 1) return null;
    return (
        <nav className="pagination-container">
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">{number}</button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

/**
 * @function AdminDashboard
 * @summary Main component for the Admin Dashboard, displaying user analytics and management.
 */
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();

    useEffect(() => {
        const hash = location.hash.substring(1);
        if (hash === 'management') setActiveTab('management');
        else setActiveTab('dashboard');
    }, [location.hash]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const { data, error: apiError } = await getAllUsers();
        if (apiError) setError(apiError.message || 'Fout bij het ophalen van gebruikers.');
        else setUsers(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return (
        <>
            <Navbar />
            <div className="page--dark">
                <div className="container section">
                    <header className="mb-6">
                        <h1>Admin Dashboard</h1>
                        <p className="text-300">Krijg inzicht in de gebruikersdata en beheer het platform.</p>
                    </header>

                    {activeTab === 'dashboard' && <DashboardTab users={users} />}
                    {activeTab === 'management' && <UserManagementTab users={users} loading={loading} error={error} fetchUsers={fetchUsers} setNotification={setNotification} />}
                </div>
            </div>
            {notification.message && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })}/>}
        </>
    );
};

export default AdminDashboard;
