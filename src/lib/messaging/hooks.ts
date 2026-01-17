'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, Message, MessageAttachment, MessageTemplate } from '@/types/database';
import {
  getConversationsWithDetails,
  getMessagesWithAttachments,
  mockMessageTemplates,
  mockMessages,
  mockConversations,
} from '@/lib/mock-data';

// Type for conversation with details
type ConversationWithDetails = ReturnType<typeof getConversationsWithDetails>[0];
type MessageWithAttachments = Message & { attachments: MessageAttachment[] };

// Hook for fetching and managing conversations
export function useConversations(filter: 'all' | 'open' | 'closed' = 'all') {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const timer = setTimeout(() => {
      let data = getConversationsWithDetails();

      if (filter !== 'all') {
        data = data.filter((conv) => conv.status === filter);
      }

      // Sort by last message time (most recent first)
      data.sort((a, b) =>
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setConversations(data);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filter]);

  const totalUnread = useMemo(() =>
    conversations.reduce((sum, conv) => sum + conv.unread_count, 0),
    [conversations]
  );

  const refresh = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setConversations(getConversationsWithDetails());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { conversations, isLoading, totalUnread, refresh };
}

// Hook for fetching messages in a conversation
export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<MessageWithAttachments[]>([]);
  const [conversation, setConversation] = useState<ConversationWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setConversation(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Simulate API call with mock data
    const timer = setTimeout(() => {
      const msgs = getMessagesWithAttachments(conversationId);
      setMessages(msgs);

      const convs = getConversationsWithDetails();
      const conv = convs.find((c) => c.id === conversationId) || null;
      setConversation(conv);

      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [conversationId]);

  return { messages, conversation, isLoading };
}

// Hook for sending messages
export function useSendMessage() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    senderType: 'admin' | 'client',
    isUrgent: boolean = false,
    attachments?: File[]
  ): Promise<Message | null> => {
    setIsSending(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create mock message
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        conversation_id: conversationId,
        sender_type: senderType,
        content,
        is_read: false,
        is_urgent: isUrgent,
        created_at: new Date().toISOString(),
      };

      // In a real app, this would call the API
      // For now, just add to mock data (note: won't persist across refreshes)
      mockMessages.push(newMessage);

      // Update conversation's last_message_at
      const convIndex = mockConversations.findIndex((c) => c.id === conversationId);
      if (convIndex !== -1) {
        mockConversations[convIndex].last_message_at = newMessage.created_at;
        mockConversations[convIndex].updated_at = newMessage.created_at;
      }

      setIsSending(false);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setIsSending(false);
      return null;
    }
  }, []);

  return { sendMessage, isSending, error };
}

// Hook for creating conversations
export function useCreateConversation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConversation = useCallback(async (
    clientId: string,
    subject?: string,
    appointmentId?: string,
    initialMessage?: string
  ): Promise<Conversation | null> => {
    setIsCreating(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

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

      // Add to mock data
      mockConversations.push(newConversation);

      // If initial message provided, send it
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

      setIsCreating(false);
      return newConversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      setIsCreating(false);
      return null;
    }
  }, []);

  return { createConversation, isCreating, error };
}

// Hook for message templates
export function useMessageTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setTemplates(mockMessageTemplates.filter((t) => t.is_active));
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return { templates, isLoading };
}

// Hook for marking messages as read
export function useMarkAsRead() {
  const markAsRead = useCallback(async (messageIds: string[]): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Update mock data
      messageIds.forEach((id) => {
        const msgIndex = mockMessages.findIndex((m) => m.id === id);
        if (msgIndex !== -1) {
          mockMessages[msgIndex].is_read = true;
        }
      });

      return true;
    } catch {
      return false;
    }
  }, []);

  return { markAsRead };
}
