// Client-side upload utilities
// Actual uploads are done through the API route /api/messages/upload

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPG, PNG, PDF`,
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: 10MB`,
    };
  }

  return { valid: true };
}

export async function uploadMessageAttachment(
  file: File,
  messageId: string,
  clientId: string,
  documentType?: 'rabies_certificate' | 'vaccination_record' | 'other'
): Promise<UploadResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageId', messageId);
    formData.append('clientId', clientId);
    if (documentType) {
      formData.append('documentType', documentType);
    }

    const response = await fetch('/api/messages/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      path: data.attachment.storage_path,
      url: data.url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
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
