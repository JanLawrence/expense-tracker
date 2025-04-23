import { useState } from 'react';
import { Bell, Menu, Search } from 'lucide-react';

export default function Navbar({
  onToggleSidebar = () => {},
  actions = null,
  search = true,
  notifications = true,
  profile = null,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <header className={`bg-white shadow ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-md lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu size={24} />
          </button>
          
          {/* Search Bar */}
          {search && (
            <div className="hidden md:flex items-center border rounded-md px-3 py-1 mx-4 flex-grow max-w-xl">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-2 py-1 focus:outline-none"
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
            <button className="p-1 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
          
          {/* Profile */}
          {profile}
        </div>
      </div>
    </header>
  );
}