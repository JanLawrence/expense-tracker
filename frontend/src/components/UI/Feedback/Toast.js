import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({
  type = 'info', // 'info', 'success', 'warning', 'error'
  title = null,
  message,
  duration = 5000, // Duration in milliseconds, 0 for persistent
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
  onClose = () => {},
  className = ''
}) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  const toastTypes = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info size={20} className="text-blue-500" />
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle size={20} className="text-green-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertTriangle size={20} className="text-yellow-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle size={20} className="text-red-500" />
    }
  };
  
  const currentType = toastTypes[type];
  
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
  };
  
  return (
    <div className={`fixed m-4 z-50 ${positionClasses[position]} ${className}`}>
      <div className={`p-4 rounded-md shadow-lg border ${currentType.bg} ${currentType.border} max-w-sm`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {currentType.icon}
          </div>
          <div className="ml-3 flex-1">
            {title && <h3 className={`text-sm font-medium ${currentType.text}`}>{title}</h3>}
            <div className={`${title ? 'mt-1' : ''} text-sm ${currentType.text}`}>
              {message}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500`}
              onClick={() => {
                setVisible(false);
                onClose();
              }}
            >
              <span className="sr-only">Close</span>
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}