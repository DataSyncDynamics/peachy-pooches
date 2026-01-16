'use client';

import { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, isToday, isFuture, isPast } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Dog,
} from 'lucide-react';
import { mockAppointments, mockClients, mockServices, mockPets, getAppointmentsWithDetails } from '@/lib/mock-data';
import { formatPrice } from '@/lib/availability';

export default function AdminDashboard() {
  const appointmentsWithDetails = useMemo(() => getAppointmentsWithDetails(), []);

  const stats = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const monthStart = startOfMonth(today);

    const todayAppointments = appointmentsWithDetails.filter(
      (apt) => isToday(new Date(apt.start_time)) && apt.status !== 'cancelled'
    );

    const weekAppointments = appointmentsWithDetails.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return aptDate >= weekStart && aptDate <= weekEnd && apt.status !== 'cancelled';
    });

    const completedThisMonth = appointmentsWithDetails.filter((apt) => {
      const aptDate = new Date(apt.start_time);
      return aptDate >= monthStart && apt.status === 'completed';
    });

    const weekRevenue = weekAppointments
      .filter((apt) => apt.status === 'completed' || apt.status === 'confirmed')
      .reduce((sum, apt) => sum + apt.total_price, 0);

    const monthRevenue = completedThisMonth.reduce((sum, apt) => sum + apt.total_price, 0);

    const pendingAppointments = appointmentsWithDetails.filter(
      (apt) => apt.status === 'pending' && isFuture(new Date(apt.start_time))
    );

    return {
      todayCount: todayAppointments.length,
      weekCount: weekAppointments.length,
      weekRevenue,
      monthRevenue,
      totalClients: mockClients.length,
      pendingCount: pendingAppointments.length,
      todayAppointments,
      upcomingAppointments: appointmentsWithDetails
        .filter((apt) => isFuture(new Date(apt.start_time)) && apt.status !== 'cancelled')
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 5),
    };
  }, [appointmentsWithDetails]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/calendar">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Link>
          </Button>
          <Button asChild>
            <Link href="/book" target="_blank">
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-3xl font-bold">{stats.todayCount}</p>
                <p className="text-xs text-muted-foreground">appointments</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold">{formatPrice(stats.weekRevenue)}</p>
                <p className="text-xs text-muted-foreground">{stats.weekCount} bookings</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold">{stats.totalClients}</p>
                <p className="text-xs text-muted-foreground">registered</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">need confirmation</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
            <Badge variant="secondary">{format(new Date(), 'EEEE, MMM d')}</Badge>
          </CardHeader>
          <CardContent>
            {stats.todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-accent/50"
                  >
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-semibold">
                        {format(new Date(apt.start_time), 'h:mm')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(apt.start_time), 'a')}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Dog className="h-4 w-4 text-primary" />
                        <p className="font-medium truncate">{apt.pet.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {apt.service.name} - {apt.client.first_name} {apt.client.last_name}
                      </p>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/calendar">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-3 rounded-lg border"
                  >
                    <div className="text-center min-w-[50px]">
                      <p className="text-sm font-semibold">
                        {format(new Date(apt.start_time), 'MMM')}
                      </p>
                      <p className="text-2xl font-bold">
                        {format(new Date(apt.start_time), 'd')}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {apt.pet.name} - {apt.service.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(apt.start_time), 'h:mm a')} -{' '}
                        {apt.client.first_name} {apt.client.last_name}
                      </p>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats / Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="text-sm text-muted-foreground mb-1">Time Saved</p>
              <p className="text-2xl font-bold">
                {Math.round(stats.weekCount * 5 / 60 * 10) / 10} hrs
              </p>
              <p className="text-xs text-muted-foreground">
                vs phone bookings ({stats.weekCount} x 5 min calls)
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="text-sm text-muted-foreground mb-1">Avg. Booking Value</p>
              <p className="text-2xl font-bold">
                {formatPrice(stats.weekCount > 0 ? stats.weekRevenue / stats.weekCount : 0)}
              </p>
              <p className="text-xs text-muted-foreground">per appointment</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="text-sm text-muted-foreground mb-1">Month Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(stats.monthRevenue)}</p>
              <p className="text-xs text-muted-foreground">completed appointments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
