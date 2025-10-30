/**
 * GuardianPatientDetail.jsx - Displays detailed information for a single patient linked to a guardian.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getLinkedPatients,
    getPatientGlucoseMeasurements,
    getPatientDiabetesSummary
} from '../../services/ProviderService.jsx';
import Navbar from '../../components/web components/Navbar.jsx';
import DiabeticRapportValues from '../../components/DiabeticRapportValues.jsx';
import './GuardianPatientDetail.css';

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
 * @function getGlucoseValueClass
 * @summary Returns a CSS class based on glucose value for styling.
 */
const getGlucoseValueClass = (value) => {
    if (value > 10.0) return 'glucose-value--high';
    if (value < 4.0) return 'glucose-value--low';
    return '';
};

/**
 * @function ProfileSummaryCard
 * @summary Displays a summary card of the patient's profile information.
 */
const ProfileSummaryCard = ({ patient, className }) => (
    <div className={`card bg-800 ${className}`}>
        <h3 className="mt-0 mb-4">Profiel</h3>
        <div className="space-y-2">
            <div className="detail-item"><span className="detail-item__label">Naam</span><strong className="detail-item__value">{patient.firstName} {patient.lastName}</strong></div>
            <div className="detail-item"><span className="detail-item__label">Leeftijd</span><strong className="detail-item__value">{calculateAge(patient.dateOfBirth)} jaar</strong></div>
            <div className="detail-item"><span className="detail-item__label">Geboortedatum</span><strong className="detail-item__value">{new Date(patient.dateOfBirth).toLocaleDateString('nl-NL')}</strong></div>
            <div className="detail-item"><span className="detail-item__label">Email</span><strong className="detail-item__value">{patient.username}</strong></div>
            <div className="detail-item"><span className="detail-item__label">Diabetes Type</span><strong className="detail-item__value">{patient.diabetesType || 'N/A'}</strong></div>
        </div>
    </div>
);

/**
 * @function MeasurementsCard
 * @summary Displays a table of recent glucose measurements for the patient.
 */
const MeasurementsCard = ({ measurements, className }) => {
    const safeMeasurements = Array.isArray(measurements) ? measurements : [];
    return (
        <div className={`card bg-800 p-0 ${className}`}>
            <h3 className="mt-0 mb-0 p-6 pb-4">Recente Glucosemetingen</h3>
            <div className="measurements-table-wrapper">
                {safeMeasurements.length > 0 ? (
                    <table className="measurements-table">
                        <thead>
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-300 uppercase text-xs">Datum</th>
                                <th className="text-left p-4 font-semibold text-gray-300 uppercase text-xs">Tijd</th>
                                <th className="text-left p-4 font-semibold text-gray-300 uppercase text-xs">Waarde (mmol/L)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {safeMeasurements.map(m => (
                                <tr key={m.id} className="hover:bg-gray-700/50">
                                    <td className="p-4 text-sm text-gray-100">{new Date(m.timestamp).toLocaleDateString('nl-NL')}</td>
                                    <td className="p-4 text-sm text-gray-100">{new Date(m.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="p-4 text-sm text-gray-100">
                                        <span className={getGlucoseValueClass(m.value)}>{m.value.toFixed(1)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p className="p-6 text-300">Geen metingen gevonden.</p>}
            </div>
        </div>
    );
};

/**
 * @function GuardianPatientDetail
 * @summary Main component for displaying a guardian's linked patient details, including summary and measurements.
 */
const GuardianPatientDetail = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data: patients, error: patientsError } = await getLinkedPatients();
            if (patientsError) throw patientsError;
            const currentPatient = patients.find(p => p.id.toString() === patientId);
            if (!currentPatient) throw new Error('Patiënt niet gevonden of niet gekoppeld.');
            setPatient(currentPatient);

            const { data: measurementsData, error: measurementsError } = await getPatientGlucoseMeasurements(patientId);
            if (measurementsError) throw measurementsError;
            setMeasurements(Array.isArray(measurementsData) ? measurementsData : []);

            const { data: summary, error: summaryError } = await getPatientDiabetesSummary(patientId);
            if (summaryError) throw summaryError;
            setSummaryData(summary);

        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van patiëntgegevens.');
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Navbar />
            <div className="container page--dark section">
                {loading ? (
                    <p className="text-center p-8 text-300">Gegevens worden geladen...</p>
                ) : error ? (
                    <div className="text-center p-8">
                        <p className="text-danger">{error}</p>
                        <Link to="/guardian-portal" className="btn btn--primary mt-4">Terug naar Portaal</Link>
                    </div>
                ) : patient && (
                    <>
                        <header className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-gray-700">
                            <div>
                                <h1 className="m-0">{patient.firstName} {patient.lastName}</h1>
                                <p className="text-base text-300 m-0">Een gedetailleerd overzicht van de diabetesdata.</p>
                            </div>
                            <div className="d-flex gap-4">
                                <button onClick={fetchData} className="btn btn--secondary">Ververs Gegevens</button>
                                <Link to="/guardian-portal" className="btn btn--outline">Terug naar Portaal</Link>
                            </div>
                        </header>
                        
                        <main className="flex flex-column mt-7">
                            {summaryData ? (
                                <DiabeticRapportValues data={summaryData} title="Diabetes Samenvatting" density="compact" />
                            ) : (
                                <div className="card bg-800"><p className="text-300">Geen samenvatting beschikbaar.</p></div>
                            )}

                            <ProfileSummaryCard patient={patient} className="mt-6" />

                            <MeasurementsCard measurements={measurements} className="mt-6" />
                        </main>
                    </>
                )}
            </div>
        </>
    );
};

export default GuardianPatientDetail;
