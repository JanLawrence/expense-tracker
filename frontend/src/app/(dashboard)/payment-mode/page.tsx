"use client";

import React, { useState, useEffect } from "react";
import Card from '@/components/UI/Card';
import Button from "@/components/UI/Button";
import OffCanvas from '@/components/UI/OffCanvas';
import SearchableSelector, { SelectOption } from '@/components/UI/SearchableSelector';

// PaymentMode interface matching your Prisma model
interface PaymentMode {
  id: number;
  userId: number;
  type: string;
  name: string;
  creditLimit: number | null;
  cutoffDate: string | null;
  network: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count?: {
    expenses: number;
  };
}

// Payment type options
const paymentTypeOptions: SelectOption[] = [
  { 
    value: 'CASH', 
    label: 'Cash', 
    description: 'Physical cash payments',
    icon: '💵'
  },
  { 
    value: 'BANK', 
    label: 'Bank Account', 
    description: 'Debit card, checking account',
    icon: '🏦'
  },
  { 
    value: 'CREDIT', 
    label: 'Credit Card', 
    description: 'Credit card payments',
    icon: '💳'
  }
];

// Network options for credit cards
const networkOptions: SelectOption[] = [
  { value: 'VISA', label: 'Visa', icon: '💳' },
  { value: 'MASTERCARD', label: 'Mastercard', icon: '💳' },
  { value: 'AMERICAN_EXPRESS', label: 'American Express', icon: '💳' },
  { value: 'DISCOVER', label: 'Discover', icon: '💳' },
  { value: 'JCB', label: 'JCB', icon: '💳' },
  { value: 'DINERS_CLUB', label: 'Diners Club', icon: '💳' },
  { value: 'UNIONPAY', label: 'UnionPay', icon: '💳' }
];

// Predefined color options
const colorOptions = [
  { value: '#EF4444', label: 'Red', color: '#EF4444' },
  { value: '#F97316', label: 'Orange', color: '#F97316' },
  { value: '#EAB308', label: 'Yellow', color: '#EAB308' },
  { value: '#22C55E', label: 'Green', color: '#22C55E' },
  { value: '#3B82F6', label: 'Blue', color: '#3B82F6' },
  { value: '#8B5CF6', label: 'Purple', color: '#8B5CF6' },
  { value: '#EC4899', label: 'Pink', color: '#EC4899' },
  { value: '#6B7280', label: 'Gray', color: '#6B7280' },
  { value: '#059669', label: 'Emerald', color: '#059669' },
  { value: '#DC2626', label: 'Rose', color: '#DC2626' },
  { value: '#7C3AED', label: 'Violet', color: '#7C3AED' },
  { value: '#0891B2', label: 'Cyan', color: '#0891B2' }
];

