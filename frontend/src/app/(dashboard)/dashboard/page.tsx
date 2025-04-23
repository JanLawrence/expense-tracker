"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useSetupContext } from '@/context/SetupContext';
import SetupModal from '@/components/SetupModal';
import Skeleton from '@/components/UI/Feedback/Skeleton'
import Head from 'next/head';
import Link from 'next/link';
import Button from '@/components/UI/Button';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Home, 
  Layers, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Mail, 
  Calendar, 
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  DollarSign,
  ShoppingBag,
  Activity,
  Percent
} from 'lucide-react';

// Sample data for charts and tables
const revenueData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1398 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 3908 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 3800 },
  { month: 'Jul', amount: 4300 },
];

const recentOrders = [
  { id: '#ORD-7895', customer: 'John Doe', date: '01 Apr 2025', amount: '$125.99', status: 'Completed' },
  { id: '#ORD-7896', customer: 'Mary Smith', date: '01 Apr 2025', amount: '$75.00', status: 'Processing' },
  { id: '#ORD-7897', customer: 'Alex Johnson', date: '31 Mar 2025', amount: '$320.49', status: 'Pending' },
  { id: '#ORD-7898', customer: 'Sarah Williams', date: '30 Mar 2025', amount: '$159.99', status: 'Completed' },
  { id: '#ORD-7899', customer: 'Robert Brown', date: '30 Mar 2025', amount: '$49.99', status: 'Cancelled' },
];

export default function DashboardPage() {
  const { user, logout } = useAuthContext();
  const { checkSetupStatus } = useSetupContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Update your useEffect
  useEffect(() => {
    // Update loading state based on user data
    if (user) {
      setIsUserLoading(false);
    } else {
      setIsUserLoading(true);
    }
  }, [user]);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // Check setup status when dashboard loads
  useEffect(() => {
    checkSetupStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Setup Modal - Will automatically display if setup is incomplete */}
      <SetupModal />
      
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin Dashboard with Next.js and Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Rest of your dashboard code remains the same */}
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Your sidebar code remains unchanged */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Eyyy Tracker</span>
          </div>
          <button 
            className="p-1 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              {isUserLoading ? (
                <Skeleton variant="circular" width={20} height={20} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              {isUserLoading ? (
                <>
                  <Skeleton variant="text" width={100} height={16} className="mb-1" />
                  <Skeleton variant="text" width={40} height={12} />
                </>
              ) : (
                <>
                  <h3 className="font-medium">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</h3>
                  <p className="text-xs text-gray-400">User</p>
                </>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            {/* Your navigation remains unchanged */}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen`}>
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button 
              className="p-2 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center border rounded-md px-3 py-1 flex-1 max-w-xl mx-4">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-2 py-1 focus:outline-none"
              />
            </div>
            <Button onClick={() => console.log('Button clicked')}>
              Click Me
            </Button>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {isUserLoading ? (
                      <Skeleton variant="circular" width={8} height={8} />
                    ) : (
                      <span>{user?.firstName?.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  {isUserLoading ? (
                    <Skeleton variant="text" width={40} height={16} className="hidden md:inline" />
                  ) : (
                    <span className="hidden md:inline">{user?.firstName || 'Admin'}</span>
                  )}
                  <ChevronDown size={16} />
                </button>

                {/* User dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-10">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={16} className="inline mr-2" />
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings size={16} className="inline mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* The rest of your main content remains unchanged */}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2025 MetroNext Admin. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">Help</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}