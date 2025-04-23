import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function TextField({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error = null,
  helperText = null,
  disabled = false,
  required = false,
  fullWidth = true,
  startIcon = null,
  endIcon = null,
  className = '',
  inputClassName = '',
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
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
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`
            w-full rounded-md shadow-sm 
            ${variantClasses[variant]} 
            ${sizeClasses[size]} 
            ${startIcon ? 'pl-10' : ''} 
            ${endIcon || type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {(endIcon || type === 'password') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={toggleShowPassword}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            ) : (
              endIcon
            )}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}