export default function PaymentModePage() {
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [editingPaymentMode, setEditingPaymentMode] = useState<PaymentMode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'BANK',
    name: '',
    creditLimit: '',
    cutoffDate: '',
    network: '',
    color: '#3B82F6'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Load payment modes from API
  const loadPaymentModes = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/payment-modes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment modes');
      }

      const data = await response.json();
      setPaymentModes(data);
    } catch (error) {
      console.error('Failed to load payment modes:', error);
      setErrors({ load: 'Failed to load payment modes. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load payment modes on component mount
  useEffect(() => {
    loadPaymentModes();
  }, []);

  // Filter payment modes
  const filteredPaymentModes = paymentModes.filter(paymentMode => {
    const matchesSearch = paymentMode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paymentMode.network?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || paymentMode.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle type change
  const handleTypeChange = (type: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      type: String(type),
      // Clear credit-specific fields when switching away from credit
      creditLimit: String(type) === 'CREDIT' ? prev.creditLimit : '',
      cutoffDate: String(type) === 'CREDIT' ? prev.cutoffDate : '',
      network: String(type) === 'CREDIT' ? prev.network : ''
    }));
    
    if (errors.type) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.type;
        return newErrors;
      });
    }
  };

  // Handle network change
  const handleNetworkChange = (network: string | number) => {
    setFormData(prev => ({ ...prev, network: String(network) }));
    if (errors.network) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.network;
        return newErrors;
      });
    }
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Payment mode name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Payment mode name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Payment mode name must be less than 50 characters';
    }
    
    if (!formData.type) {
      newErrors.type = 'Payment type is required';
    }
    
    // Credit card specific validations
    if (formData.type === 'CREDIT') {
      if (formData.creditLimit && formData.creditLimit.trim()) {
        const limit = parseFloat(formData.creditLimit);
        if (isNaN(limit) || limit <= 0) {
          newErrors.creditLimit = 'Credit limit must be a positive number';
        }
      }
      
      if (formData.cutoffDate && formData.cutoffDate.trim()) {
        const cutoffDay = parseInt(formData.cutoffDate);
        if (isNaN(cutoffDay) || cutoffDay < 1 || cutoffDay > 31) {
          newErrors.cutoffDate = 'Cutoff date must be between 1 and 31';
        }
      }
    }
    
    if (!formData.color) {
      newErrors.color = 'Color is required';
    }
    
    return newErrors;
  };

  // Open form for new payment mode
  const handleAddNew = () => {
    setEditingPaymentMode(null);
    setFormData({
      type: 'BANK',
      name: '',
      creditLimit: '',
      cutoffDate: '',
      network: '',
      color: '#3B82F6'
    });
    setErrors({});
    setSuccessMessage('');
    setIsOffCanvasOpen(true);
  };

  // Open form for editing
  const handleEdit = (paymentMode: PaymentMode) => {
    setEditingPaymentMode(paymentMode);
    setFormData({
      type: paymentMode.type,
      name: paymentMode.name,
      creditLimit: paymentMode.creditLimit?.toString() || '',
      cutoffDate: paymentMode.cutoffDate ? new Date(paymentMode.cutoffDate).getDate().toString() : '',
      network: paymentMode.network || '',
      color: paymentMode.color || '#3B82F6'
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
      const url = editingPaymentMode 
        ? `${API_URL}/payment-modes/${editingPaymentMode.id}`
        : `${API_URL}/payment-modes`;
      
      const method = editingPaymentMode ? 'PUT' : 'POST';
      
      // Prepare data for submission
      const submitData: any = {
        type: formData.type,
        name: formData.name,
        color: formData.color
      };
      
      // Add credit card specific fields
      if (formData.type === 'CREDIT') {
        if (formData.creditLimit && formData.creditLimit.trim()) {
          submitData.creditLimit = parseFloat(formData.creditLimit);
        }
        if (formData.cutoffDate && formData.cutoffDate.trim()) {
          // Create a date object for the cutoff day of current month
          const today = new Date();
          const cutoffDay = parseInt(formData.cutoffDate);
          submitData.cutoffDate = new Date(today.getFullYear(), today.getMonth(), cutoffDay).toISOString();
        }
        if (formData.network && formData.network.trim()) {
          submitData.network = formData.network;
        }
      }
      
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
        throw new Error(data.message || 'Failed to save payment mode');
      }
      
      setSuccessMessage(data.message || 'Payment mode saved successfully!');
      
      // Reload payment modes
      await loadPaymentModes();
      
      setTimeout(() => {
        setSuccessMessage('');
        setIsOffCanvasOpen(false);
      }, 2000);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save payment mode';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (paymentMode: PaymentMode) => {
    // Prevent deletion of default cash payment mode
    if (paymentMode.type === 'CASH' && paymentMode.name === 'Cash') {
      alert('The default Cash payment mode cannot be deleted');
      return;
    }
    
    // Check if payment mode has expenses
    if (paymentMode._count?.expenses && paymentMode._count.expenses > 0) {
      const confirmed = window.confirm(
        `This payment mode has ${paymentMode._count.expenses} expenses. Are you sure you want to delete it?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm('Are you sure you want to delete this payment mode?');
      if (!confirmed) return;
    }
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/payment-modes/${paymentMode.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete payment mode');
      }
      
      // Reload payment modes
      await loadPaymentModes();
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete payment mode';
      alert(message);
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

  // Format cutoff date
  const formatCutoffDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return `${new Date(dateString).getDate()}${getOrdinalSuffix(new Date(dateString).getDate())} of month`;
  };

  // Get ordinal suffix for numbers
  const getOrdinalSuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Get payment type badge style
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'CASH':
        return 'bg-green-100 text-green-800';
      case 'BANK':
        return 'bg-blue-100 text-blue-800';
      case 'CREDIT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CASH': return '💵';
      case 'BANK': return '🏦';
      case 'CREDIT': return '💳';
      default: return '💰';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Payment Modes</h2>
        <Button onClick={handleAddNew}>
          Add New Payment Mode
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
                onClick={loadPaymentModes}
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search payment modes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="CASH">Cash</option>
              <option value="BANK">Bank Account</option>
              <option value="CREDIT">Credit Card</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payment Modes Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Mode</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaymentModes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm || filterType ? 'No payment modes match your filters' : 'No payment modes found'}
                    </td>
                  </tr>
                ) : (
                  filteredPaymentModes.map((paymentMode) => (
                    <tr key={paymentMode.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3 flex-shrink-0 border border-gray-200"
                            style={{ backgroundColor: paymentMode.color || '#6B7280' }}
                          ></div>
                          <div>
                            <div className="font-medium text-gray-900">{paymentMode.name}</div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyle(paymentMode.type)}`}>
                          {getTypeIcon(paymentMode.type)} {paymentMode.type === 'BANK' ? 'Bank' : paymentMode.type === 'CREDIT' ? 'Credit' : 'Cash'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {paymentMode.type === 'CREDIT' ? (
                          <div className="space-y-1">
                            {paymentMode.network && (
                              <div>Network: {paymentMode.network}</div>
                            )}
                            {paymentMode.creditLimit && (
                              <div>Limit: ${paymentMode.creditLimit.toLocaleString()}</div>
                            )}
                            {paymentMode.cutoffDate && (
                              <div>Cutoff: {formatCutoffDate(paymentMode.cutoffDate)}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(paymentMode.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {!(paymentMode.type === 'CASH' && paymentMode.name === 'Cash') ? (
                            <>
                              <button
                                onClick={() => handleEdit(paymentMode)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(paymentMode)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{paymentModes.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {paymentModes.filter(pm => pm.type === 'CASH').length}
            </div>
            <div className="text-sm text-gray-600">Cash</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {paymentModes.filter(pm => pm.type === 'BANK').length}
            </div>
            <div className="text-sm text-gray-600">Bank</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {paymentModes.filter(pm => pm.type === 'CREDIT').length}
            </div>
            <div className="text-sm text-gray-600">Credit</div>
          </div>
        </Card>
      </div>

      {/* OffCanvas Form */}
      <OffCanvas
        isOpen={isOffCanvasOpen}
        onClose={() => setIsOffCanvasOpen(false)}
        title={editingPaymentMode ? 'Edit Payment Mode' : 'Add New Payment Mode'}
        position="right"
        size="lg"
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
                ? (editingPaymentMode ? 'Updating...' : 'Creating...') 
                : (editingPaymentMode ? 'Update Payment Mode' : 'Create Payment Mode')
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

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <SearchableSelector
              options={paymentTypeOptions}
              value={formData.type}
              onChange={handleTypeChange}
              placeholder="Select payment type"
              error={errors.type}
              searchPlaceholder="Search types..."
              required
            />
          </div>

          {/* Payment Mode Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Wells Fargo Checking, Chase Sapphire"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Credit Card Specific Fields */}
          {formData.type === 'CREDIT' && (
            <>
              {/* Network */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Network (Optional)
                </label>
                <SearchableSelector
                  options={networkOptions}
                  value={formData.network}
                  onChange={handleNetworkChange}
                  placeholder="Select card network"
                  error={errors.network}
                  searchPlaceholder="Search networks..."
                  allowClear
                />
              </div>

              {/* Credit Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit (Optional)
                </label>
                <input
                  type="number"
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.creditLimit ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5000"
                  min="0"
                  step="0.01"
                />
                {errors.creditLimit && (
                  <p className="mt-1 text-sm text-red-600">{errors.creditLimit}</p>
                )}
              </div>

              {/* Cutoff Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Cutoff Date (Optional)
                </label>
                <input
                  type="number"
                  name="cutoffDate"
                  value={formData.cutoffDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cutoffDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 15"
                  min="1"
                  max="31"
                />
                {errors.cutoffDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.cutoffDate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Day of the month (1-31) when billing cycle ends
                </p>
              </div>
            </>
          )}

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorChange(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    formData.color === color.value 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                />
              ))}
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color}</p>
            )}
          </div>

          {/* Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full mr-3 border border-gray-200"
                  style={{ backgroundColor: formData.color }}
                ></div>
                <div>
                  <div className="font-medium text-gray-900">
                    {formData.name || 'Payment Mode Name'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeStyle(formData.type)}`}>
                      {getTypeIcon(formData.type)} {formData.type === 'BANK' ? 'Bank' : formData.type === 'CREDIT' ? 'Credit' : 'Cash'}
                    </span>
                    {formData.type === 'CREDIT' && formData.network && (
                      <span className="text-xs text-gray-500">
                        {formData.network}
                      </span>
                    )}
                  </div>
                  {formData.type === 'CREDIT' && (
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      {formData.creditLimit && (
                        <div>Limit: ${parseFloat(formData.creditLimit).toLocaleString()}</div>
                      )}
                      {formData.cutoffDate && (
                        <div>
                          Cutoff: {formData.cutoffDate}{getOrdinalSuffix(parseInt(formData.cutoffDate))} of month
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </OffCanvas>
    </>
  );
}