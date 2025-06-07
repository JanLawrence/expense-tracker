"use client";

import { useState } from 'react';
import { useSetupContext } from '@/context/SetupContext';
import { useAuthContext } from '@/context/AuthContext';
import { useCurrency } from '@/hooks/useCurrency';
import CategoryManagement from './CategoryManagement';
import paymentModeAPI from '@/services/paymentModeAPI';

// Define payment schedule types
const payScheduleOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "bi-monthly", label: "Bi-monthly" }
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

// Define a simple category for payment modes
interface Category {
  name: string;
  type: string;
  color: string;
}

// Default categories
const defaultCategories: Category[] = [
  { name: "Food & Dining", type: "EXPENSE", color: "#FF5722" },
  { name: "Transportation", type: "EXPENSE", color: "#2196F3" },
  { name: "Entertainment", type: "EXPENSE", color: "#9C27B0" },
  { name: "Shopping", type: "EXPENSE", color: "#4CAF50" },
  { name: "Utilities", type: "EXPENSE", color: "#607D8B" },
  { name: "Health", type: "EXPENSE", color: "#E91E63" },
  { name: "Salary", type: "INCOME", color: "#4CAF50" },
  { name: "Investments", type: "INCOME", color: "#3F51B5" }
];

const SetupModal = () => {
  const { setupStatus, showSetupModal, setShowSetupModal, updateStartingMoney, updatePaySchedule, updateCategories, completeSetup } = useSetupContext();
  const { user } = useAuthContext();
  const { currency, formatAmount, getCurrencySymbol, getCurrencyCode } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [startingMoney, setStartingMoney] = useState('0');
  const [paySchedule, setPaySchedule] = useState('monthly');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [payDays, setPayDays] = useState<number[]>([15]); // Default to 15th for monthly
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [addCategories, setAddCategories] = useState(true);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // If modal should not be shown, return null
  if (!showSetupModal) return null;

  const totalSteps = 4;

  // Handle pay schedule change and update default payDays
  const handlePayScheduleChange = (newSchedule: string) => {
    setPaySchedule(newSchedule);
    
    // Set default payDays based on schedule
    switch (newSchedule) {
      case 'daily':
        setPayDays([]); // No specific days for daily
        break;
      case 'weekly':
        setPayDays([5]); // Default to Friday
        break;
      case 'bi-weekly':
        setPayDays([5]); // Default to Friday
        break;
      case 'monthly':
        setPayDays([15]); // Default to 15th
        break;
      case 'bi-monthly':
        setPayDays([15, 30]); // Default to 15th and 30th
        break;
      default:
        setPayDays([]);
    }
  };

  // Handle pay day selection
  const handlePayDayChange = (day: number, checked: boolean) => {
    if (checked) {
      if (paySchedule === 'bi-monthly') {
        // For bi-monthly, allow max 2 days
        if (payDays.length < 2) {
          setPayDays([...payDays, day].sort((a, b) => a - b));
        }
      } else {
        // For other schedules, replace or add
        setPayDays([day]);
      }
    } else {
      setPayDays(payDays.filter(d => d !== day));
    }
  };

  // Validate starting money (Step 1)
  const validateStartingMoney = () => {
    if (startingMoney === '') {
      setErrors({ startingMoney: "Please enter your starting amount" });
      return false;
    }
    
    const amount = parseFloat(startingMoney);
    if (isNaN(amount) || amount < 0) {
      setErrors({ startingMoney: "Please enter a valid positive number" });
      return false;
    }
    
    setErrors({});
    return true;
  };

  // Validate pay schedule (Step 2)
  const validatePaySchedule = () => {
    if (!paySchedule) {
      setErrors({ paySchedule: "Please select a payment schedule" });
      return false;
    }
    
    if (!incomeAmount) {
      setErrors({ incomeAmount: "Please enter your income amount" });
      return false;
    }
    
    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrors({ incomeAmount: "Please enter a valid positive number" });
      return false;
    }

    // Validate payDays based on schedule
    if (paySchedule === 'bi-monthly' && payDays.length !== 2) {
      setErrors({ payDays: "Please select exactly 2 days for bi-monthly schedule" });
      return false;
    }
    
    if ((paySchedule === 'weekly' || paySchedule === 'bi-weekly') && payDays.length !== 1) {
      setErrors({ payDays: "Please select a day of the week" });
      return false;
    }
    
    if (paySchedule === 'monthly' && payDays.length !== 1) {
      setErrors({ payDays: "Please select a day of the month" });
      return false;
    }
    
    setErrors({});
    return true;
  };

  // Handle next button
  const handleNext = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1: // Starting Money
        isValid = validateStartingMoney();
        if (isValid) {
          setIsLoading(true);
          const success = await updateStartingMoney(parseFloat(startingMoney));
          setIsLoading(false);
          if (!success) {
            setErrors({ startingMoney: "Failed to save starting money. Please try again." });
            return;
          }
        } else {
          return;
        }
        break;
        
      case 2: // Pay Schedule
        isValid = validatePaySchedule();
        if (isValid) {
          setIsLoading(true);
          const scheduleData = {
            schedule: paySchedule,
            incomePerSchedule: parseFloat(incomeAmount),
            payDays: payDays
          };
          const success = await updatePaySchedule(scheduleData);
          setIsLoading(false);
          if (!success) {
            setErrors({ paySchedule: "Failed to save pay schedule. Please try again." });
            return;
          }
        } else {
          return;
        }
        break;
        
      case 3: // Categories
        if (addCategories && selectedCategories.length === 0) {
          setErrors({ categories: "Please select at least one category or choose to add them later" });
          return;
        }
        
        setIsLoading(true);
        
        try {
          // If user wants to set up categories now, create them
          if (addCategories && selectedCategories.length > 0) {
            // Create payment modes from selected categories
            const success = await paymentModeAPI.createPaymentModes(selectedCategories);
            
            if (!success) {
              throw new Error("Failed to create payment categories");
            }
          }
          
          // Update the categories setup status
          const success = await updateCategories(addCategories);
          
          if (!success) {
            throw new Error("Failed to update setup status");
          }
          
        } catch (error) {
          setIsLoading(false);
          const message = error instanceof Error ? error.message : "Failed to save categories";
          setErrors({ categories: message });
          return;
        }
        
        setIsLoading(false);
        break;
        
      case 4: // Finish
        setIsLoading(true);
        const completed = await completeSetup();
        setIsLoading(false);
        if (!completed) {
          setErrors({ complete: "Failed to complete setup. Please try again." });
          return;
        }
        // Close modal after successful completion
        setShowSetupModal(false);
        return;
    }
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle category selection
  const toggleCategory = (category: Category) => {
    if (selectedCategories.some(cat => cat.name === category.name)) {
      setSelectedCategories(prev => prev.filter(cat => cat.name !== category.name));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  // Skip setup (for development or testing)
  const handleSkipSetup = async () => {
    await completeSetup();
    setShowSetupModal(false);
  };

  // Render pay days selection based on schedule
  const renderPayDaysSelection = () => {
    if (paySchedule === 'daily') {
      return (
        <div className="text-sm text-gray-600">
          Income will be recorded daily
        </div>
      );
    }

    if (paySchedule === 'weekly' || paySchedule === 'bi-weekly') {
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
                  checked={payDays.includes(day.value)}
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

    if (paySchedule === 'monthly') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of the Month
          </label>
          <select
            value={payDays[0] || ''}
            onChange={(e) => setPayDays([parseInt(e.target.value)])}
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

    if (paySchedule === 'bi-monthly') {
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
                  checked={payDays.includes(day)}
                  onChange={(e) => handlePayDayChange(day, e.target.checked)}
                  disabled={!payDays.includes(day) && payDays.length >= 2}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-1 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Selected: {payDays.sort((a, b) => a - b).join(', ')} 
            {payDays.length < 2 && ` (${2 - payDays.length} more needed)`}
          </div>
        </div>
      );
    }

    return null;
  };

  // Render different step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Starting Money
        return (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Enter Your Initial Balance</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter how much money you currently have available. This will be used as your starting balance.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starting Amount
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getCurrencySymbol()}</span>
                  </div>
                  <input
                    type="text"
                    value={startingMoney}
                    onChange={(e) => {
                      setStartingMoney(e.target.value);
                      if (errors.startingMoney) setErrors({});
                    }}
                    className={`w-full pl-7 pr-12 py-2 border ${
                      errors.startingMoney ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
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
            </div>
          </div>
        );
        
      case 2: // Pay Schedule
        return (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Set Your Income Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please select how often you receive your income, the amount you receive per pay period, and when you get paid.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Schedule
                </label>
                <select
                  value={paySchedule}
                  onChange={(e) => {
                    handlePayScheduleChange(e.target.value);
                    if (errors.paySchedule) setErrors({});
                  }}
                  className={`w-full px-3 py-2 border ${
                    errors.paySchedule ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  {payScheduleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.paySchedule && (
                  <p className="mt-1 text-sm text-red-600">{errors.paySchedule}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Per {paySchedule.charAt(0).toUpperCase() + paySchedule.slice(1)} Period
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getCurrencySymbol()}</span>
                  </div>
                  <input
                    type="text"
                    value={incomeAmount}
                    onChange={(e) => {
                      setIncomeAmount(e.target.value);
                      if (errors.incomeAmount) setErrors({});
                    }}
                    className={`w-full pl-7 pr-12 py-2 border ${
                      errors.incomeAmount ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getCurrencyCode()}</span>
                  </div>
                </div>
                {errors.incomeAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.incomeAmount}</p>
                )}
              </div>

              {/* Pay Days Selection */}
              <div>
                {renderPayDaysSelection()}
                {errors.payDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.payDays}</p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 3: // Categories
        return (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Set Your Categories</h3>
            <p className="text-sm text-gray-600 mb-4">
              Categories help you organize your income and expenses. You can select some common categories now or add them later.
            </p>
            
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <input
                  id="add-categories-now"
                  type="radio"
                  checked={addCategories}
                  onChange={() => setAddCategories(true)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="add-categories-now" className="ml-2 block text-sm text-gray-700">
                  Set up categories now
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="add-categories-later"
                  type="radio"
                  checked={!addCategories}
                  onChange={() => setAddCategories(false)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="add-categories-later" className="ml-2 block text-sm text-gray-700">
                  I'll add my categories later
                </label>
              </div>
            </div>
            
            {addCategories && (
              <div className="mt-4">
                <CategoryManagement 
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                />
                {errors.categories && (
                  <p className="mt-2 text-sm text-red-600">{errors.categories}</p>
                )}
              </div>
            )}
          </div>
        );
        
      case 4: // Finish
        return (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Setup Complete!</h3>
            <p className="text-sm text-gray-600 mb-4">
              You've successfully set up your profile. Click "Finish" to start tracking your finances.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Your profile is ready</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Starting balance: {formatAmount(parseFloat(startingMoney))}</li>
                      <li>Pay schedule: {paySchedule.charAt(0).toUpperCase() + paySchedule.slice(1)}</li>
                      <li>Pay days: {paySchedule === 'daily' ? 'Every day' : 
                          paySchedule === 'weekly' || paySchedule === 'bi-weekly' 
                            ? daysOfWeek.find(d => d.value === payDays[0])?.label 
                            : payDays.join(', ')}</li>
                      <li>
                        {addCategories
                          ? `Categories: ${selectedCategories.length} selected`
                          : 'You can add categories later in settings'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {errors.complete && (
              <p className="mt-2 text-sm text-red-600">{errors.complete}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile Setup</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Hi {user?.firstName || 'there'}! Let's set up your profile to get the most out of the app.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>

                {/* Step content */}
                {renderStepContent()}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {currentStep === totalSteps
                ? (isLoading ? 'Finishing...' : 'Finish')
                : (isLoading ? 'Saving...' : 'Next')}
            </button>

            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Back
              </button>
            )}

            {/* For development/testing purposes only */}
            <button
              type="button"
              onClick={handleSkipSetup}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Skip Setup (Dev Only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupModal;