/**
 * OnboardingService.jsx - Provides API services for submitting user onboarding data.
 */
import apiClient from './ApiClient';

/**
 * @function submitOnboardingProfile
 * @summary Submits the collected onboarding data to the backend to update user profile details.
 * @param {object} onboardingData - The data corresponding to the OnboardingRequestDto.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function submitOnboardingProfile(onboardingData) {
    try {
        const { data } = await apiClient.put('/profile/details', onboardingData);
        return { data, error: null };
    } catch (error) {
        console.error("API Error submitting onboarding data:", error.response?.data);
        return {
            data: null,
            error: {
                message: error.response?.data?.message || 'Failed to save onboarding data.',
                status: error.response?.status,
            },
        };
    }
}
