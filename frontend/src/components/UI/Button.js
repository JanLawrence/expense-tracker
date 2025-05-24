import React from 'react';
import Link from 'next/link';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  href = null,
  as = null,
  target = null,
  replace = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors';
  
  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base'
  };
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    light: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-2 focus:ring-gray-800 focus:ring-offset-2',
    link: 'bg-transparent text-primary-600 hover:text-primary-800 hover:underline p-0',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const fullWidthStyles = 'w-full';
  
  const allClassNames = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? disabledStyles : ''}
    ${fullWidth ? fullWidthStyles : ''}
    ${className}
  `;
  
  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );
  
  // If href is provided, render as a Next.js Link
  if (href && !disabled) {
    return (
      <Link 
        href={href}
        as={as}
        replace={replace}
        {...props}
        passHref
        legacyBehavior
      >
        <a 
          className={allClassNames}
          onClick={onClick}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {buttonContent}
        </a>
      </Link>
    );
  }
  
  // Otherwise render as a regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={allClassNames}
      {...props}
    >
      {buttonContent}
    </button>
  );
}