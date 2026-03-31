// Server-side session validation utility
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export async function validateSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload as SessionPayload;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await validateSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}
