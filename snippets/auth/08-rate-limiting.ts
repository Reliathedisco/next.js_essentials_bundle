// Rate limiting for authentication endpoints
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens
}

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>;
  private interval: number;
  
  constructor(options: RateLimitOptions) {
    this.interval = options.interval;
    this.tokenCache = new LRUCache({
      max: options.uniqueTokenPerInterval,
      ttl: options.interval,
    });
  }
  
  check(limit: number, token: string): { success: boolean; remaining: number } {
    const tokenCount = this.tokenCache.get(token) || [0];
    const currentUsage = tokenCount[0];
    
    if (currentUsage >= limit) {
      return { success: false, remaining: 0 };
    }
    
    const newCount = currentUsage + 1;
    this.tokenCache.set(token, [newCount]);
    
    return { success: true, remaining: limit - newCount };
  }
}

// Usage example:
// const limiter = new RateLimiter({
//   interval: 60 * 1000, // 1 minute
//   uniqueTokenPerInterval: 500,
// });

export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  };
}
