// API Route: Response caching strategies
import { NextRequest, NextResponse } from 'next/server';

// Static response (cached indefinitely)
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ 
    message: 'This response is cached' 
  });
}

// Revalidate cache every 60 seconds
export const revalidate = 60;

export async function getCachedData(request: NextRequest) {
  // const data = await db.data.findMany();
  
  return NextResponse.json(
    { data: [] },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    }
  );
}

// Dynamic route with custom cache headers
export async function getDynamicData(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fresh = searchParams.get('fresh') === 'true';
  
  // const data = await db.data.findMany();
  
  const headers = new Headers();
  
  if (fresh) {
    // No caching
    headers.set('Cache-Control', 'no-store');
  } else {
    // Cache for 5 minutes
    headers.set('Cache-Control', 'public, max-age=300');
  }
  
  return NextResponse.json({ data: [] }, { headers });
}

// ETag-based caching
export async function getWithEtag(request: NextRequest) {
  const data = { timestamp: Date.now() };
  const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
  
  const ifNoneMatch = request.headers.get('if-none-match');
  
  if (ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304 });
  }
  
  return NextResponse.json(data, {
    headers: {
      'ETag': etag,
      'Cache-Control': 'no-cache',
    },
  });
}
