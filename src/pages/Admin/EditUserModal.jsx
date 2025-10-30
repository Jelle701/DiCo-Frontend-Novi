/**
 * EditUserModal.jsx - Modal for editing user details and managing user data.
 */
import React, { useState, useEffect } from 'react';
import { updateUserById, deleteGlucoseDataForUser } from '../../services/AdminService';
import ConfirmationModal from '../../components/web components/ConfirmationModal';
import Notification from '../../components/web components/Notification';
import './AdminDashboard.css'; // Import the CSS file for styling

/**
 * @function EditUserModal
 * @summary Allows administrators to edit user information and delete glucose data.
 */
const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isConfirmGlucoseDeleteOpen, setIsConfirmGlucoseDeleteOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                role: user.role
            });
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error: apiError } = await updateUserById(user.id, formData);

        if (apiError) {
            setError(apiError.message || 'Kon gebruiker niet bijwerken.');
            setLoading(false);
        } else {
            onSave(data);
            onClose();
        }
    };

    const handleDeleteGlucoseData = async () => {
        setLoading(true);
        const { error: deleteError } = await deleteGlucoseDataForUser(user.id);
        if (deleteError) {
            setNotification({ message: deleteError.message || 'Kon glucose data niet verwijderen.', type: 'error' });
        } else {
            setNotification({ message: `Glucose data voor ${user.email} succesvol verwijderd.`, type: 'success' });
        }
        setLoading(false);
        setIsConfirmGlucoseDeleteOpen(false);
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="card modal-content edit-user-modal-content">
                    <h2 className="mt-0 mb-6">Gebruiker Bewerken: {user.email}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">Voornaam</label>
                            <input className="input" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Achternaam</label>
                            <input className="input" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Rol</label>
                            <select className="input" id="role" name="role" value={formData.role} onChange={handleChange}>
                                <option value="PATIENT">Patiënt</option>
                                <option value="GUARDIAN">Ouder / Voogd</option>
                                <option value="PROVIDER">Zorgverlener</option>
                                {user.role === 'ADMIN' && <option value="ADMIN">Admin</option>}
                            </select>
                        </div>
                        {error && <p className="form-error">{error}</p>}
                        <div className="d-flex gap-4 mt-6 modal-actions-right">
                            <button type="button" onClick={onClose} disabled={loading} className="btn btn--secondary">Annuleren</button>
                            <button type="submit" disabled={loading} className="btn btn--primary">{loading ? 'Opslaan...' : 'Opslaan'}</button>
                        </div>
                    </form>

                    <hr className="my-6" />

                    <div className="danger-zone">
                        <h3 className="danger-zone-title">Gevarenzone</h3>
                        <div className="danger-action">
                            <h4>Verwijder Glucose Data</h4>
                            <p className="text-300">Verwijdert permanent alle glucosemetingen voor <strong>{user.email}</strong>. Deze actie kan niet ongedaan worden gemaakt.</p>
                            <button onClick={() => setIsConfirmGlucoseDeleteOpen(true)} className="btn btn--danger mt-3" disabled={loading}>
                                {loading ? 'Bezig...' : 'Verwijder Glucose Data'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isConfirmGlucoseDeleteOpen && 
                <ConfirmationModal 
                    title="Bevestig Actie"
                    message={`Weet je zeker dat je alle glucose data voor ${user.email} permanent wilt verwijderen?`}
                    onConfirm={handleDeleteGlucoseData}
                    onCancel={() => setIsConfirmGlucoseDeleteOpen(false)}
                />
            }
            {notification.message && 
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification({ message: '', type: '' })}
                />
            }
        </>
    );
};

export default EditUserModal;
