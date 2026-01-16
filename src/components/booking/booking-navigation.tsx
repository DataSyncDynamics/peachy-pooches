'use client';

import { useBooking } from '@/lib/booking-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function BookingNavigation() {
  const { step, goBack, goNext, canProceed } = useBooking();

  const isFirstStep = step === 'service';
  const isLastStep = step === 'confirm';

  if (isLastStep) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t">
      <Button
        variant="ghost"
        onClick={goBack}
        disabled={isFirstStep}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Button
        onClick={goNext}
        disabled={!canProceed}
        className="gap-2 min-w-[120px]"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
