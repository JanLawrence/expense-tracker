import { CheckCircle, XCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

export default function Alert({
  type = 'info', // 'info', 'success', 'warning', 'error'
  title = null,
  message,
  icon = true,
  dismissible = false,
  onDismiss = () => {},
  className = ''
}) {
  const alertTypes = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <AlertCircle size={20} className="text-blue-500" />
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
      icon: <XCircle size={20} className="text-red-500" />
    }
  };
  
  const currentType = alertTypes[type];
  
  return (
    <div className={`p-4 rounded-md border ${currentType.bg} ${currentType.border} ${className}`}>
      <div className="flex">
        {icon && (
          <div className="flex-shrink-0">
            {currentType.icon}
          </div>
        )}
        <div className={`${icon ? 'ml-3' : ''} flex-1`}>
          {title && <h3 className={`text-sm font-medium ${currentType.text}`}>{title}</h3>}
          <div className={`${title ? 'mt-2' : ''} text-sm ${currentType.text}`}>
            {message}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${currentType.bg} text-gray-500 hover:bg-gray-100 focus:outline-none`}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}