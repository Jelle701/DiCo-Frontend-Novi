/**
 * LinkPatientPage.jsx - Allows a guardian to link their account to a patient using an access code.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkPatient } from '../../services/ProviderService.jsx';
import './GrantAccessPage.css';

/**
 * @function LinkPatientPage
 * @summary Component for guardians to link to a patient's account.
 */
const LinkPatientPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!code) {
            setError('Voer de toegangscode van de patiënt in.');
            setLoading(false);
            return;
        }

        try {
            const { data, error: apiError } = await linkPatient(code);

            if (apiError) {
                throw apiError;
            }

            navigate('/dashboard');

        } catch (err) {
            setError(err.message || 'Er is een onbekende fout opgetreden.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grant-access-container">
            <form onSubmit={handleSubmit} className="grant-access-form">
                <h2>Koppel aan Patiënt</h2>
                <p>Voer de unieke toegangscode in die u van de patiënt heeft ontvangen om de accounts te koppelen.</p>
                
                <div className="form-group">
                    <label htmlFor="access-code">Toegangscode van Patiënt</label>
                    <input
                        id="access-code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="bv. A7B-X9C-F4G"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading} className="btn btn--primary">
                    {loading ? 'Bezig met koppelen...' : 'Koppel Account'}
                </button>
            </form>
        </div>
    );
};

export default LinkPatientPage;
