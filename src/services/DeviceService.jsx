/**
 * DeviceService.jsx - Provides API services for managing user devices.
 */
import apiClient from './ApiClient';

/**
 * @function getDevices
 * @summary Fetches a list of devices associated with the current user.
 * @returns {Promise<any>} A promise that resolves to the device data.
 */
export async function getDevices() {
    const { data } = await apiClient.get('/users/devices');
    return data;
}

export default { getDevices };
