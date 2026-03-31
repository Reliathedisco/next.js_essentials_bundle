// Database: Prisma CRUD operations
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
export async function createUser(data: {
  email: string;
  name: string;
  password: string;
}) {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}

// Read one
export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
      profile: true,
    },
  });
}

// Read many with filtering
export async function getUsers(filters?: {
  search?: string;
  role?: string;
}) {
  return await prisma.user.findMany({
    where: {
      AND: [
        filters?.search ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
          ],
        } : {},
        filters?.role ? { role: filters.role } : {},
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Update
export async function updateUser(id: string, data: Partial<{
  name: string;
  email: string;
}>) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

// Delete
export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

// Upsert (create or update)
export async function upsertUser(email: string, data: any) {
  return await prisma.user.upsert({
    where: { email },
    update: data,
    create: { email, ...data },
  });
}
