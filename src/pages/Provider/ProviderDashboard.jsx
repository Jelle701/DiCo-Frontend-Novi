/**
 * ProviderDashboard.jsx - Displays an overview of linked patients for healthcare providers.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLinkedPatients, getProviderDashboardSummary } from '../../services/ProviderService';
import Navbar from '../../components/web components/Navbar.jsx';
import './ProviderDashboard.css';

/**
 * @function calculateAge
 * @summary Calculates a person's age from their date of birth string.
 */
const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

/**
 * @function timeSince
 * @summary Returns a human-readable string indicating time elapsed since a given date.
 */
const timeSince = (dateString) => {
    if (!dateString) return 'Nooit';
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " jaar geleden";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " maanden geleden";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dagen geleden";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " uur geleden";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minuten geleden";
    return "Zojuist";
};

/**
 * @function TimeInRangeBar
 * @summary Displays a colored bar representing a percentage, typically for Time in Range.
 */
const TimeInRangeBar = ({ percentage }) => {
    const perc = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
    let barColorClass = 'range-bar--ok';
    if (perc < 50) barColorClass = 'range-bar--low';
    else if (perc < 70) barColorClass = 'range-bar--medium';

    return (
        <div className="time-in-range">
            <div className="range-bar-background">
                <div className={`range-bar-foreground ${barColorClass}`} style={{ width: `${perc}%` }}></div>
            </div>
            <span className="range-percentage">{perc.toFixed(0)}%</span>
        </div>
    );
};

/**
 * @function PatientSummaryCard
 * @summary Displays a summary card for a single patient with key metrics and navigation.
 */
const PatientSummaryCard = ({ patient }) => {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate('/patient-portal', { state: { selectedPatientId: patient.patientId } });
    };

    return (
        <div className="patient-summary-card card" onClick={handleCardClick}>
            <div className="card-header">
                <div className="patient-name">{patient.firstName} {patient.lastName}</div>
                <div className="patient-age">{calculateAge(patient.dateOfBirth)} jaar</div>
            </div>
            <div className="card-body">
                <div className="stat-item">
                    <span className="stat-label">Gem. Glucose (7d)</span>
                    <span className="stat-value">{patient.summaryStats?.averageGlucoseLast7Days?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Time in Range (7d)</span>
                    <TimeInRangeBar percentage={patient.summaryStats?.timeInRangePercentageLast7Days} />
                </div>
            </div>
            <div className="card-footer">
                <div className="last-sync">Laatste sync: {timeSince(patient.lastSyncTimestamp)}</div>
                {patient.hasAlerts && <span className="badge badge--danger">Alert</span>}
            </div>
        </div>
    );
};

/**
 * @function ProviderDashboard
 * @summary Main component for the Provider Dashboard, fetching and displaying summaries of linked patients.
 */
const ProviderDashboard = () => {
    const [patientsSummary, setPatientsSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState('alerts');

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data: patients, error: patientsError } = await getLinkedPatients();
            if (patientsError) throw patientsError;

            if (patients && patients.length > 0) {
                const summaryPromises = patients.map(p => getProviderDashboardSummary(p.id).then(res => 
                    res.error ? null : { ...p, patientId: p.id, ...res.data }
                ));
                const combinedData = (await Promise.all(summaryPromises)).filter(Boolean);
                setPatientsSummary(combinedData);
            } else {
                setPatientsSummary([]);
            }
        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van het dashboard.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const sortedPatients = useMemo(() => {
        return [...patientsSummary].sort((a, b) => {
            switch (sortOrder) {
                case 'alerts':
                    return (b.hasAlerts - a.hasAlerts) || a.firstName.localeCompare(b.firstName);
                case 'name':
                    return a.firstName.localeCompare(b.firstName);
                case 'sync':
                    return (new Date(b.lastSyncTimestamp) - new Date(a.lastSyncTimestamp));
                default:
                    return 0;
            }
        });
    }, [patientsSummary, sortOrder]);

    return (
        <>
            <Navbar />
            <div className="provider-dashboard-container page--dark">
                <header className="provider-header">
                    <div className="header-text">
                        <h1>Zorgverlener Dashboard</h1>
                        <p>Een overzicht van de recente activiteit van uw patiënten.</p>
                    </div>
                    <div className="header-actions">
                        <div className="sort-control">
                            <label htmlFor="sort-order">Sorteer op:</label>
                            <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                                <option value="alerts">Alerts</option>
                                <option value="name">Naam</option>
                                <option value="sync">Laatste Sync</option>
                            </select>
                        </div>
                        <Link to="/patient-portal" className="btn btn--primary">
                            Patiënten Beheren
                        </Link>
                    </div>
                </header>

                {loading && <p>Dashboard wordt geladen...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    sortedPatients.length > 0 ? (
                        <div className="patient-grid">
                            {sortedPatients.map(patient => (
                                <PatientSummaryCard key={patient.patientId} patient={patient} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-dashboard-state card">
                            <h2>Geen patiënten gevonden</h2>
                            <p>Koppel uw eerste patiënt via de knop "Patiënten Beheren".</p>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

export default ProviderDashboard;
