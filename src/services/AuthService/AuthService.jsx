/**
 * AuthService.jsx - Provides API services for user authentication and registration.
 */
import apiClient from '../ApiClient';
import { handleApiError } from '../ApiErrorHandler';

/**
 * @function registerUser
 * @summary Registers a new user with the provided registration data.
 * @param {object} registrationData - The registration details (email, password).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function registerUser(registrationData) {
    try {
        const { data } = await apiClient.post('/auth/register', registrationData);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function loginUser
 * @summary Logs in a user with the provided credentials.
 * @param {object} loginPayload - The login credentials (email, password).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function loginUser(loginPayload) {
    try {
        const payload = {
            username: loginPayload.email,
            password: loginPayload.password,
        };
        const { data } = await apiClient.post('/auth/login', payload);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * @function verifyEmail
 * @summary Verifies a user's email address using a provided token.
 * @param {object} verificationData - The verification details (token).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function verifyEmail(verificationData) {
    try {
        const { data } = await apiClient.post('/auth/verify', verificationData);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
