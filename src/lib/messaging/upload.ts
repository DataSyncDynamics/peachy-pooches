import { createClient } from '@/lib/supabase/server';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const BUCKET_NAME = 'message-attachments';

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export async function uploadMessageAttachment(
  file: File,
  clientId: string,
  documentType?: 'rabies_certificate' | 'vaccination_record' | 'other'
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed types: JPG, PNG, PDF`,
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File too large. Maximum size: 10MB`,
    };
  }

  try {
    const supabase = await createClient();

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${clientId}/${timestamp}_${sanitizedName}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return {
      success: true,
      path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function deleteMessageAttachment(path: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    return !error;
  } catch {
    return false;
  }
}

export function getAttachmentUrl(path: string): string {
  // For mock data, return placeholder
  if (path.startsWith('message-attachments/')) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
  }
  return path;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(fileType: string): 'image' | 'pdf' | 'file' {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType === 'application/pdf') return 'pdf';
  return 'file';
}
