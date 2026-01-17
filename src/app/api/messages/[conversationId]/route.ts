import { NextRequest, NextResponse } from 'next/server';
import { getConversationsWithDetails, mockConversations } from '@/lib/mock-data';

// GET /api/messages/[conversationId] - Get conversation details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  const conversations = getConversationsWithDetails();
  const conversation = conversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ conversation });
}

// PATCH /api/messages/[conversationId] - Update conversation (status, subject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  try {
    const body = await request.json();
    const { status, subject } = body;

    // Find conversation in mock data
    const convIndex = mockConversations.findIndex((c) => c.id === conversationId);

    if (convIndex === -1) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Validate status
    if (status && !['open', 'closed', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: open, closed, or archived' },
        { status: 400 }
      );
    }

    // Update conversation
    if (status) {
      mockConversations[convIndex].status = status;
    }
    if (subject !== undefined) {
      mockConversations[convIndex].subject = subject;
    }
    mockConversations[convIndex].updated_at = new Date().toISOString();

    return NextResponse.json({ conversation: mockConversations[convIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}
