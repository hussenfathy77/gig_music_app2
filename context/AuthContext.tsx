import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { getStoredToken, saveToken, saveRefreshToken, clearTokens } from '../services/apiClient';

interface User {
  id: string | number;
  email: string;
  username: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getStoredToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (e: any) {
          const status = e?.response?.status;
          if (status === 401 || status === 403) {
            await clearTokens();
            setUser(null);
          } else {
            // Network error - don't clear token, just show no user
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      // Storage read error (shouldn't happen with safe wrapper)
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    const response = await authService.login({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    if (!response?.access) throw new Error('The server did not return an access token');

    await saveToken(response.access);
    if (response.refresh) await saveRefreshToken(response.refresh);

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      await clearTokens();
      setUser(null);
      throw error;
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    const payload = {
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };
    const response = await authService.register(payload);

    if (response?.access) {
      await saveToken(response.access);
      if (response.refresh) await saveRefreshToken(response.refresh);
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch {
        await clearTokens();
        setUser(null);
        throw new Error('Account was created, but the session could not be started. Please log in.');
      }
      return;
    }
    // The provided backend returns a user from register, not tokens.
    // Authenticate immediately so the app never navigates without a session.
    await login({ email: payload.email, password: payload.password });
  };

  const logout = async () => {
    await clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
