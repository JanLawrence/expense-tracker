"use client";

import { useEffect, useState, useMemo } from "react";
import Card from '@/components/UI/Card';
import PageHeader from '@/components/Standard/PageHeader'
import Avatar from "@/components/UI/Avatar/Avatar";
import Button from "@/components/UI/Button";
import OffCanvas from '@/components/UI/OffCanvas';
import CountrySelector from '@/components/Standard/CountriesSelector';
import SearchableSelector, { SelectOption } from '@/components/UI/SearchableSelector';

import Link from 'next/link';

import { getUserInitials } from '@/services/Helpers'
import { useAuthContext } from '@/context/AuthContext';
import { useCurrency } from '@/hooks/useCurrency';

import { currencyService } from '@/services/currencyService';

// Pay schedule options
const payScheduleOptions: SelectOption[] = [
  { value: "daily", label: "Daily", description: "Every day" },
  { value: "weekly", label: "Weekly", description: "Once a week" },
  { value: "bi-weekly", label: "Bi-weekly", description: "Every two weeks" },
  { value: "monthly", label: "Monthly", description: "Once a month" },
  { value: "bi-monthly", label: "Bi-monthly", description: "Twice a month" }
];

// Days of the week for weekly/bi-weekly schedules
const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" }
];

export default function OverviewPage() {
  const { user } = useAuthContext();
  const { formatAmount, getCurrencySymbol, getCurrencyCode } = useCurrency();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNo: '',
    countryCode: 'PH',
    startingMoney: '0',
    paySchedule: 'monthly',
    incomePerSchedule: '0',
    payDays: [15]
  });

  const userName = user ? `${user.firstName} ${user.lastName}` : ''
  const userCountry = user ? currencyService.getCurrencyByCountryCode(user.countryCode) : currencyService.getCurrencyByCountryCode('PH')
  
  const breadcrumb = [
    {
      'label': 'Dashboard',
      'href': '/dashboard' 
    },
    {
      'label': 'Account',
      'href': '', 
      'disabled': true
    },
    {
      'label': 'Overview',
      'href': '/account/overview',
    },
  ]

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        contactNo: user.contactNo || '',
        countryCode: user.countryCode || 'PH',
        startingMoney: user.startingMoney?.toString() || '0',
        paySchedule: user.paySchedule?.schedule || 'monthly',
        incomePerSchedule: user.paySchedule?.incomePerSchedule?.toString() || '0',
        payDays: user.paySchedule?.payDays || [15]
      });
    }
  }, [user]);

  const communication = useMemo(() => {
    let communication = [];
    if (user) {
      if (user.email) {
        communication.push('Email');
      }
      if (user.contactNo) {
        communication.push('Phone');
      }
    }
    return communication;
  }, [user]);

  const capitalizeHyphenated = (str) => {
    if(str){
      return str.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join('-');
    }
    return '';
  };

  const formatNumber = (num) => {
    if(num){
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return 0.00;
  };

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

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({ ...prev, countryCode }));
    if (errors.countryCode) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.countryCode;
        return newErrors;
      });
    }
  };

  // Handle pay schedule change
  const handlePayScheduleChange = (schedule: string | number) => {
    const scheduleStr = String(schedule);
    setFormData(prev => ({ ...prev, paySchedule: scheduleStr }));
    
    // Set default payDays based on schedule - only if payDays is empty or doesn't match schedule type
    const currentPayDays = formData.payDays;
    let shouldUpdatePayDays = false;
    let defaultPayDays = currentPayDays;
    
    switch (scheduleStr) {
      case 'daily':
        if (currentPayDays.length > 0) {
          defaultPayDays = [];
          shouldUpdatePayDays = true;
        }
        break;
      case 'weekly':
      case 'bi-weekly':
        if (currentPayDays.length !== 1 || currentPayDays[0] > 6) {
          defaultPayDays = [5]; // Friday
          shouldUpdatePayDays = true;
        }
        break;
      case 'monthly':
        if (currentPayDays.length !== 1) {
          defaultPayDays = [15];
          shouldUpdatePayDays = true;
        }
        break;
      case 'bi-monthly':
        if (currentPayDays.length !== 2) {
          defaultPayDays = [15, 30]; // 15th and 30th
          shouldUpdatePayDays = true;
        }
        break;
    }
    
    if (shouldUpdatePayDays) {
      setFormData(prev => ({ ...prev, payDays: defaultPayDays }));
    }
    
    if (errors.paySchedule) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paySchedule;
        return newErrors;
      });
    }
  };

  // Handle pay day changes
  const handlePayDayChange = (day: number, checked: boolean) => {
    if (checked) {
      if (formData.paySchedule === 'bi-monthly') {
        if (formData.payDays.length < 2) {
          setFormData(prev => ({
            ...prev,
            payDays: [...prev.payDays, day].sort((a, b) => a - b)
          }));
        }
      } else {
        setFormData(prev => ({ ...prev, payDays: [day] }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        payDays: prev.payDays.filter(d => d !== day)
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    }
    
    if (!formData.countryCode) {
      newErrors.countryCode = 'Country is required';
    }
    
    const startingMoney = parseFloat(formData.startingMoney);
    if (isNaN(startingMoney) || startingMoney < 0) {
      newErrors.startingMoney = 'Starting money must be a valid positive number';
    }
    
    const income = parseFloat(formData.incomePerSchedule);
    if (isNaN(income) || income <= 0) {
      newErrors.incomePerSchedule = 'Income must be a valid positive number';
    }
    
    // Validate payDays based on schedule
    if (formData.paySchedule === 'bi-monthly' && formData.payDays.length !== 2) {
      newErrors.payDays = 'Please select exactly 2 days for bi-monthly schedule';
    } else if ((formData.paySchedule === 'weekly' || formData.paySchedule === 'bi-weekly') && formData.payDays.length !== 1) {
      newErrors.payDays = 'Please select a day of the week';
    } else if (formData.paySchedule === 'monthly' && formData.payDays.length !== 1) {
      newErrors.payDays = 'Please select a day of the month';
    }
    
    return newErrors;
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make the actual API call to update user profile
      // const response = await updateUserProfile(formData);
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        setIsOpen(false);
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render pay days selection
  const renderPayDaysSelection = () => {
    if (formData.paySchedule === 'daily') {
      return (
        <div className="text-sm text-gray-600">
          Income will be recorded daily
        </div>
      );
    }

    if (formData.paySchedule === 'weekly' || formData.paySchedule === 'bi-weekly') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of the Week
          </label>
          <div className="grid grid-cols-2 gap-2">
            {daysOfWeek.map(day => (
              <label key={day.value} className="flex items-center">
                <input
                  type="radio"
                  name="dayOfWeek"
                  value={day.value}
                  checked={formData.payDays.includes(day.value)}
                  onChange={(e) => handlePayDayChange(day.value, e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{day.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (formData.paySchedule === 'monthly') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of the Month
          </label>
          <select
            value={formData.payDays[0] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, payDays: [parseInt(e.target.value)] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>
                {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (formData.paySchedule === 'bi-monthly') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Days of the Month (Select 2)
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.payDays.includes(day)}
                  onChange={(e) => handlePayDayChange(day, e.target.checked)}
                  disabled={!formData.payDays.includes(day) && formData.payDays.length >= 2}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-1 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Selected: {formData.payDays.sort((a, b) => a - b).join(', ')} 
            {formData.payDays.length < 2 && ` (${2 - formData.payDays.length} more needed)`}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <PageHeader breadcrumb={breadcrumb} title={'Account Overview'}/>

      <Card noPadding={true} className="px-6 py-6 mb-5">
        <div className={`flex justify-start items-center`}>
          <Avatar 
            src={null} 
            alt={userName}
            initials={getUserInitials(userName)}
            size="xxl"
          />
          <div className="ml-5">
            <span className="text-2xl font-semibold">{userName}</span>
          </div>
        </div>
      </Card>

      <Card 
        title={'Profile Details'}
        className="mb-5"
        actions={
         <Button onClick={() => setIsOpen(true)}>
            Edit Profile
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full md:w-1/3">
              <h4 className="text-gray-500 font-medium">Full Name</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{userName}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Email Address</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0 flex items-center">
              <p className="text-gray-800 font-medium md:text-md">{user?.email}</p>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-200 text-lime-800">
                Verified
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Contact Phone</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0 flex items-center">
              <p className="text-gray-800 font-medium md:text-md">{user?.contactNo}</p>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-200 text-lime-800">
                Verified
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Country</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{userCountry?.country}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3">
              <h4 className="text-gray-500 font-medium">Communication</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{communication.length > 0 ? communication.join(', ') : 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card 
        className="mb-5"
        title={'Setup Details'}
      >
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full md:w-1/3">
              <h4 className="text-gray-500 font-medium">Starting Money</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{formatAmount(user?.startingMoney || 0)}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Pay Schedule</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{capitalizeHyphenated(user?.paySchedule?.schedule)}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Income per {capitalizeHyphenated(user?.paySchedule?.schedule)} Period</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{formatAmount(user?.paySchedule?.incomePerSchedule || 0)}</p>
            </div>
          </div>
          {user?.paySchedule?.payDays && user.paySchedule.payDays.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
              <div className="w-full md:w-1/3 flex items-center">
                <h4 className="text-gray-500 font-medium">Pay Days</h4>
              </div>
              <div className="w-full md:w-2/3 mt-1 md:mt-0">
                <p className="text-gray-800 font-medium md:text-md">
                  {user.paySchedule.schedule === 'daily' 
                    ? 'Every day'
                    : user.paySchedule.schedule === 'weekly' || user.paySchedule.schedule === 'bi-weekly'
                    ? daysOfWeek.find(d => d.value === user.paySchedule.payDays[0])?.label
                    : user.paySchedule.payDays.join(', ')
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <OffCanvas
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        position="right"
        size="xxl"
        mobileFullscreen={true}
        renderFooter={
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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

          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name (Optional)
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Middle Name"
              />
            </div>

            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div> */}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.contactNo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contact Number"
              />
              {errors.contactNo && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNo}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <CountrySelector
                value={formData.countryCode}
                onChange={handleCountryChange}
                error={errors.countryCode}
                placeholder="Select your country"
                required
              />
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Money <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{getCurrencySymbol()}</span>
                </div>
                <input
                  type="text"
                  name="startingMoney"
                  value={formData.startingMoney}
                  onChange={handleInputChange}
                  className={`w-full pl-7 pr-12 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startingMoney ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{getCurrencyCode()}</span>
                </div>
              </div>
              {errors.startingMoney && (
                <p className="mt-1 text-sm text-red-600">{errors.startingMoney}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Schedule <span className="text-red-500">*</span>
              </label>
              <SearchableSelector
                options={payScheduleOptions}
                value={formData.paySchedule}
                onChange={handlePayScheduleChange}
                placeholder="Select pay schedule"
                error={errors.paySchedule}
                searchPlaceholder="Search schedules..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income per {capitalizeHyphenated(formData.paySchedule)} Period <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{getCurrencySymbol()}</span>
                </div>
                <input
                  type="text"
                  name="incomePerSchedule"
                  value={formData.incomePerSchedule}
                  onChange={handleInputChange}
                  className={`w-full pl-7 pr-12 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.incomePerSchedule ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{getCurrencyCode()}</span>
                </div>
              </div>
              {errors.incomePerSchedule && (
                <p className="mt-1 text-sm text-red-600">{errors.incomePerSchedule}</p>
              )}
            </div>

            {/* Pay Days Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Days
              </label>
              {renderPayDaysSelection()}
              {errors.payDays && (
                <p className="mt-1 text-sm text-red-600">{errors.payDays}</p>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Full Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formData.firstName} {formData.middleName && `${formData.middleName} `}{formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contact:</span>
                <span className="text-sm font-medium text-gray-900">{formData.contactNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm font-medium text-gray-900">
                  {currencyService.getCurrencyByCountryCode(formData.countryCode)?.country || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Starting Balance:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getCurrencySymbol()}{formatNumber(parseFloat(formData.startingMoney) || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pay Schedule:</span>
                <span className="text-sm font-medium text-gray-900">{capitalizeHyphenated(formData.paySchedule)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Income per Period:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getCurrencySymbol()}{formatNumber(parseFloat(formData.incomePerSchedule) || 0)}
                </span>
              </div>
              {formData.payDays.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pay Days:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.paySchedule === 'daily' 
                      ? 'Every day'
                      : formData.paySchedule === 'weekly' || formData.paySchedule === 'bi-weekly'
                      ? daysOfWeek.find(d => d.value === formData.payDays[0])?.label || 'Not selected'
                      : formData.payDays.sort((a, b) => a - b).join(', ')
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>
      </OffCanvas>
    </>
  );
}