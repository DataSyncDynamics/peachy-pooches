'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  User,
  Dog,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MessageSquare,
  Pencil,
  Download,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Crown,
  Clock,
  UserPlus,
  Cake,
  Scissors,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  FileText,
  ClipboardCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockClients, mockPets, mockAppointments, mockServices, updateClient } from '@/lib/mock-data';
import { formatPrice } from '@/lib/availability';
import { Client, Pet, Appointment } from '@/types/database';
import { toast } from 'sonner';
import { exportToCSV, clientExportColumns } from '@/lib/export';
import { cn, calculatePetAge, getVaccinationStatus, isBirthdaySoon } from '@/lib/utils';

interface ClientWithStats extends Client {
  pets: Pet[];
  appointments: Appointment[];
  totalSpent: number;
  lastVisit?: Date;
  tag: 'vip' | 'regular' | 'new' | 'inactive';
}

type SortField = 'name' | 'visits' | 'spent' | 'lastVisit';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  search: string;
  tag: 'all' | ClientWithStats['tag'];
  minVisits: string;
  maxVisits: string;
  minSpent: string;
  maxSpent: string;
  lastVisitRange: 'all' | '7days' | '30days' | '90days' | 'over90days';
}

const tagConfig = {
  vip: { label: 'VIP', color: 'bg-amber-100 text-amber-800', icon: Crown },
  regular: { label: 'Regular', color: 'bg-blue-100 text-blue-800', icon: Star },
  new: { label: 'New', color: 'bg-green-100 text-green-800', icon: UserPlus },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: Clock },
};

const verificationStatusConfig = {
  pending_review: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  documents_requested: { label: 'Docs Requested', color: 'bg-blue-100 text-blue-800', icon: FileText },
  verified: { label: 'Verified', color: 'bg-green-100 text-green-800', icon: ShieldCheck },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: ShieldX },
};

