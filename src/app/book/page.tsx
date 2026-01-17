'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookingProvider, useBooking } from '@/lib/booking-context';
import { BookingProgress } from '@/components/booking/booking-progress';
import { BookingNavigation } from '@/components/booking/booking-navigation';
import { ServiceStep } from '@/components/booking/service-step';
import { DateTimeStep } from '@/components/booking/datetime-step';
import { PetStep } from '@/components/booking/pet-step';
import { ContactStep } from '@/components/booking/contact-step';
import { ConfirmStep } from '@/components/booking/confirm-step';
import { IMAGES } from '@/lib/images';

function BookingContent() {
  const { step } = useBooking();

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-4 shrink-0">
            <Image
              src={IMAGES.logo}
              alt="Peachy Pooches"
              width={120}
              height={19}
              className="h-8 w-auto"
            />
          </Link>
          <BookingProgress />
        </div>
      </div>

      {/* Step Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {step === 'service' && <ServiceStep />}
          {step === 'datetime' && <DateTimeStep />}
          {step === 'pet' && <PetStep />}
          {step === 'contact' && <ContactStep />}
          {step === 'confirm' && <ConfirmStep />}
        </div>

        {/* Navigation */}
        <BookingNavigation />
      </main>
    </div>
  );
}

export default function BookPage() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}
