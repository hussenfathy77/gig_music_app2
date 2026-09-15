import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN_KEY, API_BASE_URL, REFRESH_TOKEN_KEY } from "./config";

type ApiOptions = RequestInit & { skipAuth?: boolean };

const readError = async (response: Response) => {
  const body = await response.json().catch(() => null);
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.message === "string") return body.message;
  if (body && typeof body === "object") return Object.values(body).flat().join(" ");
  return `Request failed (${response.status})`;
};

const request = async <T>(path: string, options: ApiOptions = {}, retried = false): Promise<T> => {
  const { skipAuth, headers, ...init } = options;
  const accessToken = skipAuth ? null : await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 && !skipAuth && !retried) {
    const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const legacyRefresh = await SecureStore.getItemAsync('music_app_refresh_token');
    const refreshToken = refresh || legacyRefresh;
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (refreshResponse.ok) {
        const tokens = (await refreshResponse.json()) as { access: string };
        // Save to both keys for cross-compatibility
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access);
        await SecureStore.setItemAsync('access_token', tokens.access);
        return request<T>(path, options, true);
      }
    }
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync('access_token');
  }

  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const apiClient = {
  get: <T>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
};
