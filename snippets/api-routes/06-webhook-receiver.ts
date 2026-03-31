// API Route: Webhook receiver with signature verification
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }
    
    const rawBody = await request.text();
    const secret = process.env.WEBHOOK_SECRET!;
    
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    const payload = JSON.parse(rawBody);
    
    // Process webhook event
    console.log('Webhook received:', payload.event);
    
    // Handle different event types
    switch (payload.event) {
      case 'payment.succeeded':
        // await handlePaymentSuccess(payload.data);
        break;
      case 'user.created':
        // await handleUserCreated(payload.data);
        break;
      default:
        console.log('Unhandled event:', payload.event);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
