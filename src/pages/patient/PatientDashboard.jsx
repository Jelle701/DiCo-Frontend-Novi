/**
 * PatientDashboard.jsx - Displays a dashboard for patients, including glucose data upload and summaries.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { getMyGlucoseData } from '../../services/DataService.jsx';
import GlucoseUpload from '../../components/GlucoseUpload/GlucoseUpload.jsx';

/**
 * @function PatientDashboard
 * @summary Main component for the patient dashboard, handling glucose data display and upload.
 */
const PatientDashboard = () => {
    const [glucoseData, setGlucoseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * @function fetchGlucoseData
     * @summary Fetches the current user's glucose data.
     */
    const fetchGlucoseData = useCallback(async () => {
        setLoading(true);
        const { data, error: apiError } = await getMyGlucoseData();
        if (apiError) {
            setError(apiError.message || 'Kon data niet ophalen.');
        } else {
            setGlucoseData(data || []);
            setError(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchGlucoseData();
    }, [fetchGlucoseData]);

    /**
     * @function handleUploadSuccess
     * @summary Callback function to re-fetch glucose data after a successful upload.
     */
    const handleUploadSuccess = () => {
        fetchGlucoseData();
    };

    return (
        <div className="container">
            <div className="section">
                <h1 className="mb-5">Patiëntendashboard</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="card mb-6">
                            <h2 className="card-title">Glucose Grafiek</h2>
                            {loading && <p>Grafiek wordt geladen...</p>}
                            {!loading && !error && <p>{glucoseData.length} metingen beschikbaar voor de grafiek.</p>}
                            {error && <p className="form-error">{error}</p>}
                        </div>
                        <div className="card">
                             <h2 className="card-title">Samenvatting</h2>
                             {loading && <p>Samenvatting wordt geladen...</p>}
                             {!loading && !error && <p>Samenvatting van {glucoseData.length} metingen.</p>}
                        </div>
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="card">
                            <h2 className="card-title">Nieuwe Data Uploaden</h2>
                            <GlucoseUpload onUploadSuccess={handleUploadSuccess} />
                        </div>
                        <div className="card">
                            <h2 className="card-title">Recente Metingen</h2>
                            {loading && <p>Recente metingen worden geladen...</p>}
                            {!loading && !error && (
                                glucoseData.length > 0 ? (
                                    <ul>
                                        {glucoseData.slice(0, 5).map(d => <li key={d.id}>{d.value} mg/dL op {new Date(d.timestamp).toLocaleTimeString()}</li>)}
                                    </ul>
                                ) : <p>Geen data.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
