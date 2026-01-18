'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isToday,
  addDays,
  parse,
  addMinutes,
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  Dog,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Check,
  CalendarClock,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockBusinessHours, getAppointmentsWithDetails, updateAppointmentStatus, updateAppointmentTime } from '@/lib/mock-data';
import { formatPrice, formatDuration } from '@/lib/availability';
import { Appointment, Client, Pet, Service } from '@/types/database';
import { toast } from 'sonner';

type ViewMode = 'day' | 'week' | 'month';
type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed';

type AppointmentWithDetails = Appointment & {
  client: Client;
  pet: Pet;
  service: Service;
};

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const allAppointments = useMemo(() => getAppointmentsWithDetails(), [refreshKey]);

  // Filter appointments by status
  const appointmentsWithDetails = useMemo(() => {
    if (statusFilter === 'all') return allAppointments;
    return allAppointments.filter((apt) => apt.status === statusFilter);
  }, [allAppointments, statusFilter]);

  // Month view calendar days
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Generate time slots for reschedule picker
  const timeSlotOptions = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const label = format(parse(time, 'HH:mm', new Date()), 'h:mm a');
        slots.push({ value: time, label });
      }
    }
    return slots;
  }, []);

  const handleConfirmAppointment = useCallback(() => {
    if (!selectedAppointment) return;

    const updated = updateAppointmentStatus(selectedAppointment.id, 'confirmed');
    if (updated) {
      toast.success('Appointment confirmed!');
      setRefreshKey((k) => k + 1);
      setSelectedAppointment({
        ...selectedAppointment,
        status: 'confirmed',
      });
    } else {
      toast.error('Failed to confirm appointment');
    }
  }, [selectedAppointment]);

  const handleMarkComplete = useCallback(() => {
    if (!selectedAppointment) return;

    const updated = updateAppointmentStatus(selectedAppointment.id, 'completed');
    if (updated) {
      toast.success('Appointment marked as complete!');
      setRefreshKey((k) => k + 1);
      setSelectedAppointment({
        ...selectedAppointment,
        status: 'completed',
      });
    } else {
      toast.error('Failed to update appointment');
    }
  }, [selectedAppointment]);

  const handleOpenReschedule = useCallback(() => {
    if (!selectedAppointment) return;
    const startDate = new Date(selectedAppointment.start_time);
    setRescheduleForm({
      date: format(startDate, 'yyyy-MM-dd'),
      time: format(startDate, 'HH:mm'),
    });
    setIsRescheduleMode(true);
  }, [selectedAppointment]);

  const handleReschedule = useCallback(() => {
    if (!selectedAppointment || !rescheduleForm.date || !rescheduleForm.time) return;

    const newStartTime = new Date(`${rescheduleForm.date}T${rescheduleForm.time}:00`);
    const newEndTime = addMinutes(newStartTime, selectedAppointment.service.duration_minutes);

    const updated = updateAppointmentTime(
      selectedAppointment.id,
      newStartTime.toISOString(),
      newEndTime.toISOString()
    );

    if (updated) {
      toast.success('Appointment rescheduled!');
      setIsRescheduleMode(false);
      setRefreshKey((k) => k + 1);
      setSelectedAppointment({
        ...selectedAppointment,
        start_time: newStartTime.toISOString(),
        end_time: newEndTime.toISOString(),
      });
    } else {
      toast.error('Failed to reschedule appointment');
    }
  }, [selectedAppointment, rescheduleForm]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  const getAppointmentsForDate = (date: Date) => {
    return appointmentsWithDetails.filter((apt) =>
      isSameDay(new Date(apt.start_time), date)
    );
  };

  const isDayOpen = (date: Date) => {
    const dayOfWeek = date.getDay();
    const hours = mockBusinessHours.find((bh) => bh.day_of_week === dayOfWeek);
    return hours ? !hours.is_closed : false;
  };

  const navigatePrev = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Quick status update handlers
  const handleQuickConfirm = useCallback((apt: AppointmentWithDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = updateAppointmentStatus(apt.id, 'confirmed');
    if (updated) {
      toast.success('Appointment confirmed!');
      setRefreshKey((k) => k + 1);
    }
  }, []);

  const handleQuickComplete = useCallback((apt: AppointmentWithDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = updateAppointmentStatus(apt.id, 'completed');
    if (updated) {
      toast.success('Appointment completed!');
      setRefreshKey((k) => k + 1);
    }
  }, []);

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAppointmentPosition = (apt: AppointmentWithDetails) => {
    const startTime = new Date(apt.start_time);
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    const top = ((hours - 8) * 60 + minutes) * (64 / 60); // 64px per hour
    const height = (apt.service.duration_minutes / 60) * 64;
    return { top, height: Math.max(height, 32) };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Navigation & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={navigatePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
            </div>

            <h2 className="text-lg font-semibold">
              {viewMode === 'week'
                ? `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
                : viewMode === 'month'
                  ? format(currentDate, 'MMMM yyyy')
                  : format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>

            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              {/* Legend */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Confirmed
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Complete
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      {viewMode === 'month' ? (
        /* Month View */
        <Card>
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day) => {
                const dayAppointments = getAppointmentsForDate(day).filter(
                  (apt) => apt.status !== 'cancelled'
                );
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dayOpen = isDayOpen(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'min-h-[100px] p-2 border rounded-lg',
                      !isCurrentMonth && 'bg-muted/30',
                      !dayOpen && isCurrentMonth && 'bg-muted/20',
                      isToday(day) && 'border-primary border-2'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          !isCurrentMonth && 'text-muted-foreground',
                          isToday(day) && 'text-primary'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {!dayOpen && isCurrentMonth && (
                        <Badge variant="secondary" className="text-[10px] px-1">
                          Closed
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={cn(
                            'w-full text-left text-[10px] px-1.5 py-0.5 rounded text-white truncate group relative',
                            getStatusColor(apt.status)
                          )}
                        >
                          <span className="truncate">
                            {format(new Date(apt.start_time), 'h:mm')} {apt.pet.name}
                          </span>
                          {/* Quick Actions on Hover */}
                          <div className="hidden group-hover:flex absolute right-0.5 top-0.5 gap-0.5">
                            {apt.status === 'pending' && (
                              <button
                                onClick={(e) => handleQuickConfirm(apt, e)}
                                className="p-0.5 bg-white/20 rounded hover:bg-white/40"
                                title="Confirm"
                              >
                                <Check className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                        </button>
                      ))}
                      {dayAppointments.length > 3 && (
                        <p className="text-[10px] text-muted-foreground text-center">
                          +{dayAppointments.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'week' ? (
        /* Week View */
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-3 text-center text-sm font-medium text-muted-foreground border-r">
                  Time
                </div>
                {weekDays.map((day) => {
                  const dayOpen = isDayOpen(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        'p-3 text-center border-r last:border-r-0',
                        !dayOpen && 'bg-muted/50'
                      )}
                    >
                      <p className="text-sm text-muted-foreground">
                        {format(day, 'EEE')}
                      </p>
                      <p
                        className={cn(
                          'text-lg font-semibold',
                          isToday(day) &&
                            'h-8 w-8 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center'
                        )}
                      >
                        {format(day, 'd')}
                      </p>
                      {!dayOpen && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Closed
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Grid */}
              <div className="relative">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 h-16 border-b">
                    <div className="p-2 text-xs text-muted-foreground border-r text-right pr-3">
                      {format(parse(time, 'HH:mm', new Date()), 'h a')}
                    </div>
                    {weekDays.map((day) => (
                      <div
                        key={`${day.toISOString()}-${time}`}
                        className={cn(
                          'border-r last:border-r-0 relative',
                          !isDayOpen(day) && 'bg-muted/30'
                        )}
                      />
                    ))}
                  </div>
                ))}

                {/* Appointments Overlay */}
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  return dayAppointments.map((apt) => {
                    if (apt.status === 'cancelled') return null;
                    const { top, height } = getAppointmentPosition(apt);
                    return (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className={cn(
                          'absolute rounded-md p-2 text-left text-xs text-white overflow-hidden transition-transform hover:scale-[1.02] hover:z-10 group',
                          getStatusColor(apt.status)
                        )}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: `calc(${(dayIndex + 1) * 12.5}% + 2px)`,
                          width: 'calc(12.5% - 4px)',
                        }}
                      >
                        <p className="font-medium truncate">{apt.pet.name}</p>
                        <p className="truncate opacity-90">{apt.service.name}</p>
                        <p className="truncate opacity-75">
                          {format(new Date(apt.start_time), 'h:mm a')}
                        </p>
                        {/* Quick Actions on Hover */}
                        <div className="hidden group-hover:flex absolute right-1 top-1 gap-1">
                          {apt.status === 'pending' && (
                            <button
                              onClick={(e) => handleQuickConfirm(apt, e)}
                              className="p-1 bg-white/20 rounded hover:bg-white/40"
                              title="Confirm"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              onClick={(e) => handleQuickComplete(apt, e)}
                              className="p-1 bg-white/20 rounded hover:bg-white/40"
                              title="Mark Complete"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </button>
                    );
                  });
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Day View */
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {!isDayOpen(currentDate) ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Closed</p>
                  <p className="text-sm">No appointments on {format(currentDate, 'EEEE')}s</p>
                </div>
              ) : (
                <>
                  {timeSlots.map((time) => {
                    const slotHour = parseInt(time);
                    const slotAppointments = getAppointmentsForDate(currentDate).filter(
                      (apt) => {
                        const aptHour = new Date(apt.start_time).getHours();
                        return aptHour === slotHour && apt.status !== 'cancelled';
                      }
                    );

                    return (
                      <div key={time} className="flex gap-4">
                        <div className="w-20 text-right text-sm text-muted-foreground pt-2">
                          {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
                        </div>
                        <div className="flex-1 min-h-[60px] border-l pl-4">
                          {slotAppointments.length === 0 ? (
                            <div className="h-full flex items-center text-sm text-muted-foreground">
                              Available
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {slotAppointments.map((apt) => (
                                <button
                                  key={apt.id}
                                  onClick={() => setSelectedAppointment(apt)}
                                  className={cn(
                                    'w-full p-3 rounded-lg text-left text-white transition-transform hover:scale-[1.01]',
                                    getStatusColor(apt.status)
                                  )}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Dog className="h-4 w-4" />
                                      <span className="font-medium">{apt.pet.name}</span>
                                    </div>
                                    <span className="text-sm opacity-90">
                                      {formatDuration(apt.service.duration_minutes)}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1 opacity-90">
                                    {apt.service.name} - {apt.client.first_name} {apt.client.last_name}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Detail Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointment(null);
            setIsRescheduleMode(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          {selectedAppointment && !isRescheduleMode && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Dog className="h-5 w-5 text-primary" />
                  {selectedAppointment.pet.name}&apos;s Appointment
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status & Time */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={cn(
                      'capitalize',
                      selectedAppointment.status === 'confirmed' &&
                        'bg-green-100 text-green-800',
                      selectedAppointment.status === 'pending' &&
                        'bg-yellow-100 text-yellow-800',
                      selectedAppointment.status === 'completed' &&
                        'bg-blue-100 text-blue-800'
                    )}
                  >
                    {selectedAppointment.status}
                  </Badge>
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(selectedAppointment.total_price)}
                  </span>
                </div>

                {/* Service Details */}
                <div className="p-4 rounded-lg bg-accent/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(
                        new Date(selectedAppointment.start_time),
                        'EEEE, MMMM d, yyyy'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedAppointment.start_time), 'h:mm a')} -{' '}
                      {format(new Date(selectedAppointment.end_time), 'h:mm a')}
                    </span>
                  </div>
                  <div className="font-medium mt-2">
                    {selectedAppointment.service.name}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.service.description}
                  </p>
                </div>

                {/* Pet Details */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Dog className="h-4 w-4" />
                    Pet Information
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Breed:</span>{' '}
                      {selectedAppointment.pet.breed}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Size:</span>{' '}
                      <span className="capitalize">{selectedAppointment.pet.size}</span>
                    </p>
                    {selectedAppointment.pet.temperament_notes && (
                      <p>
                        <span className="text-muted-foreground">Notes:</span>{' '}
                        {selectedAppointment.pet.temperament_notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Client Details */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client Information
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {selectedAppointment.client.first_name}{' '}
                      {selectedAppointment.client.last_name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {selectedAppointment.client.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {selectedAppointment.client.phone}
                    </p>
                  </div>
                </div>

                {/* Appointment Notes */}
                {selectedAppointment.notes && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={handleOpenReschedule}>
                    <CalendarClock className="h-4 w-4 mr-2" />
                    Reschedule
                  </Button>
                  {selectedAppointment.status === 'pending' && (
                    <Button className="flex-1" onClick={handleConfirmAppointment}>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                  )}
                  {selectedAppointment.status === 'confirmed' && (
                    <Button className="flex-1" onClick={handleMarkComplete}>
                      <Check className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Reschedule Mode */}
          {selectedAppointment && isRescheduleMode && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Reschedule Appointment
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="p-3 rounded-lg bg-accent/50">
                  <p className="font-medium">{selectedAppointment.pet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.service.name} ({formatDuration(selectedAppointment.service.duration_minutes)})
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reschedule-date">New Date</Label>
                  <Input
                    id="reschedule-date"
                    type="date"
                    value={rescheduleForm.date}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reschedule-time">New Time</Label>
                  <Select
                    value={rescheduleForm.time}
                    onValueChange={(value) => setRescheduleForm({ ...rescheduleForm, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlotOptions.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRescheduleMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReschedule}>
                  Confirm Reschedule
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
