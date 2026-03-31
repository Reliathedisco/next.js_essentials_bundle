// Database: Working with relations
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create with nested relations
export async function createPostWithTags(data: {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
}) {
  return await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      author: {
        connect: { id: data.authorId },
      },
      tags: {
        connectOrCreate: data.tags.map(tag => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    include: {
      author: true,
      tags: true,
    },
  });
}

// Nested reads with relations
export async function getPostWithDetails(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tags: true,
      comments: {
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
}

// Update relations
export async function updatePostTags(postId: string, newTags: string[]) {
  return await prisma.post.update({
    where: { id: postId },
    data: {
      tags: {
        set: [], // Clear existing tags
        connectOrCreate: newTags.map(tag => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    include: {
      tags: true,
    },
  });
}

// Many-to-many operations
export async function addUserToTeam(userId: string, teamId: string) {
  return await prisma.teamMember.create({
    data: {
      userId,
      teamId,
      role: 'member',
    },
  });
}

export async function getUserTeams(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teamMemberships: {
        include: {
          team: true,
        },
      },
    },
  });
}
