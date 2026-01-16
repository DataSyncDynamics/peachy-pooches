'use client';

import { useState, useMemo } from 'react';
import { format, isPast, isFuture } from 'date-fns';
import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Dog,
  Mail,
  Phone,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarPlus,
} from 'lucide-react';
import { getAppointmentsWithDetails } from '@/lib/mock-data';
import { formatPrice, formatDuration } from '@/lib/availability';
import { cn } from '@/lib/utils';

export default function ClientPortal() {
  const [email, setEmail] = useState('sarah.johnson@email.com'); // Demo: pre-filled
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo: auto-logged in
  const [selectedAppointment, setSelectedAppointment] = useState<ReturnType<typeof getAppointmentsWithDetails>[0] | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const appointmentsWithDetails = useMemo(() => getAppointmentsWithDetails(), []);

  // Filter appointments for the logged-in client (demo: first client)
  const clientAppointments = useMemo(() => {
    return appointmentsWithDetails
      .filter((apt) => apt.client.email === email)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [appointmentsWithDetails, email]);

  const upcomingAppointments = clientAppointments.filter(
    (apt) => isFuture(new Date(apt.start_time)) && apt.status !== 'cancelled'
  );

  const pastAppointments = clientAppointments.filter(
    (apt) => isPast(new Date(apt.start_time)) || apt.status === 'completed'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-md mx-auto px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">My Appointments</CardTitle>
              <p className="text-muted-foreground">
                Enter your email to view and manage your appointments
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => setIsLoggedIn(true)}
              >
                View My Appointments
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We&apos;ll send you a magic link to verify your identity
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {email}
            </p>
          </div>
          <Button asChild>
            <Link href="/book">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Link>
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Appointments
          </h2>

          {upcomingAppointments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  No upcoming appointments scheduled
                </p>
                <Button asChild>
                  <Link href="/book">
                    Book Your First Appointment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedAppointment(apt)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Date/Time */}
                      <div className="flex items-center gap-4 md:min-w-[200px]">
                        <div className="text-center bg-primary/10 rounded-lg p-3">
                          <p className="text-sm text-primary font-medium">
                            {format(new Date(apt.start_time), 'MMM')}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {format(new Date(apt.start_time), 'd')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(apt.start_time), 'EEE')}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">
                            {format(new Date(apt.start_time), 'h:mm a')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDuration(apt.service.duration_minutes)}
                          </p>
                        </div>
                      </div>

                      {/* Service & Pet */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Dog className="h-4 w-4 text-primary" />
                          <span className="font-medium">{apt.pet.name}</span>
                        </div>
                        <p className="text-muted-foreground">{apt.service.name}</p>
                      </div>

                      {/* Status & Price */}
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                        {getStatusBadge(apt.status)}
                        <span className="font-semibold text-primary">
                          {formatPrice(apt.total_price)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Past Appointments
            </h2>

            <div className="grid gap-3">
              {pastAppointments.map((apt) => (
                <Card key={apt.id} className="bg-accent/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(apt.start_time), 'MMM d, yyyy')}
                          </p>
                          <p className="font-medium">
                            {apt.pet.name} - {apt.service.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(apt.status)}
                        <span className="text-muted-foreground">
                          {formatPrice(apt.total_price)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Appointment Detail Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-md">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Dog className="h-5 w-5 text-primary" />
                  {selectedAppointment.pet.name}&apos;s Appointment
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(selectedAppointment.status)}
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(selectedAppointment.total_price)}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 rounded-lg bg-accent/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedAppointment.start_time), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedAppointment.start_time), 'h:mm a')} -{' '}
                      {format(new Date(selectedAppointment.end_time), 'h:mm a')}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="font-medium">{selectedAppointment.service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.service.description}
                    </p>
                  </div>
                </div>

                {/* Pet Info */}
                <div>
                  <h4 className="font-medium mb-2">Pet Details</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      {selectedAppointment.pet.name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Breed:</span>{' '}
                      {selectedAppointment.pet.breed}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Size:</span>{' '}
                      <span className="capitalize">{selectedAppointment.pet.size}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {selectedAppointment.status !== 'cancelled' &&
                  selectedAppointment.status !== 'completed' &&
                  isFuture(new Date(selectedAppointment.start_time)) && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" className="flex-1">
                        Reschedule
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAppointment(null);
                          setShowCancelDialog(true);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                {/* Book Again for completed */}
                {selectedAppointment.status === 'completed' && (
                  <Button asChild className="w-full">
                    <Link href="/book">Book Again</Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Appointment?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowCancelDialog(false);
                // In a real app, this would call an API to cancel
              }}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
