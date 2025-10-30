/**
 * SelectRolePage.jsx - Onboarding step for users to select their role.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../services/ProfileService';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useUser } from '../../../contexts/AuthContext';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css';
import { ROLES } from '../../../constants.js';

/**
 * @function SelectRolePage
 * @summary Allows new users to choose their role (Patient, Guardian, or Provider) during onboarding.
 */
const SelectRolePage = () => {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateOnboardingData } = useOnboarding();
    const { setUserData } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setError('Kies een rol om verder te gaan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = { role: selectedRole };
            const { data: updatedProfile, error: apiError } = await updateUserProfile(payload);

            if (apiError) {
                throw apiError;
            }

            setUserData(updatedProfile);
            updateOnboardingData({ role: selectedRole });

            switch (selectedRole) {
                case ROLES.PATIENT:
                    navigate('/onboarding/preferences');
                    break;
                case ROLES.GUARDIAN:
                    navigate('/guardian-portal');
                    break;
                case ROLES.PROVIDER:
                    navigate('/provider-dashboard');
                    break;
                default:
                    setError('Ongeldige rol geselecteerd, kan niet navigeren.');
                    setLoading(false);
            }

        } catch (apiError) {
            setError(apiError.message || 'Er is een fout opgetreden bij het opslaan van uw rol.');
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <form onSubmit={handleSubmit}>
                        <h1>Kies uw rol</h1>
                        <p className="auth-form-description">Vertel ons wie u bent om uw ervaring te personaliseren.</p>

                        <div className="input-group">
                            <label htmlFor="role-select">Uw rol</label>
                            <select 
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    setError('');
                                }}
                                required
                            >
                                <option value="" disabled>-- Maak een keuze --</option>
                                <option value={ROLES.PATIENT}>Patiënt</option>
                                <option value={ROLES.GUARDIAN}>Ouder / Voogd</option>
                                <option value={ROLES.PROVIDER}>Zorgverlener</option>
                            </select>
                        </div>

                        <div className="role-description text-center min-h-60px mt-3">
                            {selectedRole === ROLES.PATIENT && <p>Ik wil mijn eigen gezondheidsdata bijhouden en beheren.</p>}
                            {selectedRole === ROLES.GUARDIAN && <p>Ik wil de data van een gezinslid (bv. mijn kind) bekijken.</p>}
                            {selectedRole === ROLES.PROVIDER && <p>Ik wil de data van meerdere patiënten beheren.</p>}
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" disabled={loading || !selectedRole} className="btn btn--primary form-action-button">
                            {loading ? 'Bezig met opslaan...' : 'Volgende'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SelectRolePage;
