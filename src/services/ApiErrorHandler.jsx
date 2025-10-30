/**
 * ApiErrorHandler.jsx - Centralized error handling for API responses.
 */

/**
 * @function parseApiErrorMessage
 * @summary Parses various API error response formats to return a user-friendly message.
 * @param {any} responseData - The `error.response.data` from Axios.
 * @returns {string} A user-friendly error message.
 */
const parseApiErrorMessage = (responseData) => {
    if (!responseData) {
        return 'An unexpected server error occurred.';
    }
    if (responseData.message && typeof responseData.message === 'string') {
        return responseData.message;
    }
    if (typeof responseData === 'object') {
        const firstError = Object.values(responseData)[0];
        if (typeof firstError === 'string') {
            return firstError;
        }
    }
    if (typeof responseData === 'string') {
        return responseData;
    }
    return 'An unexpected server error occurred.';
};

/**
 * @function handleApiError
 * @summary Centralized function to process Axios errors and return a structured error object.
 * @param {Error} error - The error object from the catch block.
 * @returns {{ message: string, status: number|null }}
 */
export const handleApiError = (error) => {
    if (error.response) {
        console.error("API Error:", error.response.data);
        const message = parseApiErrorMessage(error.response.data);
        return { message, status: error.response.status };
    } else if (error.request) {
        console.error("Network Error:", error.request);
        return { message: 'Network error. Please check your connection.', status: null };
    } else {
        console.error("Setup Error:", error.message);
        return { message: error.message, status: null };
    }
};
