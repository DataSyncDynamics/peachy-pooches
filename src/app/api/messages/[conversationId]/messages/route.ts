import { NextRequest, NextResponse } from 'next/server';
import {
  getMessagesWithAttachments,
  mockMessages,
  mockConversations,
  mockClients,
  mockNotificationPreferences,
} from '@/lib/mock-data';
import { Message } from '@/types/database';
import { sendMessageNotification } from '@/lib/messaging/notifications';

// GET /api/messages/[conversationId]/messages - Get all messages in a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  const messages = getMessagesWithAttachments(conversationId);

  return NextResponse.json({
    messages,
    total: messages.length,
  });
}

// POST /api/messages/[conversationId]/messages - Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  try {
    const body = await request.json();
    const { content, senderType, senderId, isUrgent = false } = body;

    if (!content || !senderType) {
      return NextResponse.json(
        { error: 'Content and senderType are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'client'].includes(senderType)) {
      return NextResponse.json(
        { error: 'Invalid senderType. Must be: admin or client' },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create new message
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      conversation_id: conversationId,
      sender_type: senderType,
      sender_id: senderId,
      content,
      is_read: false,
      is_urgent: isUrgent,
      created_at: new Date().toISOString(),
    };

    // Add to mock data
    mockMessages.push(newMessage);

    // Update conversation's last_message_at
    const convIndex = mockConversations.findIndex((c) => c.id === conversationId);
    if (convIndex !== -1) {
      mockConversations[convIndex].last_message_at = newMessage.created_at;
      mockConversations[convIndex].updated_at = newMessage.created_at;
      // Re-open if closed
      if (mockConversations[convIndex].status === 'closed') {
        mockConversations[convIndex].status = 'open';
      }
    }

    // Send notification if admin sent message to client
    if (senderType === 'admin') {
      const client = mockClients.find((c) => c.id === conversation.client_id);
      const preferences = mockNotificationPreferences.find(
        (p) => p.client_id === conversation.client_id
      );

      if (client) {
        // Fire and forget - don't wait for notification
        sendMessageNotification(client, preferences || null, content, isUrgent)
          .catch((err) => console.error('Notification error:', err));
      }
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PATCH /api/messages/[conversationId]/messages - Mark messages as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  try {
    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'messageIds array is required' },
        { status: 400 }
      );
    }

    // Mark messages as read
    let updatedCount = 0;
    messageIds.forEach((id: string) => {
      const msgIndex = mockMessages.findIndex(
        (m) => m.id === id && m.conversation_id === conversationId
      );
      if (msgIndex !== -1) {
        mockMessages[msgIndex].is_read = true;
        updatedCount++;
      }
    });

    return NextResponse.json({
      success: true,
      updatedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
