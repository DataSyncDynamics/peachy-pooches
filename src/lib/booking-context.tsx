'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { BookingFormData, BookingStep, Service } from '@/types/database';

interface BookingContextType {
  step: BookingStep;
  setStep: (step: BookingStep) => void;
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  resetForm: () => void;
  canProceed: boolean;
  goBack: () => void;
  goNext: () => void;
}

const steps: BookingStep[] = ['service', 'datetime', 'pet', 'contact', 'confirm'];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<BookingStep>('service');
  const [formData, setFormData] = useState<BookingFormData>({});

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({});
    setStep('service');
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 'service':
        return !!formData.service;
      case 'datetime':
        return !!formData.date && !!formData.time;
      case 'pet':
        return !!(
          formData.pet?.name &&
          formData.pet?.breed &&
          formData.pet?.size
        );
      case 'contact':
        return !!(
          formData.client?.firstName &&
          formData.client?.lastName &&
          formData.client?.email &&
          formData.client?.phone
        );
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  const goBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const goNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1 && canProceed()) {
      setStep(steps[currentIndex + 1]);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        step,
        setStep,
        formData,
        updateFormData,
        resetForm,
        canProceed: canProceed(),
        goBack,
        goNext,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
