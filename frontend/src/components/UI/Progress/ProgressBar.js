export default function ProgressBar({
    value = 0,
    max = 100,
    label = null,
    showPercentage = true,
    color = 'indigo', // 'indigo', 'green', 'red', 'yellow', 'blue'
    size = 'md', // 'sm', 'md', 'lg'
    striped = false,
    animated = false,
    className = ''
  }) {
    const percentage = Math.round((value / max) * 100);
    
    const colorClasses = {
      indigo: 'bg-indigo-600',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500'
    };
    
    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4'
    };
    
    const stripedClass = striped ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_1rem]' : '';
    const animatedClass = animated ? 'animate-progress-stripes' : '';
    
    return (
      <div className={className}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-1">
            {label && <div className="text-sm font-medium text-gray-700">{label}</div>}
            {showPercentage && <div className="text-sm text-gray-500">{percentage}%</div>}
          </div>
        )}
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div 
            className={`${colorClasses[color]} ${stripedClass} ${animatedClass} rounded-full transition-all duration-300 ease-in-out`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          ></div>
        </div>
      </div>
    );
  }
  