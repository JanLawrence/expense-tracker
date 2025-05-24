import Breadcrumb from "../UI/Navigation/Breadcrumb";
export default function PageHeader({
    buttons = '',
    title = null,
    breadcrumb = [],
    className = '',
  }) {
    return (
        <>
            <div className={`flex justify-between items-center mb-6 ${className}`}>
                <div>
                    <h3 className="text-xl font-semibold mb-1">{title}</h3>
                    <Breadcrumb items={breadcrumb} homeIcon={false}/>
                </div>
                {buttons}
            </div>
        </>
    //   <div className={`bg-white rounded-lg shadow ${className}`}>
    //     {(title || subtitle || actions) && (
    //       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    //         <div>
    //           {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
    //           {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    //         </div>
    //         {actions && <div>{actions}</div>}
    //       </div>
    //     )}
    //     <div className={`${!noPadding ? 'p-6' : ''} ${bodyClassName}`}>
    //       {children}
    //     </div>
    //     {footer && (
    //       <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
    //         {footer}
    //       </div>
    //     )}
    //   </div>
    );
  }