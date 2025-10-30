/**
 * LibreViewService.jsx - Provides API services for interacting with LibreView data.
 */
import apiClient from '../ApiClient';

/**
 * @function handleApiError
 * @summary Helper to return detailed error messages from API responses.
 */
const handleApiError = (error, endpoint) => {
    const errorMessage = error.response?.data?.message || `Actie op ${endpoint} mislukt.`;
    console.error(`[LibreViewService] Fout bij ${endpoint}:`, error.response || error.message);
    return { data: null, error: { message: errorMessage, status: error.response?.status, data: error.response?.data } };
};

/**
 * @function createLibreViewSession
 * @summary Creates a new LibreView session.
 */
export const createLibreViewSession = async (email, password) => {
    try {
        const response = await apiClient.post('/libre/login', { email, password });
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, '/libre/login');
    }
};

/**
 * @function invalidateLibreViewSession
 * @summary Invalidates the current LibreView session.
 */
export const invalidateLibreViewSession = async () => {
    try {
        const response = await apiClient.delete('/libre/session');
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, '/libre/session');
    }
};

/**
 * @function getFromLibreProxy
 * @summary Generic function to fetch data from LibreView via the backend proxy.
 */
const getFromLibreProxy = async (endpoint, session) => {
    if (!session?.token || !session?.accountIdHash) {
        return { data: null, error: { message: 'Geen geldige LibreView-sessie in de frontend state.' } };
    }

    try {
        const response = await apiClient.get(endpoint, {
            headers: {
                'X-LibreView-Token': session.token,
                'X-LibreView-AccountId': session.accountIdHash,
            }
        });
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, endpoint);
    }
};

/**
 * @function getLibreViewConnections
 * @summary Fetches LibreView connections.
 */
export const getLibreViewConnections = (session) => {
    return getFromLibreProxy('/libre/connections', session);
};

/**
 * @function getLibreViewGlucoseGraph
 * @summary Fetches LibreView glucose graph data.
 */
export const getLibreViewGlucoseGraph = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/graph`, session);
};

/**
 * @function getLibreViewGlucoseHistory
 * @summary Fetches LibreView glucose history data.
 */
export const getLibreViewGlucoseHistory = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/glucose/history`, session);
};

/**
 * @function getLibreViewDevices
 * @summary Fetches LibreView device data.
 */
export const getLibreViewDevices = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/devices`, session);
};

/**
 * @function getLibreViewFamily
 * @summary Fetches LibreView family data.
 */
export const getLibreViewFamily = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/family`, session);
};

/**
 * @function getLibreViewNotes
 * @summary Fetches LibreView notes.
 */
export const getLibreViewNotes = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/notes`, session);
};

/**
 * @function getLibreViewReportSettings
 * @summary Fetches LibreView report settings.
 */
export const getLibreViewReportSettings = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/report-settings`, session);
};

/**
 * @function getLibreViewAlarmSettings
 * @summary Fetches LibreView alarm settings.
 */
export const getLibreViewAlarmSettings = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/alarm-settings`, session);
};

/**
 * @function getLibreViewGlucoseTargets
 * @summary Fetches LibreView glucose targets.
 */
export const getLibreViewGlucoseTargets = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/glucose-targets`, session);
};

/**
 * @function getLibreViewPrescriptions
 * @summary Fetches LibreView prescriptions.
 */
export const getLibreViewPrescriptions = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/prescriptions`, session);
};

/**
 * @function importHistoricalLibreViewData
 * @summary Imports historical LibreView data.
 */
export const importHistoricalLibreViewData = async () => {
    try {
        const response = await apiClient.post('/libre/sync/historical');
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, '/libre/sync/historical');
    }
};
