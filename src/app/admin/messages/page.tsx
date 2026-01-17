'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ConversationList } from '@/components/messaging/conversation-list';
import { MessageThread } from '@/components/messaging/message-thread';
import { MessageComposer } from '@/components/messaging/message-composer';
import { useMessages, useConversations, useCreateConversation } from '@/lib/messaging/hooks';
import { mockClients } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dog,
  Calendar,
  User,
  X,
  Archive,
  CheckCircle,
  MoreVertical,
  Loader2,
} from 'lucide-react';

// Wrap page content in Suspense for useSearchParams
export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <AdminMessagesContent />
    </Suspense>
  );
}

function AdminMessagesContent() {
  const searchParams = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newClientId, setNewClientId] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const { conversation, isLoading: conversationLoading } = useMessages(selectedConversationId);
  const { refresh } = useConversations();
  const { createConversation, isCreating } = useCreateConversation();

  // Handle newClient query parameter (from "Message Client" button)
  useEffect(() => {
    const newClient = searchParams.get('newClient');
    if (newClient) {
      setNewClientId(newClient);
      setShowNewDialog(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', '/admin/messages');
    }
  }, [searchParams]);

  const handleNewConversation = async () => {
    if (!newClientId) return;

    const conv = await createConversation(
      newClientId,
      newSubject || undefined,
      undefined,
      newMessage || undefined
    );

    if (conv) {
      setShowNewDialog(false);
      setNewClientId('');
      setNewSubject('');
      setNewMessage('');
      setSelectedConversationId(conv.id);
      refresh();
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversationId) return;
    // In a real app, this would call the API
    // For now, just update mock data and refresh
    refresh();
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex">
      {/* Conversation list sidebar */}
      <div className="w-full md:w-[380px] border-r flex-shrink-0 bg-card hidden md:flex flex-col">
        <ConversationList
          selectedId={selectedConversationId || undefined}
          onSelect={setSelectedConversationId}
          onNewConversation={() => setShowNewDialog(true)}
        />
      </div>

      {/* Mobile conversation list (shown when no conversation selected) */}
      <div className={`w-full md:hidden flex-col ${selectedConversationId ? 'hidden' : 'flex'}`}>
        <ConversationList
          selectedId={selectedConversationId || undefined}
          onSelect={setSelectedConversationId}
          onNewConversation={() => setShowNewDialog(true)}
        />
      </div>

      {/* Conversation detail */}
      <div className={`flex-1 flex flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversationId && conversation ? (
          <>
            {/* Conversation header */}
            <div className="h-16 px-4 border-b flex items-center justify-between bg-card shrink-0">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversationId(null)}
                >
                  <X className="h-5 w-5" />
                </Button>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">
                      {conversation.client.first_name} {conversation.client.last_name}
                    </h2>
                    {conversation.status !== 'open' && (
                      <Badge variant="secondary" className="text-xs">
                        {conversation.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {conversation.appointment ? (
                      <>
                        <span className="flex items-center gap-1">
                          <Dog className="h-3 w-3" />
                          {conversation.appointment.pet.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(conversation.appointment.start_time), 'MMM d')}
                        </span>
                      </>
                    ) : conversation.subject ? (
                      <span>{conversation.subject}</span>
                    ) : (
                      <span>Direct message</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {conversation.status === 'open' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseConversation}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <MessageThread
              conversationId={selectedConversationId}
              isAdmin={true}
            />

            {/* Composer */}
            {conversation.status === 'open' && (
              <MessageComposer
                conversationId={selectedConversationId}
                senderType="admin"
                onMessageSent={refresh}
                showTemplates={true}
                showUrgent={true}
              />
            )}

            {conversation.status !== 'open' && (
              <div className="border-t p-4 bg-muted/50 text-center text-sm text-muted-foreground">
                This conversation is {conversation.status}.
                <Button
                  variant="link"
                  size="sm"
                  className="ml-1"
                  onClick={() => {
                    // Reopen conversation
                    refresh();
                  }}
                >
                  Reopen
                </Button>
              </div>
            )}
          </>
        ) : (
          <MessageThread conversationId={null} isAdmin={true} />
        )}
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Start a new conversation with a client
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={newClientId} onValueChange={setNewClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {client.first_name} {client.last_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject (optional)</Label>
              <Input
                id="subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g., Appointment reminder"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">First Message (optional)</Label>
              <Textarea
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewConversation}
              disabled={!newClientId || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Start Conversation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
