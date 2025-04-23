export default function Card({
    children,
    title = null,
    subtitle = null,
    actions = null,
    footer = null,
    className = '',
    bodyClassName = '',
    noPadding = false
  }) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {(title || subtitle || actions) && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        <div className={`${!noPadding ? 'p-6' : ''} ${bodyClassName}`}>
          {children}
        </div>
        {footer && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    );
  }
  
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