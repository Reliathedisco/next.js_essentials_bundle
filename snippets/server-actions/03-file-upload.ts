// Server action: File upload with validation
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'No file provided' };
  }
  
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Only images are allowed.',
    };
  }
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    };
  }
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = file.name.split('.').pop();
    const filename = `${hash}.${ext}`;
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    
    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: 'Failed to upload file',
    };
  }
}
