"use client";

import { useState } from 'react';

// Define category type
interface Category {
  name: string;
  type: string;
  color: string;
}

interface CategoryManagementProps {
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
}

// Available colors for categories
const categoryColors = [
  "#FF5722", "#2196F3", "#9C27B0", "#4CAF50", 
  "#607D8B", "#E91E63", "#3F51B5", "#FFC107", 
  "#00BCD4", "#8BC34A", "#FF9800", "#9E9E9E"
];

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

const CategoryManagement = ({ selectedCategories, onCategoryChange }: CategoryManagementProps) => {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    type: 'EXPENSE',
    color: categoryColors[0]
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Toggle category selection
  const toggleCategory = (category: Category) => {
    if (selectedCategories.some(cat => cat.name === category.name)) {
      onCategoryChange(selectedCategories.filter(cat => cat.name !== category.name));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  // Add new custom category
  const handleAddCategory = () => {
    if (!newCategory.name?.trim()) return;
    
    const customCategory: Category = {
      name: newCategory.name.trim(),
      type: newCategory.type || 'EXPENSE',
      color: newCategory.color || categoryColors[0]
    };
    
    onCategoryChange([...selectedCategories, customCategory]);
    
    // Reset form
    setNewCategory({
      name: '',
      type: 'EXPENSE',
      color: categoryColors[0]
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Categories
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {defaultCategories.map(category => (
            <div
              key={category.name}
              onClick={() => toggleCategory(category)}
              className={`p-2 rounded cursor-pointer border ${
                selectedCategories.some(cat => cat.name === category.name)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm">{category.name}</span>
                <span className="text-xs ml-auto text-gray-500">
                  {category.type === 'EXPENSE' ? 'Exp' : 'Inc'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom category section */}
      {showAddForm ? (
        <div className="mt-4 border border-gray-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add Custom Category</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Category name"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">Color</label>
              <div className="flex flex-wrap gap-1">
                {categoryColors.map(color => (
                  <div
                    key={color}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-6 h-6 rounded-full cursor-pointer ${
                      newCategory.color === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Custom Category
        </button>
      )}
      
      {/* Selected categories summary */}
      {selectedCategories.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Categories ({selectedCategories.length})</h4>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map(category => (
              <div 
                key={category.name} 
                className="px-2 py-1 bg-gray-100 text-xs rounded-full flex items-center"
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: category.color }}
                ></div>
                {category.name}
                <button
                  onClick={() => toggleCategory(category)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;