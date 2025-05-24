export default function Card({
    children,
    title = null,
    subtitle = null,
    actions = null,
    footer = null,
    className = '',
    bodyClassName = '',
    noPadding = false
  }) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {(title || subtitle || actions) && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        <div className={`${!noPadding ? 'p-6' : ''} ${bodyClassName}`}>
          {children}
        </div>
        {footer && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    );
  }