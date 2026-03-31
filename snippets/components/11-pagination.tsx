// Component: Pagination controls
'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages, maxVisible);
  
  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          aria-label="First page"
        >
          «
        </button>
      )}
      
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        ‹
      </button>
      
      {/* Page Numbers */}
      {pages.map((page, index) => (
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded border ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        ›
      </button>
      
      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
          aria-label="Last page"
        >
          »
        </button>
      )}
    </nav>
  );
}

function getVisiblePages(current: number, total: number, max: number): number[] {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + max - 1);
  
  if (end - start < max - 1) {
    start = Math.max(1, end - max + 1);
  }
  
  const pages: number[] = [];
  
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push(-1); // Ellipsis
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (end < total) {
    if (end < total - 1) pages.push(-1); // Ellipsis
    pages.push(total);
  }
  
  return pages;
}

// Compact pagination variant
export function PaginationCompact({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
