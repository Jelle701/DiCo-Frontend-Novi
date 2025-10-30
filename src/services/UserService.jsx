/**
 * UserService.jsx - Provides API services for user-related operations, such as managing linked services.
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * @function getUserServices
 * @summary Fetches the status of all linked services for the logged-in user.
 * @returns {Promise<{data: Array<object>|null, error: object|null}>}
 */
export async function getUserServices() {
    try {
        const { data } = await apiClient.get('/users/me/services');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function refreshLibreViewSession
 * @summary Requests the backend to refresh an expired LibreView session.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function refreshLibreViewSession() {
    try {
        const { data } = await apiClient.post('/libre/auth/refresh');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
