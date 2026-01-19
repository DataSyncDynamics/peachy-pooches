'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useBooking } from '@/lib/booking-context';
import { formatDuration, formatPrice } from '@/lib/availability';
import { BUSINESS } from '@/lib/constants';
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
  MapPin,
  CalendarPlus,
  Navigation,
  Sparkles,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Confetti component
function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#f5bf3b', '#559fb8', '#daf2e6', '#ff6b6b', '#4ecdc4', '#ffe66d'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

// Generate confirmation number
function generateConfirmationNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'PP-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate .ics calendar file content
function generateICSContent(
  date: Date,
  time: string,
  durationMinutes: number,
  serviceName: string,
  petName: string,
  confirmationNumber: string
): string {
  const startDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const formatICSDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const location = BUSINESS.address.full;
  const description = `Grooming appointment for ${petName}\\nService: ${serviceName}\\nConfirmation: ${confirmationNumber}\\n\\nPlease arrive 5-10 minutes early.`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Peachy Pooches//Booking//EN
BEGIN:VEVENT
UID:${confirmationNumber}@peachypooches.net
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${petName}'s Grooming - ${BUSINESS.name}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

export function ConfirmStep() {
  const { formData, resetForm } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { service, selectedAddOns, date, time, pet, client } = formData;

  // Generate confirmation number once when confirmed
  const confirmationNumber = useMemo(() => {
    return isConfirmed ? generateConfirmationNumber() : '';
  }, [isConfirmed]);

  // Show confetti when confirmed
  useEffect(() => {
    if (isConfirmed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

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

  const handleAddToCalendar = () => {
    if (!date || !time || !service || !pet) return;

    const icsContent = generateICSContent(
      date,
      time,
      service.duration_minutes,
      service.name,
      pet.name,
      confirmationNumber
    );

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `peachy-pooches-${confirmationNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDirectionsUrl = () => {
    const address = encodeURIComponent(BUSINESS.address.full);
    return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  };

  // Calculate total price including add-ons
  const totalPrice = useMemo(() => {
    let total = service?.price || 0;
    if (selectedAddOns) {
      total += selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    }
    return total;
  }, [service, selectedAddOns]);

  if (isConfirmed) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="text-center py-6">
          {/* Celebratory Header */}
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mb-4 shadow-lg">
              <CheckCircle2 className="h-14 w-14" />
            </div>
            <Sparkles className="absolute top-0 right-1/3 h-6 w-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute top-4 left-1/3 h-4 w-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">
            You&apos;re All Set! <PartyPopper className="inline h-7 w-7 ml-1" />
          </h2>

          <p className="text-muted-foreground mb-2">
            We&apos;ve sent a confirmation email to
          </p>
          <p className="font-medium text-foreground mb-6">{client?.email}</p>

          {/* Confirmation Number */}
          <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-full mb-6">
            <Hash className="h-4 w-4" />
            <span className="font-mono font-semibold tracking-wider">{confirmationNumber}</span>
          </div>

          {/* Appointment Details Card */}
          <Card className="bg-gradient-to-br from-accent/50 to-accent/30 text-left mb-6 border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <Calendar className="h-5 w-5" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                  <p className="font-semibold">{date && format(date, 'EEE, MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
                  <p className="font-semibold">{timeLabel}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Dog className="h-4 w-4 text-accent-foreground" />
                  <span className="font-medium">{pet?.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{pet?.breed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-accent-foreground" />
                  <span>{service?.name}</span>
                </div>
                {selectedAddOns && selectedAddOns.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-accent-foreground mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {selectedAddOns.map((addon) => (
                        <span
                          key={addon.id}
                          className="text-xs bg-primary/20 text-foreground px-2 py-0.5 rounded-full"
                        >
                          {addon.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">{formatPrice(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="text-left mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{BUSINESS.name}</p>
                  <p className="text-sm text-muted-foreground">{BUSINESS.address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{BUSINESS.address.floor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCalendar}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </a>
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="bg-muted/50 text-left mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">1.</span>
                  <span>Check your email for confirmation details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">2.</span>
                  <span>Arrive 5-10 minutes before your appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold">3.</span>
                  <span>Bring any vaccination records if this is your first visit</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsConfirmed(false);
              }}
            >
              Book Another Appointment
            </Button>
            <p className="text-xs text-muted-foreground">
              Need to make changes? Call us at{' '}
              <a href={`tel:${BUSINESS.phone}`} className="text-primary hover:underline">
                {BUSINESS.phone}
              </a>
            </p>
          </div>
        </div>
      </>
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
