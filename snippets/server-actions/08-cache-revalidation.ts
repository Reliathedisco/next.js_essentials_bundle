// Server action: Cache revalidation strategies
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

// Revalidate specific path
export async function revalidatePostPage(postId: string) {
  revalidatePath(`/posts/${postId}`);
  revalidatePath('/posts'); // Also revalidate list page
}

// Revalidate with tags
export async function revalidateUserData(userId: string) {
  revalidateTag(`user-${userId}`);
  revalidateTag('users-list');
}

// Revalidate multiple paths
export async function revalidateMultiplePaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

// Cached function with revalidation
export const getCachedData = unstable_cache(
  async (id: string) => {
    // Fetch data
    // const data = await db.data.findUnique({ where: { id } });
    return { id, data: 'sample' };
  },
  ['data-cache'], // Cache key
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['data'],
  }
);

// On-demand revalidation
export async function triggerRevalidation(type: 'all' | 'posts' | 'users') {
  switch (type) {
    case 'all':
      revalidatePath('/', 'layout');
      break;
    case 'posts':
      revalidateTag('posts');
      break;
    case 'users':
      revalidateTag('users');
      break;
  }
}
