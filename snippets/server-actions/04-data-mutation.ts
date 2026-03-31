// Server action: CRUD operations with error handling
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
});

type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};

export async function createPost(formData: FormData): Promise<ActionResult> {
  const data = {
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'true',
  };
  
  const validation = postSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }
  
  try {
    // const post = await db.post.create({ data: validation.data });
    
    revalidatePath('/posts');
    redirect('/posts');
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create post',
    };
  }
}

export async function updatePost(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const data = {
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'true',
  };
  
  const validation = postSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }
  
  try {
    // await db.post.update({
    //   where: { id },
    //   data: validation.data,
    // });
    
    revalidatePath(`/posts/${id}`);
    revalidatePath('/posts');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update post',
    };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    // await db.post.delete({ where: { id } });
    
    revalidatePath('/posts');
    redirect('/posts');
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete post',
    };
  }
}
