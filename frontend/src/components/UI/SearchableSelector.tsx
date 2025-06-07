"use client";

import { useState, useRef, useEffect, ReactNode } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: string | ReactNode;
  disabled?: boolean;
  [key: string]: any; // Allow additional properties
}

interface SearchableSelectorProps {
  options: SelectOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  maxHeight?: string;
  allowClear?: boolean;
  loading?: boolean;
  noOptionsText?: string;
  searchKeys?: string[]; // Keys to search in (defaults to ['label', 'description'])
  renderOption?: (option: SelectOption, isSelected: boolean, isHighlighted: boolean) => ReactNode;
  renderSelected?: (option: SelectOption | null) => ReactNode;
}

export default function SearchableSelector({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search options...",
  error,
  className = "",
  required = false,
  disabled = false,
  multiple = false,
  maxHeight = "12rem", // max-h-48
  allowClear = false,
  loading = false,
  noOptionsText = "No options found",
  searchKeys = ['label', 'description'],
  renderOption,
  renderSelected
}: SearchableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get selected option(s)
  const selectedOption = options.find(option => option.value === value) || null;

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return searchKeys.some(key => {
      const optionValue = option[key];
      return optionValue && String(optionValue).toLowerCase().includes(searchLower);
    });
  }).filter(option => !option.disabled);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectOption = (option: SelectOption) => {
    if (option.disabled) return;
    
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Default option renderer
  const defaultRenderOption = (option: SelectOption, isSelected: boolean, isHighlighted: boolean) => (
    <div className="flex items-center">
      {option.icon && (
        <div className="flex-shrink-0 mr-3">
          {typeof option.icon === 'string' ? (
            <img
              src={option.icon}
              alt=""
              className="w-5 h-4 object-cover rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            option.icon
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {option.label}
        </div>
        {option.description && (
          <div className="text-xs text-gray-500 truncate">
            {option.description}
          </div>
        )}
      </div>
      {isSelected && (
        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );

  // Default selected renderer
  const defaultRenderSelected = (option: SelectOption | null) => {
    if (!option) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    return (
      <div className="flex items-center">
        {option.icon && (
          <div className="flex-shrink-0 mr-2">
            {typeof option.icon === 'string' ? (
              <img
                src={option.icon}
                alt=""
                className="w-5 h-4 object-cover rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              option.icon
            )}
          </div>
        )}
        <span className="text-gray-900 truncate">{option.label}</span>
        {option.description && (
          <span className="text-gray-500 ml-2 text-sm truncate">
            ({option.description})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''} ${
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white cursor-pointer'
        }`}
      >
        <div className="flex-1 min-w-0">
          {renderSelected ? renderSelected(selectedOption) : defaultRenderSelected(selectedOption)}
        </div>
        
        <div className="flex items-center ml-2">
          {/* Clear button */}
          {allowClear && selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 mr-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Loading spinner */}
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          ) : (
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(-1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {loading ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                  Loading...
                </div>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    disabled={option.disabled}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                      isHighlighted ? 'bg-blue-50' : ''
                    } ${isSelected ? 'bg-blue-100' : ''} ${
                      option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {renderOption ? renderOption(option, isSelected, isHighlighted) : defaultRenderOption(option, isSelected, isHighlighted)}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {noOptionsText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}