'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Message, MessageAttachment } from '@/types/database';
import { AttachmentPreview } from './attachment-preview';
import { AlertCircle, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message & { attachments?: MessageAttachment[] };
  isAdmin?: boolean;
}

export function MessageBubble({ message, isAdmin = false }: MessageBubbleProps) {
  const isFromAdmin = message.sender_type === 'admin';
  const alignRight = isAdmin ? isFromAdmin : !isFromAdmin;

  return (
    <div
      className={cn(
        'flex flex-col gap-1 max-w-[80%]',
        alignRight ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {/* Urgent indicator */}
      {message.is_urgent && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>Urgent</span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'rounded-2xl px-4 py-2 max-w-full',
          alignRight
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md'
        )}
      >
        {/* Content */}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                variant={alignRight ? 'light' : 'default'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Timestamp and read status */}
      <div className={cn(
        'flex items-center gap-1 text-[10px] text-muted-foreground',
        alignRight ? 'flex-row-reverse' : ''
      )}>
        <span>{format(new Date(message.created_at), 'h:mm a')}</span>
        {alignRight && (
          message.is_read ? (
            <CheckCheck className="h-3 w-3 text-primary" />
          ) : (
            <Check className="h-3 w-3" />
          )
        )}
      </div>
    </div>
  );
}
