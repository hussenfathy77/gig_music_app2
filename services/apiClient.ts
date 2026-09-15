import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = 'https://musicapp-production-bcd8.up.railway.app/api';

// Support both token keys (legacy and new system)
const TOKEN_KEYS = ['access_token', 'music_app_access_token'];

export const getApiErrorMessage = (error: any, fallback = 'Request failed. Please try again.') => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.detail) return String(data.detail);
  if (data && typeof data === 'object') {
    return Object.entries(data)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
      .join('\n');
  }
  return error?.message || fallback;
};

// Safe SecureStore wrapper that falls back to in-memory on web
const safeGet = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
};

const safeSet = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
    // Also save to localStorage as backup on mobile
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  } catch {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }
};

const safeDel = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  } catch {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  for (const key of TOKEN_KEYS) {
    const token = await safeGet(key);
    if (token) return token;
  }
  return null;
};

const getStoredRefreshToken = () => safeGet('music_app_refresh_token');

export const saveToken = async (token: string): Promise<void> => {
  for (const key of TOKEN_KEYS) {
    await safeSet(key, token);
  }
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  await safeSet('music_app_refresh_token', token);
};

export const clearTokens = async (): Promise<void> => {
  for (const key of TOKEN_KEYS) {
    await safeDel(key);
  }
  // Also clear refresh tokens
  await safeDel('music_app_refresh_token');
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const authPath = ['/auth/login/', '/auth/register/', '/auth/refresh/'].some((path) =>
      config.url?.endsWith(path),
    );
    if (authPath) return config;
    const token = await getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRequest = ['/auth/login/', '/auth/register/', '/auth/refresh/'].some((path) =>
      original?.url?.endsWith(path),
    );
    if (error.response?.status === 401 && original && !original._retry && !isAuthRequest) {
      original._retry = true;
      const refresh = await getStoredRefreshToken();
      if (refresh) {
        try {
          const refreshResponse = await apiClient.post('/auth/refresh/', { refresh });
          await saveToken(refreshResponse.data.access);
          if (original.headers) original.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
          return apiClient(original);
        } catch {
          await clearTokens();
        }
      } else {
        await clearTokens();
      }
    }
    return Promise.reject(error);
  }
);
