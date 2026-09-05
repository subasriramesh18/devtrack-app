'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { api, getToken, removeToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    handle?: string;
    company?: string;
    location?: string;
  }) => Promise<boolean>;
  loginAsDemoUser: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshUser = useCallback(async () => {
    const savedToken = getToken();
    if (!savedToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.auth.getMe();
      if (res.data) {
        setUser(res.data);
        setTokenState(savedToken);
      } else {
        removeToken();
        setUser(null);
        setTokenState(null);
      }
    } catch (err: any) {
      console.warn('Session verification failed, logging out locally', err);
      removeToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string = 'password123'): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.auth.login({ email, password });
      if (res.data?.user && res.data?.token) {
        setUser(res.data.user);
        setTokenState(res.data.token);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    handle?: string;
    company?: string;
    location?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.auth.register({
        ...userData,
        password: userData.password || 'password123',
      });
      if (res.data?.user && res.data?.token) {
        setUser(res.data.user);
        setTokenState(res.data.token);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoUser = async (email: string): Promise<boolean> => {
    return login(email, 'password123');
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setTokenState(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        loginAsDemoUser,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
