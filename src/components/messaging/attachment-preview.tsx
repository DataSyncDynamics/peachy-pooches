'use client';

import { MessageAttachment } from '@/types/database';
import { formatFileSize, getAttachmentUrl } from '@/lib/messaging/upload';
import { cn } from '@/lib/utils';
import { FileText, Image, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentPreviewProps {
  attachment: MessageAttachment;
  variant?: 'default' | 'light';
  showDownload?: boolean;
}

export function AttachmentPreview({
  attachment,
  variant = 'default',
  showDownload = true,
}: AttachmentPreviewProps) {
  const url = getAttachmentUrl(attachment.storage_path);
  const isImage = attachment.file_type.startsWith('image/');
  const isPDF = attachment.file_type === 'application/pdf';

  const documentTypeLabels: Record<string, string> = {
    rabies_certificate: 'Rabies Certificate',
    vaccination_record: 'Vaccination Record',
    other: 'Document',
  };

  if (isImage) {
    return (
      <div className="relative group">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={attachment.file_name}
            className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
            onError={(e) => {
              // Fallback for mock data
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden flex-col items-center justify-center w-[200px] h-[120px] bg-muted rounded-lg">
            <Image className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
              {attachment.file_name}
            </span>
          </div>
        </a>
        {showDownload && (
          <a
            href={url}
            download={attachment.file_name}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        variant === 'light'
          ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20'
          : 'bg-background hover:bg-accent'
      )}
    >
      <div className={cn(
        'h-10 w-10 rounded-lg flex items-center justify-center',
        isPDF ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
      )}>
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          variant === 'light' ? 'text-primary-foreground' : ''
        )}>
          {attachment.file_name}
        </p>
        <p className={cn(
          'text-xs',
          variant === 'light' ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {attachment.document_type && documentTypeLabels[attachment.document_type]}
          {attachment.document_type && ' • '}
          {formatFileSize(attachment.file_size)}
        </p>
      </div>
      <ExternalLink className={cn(
        'h-4 w-4 shrink-0',
        variant === 'light' ? 'text-primary-foreground/70' : 'text-muted-foreground'
      )} />
    </a>
  );
}
