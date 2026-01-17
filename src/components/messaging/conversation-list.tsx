'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationItem } from './conversation-item';
import { useConversations } from '@/lib/messaging/hooks';
import { Search, Plus, Loader2, MessageSquare } from 'lucide-react';

interface ConversationListProps {
  selectedId?: string;
  onSelect: (conversationId: string) => void;
  onNewConversation?: () => void;
}

export function ConversationList({
  selectedId,
  onSelect,
  onNewConversation,
}: ConversationListProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [search, setSearch] = useState('');

  const { conversations, isLoading, totalUnread } = useConversations(filter);

  // Filter by search
  const filteredConversations = conversations.filter((conv) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      conv.client.first_name.toLowerCase().includes(searchLower) ||
      conv.client.last_name.toLowerCase().includes(searchLower) ||
      conv.subject?.toLowerCase().includes(searchLower) ||
      conv.last_message?.content.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Messages</h2>
          {onNewConversation && (
            <Button size="sm" onClick={onNewConversation}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
              {totalUnread > 0 && (
                <span className="ml-1 text-xs text-primary">({totalUnread})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="open" className="flex-1">Open</TabsTrigger>
            <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {search ? 'No conversations found' : 'No conversations yet'}
            </p>
            {onNewConversation && !search && (
              <Button variant="link" onClick={onNewConversation} className="mt-2">
                Start a new conversation
              </Button>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => onSelect(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
