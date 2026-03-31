// API Route: Pagination and filtering
import { NextRequest, NextResponse } from 'next/server';

interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

function getPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams;
  
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: Math.min(parseInt(searchParams.get('limit') || '20', 10), 100),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
    search: searchParams.get('search') || undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { page, limit, sortBy, order, search } = getPaginationParams(request);
    
    const skip = (page - 1) * limit;
    
    // Build query
    // const where = search ? {
    //   OR: [
    //     { title: { contains: search, mode: 'insensitive' } },
    //     { description: { contains: search, mode: 'insensitive' } },
    //   ],
    // } : {};
    
    // const [items, total] = await Promise.all([
    //   db.item.findMany({
    //     where,
    //     skip,
    //     take: limit,
    //     orderBy: { [sortBy]: order },
    //   }),
    //   db.item.count({ where }),
    // ]);
    
    const items: any[] = [];
    const total = 0;
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
