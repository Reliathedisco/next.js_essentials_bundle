// Component: Infinite scroll with intersection observer
'use client';

import { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps<T> {
  loadMore: (page: number) => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  initialData?: T[];
  hasMore?: boolean;
}

export function InfiniteScroll<T extends { id: string | number }>({
  loadMore,
  renderItem,
  initialData = [],
  hasMore: initialHasMore = true,
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const observerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasMore, loading, page]);
  
  const loadMoreItems = async () => {
    setLoading(true);
    
    try {
      const newItems = await loadMore(page + 1);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((p) => p + 1);
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
      
      {loading && (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        </div>
      )}
      
      {hasMore && <div ref={observerRef} className="h-10" />}
      
      {!hasMore && items.length > 0 && (
        <p className="py-4 text-center text-gray-500">No more items to load</p>
      )}
    </div>
  );
}
