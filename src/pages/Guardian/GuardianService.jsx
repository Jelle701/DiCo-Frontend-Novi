/**
 * GuardianService.jsx - Provides API services for guardian-related operations.
 */
import apiClient from '../../services/ApiClient.jsx';
import { handleApiError } from '../../services/ApiErrorHandler.jsx';

/**
 * @function getLinkedPatientsForGuardian
 * @summary Fetches profiles of all patients linked to the logged-in guardian.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getLinkedPatientsForGuardian = async () => {
    try {
        const response = await apiClient.get('/guardian/linked-patients');
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function linkPatientByCode
 * @summary Links a patient to the logged-in guardian using an access code.
 * @param {string} accessCode - The patient's unique access code.
 * @returns {Promise<{data: any, error: any}>}
 */
export const linkPatientByCode = async (accessCode) => {
    try {
        const response = await apiClient.post('/guardian/link-patient', { accessCode });
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * @function getGlucoseMeasurementsForPatient
 * @summary Fetches glucose measurements for a specific patient linked to the guardian.
 * @param {number} patientId - The ID of the patient.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getGlucoseMeasurementsForPatient = async (patientId) => {
    try {
        const response = await apiClient.get(`/guardian/linked-patients/${patientId}/glucose-measurements`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};
