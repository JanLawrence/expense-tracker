export default function RadioGroup({
    label,
    name,
    options = [],
    value,
    onChange,
    error = null,
    helperText = null,
    disabled = false,
    required = false,
    inline = false,
    className = '',
    ...props
  }) {
    return (
      <div className={className}>
        {label && (
          <label className={`block text-sm font-medium ${error ? 'text-red-600' : 'text-gray-700'} mb-2`}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className={`${inline ? 'flex flex-wrap gap-x-6 gap-y-2' : 'space-y-2'}`}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled || option.disabled}
                className={`
                  h-4 w-4
                  ${error ? 'border-red-300 text-red-600 focus:ring-red-500' : 'border-gray-300 text-indigo-600 focus:ring-indigo-500'}
                  ${disabled || option.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
                {...props}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className={`ml-3 block text-sm font-medium ${
                  disabled || option.disabled ? 'text-gray-400' : error ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }