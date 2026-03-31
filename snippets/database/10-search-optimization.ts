// Database: Search optimization with indexing
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Efficient search with indexes
export async function searchProducts(query: string, filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) {
  return await prisma.product.findMany({
    where: {
      AND: [
        // Text search (assumes index on name and description)
        query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
          ],
        } : {},
        // Filters
        filters?.category ? { categoryId: filters.category } : {},
        filters?.minPrice ? { price: { gte: filters.minPrice } } : {},
        filters?.maxPrice ? { price: { lte: filters.maxPrice } } : {},
        filters?.inStock ? { stock: { gt: 0 } } : {},
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    take: 50,
  });
}

// Autocomplete with prefix matching
export async function autocompleteProducts(prefix: string, limit: number = 10) {
  return await prisma.product.findMany({
    where: {
      name: {
        startsWith: prefix,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  });
}

// Faceted search (for filters)
export async function getSearchFacets(query: string) {
  const [categories, priceRanges] = await Promise.all([
    // Category facets
    prisma.product.groupBy({
      by: ['categoryId'],
      where: query ? {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      } : {},
      _count: {
        id: true,
      },
    }),
    
    // Price range facets
    prisma.$queryRaw<Array<{
      range: string;
      count: bigint;
    }>>`
      SELECT 
        CASE
          WHEN price < 10 THEN '0-10'
          WHEN price < 50 THEN '10-50'
          WHEN price < 100 THEN '50-100'
          ELSE '100+'
        END as range,
        COUNT(*) as count
      FROM "Product"
      ${query ? prisma.$queryRaw`WHERE name ILIKE ${'%' + query + '%'}` : prisma.$queryRaw``}
      GROUP BY range
      ORDER BY range
    `,
  ]);
  
  return {
    categories,
    priceRanges: priceRanges.map(r => ({
      range: r.range,
      count: Number(r.count),
    })),
  };
}

// Ranked search results
export async function rankedSearch(query: string) {
  // Using PostgreSQL full-text search
  return await prisma.$queryRaw<Array<any>>`
    SELECT 
      id,
      name,
      description,
      price,
      ts_rank(
        setweight(to_tsvector('english', name), 'A') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'B'),
        plainto_tsquery('english', ${query})
      ) as rank
    FROM "Product"
    WHERE 
      setweight(to_tsvector('english', name), 'A') ||
      setweight(to_tsvector('english', COALESCE(description, '')), 'B')
      @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT 20
  `;
}
