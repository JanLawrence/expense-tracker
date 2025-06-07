"use client";

import { useState, useRef, useEffect } from 'react';
import countriesData from '@/services/countries.json';

interface Country {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
}

interface CountrySelectorProps {
  value: string; // countryCode
  onChange: (countryCode: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function CountrySelector({
  value,
  onChange,
  error,
  placeholder = "Select a country",
  className = "",
  required = false
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const countries = countriesData as Country[];

  // Get selected country
  const selectedCountry = countries.find(country => country.countryCode === value);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.countryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            prev < filteredCountries.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCountries.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
            handleSelectCountry(filteredCountries[highlightedIndex]);
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
  }, [isOpen, highlightedIndex, filteredCountries]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectCountry = (country: Country) => {
    onChange(country.countryCode);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        className={`w-full px-3 py-2 border rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
      >
        <div className="flex items-center">
          {selectedCountry ? (
            <>
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.country}
                className="w-5 h-4 mr-2 object-cover rounded-sm"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-gray-900">
                {selectedCountry.country}
              </span>
              <span className="text-gray-500 ml-2 text-sm">
                ({selectedCountry.countryCode})
              </span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        
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
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(-1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Countries List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <button
                  key={country.countryCode}
                  type="button"
                  onClick={() => handleSelectCountry(country)}
                  className={`w-full px-3 py-2 text-left flex items-center hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    index === highlightedIndex ? 'bg-blue-50' : ''
                  } ${selectedCountry?.countryCode === country.countryCode ? 'bg-blue-100' : ''}`}
                >
                  <img
                    src={country.flag}
                    alt={country.country}
                    className="w-5 h-4 mr-3 object-cover rounded-sm flex-shrink-0"
                    onError={(e) => {
                      // Hide image if it fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {country.country}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {country.name} • {country.countryCode}
                    </div>
                  </div>
                  {selectedCountry?.countryCode === country.countryCode && (
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No countries found
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