/**
 * DashboardPage.jsx - Displays a comprehensive dashboard for patients, including glucose charts, manual input, and diabetes summary.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/AuthContext.jsx';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService.jsx';
import { getDiabetesSummary } from '../../services/DiabetesService.jsx';
import { MeasurementSource } from '../../constants.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import './DashboardPage.css';
import Navbar from "../../components/web components/Navbar.jsx";
import DiabeticRapportValues from "../../components/DiabeticRapportValues.jsx";
import "../../components/DiabeticRapportValues.css";

const MS = {
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
};

const RANGE_LOW_MAX = 3.9;
const RANGE_HIGH_MIN = 10.0;
const RANGE_TOP = 20.0;

const TIMEZONE = 'Europe/Amsterdam';

const fmtTimeHM = new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
});
const fmtDayShort = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    timeZone: TIMEZONE,
});
const fmtDayNum = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'numeric',
    timeZone: TIMEZONE,
});
const fmtLongDay = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    timeZone: TIMEZONE,
});
const fmtDateTimeTable = new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
});

const getInitialDateTime = () => {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localISO = new Date(now.getTime() - tzOffsetMs).toISOString();
    return {
        date: localISO.slice(0, 10),
        time: localISO.slice(11, 16),
    };
};

const parseTimestampMs = (ts) => {
    if (ts == null) return NaN;

    const n = Number(ts);
    if (Number.isFinite(n)) {
        return n < 1e12 ? n * 1000 : n;
    }

    if (typeof ts === 'string') {
        const looksIsoNoTz = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?$/.test(ts)
            && !/[zZ]$/.test(ts)
            && !/[+\-]\d{2}:\d{2}$/.test(ts);
        if (looksIsoNoTz) return Date.parse(ts + 'Z');
        return Date.parse(ts);
    }

    return NaN;
};

const getStartDate = (range) => {
    const d = new Date();
    switch (range) {
        case '7d':   d.setDate(d.getDate() - 7); break;
        case '30d':  d.setMonth(d.getMonth() - 1); break;
        case '180d': d.setMonth(d.getMonth() - 6); break;
        case '24h':  d.setHours(d.getHours() - 24); break;
        case '6h':
        default:     d.setHours(d.getHours() - 6); break;
    }
    return d;
};

const getChartTitle = (range) => {
    const titles = {
        '6h': 'Glucoseverloop (laatste 6 uur)',
        '24h': 'Glucoseverloop (laatste 24 uur)',
        '7d': 'Glucoseverloop (laatste 7 dagen)',
        '30d': 'Glucoseverloop (laatste 30 dagen)',
        '180d': 'Glucoseverloop (laatste 6 maanden)',
    };
    return titles[range] || 'Glucoseverloop';
};

const timeTickFormatter = (timestamp, range) => {
    const d = new Date(timestamp);
    switch (range) {
        case '6h':
        case '24h': return fmtTimeHM.format(d);
        case '7d':  return fmtDayShort.format(d);
        case '30d':
        case '180d': return fmtDayNum.format(d);
        default:    return fmtDayShort.format(d);
    }
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const p0 = payload[0];
    const ts = p0?.payload?.timestamp;
    if (ts == null) return null;

    const d = new Date(ts);
    const value = Number(p0.value);

    return (
        <div className="custom-tooltip">
            <p className="custom-tooltip-value">
                {Number.isFinite(value) ? `${value.toFixed(1)} mmol/L` : '—'}
            </p>
            <p className="custom-tooltip-date">
                {fmtLongDay.format(d)}, {fmtTimeHM.format(d)}
            </p>
        </div>
    );
};

const makeTicks = (startMs, endMs, range) => {
    const ticks = [];
    const H = 60 * 60 * 1000;
    const D = 24 * H;

    const pushAsc = (arr) => arr.sort((a, b) => a - b);

    let step;
    switch (range) {
        case '6h':   step = 2 * H; break;
        case '24h':  step = 4 * H; break;
        case '7d':   step = D; break;
        case '30d':  step = 7 * D; break;
        case '180d': step = 30 * D; break;
        default:     step = 2 * H; break;
    }

    const arr = [endMs];
    for (let t = endMs - step; t >= startMs; t -= step) {
        arr.push(t);
    }

    if (arr[arr.length - 1] > startMs) arr.push(startMs);

    return pushAsc(arr);
};

const DashboardPage = () => {
    const { user, loading: userLoading } = useUser();

    const [glucoseData, setGlucoseData] = useState([]);
    const [rawMeasurements, setRawMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('6h');

    const [summaryData, setSummaryData] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState('');

    const isDelegatedView = !!sessionStorage.getItem('delegatedToken');
    const patientUsername = sessionStorage.getItem('patientUsername');

    const [formState, setFormState] = useState({ value: '', ...getInitialDateTime() });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await getRecentGlucoseMeasurements();
            setRawMeasurements(data || []);
        } catch (fetchError) {
            setError(fetchError.message || 'Kon metingen niet ophalen.');
            setRawMeasurements([]);
        } finally {
            setLoading(false);
        }

        setSummaryLoading(true);
        setSummaryError('');
        try {
            const { data, error: summaryApiError } = await getDiabetesSummary();
            if (summaryApiError) {
                setSummaryError(summaryApiError.message || 'Kon samenvatting niet ophalen.');
                setSummaryData(null);
            } else {
                setSummaryData(data);
            }
        } catch (fetchError) {
            setSummaryError(fetchError.message || 'Kon samenvatting niet ophalen.');
            setSummaryData(null);
        } finally {
            setSummaryLoading(false);
        }
    };

    useEffect(() => {
        if (isDelegatedView || user) {
            fetchAllData();
            if (!isDelegatedView) {
                const intervalId = setInterval(fetchAllData, 60_000);
                return () => clearInterval(intervalId);
            }
        }
    }, [user, isDelegatedView]);

    useEffect(() => {
        if (rawMeasurements.length === 0) {
            setGlucoseData([]);
            return;
        }
        const startMs = getStartDate(timeRange).getTime();
        const endMs = Date.now();

        const chartData = rawMeasurements
            .map(m => {
                const ts = parseTimestampMs(m.timestamp);
                return { value: Number(m.value), timestamp: ts, _raw: m };
            })
            .filter(p => Number.isFinite(p.timestamp) && p.timestamp >= startMs && p.timestamp <= endMs)
            .sort((a, b) => a.timestamp - b.timestamp);

        setGlucoseData(chartData);
    }, [rawMeasurements, timeRange]);


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');

        if (!formState.value || formState.value <= 0) {
            setFormError('Glucosewaarde moet een positief getal zijn.');
            return;
        }

        const timestamp = new Date(`${formState.date}T${formState.time}:00`).toISOString();
        const payload = {
            value: parseFloat(formState.value),
            timestamp,
            source: MeasurementSource.MANUAL_ENTRY,
        };

        try {
            await addGlucoseMeasurement(payload);
            setFormSuccess('Meting succesvol opgeslagen!');
            fetchAllData();
            setFormState({ value: '', ...getInitialDateTime() });
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (addError) {
            setFormError(addError.message || 'Kon meting niet opslaan.');
        }
    };

    const formatTableTimestamp = (ts) => {
        const ms = parseTimestampMs(ts);
        return Number.isFinite(ms) ? fmtDateTimeTable.format(new Date(ms)) : '—';
    };

    if (userLoading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-page"><h1 className="loading-message">Authenticatie controleren...</h1></div>
            </>
        );
    }

    const timeRangeOptions = [
        { key: '6h', label: '6U' },
        { key: '24h', label: '24U' },
        { key: '7d', label: '7D' },
        { key: '30d', label: '1M' },
        { key: '180d', label: '6M' },
    ];

    const chartDomainStart = getStartDate(timeRange).getTime();
    const chartDomainEnd = Date.now();
    const xTicks = makeTicks(chartDomainStart, chartDomainEnd, timeRange);


    const getTickCount = useCallback((range) => {
        switch (range) {
            case '6h': return 4;
            case '24h': return 6;
            case '7d': return 7;
            case '30d': return 5;
            case '180d': return 6;
            default: return 5;
        }
    }, []);
    const currentTickCount = getTickCount(timeRange);

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <header className="dashboard-header">
                    <h1>{isDelegatedView ? `Dashboard van ${patientUsername}` : `Welkom terug, ${user?.firstName || 'gebruiker'}!`}</h1>
                    <p>{isDelegatedView ? 'U bekijkt deze gegevens als zorgverlener of ouder/voogd.' : 'Hier is een overzicht van je recente activiteit en gegevens.'}</p>
                </header>

                <main className="dashboard-layout">
                    <div className="chart-container">
                        <div className="d-flex justify-between items-center mb-4">
                            <h2 className="mt-0 mb-0">{getChartTitle(timeRange)}</h2>
                            <div className="time-range-selector">
                                {timeRangeOptions.map(option => (
                                    <button
                                        key={option.key}
                                        onClick={() => setTimeRange(option.key)}
                                        className={timeRange === option.key ? 'active' : ''}
                                        aria-pressed={timeRange === option.key}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        {loading ? (
                            <p className="loading-message">Metingen laden...</p>
                        ) : (
                            glucoseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        data={glucoseData}
                                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />

                                        <XAxis
                                            type="number"
                                            dataKey="timestamp"
                                            domain={[chartDomainStart, chartDomainEnd]}
                                            ticks={xTicks}
                                            tickFormatter={(ts) => timeTickFormatter(ts, timeRange)}
                                            interval="preserveStartEnd"
                                            scale="time"
                                        />


                                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />

                                        <Tooltip content={<CustomTooltip />} isAnimationActive={false} animationDuration={0} />
                                        <Legend />

                                        <ReferenceArea
                                            y1={0}
                                            y2={RANGE_LOW_MAX}
                                            fill="rgba(255, 0, 38, 0.2)"
                                            strokeOpacity={0}
                                            ifOverflow="hidden"
                                        />
                                        <ReferenceArea
                                            y1={RANGE_HIGH_MIN}
                                            y2={RANGE_TOP}
                                            fill="rgba(255, 222, 0, 0.2)"
                                            strokeOpacity={0}
                                            ifOverflow="hidden"
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            name="Glucose"
                                            stroke="var(--color-teal)"
                                            strokeWidth={2}
                                            activeDot={{ r: 8, stroke: 'var(--color-teal)', fill: 'var(--color-white)' }}
                                            dot={false}
                                            isAnimationActive={false}
                                            animationDuration={0}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-placeholder">
                                    <p>Geen metingen in de geselecteerde periode.</p>
                                </div>
                            )
                        )}

                        {!isDelegatedView && (
                            <div className="quick-add-form">
                                <h3>Snelle Invoer</h3>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label htmlFor="value">Nieuwe Waarde (mmol/L)</label>
                                            <input
                                                type="number"
                                                id="value"
                                                name="value"
                                                value={formState.value}
                                                onChange={handleFormChange}
                                                step="0.1"
                                                required
                                                placeholder="bv. 6.5"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="date">Datum</label>
                                            <input
                                                type="date"
                                                id="date"
                                                name="date"
                                                value={formState.date}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="time">Tijd</label>
                                            <input
                                                type="time"
                                                id="time"
                                                name="time"
                                                value={formState.time}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {formError && <p className="form-error">{formError}</p>}
                                    {formSuccess && <p className="form-success">{formSuccess}</p>}

                                    <div className="d-flex justify-between items-center mt-4">
                                        <button type="submit" className="btn btn--primary">Nu Opslaan</button>
                                        <Link to="/service-hub" className="btn btn--outline">Gegevens Importeren</Link>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="measurements-table-container">
                            <h3>Alle Recente Metingen</h3>
                            {rawMeasurements.length > 0 ? (
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Waarde (mmol/L)</th>
                                            <th>Tijdstip</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {rawMeasurements.map((m) => (
                                            <tr key={m.id}>
                                                <td>{Number(m.value).toFixed(1)}</td>
                                                <td>{formatTableTimestamp(m.timestamp)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : !loading && (<p>Geen metingen om weer te geven.</p>)}
                        </div>
                    </div>

                    <div className="summary-container">
                        {summaryLoading ? (
                            <p className="loading-message">Samenvatting laden...</p>
                        ) : summaryError ? (
                            <p className="error-message">{summaryError}</p>
                        ) : summaryData ? (
                            <>
                                <DiabeticRapportValues data={summaryData} title="Uw Diabetes Samenvatting" />
                                <div className="summary-explanation">
                                    <h4>Uitleg van de Waardes</h4>
                                    <ul>
                                        <li><strong>HbA1c:</strong> Gemiddelde bloedglucose afgelopen 2–3 maanden (lab).</li>
                                        <li><strong>GMI:</strong> Schatting HbA1c o.b.v. ~90 dagen CGM.</li>
                                        <li><strong>Gemiddelde Glucose:</strong> Gemiddelden over 7 / 14 / 30 / 90 dagen.</li>
                                        <li><strong>Time in Range (TIR):</strong> % tijd binnen 3.9–10.0 mmol/L.</li>
                                        <li><strong>Variabiliteit (CV):</strong> Schommeling; ≤ 36% is gewenst.</li>
                                        <li><strong>Nuchter (FPG):</strong> Gemiddelde nuchtere glucose.</li>
                                        <li><strong>Na maaltijd (PPG):</strong> Gemiddelde postprandiale glucose.</li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p>Geen samenvattingsgegevens beschikbaar.</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default DashboardPage;
