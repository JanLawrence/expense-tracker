"use client";

import React, { useState, useEffect } from "react";
import Card from '@/components/UI/Card';
import Button from "@/components/UI/Button";
import OffCanvas from '@/components/UI/OffCanvas';
import SearchableSelector, { SelectOption } from '@/components/UI/SearchableSelector';

// Category interface matching your updated Prisma model
interface Category {
  id: number;
  name: string;
  type: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count?: {
    expenses: number;
  };
}

// Category type options
const categoryTypeOptions: SelectOption[] = [
  { 
    value: 'expense', 
    label: 'Expense', 
    description: 'Money going out',
    icon: '💸'
  },
  { 
    value: 'savings', 
    label: 'Savings', 
    description: 'Money saved/invested',
    icon: '💰'
  }
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
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

  // Load categories from API
  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setErrors({ load: 'Failed to load categories. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || category.type === filterType;
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
    setFormData(prev => ({ ...prev, type: String(type) }));
    if (errors.type) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.type;
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
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Category name must be less than 50 characters';
    }
    
    if (!formData.type) {
      newErrors.type = 'Category type is required';
    }
    
    if (!formData.color) {
      newErrors.color = 'Category color is required';
    }
    
    return newErrors;
  };

  // Open form for new category
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense',
      color: '#3B82F6'
    });
    setErrors({});
    setSuccessMessage('');
    setIsOffCanvasOpen(true);
  };

  // Open form for editing
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color || '#3B82F6'
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
      const url = editingCategory 
        ? `${API_URL}/categories/${editingCategory.id}`
        : `${API_URL}/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save category');
      }
      
      setSuccessMessage(data.message || 'Category saved successfully!');
      
      // Reload categories
      await loadCategories();
      
      setTimeout(() => {
        setSuccessMessage('');
        setIsOffCanvasOpen(false);
      }, 2000);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save category';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (category: Category) => {
    // Check if category has expenses
    if (category._count?.expenses && category._count.expenses > 0) {
      const confirmed = window.confirm(
        `This category has ${category._count.expenses} expenses. Are you sure you want to delete it?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm('Are you sure you want to delete this category?');
      if (!confirmed) return;
    }
    
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category');
      }
      
      // Reload categories
      await loadCategories();
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category';
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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <Button onClick={handleAddNew}>
          Add New Category
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
                onClick={loadCategories}
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
              placeholder="Search categories..."
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
              <option value="expense">Expense</option>
              <option value="savings">Savings</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Categories Table */}
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
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Updated</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm || filterType ? 'No categories match your filters' : 'No categories found'}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3 flex-shrink-0 border border-gray-200"
                            style={{ backgroundColor: category.color || '#6B7280' }}
                          ></div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.type === 'savings' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.type === 'savings' ? '💰 Savings' : '💸 Expense'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatDate(category.updatedAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
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
        )}
      </Card>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-600">Total Categories</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {categories.filter(cat => cat.type === 'expense').length}
            </div>
            <div className="text-sm text-gray-600">Expense Categories</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(cat => cat.type === 'savings').length}
            </div>
            <div className="text-sm text-gray-600">Savings Categories</div>
          </div>
        </Card>
      </div>

      {/* OffCanvas Form */}
      <OffCanvas
        isOpen={isOffCanvasOpen}
        onClose={() => setIsOffCanvasOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
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
                ? (editingCategory ? 'Updating...' : 'Creating...') 
                : (editingCategory ? 'Update Category' : 'Create Category')
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

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter category name"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Type <span className="text-red-500">*</span>
            </label>
            <SearchableSelector
              options={categoryTypeOptions}
              value={formData.type}
              onChange={handleTypeChange}
              placeholder="Select category type"
              error={errors.type}
              searchPlaceholder="Search types..."
              required
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Color <span className="text-red-500">*</span>
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
                    {formData.name || 'Category Name'}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                    formData.type === 'savings' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.type === 'savings' ? '💰 Savings' : '💸 Expense'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </OffCanvas>
    </>
  );
}