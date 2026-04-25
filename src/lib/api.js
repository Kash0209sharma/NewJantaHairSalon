const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = apiBaseUrl?.replace(/\/$/, '') || '';

export function getApiBaseError() {
  return 'The booking backend is not configured for this deployment. Set VITE_API_BASE_URL to your live API URL and redeploy the frontend.';
}
