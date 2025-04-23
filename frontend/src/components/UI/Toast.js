import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function Toast({
  message,
  type = 'info', // 'info', 'success', 'warning', 'error'
  duration = 3000, // Duration in ms, 0 for persistent
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
  onClose = () => {}
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
  
  const handleClose = () => {
    setVisible(false);
    onClose();
  };
  
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  const typeIcons = {
    info: <Info size={20} className="text-blue-500" />,
    success: <CheckCircle size={20} className="text-green-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
    error: <AlertCircle size={20} className="text-red-500" />
  };
  
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
  };
  
  return (
    <div className={`fixed m-4 z-50 ${positionClasses[position]}`}>
      <div className={`p-4 rounded-md shadow-lg border ${typeClasses[type]} flex items-start transition-all duration-500 max-w-sm`}>
        <div className="flex-shrink-0 mr-3">
          {typeIcons[type]}
        </div>
        <div className="flex-1 mr-2">
          {message}
        </div>
        <button 
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}