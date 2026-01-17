'use client';

import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UnreadBadge } from './unread-badge';
import { cn } from '@/lib/utils';
import { Conversation, Client, Message, Appointment, Pet, Service } from '@/types/database';
import { Dog, Calendar, AlertCircle } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation & {
    client: Client;
    appointment?: Appointment & { pet: Pet; service: Service };
    unread_count: number;
    last_message?: Message;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const { client, appointment, unread_count, last_message } = conversation;

  const initials = `${client.first_name[0]}${client.last_name[0]}`.toUpperCase();

  const timeAgo = last_message
    ? formatDistanceToNow(new Date(last_message.created_at), { addSuffix: true })
    : formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true });

  const lastMessagePreview = last_message
    ? last_message.content.length > 60
      ? last_message.content.substring(0, 60) + '...'
      : last_message.content
    : 'No messages yet';

  const hasUrgent = last_message?.is_urgent;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 border-b hover:bg-accent/50 transition-colors',
        isSelected && 'bg-accent',
        unread_count > 0 && 'bg-primary/5'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className={cn(
            'text-sm font-medium',
            unread_count > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={cn(
              'font-medium truncate',
              unread_count > 0 && 'text-foreground'
            )}>
              {client.first_name} {client.last_name}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {hasUrgent && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <UnreadBadge count={unread_count} size="sm" />
            </div>
          </div>

          {/* Subject or pet info */}
          {(conversation.subject || appointment) && (
            <div className="flex items-center gap-1 mb-1">
              {appointment ? (
                <>
                  <Dog className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {appointment.pet.name} - {appointment.service.name}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground truncate">
                  {conversation.subject}
                </span>
              )}
            </div>
          )}

          {/* Message preview */}
          <p className={cn(
            'text-sm truncate',
            unread_count > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}>
            {last_message?.sender_type === 'admin' && (
              <span className="text-muted-foreground">You: </span>
            )}
            {lastMessagePreview}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {conversation.status !== 'open' && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {conversation.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
