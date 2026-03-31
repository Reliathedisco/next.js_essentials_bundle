// Database: Soft delete pattern
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      // Override findMany to exclude soft-deleted records
      async findMany({ args, query }) {
        args.where = {
          ...args.where,
          deletedAt: null,
        };
        return query(args);
      },
      
      // Override findFirst to exclude soft-deleted records
      async findFirst({ args, query }) {
        args.where = {
          ...args.where,
          deletedAt: null,
        };
        return query(args);
      },
      
      // Override delete to soft delete
      async delete({ args, query }) {
        return (query as any)({
          ...args,
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

// Soft delete a record
export async function softDeletePost(id: string) {
  return await prisma.post.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

// Restore soft-deleted record
export async function restorePost(id: string) {
  return await prisma.post.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}

// Find including deleted
export async function findAllPosts(includeDeleted: boolean = false) {
  return await prisma.post.findMany({
    where: includeDeleted ? {} : {
      deletedAt: null,
    },
  });
}

// Permanently delete
export async function hardDeletePost(id: string) {
  return await prisma.$executeRaw`
    DELETE FROM "Post" WHERE id = ${id}
  `;
}

// Clean up old soft-deleted records
export async function cleanupDeletedPosts(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return await prisma.post.deleteMany({
    where: {
      deletedAt: {
        not: null,
        lt: cutoffDate,
      },
    },
  });
}
