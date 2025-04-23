import { Fragment } from 'react';
import { X } from 'lucide-react';

export default function Drawer({
  isOpen,
  onClose,
  title = null,
  children,
  footer = null,
  position = 'right', // 'right', 'left', 'top', 'bottom'
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  closeOnEsc = true,
  closeOnOverlayClick = true,
  hideCloseButton = false,
  className = ''
}) {
  if (!isOpen) return null;
  
  const handleKeyDown = (e) => {
    if (closeOnEsc && e.key === 'Escape') {
      onClose();
    }
  };
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const positionClasses = {
    right: 'inset-y-0 right-0 h-full transform translate-x-full',
    left: 'inset-y-0 left-0 h-full transform -translate-x-full',
    top: 'inset-x-0 top-0 w-full transform -translate-y-full',
    bottom: 'inset-x-0 bottom-0 w-full transform translate-y-full'
  };
  
  const sizeClasses = {
    right: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-1/3'
    },
    left: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-1/3'
    },
    top: {
      sm: 'h-1/6',
      md: 'h-1/4',
      lg: 'h-1/3',
      xl: 'h-1/2'
    },
    bottom: {
      sm: 'h-1/6',
      md: 'h-1/4',
      lg: 'h-1/3',
      xl: 'h-1/2'
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className={`
          fixed ${positionClasses[position]} ${sizeClasses[position][size]}
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 translate-y-0' : ''}
          bg-white shadow-xl flex flex-col
          ${className}
        `}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {!hideCloseButton && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}