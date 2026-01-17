'use client';

import { useEffect, useRef } from 'react';
import { format, isSameDay } from 'date-fns';
import { MessageBubble } from './message-bubble';
import { useMessages, useMarkAsRead } from '@/lib/messaging/hooks';
import { Loader2, MessageSquare } from 'lucide-react';

interface MessageThreadProps {
  conversationId: string | null;
  isAdmin?: boolean;
}

export function MessageThread({ conversationId, isAdmin = false }: MessageThreadProps) {
  const { messages, isLoading } = useMessages(conversationId);
  const { markAsRead } = useMarkAsRead();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0) {
      const unreadFromOther = messages
        .filter((m) => !m.is_read && m.sender_type !== (isAdmin ? 'admin' : 'client'))
        .map((m) => m.id);

      if (unreadFromOther.length > 0) {
        markAsRead(unreadFromOther);
      }
    }
  }, [messages, isAdmin, markAsRead]);

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-medium text-lg mb-1">Select a conversation</h3>
        <p className="text-muted-foreground text-sm">
          Choose a conversation from the list to view messages
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.created_at);
    const dateKey = format(date, 'yyyy-MM-dd');

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(messagesByDate).map(([dateKey, dayMessages]) => (
        <div key={dateKey}>
          {/* Date separator */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">
              {isSameDay(new Date(dateKey), new Date())
                ? 'Today'
                : format(new Date(dateKey), 'EEEE, MMMM d')}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Messages for this date */}
          <div className="space-y-3">
            {dayMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
