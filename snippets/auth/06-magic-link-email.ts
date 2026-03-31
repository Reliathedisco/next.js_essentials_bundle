// Magic link authentication (passwordless)
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

interface MagicLinkData {
  email: string;
  token: string;
  expiresAt: Date;
}

export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function sendMagicLink(email: string): Promise<void> {
  const token = generateMagicLinkToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  
  // Store token in database with email and expiry
  // await db.magicLink.create({ email, token, expiresAt });
  
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
  
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'Sign in to your account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Sign in to your account</h2>
        <p>Click the button below to sign in. This link will expire in 15 minutes.</p>
        <a href="${magicLink}" 
           style="display: inline-block; padding: 12px 24px; background: #000; 
                  color: #fff; text-decoration: none; border-radius: 6px; 
                  margin: 16px 0;">
          Sign In
        </a>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  });
}

export async function verifyMagicLink(token: string): Promise<string | null> {
  // Fetch from database
  // const link = await db.magicLink.findUnique({ where: { token } });
  
  // if (!link || link.expiresAt < new Date()) {
  //   return null;
  // }
  
  // Delete used token
  // await db.magicLink.delete({ where: { token } });
  
  // return link.email;
  
  return null; // Replace with actual implementation
}
