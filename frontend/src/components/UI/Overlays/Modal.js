
import { Fragment } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title = null,
  children,
  footer = null,
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
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
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}>
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
        
        <div className="px-6 py-4">
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