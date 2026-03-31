// API Route: API key authentication
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const API_KEYS = new Set(process.env.API_KEYS?.split(',') || []);

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return false;
  }
  
  return API_KEYS.has(apiKey);
}

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  // Process authenticated request
  return NextResponse.json({ 
    success: true, 
    message: 'Authenticated request' 
  });
}

export function generateApiKey(): string {
  return `sk_${crypto.randomBytes(32).toString('hex')}`;
}

// Rate limiting per API key
const apiKeyUsage = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(apiKey: string, limit: number = 100): boolean {
  const now = Date.now();
  const usage = apiKeyUsage.get(apiKey);
  
  if (!usage || usage.resetAt < now) {
    apiKeyUsage.set(apiKey, {
      count: 1,
      resetAt: now + 60 * 60 * 1000, // Reset in 1 hour
    });
    return true;
  }
  
  if (usage.count >= limit) {
    return false;
  }
  
  usage.count++;
  return true;
}
