export default function Stepper({
    steps = [],
    currentStep = 1,
    orientation = 'horizontal', // 'horizontal', 'vertical'
    className = ''
  }) {
    return (
      <div className={`${orientation === 'vertical' ? 'space-y-4' : ''} ${className}`}>
        <div className={`${orientation === 'horizontal' ? 'flex items-center' : ''}`}>
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`
                ${orientation === 'horizontal' ? 'flex-1' : 'flex'}
                ${orientation === 'horizontal' && index !== steps.length - 1 ? 'pr-8' : ''}
              `}
            >
              <div className={`${orientation === 'horizontal' ? 'relative' : 'flex'}`}>
                {/* For horizontal orientation, add connection line */}
                {orientation === 'horizontal' && index !== steps.length - 1 && (
                  <div className="absolute top-4 left-0 -ml-0.5 mt-0.5 w-full h-0.5">
                    <div className="w-full h-full bg-gray-200 flex">
                      <div 
                        className={`h-full bg-indigo-600 ${
                          index < currentStep - 1 ? 'w-full' : 
                          index === currentStep - 1 ? 'w-1/2' : 'w-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* For vertical orientation, add connection line */}
                {orientation === 'vertical' && index !== steps.length - 1 && (
                  <div className="absolute top-8 left-4 h-full w-0.5 -ml-px">
                    <div
                      className={`h-full w-full bg-gray-200 flex flex-col`}
                    >
                      <div
                        className={`w-full bg-indigo-600 ${
                          index < currentStep - 1 ? 'h-full' : 
                          index === currentStep - 1 ? 'h-1/2' : 'h-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Step Circle */}
                <div 
                  className={`
                    ${orientation === 'vertical' ? 'mr-4' : 'mx-auto'}
                    flex items-center justify-center
                    w-8 h-8 rounded-full
                    ${
                      index + 1 < currentStep ? 'bg-indigo-600 text-white' : 
                      index + 1 === currentStep ? 'bg-indigo-200 text-indigo-800' : 
                      'bg-gray-200 text-gray-500'
                    }
                    ${orientation === 'vertical' ? 'relative z-10' : ''}
                  `}
                >
                  {index + 1 < currentStep ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
              
              {/* Step Content */}
              <div className={`${orientation === 'horizontal' ? 'text-center mt-3' : ''}`}>
                <div className={`text-sm font-medium ${
                  index + 1 <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }