/**
 * ApiClient.jsx - Configures and provides an Axios instance for making API requests.
 */
import axios from 'axios';

/**
 * @constant apiClient
 * @summary Configured Axios instance with base URL, headers, and interceptors for request and response handling.
 */
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

/**
 * Request Interceptor
 * @summary Adds authorization headers to outgoing requests.
 */
apiClient.interceptors.request.use(
    (config) => {
        const delegatedToken = sessionStorage.getItem('delegatedToken');
        if (delegatedToken) {
            config.headers['Authorization'] = `Bearer ${delegatedToken}`;
        } else {
            const userToken = localStorage.getItem('token');
            if (userToken) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        }
        console.log(`[API Request Interceptor] Request naar: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error("[API Request Interceptor] Fout bij opzetten van de request:", error);
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * @summary Logs API responses and handles errors.
 */
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API Response Interceptor] Response van: ${response.config.method.toUpperCase()} ${response.config.url}`, { status: response.status });
        return response;
    },
    (error) => {
        console.error(`[API Response Interceptor] Fout van: ${error.config.method.toUpperCase()} ${error.config.url}`, { error: error.response });
        return Promise.reject(error);
    }
);

export default apiClient;
