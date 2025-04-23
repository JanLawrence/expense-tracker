export default function Timeline({
    items = [],
    alternating = false,
    className = ''
  }) {
    return (
      <div className={className}>
        <div className="relative">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`mb-8 flex ${
                alternating && index % 2 === 1 ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Line */}
              {index !== items.length - 1 && (
                <div className={`absolute ${alternating ? 'left-1/2' : 'left-6'} ${
                  index === 0 ? 'top-6' : ''
                } h-full w-0.5 bg-gray-200 ${index === 0 ? '-translate-y-6' : ''}`} />
              )}
              
              {/* Dot */}
              <div className={`relative flex items-center justify-center ${
                alternating ? 'mx-auto' : 'mr-4'
              } flex-shrink-0 h-12 w-12 rounded-full ${
                item.color ? `bg-${item.color}-100 text-${item.color}-500` : 'bg-indigo-100 text-indigo-500'
              }`}>
                {item.icon || index + 1}
              </div>
              
              {/* Content */}
              <div className={`${alternating ? 'w-5/12' : 'flex-1'}`}>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  {item.title && (
                    <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                  )}
                  {item.date && (
                    <time className="block mb-2 text-sm font-normal text-gray-500">{item.date}</time>
                  )}
                  <div className="text-sm text-gray-700">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  