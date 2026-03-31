// Database: Optimistic locking with version field
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update with version check
export async function updateWithOptimisticLock(
  id: string,
  version: number,
  data: any
) {
  try {
    const updated = await prisma.document.updateMany({
      where: {
        id,
        version,
      },
      data: {
        ...data,
        version: {
          increment: 1,
        },
      },
    });
    
    if (updated.count === 0) {
      throw new Error('Document was modified by another user. Please refresh and try again.');
    }
    
    return await prisma.document.findUnique({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
}

// Retry with exponential backoff
export async function updateWithRetry(
  id: string,
  updateFn: (current: any) => any,
  maxRetries: number = 3
): Promise<any> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const current = await prisma.document.findUnique({
        where: { id },
      });
      
      if (!current) {
        throw new Error('Document not found');
      }
      
      const newData = updateFn(current);
      
      const updated = await prisma.document.updateMany({
        where: {
          id,
          version: current.version,
        },
        data: {
          ...newData,
          version: {
            increment: 1,
          },
        },
      });
      
      if (updated.count === 0) {
        retries++;
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, retries) * 100)
        );
        continue;
      }
      
      return await prisma.document.findUnique({
        where: { id },
      });
    } catch (error) {
      if (retries === maxRetries - 1) {
        throw error;
      }
      retries++;
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Check for conflicts before update
export async function checkAndUpdate(
  id: string,
  expectedVersion: number,
  data: any
) {
  const current = await prisma.document.findUnique({
    where: { id },
  });
  
  if (!current) {
    throw new Error('Document not found');
  }
  
  if (current.version !== expectedVersion) {
    return {
      success: false,
      conflict: true,
      currentData: current,
    };
  }
  
  const updated = await updateWithOptimisticLock(id, expectedVersion, data);
  
  return {
    success: true,
    conflict: false,
    data: updated,
  };
}
