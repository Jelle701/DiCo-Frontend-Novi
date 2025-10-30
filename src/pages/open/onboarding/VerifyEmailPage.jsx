/**
 * VerifyEmailPage.jsx - Handles email verification during the user registration process.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../../services/AuthService/AuthService';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css';

/**
 * @function VerifyEmailPage
 * @summary Allows users to enter a verification token sent to their email to complete registration.
 */
const VerifyEmailPage = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const isSubmitting = useRef(false);

    const userEmail = location.state?.email;

    useEffect(() => {
        if (!userEmail) {
            setError('Geen e-mailadres gevonden. Ga terug naar de registratiepagina.');
        }
    }, [userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting.current) return;

        setIsLoading(true);
        isSubmitting.current = true;
        setError('');
        setMessage('');

        try {
            const { error: apiError } = await verifyEmail({ token });

            if (apiError) {
                throw apiError;
            }

            setMessage('Verificatie geslaagd! U wordt nu doorgestuurd om in te loggen.');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Er is een onbekende fout opgetreden.');
        } finally {
            setIsLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    {userEmail ? (
                        <form onSubmit={handleSubmit}>
                            <h1>Verifieer je e-mailadres</h1>
                            <p className="auth-form-description">We hebben een verificatiecode gestuurd naar <strong>{userEmail}</strong>.</p>
                            <p className="text-400 small mt-neg-7">
                                (Voor ontwikkelingsdoeleinden: controleer de backend-console voor de code).
                            </p>
                            
                            <div className="input-group">
                                <label htmlFor="verificationCode">Verificatiecode</label>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    name="verificationCode"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Voer 6-cijferige code in"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            {message && <p className="success-message">{message}</p>}
                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="btn btn--primary form-action-button" disabled={isLoading || token.length < 6}>
                                {isLoading ? 'Bezig met verifiëren...' : 'Verifieer'}
                            </button>
                        </form>
                    ) : (
                        <div>
                            <h1>Fout</h1>
                            <p className="error-message">{error}</p>
                            <button onClick={() => navigate('/register')} className="btn btn--primary form-action-button">
                                Terug naar Registratie
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyEmailPage;
