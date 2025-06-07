"use client";

import React, { useState, useEffect } from "react";
import Card from '@/components/UI/Card';
import Button from "@/components/UI/Button";
import OffCanvas from '@/components/UI/OffCanvas';
import SearchableSelector, { SelectOption } from '@/components/UI/SearchableSelector';
import { useCurrency } from '@/hooks/useCurrency';

// Expense interface matching your Prisma model
interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  paymentModeId: number;
  description: string;
  remarks: string | '';
  amount: number;
  shareAmount: number | null;
  isShared: boolean;
  showOnReport: boolean;
  isPaidShared: boolean;
  date: string;
  isRecurring: boolean;
  recurringStartDate: string | null;
  recurringEndDate: string | null;
  recurringFrequency: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: {
    id: number;
    name: string;
    color: string | null;
  };
  paymentMode: {
    id: number;
    name: string;
    type: string;
    color: string | null;
  };
}

// Category and PaymentMode for dropdowns
interface Category {
  id: number;
  name: string;
  color: string | null;
}

interface PaymentMode {
  id: number;
  name: string;
  type: string;
  color: string | null;
}

// Pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Recurring frequency options
const recurringFrequencyOptions: SelectOption[] = [
  { value: 'DAILY', label: 'Daily', description: 'Every day' },
  { value: 'WEEKLY', label: 'Weekly', description: 'Every week' },
  { value: 'MONTHLY', label: 'Monthly', description: 'Every month' },
  { value: 'YEARLY', label: 'Yearly', description: 'Every year' }
];

