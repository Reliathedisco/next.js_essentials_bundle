// Database: Transaction patterns
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Basic transaction
export async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return await prisma.$transaction(async (tx) => {
    // Deduct from sender
    const sender = await tx.user.update({
      where: { id: fromUserId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
    
    if (sender.balance < 0) {
      throw new Error('Insufficient funds');
    }
    
    // Add to recipient
    await tx.user.update({
      where: { id: toUserId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    
    // Create transaction record
    await tx.transaction.create({
      data: {
        fromUserId,
        toUserId,
        amount,
        type: 'transfer',
      },
    });
    
    return { success: true };
  });
}

// Interactive transaction with retry
export async function createOrderWithInventory(
  userId: string,
  items: { productId: string; quantity: number }[]
) {
  return await prisma.$transaction(
    async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          status: 'pending',
        },
      });
      
      // Process each item
      for (const item of items) {
        // Check inventory
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
        
        // Decrement inventory
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
        
        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        });
      }
      
      return order;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    }
  );
}
