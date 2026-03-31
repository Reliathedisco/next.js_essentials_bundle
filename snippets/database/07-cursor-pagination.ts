// Database: Cursor-based pagination
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CursorPaginationParams {
  cursor?: string;
  take?: number;
  orderBy?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export async function getPaginatedPosts({
  cursor,
  take = 20,
  orderBy = 'desc',
}: CursorPaginationParams): Promise<PaginatedResult<any>> {
  const posts = await prisma.post.findMany({
    take: take + 1, // Fetch one extra to check if there are more
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1, // Skip the cursor itself
    }),
    orderBy: {
      createdAt: orderBy,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  
  const hasMore = posts.length > take;
  const data = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? posts[take - 1].id : undefined;
  
  return {
    data,
    nextCursor,
    hasMore,
  };
}

// Bidirectional cursor pagination
export async function getBidirectionalPosts({
  cursor,
  direction = 'forward',
  take = 20,
}: {
  cursor?: string;
  direction?: 'forward' | 'backward';
  take?: number;
}) {
  if (direction === 'backward') {
    const posts = await prisma.post.findMany({
      take: -(take + 1),
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const hasMore = posts.length > take;
    const data = hasMore ? posts.slice(1) : posts;
    const nextCursor = hasMore ? data[0].id : undefined;
    
    return {
      data,
      previousCursor: nextCursor,
      hasMore,
    };
  }
  
  return getPaginatedPosts({ cursor, take });
}
