export default function Checkbox({
    label,
    id,
    name,
    checked,
    onChange,
    error = null,
    helperText = null,
    disabled = false,
    indeterminate = false,
    className = '',
    ...props
  }) {
    const checkboxRef = useRef(null);
    
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    
    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            ref={checkboxRef}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`
              h-4 w-4 rounded
              ${error ? 'border-red-300 text-red-600 focus:ring-red-500' : 'border-gray-300 text-indigo-600 focus:ring-indigo-500'}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            `}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label 
              htmlFor={id} 
              className={`font-medium ${disabled ? 'text-gray-400' : error ? 'text-red-600' : 'text-gray-700'}`}
            >
              {label}
            </label>
          )}
          {(error || helperText) && (
            <p className={`mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
              {error || helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
  