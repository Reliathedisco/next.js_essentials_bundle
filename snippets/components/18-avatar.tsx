// Component: Avatar with fallback
'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  const showFallback = !src || imageError;
  const initials = fallback || alt.charAt(0).toUpperCase();
  
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gray-200 ${sizeClasses[size]} ${className}`}
    >
      {showFallback ? (
        <span className="font-medium text-gray-600">{initials}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full rounded-full object-cover"
        />
      )}
    </div>
  );
}

// Avatar group
export function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
}: {
  avatars: Array<{ src?: string; alt: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  
  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      
      {remaining > 0 && (
        <div className="relative inline-flex items-center justify-center rounded-full bg-gray-300 h-10 w-10 text-sm font-medium text-gray-600 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
}
