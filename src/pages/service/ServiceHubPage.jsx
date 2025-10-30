/**
 * ServiceHubPage.jsx - Central hub for managing external service integrations and data access.
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/web components/Navbar.jsx';
import apiClient from '../../services/ApiClient';
import { getUserServices, refreshLibreViewSession } from '../../services/UserService.jsx';
import { invalidateLibreViewSession, getLibreViewConnections } from '../../services/LibreView/LibreViewService.jsx';
import { getAllMyGlucoseData } from '../../services/DataService.jsx';
import GlucoseUpload from '../../components/GlucoseUpload/GlucoseUpload.jsx';
import './ServicesHubPage.css';
import '../Authorization/AccessCodeManagementPage.css';

/**
 * @function ServiceHubPage
 * @summary Provides an interface for users to manage access codes, export data, and integrate with external services like LibreView.
 */
const ServiceHubPage = () => {
    const [accessCode, setAccessCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(true);
    const [errorCode, setErrorCode] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const [libreViewStatus, setLibreViewStatus] = useState('loading');
    const [libreViewInfo, setLibreViewInfo] = useState(null);
    const [libreViewLoading, setLibreViewLoading] = useState(false);
    const [libreViewMessage, setLibreViewMessage] = useState('');
    const location = useLocation();

    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState('');

    /**
     * @function fetchAccessCode
     * @summary Fetches the patient's current access code.
     */
    const fetchAccessCode = async () => {
        setLoadingCode(true);
        try {
            const response = await apiClient.get('/patient/access-code');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            if (err.response && err.response.status !== 404) setErrorCode('Fout bij ophalen code.');
        } finally {
            setLoadingCode(false);
        }
    };

    /**
     * @function generateAccessCode
     * @summary Generates a new access code for the patient.
     */
    const generateAccessCode = async () => {
        setLoadingCode(true);
        try {
            const response = await apiClient.post('/patient/access-code/generate');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            setErrorCode('Fout bij genereren code.');
        } finally {
            setLoadingCode(false);
        }
    };

    /**
     * @function copyToClipboard
     * @summary Copies the access code to the clipboard.
     */
    const copyToClipboard = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode).then(() => setCopySuccess('Gekopieerd!'), () => setErrorCode('Kopiëren mislukt.'));
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    /**
     * @function handleExportData
     * @summary Exports all glucose data to a CSV file.
     */
    const handleExportData = async () => {
        setExporting(true);
        setExportError('');
        try {
            const { data, error } = await getAllMyGlucoseData();
            if (error) throw error;

            if (!data || data.length === 0) {
                setExportError('Geen gegevens gevonden om te exporteren.');
                return;
            }

            const headers = ["timestamp", "value", "unit", "source"];
            const csvRows = [
                headers.join(','),
                ...data.map(row => 
                    [row.timestamp, row.value, row.unit || 'mmol/L', row.source].join(',')
                )
            ];
            
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'glucose_export.csv';
            a.click();
            URL.revokeObjectURL(url);

        } catch (err) {
            setExportError('Fout bij het exporteren van gegevens.');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        const checkServiceStatus = async () => {
            setLibreViewStatus('loading');
            const { data, error } = await getUserServices();
            if (error) {
                setLibreViewStatus('unlinked');
                return;
            }
            const libreViewService = data.find(s => s.serviceName === 'LIBREVIEW');
            if (libreViewService && libreViewService.isConnected) {
                setLibreViewInfo(libreViewService);
                const { error: connectionError } = await getLibreViewConnections();
                if (connectionError) {
                    setLibreViewStatus('linked_but_expired');
                } else {
                    setLibreViewStatus('linked_and_active');
                }
            } else {
                setLibreViewStatus('unlinked');
            }
        };
        checkServiceStatus();

        if (location.state?.message) {
            setLibreViewMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        fetchAccessCode();
    }, []);

    /**
     * @function handleRefreshSession
     * @summary Refreshes the LibreView session.
     */
    const handleRefreshSession = async () => {
        setLibreViewLoading(true);
        setLibreViewMessage('Sessie vernieuwen...');
        const { error } = await refreshLibreViewSession();
        if (error) {
            setLibreViewMessage('Kon sessie niet vernieuwen. Probeer opnieuw te koppelen.');
        } else {
            window.location.reload();
        }
        setLibreViewLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="services-page-container">
                <header className="services-header">
                    <h1>Services & Toegang</h1>
                    <p>Beheer hier uw externe koppelingen en deel uw data veilig.</p>
                </header>

                <main className="services-grid">
                    <div className="service-card">
                        <h3 className="service-card-title">Handmatige Upload</h3>
                        <p className="service-card-description">Importeer handmatig uw glucosegegevens via een CSV-bestand.</p>
                        <GlucoseUpload />
                    </div>

                    <div className="service-card">
                        <h3 className="service-card-title">Data Export</h3>
                        <p className="service-card-description">Exporteer al uw opgeslagen glucosemetingen naar een CSV-bestand.</p>
                        <button onClick={handleExportData} disabled={exporting} className="btn btn--primary mt-4">
                            {exporting ? 'Bezig met exporteren...' : 'Exporteer Glucose Data'}
                        </button>
                        {exportError && <p className="error-text mt-3">{exportError}</p>}
                    </div>

                    <div className="service-card access-management-card">
                        <h3 className="service-card-title">Deel Toegang met Zorgverlener</h3>
                        <p className="service-card-description">Genereer een unieke code om uw zorgverlener of voogd alleen-lezen toegang te geven tot uw dashboard.</p>
                        {loadingCode ? <p>Toegangscode laden...</p> : errorCode ? <p className="error-text">{errorCode}</p> : (
                            <>
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
                                    ) : <p>Er is nog geen code gegenereerd.</p>}
                                </div>
                                <button onClick={generateAccessCode} disabled={loadingCode} className="btn btn--primary">
                                    {accessCode ? 'Genereer Nieuwe Code' : 'Genereer Toegangscode'}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="service-card libreview-card">
                        <h3 className="service-card-title">LibreView Koppeling</h3>
                        <p className="service-card-description">Koppel uw LibreView-account om uw glucosemetingen automatisch te synchroniseren.</p>
                        {libreViewMessage && <p className="info-message">{libreViewMessage}</p>}
                        
                        {libreViewStatus === 'loading' && <p>Verbindingsstatus controleren...</p>}

                        {libreViewStatus === 'linked_and_active' && (
                            <div className="libreview-status">
                                <p>Status: <span className="status-dot connected"></span>Verbonden</p>
                                {libreViewInfo?.email && <p className="small text-300">Gekoppeld aan: <strong>{libreViewInfo.email}</strong></p>}
                                {libreViewInfo?.lastSync && <p className="small text-300">Laatste sync: {new Date(libreViewInfo.lastSync).toLocaleString('nl-NL')}</p>}
                                <Link to="/service-hub/libreview-login" className="btn btn--outline mt-4">Beheer Koppeling</Link>
                            </div>
                        )}

                        {libreViewStatus === 'linked_but_expired' && (
                            <div className="libreview-status">
                                <p>Status: <span className="status-dot warning"></span>Sessie Verlopen</p>
                                <p className="small text-300">Uw sessie is verlopen. Vernieuw de sessie om de synchronisatie te hervatten.</p>
                                <button onClick={handleRefreshSession} disabled={libreViewLoading} className="btn btn--primary mt-4">
                                    {libreViewLoading ? 'Bezig...' : 'Sessie Vernieuwen'}
                                </button>
                            </div>
                        )}

                        {libreViewStatus === 'unlinked' && (
                            <div className="libreview-status">
                                <p>Status: <span className="status-dot disconnected"></span>Niet verbonden</p>
                                <button disabled className="btn btn--primary mt-4">
                                    Binnenkort
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Google Fit (Binnenkort)</h3>
                        <p className="service-card-description">Synchroniseer uw activiteits- en gezondheidsgegevens.</p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Samsung Health (Binnenkort)</h3>
                        <p className="service-card-description">Synchroniseer uw activiteits- en gezondheidsgegevens.</p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Dexcom (Binnenkort)</h3>
                        <p className="service-card-description">Importeer uw CGM data direct.</p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ServiceHubPage;
