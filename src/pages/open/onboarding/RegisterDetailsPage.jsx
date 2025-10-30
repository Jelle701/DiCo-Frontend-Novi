/**
 * SelectRolePage.jsx - Onboarding step for users to select their role.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css';

/**
 * @function SelectRolePage
 * @summary Allows new users to choose their role (Patient, Guardian, or Provider) during onboarding.
 */
const SelectRolePage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * @function handleRoleSelection
     * @summary Sets the selected role.
     */
    const handleRoleSelection = (role) => {
        setSelectedRole(role);
    };

    /**
     * @function handleSubmit
     * @summary Handles the submission of the selected role and navigates to the next onboarding step.
     */
    const handleSubmit = async () => {
        if (!selectedRole) {
            setError('Kies een rol om verder te gaan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // TODO: API call to save user role to backend.

            switch (selectedRole) {
                case 'PATIENT':
                    navigate('/dashboard');
                    break;
                case 'GUARDIAN':
                    navigate('/onboarding/link-patient');
                    break;
                case 'PROVIDER':
                    navigate('/provider-dashboard');
                    break;
                default:
                    setError('Ongeldige rol geselecteerd.');
            }
        } catch (apiError) {
            setError(apiError.message || 'Er is een fout opgetreden bij het opslaan van uw rol.');
            console.error('Role selection error:', apiError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <h1>Kies uw rol</h1>
                        <p className="auth-form-description">Stap 2: Selecteer hoe u deze applicatie wilt gebruiken.</p>
                        
                        <div className="role-options">
                            <div 
                                className={`role-card ${selectedRole === 'PATIENT' ? 'selected' : ''}`}
                                onClick={() => handleRoleSelection('PATIENT')}
                            >
                                <h3>Patiënt</h3>
                                <p>Ik wil mijn eigen gezondheidsdata bijhouden en beheren.</p>
                            </div>
                            <div 
                                className={`role-card ${selectedRole === 'GUARDIAN' ? 'selected' : ''}`}
                                onClick={() => handleRoleSelection('GUARDIAN')}
                            >
                                <h3>Ouder/Voogd</h3>
                                <p>Ik wil de data van een gezinslid (bv. mijn kind) bekijken.</p>
                            </div>
                            <div 
                                className={`role-card ${selectedRole === 'PROVIDER' ? 'selected' : ''}`}
                                onClick={() => handleRoleSelection('PROVIDER')}
                            >
                                <h3>Zorgverlener</h3>
                                <p>Ik wil de data van meerdere patiënten beheren.</p>
                            </div>
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
