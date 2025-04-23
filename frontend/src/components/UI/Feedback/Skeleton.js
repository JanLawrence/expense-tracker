export default function Skeleton({
    variant = 'rectangular', // 'rectangular', 'circular', 'text'
    width,
    height,
    className = '',
    animation = true
  }) {
    const baseClasses = 'bg-gray-200';
    const animationClass = animation ? 'animate-pulse' : '';
    
    const variantClasses = {
      rectangular: '',
      circular: 'rounded-full',
      text: 'rounded'
    };
    
    const style = {
      width: width,
      height: height
    };
    
    return (
      <div 
        className={`${baseClasses} ${animationClass} ${variantClasses[variant]} ${className}`}
        style={style}
      ></div>
    );
  }