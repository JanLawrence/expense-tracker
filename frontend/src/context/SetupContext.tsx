"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

// Define types based on your Prisma model
interface PaySchedule {
  schedule: string; // bi-monthly, monthly, weekly, daily, bi-weekly
  incomePerSchedule: number;
}

interface Avatar {
  url: string;
}

// Define the setup status interface
interface UserSetupStatus {
  isComplete: boolean;
  hasStartingMoney: boolean;
  hasPaySchedule: boolean;
  hasCategories: boolean;
}

// Define context type
interface SetupContextType {
  setupStatus: UserSetupStatus;
  isLoading: boolean;
  error: string | null;
  checkSetupStatus: () => Promise<void>;
  updateStartingMoney: (amount: number) => Promise<boolean>;
  updatePaySchedule: (schedule: PaySchedule) => Promise<boolean>;
  updateCategories: (completed: boolean) => Promise<boolean>;
  completeSetup: () => Promise<boolean>;
  showSetupModal: boolean;
  setShowSetupModal: (show: boolean) => void;
}

// Create the context
const SetupContext = createContext<SetupContextType | undefined>(undefined);

// Default setup status
const defaultSetupStatus: UserSetupStatus = {
  isComplete: false,
  hasStartingMoney: false,
  hasPaySchedule: false,
  hasCategories: false,
};

// Provider component
export function SetupProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [setupStatus, setSetupStatus] = useState<UserSetupStatus>(defaultSetupStatus);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  // Check setup status from API
  const checkSetupStatus = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get current user data
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();

      // Determine setup status based on user data
      const newStatus = {
        hasStartingMoney: userData.startingMoney > 0,
        hasPaySchedule: !!userData.paySchedule,
        hasCategories: Array.isArray(userData.paymentMode) && userData.paymentMode.length > 1, // Assuming there's already the default Cash payment mode
        isComplete: false,
      };
      
      // Set overall completion status
      newStatus.isComplete = newStatus.hasStartingMoney && newStatus.hasPaySchedule && newStatus.hasCategories;
      
      console.log('Setup status:', newStatus);
      setSetupStatus(newStatus);
      
      // Show setup modal if setup is not complete
      if (!newStatus.isComplete) {
        setShowSetupModal(true);
      }
      
    } catch (err) {
      console.error('Error checking setup status:', err);
      // If API request fails, check localStorage as fallback
      const setupData = localStorage.getItem('userSetup');
      
      if (setupData) {
        try {
          const savedStatus = JSON.parse(setupData);
          setSetupStatus(savedStatus);
          
          if (!savedStatus.isComplete) {
            setShowSetupModal(true);
          }
        } catch (e) {
          console.error('Failed to parse setup data from localStorage');
          setShowSetupModal(true);
        }
      } else {
        // No saved status, show the modal
        setShowSetupModal(true);
      }
      
      setError(err instanceof Error ? err.message : 'Failed to check setup status');
    } finally {
      setIsLoading(false);
    }
  };

  // Update starting money
  const updateStartingMoney = async (amount: number) => {
    if (!isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/users/starting-money`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startingMoney: amount }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update starting money');
      }
      
      const newStatus = {
        ...setupStatus,
        hasStartingMoney: true,
      };
      
      setSetupStatus(newStatus);
      
      // Save to localStorage as a fallback
      localStorage.setItem('userSetup', JSON.stringify(newStatus));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update starting money');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update pay schedule
  const updatePaySchedule = async (schedule: PaySchedule) => {
    if (!isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paySchedule: {
            schedule: schedule.schedule,
            incomePerSchedule: schedule.incomePerSchedule
          },
          income: schedule.incomePerSchedule
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update pay schedule');
      }
      
      const newStatus = {
        ...setupStatus,
        hasPaySchedule: true,
      };
      
      setSetupStatus(newStatus);
      
      // Save to localStorage as a fallback
      localStorage.setItem('userSetup', JSON.stringify(newStatus));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pay schedule');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update categories (payment modes)
  const updateCategories = async (completed: boolean) => {
    if (!isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // We don't necessarily need an API call here if the user chooses to add categories later
      const newStatus = {
        ...setupStatus,
        hasCategories: completed,
      };
      
      setSetupStatus(newStatus);
      
      // Save to localStorage as a fallback
      localStorage.setItem('userSetup', JSON.stringify(newStatus));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update categories');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark setup as complete
  const completeSetup = async () => {
    if (!isAuthenticated || !user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newStatus = {
        ...setupStatus,
        isComplete: true,
      };
      
      setSetupStatus(newStatus);
      
      // Save to localStorage as a fallback
      localStorage.setItem('userSetup', JSON.stringify(newStatus));
      
      // Hide the modal
      setShowSetupModal(false);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check setup status when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      checkSetupStatus();
    }
  }, [isAuthenticated, user]);

  // Context value
  const value = {
    setupStatus,
    isLoading,
    error,
    checkSetupStatus,
    updateStartingMoney,
    updatePaySchedule,
    updateCategories,
    completeSetup,
    showSetupModal,
    setShowSetupModal,
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
}

// Custom hook to use the setup context
export function useSetupContext() {
  const context = useContext(SetupContext);
  
  if (context === undefined) {
    throw new Error('useSetupContext must be used within a SetupProvider');
  }
  
  return context;
}