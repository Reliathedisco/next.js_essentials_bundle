// Database: Connection pooling and management
import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connection pool configuration
export const prismaWithPool = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=10&pool_timeout=20`,
    },
  },
});

// Read replica configuration
export const prismaReadReplica = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_REPLICA_URL,
    },
  },
});

// Helper to use read replica for queries
export async function readFromReplica<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  return operation(prismaReadReplica);
}

// Helper to use primary for writes
export async function writeToPrimary<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  return operation(prisma);
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect();
  if (prismaReadReplica) {
    await prismaReadReplica.$disconnect();
  }
}

// Health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Middleware for query logging and timing
export const prismaWithLogging = prisma.$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const start = Date.now();
      const result = await query(args);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`Slow query detected: ${model}.${operation} took ${duration}ms`);
      }
      
      return result;
    },
  },
});
