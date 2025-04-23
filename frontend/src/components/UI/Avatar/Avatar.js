export default function Avatar({
    src = null,
    alt = '',
    initials = null,
    size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
    shape = 'circle', // 'circle', 'square', 'rounded'
    border = false,
    status = null, // null, 'online', 'offline', 'busy', 'away'
    className = ''
  }) {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl'
    };
    
    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };
    
    const statusClasses = {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      busy: 'bg-red-500',
      away: 'bg-yellow-500'
    };
    
    return (
      <div className="relative inline-block">
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`
              ${sizeClasses[size]} 
              ${shapeClasses[shape]} 
              object-cover
              ${border ? 'border-2 border-white ring-2 ring-gray-200' : ''}
              ${className}
            `}
          />
        ) : (
          <div
            className={`
              ${sizeClasses[size]} 
              ${shapeClasses[shape]} 
              flex items-center justify-center 
              bg-gray-200 text-gray-600 font-medium
              ${border ? 'border-2 border-white ring-2 ring-gray-200' : ''}
              ${className}
            `}
          >
            {initials || alt.charAt(0).toUpperCase()}
          </div>
        )}
        
        {status && (
          <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${statusClasses[status]} ring-2 ring-white`} />
        )}
      </div>
    );
  }