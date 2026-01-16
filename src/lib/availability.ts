import { addMinutes, format, parse, isWithinInterval, isSameDay, setHours, setMinutes } from 'date-fns';
import { TimeSlot, Service, Appointment, BusinessHours, BlockedTime } from '@/types/database';
import { mockBusinessHours, mockAppointments, mockBlockedTimes } from './mock-data';

const SLOT_INTERVAL = 30; // minutes

export function getBusinessHoursForDay(date: Date): BusinessHours | undefined {
  const dayOfWeek = date.getDay();
  return mockBusinessHours.find((bh) => bh.day_of_week === dayOfWeek);
}

export function isDayOpen(date: Date): boolean {
  const hours = getBusinessHoursForDay(date);
  return hours ? !hours.is_closed : false;
}

export function getTimeSlots(date: Date, service: Service): TimeSlot[] {
  const businessHours = getBusinessHoursForDay(date);

  if (!businessHours || businessHours.is_closed) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const openTime = parse(businessHours.open_time, 'HH:mm', date);
  const closeTime = parse(businessHours.close_time, 'HH:mm', date);

  let currentSlot = openTime;

  while (currentSlot < closeTime) {
    const slotEnd = addMinutes(currentSlot, service.duration_minutes);

    // Check if the service would end before closing time
    if (slotEnd <= closeTime) {
      const isAvailable = isSlotAvailable(date, currentSlot, slotEnd, service);

      slots.push({
        time: format(currentSlot, 'HH:mm'),
        available: isAvailable,
        label: format(currentSlot, 'h:mm a'),
      });
    }

    currentSlot = addMinutes(currentSlot, SLOT_INTERVAL);
  }

  return slots;
}

function isSlotAvailable(
  date: Date,
  slotStart: Date,
  slotEnd: Date,
  service: Service
): boolean {
  // Set the correct date for the slot times
  const startDateTime = setMinutes(
    setHours(date, slotStart.getHours()),
    slotStart.getMinutes()
  );
  const endDateTime = setMinutes(
    setHours(date, slotEnd.getHours()),
    slotEnd.getMinutes()
  );

  // Check against blocked times
  for (const blocked of mockBlockedTimes) {
    if (blocked.is_recurring) {
      // Check if time overlaps with recurring block
      const blockStart = parse(blocked.start_time, 'HH:mm', date);
      const blockEnd = parse(blocked.end_time, 'HH:mm', date);

      if (
        (slotStart < blockEnd && slotEnd > blockStart)
      ) {
        return false;
      }
    }
  }

  // Check against existing appointments
  for (const apt of mockAppointments) {
    if (apt.status === 'cancelled') continue;

    const aptStart = new Date(apt.start_time);
    const aptEnd = new Date(apt.end_time);

    // Check if same day
    if (!isSameDay(aptStart, date)) continue;

    // Check if times overlap
    if (
      (startDateTime < aptEnd && endDateTime > aptStart)
    ) {
      return false;
    }
  }

  return true;
}

export function getAvailableDates(
  startDate: Date,
  daysToCheck: number,
  service: Service
): Date[] {
  const availableDates: Date[] = [];
  const checkDate = new Date(startDate);

  for (let i = 0; i < daysToCheck; i++) {
    if (isDayOpen(checkDate)) {
      const slots = getTimeSlots(new Date(checkDate), service);
      if (slots.some((slot) => slot.available)) {
        availableDates.push(new Date(checkDate));
      }
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return availableDates;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}
