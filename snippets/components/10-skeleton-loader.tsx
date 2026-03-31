// Component: Skeleton loading states
'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
  };
  
  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="text" height={16} />
          <Skeleton variant="text" height={16} width="80%" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="rectangular" height={100} />
        <div className="flex justify-between">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="20%" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="text" height={20} className="flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} variant="text" height={16} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" width={64} height={64} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
    </div>
  );
}
