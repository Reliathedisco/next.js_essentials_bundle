// API Route: File streaming and download
import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('file');
  
  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }
  
  try {
    const filepath = join(process.cwd(), 'storage', filename);
    const stats = statSync(filepath);
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Length', stats.size.toString());
    
    // Stream file
    const stream = createReadStream(filepath);
    
    return new NextResponse(stream as any, {
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}

// Alternative: Return file as blob
export async function getFileAsBlob(filepath: string) {
  const { readFile } = await import('fs/promises');
  const buffer = await readFile(filepath);
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"',
    },
  });
}
