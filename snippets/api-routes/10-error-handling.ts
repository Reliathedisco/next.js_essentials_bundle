// API Route: Comprehensive error handling
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorResponse(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }
  
  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }
  
  // Handle database errors
  if (error instanceof Error && error.message.includes('Unique constraint')) {
    return NextResponse.json(
      { error: 'Resource already exists' },
      { status: 409 }
    );
  }
  
  // Generic error
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined,
    },
    { status: 500 }
  );
}

// Usage in route handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email) {
      throw new ApiError(400, 'Email is required', 'MISSING_EMAIL');
    }
    
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

// Error logging helper
export function logError(error: unknown, context?: Record<string, any>) {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context,
  };
  
  console.error(JSON.stringify(errorInfo, null, 2));
  
  // Send to error tracking service
  // await sendToSentry(errorInfo);
}
