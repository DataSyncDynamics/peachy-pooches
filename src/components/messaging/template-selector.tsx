'use client';

import { useState } from 'react';
import { useMessageTemplates } from '@/lib/messaging/hooks';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileText, Calendar, Bell, HelpCircle, Loader2 } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (content: string) => void;
  disabled?: boolean;
}

const categoryIcons = {
  appointment: Calendar,
  reminder: Bell,
  document_request: FileText,
  general: HelpCircle,
};

const categoryColors = {
  appointment: 'bg-blue-100 text-blue-800',
  reminder: 'bg-yellow-100 text-yellow-800',
  document_request: 'bg-green-100 text-green-800',
  general: 'bg-gray-100 text-gray-800',
};

export function TemplateSelector({ onSelect, disabled }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const { templates, isLoading } = useMessageTemplates();

  const handleSelect = (content: string) => {
    onSelect(content);
    setOpen(false);
  };

  // Group templates by category
  const templatesByCategory = templates.reduce((groups, template) => {
    const category = template.category || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(template);
    return groups;
  }, {} as Record<string, typeof templates>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Message Templates</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No templates available
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 space-y-6 pr-2">
            {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || HelpCircle;
              const colorClass = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={cn('gap-1', colorClass)}>
                      <Icon className="h-3 w-3" />
                      <span className="capitalize">{category.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {categoryTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelect(template.content)}
                        className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <p className="font-medium text-sm mb-1">{template.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.content}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
