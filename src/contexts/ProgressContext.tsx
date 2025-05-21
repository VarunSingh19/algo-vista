'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api';
import { useAuth } from './AuthContext';

// Define types
interface ProgressContextType {
  completedProblems: string[];
  loading: boolean;
  toggleProblem: (sheetId: string, problemId: string) => Promise<void>;
  isCompleted: (problemId: string) => boolean;
  completionPercentage: (totalProblems: number) => number;
}

// Create context
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Provider component
export function ProgressProvider({
  children,
  sheetId
}: {
  children: ReactNode;
  sheetId: string;
}) {
  const { user } = useAuth();
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch progress on initial load
  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);

      try {
        if (user) {
          // User is authenticated, fetch from API
          const { data } = await apiClient.getProgress(sheetId);
          setCompletedProblems(data.completedProblemIds || []);
        } else {
          // User is guest, fetch from localStorage
          const localProgress = localStorage.getItem(`progress:${sheetId}`);
          setCompletedProblems(localProgress ? JSON.parse(localProgress) : []);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        // If there's an error, initialize with empty array
        setCompletedProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [sheetId, user]);

  // Toggle problem completion
  const toggleProblem = async (sheetId: string, problemId: string) => {
    try {
      // Create new array based on current state
      const isCurrentlyCompleted = completedProblems.includes(problemId);
      let newCompletedProblems: string[] = [];

      if (isCurrentlyCompleted) {
        // Remove problem if already completed
        newCompletedProblems = completedProblems.filter(id => id !== problemId);
      } else {
        // Add problem if not completed
        newCompletedProblems = [...completedProblems, problemId];
      }

      // Update state immediately for responsive UI
      setCompletedProblems(newCompletedProblems);

      if (user) {
        // User is authenticated, update via API
        await apiClient.toggleProblem({ sheetId, problemId });
      } else {
        // User is guest, update localStorage
        localStorage.setItem(`progress:${sheetId}`, JSON.stringify(newCompletedProblems));
      }
    } catch (err) {
      console.error('Error toggling problem:', err);
      // Revert to previous state if error
      if (user) {
        const { data } = await apiClient.getProgress(sheetId);
        setCompletedProblems(data.completedProblemIds || []);
      }
    }
  };

  // Check if a problem is completed
  const isCompleted = (problemId: string) => {
    return completedProblems.includes(problemId);
  };

  // Calculate completion percentage
  const completionPercentage = (totalProblems: number) => {
    if (totalProblems === 0) return 0;
    return Math.round((completedProblems.length / totalProblems) * 100);
  };

  const contextValue: ProgressContextType = {
    completedProblems,
    loading,
    toggleProblem,
    isCompleted,
    completionPercentage
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}

// Custom hook for using the progress context
export function useProgress() {
  const context = useContext(ProgressContext);

  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return context;
}
