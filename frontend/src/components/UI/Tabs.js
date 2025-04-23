import { useState } from 'react';

export default function Tabs({ 
  tabs, 
  defaultActiveIndex = 0,
  onChange = () => {},
  variant = 'default', // 'default', 'pills', 'underline'
  orientation = 'horizontal', // 'horizontal', 'vertical'
  className = ''
}) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  
  const handleTabClick = (index) => {
    setActiveIndex(index);
    onChange(index);
  };
  
  const tabVariants = {
    default: `border-b border-gray-200`,
    pills: ``,
    underline: ``
  };
  
  const tabListClasses = {
    default: {
      horizontal: `flex border-b border-gray-200`,
      vertical: `flex flex-col border-r border-gray-200`
    },
    pills: {
      horizontal: `flex space-x-2`,
      vertical: `flex flex-col space-y-2`
    },
    underline: {
      horizontal: `flex`,
      vertical: `flex flex-col`
    }
  };
  
  const tabClasses = {
    default: {
      horizontal: {
        active: `py-3 px-4 border-b-2 border-indigo-500 text-indigo-600 font-medium -mb-px`,
        inactive: `py-3 px-4 text-gray-500 hover:text-gray-700 font-medium`
      },
      vertical: {
        active: `py-3 px-4 border-r-2 border-indigo-500 text-indigo-600 font-medium -mr-px`,
        inactive: `py-3 px-4 text-gray-500 hover:text-gray-700 font-medium`
      }
    },
    pills: {
      horizontal: {
        active: `py-2 px-4 bg-indigo-500 text-white font-medium rounded-md`,
        inactive: `py-2 px-4 text-gray-700 hover:bg-gray-100 font-medium rounded-md`
      },
      vertical: {
        active: `py-2 px-4 bg-indigo-500 text-white font-medium rounded-md`,
        inactive: `py-2 px-4 text-gray-700 hover:bg-gray-100 font-medium rounded-md`
      }
    },
    underline: {
      horizontal: {
        active: `py-3 px-4 border-b-2 border-indigo-500 text-indigo-600 font-medium`,
        inactive: `py-3 px-4 text-gray-500 hover:text-gray-700 font-medium`
      },
      vertical: {
        active: `py-3 px-4 border-l-2 border-indigo-500 text-indigo-600 font-medium`,
        inactive: `py-3 px-4 text-gray-500 hover:text-gray-700 font-medium`
      }
    }
  };
  
  return (
    <div className={`${orientation === 'vertical' ? 'flex' : 'block'} ${className}`}>
      <div className={`${tabListClasses[variant][orientation]}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`${
              index === activeIndex 
                ? tabClasses[variant][orientation].active 
                : tabClasses[variant][orientation].inactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={`${orientation === 'vertical' ? 'flex-1 pl-4' : 'mt-4'}`}>
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}