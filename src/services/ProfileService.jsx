/**
 * ProfileService.jsx - Provides API services for managing user profiles.
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * @function getMyProfile
 * @summary Fetches the profile of the currently logged-in user.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getMyProfile() {
    try {
        const { data } = await apiClient.get('/profile/me');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function updateUserProfile
 * @summary Updates the profile of the currently logged-in user.
 * @param {object} profileData - The profile data to update.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function updateUserProfile(profileData) {
    try {
        const { data } = await apiClient.put('/profile/me', profileData);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function saveLibreViewCredentials
 * @summary Saves the user's LibreView login credentials for automatic synchronization.
 * @param {object} credentials - Object containing libreViewEmail and libreViewPassword.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function saveLibreViewCredentials({ libreViewEmail, libreViewPassword }) {
    try {
        const payload = { libreViewEmail, libreViewPassword };
        const { data } = await apiClient.put('/profile/me/services/libreview', payload);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
