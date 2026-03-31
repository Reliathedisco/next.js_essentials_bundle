// Database: Aggregations and analytics
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Count with filtering
export async function getUserStats(userId: string) {
  const [postCount, commentCount, likeCount] = await Promise.all([
    prisma.post.count({
      where: { authorId: userId },
    }),
    prisma.comment.count({
      where: { authorId: userId },
    }),
    prisma.like.count({
      where: { userId },
    }),
  ]);
  
  return {
    posts: postCount,
    comments: commentCount,
    likes: likeCount,
  };
}

// Aggregate functions
export async function getOrderAnalytics(userId: string) {
  const stats = await prisma.order.aggregate({
    where: { userId },
    _count: { id: true },
    _sum: { total: true },
    _avg: { total: true },
    _max: { total: true },
    _min: { total: true },
  });
  
  return {
    totalOrders: stats._count.id,
    totalSpent: stats._sum.total || 0,
    averageOrderValue: stats._avg.total || 0,
    largestOrder: stats._max.total || 0,
    smallestOrder: stats._min.total || 0,
  };
}

// Group by
export async function getOrdersByStatus() {
  const groups = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true },
    _sum: { total: true },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  });
  
  return groups.map(group => ({
    status: group.status,
    count: group._count.id,
    totalValue: group._sum.total || 0,
  }));
}

// Time-based aggregations
export async function getMonthlyRevenue(year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      status: 'completed',
    },
    select: {
      createdAt: true,
      total: true,
    },
  });
  
  const monthlyData = new Array(12).fill(0);
  
  orders.forEach(order => {
    const month = order.createdAt.getMonth();
    monthlyData[month] += order.total;
  });
  
  return monthlyData;
}
