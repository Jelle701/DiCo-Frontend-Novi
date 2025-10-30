/**
 * AdminService.jsx - Provides API services for administrative operations.
 */
import apiClient from './ApiClient';

/**
 * @function getAllUsers
 * @summary Fetches all user profiles from the backend.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/admin/users');
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        return { data: null, error: { message: errorMessage, original: error } };
    }
};

/**
 * @function updateUserById
 * @summary Updates a user's profile by their ID.
 * @param {number} userId - The ID of the user to update.
 * @param {object} updatedData - The data to update.
 * @returns {Promise<{data: any, error: any}>}
 */
export const updateUserById = async (userId, updatedData) => {
    try {
        const response = await apiClient.put(`/admin/users/${userId}`, updatedData);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        return { data: null, error: { message: errorMessage, original: error } };
    }
};

/**
 * @function deleteUserById
 * @summary Deletes a user by their ID.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<{data: any, error: any}>}
 */
export const deleteUserById = async (userId) => {
    try {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        return { data: null, error: { message: errorMessage, original: error } };
    }
};

/**
 * @function getRecentActivities
 * @summary Fetches recent administrative activities from the backend.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getRecentActivities = async () => {
    try {
        const response = await apiClient.get('/admin/activities');
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        return { data: null, error: { message: errorMessage, original: error } };
    }
};

/**
 * @function deleteGlucoseDataForUser
 * @summary Deletes all glucose data for a specific user.
 * @param {number} userId - The ID of the user whose glucose data should be deleted.
 * @returns {Promise<{data: any, error: any}>}
 */
export const deleteGlucoseDataForUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/admin/users/${userId}/glucose-data`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        return { data: null, error: { message: errorMessage, original: error } };
    }
};
