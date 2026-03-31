// Component: Breadcrumb navigation
'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumbs({ items, separator }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">
                  {separator || '/'}
                </span>
              )}
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-gray-900 font-medium' : 'text-gray-600'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Usage example:
// <Breadcrumbs
//   items={[
//     { label: 'Home', href: '/' },
//     { label: 'Products', href: '/products' },
//     { label: 'Product Name' },
//   ]}
// />
