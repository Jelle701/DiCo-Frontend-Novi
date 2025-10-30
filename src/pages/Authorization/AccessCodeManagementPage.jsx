/**
 * AccessCodeManagementPage.jsx - Manages the generation and display of patient access codes.
 */
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/ApiClient';
import './AccessCodeManagementPage.css';

/**
 * @function AccessCodeManagementPage
 * @summary Allows patients to generate and view a unique access code for sharing their data.
 */
const AccessCodeManagementPage = () => {
    const [accessCode, setAccessCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    /**
     * @function fetchAccessCode
     * @summary Fetches the existing access code for the current user.
     */
    const fetchAccessCode = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/patient/access-code');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            if (err.response && err.response.status !== 404) {
                setError('Fout bij het ophalen van de toegangscode.');
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * @function generateAccessCode
     * @summary Generates a new access code for the current user.
     */
    const generateAccessCode = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.post('/patient/access-code/generate');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            setError('Fout bij het genereren van de code. Probeer het later opnieuw.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * @function copyToClipboard
     * @summary Copies the displayed access code to the clipboard.
     */
    const copyToClipboard = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode).then(() => {
                setCopySuccess('Code gekopieerd!');
                setTimeout(() => setCopySuccess(''), 2000);
            }, () => {
                setError('Kopiëren mislukt.');
            });
        }
    };

    useEffect(() => {
        fetchAccessCode();
    }, []);

    return (
        <div className="access-code-container">
            <h2>Toegang Delen</h2>
            <p className="info-text">
                Deel de onderstaande code alleen met uw vertrouwde zorgverlener of ouder/voogd.
                Met deze code kunnen zij uw dashboard inzien, maar geen gegevens aanpassen.
            </p>

            {loading && <p className="loading-fallback-message">Aan het laden...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="code-display-section">
                {accessCode ? (
                    <>
                        <p>Uw unieke toegangscode:</p>
                        <div className="code-box">
                            <span>{accessCode}</span>
                            <button onClick={copyToClipboard} className="copy-button">Kopieer</button>
                        </div>
                        {copySuccess && <p className="copy-success-text">{copySuccess}</p>}
                    </>
                ) : (
                    !loading && <p>Er is nog geen code gegenereerd.</p>
                )}
            </div>

            <button onClick={generateAccessCode} disabled={loading} className="generate-button">
                {accessCode ? 'Genereer een Nieuwe Code' : 'Genereer Toegangscode'}
            </button>
        </div>
    );
};

export default AccessCodeManagementPage;
