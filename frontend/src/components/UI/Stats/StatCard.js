export default function StatCard({
    title,
    value,
    icon,
    change = null,
    changeType = 'positive', // 'positive', 'negative', 'neutral'
    description = null,
    className = ''
  }) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon && (
            <span className={`p-2 rounded-md ${
              changeType === 'positive' ? 'bg-green-100 text-green-600' : 
              changeType === 'negative' ? 'bg-red-100 text-red-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              {icon}
            </span>
          )}
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{value}</span>
          {change && (
            <span className={`ml-2 flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
    );
  }