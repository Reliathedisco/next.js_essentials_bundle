// Component: Badge/Tag component
'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Variant with dot indicator
export function BadgeWithDot({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}) {
  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };
  
  return (
    <Badge variant={variant}>
      <span className={`mr-1.5 h-2 w-2 rounded-full ${dotColors[variant]}`} />
      {children}
    </Badge>
  );
}

// Removable badge
export function BadgeRemovable({
  children,
  onRemove,
  variant = 'default',
}: {
  children: React.ReactNode;
  onRemove: () => void;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}) {
  return (
    <Badge variant={variant} className="pr-1">
      {children}
      <button
        onClick={onRemove}
        className="ml-1.5 inline-flex items-center rounded-full p-0.5 hover:bg-black/10"
        aria-label="Remove"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </Badge>
  );
}
