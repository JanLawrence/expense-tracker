import { useState, useRef, useEffect } from 'react';

export default function Tooltip({
  children,
  content,
  position = 'top', // 'top', 'right', 'bottom', 'left'
  delay = 300, // Delay in ms
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);
  let timeout = null;
  
  const showTooltip = () => {
    timeout = setTimeout(() => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        let top = 0;
        let left = 0;
        
        if (position === 'top') {
          top = rect.top + scrollTop - (tooltipRef.current?.offsetHeight || 0) - 8;
          left = rect.left + scrollLeft + rect.width / 2;
        } else if (position === 'right') {
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.right + scrollLeft + 8;
        } else if (position === 'bottom') {
          top = rect.bottom + scrollTop + 8;
          left = rect.left + scrollLeft + rect.width / 2;
        } else if (position === 'left') {
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.left + scrollLeft - (tooltipRef.current?.offsetWidth || 0) - 8;
        }
        
        setCoords({ top, left });
        setIsVisible(true);
      }
    }, delay);
  };
  
  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };
  
  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  
  const positionClasses = {
    top: 'transform -translate-x-1/2 -translate-y-full',
    right: 'transform translate-y-[-50%])',
    bottom: 'transform -translate-x-1/2',
    left: 'transform -translate-x-full translate-y-[-50%])'
  };
  
  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} ref={targetRef}>
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg ${positionClasses[position]} ${className}`}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`
          }}
        >
          {content}
          <div className={`tooltip-arrow ${position}`}></div>
        </div>
      )}
    </div>
  );
}