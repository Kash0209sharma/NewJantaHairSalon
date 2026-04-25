const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const fallbackApiBaseUrl =
  typeof window !== 'undefined' && window.location.hostname.includes('github.io')
    ? 'https://new-janta-backend.onrender.com/api'
    : 'http://localhost:5000/api';

export const API_BASE_URL = (apiBaseUrl || fallbackApiBaseUrl).replace(/\/$/, '');

export function getApiBaseError() {
  return 'The booking backend is not configured for this deployment. Set VITE_API_BASE_URL to your live API URL and redeploy the frontend.';
}
