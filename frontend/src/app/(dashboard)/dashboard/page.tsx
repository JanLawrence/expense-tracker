"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuthContext();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Finance Tracker</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">
                {user?.firstName || 'User'}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {greeting}, {user?.firstName || 'User'}!
          </h2>
          <p className="text-gray-600">Here's an overview of your finances.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Current Balance</h3>
            <p className="text-3xl font-bold text-green-600">$5,240.00</p>
            <p className="text-sm text-gray-500 mt-1">Updated today</p>
          </div>
          
          {/* Expense Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Monthly Expenses</h3>
            <p className="text-3xl font-bold text-red-600">$2,190.00</p>
            <p className="text-sm text-gray-500 mt-1">April 2025</p>
          </div>
          
          {/* Income Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Monthly Income</h3>
            <p className="text-3xl font-bold text-blue-600">$7,500.00</p>
            <p className="text-sm text-gray-500 mt-1">April 2025</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Transactions</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 18, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Grocery Store</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Food</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$85.32</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Salary Deposit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Income</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$3,750.00</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 12, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Restaurant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dining</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$54.20</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 10, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gas Station</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transportation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$45.78</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 5, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Online Shopping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shopping</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$129.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}