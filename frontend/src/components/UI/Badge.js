
  
  // components/UI/Badge.js
  export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    rounded = false,
    dot = false,
    className = ''
  }) {
    const baseStyles = 'inline-flex items-center font-medium';
    
    const sizeStyles = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm'
    };
    
    const variantStyles = {
      primary: 'bg-indigo-100 text-indigo-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      light: 'bg-gray-100 text-gray-600',
      dark: 'bg-gray-700 text-white'
    };
    
    const roundedStyles = rounded ? 'rounded-full' : 'rounded';
    
    return (
      <span className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${roundedStyles}
        ${className}
      `}>
        {dot && <span className={`inline-block h-2 w-2 rounded-full mr-1.5 bg-${variant === 'light' ? 'gray-600' : variant}-500`}></span>}
        {children}
      </span>
    );
  }