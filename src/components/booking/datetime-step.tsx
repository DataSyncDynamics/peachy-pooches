'use client';

import { useState, useMemo } from 'react';
import { format, addDays, startOfDay, isToday, isSameDay } from 'date-fns';
import { useBooking } from '@/lib/booking-context';
import { getTimeSlots, isDayOpen, formatDuration } from '@/lib/availability';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CalendarDays, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DateTimeStep() {
  const { formData, updateFormData } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.date
  );

  const service = formData.service!;

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlots(selectedDate, service);
  }, [selectedDate, service]);

  const availableSlots = timeSlots.filter((slot) => slot.available);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    updateFormData({ date, time: undefined });
  };

  const handleTimeSelect = (time: string) => {
    updateFormData({ time });
  };

  // Disable past dates and closed days
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    if (date < today) return true;
    if (!isDayOpen(date)) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Pick Date & Time
        </h2>
        <p className="text-muted-foreground mt-2">
          Choose when you&apos;d like to bring {formData.pet?.name || 'your pup'} in
        </p>
      </div>

      {/* Selected Service Summary */}
      <Card className="bg-accent/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(service.duration_minutes)}
              </p>
            </div>
            <Badge variant="secondary">${service.price}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Select Date
          </h3>
          <Card>
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                className="rounded-md"
                fromDate={new Date()}
                toDate={addDays(new Date(), 60)}
              />
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Closed on Sundays & Mondays
          </p>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Select Time
          </h3>

          {!selectedDate ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a date to see available times</p>
              </CardContent>
            </Card>
          ) : availableSlots.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No available slots on this day</p>
                <p className="text-sm mt-1">Try selecting another date</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {timeSlots.map((slot) => {
                const isSelected = formData.time === slot.time;
                return (
                  <Button
                    key={slot.time}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'h-12 justify-center',
                      !slot.available && 'opacity-40 cursor-not-allowed',
                      isSelected && 'ring-2 ring-offset-2 ring-primary'
                    )}
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                  >
                    <span>{slot.label}</span>
                    {isSelected && <Check className="h-4 w-4 ml-2" />}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDate && formData.time && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Your appointment:</p>
            <p className="font-medium text-lg">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')} at{' '}
              {timeSlots.find((s) => s.time === formData.time)?.label}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
