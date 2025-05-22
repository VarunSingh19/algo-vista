'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api';

// Define types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl: string;
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
    personalSite: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  mergeGuestProgress: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await apiClient.getCurrentUser();
        setUser(data);
      } catch (err) {
        // User is not authenticated, that's okay
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.login({ email, password });
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.register({ name, email, password });
      setUser(data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.updateUser(userData);
      setUser(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Merge guest progress
  const mergeGuestProgress = async () => {
    if (!user) return;

    // Check localStorage for guest progress
    const localStorageKeys = Object.keys(localStorage);
    const progressKeys = localStorageKeys.filter(key => key.startsWith('progress:'));

    // For each sheet with guest progress
    for (const key of progressKeys) {
      try {
        // Get sheet ID from key
        const sheetId = key.split(':')[1];

        // Get completed problems
        const completedProblems = JSON.parse(localStorage.getItem(key) || '[]');

        // For each completed problem, toggle in the database
        for (const problemId of completedProblems) {
          await apiClient.toggleProblem({ sheetId, problemId });
        }

        // Clear localStorage after merging
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error merging guest progress:', error);
      }
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    mergeGuestProgress
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
