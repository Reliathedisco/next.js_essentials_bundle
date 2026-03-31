// Middleware: CORS configuration
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://yourdomain.com',
  'https://www.yourdomain.com',
];

export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = NextResponse.next();
  
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token'
    );
  }
  
  return response;
}

export function handlePreflight(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
  }
  
  return null;
}
