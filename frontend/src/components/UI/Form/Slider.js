import { useRef, useState } from 'react';

export default function Slider({
  label,
  id,
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks = [],
  showValue = true,
  error = null,
  helperText = null,
  disabled = false,
  className = '',
  ...props
}) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const handleInputChange = (e) => {
    onChange(Number(e.target.value));
  };
  
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label 
            htmlFor={id} 
            className={`block text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}
          >
            {label}
          </label>
        )}
        {showValue && (
          <span className="text-sm text-gray-500">{value}</span>
        )}
      </div>
      <div className="relative" ref={sliderRef} onMouseDown={handleMouseDown}>
        <div 
          className={`h-2 bg-gray-200 rounded-full ${disabled ? 'opacity-50' : ''}`}
        >
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          id={id}
          name={name}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-5 bg-white border border-gray-300 rounded-full shadow ${
            disabled ? 'cursor-not-allowed' : 'cursor-grab'
          } ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{ left: `${percentage}%` }}
        />
        {marks.length > 0 && (
          <div className="flex justify-between mt-2">
            {marks.map((mark) => (
              <div 
                key={mark.value} 
                className="flex flex-col items-center" 
                style={{ 
                  left: `${((mark.value - min) / (max - min)) * 100}%`,
                  position: 'absolute'
                }}
              >
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                {mark.label && (
                  <span className="mt-1 text-xs text-gray-500">{mark.label}</span>
                )}
              </div>
            ))}
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