import Avatar from './Avatar';

export default function AvatarGroup({
  avatars = [],
  max = 5,
  size = 'md',
  className = ''
}) {
  // Limit the number of avatars to display
  const visibleAvatars = avatars.slice(0, max);
  const extraAvatarsCount = avatars.length - max;
  
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div key={index} className="relative z-0 hover:z-10">
          <Avatar
            src={avatar.src}
            alt={avatar.alt}
            initials={avatar.initials}
            size={size}
            border
          />
        </div>
      ))}
      
      {extraAvatarsCount > 0 && (
        <div className="relative z-0 hover:z-10">
          <div
            className={`
              flex items-center justify-center
              bg-gray-100 text-gray-600 font-medium
              border-2 border-white
              rounded-full
              ${size === 'xs' ? 'h-6 w-6 text-xs' : ''}
              ${size === 'sm' ? 'h-8 w-8 text-xs' : ''}
              ${size === 'md' ? 'h-10 w-10 text-sm' : ''}
              ${size === 'lg' ? 'h-12 w-12 text-base' : ''}
              ${size === 'xl' ? 'h-16 w-16 text-lg' : ''}
            `}
          >
            +{extraAvatarsCount}
          </div>
        </div>
      )}
    </div>
  );
}