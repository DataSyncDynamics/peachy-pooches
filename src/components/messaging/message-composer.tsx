'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TemplateSelector } from './template-selector';
import { AttachButton } from './file-upload-zone';
import { formatFileSize } from '@/lib/messaging/upload';
import { useSendMessage } from '@/lib/messaging/hooks';
import { cn } from '@/lib/utils';
import { Send, AlertTriangle, X, FileText, Image, Loader2 } from 'lucide-react';

interface MessageComposerProps {
  conversationId: string;
  senderType: 'admin' | 'client';
  onMessageSent?: () => void;
  placeholder?: string;
  showTemplates?: boolean;
  showUrgent?: boolean;
}

export function MessageComposer({
  conversationId,
  senderType,
  onMessageSent,
  placeholder = 'Type a message...',
  showTemplates = true,
  showUrgent = true,
}: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSending, error } = useSendMessage();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSend = useCallback(async () => {
    if (!content.trim() && attachments.length === 0) return;

    const result = await sendMessage(
      conversationId,
      content.trim(),
      senderType,
      isUrgent,
      attachments
    );

    if (result) {
      setContent('');
      setIsUrgent(false);
      setAttachments([]);
      onMessageSent?.();
    }
  }, [content, conversationId, senderType, isUrgent, attachments, sendMessage, onMessageSent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (templateContent: string) => {
    setContent(templateContent);
    textareaRef.current?.focus();
  };

  const handleFilesSelected = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <div className="border-t bg-background">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 bg-muted rounded-full px-3 py-1 text-sm"
              >
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[120px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Composer area */}
      <div className="p-4">
        {/* Error display */}
        {error && (
          <div className="text-sm text-destructive mb-2">{error}</div>
        )}

        <div className="flex items-end gap-2">
          {/* File attachment button */}
          <AttachButton
            onFilesSelected={handleFilesSelected}
            disabled={isSending || attachments.length >= 5}
          />

          {/* Text input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isSending}
              className="min-h-[44px] max-h-[200px] resize-none pr-10"
              rows={1}
            />
          </div>

          {/* Urgent toggle (admin only) */}
          {showUrgent && senderType === 'admin' && (
            <Button
              type="button"
              variant={isUrgent ? 'destructive' : 'ghost'}
              size="icon"
              onClick={() => setIsUrgent(!isUrgent)}
              disabled={isSending}
              title={isUrgent ? 'Mark as not urgent' : 'Mark as urgent (sends SMS)'}
            >
              <AlertTriangle className={cn(
                'h-5 w-5',
                isUrgent ? '' : 'text-muted-foreground'
              )} />
            </Button>
          )}

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={isSending || (!content.trim() && attachments.length === 0)}
            size="icon"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Template selector (admin only) */}
        {showTemplates && senderType === 'admin' && (
          <div className="flex items-center gap-2 mt-2">
            <TemplateSelector
              onSelect={handleTemplateSelect}
              disabled={isSending}
            />
            {isUrgent && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                SMS will be sent to client
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
