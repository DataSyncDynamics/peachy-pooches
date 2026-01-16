'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useBooking } from '@/lib/booking-context';
import { formatDuration, formatPrice } from '@/lib/availability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  Calendar,
  Clock,
  Dog,
  User,
  Mail,
  Phone,
  Scissors,
  Loader2,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConfirmStep() {
  const { formData, resetForm } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { service, date, time, pet, client } = formData;

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsConfirmed(true);
  };

  const timeLabel =
    time &&
    format(
      new Date(`2000-01-01T${time}`),
      'h:mm a'
    );

  if (isConfirmed) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Booking Confirmed! <PartyPopper className="inline h-6 w-6" />
        </h2>

        <p className="text-muted-foreground mb-6">
          We&apos;ve sent a confirmation email to{' '}
          <span className="font-medium text-foreground">{client?.email}</span>
        </p>

        <Card className="bg-accent/30 text-left mb-8">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {date && format(date, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <span>{timeLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                <Dog className="h-5 w-5 text-primary" />
                <span>
                  {pet?.name} - {service?.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Need to make changes? Check your email for a link to manage your
            appointment.
          </p>

          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setIsConfirmed(false);
            }}
          >
            Book Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Review & Confirm
        </h2>
        <p className="text-muted-foreground mt-2">
          Please review your booking details
        </p>
      </div>

      {/* Appointment Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scissors className="h-4 w-4" />
              <span>Service</span>
            </div>
            <span className="font-medium">{service?.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </div>
            <span className="font-medium">
              {date && format(date, 'EEE, MMM d, yyyy')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time</span>
            </div>
            <span className="font-medium">{timeLabel}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <span className="font-medium">
              {service && formatDuration(service.duration_minutes)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pet Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Dog className="h-4 w-4 text-primary" />
            Pet Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{pet?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Breed</span>
            <span className="font-medium">{pet?.breed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Size</span>
            <span className="font-medium capitalize">{pet?.size}</span>
          </div>
          {pet?.notes && (
            <div className="pt-2 border-t">
              <span className="text-sm text-muted-foreground">Notes:</span>
              <p className="text-sm mt-1">{pet.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">
              {client?.firstName} {client?.lastName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </div>
            <span className="font-medium text-sm">{client?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </div>
            <span className="font-medium">{client?.phone}</span>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card className="bg-accent/30">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-bold text-primary">
              {service && formatPrice(service.price)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Payment due at time of service
          </p>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <Button
        size="lg"
        className="w-full h-14 text-lg"
        onClick={handleConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            <Check className="h-5 w-5 mr-2" />
            Confirm Booking
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By confirming, you agree to our cancellation policy. Cancellations must
        be made at least 24 hours in advance.
      </p>
    </div>
  );
}
