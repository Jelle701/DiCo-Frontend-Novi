/**
 * GlucoseService.jsx - Provides API services for managing glucose measurements.
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * @function getRecentGlucoseMeasurements
 * @summary Fetches recent glucose measurements (last 90 days) from the backend.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
export async function getRecentGlucoseMeasurements() {
    try {
        const { data } = await apiClient.get('/glucose');
        return { data, error: null };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * @function addGlucoseMeasurement
 * @summary Adds a new manual glucose measurement to the backend.
 * @param {{value: number, timestamp: string, source: string}} measurementData - The new measurement, including its source.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function addGlucoseMeasurement(measurementData) {
    try {
        const { data } = await apiClient.post('/glucose', measurementData);
        return { data, error: null };
    } catch (error) {
        return handleApiError(error);
    }
}
