'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Search,
  User,
  Dog,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Check,
  X,
  Clock,
  ClipboardCheck,
  AlertCircle,
  Send,
  ExternalLink,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  File,
} from 'lucide-react';
import {
  mockClients,
  mockPets,
  mockConversations,
  getClientsNeedingReview,
  getClientDocuments,
  getPendingDocuments,
  verifyClient,
  requestDocuments,
  rejectClient,
  approveDocument,
  rejectDocument,
} from '@/lib/mock-data';
import { Client, Pet, ClientDocument, MessageAttachment } from '@/types/database';
import { cn } from '@/lib/utils';

type TabFilter = 'pending' | 'docs_submitted' | 'all';

interface ClientWithDetails extends Client {
  pets: Pet[];
  documents: (ClientDocument & { pet?: Pet; attachment: MessageAttachment })[];
  hasConversation: boolean;
  conversationId?: string;
}

const verificationStatusConfig = {
  pending_review: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  documents_requested: {
    label: 'Docs Requested',
    color: 'bg-blue-100 text-blue-800',
    icon: FileText,
  },
  verified: {
    label: 'Verified',
    color: 'bg-green-100 text-green-800',
    icon: ShieldCheck,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: ShieldX,
  },
};

const documentStatusConfig = {
  pending_review: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
  },
  expired: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-800',
  },
};

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientWithDetails | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dialog states
  const [showRequestDocsDialog, setShowRequestDocsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDocDialog, setShowApproveDocDialog] = useState(false);
  const [showRejectDocDialog, setShowRejectDocDialog] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [expiryDateInput, setExpiryDateInput] = useState('');

  // Mobile detection - only open Sheet on mobile screens
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Build clients with details
  const clientsWithDetails = useMemo((): ClientWithDetails[] => {
    return mockClients.map((client) => {
      const pets = mockPets.filter((p) => p.client_id === client.id);
      const documents = getClientDocuments(client.id);
      const conversation = mockConversations.find((c) => c.client_id === client.id);

      return {
        ...client,
        pets,
        documents,
        hasConversation: !!conversation,
        conversationId: conversation?.id,
      };
    });
  }, [refreshKey]);

  // Filter clients based on tab
  const filteredClients = useMemo(() => {
    let result = clientsWithDetails;

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        result = result.filter((c) => c.verification_status === 'pending_review');
        break;
      case 'docs_submitted':
        result = result.filter(
          (c) =>
            c.verification_status === 'documents_requested' &&
            c.documents.some((d) => d.status === 'pending_review')
        );
        break;
      case 'all':
        result = result.filter(
          (c) =>
            c.verification_status === 'pending_review' ||
            c.verification_status === 'documents_requested'
        );
        break;
    }

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (client) =>
          client.first_name.toLowerCase().includes(query) ||
          client.last_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.pets.some((pet) => pet.name.toLowerCase().includes(query))
      );
    }

    return result;
  }, [clientsWithDetails, activeTab, search]);

  // Count pending documents
  const pendingDocsCount = useMemo(() => {
    return getPendingDocuments().length;
  }, [refreshKey]);

  // Get counts for tabs
  const tabCounts = useMemo(() => {
    return {
      pending: clientsWithDetails.filter((c) => c.verification_status === 'pending_review').length,
      docs_submitted: clientsWithDetails.filter(
        (c) =>
          c.verification_status === 'documents_requested' &&
          c.documents.some((d) => d.status === 'pending_review')
      ).length,
      all: clientsWithDetails.filter(
        (c) =>
          c.verification_status === 'pending_review' ||
          c.verification_status === 'documents_requested'
      ).length,
    };
  }, [clientsWithDetails]);

  // Handlers
  const handleVerifyClient = useCallback(() => {
    if (!selectedClient) return;
    const result = verifyClient(selectedClient.id);
    if (result) {
      toast.success(`${selectedClient.first_name} ${selectedClient.last_name} has been verified!`);
      setRefreshKey((k) => k + 1);
      setSelectedClient(null);
    } else {
      toast.error('Failed to verify client');
    }
  }, [selectedClient]);

  const handleRequestDocs = useCallback(() => {
    if (!selectedClient) return;
    const result = requestDocuments(selectedClient.id, notesInput);
    if (result) {
      toast.success(`Document request sent to ${selectedClient.first_name}`);
      setRefreshKey((k) => k + 1);
      setShowRequestDocsDialog(false);
      setNotesInput('');
      setSelectedClient(null);
    } else {
      toast.error('Failed to request documents');
    }
  }, [selectedClient, notesInput]);

  const handleRejectClient = useCallback(() => {
    if (!selectedClient) return;
    const result = rejectClient(selectedClient.id, notesInput);
    if (result) {
      toast.success(`${selectedClient.first_name} ${selectedClient.last_name} has been rejected`);
      setRefreshKey((k) => k + 1);
      setShowRejectDialog(false);
      setNotesInput('');
      setSelectedClient(null);
    } else {
      toast.error('Failed to reject client');
    }
  }, [selectedClient, notesInput]);

  const handleApproveDocument = useCallback(() => {
    if (!selectedDocumentId) return;
    const result = approveDocument(selectedDocumentId, expiryDateInput || undefined);
    if (result) {
      toast.success('Document approved!');
      setRefreshKey((k) => k + 1);
      setShowApproveDocDialog(false);
      setSelectedDocumentId(null);
      setExpiryDateInput('');
      // Refresh selected client details
      if (selectedClient) {
        const updatedClient = clientsWithDetails.find((c) => c.id === selectedClient.id);
        if (updatedClient) {
          setSelectedClient({
            ...updatedClient,
            documents: getClientDocuments(updatedClient.id),
          });
        }
      }
    } else {
      toast.error('Failed to approve document');
    }
  }, [selectedDocumentId, expiryDateInput, selectedClient, clientsWithDetails]);

  const handleRejectDocument = useCallback(() => {
    if (!selectedDocumentId) return;
    const result = rejectDocument(selectedDocumentId, notesInput);
    if (result) {
      toast.success('Document rejected');
      setRefreshKey((k) => k + 1);
      setShowRejectDocDialog(false);
      setSelectedDocumentId(null);
      setNotesInput('');
      // Refresh selected client details
      if (selectedClient) {
        const updatedClient = clientsWithDetails.find((c) => c.id === selectedClient.id);
        if (updatedClient) {
          setSelectedClient({
            ...updatedClient,
            documents: getClientDocuments(updatedClient.id),
          });
        }
      }
    } else {
      toast.error('Failed to reject document');
    }
  }, [selectedDocumentId, notesInput, selectedClient, clientsWithDetails]);

  const openApproveDocDialog = useCallback((docId: string) => {
    setSelectedDocumentId(docId);
    // Pre-fill with date 1 year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    setExpiryDateInput(oneYearFromNow.toISOString().split('T')[0]);
    setShowApproveDocDialog(true);
  }, []);

  const openRejectDocDialog = useCallback((docId: string) => {
    setSelectedDocumentId(docId);
    setNotesInput('');
    setShowRejectDocDialog(true);
  }, []);

  const openRequestDocsDialog = useCallback(() => {
    if (!selectedClient) return;
    const petNames = selectedClient.pets.map((p) => p.name).join(' and ');
    const template = `Hi ${selectedClient.first_name}! We need an updated vaccination record for ${petNames} before we can verify your account. Please upload a copy of their current rabies certificate when you get a chance. Thank you!`;
    setNotesInput(template);
    setShowRequestDocsDialog(true);
  }, [selectedClient]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            Client Review
          </h1>
          <p className="text-muted-foreground">
            Review and verify new clients before their first appointment
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tabCounts.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingDocsCount}</p>
              <p className="text-sm text-muted-foreground">Documents to Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tabCounts.all}</p>
              <p className="text-sm text-muted-foreground">Total Needing Attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabFilter)}>
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  Pending Review
                  {tabCounts.pending > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5">
                      {tabCounts.pending}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="docs_submitted" className="gap-2">
                  Docs Submitted
                  {tabCounts.docs_submitted > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5">
                      {tabCounts.docs_submitted}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Queue */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Review Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredClients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No clients need review</p>
                <p className="text-sm">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredClients.map((client) => {
                  const StatusIcon = verificationStatusConfig[client.verification_status].icon;
                  const pendingDocs = client.documents.filter((d) => d.status === 'pending_review');
                  const isSelected = selectedClient?.id === client.id;

                  return (
                    <div
                      key={client.id}
                      className={cn(
                        'p-4 cursor-pointer hover:bg-accent/50 transition-colors',
                        isSelected && 'bg-accent'
                      )}
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-medium text-primary">
                            {client.first_name[0]}
                            {client.last_name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">
                              {client.first_name} {client.last_name}
                            </p>
                            <Badge
                              className={cn(
                                'text-xs shrink-0',
                                verificationStatusConfig[client.verification_status].color
                              )}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {verificationStatusConfig[client.verification_status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Dog className="h-3 w-3" />
                              {client.pets.length} pet{client.pets.length !== 1 ? 's' : ''}
                            </span>
                            {pendingDocs.length > 0 && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <FileText className="h-3 w-3" />
                                {pendingDocs.length} doc{pendingDocs.length !== 1 ? 's' : ''} to review
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Detail Panel (Desktop) */}
        <Card className="hidden lg:block lg:col-span-1">
          <CardContent className="p-0">
            {selectedClient ? (
              <ClientDetailPanel
                client={selectedClient}
                onVerify={handleVerifyClient}
                onRequestDocs={openRequestDocsDialog}
                onReject={() => setShowRejectDialog(true)}
                onApproveDoc={openApproveDocDialog}
                onRejectDoc={openRejectDocDialog}
              />
            ) : (
              <div className="text-center py-24 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a client to review</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Detail Sheet */}
      <Sheet
        open={!!selectedClient && isMobile}
        onOpenChange={(open) => {
          if (!open) setSelectedClient(null);
        }}
      >
        <SheetContent side="bottom" className="h-[85vh] lg:hidden p-0">
          {selectedClient && (
            <ClientDetailPanel
              client={selectedClient}
              onVerify={handleVerifyClient}
              onRequestDocs={openRequestDocsDialog}
              onReject={() => setShowRejectDialog(true)}
              onApproveDoc={openApproveDocDialog}
              onRejectDoc={openRejectDocDialog}
              isMobile
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Request Docs Dialog */}
      <Dialog open={showRequestDocsDialog} onOpenChange={setShowRequestDocsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Request Documents
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Send a document request to {selectedClient?.first_name} {selectedClient?.last_name}.
              They will receive a notification to upload their vaccination records.
            </p>
            <div className="space-y-2">
              <Label htmlFor="request-notes">Message</Label>
              <Textarea
                id="request-notes"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Add any specific instructions..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDocsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestDocs}>
              <Send className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Client Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldX className="h-5 w-5 text-red-600" />
              Reject Client
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedClient?.first_name}{' '}
              {selectedClient?.last_name}? They will not be able to book appointments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-notes">Reason (optional)</Label>
            <Textarea
              id="reject-notes"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Add rejection reason..."
              rows={2}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectClient}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Document Dialog */}
      <Dialog open={showApproveDocDialog} onOpenChange={setShowApproveDocDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Approve Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiration Date</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDateInput}
                onChange={(e) => setExpiryDateInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This will update the pet's vaccination expiry date
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDocDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveDocument} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Document Dialog */}
      <Dialog open={showRejectDocDialog} onOpenChange={setShowRejectDocDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              Reject Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doc-reject-notes">Reason</Label>
              <Textarea
                id="doc-reject-notes"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Explain why the document was rejected..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDocDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRejectDocument} variant="destructive">
              <X className="h-4 w-4 mr-2" />
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Client Detail Panel Component
function ClientDetailPanel({
  client,
  onVerify,
  onRequestDocs,
  onReject,
  onApproveDoc,
  onRejectDoc,
  isMobile = false,
}: {
  client: ClientWithDetails;
  onVerify: () => void;
  onRequestDocs: () => void;
  onReject: () => void;
  onApproveDoc: (docId: string) => void;
  onRejectDoc: (docId: string) => void;
  isMobile?: boolean;
}) {
  const StatusIcon = verificationStatusConfig[client.verification_status].icon;
  const pendingDocs = client.documents.filter((d) => d.status === 'pending_review');
  const canVerify = client.verification_status !== 'verified' && pendingDocs.length === 0;

  return (
    <div className={cn('flex flex-col h-full', isMobile ? 'pt-6' : '')}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary text-xl">
              {client.first_name[0]}
              {client.last_name[0]}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold">
                {client.first_name} {client.last_name}
              </h3>
              <Badge
                className={cn(
                  'text-xs',
                  verificationStatusConfig[client.verification_status].color
                )}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {verificationStatusConfig[client.verification_status].label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Client since {format(new Date(client.created_at), 'MMMM yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Contact Info */}
        <div>
          <h4 className="font-medium mb-3">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>

        {/* Pets */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Dog className="h-4 w-4" />
            Pets ({client.pets.length})
          </h4>
          <div className="space-y-2">
            {client.pets.map((pet) => (
              <div key={pet.id} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{pet.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pet.breed} · {pet.size}
                    </p>
                  </div>
                  {pet.vaccination_expiry && (
                    <Badge
                      className={cn(
                        'text-xs',
                        new Date(pet.vaccination_expiry) < new Date()
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      )}
                    >
                      {new Date(pet.vaccination_expiry) < new Date() ? (
                        <>
                          <ShieldX className="h-3 w-3 mr-1" />
                          Expired
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Valid
                        </>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({client.documents.length})
          </h4>
          {client.documents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground border rounded-lg">
              <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No documents submitted</p>
            </div>
          ) : (
            <div className="space-y-2">
              {client.documents.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className="font-medium text-sm truncate">
                          {doc.attachment.file_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">
                          {doc.document_type.replace('_', ' ')}
                        </span>
                        {doc.pet && <span>· {doc.pet.name}</span>}
                        <span>· {format(new Date(doc.created_at), 'MMM d')}</span>
                      </div>
                    </div>
                    <Badge
                      className={cn('text-xs shrink-0', documentStatusConfig[doc.status].color)}
                    >
                      {documentStatusConfig[doc.status].label}
                    </Badge>
                  </div>

                  {/* Document Actions */}
                  {doc.status === 'pending_review' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => onApproveDoc(doc.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onRejectDoc(doc.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Link */}
        {client.hasConversation && (
          <div>
            <Link
              href={`/admin/messages?conversation=${client.conversationId}`}
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">View Conversation</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </Link>
          </div>
        )}

        {/* Notes */}
        {client.verification_notes && (
          <div>
            <h4 className="font-medium mb-2">Verification Notes</h4>
            <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
              {client.verification_notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="p-4 border-t bg-card space-y-2">
        {canVerify && (
          <Button onClick={onVerify} className="w-full bg-green-600 hover:bg-green-700">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verify Client
          </Button>
        )}
        {pendingDocs.length > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Review all pending documents before verifying
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRequestDocs} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Request Docs
          </Button>
          <Button
            variant="outline"
            onClick={onReject}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
