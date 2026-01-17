import { NextRequest, NextResponse } from 'next/server';
import { getConversationsWithDetails, mockConversations, mockMessages } from '@/lib/mock-data';
import { Conversation, Message } from '@/types/database';

// GET /api/messages - List all conversations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'open' | 'closed' | 'archived' | null;
  const clientId = searchParams.get('clientId');

  let conversations = getConversationsWithDetails();

  // Filter by status
  if (status) {
    conversations = conversations.filter((conv) => conv.status === status);
  }

  // Filter by client
  if (clientId) {
    conversations = conversations.filter((conv) => conv.client_id === clientId);
  }

  // Sort by last message time (most recent first)
  conversations.sort((a, b) =>
    new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
  );

  return NextResponse.json({
    conversations,
    total: conversations.length,
    unread: conversations.reduce((sum, conv) => sum + conv.unread_count, 0),
  });
}

// POST /api/messages - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, subject, appointmentId, initialMessage } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv${Date.now()}`,
      client_id: clientId,
      appointment_id: appointmentId,
      subject,
      status: 'open',
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would insert into Supabase)
    mockConversations.push(newConversation);

    // If initial message provided, create it
    if (initialMessage) {
      const message: Message = {
        id: `msg${Date.now()}`,
        conversation_id: newConversation.id,
        sender_type: 'admin',
        content: initialMessage,
        is_read: false,
        is_urgent: false,
        created_at: new Date().toISOString(),
      };
      mockMessages.push(message);
    }

    return NextResponse.json({ conversation: newConversation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