export default function ExpensesPage() {
  const { formatAmount } = useCurrency();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPaymentMode, setFilterPaymentMode] = useState<string>('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Form state
  const [formData, setFormData] = useState({
    categoryId: '',
    paymentModeId: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    isShared: false,
    shareAmount: '',
    isPaidShared: false,
    remarks: '',
    isRecurring: false,
    recurringStartDate: '',
    recurringEndDate: '',
    recurringFrequency: '',
    showOnReport: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Load initial data
  useEffect(() => {
    loadExpenses();
    loadCategories();
    loadPaymentModes();
  }, [pagination.page, pagination.limit, sortBy, sortOrder]);

  // Load expenses from API
  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
        order: sortOrder
      });

      const response = await fetch(`${API_URL}/expenses?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      setExpenses(data.expenses);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      setErrors({ load: 'Failed to load expenses. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // Load payment modes
  const loadPaymentModes = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/payment-modes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentModes(data);
      }
    } catch (error) {
      console.error('Failed to load payment modes:', error);
    }
  };

  // Filter expenses locally (for search)
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || expense.categoryId.toString() === filterCategory;
    const matchesPaymentMode = !filterPaymentMode || expense.paymentModeId.toString() === filterPaymentMode;
    return matchesSearch && matchesCategory && matchesPaymentMode;
  });

  // Convert categories to SelectOptions
  const categoryOptions: SelectOption[] = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name,
    icon: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#6B7280' }}></div>
  }));

  // Convert payment modes to SelectOptions
  const paymentModeOptions: SelectOption[] = paymentModes.map(pm => ({
    value: pm.id.toString(),
    label: pm.name,
    description: pm.type === 'BANK' ? 'Bank' : pm.type === 'CREDIT' ? 'Credit' : 'Cash',
    icon: pm.type === 'CASH' ? '💵' : pm.type === 'BANK' ? '🏦' : '💳'
  }));

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (field: string) => (value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: String(value) }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.paymentModeId) {
      newErrors.paymentModeId = 'Payment mode is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.isShared && (!formData.shareAmount || parseFloat(formData.shareAmount) <= 0)) {
      newErrors.shareAmount = 'Share amount is required when expense is shared';
    }
    
    if (formData.isRecurring) {
      if (!formData.recurringStartDate) {
        newErrors.recurringStartDate = 'Start date is required for recurring expenses';
      }
      if (!formData.recurringFrequency) {
        newErrors.recurringFrequency = 'Frequency is required for recurring expenses';
      }
    }
    
    return newErrors;
  };

  // Open form for new expense
  const handleAddNew = () => {
    setEditingExpense(null);
    setFormData({
      categoryId: '',
      paymentModeId: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      isShared: false,
      shareAmount: '',
      isPaidShared: false,
      remarks: '',
      isRecurring: false,
      recurringStartDate: '',
      recurringEndDate: '',
      recurringFrequency: '',
      showOnReport: true
    });
    setErrors({});
    setSuccessMessage('');
    setIsOffCanvasOpen(true);
  };

  // Open form for editing
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      categoryId: expense.categoryId.toString(),
      paymentModeId: expense.paymentModeId.toString(),
      description: expense.description,
      amount: expense.amount.toString(),
      date: new Date(expense.date).toISOString().split('T')[0],
      isShared: expense.isShared,
      shareAmount: expense.shareAmount?.toString() || '',
      isPaidShared: expense.isPaidShared,
      remarks: expense.remarks || '',
      isRecurring: expense.isRecurring,
      recurringStartDate: expense.recurringStartDate ? new Date(expense.recurringStartDate).toISOString().split('T')[0] : '',
      recurringEndDate: expense.recurringEndDate ? new Date(expense.recurringEndDate).toISOString().split('T')[0] : '',
      recurringFrequency: expense.recurringFrequency || '',
      showOnReport: expense.showOnReport
    });
    setErrors({});
    setSuccessMessage('');
    setIsOffCanvasOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const token = getAuthToken();
      const url = editingExpense 
        ? `${API_URL}/expenses/${editingExpense.id}`
        : `${API_URL}/expenses`;
      
      const method = editingExpense ? 'PUT' : 'POST';
      
      // Prepare data for submission
      const submitData = {
        categoryId: parseInt(formData.categoryId),
        paymentModeId: parseInt(formData.paymentModeId),
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        isShared: formData.isShared,
        shareAmount: formData.isShared ? parseFloat(formData.shareAmount) : 0,
        isPaidShared: formData.isPaidShared,
        remarks: formData.remarks || '',
        isRecurring: formData.isRecurring,
        recurringStartDate: formData.isRecurring && formData.recurringStartDate ? formData.recurringStartDate : null,
        recurringEndDate: formData.isRecurring && formData.recurringEndDate ? formData.recurringEndDate : null,
        recurringFrequency: formData.isRecurring ? formData.recurringFrequency : null,
        showOnReport: formData.showOnReport
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save expense');
      }
      
      setSuccessMessage(data.message || 'Expense saved successfully!');
      
      // Reload expenses
      await loadExpenses();
      
      setTimeout(() => {
        setSuccessMessage('');
        setIsOffCanvasOpen(false);
      }, 2000);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save expense';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (expense: Expense) => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/expenses/${expense.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete expense');
      }
      
      // Reload expenses
      await loadExpenses();
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete expense';
      alert(message);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get sort arrow
  const getSortArrow = (field: string) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <Button onClick={handleAddNew}>
          Add New Expense
        </Button>
      </div>

      {/* Load Error */}
      {errors.load && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errors.load}</p>
              <button 
                onClick={loadExpenses}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterPaymentMode}
              onChange={(e) => setFilterPaymentMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Payment Modes</option>
              {paymentModes.map(pm => (
                <option key={pm.id} value={pm.id.toString()}>{pm.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={pagination.limit}
              onChange={(e) => setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th 
                      className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('date')}
                    >
                      Date {getSortArrow('date')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Mode</th>
                    <th 
                      className="text-right py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('amount')}
                    >
                      Amount {getSortArrow('amount')}
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm || filterCategory || filterPaymentMode ? 'No expenses match your filters' : 'No expenses found'}
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(expense.date)}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{expense.description}</div>
                            {expense.remarks && (
                              <div className="text-sm text-gray-500">{expense.remarks}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: expense.category.color || '#6B7280' }}
                            ></div>
                            <span className="text-sm text-gray-900">{expense.category.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {expense.paymentMode.type === 'CASH' ? '💵' : 
                               expense.paymentMode.type === 'BANK' ? '🏦' : '💳'}
                            </span>
                            <span className="text-sm text-gray-900">{expense.paymentMode.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-medium text-gray-900">
                            {formatAmount(expense.amount)}
                          </div>
                          {expense.isShared && expense.shareAmount && (
                            <div className="text-xs text-blue-600">
                              Shared: {formatAmount(expense.shareAmount)}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {expense.isShared && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Shared
                              </span>
                            )}
                            {expense.isRecurring && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Recurring
                              </span>
                            )}
                            {!expense.showOnReport && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Hidden
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(expense)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ←
                      </button>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === pagination.page
                              ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatAmount(filteredExpenses.reduce((sum, expense) => {
                // If expense is shared, subtract the share amount from total
                const actualAmount = expense.isShared && expense.shareAmount 
                  ? expense.amount - expense.shareAmount 
                  : expense.amount;
                return sum + actualAmount;
              }, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredExpenses.filter(expense => expense.isShared).length}
            </div>
            <div className="text-sm text-gray-600">Shared Expenses</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredExpenses.filter(expense => expense.isRecurring).length}
            </div>
            <div className="text-sm text-gray-600">Recurring</div>
          </div>
        </Card>
      </div>

      {/* OffCanvas Form */}
      <OffCanvas
        isOpen={isOffCanvasOpen}
        onClose={() => setIsOffCanvasOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
        position="right"
        size="xl"
        mobileFullscreen={true}
        renderFooter={
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => setIsOffCanvasOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (editingExpense ? 'Updating...' : 'Creating...') 
                : (editingExpense ? 'Update Expense' : 'Create Expense')
              }
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="What did you spend on?"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Category and Payment Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelector
                    options={categoryOptions}
                    value={formData.categoryId}
                    onChange={handleSelectChange('categoryId')}
                    placeholder="Select category"
                    error={errors.categoryId}
                    searchPlaceholder="Search categories..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelector
                    options={paymentModeOptions}
                    value={formData.paymentModeId}
                    onChange={handleSelectChange('paymentModeId')}
                    placeholder="Select payment mode"
                    error={errors.paymentModeId}
                    searchPlaceholder="Search payment modes..."
                    required
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks (Optional)
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes about this expense"
                />
              </div>
            </div>
          </div>

          {/* Sharing Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sharing Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isShared"
                  checked={formData.isShared}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  This is a shared expense
                </label>
              </div>

              {formData.isShared && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Share Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="shareAmount"
                      value={formData.shareAmount}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.shareAmount ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Amount to be shared"
                    />
                    {errors.shareAmount && (
                      <p className="mt-1 text-sm text-red-600">{errors.shareAmount}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPaidShared"
                      checked={formData.isPaidShared}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Already paid the shared amount
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recurring Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recurring Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  This is a recurring expense
                </label>
              </div>

              {formData.isRecurring && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency <span className="text-red-500">*</span>
                    </label>
                    <SearchableSelector
                      options={recurringFrequencyOptions}
                      value={formData.recurringFrequency}
                      onChange={handleSelectChange('recurringFrequency')}
                      placeholder="Select frequency"
                      error={errors.recurringFrequency}
                      searchPlaceholder="Search frequencies..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="recurringStartDate"
                        value={formData.recurringStartDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.recurringStartDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.recurringStartDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.recurringStartDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="recurringEndDate"
                        value={formData.recurringEndDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Report Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Options</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="showOnReport"
                checked={formData.showOnReport}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Include this expense in reports and analytics
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {formData.description || 'Expense Description'}
                </span>
                <span className="font-bold text-gray-900">
                  {formData.amount ? formatAmount(parseFloat(formData.amount)) : formatAmount(0)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {formData.date ? formatDate(formData.date) : 'No date selected'}
              </div>
              <div className="flex gap-2">
                {formData.isShared && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Shared: {formData.shareAmount ? formatAmount(parseFloat(formData.shareAmount)) : formatAmount(0)}
                  </span>
                )}
                {formData.isRecurring && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Recurring: {formData.recurringFrequency}
                  </span>
                )}
                {!formData.showOnReport && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Hidden from Reports
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </OffCanvas>
    </>
  );
}