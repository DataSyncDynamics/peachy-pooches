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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            {/* Logo - positioned left */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src={IMAGES.logo}
                alt="Peachy Pooches"
                width={200}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* Stepper - centered in remaining space */}
            <div className="flex-1 flex justify-center">
              <BookingProgress />
            </div>

            {/* Spacer to balance logo width */}
            <div className="w-[200px] shrink-0 hidden md:block" />
          </div>
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
