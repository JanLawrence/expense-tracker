import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpenIndexes = [],
  className = ''
}) {
  const [openIndexes, setOpenIndexes] = useState(
    new Set(defaultOpenIndexes)
  );
  
  const toggle = (index) => {
    setOpenIndexes(prevOpenIndexes => {
      const newOpenIndexes = new Set(prevOpenIndexes);
      
      if (newOpenIndexes.has(index)) {
        newOpenIndexes.delete(index);
      } else {
        if (!allowMultiple) {
          newOpenIndexes.clear();
        }
        newOpenIndexes.add(index);
      }
      
      return newOpenIndexes;
    });
  };
  
  return (
    <div className={`divide-y divide-gray-200 border border-gray-200 rounded-md ${className}`}>
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => toggle(index)}
          >
            <span className="font-medium">{item.title}</span>
            {openIndexes.has(index) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openIndexes.has(index) && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}