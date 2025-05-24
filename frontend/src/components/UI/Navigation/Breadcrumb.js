
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({
  items = [],
  homeIcon = true,
  divider = <ChevronRight size={16} className="text-gray-400" />,
  className = ''
}) {
  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1">{divider}</span>
            )}
            
            {index === items.length - 1 ? (
              <span className="text-gray-500 text-xs font-medium">
                {index === 0 && homeIcon ? (
                  <span className="flex items-center">
                    <Home size={16} className="mr-1" /> {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              item?.disabled ? 
                <span className="text-gray-500 text-xs font-medium">
                    {item.label}
                </span>
              :
              <Link 
                href={item.href} 
                className="text-primary-600 hover:text-primary-900 text-xs font-medium"
              >
                {index === 0 && homeIcon ? (
                  <span className="flex items-center">
                    <Home size={16} className="mr-1" /> {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}