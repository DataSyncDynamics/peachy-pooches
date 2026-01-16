'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
  Search,
  User,
  Dog,
  Mail,
  Phone,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { mockClients, mockPets, mockAppointments, mockServices } from '@/lib/mock-data';
import { formatPrice } from '@/lib/availability';
import { Client, Pet, Appointment } from '@/types/database';

interface ClientWithStats extends Client {
  pets: Pet[];
  appointments: Appointment[];
  totalSpent: number;
  lastVisit?: Date;
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientWithStats | null>(null);

  const clientsWithStats = useMemo((): ClientWithStats[] => {
    return mockClients.map((client) => {
      const pets = mockPets.filter((p) => p.client_id === client.id);
      const appointments = mockAppointments.filter((a) => a.client_id === client.id);
      const completedAppointments = appointments.filter((a) => a.status === 'completed');
      const totalSpent = completedAppointments.reduce((sum, apt) => sum + apt.total_price, 0);
      const lastVisit = completedAppointments.length > 0
        ? new Date(Math.max(...completedAppointments.map((a) => new Date(a.start_time).getTime())))
        : undefined;

      return {
        ...client,
        pets,
        appointments,
        totalSpent,
        lastVisit,
      };
    });
  }, []);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientsWithStats;

    const query = searchQuery.toLowerCase();
    return clientsWithStats.filter(
      (client) =>
        client.first_name.toLowerCase().includes(query) ||
        client.last_name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.pets.some((pet) => pet.name.toLowerCase().includes(query))
    );
  }, [clientsWithStats, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            {clientsWithStats.length} total clients
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients, pets, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
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

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Pets</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No clients found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedClient && (
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
                    <p>
                      {selectedClient.first_name} {selectedClient.last_name}
                    </p>
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
                  <div className="space-y-2">
                    {selectedClient.pets.map((pet) => (
                      <div
                        key={pet.id}
                        className="p-3 rounded-lg border flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{pet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {pet.breed} - {pet.size}
                          </p>
                        </div>
                        {pet.temperament_notes && (
                          <Badge variant="secondary" className="text-xs">
                            {pet.temperament_notes}
                          </Badge>
                        )}
                      </div>
                    ))}
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
                  <Button variant="outline" className="flex-1">
                    Edit Client
                  </Button>
                  <Button className="flex-1">Book Appointment</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
