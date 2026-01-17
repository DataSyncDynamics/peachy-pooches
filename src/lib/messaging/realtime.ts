import { createBrowserClient } from '@supabase/ssr';
import { Message, Conversation } from '@/types/database';

// Create browser client for realtime subscriptions
function getRealtimeClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type MessageHandler = (message: Message) => void;
export type ConversationHandler = (conversation: Conversation) => void;

export function subscribeToMessages(
  conversationId: string,
  onNewMessage: MessageHandler
) {
  const supabase = getRealtimeClient();

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToConversations(
  clientId: string | null,
  onUpdate: ConversationHandler
) {
  const supabase = getRealtimeClient();

  const filter = clientId ? `client_id=eq.${clientId}` : undefined;

  const channel = supabase
    .channel('conversations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter,
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          onUpdate(payload.new as Conversation);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToUnreadCount(
  onCountChange: (count: number) => void
) {
  const supabase = getRealtimeClient();

  const channel = supabase
    .channel('unread-messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
      },
      async () => {
        // Fetch updated unread count
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .eq('sender_type', 'client');

        onCountChange(count || 0);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
