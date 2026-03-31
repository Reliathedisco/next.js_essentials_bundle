// Server action: Form submission with validation
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };
  
  const validation = contactSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    };
  }
  
  try {
    // Process form submission (send email, save to DB, etc.)
    // await sendEmail(validation.data);
    
    revalidatePath('/contact');
    
    return {
      success: true,
      message: 'Message sent successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
    };
  }
}
