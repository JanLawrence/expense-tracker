"use client";

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { SetupProvider } from '@/context/SetupContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SetupProvider>
        {children}
      </SetupProvider>
    </AuthProvider>
  );
}