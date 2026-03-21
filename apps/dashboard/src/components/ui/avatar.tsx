import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function Avatar({ src, alt, fallback, size = 'md', className, ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 font-semibold text-primary-700',
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt ?? fallback}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}

export { Avatar };
