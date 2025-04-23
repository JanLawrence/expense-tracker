import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({
  children,
  variant = 'info',
  title = null,
  icon = true,
  dismissible = false,
  onDismiss = () => {},
  duration = 0, // 0 means the alert will not auto-dismiss
  className = ''
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!visible) return null;

  const baseStyles = 'p-4 rounded-md';
  
  const variantStyles = {
    info: 'bg-blue-50 border border-blue-200 text-blue-800',
    success: 'bg-green-50 border border-green-200 text-green-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border border-red-200 text-red-800'
  };
  
  const variantIcon = {
    info: <Info size={20} className="text-blue-500" />,
    success: <CheckCircle size={20} className="text-green-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
    danger: <XCircle size={20} className="text-red-500" />
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} role="alert">
      <div className="flex">
        {icon && <div className="flex-shrink-0 mr-3">{variantIcon[variant]}</div>}
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button 
            type="button" 
            className="flex-shrink-0 ml-3 -mr-1 -mt-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}