'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { ConversationList } from '@/components/messaging/conversation-list';
import { MessageThread } from '@/components/messaging/message-thread';
import { MessageComposer } from '@/components/messaging/message-composer';
import { FileUploadZone } from '@/components/messaging/file-upload-zone';
import { NotificationSettings } from '@/components/messaging/notification-settings';
import { useMessages, useConversations } from '@/lib/messaging/hooks';
import { getConversationsWithDetails } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dog,
  Calendar,
  ArrowLeft,
  MessageSquare,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// Demo: Use a fixed client ID (Sarah Johnson)
const DEMO_CLIENT_ID = 'c1';
const DEMO_CLIENT_EMAIL = 'sarah.johnson@email.com';

export default function ClientMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [messageRefreshKey, setMessageRefreshKey] = useState(0);

  const { conversation, isLoading: conversationLoading } = useMessages(selectedConversationId);
  const { refresh: refreshConversations } = useConversations();

  // Trigger refresh by incrementing key (forces MessageThread to re-fetch)
  const handleMessageSent = useCallback(() => {
    setMessageRefreshKey((prev) => prev + 1);
    refreshConversations();
  }, [refreshConversations]);

  // Filter conversations for this client
  const clientConversations = useMemo(() => {
    return getConversationsWithDetails().filter(
      (conv) => conv.client_id === DEMO_CLIENT_ID
    );
  }, []);

  const totalUnread = useMemo(() =>
    clientConversations.reduce((sum, conv) => sum + conv.unread_count, 0),
    [clientConversations]
  );

  // Handle file upload
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUploadSuccess(true);
    setSelectedFiles([]);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadDialog(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              My Messages
            </h1>
            <p className="text-muted-foreground">
              {DEMO_CLIENT_EMAIL}
              {totalUnread > 0 && (
                <span className="ml-2 text-primary">({totalUnread} unread)</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Send Documents
            </Button>
            <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Main content */}
        <Card className="overflow-hidden">
          <div className="h-[600px] flex">
            {/* Conversation list (left side on desktop, full width on mobile when no conversation selected) */}
            <div
              className={`w-full md:w-[320px] border-r flex-shrink-0 ${
                selectedConversationId ? 'hidden md:flex' : 'flex'
              } flex-col`}
            >
              {clientConversations.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="font-medium text-lg mb-1">No messages yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Messages from Peachy Pooches will appear here
                  </p>
                  <Button asChild>
                    <Link href="/client">Back to Portal</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {clientConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full text-left p-4 border-b hover:bg-accent/50 transition-colors ${
                        selectedConversationId === conv.id ? 'bg-accent' : ''
                      } ${conv.unread_count > 0 ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`font-medium ${conv.unread_count > 0 ? 'text-foreground' : ''}`}>
                          {conv.subject || 'Peachy Pooches'}
                        </span>
                        {conv.unread_count > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {conv.unread_count}
                          </Badge>
                        )}
                      </div>
                      {conv.appointment && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <Dog className="h-3 w-3" />
                          {conv.appointment.pet.name}
                        </p>
                      )}
                      <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                        {conv.last_message?.content || 'No messages'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(conv.last_message_at), 'MMM d, h:mm a')}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversation detail (right side) */}
            <div
              className={`flex-1 flex flex-col ${
                !selectedConversationId ? 'hidden md:flex' : 'flex'
              }`}
            >
              {selectedConversationId && conversation ? (
                <>
                  {/* Header */}
                  <div className="h-14 px-4 border-b flex items-center gap-3 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <p className="font-medium">
                        {conversation.subject || 'Peachy Pooches'}
                      </p>
                      {conversation.appointment && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Dog className="h-3 w-3" />
                          {conversation.appointment.pet.name} -
                          <Calendar className="h-3 w-3 ml-1" />
                          {format(new Date(conversation.appointment.start_time), 'MMM d')}
                        </p>
                      )}
                    </div>
                    {conversation.status !== 'open' && (
                      <Badge variant="secondary">{conversation.status}</Badge>
                    )}
                  </div>

                  {/* Messages */}
                  <MessageThread
                    key={`${selectedConversationId}-${messageRefreshKey}`}
                    conversationId={selectedConversationId}
                    isAdmin={false}
                  />

                  {/* Composer */}
                  {conversation.status === 'open' && (
                    <MessageComposer
                      conversationId={selectedConversationId}
                      senderType="client"
                      onMessageSent={handleMessageSent}
                      placeholder="Type a message..."
                      showTemplates={false}
                      showUrgent={false}
                    />
                  )}

                  {conversation.status !== 'open' && (
                    <div className="border-t p-4 bg-muted/50 text-center text-sm text-muted-foreground">
                      This conversation is {conversation.status}.
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="font-medium text-lg mb-1">Select a conversation</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose a conversation from the list to view messages
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Button variant="link" asChild>
            <Link href="/client">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Appointments
            </Link>
          </Button>
        </div>
      </main>

      {/* Document Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Send Documents
            </DialogTitle>
            <DialogDescription>
              Upload your pet's rabies certificate, vaccination records, or other documents.
            </DialogDescription>
          </DialogHeader>

          {uploadSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="font-medium text-lg">Documents Uploaded!</p>
              <p className="text-muted-foreground">
                We've received your documents. Thank you!
              </p>
            </div>
          ) : (
            <>
              <Tabs defaultValue="rabies" className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="rabies" className="flex-1">Rabies Certificate</TabsTrigger>
                  <TabsTrigger value="vaccination" className="flex-1">Vaccination</TabsTrigger>
                  <TabsTrigger value="other" className="flex-1">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="rabies" className="mt-4">
                  <FileUploadZone
                    onFilesSelected={handleFilesSelected}
                    selectedFiles={selectedFiles}
                    onRemoveFile={handleRemoveFile}
                    maxFiles={3}
                  />
                </TabsContent>
                <TabsContent value="vaccination" className="mt-4">
                  <FileUploadZone
                    onFilesSelected={handleFilesSelected}
                    selectedFiles={selectedFiles}
                    onRemoveFile={handleRemoveFile}
                    maxFiles={3}
                  />
                </TabsContent>
                <TabsContent value="other" className="mt-4">
                  <FileUploadZone
                    onFilesSelected={handleFilesSelected}
                    selectedFiles={selectedFiles}
                    onRemoveFile={handleRemoveFile}
                    maxFiles={3}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowUploadDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={selectedFiles.length === 0}
                  onClick={handleUploadSubmit}
                >
                  Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-md">
          <NotificationSettings
            clientId={DEMO_CLIENT_ID}
            onSave={() => setShowSettingsDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
