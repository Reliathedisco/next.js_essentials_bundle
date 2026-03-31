// API Route: Dynamic route with params [id]
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  
  try {
    // const item = await db.item.findUnique({ where: { id } });
    
    // if (!item) {
    //   return NextResponse.json(
    //     { error: 'Item not found' },
    //     { status: 404 }
    //   );
    // }
    
    return NextResponse.json({ 
      id, 
      data: { title: 'Sample Item' }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  const updates = await request.json();
  
  try {
    // const updated = await db.item.update({
    //   where: { id },
    //   data: updates,
    // });
    
    return NextResponse.json({ success: true, data: updates });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;
  
  try {
    // await db.item.delete({ where: { id } });
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
