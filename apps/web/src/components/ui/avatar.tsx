import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

function Avatar({ src, alt, fallback, size = 'md', className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 font-semibold text-primary-700',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt ?? fallback}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}

export { Avatar };
