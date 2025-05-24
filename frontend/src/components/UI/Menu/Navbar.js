"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Menu, Search, ChevronRight, Globe, Moon, Users, User, Settings, LogOut } from 'lucide-react';
import Avatar from '@/components/UI/Avatar/Avatar'; // Make sure this path is correct
import { getUserInitials } from '@/services/Helpers'

export default function Navbar({
  onToggleSidebar = () => {},
  actions = null,
  search = true,
  notifications = true,
  profile = null,
  className = '',
  userName = 'Cody Fisher',
  userEmail = 'c.fisher@gmail.com',
  userAvatar = null,
  logout = () => {},
  theme = 'light' // 'dark', 'light'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Theme classes similar to IconSidebar
  const themeClasses = {
    dark: {
      navbar: 'bg-[var(--page-bg-dark)] text-white border-slate-700 shadow-md',
      search: 'bg-slate-700 border-slate-600 text-gray-200',
      searchIcon: 'text-gray-400',
      searchInput: 'bg-transparent text-gray-200 placeholder-gray-400',
      button: 'hover:bg-slate-700 text-gray-300',
      dropdown: 'bg-slate-800 shadow-lg',
      dropdownBorder: 'border-slate-700',
      dropdownItem: 'hover:bg-slate-700 text-gray-300',
      dropdownText: 'text-gray-400',
      toggle: 'bg-slate-600',
      toggleButton: 'bg-slate-400'
    },
    light: {
      navbar: 'bg-white text-gray-800 border-gray-200 shadow',
      search: 'bg-gray-50 border border-gray-200 text-gray-700',
      searchIcon: 'text-gray-400',
      searchInput: 'bg-transparent text-gray-700 placeholder-gray-500',
      button: 'hover:bg-gray-100 text-gray-600',
      dropdown: 'bg-white shadow-lg',
      dropdownBorder: 'border-gray-100',
      dropdownItem: 'hover:bg-gray-50 text-gray-700',
      dropdownText: 'text-gray-500',
      toggle: 'bg-gray-200',
      toggleButton: 'bg-white'
    }
  };
  
  // Get user initials from name
  
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  
  return (
    <header className={`${themeClasses[theme].navbar} ${className}`}>
      <div className={`flex items-center justify-between fixed z-10 top-0 left-0 right-0 shrink-0 z-30 h-16 px-4 md:pl-16 h-[var(--header-height)] ${themeClasses[theme].navbar}`}>
        <div className="flex items-center">
          <button 
            className={`p-2 rounded-md lg:hidden ${themeClasses[theme].button}`}
            onClick={onToggleSidebar}
          >
            <Menu size={24} />
          </button>
          
          {/* Search Bar */}
          {search && (
            <div className={`hidden md:flex items-center rounded-md px-3 py-1 mx-4 flex-grow max-w-xl ${themeClasses[theme].search}`}>
              <Search size={18} className={themeClasses[theme].searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full px-2 py-1 focus:outline-none ${themeClasses[theme].searchInput}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {actions}
          
          {/* Notifications */}
          {notifications && (
            <button className={`p-1 rounded-full ${themeClasses[theme].button} relative cursor-pointer`} type="button">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
          
          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none cursor-pointer"
            >
              <Avatar 
                src={userAvatar} 
                alt={userName}
                initials={getUserInitials(userName)}
                size="sm"
              />
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-md py-1 z-50 ${themeClasses[theme].dropdown}`}>
                {/* User Info */}
                <div className={`px-4 py-3 border-b ${themeClasses[theme].dropdownBorder}`}>
                  <div className="flex items-center">
                    <Avatar 
                      src={userAvatar} 
                      alt={userName}
                      initials={getUserInitials(userName)}
                      size="md"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{userName}</div>
                      <div className={`text-sm ${themeClasses[theme].dropdownText}`}>{userEmail}</div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  {/* <button className={`w-full text-left px-4 py-2 flex items-center cursor-pointer ${themeClasses[theme].dropdownItem}`}>
                    <User className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                    <span>My Profile</span>
                  </button> */}

                  <Link 
                    href={'/account/overview'}
                    className={`
                      w-full text-left px-4 py-2 flex items-center cursor-pointer ${themeClasses[theme].dropdownItem}
                    `}
                  >
                    <User className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                    My Profile
                  </Link>
                  <button className={`w-full text-left px-4 py-2 flex items-center justify-between cursor-pointer ${themeClasses[theme].dropdownItem}`}>
                    <div className="flex items-center">
                      <Moon className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                      <span>Dark Mode</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 ${themeClasses[theme].toggle}`}>
                      <div className={`w-4 h-4 rounded-full ${themeClasses[theme].toggleButton}`}></div>
                    </div>
                  </button>
                  {/* <button className={`w-full text-left px-4 py-2 flex items-center justify-between cursor-pointer ${themeClasses[theme].dropdownItem}`}>
                    <div className="flex items-center">
                      <Settings className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                      <span>My Account</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${themeClasses[theme].dropdownText}`} />
                  </button> */}
                </div>
                
                {/* Language Selection */}
                {/* <div className={`py-1 border-t ${themeClasses[theme].dropdownBorder}`}>
                  <button className={`w-full text-left px-4 py-2 flex items-center justify-between cursor-pointer ${themeClasses[theme].dropdownItem}`}>
                    <div className="flex items-center">
                      <Globe className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                      <span>Language</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-sm mr-1 ${themeClasses[theme].dropdownText}`}>English</span>
                      <span className="w-6 h-4 rounded overflow-hidden flex items-center justify-center">
                        🇺🇸
                      </span>
                    </div>
                  </button>
                </div> */}
                
                {/* Dark Mode Toggle */}
                {/* <div className={`py-1 border-t ${themeClasses[theme].dropdownBorder}`}>
                  <button className={`w-full text-left px-4 py-2 flex items-center justify-between cursor-pointer ${themeClasses[theme].dropdownItem}`}>
                    <div className="flex items-center">
                      <Moon className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                      <span>Dark Mode</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 ${themeClasses[theme].toggle}`}>
                      <div className={`w-4 h-4 rounded-full ${themeClasses[theme].toggleButton}`}></div>
                    </div>
                  </button>
                </div> */}
                
                {/* Logout */}
                <div className={`py-1 border-t ${themeClasses[theme].dropdownBorder}`}>
                  <button className={`w-full text-left px-4 py-2 flex items-center cursor-pointer ${themeClasses[theme].dropdownItem}`} onClick={logout}>
                    <LogOut className={`w-5 h-5 mr-3 ${themeClasses[theme].dropdownText}`} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}