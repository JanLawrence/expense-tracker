"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function OffCanvas({
  isOpen,
  onClose,
  children,
  title = '',
  position = 'right', // 'right', 'left', 'top', 'bottom'
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  mobilePosition = '', // Override position on mobile if needed
  mobileSize = '', // Override size on mobile if needed
  mobileFullscreen = false, // Force fullscreen on mobile
  backdrop = true,
  closeOnBackdropClick = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  showCloseButton = true,
  renderFooter = null,
}) {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Set browser state on mount and add resize listener
  useEffect(() => {
    setIsBrowser(true);
    
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard md breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Handle component visibility when open/close changes
  useEffect(() => {
    if (isOpen) {
      // First render the component
      setIsRendered(true);
      
      // Then trigger the animation after a small delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      return () => clearTimeout(timer);
    } else {
      // First hide the panel (animate out)
      setIsVisible(false);
      
      // Then remove it from DOM after animation completes
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300); // Must match transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Get actual position (respecting mobile override)
  const getActivePosition = () => {
    if (isMobile && mobilePosition) {
      return mobilePosition;
    }
    if (isMobile && mobileFullscreen) {
      return 'full';
    }
    return position;
  };
  
  // Get actual size (respecting mobile override)
  const getActiveSize = () => {
    if (isMobile && mobileSize) {
      return mobileSize;
    }
    if (isMobile && mobileFullscreen) {
      return 'full';
    }
    return size;
  };
  
  // Size classes
  const getSizeClass = () => {
    const currentPosition = getActivePosition();
    const currentSize = getActiveSize();
    
    // Modified sizes with better mobile handling
    const sizes = {
      right: {
        sm: isMobile ? 'w-3/4' : 'w-64',
        md: isMobile ? 'w-4/5' : 'w-80',
        lg: isMobile ? 'w-5/6' : 'w-96',
        xl: isMobile ? 'w-11/12' : 'w-1/3',
        full: 'w-full',
      },
      left: {
        sm: isMobile ? 'w-3/4' : 'w-64',
        md: isMobile ? 'w-4/5' : 'w-80',
        lg: isMobile ? 'w-5/6' : 'w-96',
        xl: isMobile ? 'w-11/12' : 'w-1/3',
        full: 'w-full',
      },
      top: {
        sm: isMobile ? 'h-1/4' : 'h-1/6',
        md: isMobile ? 'h-1/3' : 'h-1/4',
        lg: isMobile ? 'h-1/2' : 'h-1/3',
        xl: isMobile ? 'h-3/4' : 'h-1/2',
        full: 'h-full',
      },
      bottom: {
        sm: isMobile ? 'h-1/4' : 'h-1/6',
        md: isMobile ? 'h-1/3' : 'h-1/4',
        lg: isMobile ? 'h-1/2' : 'h-1/3',
        xl: isMobile ? 'h-3/4' : 'h-1/2',
        full: 'h-full',
      },
      full: {
        sm: 'w-full h-full',
        md: 'w-full h-full',
        lg: 'w-full h-full',
        xl: 'w-full h-full',
        full: 'w-full h-full',
      },
    };
    
    return sizes[currentPosition][currentSize];
  };
  
  // Get position classes
  const getPositionClass = () => {
    const currentPosition = getActivePosition();
    
    switch (currentPosition) {
      case 'right': return 'top-0 right-0 h-full';
      case 'left': return 'top-0 left-0 h-full';
      case 'top': return 'top-0 left-0 w-full';
      case 'bottom': return 'bottom-0 left-0 w-full';
      case 'full': return 'inset-0'; // Full screen position
      default: return 'top-0 right-0 h-full';
    }
  };
  
  // Get transform classes based on position and open state
  const getTransformClass = () => {
    const baseTransform = 'transform transition-transform duration-300 ease-in-out';
    const currentPosition = getActivePosition();
    
    if (isVisible) {
      return `${baseTransform} translate-x-0 translate-y-0`;
    }
    
    switch (currentPosition) {
      case 'right': return `${baseTransform} translate-x-full`;
      case 'left': return `${baseTransform} -translate-x-full`;
      case 'top': return `${baseTransform} -translate-y-full`;
      case 'bottom': return `${baseTransform} translate-y-full`;
      case 'full': return `${baseTransform} scale-95 opacity-0`; // Zoom effect for fullscreen
      default: return `${baseTransform} translate-x-full`;
    }
  };
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };
  
  // Determine if horizontal or vertical panel
  const isHorizontal = getActivePosition() === 'left' || getActivePosition() === 'right';
  const isFullScreen = getActivePosition() === 'full';
  
  // Don't render on server or if not needed
  if (!isBrowser || (!isRendered && !isOpen)) {
    return null;
  }

  // Adjust title size for mobile
  const titleClass = isMobile ? 'text-base' : 'text-lg';
  
  const offCanvasContent = (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      {backdrop && (
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'opacity-50' : 'opacity-0'}`}
          onClick={handleBackdropClick}
        />
      )}
      
      {/* Panel */}
      <div 
        className={`
          fixed ${getPositionClass()} ${getSizeClass()}
          ${getTransformClass()}
          bg-white shadow-lg overflow-hidden
          ${isFullScreen ? 'rounded-none' : ''}
          ${className}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          <h3 className={`${titleClass} font-medium text-gray-900`}>{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 p-1 rounded-md cursor-pointer"
              aria-label="Close panel"
            >
              <svg className={`${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className={`
          ${isHorizontal && !isFullScreen ? 'h-[calc(100%-4rem)]' : ''}
          ${isFullScreen ? 'flex-grow overflow-auto' : ''}
          overflow-y-auto p-4 
          ${bodyClassName}
        `}>
          {children}
        </div>
        
        {/* Footer */}
        {renderFooter && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            {renderFooter}
          </div>
        )}
      </div>
    </div>
  );
  
  // Use portal to render at the document body level
  return createPortal(
    offCanvasContent,
    document.body
  );
}