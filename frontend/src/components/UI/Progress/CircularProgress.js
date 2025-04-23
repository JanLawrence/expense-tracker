export default function CircularProgress({
    value = 0,
    max = 100,
    showPercentage = true,
    size = 'md', // 'sm', 'md', 'lg'
    color = 'indigo', // 'indigo', 'green', 'red', 'yellow', 'blue'
    thickness = 'md', // 'sm', 'md', 'lg'
    label = null,
    className = ''
  }) {
    const percentage = Math.round((value / max) * 100);
    
    // Calculate SVG properties
    const sizeValues = {
      sm: 64,
      md: 96,
      lg: 128
    };
    
    const thicknessValues = {
      sm: 4,
      md: 6,
      lg: 8
    };
    
    const svgSize = sizeValues[size];
    const strokeWidth = thicknessValues[thickness];
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const colorClasses = {
      indigo: 'text-indigo-600',
      green: 'text-green-500',
      red: 'text-red-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500'
    };
    
    const fontSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox={`0 0 ${svgSize} ${svgSize}`}
          >
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              className="stroke-gray-200"
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              className={`${colorClasses[color]} transition-all duration-300 ease-in-out`}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          {showPercentage && (
            <div 
              className={`absolute inset-0 flex items-center justify-center ${fontSizes[size]} font-medium text-gray-700`}
            >
              {percentage}%
            </div>
          )}
        </div>
        {label && (
          <span className="mt-2 text-sm text-gray-600">{label}</span>
        )}
      </div>
    );
  }