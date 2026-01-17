import { NextRequest, NextResponse } from 'next/server';
import { mockMessageAttachments, mockMessages } from '@/lib/mock-data';
import { MessageAttachment } from '@/types/database';

// POST /api/messages/upload - Upload a file attachment
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const messageId = formData.get('messageId') as string | null;
    const clientId = formData.get('clientId') as string | null;
    const documentType = formData.get('documentType') as 'rabies_certificate' | 'vaccination_record' | 'other' | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, PDF' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

    // Verify message exists
    const message = mockMessages.find((m) => m.id === messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // In a real app, upload to Supabase Storage here
    // For mock, we'll create the attachment record
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `message-attachments/${clientId || 'unknown'}/${timestamp}_${sanitizedName}`;

    const newAttachment: MessageAttachment = {
      id: `att${timestamp}`,
      message_id: messageId,
      file_name: file.name,
      file_type: file.type as 'image/jpeg' | 'image/png' | 'application/pdf',
      file_size: file.size,
      storage_path: storagePath,
      document_type: documentType || 'other',
      created_at: new Date().toISOString(),
    };

    // Add to mock data
    mockMessageAttachments.push(newAttachment);

    return NextResponse.json({
      attachment: newAttachment,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storagePath}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
