// Database: Raw SQL queries
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Raw query for complex operations
export async function getTopUsers(limit: number = 10) {
  const users = await prisma.$queryRaw<Array<{
    id: string;
    name: string;
    post_count: bigint;
    total_likes: bigint;
  }>>`
    SELECT 
      u.id,
      u.name,
      COUNT(DISTINCT p.id) as post_count,
      COUNT(DISTINCT l.id) as total_likes
    FROM "User" u
    LEFT JOIN "Post" p ON p."authorId" = u.id
    LEFT JOIN "Like" l ON l."postId" = p.id
    GROUP BY u.id, u.name
    ORDER BY total_likes DESC
    LIMIT ${limit}
  `;
  
  return users.map(user => ({
    id: user.id,
    name: user.name,
    postCount: Number(user.post_count),
    totalLikes: Number(user.total_likes),
  }));
}

// Raw execute for updates
export async function bulkUpdatePrices(categoryId: string, multiplier: number) {
  await prisma.$executeRaw`
    UPDATE "Product"
    SET price = price * ${multiplier}
    WHERE "categoryId" = ${categoryId}
  `;
}

// Full-text search (PostgreSQL)
export async function searchPosts(query: string) {
  return await prisma.$queryRaw<Array<any>>`
    SELECT 
      id,
      title,
      content,
      ts_rank(
        to_tsvector('english', title || ' ' || content),
        plainto_tsquery('english', ${query})
      ) as rank
    FROM "Post"
    WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT 20
  `;
}

// Complex analytics query
export async function getDashboardStats(userId: string) {
  return await prisma.$queryRaw<Array<any>>`
    WITH user_stats AS (
      SELECT
        COUNT(DISTINCT p.id) as total_posts,
        COUNT(DISTINCT c.id) as total_comments,
        COUNT(DISTINCT l.id) as total_likes_received
      FROM "User" u
      LEFT JOIN "Post" p ON p."authorId" = u.id
      LEFT JOIN "Comment" c ON c."postId" = p.id
      LEFT JOIN "Like" l ON l."postId" = p.id
      WHERE u.id = ${userId}
    ),
    recent_activity AS (
      SELECT COUNT(*) as recent_posts
      FROM "Post"
      WHERE "authorId" = ${userId}
        AND "createdAt" > NOW() - INTERVAL '7 days'
    )
    SELECT * FROM user_stats, recent_activity
  `;
}
