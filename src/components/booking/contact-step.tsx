'use client';

import { useBooking } from '@/lib/booking-context';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone } from 'lucide-react';

export function ContactStep() {
  const { formData, updateFormData } = useBooking();
  const client = formData.client || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  const updateClient = (updates: Partial<typeof client>) => {
    updateFormData({
      client: { ...client, ...updates },
    });
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    updateClient({ phone: formatted });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Your Contact Info
        </h2>
        <p className="text-muted-foreground mt-2">
          We&apos;ll send your confirmation here
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="First name"
                value={client.firstName}
                onChange={(e) => updateClient({ firstName: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={client.lastName}
                onChange={(e) => updateClient({ lastName: e.target.value })}
                className="h-12"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={client.email}
              onChange={(e) => updateClient({ email: e.target.value })}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll send your booking confirmation here
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={client.phone}
              onChange={handlePhoneChange}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              For appointment reminders and updates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <p className="text-xs text-center text-muted-foreground">
        Your information is safe with us. We&apos;ll only use it to manage your
        appointments and send important updates.
      </p>
    </div>
  );
}
