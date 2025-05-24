import { useState } from 'react';

export default function Tabs({
  children,
  titles = [],
  defaultTab = 0,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  variant = 'underline', // 'underline', 'pills', or 'simple'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Ensure children is always an array
  const childrenArray = Array.isArray(children) ? children : [children];
  
  // Style variants
  const getTabStyles = (isActive) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-blue-500 text-white rounded-md'
          : 'text-gray-600 hover:bg-gray-100 rounded-md';
      case 'simple':
        return isActive
          ? 'text-blue-500 font-medium'
          : 'text-gray-500 hover:text-gray-700';
      case 'underline':
      default:
        return isActive
          ? 'text-blue-500 border-b-2 border-blue-500'
          : 'text-gray-500 hover:text-gray-700 hover:border-b hover:border-gray-300';
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`flex border-b border-gray-200 ${tabsClassName}`}>
        {titles.map((title, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium transition-colors ${getTabStyles(index === activeTab)}`}
            onClick={() => setActiveTab(index)}
            role="tab"
            aria-selected={index === activeTab}
          >
            {title}
          </button>
        ))}
      </div>
      <div className={`py-4 ${contentClassName}`}>
        {childrenArray[activeTab]}
      </div>
    </div>
  );
}