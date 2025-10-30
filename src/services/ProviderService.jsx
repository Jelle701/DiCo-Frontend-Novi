/**
 * ProviderService.jsx - Provides API services for provider-related operations, including patient linking and data retrieval.
 */
import apiClient from './ApiClient.jsx';
import { handleApiError } from './ApiErrorHandler.jsx';

/**
 * @function linkPatient
 * @summary Links a patient to the currently logged-in provider or guardian using an access code.
 * @param {string} accessCode - The patient's unique access code.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const linkPatient = async (accessCode) => {
    try {
        const response = await apiClient.post('/provider/link-patient', { accessCode });
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getLinkedPatients
 * @summary Fetches all patients linked to the currently logged-in provider or guardian.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getLinkedPatients = async () => {
    try {
        const response = await apiClient.get('/provider/patients');
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getPatientGlucoseMeasurements
 * @summary Fetches glucose measurements for a specific patient.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getPatientGlucoseMeasurements = async (patientId) => {
    try {
        const response = await apiClient.get(`/provider/patients/${patientId}/glucose-measurements`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getPatientDiabetesSummary
 * @summary Fetches the diabetes summary for a specific patient.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getPatientDiabetesSummary = async (patientId) => {
    try {
        const response = await apiClient.get(`/provider/patients/${patientId}/diabetes-summary`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getDelegateTokenForPatient
 * @summary Requests a temporary, delegated token for a specific patient.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<{data: {delegatedToken: string}|null, error: object|null}>}
 */
export const getDelegateTokenForPatient = async (patientId) => {
    try {
        const response = await apiClient.post(`/provider/patients/${patientId}/delegate-token`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getProviderDashboardSummary
 * @summary Fetches summary data for the provider dashboard.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getProviderDashboardSummary = async () => {
    try {
        const response = await apiClient.get('/provider/summary');
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};
