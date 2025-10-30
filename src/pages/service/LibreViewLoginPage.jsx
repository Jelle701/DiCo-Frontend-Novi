/**
 * LibreViewLoginPage.jsx - Handles user login and linking with LibreView service.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLibreView } from '../../contexts/LibreViewContext.jsx';
import { createLibreViewSession, invalidateLibreViewSession } from '../../services/LibreView/LibreViewService.jsx';
import { getUserServices } from '../../services/UserService.jsx';
import Navbar from '../../components/web components/Navbar.jsx';
import libreViewLogo from '../../content/libre.svg';
import '../../styles/AuthForm.css';

/**
 * @function LibreViewLoginPage
 * @summary Allows users to connect or disconnect their LibreView account for data synchronization.
 */
const LibreViewLoginPage = () => {
    const { login, logout } = useLibreView();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            const { data } = await getUserServices();
            const libreService = data?.find(s => s.serviceName === 'LIBREVIEW');
            if (libreService?.isConnected) {
                setIsLinked(true);
                setEmail(libreService.email || '');
            }
        };
        checkStatus();
    }, []);

    /**
     * @function handleSubmit
     * @summary Handles the submission of LibreView credentials to create a new session.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: sessionData, error: sessionError } = await createLibreViewSession(email, password);

            if (sessionError) {
                throw new Error(sessionError.message || 'Koppeling mislukt. Controleer uw gegevens en probeer het opnieuw.');
            }

            login(sessionData);
            navigate('/service-hub', { state: { message: 'LibreView succesvol gekoppeld!' } });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * @function handleUnlink
     * @summary Handles the unlinking of the LibreView account.
     */
    const handleUnlink = async () => {
        setLoading(true);
        setError('');
        try {
            await invalidateLibreViewSession();
            logout();
            navigate('/service-hub', { state: { message: 'De koppeling met uw LibreView-account is verwijderd.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <img src={libreViewLogo} alt="LibreView Logo" className="auth-form-logo" />
                    
                    {isLinked ? (
                        <div className="text-center">
                            <h1>LibreView Gekoppeld</h1>
                            <p className="auth-form-description">Uw account is momenteel gekoppeld aan <strong>{email}</strong>.</p>
                            <p className="small text-400">De synchronisatie van uw gegevens gebeurt automatisch op de achtergrond.</p>
                            {error && <p className="error-message">{error}</p>}
                            <button onClick={handleUnlink} disabled={loading} className="btn btn--danger form-action-button">
                                {loading ? 'Bezig...' : 'Ontkoppel Account'}
                            </button>
                            <div className="form-footer">
                                <p><Link to="/service-hub">Terug naar Service Hub</Link></p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p className="auth-form-description">Log in met uw LibreView-account om de automatische synchronisatie te activeren.</p>
                            <div className="input-group">
                                <label htmlFor="email">LibreView E-mailadres</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">LibreView Wachtwoord</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <p className="small text-400">Let op: u voert hier uw officiële LibreView-inloggegevens in.</p>
                            <button type="submit" className="btn btn--primary form-action-button" disabled={loading}>
                                {loading ? 'Bezig met koppelen...' : 'Koppel Account'}
                            </button>
                            <div className="form-footer">
                                <p><Link to="/service-hub">Terug naar Service Hub</Link></p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default LibreViewLoginPage;
