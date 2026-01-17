'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/messaging/upload';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

export function FileUploadZone({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
}: FileUploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File too large. Maximum size: ${formatFileSize(maxSize)}`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Accepted: JPG, PNG, PDF');
        }
        return;
      }

      if (selectedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected, selectedFiles.length, maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize,
    maxFiles: maxFiles - selectedFiles.length,
    disabled: disabled || selectedFiles.length >= maxFiles,
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <div className="space-y-3">
      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
              >
                <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  ({formatFileSize(file.size)})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Drop zone */}
      {selectedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragActive && 'border-primary bg-primary/5',
            !isDragActive && 'border-muted-foreground/25 hover:border-muted-foreground/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            {isDragActive
              ? 'Drop files here...'
              : 'Drag & drop files, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, PDF • Max {formatFileSize(maxSize)} each
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Simpler inline attachment button for composer
interface AttachButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function AttachButton({ onFilesSelected, disabled }: AttachButtonProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024,
    disabled,
    noDrag: true,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button type="button" variant="ghost" size="icon" disabled={disabled}>
        <Upload className="h-5 w-5" />
      </Button>
    </div>
  );
}
