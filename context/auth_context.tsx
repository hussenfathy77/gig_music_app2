// context/auth_context.tsx
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useEffect, useState } from "react";
import { authService } from "../services/auth_service";
import { ApiUser } from "@/services/api/apiTypes";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/services/api/config";

interface AuthContextType {
  token: string | null;
  user: ApiUser | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authService.login(credentials);
    setToken(data.access);
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh);
    const userData = await authService.getMe();
    setUser(userData);
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    await authService.register(userData);
    await login({ email: userData.email, password: userData.password });
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
