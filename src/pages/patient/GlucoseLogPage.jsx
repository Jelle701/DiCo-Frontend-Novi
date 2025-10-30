/**
 * GlucoseLogPage.jsx - Allows users to manually log glucose measurements and view recent entries.
 */
import React, { useState, useEffect } from 'react';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService.jsx';
import './GlucoseLogPage.css';

/**
 * @function getCurrentDate
 * @summary Returns the current date in YYYY-MM-DD format.
 */
const getCurrentDate = () => new Date().toISOString().slice(0, 10);

/**
 * @function getCurrentTime
 * @summary Returns the current time in HH:MM format.
 */
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

/**
 * @function GlucoseLogPage
 * @summary Component for logging new glucose measurements and displaying a list of past measurements.
 */
const GlucoseLogPage = () => {
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    const [formState, setFormState] = useState({
        value: '',
        date: getCurrentDate(),
        time: getCurrentTime(),
    });

    /**
     * @function fetchMeasurements
     * @summary Fetches recent glucose measurements from the service.
     */
    const fetchMeasurements = async () => {
        setLoading(true);
        const { data, error: fetchError } = await getRecentGlucoseMeasurements();
        if (fetchError) {
            setError(fetchError.message);
        } else {
            setMeasurements(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    /**
     * @function handleFormChange
     * @summary Updates form state on input change.
     */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    /**
     * @function handleFormSubmit
     * @summary Handles submission of new glucose measurement, validates input, and updates data.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formState.value || formState.value <= 0) {
            setFormError('Glucosewaarde moet een positief getal zijn.');
            return;
        }

        const timestamp = new Date(`${formState.date}T${formState.time}`).toISOString();

        const payload = {
            value: parseFloat(formState.value),
            timestamp: timestamp,
        };

        const { data: newMeasurement, error: addError } = await addGlucoseMeasurement(payload);

        if (addError) {
            setFormError(addError.message);
        } else {
            setMeasurements(prev => [newMeasurement, ...prev]);
            setFormState({
                value: '',
                date: getCurrentDate(),
                time: getCurrentTime(),
            });
        }
    };

    /**
     * @function formatDate
     * @summary Formats an ISO date string into a localized date and time string.
     */
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container pt-6 pb-6">
            <h1 className="text-center">Glucose Logboek</h1>

            <div className="log-container">
                <div className="card">
                    <h3>Nieuwe Meting Toevoegen</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="label" htmlFor="value">Glucosewaarde (mmol/L)</label>
                            <input
                                type="number"
                                id="value"
                                name="value"
                                value={formState.value}
                                onChange={handleFormChange}
                                step="0.1"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label" htmlFor="date">Datum</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formState.date}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label" htmlFor="time">Tijd</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formState.time}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        {formError && <p className="form-error">{formError}</p>}
                        <button type="submit" className="btn btn--primary w-100">Opslaan</button>
                    </form>
                </div>

                <div className="card">
                    <h3>Recente Metingen</h3>
                    {loading && <p className="empty-state">Metingen worden geladen...</p>}
                    {error && <p className="form-error">Fout: {error}</p>}
                    {!loading && measurements.length === 0 && (
                        <p className="empty-state">Je hebt nog geen metingen toegevoegd.</p>
                    )}
                    <div className="measurement-list-wrapper">
                        {measurements.map(m => (
                            <div key={m.id} className="detail-item">
                                <span className="detail-item__value">{m.value.toFixed(1)} mmol/L</span>
                                <span className="detail-item__label">{formatDate(m.timestamp)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlucoseLogPage;
