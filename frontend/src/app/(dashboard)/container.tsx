"use client";

import Sidebar from "@/components/UI/Menu/Sidebar";
import Navbar from "@/components/UI/Menu/Navbar";
import { Home, BanknoteArrowDown, Settings, Bell, ChartColumnStacked } from 'lucide-react';
import IconSidebar from "@/components/UI/Menu/IconSidebar";
import { useAuthContext } from '@/context/AuthContext';
import { useSetupContext } from '@/context/SetupContext';
import SetupModal from '@/components/SetupModal';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Container({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthContext();
  const { checkSetupStatus } = useSetupContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarItems = [
    { 
      icon: <Home size={24} />, 
      label: 'Dashboard', 
      href: '/dashboard', 
      active: pathname === '/dashboard'
    },
    { 
      icon: <BanknoteArrowDown size={22} />, 
      label: 'Expenses', 
      href: '/expenses', 
      active: pathname === '/expenses' || pathname.startsWith('/expenses/')
    },
    { 
      icon: <ChartColumnStacked size={22} />, 
      label: 'Categories', 
      href: '/category', 
      active: pathname === '/category' || pathname.startsWith('/category/')
    },
    // { icon: <Bell size={22} />, label: 'Notifications', href: '/notifications', badge: '5', active: pathname === '/notifications' }
  ];

  useEffect(() => {
    checkSetupStatus();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <SetupModal />
      <Navbar 
        userName={user ? `${user.firstName} ${user.lastName}` : ''}
        userEmail={user?.email || ''}
        onToggleSidebar={toggleSidebar}
        theme={theme}
        logout={logout}
      />
      
      <IconSidebar
        logo={<Image 
                className="rounded-full "
                src="/logo.jpg" // Path relative to the public directory
                alt="Logo"
                width={40}
                height={40}
              />}
        items={sidebarItems}
        theme={theme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-grow flex flex-col md:pl-16 pt-[var(--header-height)]">
        <main className="flex-grow bg-[var(--page-bg)]">
          <div className="container-fluid px-10 py-7">
            {children}
          </div>
        </main>
        
        <footer className={`mt-auto border-t py-4 px-4 lg:px-8 ${theme === 'dark' ? 'bg-[var(--page-bg-dark)] border-slate-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm">
              © 2025 Expense Tracker. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/terms" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Terms</Link>
              <Link href="/privacy" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Privacy</Link>
              <Link href="/help" className={`text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Help</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}