export default function Badge({
    children,
    variant = 'primary', // 'primary', 'secondary', 'success', 'danger', 'warning', 'info'
    size = 'md', // 'sm', 'md', 'lg'
    rounded = false,
    dot = false,
    className = ''
  }) {
    const variantClasses = {
      primary: 'bg-indigo-100 text-indigo-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    };
    
    const sizeClasses = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-xs px-2.5 py-0.5',
      lg: 'text-sm px-3 py-0.5'
    };
    
    const roundedClass = rounded ? 'rounded-full' : 'rounded';
    
    return (
      <span className={`inline-flex items-center ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass} font-medium ${className}`}>
        {dot && (
          <span 
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
              variant === 'primary' ? 'bg-indigo-600' :
              variant === 'secondary' ? 'bg-gray-600' :
              variant === 'success' ? 'bg-green-600' :
              variant === 'danger' ? 'bg-red-600' :
              variant === 'warning' ? 'bg-yellow-600' :
              'bg-blue-600'
            }`}
          ></span>
        )}
        {children}
      </span>
    );
  }
    logo = null,
    items = [],
    isOpen = false,
    onClose = () => {},
    footer = null,
    avatarSection = null,
    theme = 'dark', // 'dark', 'light'
    className = ''
  }) {
    const [expandedItems, setExpandedItems] = useState([]);
    
    const toggleItem = (index) => {
      setExpandedItems(prevExpanded => {
        if (prevExpanded.includes(index)) {
          return prevExpanded.filter(item => item !== index);
        } else {
          return [...prevExpanded, index];
        }
      });
    };
    
    const themeClasses = {
      dark: {
        sidebar: 'bg-slate-800 text-white',
        header: 'border-slate-700',
        item: 'text-gray-300 hover:bg-slate-700 hover:text-white',
        activeItem: 'bg-indigo-700 text-white',
        submenuItem: 'text-gray-300 hover:bg-slate-700 hover:text-white',
      },
      light: {
        sidebar: 'bg-white text-gray-800 border-r border-gray-200',
        header: 'border-gray-200',
        item: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        activeItem: 'bg-indigo-50 text-indigo-700',
        submenuItem: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      }
    };
    
    return (
      <>
        {/* Mobile Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={onClose}
          ></div>
        )}
        
        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            ${themeClasses[theme].sidebar}
            ${className}
          `}
        >
          {/* Sidebar Header */}
          <div className={`flex items-center justify-between h-16 px-4 border-b ${themeClasses[theme].header}`}>
            <div className="flex items-center">
              {logo || <span className="text-xl font-semibold">Dashboard</span>}
            </div>
            <button 
              className="p-1 rounded-md lg:hidden"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Avatar Section */}
          {avatarSection && (
            <div className="p-4">
              {avatarSection}
            </div>
          )}
          
          {/* Navigation */}
          <div className="p-4 overflow-y-auto h-full">
            <nav className="space-y-1">
              {items.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <div>
                      <button 
                        onClick={() => toggleItem(index)} 
                        className={`
                          flex items-center justify-between w-full px-3 py-2 text-sm rounded-md 
                          ${themeClasses[theme].item} transition-colors
                        `}
                      >
                        <div className="flex items-center">
                          {item.icon && <span className="mr-3">{item.icon}</span>}
                          {item.label}
                        </div>
                        {expandedItems.includes(index) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      
                      {expandedItems.includes(index) && (
                        <div className="pl-10 mt-1 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link 
                              key={subIndex} 
                              href={subItem.href}
                              className={`
                                block px-3 py-1 text-sm rounded-md 
                                ${themeClasses[theme].submenuItem} transition-colors
                                ${subItem.active ? themeClasses[theme].activeItem : ''}
                              `}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link 
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded-md transition-colors
                        ${item.active ? themeClasses[theme].activeItem : themeClasses[theme].item}
                      `}
                    >
                      {item.icon && <span className="mr-3">{item.icon}</span>}
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="p-4 border-t border-gray-700">
              {footer}
            </div>
          )}
        </aside>
      </>
    );
  }