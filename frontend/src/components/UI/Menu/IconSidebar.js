"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  X,
  Info
} from 'lucide-react';

export default function IconSidebar({
  logo = null,
  items = [],
  isOpen = false,
  onClose = () => {},
  footer = null,
  avatarSection = null,
  theme = 'light', // 'dark', 'light'
  className = '',
  width = '16', // w-16 by default for icon-only sidebar
  showTooltips = true
}) {
  const [expandedItems, setExpandedItems] = useState([]);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipData, setTooltipData] = useState({ text: '', x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const menuItemsRef = useRef({});
  
  // Handle client-side mounting for the portal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  const toggleItem = (index) => {
    setExpandedItems(prevExpanded => {
      if (prevExpanded.includes(index)) {
        return prevExpanded.filter(item => item !== index);
      } else {
        return [...prevExpanded, index];
      }
    });
  };
  
  const handleMouseEnter = (id, text) => {
    if (!showTooltips) return;
    
    setActiveTooltip(id);
    
    const element = menuItemsRef.current[id];
    if (element) {
      const rect = element.getBoundingClientRect();
      setTooltipData({
        text,
        x: rect.right + 10, // Position to the right of the sidebar
        y: rect.top + rect.height / 2 // Center vertically
      });
    }
  };
  
  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };
  
  const themeClasses = {
    dark: {
      sidebar: 'bg-[var(--page-bg-dark)] text-white',
      header: 'border-slate-700',
      item: 'text-gray-300 hover:bg-slate-700 hover:text-white',
      activeItem: 'bg-indigo-700 text-white',
      submenuItem: 'text-gray-300 hover:bg-slate-700 hover:text-white',
      tooltip: 'bg-[var(--primary)] text-white'
    },
    light: {
      sidebar: 'bg-[var(--primary)] border-gray-200',
      header: 'border-gray-200',
      item: 'text-gray-50 hover:bg-gray-50/10 hover:text-gray-100',
      activeItem: 'bg-gray-50 text-[var(--primary)]',
      submenuItem: 'text-gray-600 hover:bg-gray-100 hover:text-gray-100',
      tooltip: 'bg-[var(--primary)] text-white'
    }
  };
  
  // Tooltip portal component
  const Tooltip = () => {
    if (!isMounted || !activeTooltip) return null;
    
    return createPortal(
      <div 
        className={`fixed px-2 py-1 text-sm rounded-md whitespace-nowrap z-50 ${themeClasses[theme].tooltip}`}
        style={{ 
          left: `${tooltipData.x}px`, 
          top: `${tooltipData.y}px`, 
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        {tooltipData.text}
      </div>,
      document.body
    );
  };
  
  return (
    <>
      {/* Tooltip rendered at body level */}
      <Tooltip />
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/80 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-${width} transform transition-transform duration-300 ease-in-out md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${themeClasses[theme].sidebar}
          ${className}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-center h-16 ${themeClasses[theme].header}`}>
          <div className="flex items-center justify-center text-white">
            {logo || <span className="text-xl font-semibold">D</span>}
          </div>
          <button 
            className="absolute right-2 p-1 rounded-md lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Avatar Section */}
        {avatarSection && (
          <div className="flex justify-center p-2">
            {avatarSection}
          </div>
        )}
        
        {/* Navigation */}
        <div className="overflow-y-auto h-full">
          <nav className="space-y-1">
            {items.map((item, index) => (
              <div key={index} className="relative mb-0">
                {item.submenu ? (
                  <div>
                    <button 
                      ref={el => menuItemsRef.current[`item-${index}`] = el}
                      onClick={() => toggleItem(index)} 
                      onMouseEnter={() => handleMouseEnter(`item-${index}`, item.label)}
                      onMouseLeave={handleMouseLeave}
                      className={`
                        flex items-center justify-center w-full p-2 rounded-md 
                        ${themeClasses[theme].item} transition-colors
                      `}
                    >
                      <div className="flex items-center justify-center">
                        {item.icon || <Info size={22} />}
                      </div>
                    </button>
                    
                    {expandedItems.includes(index) && (
                      <div className="mt-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex} 
                            href={subItem.href}
                            ref={el => menuItemsRef.current[`subitem-${index}-${subIndex}`] = el}
                            className={`
                              flex items-center justify-center p-2 rounded-md relative
                              ${themeClasses[theme].submenuItem} transition-colors
                              ${subItem.active ? themeClasses[theme].activeItem : ''}
                            `}
                            onMouseEnter={() => handleMouseEnter(`subitem-${index}-${subIndex}`, subItem.label)}
                            onMouseLeave={handleMouseLeave}
                          >
                            {subItem.icon || <div className="h-2 w-2 rounded-full bg-current" />}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <Link 
                      href={item.href}
                      ref={el => menuItemsRef.current[`link-${index}`] = el}
                      className={`
                        flex items-center justify-center py-4 transition-colors
                        ${item.active ? themeClasses[theme].activeItem : themeClasses[theme].item}
                      `}
                      onMouseEnter={() => handleMouseEnter(`link-${index}`, item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.icon || <Info size={22} />}
                      {item.badge && (
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-2 border-t border-gray-700 flex justify-center">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}