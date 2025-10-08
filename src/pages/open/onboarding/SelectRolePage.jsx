import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../services/ProfileService';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useUser } from '../../../contexts/AuthContext';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css'; // Importeer de nieuwe centrale stylesheet

function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateOnboardingData } = useOnboarding();
    const { setUserData } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[SelectRolePage] handleSubmit aangeroepen');
        if (!selectedRole) {
            console.warn('[SelectRolePage] Geen rol geselecteerd');
            setError('Kies een rol om verder te gaan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = { role: selectedRole };
            console.log('[SelectRolePage] Payload voor updateUserProfile:', payload);
            const { data: updatedProfile, error: apiError } = await updateUserProfile(payload);

            if (apiError) {
                console.error('[SelectRolePage] Fout bij updateUserProfile API call:', apiError);
                throw apiError;
            }

            console.log('[SelectRolePage] updateUserProfile succesvol. Response:', updatedProfile);

            // Update contexts
            console.log('[SelectRolePage] Contexts updaten...');
            setUserData(updatedProfile);
            updateOnboardingData({ role: selectedRole });
            console.log(`[SelectRolePage] Onboarding context geüpdatet met rol: ${selectedRole}`);

            // Direct navigation
            console.log(`[SelectRolePage] Navigeren op basis van rol: ${selectedRole}`);
            switch (selectedRole) {
                case 'PATIENT':
                    console.log('[SelectRolePage] Navigeren naar /onboarding/preferences');
                    navigate('/onboarding/preferences');
                    break;
                case 'GUARDIAN':
                    console.log('[SelectRolePage] Navigeren naar /guardian-portal');
                    navigate('/guardian-portal');
                    break;
                case 'PROVIDER':
                    console.log('[SelectRolePage] Navigeren naar /provider-dashboard');
                    navigate('/provider-dashboard');
                    break;
                default:
                    console.error('[SelectRolePage] Ongeldige rol geselecteerd, kan niet navigeren.');
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
            <div className="auth-page-container"> {/* Gebruik de nieuwe container class */}
                <div className="auth-form-card"> {/* Gebruik de nieuwe formulier card class */}
                    <form onSubmit={handleSubmit}>
                        <h1>Kies uw rol</h1>
                        <p className="auth-form-description">Vertel ons wie u bent om uw ervaring te personaliseren.</p> {/* Gebruik de nieuwe description class */}

                        <div className="input-group">
                            <label htmlFor="role-select">Uw rol</label>
                            <select 
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => {
                                    console.log(`[SelectRolePage] Rol geselecteerd: ${e.target.value}`);
                                    setSelectedRole(e.target.value);
                                    setError('');
                                }}
                                required
                            >
                                <option value="" disabled>-- Maak een keuze --</option>
                                <option value="PATIENT">Patiënt</option>
                                <option value="GUARDIAN">Ouder / Voogd</option>
                                <option value="PROVIDER">Zorgverlener</option>
                            </select>
                        </div>

                        <div className="role-description text-center min-h-60px mt-3"> {/* Gebruik utility classes */}
                            {selectedRole === 'PATIENT' && <p>Ik wil mijn eigen gezondheidsdata bijhouden en beheren.</p>}
                            {selectedRole === 'GUARDIAN' && <p>Ik wil de data van een gezinslid (bv. mijn kind) bekijken.</p>}
                            {selectedRole === 'PROVIDER' && <p>Ik wil de data van meerdere patiënten beheren.</p>}
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
}

export default SelectRolePage;
