'use client';

// AuthContext provides lightweight client-side authentication state and helpers around the shared API client.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/app/lib/api-client';
import type { User, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/app/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await apiClient.get<User>('/auth/me');
        setUser(userData);
      } catch (error) {
        apiClient.clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials, {
      skipAuth: true,
    });

    apiClient.setToken(response.access_token);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data, {
      skipAuth: true,
    });

    apiClient.setToken(response.access_token);
    setUser(response.user);
  };

  const logout = (): void => {
    apiClient.clearToken();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await apiClient.get<User>('/auth/me');
      setUser(userData);
    } catch (error) {
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
