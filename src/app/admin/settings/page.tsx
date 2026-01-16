'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  Store,
  Bell,
  Mail,
  DollarSign,
  Calendar,
  Check,
} from 'lucide-react';
import { mockBusinessHours, mockServices } from '@/lib/mock-data';
import { formatPrice } from '@/lib/availability';
import { toast } from 'sonner';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SettingsPage() {
  const [businessHours, setBusinessHours] = useState(mockBusinessHours);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business settings and preferences
        </p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Business Information
          </CardTitle>
          <CardDescription>
            Your business details shown to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                defaultValue="Peachy Pooches"
                placeholder="Your business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                defaultValue="(555) 123-GROOM"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              defaultValue="123 Grooming Lane, Dogtown, CA 90210"
              placeholder="Your business address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="hello@peachypooches.com"
              placeholder="contact@yourbusiness.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Set your operating hours for each day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((hours, index) => (
              <div
                key={hours.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
              >
                <div className="w-28">
                  <span className="font-medium">{dayNames[hours.day_of_week]}</span>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  {hours.is_closed ? (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Closed
                    </Badge>
                  ) : (
                    <>
                      <Select defaultValue={hours.open_time}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['08:00', '09:00', '10:00', '11:00'].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time === '08:00' ? '8:00 AM' :
                               time === '09:00' ? '9:00 AM' :
                               time === '10:00' ? '10:00 AM' : '11:00 AM'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select defaultValue={hours.close_time}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['15:00', '16:00', '17:00', '18:00'].map((time) => (
                            <SelectItem key={time} value={time}>
                              {time === '15:00' ? '3:00 PM' :
                               time === '16:00' ? '4:00 PM' :
                               time === '17:00' ? '5:00 PM' : '6:00 PM'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newHours = [...businessHours];
                    newHours[index] = { ...hours, is_closed: !hours.is_closed };
                    setBusinessHours(newHours);
                  }}
                >
                  {hours.is_closed ? 'Open' : 'Close'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Services & Pricing
          </CardTitle>
          <CardDescription>
            Manage your service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockServices.slice(0, 5).map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{service.name}</p>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {service.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {service.duration_minutes} min
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Services
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Booking Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when a new appointment is booked
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Summary</p>
              <p className="text-sm text-muted-foreground">
                Receive a summary of tomorrow&apos;s appointments each evening
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cancellation Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when a client cancels their appointment
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Customize the emails sent to your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Booking Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  Sent when a booking is confirmed
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit Template
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Appointment Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Sent 24 hours before the appointment
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit Template
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Thank You / Follow-up</p>
                <p className="text-sm text-muted-foreground">
                  Sent after the appointment is completed
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
