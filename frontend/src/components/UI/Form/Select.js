export default function Select({
    label,
    id,
    name,
    options = [],
    value,
    onChange,
    placeholder = 'Select an option',
    error = null,
    helperText = null,
    disabled = false,
    required = false,
    fullWidth = true,
    className = '',
    selectClassName = '',
    size = 'md', // 'sm', 'md', 'lg'
    variant = 'outlined', // 'outlined', 'filled', 'underlined'
    ...props
  }) {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2.5 text-lg'
    };
    
    const variantClasses = {
      outlined: 'bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
      filled: 'bg-gray-100 border border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
      underlined: 'bg-transparent border-b border-gray-300 rounded-none px-0 focus:ring-0 focus:border-indigo-500'
    };
    
    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${className}`}>
        {label && (
          <label 
            htmlFor={id} 
            className={`block text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'} mb-1`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-md shadow-sm 
            ${variantClasses[variant]} 
            ${sizeClasses[size]} 
            ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
            ${selectClassName}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }