export default function MetricCard({
    title,
    value,
    subtitle = null,
    icon = null,
    trend = null,
    trendValue = null,
    className = '',
    cardClassName = '',
    valueClassName = ''
  }) {
    const trendClasses = {
      up: 'text-green-500',
      down: 'text-red-500',
      neutral: 'text-gray-500'
    };
    
    return (
      <div className={`${className}`}>
        <div className={`bg-white rounded-lg shadow p-6 ${cardClassName}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className={`mt-2 text-3xl font-semibold tracking-tight text-gray-900 ${valueClassName}`}>
                {value}
              </h3>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {icon && (
              <div className="p-2 bg-gray-100 rounded-md">
                {icon}
              </div>
            )}
          </div>
          
          {trend && (
            <div className={`mt-4 flex items-center ${trendClasses[trend]}`}>
              {trend === 'up' ? (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : trend === 'down' ? (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    );
  }