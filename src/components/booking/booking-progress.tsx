'use client';

import { useBooking } from '@/lib/booking-context';
import { BookingStep } from '@/types/database';
import { Check, Scissors, Calendar, Dog, User, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps: { id: BookingStep; label: string; icon: React.ElementType }[] = [
  { id: 'service', label: 'Service', icon: Scissors },
  { id: 'datetime', label: 'Date & Time', icon: Calendar },
  { id: 'pet', label: 'Pet Info', icon: Dog },
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'confirm', label: 'Confirm', icon: CheckCircle },
];

export function BookingProgress() {
  const { step: currentStep, setStep, formData } = useBooking();

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  const canNavigateTo = (stepId: BookingStep): boolean => {
    const targetIndex = steps.findIndex((s) => s.id === stepId);

    // Can always go back
    if (targetIndex < currentIndex) return true;

    // Can only go forward if previous steps are complete
    if (targetIndex > currentIndex) {
      // Check each step before the target
      for (let i = 0; i < targetIndex; i++) {
        const step = steps[i];
        switch (step.id) {
          case 'service':
            if (!formData.service) return false;
            break;
          case 'datetime':
            if (!formData.date || !formData.time) return false;
            break;
          case 'pet':
            if (!formData.pet?.name || !formData.pet?.breed || !formData.pet?.size)
              return false;
            break;
          case 'contact':
            if (
              !formData.client?.firstName ||
              !formData.client?.lastName ||
              !formData.client?.email ||
              !formData.client?.phone
            )
              return false;
            break;
        }
      }
    }

    return true;
  };

  const isStepComplete = (stepId: BookingStep): boolean => {
    switch (stepId) {
      case 'service':
        return !!formData.service;
      case 'datetime':
        return !!formData.date && !!formData.time;
      case 'pet':
        return !!(formData.pet?.name && formData.pet?.breed && formData.pet?.size);
      case 'contact':
        return !!(
          formData.client?.firstName &&
          formData.client?.lastName &&
          formData.client?.email &&
          formData.client?.phone
        );
      case 'confirm':
        return false;
      default:
        return false;
    }
  };

  return (
    <nav aria-label="Booking progress" className="w-full">
      {/* Mobile: Simplified progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps[currentIndex].label}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Full step indicator */}
      <ol className="hidden sm:flex items-center w-full">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = step.id === currentStep;
          const isComplete = isStepComplete(step.id);
          const canNavigate = canNavigateTo(step.id);

          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center',
                index !== steps.length - 1 && 'flex-1'
              )}
            >
              <button
                onClick={() => canNavigate && setStep(step.id)}
                disabled={!canNavigate}
                className={cn(
                  'flex flex-col items-center gap-2 group transition-colors',
                  canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                    isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isComplete
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted-foreground/30 bg-background text-muted-foreground',
                    canNavigate &&
                      !isCurrent &&
                      'group-hover:border-primary/50 group-hover:bg-primary/5'
                  )}
                >
                  {isComplete && !isCurrent ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    index < currentIndex ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
