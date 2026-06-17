import axios, { isAxiosError } from 'axios';

export const TOKEN_STORAGE_KEY = 'dunelect_access_token';

export const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem('dunelect_username');
      sessionStorage.removeItem('dunelect_role');
      const path = window.location.pathname || '';
      if (!path.includes('login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }
  }
  return fallback;
}
