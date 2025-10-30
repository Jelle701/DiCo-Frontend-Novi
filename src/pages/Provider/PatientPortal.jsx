/**
 * PatientPortal.jsx - Provides a portal for healthcare providers to manage and view patient data.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLinkedPatients, linkPatient, getDelegateTokenForPatient } from '../../services/ProviderService.jsx';
import { getDiabetesSummaryForPatient } from '../../services/DiabetesService.jsx';
import Navbar from '../../components/web components/Navbar.jsx';
import DiabeticRapportValues from '../../components/DiabeticRapportValues.jsx';
import '../../components/DiabeticRapportValues.css';
import './PatientPortal.css';

/**
 * @function PatientListSidebar
 * @summary Displays a searchable list of linked patients and allows adding new ones.
 */
const PatientListSidebar = ({ patients, selectedPatient, onSelectPatient, onAddPatient, searchTerm, setSearchTerm }) => {
    return (
        <aside className="patient-list-sidebar">
            <header className="sidebar-header">
                <h2>Patiënten</h2>
                <button onClick={onAddPatient} className="btn btn--ghost">
                    + Koppelen
                </button>
            </header>
            <div className="sidebar-search">
                <input
                    type="text"
                    placeholder="Zoek op naam..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="patient-list-items">
                {patients.length > 0 ? (
                    patients.map(patient => (
                        <div
                            key={patient.id}
                            className={`patient-list-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                            onClick={() => onSelectPatient(patient)}
                        >
                            <div className="avatar-placeholder">{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}</div>
                            <div className="patient-info">
                                <span>{patient.firstName} {patient.lastName}</span>
                                <small>{patient.email}</small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-patients-found">Geen patiënten gevonden.</p>
                )}
            </div>
        </aside>
    );
};

/**
 * @function PatientDetailView
 * @summary Displays detailed information and a diabetes summary for a selected patient.
 */
const PatientDetailView = ({ patient, summaryData, summaryLoading, summaryError }) => {
    const navigate = useNavigate();

    const handleOpenDashboard = async () => {
        if (!patient) return;

        const { data, error } = await getDelegateTokenForPatient(patient.id);
        if (error) {
            console.error('Fout bij ophalen gedelegeerd token:', error);
            return;
        }

        if (data?.delegatedToken) {
            sessionStorage.setItem('delegatedToken', data.delegatedToken);
            sessionStorage.setItem('patientUsername', patient.email);
            navigate('/dashboard');
        }
    };

    if (!patient) {
        return (
            <main className="patient-detail-content card no-patient-selected">
                <div className="empty-state">
                    <i className="icon-placeholder"></i>
                    <h2>Selecteer een patiënt</h2>
                    <p>Klik op een naam in de lijst om de details en metingen te bekijken.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="patient-detail-content">
            <header className="detail-header">
                <h1>{patient.firstName} {patient.lastName}</h1>
                <div className="header-actions">
                    <button className="btn btn--outline">Stuur Bericht</button>
                    <button className="btn btn--primary" onClick={handleOpenDashboard}>Open Dashboard</button>
                </div>
            </header>

            <div className="details-container">
                <div className="card detail-card">
                    <h3>Persoonlijke Gegevens</h3>
                    <div className="details-grid">
                        <div className="detail-item"><span>Email</span><strong>{patient.email}</strong></div>
                        <div className="detail-item"><span>Geboortedatum</span><strong>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('nl-NL') : 'N/A'}</strong></div>
                        <div className="detail-item"><span>Geslacht</span><strong>{patient.gender || 'N/A'}</strong></div>
                    </div>
                </div>

                <div className="card detail-card">
                    <h3>Medische Informatie</h3>
                    <div className="details-grid">
                        <div className="detail-item"><span>Diabetes Type</span><strong>{patient.diabetesType || 'N/A'}</strong></div>
                        <div className="detail-item"><span>Lengte</span><strong>{patient.height ? `${patient.height} cm` : 'N/A'}</strong></div>
                        <div className="detail-item"><span>Gewicht</span><strong>{patient.weight ? `${patient.weight} kg` : 'N/A'}</strong></div>
                        <div className="detail-item"><span>Langwerkende Insuline</span><strong>{patient.longActingInsulin || 'N/A'}</strong></div>
                        <div className="detail-item"><span>Kortwerkende Insuline</span><strong>{patient.shortActingInsulin || 'N/A'}</strong></div>
                    </div>
                </div>

                <div className="summary-container-portal">
                    {summaryLoading ? (
                        <p>Samenvatting laden...</p>
                    ) : summaryError ? (
                        <p className="error-message">{summaryError}</p>
                    ) : summaryData ? (
                        <DiabeticRapportValues data={summaryData} title="Diabetes Samenvatting" density="compact" />
                    ) : (
                        <p>Geen samenvattingsgegevens beschikbaar.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

/**
 * @function AddPatientModal
 * @summary Modal for linking a new patient using an access code.
 */
const AddPatientModal = ({ show, onClose, onSubmit, newPatientCode, setNewPatientCode, error }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content card">
                <h2>Nieuwe Patiënt Koppelen</h2>
                <form onSubmit={onSubmit}>
                    <p>Voer de unieke toegangscode in die u van de patiënt heeft ontvangen.</p>
                    <div className="form-group">
                        <label htmlFor="patient-code">Toegangscode</label>
                        <input
                            id="patient-code"
                            type="text"
                            value={newPatientCode}
                            onChange={(e) => setNewPatientCode(e.target.value)}
                            placeholder="bv. ABC-123-XYZ"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn">
                            Annuleren
                        </button>
                        <button type="submit" className="btn btn--primary">
                            Koppel Patiënt
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * @function PatientPortal
 * @summary Main component for the Provider Patient Portal, managing linked patients and their details.
 */
const PatientPortal = () => {
    const [allPatients, setAllPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalError, setModalError] = useState('');
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [newPatientCode, setNewPatientCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [summaryData, setSummaryData] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data, error: apiError } = await getLinkedPatients();
            if (apiError) throw apiError;
            const patientsData = data || [];
            setAllPatients(patientsData);
            if (patientsData.length > 0 && !selectedPatient) {
                setSelectedPatient(patientsData[0]);
            }
        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van patiënten.');
        } finally {
            setLoading(false);
        }
    }, [selectedPatient]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    useEffect(() => {
        if (selectedPatient) {
            const fetchSummary = async () => {
                setSummaryLoading(true);
                setSummaryError('');
                setSummaryData(null);
                try {
                    const { data, error: apiError } = await getDiabetesSummaryForPatient(selectedPatient.id);
                    if (apiError) {
                        setSummaryError(apiError.message || 'Kon samenvatting niet laden.');
                        setSummaryData(null);
                    } else {
                        setSummaryData(data);
                    }
                } catch (err) {
                    setSummaryError(err.message || 'Kon samenvatting niet laden.');
                } finally {
                    setSummaryLoading(false);
                }
            };
            fetchSummary();
        }
    }, [selectedPatient]);

    const handleAddPatientSubmit = async (e) => {
        e.preventDefault();
        setModalError('');
        try {
            const { error: apiError } = await linkPatient(newPatientCode);
            if (apiError) throw apiError;
            
            await fetchPatients();
            setShowAddPatientModal(false);
            setNewPatientCode('');
        } catch (err) {
            setModalError(err.message || 'Kan patiënt niet toevoegen. Controleer de code.');
        }
    };

    const handleCloseModal = () => {
        setShowAddPatientModal(false);
        setModalError('');
        setNewPatientCode('');
    };

    const filteredPatients = useMemo(() => 
        allPatients.filter(p =>
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        ), [allPatients, searchTerm]);

    return (
        <>
            <Navbar />
            <div className="patient-portal-container page--dark">
                {loading ? (
                    <p>Patiënten laden...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        <PatientListSidebar
                            patients={filteredPatients}
                            selectedPatient={selectedPatient}
                            onSelectPatient={setSelectedPatient}
                            onAddPatient={() => setShowAddPatientModal(true)}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <PatientDetailView 
                            patient={selectedPatient} 
                            summaryData={summaryData}
                            summaryLoading={summaryLoading}
                            summaryError={summaryError}
                        />
                    </>
                )}
                
                <AddPatientModal
                    show={showAddPatientModal}
                    onClose={handleCloseModal}
                    onSubmit={handleAddPatientSubmit}
                    newPatientCode={newPatientCode}
                    setNewPatientCode={setNewPatientCode}
                    error={modalError}
                />
            </div>
        </>
    );
};

export default PatientPortal;