export default function ClientsPage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<ClientWithStats | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tag: 'all',
    minVisits: '',
    maxVisits: '',
    minSpent: '',
    maxSpent: '',
    lastVisitRange: 'all',
  });

  const clientsWithStats = useMemo((): ClientWithStats[] => {
    return mockClients.map((client) => {
      const pets = mockPets.filter((p) => p.client_id === client.id);
      const appointments = mockAppointments.filter((a) => a.client_id === client.id);
      const completedAppointments = appointments.filter((a) => a.status === 'completed');
      const totalSpent = completedAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
      const lastVisit = completedAppointments.length > 0
        ? new Date(Math.max(...completedAppointments.map((a) => new Date(a.start_time).getTime())))
        : undefined;

      // Determine client tag
      let tag: ClientWithStats['tag'] = 'regular';
      const daysSinceLastVisit = lastVisit
        ? Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      if (totalSpent >= 500 || appointments.length >= 10) {
        tag = 'vip';
      } else if (appointments.length === 0 || !lastVisit) {
        tag = 'new';
      } else if (daysSinceLastVisit > 90) {
        tag = 'inactive';
      }

      return {
        ...client,
        pets,
        appointments,
        totalSpent,
        lastVisit,
        tag,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Apply filters
  const filteredClients = useMemo(() => {
    let result = clientsWithStats;

    // Search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (client) =>
          client.first_name.toLowerCase().includes(query) ||
          client.last_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query) ||
          client.pets.some((pet) => pet.name.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (filters.tag !== 'all') {
      result = result.filter((client) => client.tag === filters.tag);
    }

    // Visit count filters
    if (filters.minVisits) {
      const min = parseInt(filters.minVisits);
      result = result.filter((client) => client.appointments.length >= min);
    }
    if (filters.maxVisits) {
      const max = parseInt(filters.maxVisits);
      result = result.filter((client) => client.appointments.length <= max);
    }

    // Spent filters
    if (filters.minSpent) {
      const min = parseFloat(filters.minSpent);
      result = result.filter((client) => client.totalSpent >= min);
    }
    if (filters.maxSpent) {
      const max = parseFloat(filters.maxSpent);
      result = result.filter((client) => client.totalSpent <= max);
    }

    // Last visit range filter
    if (filters.lastVisitRange !== 'all') {
      const now = new Date();
      result = result.filter((client) => {
        if (!client.lastVisit) return filters.lastVisitRange === 'over90days';

        switch (filters.lastVisitRange) {
          case '7days':
            return client.lastVisit >= subDays(now, 7);
          case '30days':
            return client.lastVisit >= subDays(now, 30);
          case '90days':
            return client.lastVisit >= subDays(now, 90);
          case 'over90days':
            return client.lastVisit < subDays(now, 90);
          default:
            return true;
        }
      });
    }

    return result;
  }, [clientsWithStats, filters]);

  // Apply sorting
  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'visits':
          comparison = a.appointments.length - b.appointments.length;
          break;
        case 'spent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'lastVisit':
          const aTime = a.lastVisit?.getTime() || 0;
          const bTime = b.lastVisit?.getTime() || 0;
          comparison = aTime - bTime;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredClients, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const getSortIcon = useCallback((field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  }, [sortField, sortDirection]);

  const handleEditClient = useCallback(() => {
    if (!selectedClient) return;
    setEditForm({
      first_name: selectedClient.first_name,
      last_name: selectedClient.last_name,
      email: selectedClient.email,
      phone: selectedClient.phone,
      notes: selectedClient.notes || '',
    });
    setIsEditMode(true);
  }, [selectedClient]);

  const handleSaveClient = useCallback(() => {
    if (!selectedClient) return;

    const updated = updateClient(selectedClient.id, editForm);
    if (updated) {
      toast.success('Client updated successfully!');
      setIsEditMode(false);
      setRefreshKey((k) => k + 1);
      setSelectedClient({
        ...selectedClient,
        ...editForm,
      });
    } else {
      toast.error('Failed to update client');
    }
  }, [selectedClient, editForm]);

  const handleBookAppointment = useCallback(() => {
    if (!selectedClient) return;
    setSelectedClient(null);
    router.push(`/book?clientId=${selectedClient.id}`);
  }, [selectedClient, router]);

  const handleExport = useCallback(() => {
    exportToCSV(sortedClients, clientExportColumns, `clients-${format(new Date(), 'yyyy-MM-dd')}`);
    toast.success(`Exported ${sortedClients.length} clients to CSV`);
  }, [sortedClients]);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      tag: 'all',
      minVisits: '',
      maxVisits: '',
      minSpent: '',
      maxSpent: '',
      lastVisitRange: 'all',
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.tag !== 'all') count++;
    if (filters.minVisits || filters.maxVisits) count++;
    if (filters.minSpent || filters.maxSpent) count++;
    if (filters.lastVisitRange !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            {sortedClients.length} of {clientsWithStats.length} clients
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientsWithStats.length}</p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientsWithStats.filter((c) => c.tag === 'vip').length}</p>
              <p className="text-sm text-muted-foreground">VIP Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Dog className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockPets.length}</p>
              <p className="text-sm text-muted-foreground">Total Pets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatPrice(clientsWithStats.reduce((sum, c) => sum + c.totalSpent, 0))}
              </p>
              <p className="text-sm text-muted-foreground">Lifetime Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients, pets, email, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? 'secondary' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Client Tag</Label>
                <Select
                  value={filters.tag}
                  onValueChange={(v) => setFilters({ ...filters, tag: v as FilterState['tag'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visit Count</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minVisits}
                    onChange={(e) => setFilters({ ...filters, minVisits: e.target.value })}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxVisits}
                    onChange={(e) => setFilters({ ...filters, maxVisits: e.target.value })}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total Spent ($)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minSpent}
                    onChange={(e) => setFilters({ ...filters, minSpent: e.target.value })}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSpent}
                    onChange={(e) => setFilters({ ...filters, maxSpent: e.target.value })}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Last Visit</Label>
                <Select
                  value={filters.lastVisitRange}
                  onValueChange={(v) => setFilters({ ...filters, lastVisitRange: v as FilterState['lastVisitRange'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any time</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="over90days">Over 90 days ago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    className="flex items-center hover:text-foreground transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    Client
                    {getSortIcon('name')}
                  </button>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Pets</TableHead>
                <TableHead>
                  <button
                    className="flex items-center hover:text-foreground transition-colors"
                    onClick={() => handleSort('visits')}
                  >
                    Visits
                    {getSortIcon('visits')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center hover:text-foreground transition-colors"
                    onClick={() => handleSort('spent')}
                  >
                    Total Spent
                    {getSortIcon('spent')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center hover:text-foreground transition-colors"
                    onClick={() => handleSort('lastVisit')}
                  >
                    Last Visit
                    {getSortIcon('lastVisit')}
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No clients found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                sortedClients.map((client) => {
                  const TagIcon = tagConfig[client.tag].icon;
                  return (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => setSelectedClient(client)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {client.first_name[0]}
                              {client.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {client.first_name} {client.last_name}
                            </p>
                            {client.notes && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {client.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{client.email}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {client.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.pets.map((pet) => (
                            <Badge key={pet.id} variant="secondary" className="text-xs">
                              {pet.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{client.appointments.length}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {formatPrice(client.totalSpent)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {client.lastVisit ? (
                          <span className="text-sm">
                            {format(client.lastVisit, 'MMM d, yyyy')}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={cn('gap-1', tagConfig[client.tag].color)}>
                            <TagIcon className="h-3 w-3" />
                            {tagConfig[client.tag].label}
                          </Badge>
                          {client.verification_status !== 'verified' && (
                            <Badge className={cn('gap-1 text-xs', verificationStatusConfig[client.verification_status].color)}>
                              {React.createElement(verificationStatusConfig[client.verification_status].icon, { className: 'h-3 w-3' })}
                              {verificationStatusConfig[client.verification_status].label}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog
        open={!!selectedClient}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedClient(null);
            setIsEditMode(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {selectedClient && !isEditMode && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary text-lg">
                      {selectedClient.first_name[0]}
                      {selectedClient.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p>
                        {selectedClient.first_name} {selectedClient.last_name}
                      </p>
                      <Badge className={cn('gap-1', tagConfig[selectedClient.tag].color)}>
                        {React.createElement(tagConfig[selectedClient.tag].icon, { className: 'h-3 w-3' })}
                        {tagConfig[selectedClient.tag].label}
                      </Badge>
                      <Badge className={cn('gap-1', verificationStatusConfig[selectedClient.verification_status].color)}>
                        {React.createElement(verificationStatusConfig[selectedClient.verification_status].icon, { className: 'h-3 w-3' })}
                        {verificationStatusConfig[selectedClient.verification_status].label}
                      </Badge>
                    </div>
                    <p className="text-sm font-normal text-muted-foreground">
                      Client since {format(new Date(selectedClient.created_at), 'MMMM yyyy')}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-accent/50">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium truncate">{selectedClient.email}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/50">
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm font-medium">{selectedClient.phone}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedClient.appointments.length}</p>
                    <p className="text-xs text-muted-foreground">Visits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(selectedClient.totalSpent)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedClient.pets.length}</p>
                    <p className="text-xs text-muted-foreground">Pets</p>
                  </div>
                </div>

                {/* Pets */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Dog className="h-4 w-4" />
                    Pets
                  </h4>
                  <div className="space-y-3">
                    {selectedClient.pets.map((pet) => {
                      const age = calculatePetAge(pet.birth_date);
                      const vaccinationStatus = getVaccinationStatus(pet.vaccination_expiry);
                      const hasBirthdaySoon = isBirthdaySoon(pet.birth_date, 7);

                      return (
                        <div
                          key={pet.id}
                          className={cn(
                            "p-3 rounded-lg border",
                            hasBirthdaySoon && "border-pink-300 bg-pink-50/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Pet photo placeholder or initials */}
                              {pet.photo_url ? (
                                <img
                                  src={pet.photo_url}
                                  alt={pet.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                  <Dog className="h-5 w-5 text-blue-600" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{pet.name}</p>
                                  {hasBirthdaySoon && (
                                    <Cake className="h-4 w-4 text-pink-500" />
                                  )}
                                  {age && (
                                    <span className="text-sm text-muted-foreground">{age}</span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {pet.breed} · {pet.size}
                                </p>
                                {pet.preferred_style && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Scissors className="h-3 w-3" />
                                    {pet.preferred_style}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status badges row */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {pet.temperament_notes && (
                              <Badge variant="secondary" className="text-xs">
                                {pet.temperament_notes}
                              </Badge>
                            )}
                            {vaccinationStatus === 'valid' && (
                              <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100 gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                Vaccines OK
                              </Badge>
                            )}
                            {vaccinationStatus === 'expiring' && (
                              <Badge className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-1">
                                <ShieldAlert className="h-3 w-3" />
                                Vaccines expiring
                              </Badge>
                            )}
                            {vaccinationStatus === 'expired' && (
                              <Badge className="text-xs bg-red-100 text-red-800 hover:bg-red-100 gap-1">
                                <ShieldX className="h-3 w-3" />
                                Vaccines expired
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Appointments */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Recent Appointments
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedClient.appointments
                      .sort(
                        (a, b) =>
                          new Date(b.start_time).getTime() -
                          new Date(a.start_time).getTime()
                      )
                      .slice(0, 5)
                      .map((apt) => {
                        const service = mockServices.find((s) => s.id === apt.service_id);
                        const pet = mockPets.find((p) => p.id === apt.pet_id);
                        return (
                          <div
                            key={apt.id}
                            className="p-2 rounded-lg bg-accent/50 flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium">
                                {pet?.name} - {service?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(apt.start_time), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  apt.status === 'completed'
                                    ? 'default'
                                    : apt.status === 'confirmed'
                                      ? 'secondary'
                                      : 'outline'
                                }
                                className="text-xs"
                              >
                                {apt.status}
                              </Badge>
                              <p className="text-xs mt-1">{formatPrice(apt.total_price)}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
                      {selectedClient.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={handleEditClient}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Client
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedClient(null);
                      router.push(`/admin/messages?newClient=${selectedClient.id}`);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button className="flex-1" onClick={handleBookAppointment}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Edit Mode */}
          {selectedClient && isEditMode && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-primary" />
                  Edit Client
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Add notes about this client..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveClient}>
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
