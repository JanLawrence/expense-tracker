import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function Collapse({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={`border border-gray-200 rounded-md ${className}`}>
      <button
        className={`w-full flex items-center justify-between p-4 text-left ${headerClassName}`}
        onClick={toggle}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {isOpen && (
        <div className={`p-4 border-t border-gray-200 ${bodyClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
}