// Server action: Send transactional emails
'use server';

import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<EmailResult> {
  const validation = emailSchema.safeParse({ to, subject, body });
  
  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid email parameters',
    };
  }
  
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject,
      html: body,
    });
    
    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<EmailResult> {
  const subject = 'Welcome to Our Platform!';
  const body = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome, ${name}!</h1>
      <p>Thanks for joining our platform. We're excited to have you on board.</p>
      <p>Get started by exploring our features:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Browse our resources</li>
        <li>Connect with the community</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
  `;
  
  return sendEmail(email, subject, body);
}
