'use client';

import { useMemo } from 'react';
import { format, isSameDay, isToday, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Check, CheckCircle, Dog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment, Client, Pet, Service, Stylist } from '@/types/database';
import { formatDuration } from '@/lib/availability';

type AppointmentWithDetails = Appointment & {
  client: Client;
  pet: Pet;
  service: Service;
  stylist?: Stylist;
};

interface StylistLanesProps {
  weekDays: Date[];
  selectedDay: Date;
  onDayChange: (day: Date) => void;
  appointments: AppointmentWithDetails[];
  stylists: Stylist[];
  onAppointmentClick: (apt: AppointmentWithDetails) => void;
  onQuickConfirm: (apt: AppointmentWithDetails, e: React.MouseEvent) => void;
  onQuickComplete: (apt: AppointmentWithDetails, e: React.MouseEvent) => void;
  isDayOpen: (date: Date) => boolean;
  getAppointmentColor: (apt: AppointmentWithDetails) => string;
}

export function StylistLanes({
  weekDays,
  selectedDay,
  onDayChange,
  appointments,
  stylists,
  onAppointmentClick,
  onQuickConfirm,
  onQuickComplete,
  isDayOpen,
  getAppointmentColor,
}: StylistLanesProps) {
  // Filter to active stylists only
  const activeStylists = useMemo(() => stylists.filter((s) => s.is_active), [stylists]);

  // Generate time slots (8am - 6pm)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Get appointments for selected day
  const dayAppointments = useMemo(() => {
    return appointments.filter(
      (apt) => isSameDay(new Date(apt.start_time), selectedDay) && apt.status !== 'cancelled'
    );
  }, [appointments, selectedDay]);

  // Group appointments by stylist
  const appointmentsByStylist = useMemo(() => {
    const grouped: Record<string, AppointmentWithDetails[]> = {};

    // Initialize with empty arrays for each stylist
    activeStylists.forEach((stylist) => {
      grouped[stylist.id] = [];
    });
    grouped['unassigned'] = [];

    // Group appointments
    dayAppointments.forEach((apt) => {
      const key = apt.stylist_id || 'unassigned';
      if (grouped[key]) {
        grouped[key].push(apt);
      } else {
        grouped['unassigned'].push(apt);
      }
    });

    return grouped;
  }, [dayAppointments, activeStylists]);

  // Calculate appointment position based on time
  const getAppointmentPosition = (apt: AppointmentWithDetails) => {
    const startTime = new Date(apt.start_time);
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    const top = ((hours - 8) * 60 + minutes) * (64 / 60); // 64px per hour
    const height = (apt.service.duration_minutes / 60) * 64;
    return { top, height: Math.max(height, 32) };
  };

  const dayOpen = isDayOpen(selectedDay);

  return (
    <div className="flex flex-col">
      {/* Day Tabs */}
      <div className="flex gap-1 p-3 border-b bg-muted/30">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          const dayIsToday = isToday(day);
          const dayOpen = isDayOpen(day);

          return (
            <Button
              key={day.toISOString()}
              variant={isSelected ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onDayChange(day)}
              className={cn(
                'flex-1 flex flex-col gap-0.5 h-auto py-2',
                !dayOpen && 'opacity-50',
                dayIsToday && !isSelected && 'ring-2 ring-primary ring-offset-1'
              )}
            >
              <span className="text-xs font-normal">{format(day, 'EEE')}</span>
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
            </Button>
          );
        })}
      </div>

      {/* Main Content */}
      {!dayOpen ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Closed</p>
          <p className="text-sm">No appointments on {format(selectedDay, 'EEEE')}s</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Column Headers */}
            <div className="flex border-b sticky top-0 bg-background z-10">
              {/* Time Column Header */}
              <div className="w-16 flex-shrink-0 p-2 text-xs font-medium text-muted-foreground border-r">
                Time
              </div>
              {/* Stylist Column Headers */}
              {activeStylists.map((stylist) => (
                <div
                  key={stylist.id}
                  className="flex-1 min-w-[140px] p-2 border-r flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stylist.color }}
                  />
                  <span className="text-sm font-medium truncate">{stylist.name}</span>
                </div>
              ))}
              {/* Unassigned Column Header */}
              <div className="flex-1 min-w-[140px] p-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0 bg-gray-400" />
                <span className="text-sm font-medium text-muted-foreground">Unassigned</span>
              </div>
            </div>

            {/* Time Grid */}
            <div className="relative">
              {/* Time Slot Rows */}
              {timeSlots.map((time, index) => (
                <div key={time} className="flex border-b h-16">
                  {/* Time Label */}
                  <div className="w-16 flex-shrink-0 p-2 text-xs text-muted-foreground border-r">
                    {format(parse(time, 'HH:mm', new Date()), 'h a')}
                  </div>
                  {/* Stylist Columns */}
                  {activeStylists.map((stylist) => (
                    <div
                      key={stylist.id}
                      className="flex-1 min-w-[140px] border-r bg-muted/10"
                    />
                  ))}
                  {/* Unassigned Column */}
                  <div className="flex-1 min-w-[140px] bg-muted/20" />
                </div>
              ))}

              {/* Appointment Cards - Positioned Absolutely */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="flex h-full">
                  {/* Time Column Spacer */}
                  <div className="w-16 flex-shrink-0" />

                  {/* Stylist Columns with Appointments */}
                  {activeStylists.map((stylist) => (
                    <div key={stylist.id} className="flex-1 min-w-[140px] relative">
                      {appointmentsByStylist[stylist.id]?.map((apt) => {
                        const pos = getAppointmentPosition(apt);
                        return (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            top={pos.top}
                            height={pos.height}
                            color={getAppointmentColor(apt)}
                            onClick={onAppointmentClick}
                            onQuickConfirm={onQuickConfirm}
                            onQuickComplete={onQuickComplete}
                          />
                        );
                      })}
                    </div>
                  ))}

                  {/* Unassigned Column with Appointments */}
                  <div className="flex-1 min-w-[140px] relative">
                    {appointmentsByStylist['unassigned']?.map((apt) => {
                      const pos = getAppointmentPosition(apt);
                      return (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          top={pos.top}
                          height={pos.height}
                          color={getAppointmentColor(apt)}
                          onClick={onAppointmentClick}
                          onQuickConfirm={onQuickConfirm}
                          onQuickComplete={onQuickComplete}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Appointment Card Component
interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
  top: number;
  height: number;
  color: string;
  onClick: (apt: AppointmentWithDetails) => void;
  onQuickConfirm: (apt: AppointmentWithDetails, e: React.MouseEvent) => void;
  onQuickComplete: (apt: AppointmentWithDetails, e: React.MouseEvent) => void;
}

function AppointmentCard({
  appointment,
  top,
  height,
  color,
  onClick,
  onQuickConfirm,
  onQuickComplete,
}: AppointmentCardProps) {
  return (
    <button
      onClick={() => onClick(appointment)}
      className="absolute left-1 right-1 rounded-md text-white text-left overflow-hidden pointer-events-auto group transition-transform hover:scale-[1.02] hover:z-10 border-2 border-black/20"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: color,
      }}
    >
      <div className="p-2 h-full flex flex-col">
        <div className="flex items-center gap-1 min-w-0">
          <Dog className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-sm font-semibold truncate">{appointment.pet.name}</span>
        </div>
        {height >= 48 && (
          <span className="text-xs opacity-90 truncate">{appointment.service.name}</span>
        )}
        {height >= 64 && (
          <span className="text-xs opacity-75 truncate mt-auto">
            {format(new Date(appointment.start_time), 'h:mm a')}
          </span>
        )}
      </div>

      {/* Quick Actions on Hover */}
      <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
        {appointment.status === 'pending' && (
          <button
            onClick={(e) => onQuickConfirm(appointment, e)}
            className="p-1 bg-white/20 rounded hover:bg-white/40"
            title="Confirm"
          >
            <Check className="h-3 w-3" />
          </button>
        )}
        {appointment.status === 'confirmed' && (
          <button
            onClick={(e) => onQuickComplete(appointment, e)}
            className="p-1 bg-white/20 rounded hover:bg-white/40"
            title="Complete"
          >
            <CheckCircle className="h-3 w-3" />
          </button>
        )}
      </div>
    </button>
  );
}
