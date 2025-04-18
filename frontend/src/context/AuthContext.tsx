"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Define types for our context
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage on initial mount
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('user');
        }
      }
    }
  }, []);

  // Handle route protection - separate from the login state
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    console.log('AuthContext: Current pathname:', pathname);
    
    const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname || '');
    console.log('AuthContext: Is auth route:', isAuthRoute);
    
    const token = localStorage.getItem('token');
    console.log('AuthContext: Token exists:', !!token);
    
    // Only perform redirects if we have a pathname (protection against undefined)
    if (pathname) {
      // Redirect authenticated users away from auth routes
      if (token && isAuthRoute) {
        console.log('AuthContext: Redirecting to dashboard...');
        router.push('/dashboard');
      }
      
      // Redirect unauthenticated users away from protected routes
      if (!token && !isAuthRoute && pathname !== '/') {
        console.log('AuthContext: Redirecting to login...');
        router.push('/login');
      }
    }
  }, [pathname, router, user]); // Add user to ensure it runs after login

  // Login function
  const handleLogin = async (credentials: { email: string; password: string }) => {
    const result = await auth.login(credentials);
    
    console.log('AuthContext: Login result:', result);
    
    if (result && result.user) {
      console.log('AuthContext: Setting user state:', result.user);
      setUser(result.user);
      
      // Manual redirect after successful login for guaranteed navigation
      console.log('AuthContext: Manual redirect to dashboard');
      router.push('/dashboard');
    }
    
    return result;
  };

  // Logout function
  const handleLogout = () => {
    auth.logout();
    setUser(null);
    console.log('AuthContext: Logged out, redirecting to login');
    router.push('/login');
  };

  // Create the context value
  const value = {
    user,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    loading: auth.loading,
    error: auth.error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}