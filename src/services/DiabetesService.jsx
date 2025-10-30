/**
 * DiabetesService.jsx - Provides API services for retrieving diabetes-related summaries.
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * @function getDiabetesSummary
 * @summary Fetches the diabetes summary for the currently logged-in user or delegated patient.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getDiabetesSummary = async () => {
    try {
        const response = await apiClient.get('/diabetes/summary');
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getDiabetesSummaryForPatient
 * @summary Fetches the diabetes summary for a specific patient by ID.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getDiabetesSummaryForPatient = async (patientId) => {
    try {
        const response = await apiClient.get(`/diabetes/summary/patient/${patientId}`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};
