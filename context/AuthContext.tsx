import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        const userData = await authService.getMe();
        setUser(userData);
      }
    } catch (e) {
      console.warn('Failed to load user: token might be expired or invalid');
      await SecureStore.deleteItemAsync('access_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: any) => {
    const response = await authService.login(data);
    if (response.access) {
      await SecureStore.setItemAsync('access_token', response.access);
      await loadUser();
    }
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    if (response.access) {
      await SecureStore.setItemAsync('access_token', response.access);
      await loadUser();
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
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
