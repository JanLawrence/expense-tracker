"use client";

import { useState } from 'react';

// Types for auth functions
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  contactNo: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
  userId?: string;
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      return null;
    }
  };
  
  // Register function
  const register = async (userData: RegisterData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      return null;
    }
  };
  
  // Forgot password function
  const forgotPassword = async (email: string): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      return null;
    }
  };
  
  // Reset password function
  const resetPassword = async (token: string, newPassword: string): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Reset failed');
      }
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      return null;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  // Get current user
  const getCurrentUser = (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          return null;
        }
      }
    }
    return null;
  };
  
  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') !== null;
    }
    return false;
  };

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    getCurrentUser,
    isAuthenticated,
    loading,
    error,
  };
}

export type { LoginCredentials, RegisterData, User, AuthResponse };