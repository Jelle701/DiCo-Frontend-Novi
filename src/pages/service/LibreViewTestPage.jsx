/**
 * LibreViewTestPage.jsx - Provides a testing interface for LibreView API integration.
 */
import React, { useState } from 'react';
import Navbar from '../../components/web components/Navbar.jsx';
import { useLibreView } from '../../contexts/LibreViewContext.jsx';
import {
    createLibreViewSession,
    invalidateLibreViewSession,
    getLibreViewConnections,
    getLibreViewGlucoseGraph,
    getLibreViewGlucoseHistory
} from '../../services/LibreView/LibreViewService.jsx';
import '../../styles/AuthForm.css';
import './LibreViewTestPage.css';

/**
 * @function LibreViewTestPage
 * @summary Component for testing various LibreView API functionalities, including login, session management, and data retrieval.
 */
const LibreViewTestPage = () => {
    const { session, login, logout, isLoggedIn } = useLibreView();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * @function handleAction
     * @summary Executes a specified LibreView API action and updates the response state.
     */
    const handleAction = async (action) => {
        setLoading(true);
        setApiResponse(null);
        try {
            let result;
            switch (action) {
                case 'login':
                    result = await createLibreViewSession(email, password);
                    if (result.error) throw new Error(result.error.message || result.error);
                    login(result.data);
                    setApiResponse({ message: 'Succesvol ingelogd. Sessie is nu in de frontend state.', data: result.data });
                    break;
                case 'logout':
                    logout();
                    setApiResponse({ message: 'Sessie is uit de frontend state verwijderd.' });
                    break;
                case 'getConnections':
                    result = await getLibreViewConnections(session);
                    break;
                case 'getGraph':
                    result = await getLibreViewGlucoseGraph(session);
                    break;
                case 'getHistory':
                    result = await getLibreViewGlucoseHistory(session);
                    break;
                default:
                    throw new Error('Onbekende actie');
            }

            if (result && result.error) {
                throw new Error(result.error.message);
            }

            if (result) {
                setApiResponse({ message: `Actie '${action}' succesvol.`, data: result.data });
            }

        } catch (err) {
            setApiResponse({ error: { message: err.message } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card libreview-test-card">
                    <h1>LibreView API Testpagina (Stateless)</h1>
                    <p className="auth-form-description">Test hier de stateless integratie met de LibreView API.</p>

                    {!isLoggedIn ? (
                        <div className="form-section">
                            <h2>Stap 1: Inloggen</h2>
                            <div className="input-group"><label>LibreView E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                            <div className="input-group"><label>LibreView Wachtwoord</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                            <button onClick={() => handleAction('login')} disabled={loading || !email || !password} className="btn btn--primary">{loading ? 'Bezig...' : 'Login & Creëer Sessie'}</button>
                        </div>
                    ) : (
                        <div className="form-section">
                            <h2>Stap 2: API Acties</h2>
                            <p>Sessie is actief. Patient ID: <strong>{session?.patientId || 'N/A'}</strong></p>
                            <div className="test-actions-grid">
                                <button onClick={() => handleAction('getConnections')} disabled={loading} className="btn btn--secondary">Haal Connections op</button>
                                <button onClick={() => handleAction('getGraph')} disabled={loading || !session?.patientId} className="btn btn--secondary">Haal Glucose Graph</button>
                                <button onClick={() => handleAction('getHistory')} disabled={loading || !session?.patientId} className="btn btn--secondary">Haal Glucose History</button>
                                <button onClick={() => handleAction('logout')} disabled={loading} className="btn btn--outline">Logout (Wis Sessie)</button>
                            </div>
                        </div>
                    )}

                    <div className="form-section">
                        <h2>API Respons</h2>
                        <pre className="api-response-box">{loading ? 'Laden...' : JSON.stringify(apiResponse, null, 2)}</pre>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LibreViewTestPage;
