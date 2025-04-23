export default function Switch({
    label,
    id,
    name,
    checked,
    onChange,
    error = null,
    helperText = null,
    disabled = false,
    size = 'md', // 'sm', 'md', 'lg'
    className = '',
    ...props
  }) {
    const sizeClasses = {
      sm: {
        switch: 'h-5 w-9',
        dot: 'h-3 w-3',
        translateX: 'translate-x-4'
      },
      md: {
        switch: 'h-6 w-11',
        dot: 'h-4 w-4',
        translateX: 'translate-x-5'
      },
      lg: {
        switch: 'h-7 w-14',
        dot: 'h-5 w-5',
        translateX: 'translate-x-7'
      }
    };
    
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <button
              id={id}
              type="button"
              role="switch"
              aria-checked={checked}
              data-state={checked ? 'checked' : 'unchecked'}
              disabled={disabled}
              onClick={() => onChange(!checked)}
              className={`
                relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${sizeClasses[size].switch}
                ${checked ? 'bg-indigo-600' : 'bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              {...props}
            >
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${sizeClasses[size].dot}
                  ${checked ? sizeClasses[size].translateX : 'translate-x-0'}
                `}
              />
            </button>
            {label && (
              <label 
                htmlFor={id} 
                className={`ml-3 text-sm font-medium ${disabled ? 'text-gray-400' : error ? 'text-red-600' : 'text-gray-700'}`}
              >
                {label}
              </label>
            )}
          </div>
          {(error || helperText) && (
            <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
              {error || helperText}
            </p>
          )}
        </div>
      </div>
    );
  }