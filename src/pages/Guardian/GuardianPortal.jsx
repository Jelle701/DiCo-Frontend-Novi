/**
 * GuardianPortal.jsx - Guardian portal for viewing and linking patient data.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLinkedPatients, linkPatient } from '../../services/ProviderService.jsx';
import Navbar from '../../components/web components/Navbar.jsx';
import ConfirmationModal from '../../components/web components/ConfirmationModal.jsx';

// Calculates age from a date of birth string.
const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

const PatientCard = ({ patient }) => {
    const navigate = useNavigate();
    return (
        <div className="card bg-800 shadow-1 hover:shadow-2 hover:-translate-y-1 transition-all cursor-pointer flex flex-column" onClick={() => navigate(`/guardian/patient/${patient.id}`)}>
            <div className="flex items-center gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mt-0 mb-0">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-base text-300 m-0">{calculateAge(patient.dateOfBirth)} jaar</p>
                </div>
            </div>
            <div className="flex-grow mb-5 space-y-2">
                <div className="detail-item"><span className="detail-item__label">Diabetes Type</span><strong className="detail-item__value">{patient.diabetesType || 'N/A'}</strong></div>
                <div className="detail-item"><span className="detail-item__label">Geboortedatum</span><strong className="detail-item__value">{new Date(patient.dateOfBirth).toLocaleDateString('nl-NL')}</strong></div>
            </div>
            <button className="btn btn--outline w-100 mt-auto">Bekijk Details</button>
        </div>
    );
};

const AddPatientCard = ({ onClick }) => (
    <div className="card bg-800 shadow-1 hover:shadow-2 hover:-translate-y-1 transition-all cursor-pointer flex flex-column items-center justify-center text-center min-h-[250px] border-dashed border-2 border-gray-700 hover:border-teal"
         onClick={onClick}>
        <h4 className="text-lg font-semibold text-white m-0">Koppel een kind</h4>
    </div>
);

const LinkPatientModal = ({ isOpen, onClose, onSubmit, accessCode, setAccessCode, error, loading }) => {
    if (!isOpen) return null;

    return (
        <ConfirmationModal title="Koppel aan uw kind" onCancel={onClose} showConfirmButton={false} customFooter={null}>
            <p className="text-300 mb-5">Voer de unieke toegangscode in die u van uw kind of zorgverlener heeft ontvangen om de gegevens in te zien.</p>
            <form onSubmit={onSubmit}>
                <div className="input-group">
                    <label htmlFor="accessCode">Toegangscode</label>
                    <input
                        id="accessCode"
                        className="input"
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="bv. 123456"
                        required
                    />
                </div>
                {error && <p className="form-error mt-3">{error}</p>}
                <div className="d-flex justify-end mt-6">
                    <button type="button" onClick={onClose} className="btn btn--secondary mr-4">Annuleren</button>
                    <button type="submit" disabled={loading} className="btn btn--primary">
                        {loading ? 'Bezig met koppelen...' : 'Koppel'}
                    </button>
                </div>
            </form>
        </ConfirmationModal>
    );
};

const GuardianPortal = () => {
    const [linkedPatients, setLinkedPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLinkedPatients = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data, error: apiError } = await getLinkedPatients();
            if (apiError) throw apiError;
            setLinkedPatients(data || []);
        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van uw gegevens.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinkedPatients();
    }, [fetchLinkedPatients]);

    const handleLinkSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        try {
            const { error: apiError } = await linkPatient(accessCode);
            if (apiError) throw apiError;
            await fetchLinkedPatients();
            setIsModalOpen(false);
            setAccessCode('');
        } catch (err) {
            setFormError(err.response?.data?.message || 'De code is ongeldig of al gebruikt.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container page--dark">
                <header className="text-center mb-7">
                    <h1 className="mb-2">Ouderportaal</h1>
                    <p className="text-base text-300 max-w-2xl mx-auto">Een overzicht van de gegevens van uw gekoppelde kind(eren). Klik op een kaart om de gedetailleerde gegevens in te zien.</p>
                </header>

                {loading ? (
                    <p className="text-center p-8 text-300">Gegevens worden geladen...</p>
                ) : error ? (
                    <p className="text-center p-8 text-danger">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {linkedPatients.map(patient => (
                            <PatientCard key={patient.id} patient={patient} />
                        ))}
                        {linkedPatients.length === 0 && (
                            <AddPatientCard onClick={() => setIsModalOpen(true)} />
                        )}
                    </div>
                )}
            </div>

            <LinkPatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleLinkSubmit}
                accessCode={accessCode}
                setAccessCode={setAccessCode}
                error={formError}
                loading={isSubmitting}
            />
        </>
    );
};

export default GuardianPortal;
