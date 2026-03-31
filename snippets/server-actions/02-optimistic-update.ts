// Server action: Optimistic UI update pattern
'use server';

import { revalidatePath } from 'next/cache';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export async function toggleTodo(id: string): Promise<Todo> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update in database
  // const todo = await db.todo.update({
  //   where: { id },
  //   data: { completed: { set: !completed } },
  // });
  
  const todo: Todo = {
    id,
    title: 'Sample Todo',
    completed: true,
  };
  
  revalidatePath('/todos');
  
  return todo;
}

export async function deleteTodo(id: string): Promise<void> {
  // await db.todo.delete({ where: { id } });
  revalidatePath('/todos');
}

export async function addTodo(title: string): Promise<Todo> {
  if (!title.trim()) {
    throw new Error('Title cannot be empty');
  }
  
  // const todo = await db.todo.create({
  //   data: { title, completed: false },
  // });
  
  const todo: Todo = {
    id: Math.random().toString(),
    title,
    completed: false,
  };
  
  revalidatePath('/todos');
  
  return todo;
}
