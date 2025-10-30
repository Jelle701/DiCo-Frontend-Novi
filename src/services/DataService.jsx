/**
 * DataService.jsx - Provides API services for glucose data management.
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * @function uploadGlucoseData
 * @summary Uploads a CSV file containing glucose data.
 * @param {File} file - The CSV file to upload.
 * @param {function} onUploadProgress - Callback for upload progress tracking.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function uploadGlucoseData(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        };
        const { data } = await apiClient.post('/data/upload/glucose', formData, config);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function getMyGlucoseData
 * @summary Fetches recent glucose data for the logged-in user.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getMyGlucoseData() {
    try {
        const { data } = await apiClient.get('/data/my-glucose-data');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function getAllMyGlucoseData
 * @summary Fetches all glucose data for the logged-in user, typically for export.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getAllMyGlucoseData() {
    try {
        const { data } = await apiClient.get('/data/my-glucose-data/all');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
