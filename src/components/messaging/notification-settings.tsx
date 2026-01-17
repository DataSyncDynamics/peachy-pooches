'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { mockNotificationPreferences } from '@/lib/mock-data';
import { NotificationPreferences } from '@/types/database';
import { Bell, Mail, MessageSquare, Loader2 } from 'lucide-react';

interface NotificationSettingsProps {
  clientId: string;
  onSave?: (preferences: NotificationPreferences) => void;
}

export function NotificationSettings({ clientId, onSave }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<Partial<NotificationPreferences>>({
    email_enabled: true,
    sms_enabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences
  useEffect(() => {
    const timer = setTimeout(() => {
      const existing = mockNotificationPreferences.find((p) => p.client_id === clientId);
      if (existing) {
        setPreferences({
          email_enabled: existing.email_enabled,
          sms_enabled: existing.sms_enabled,
        });
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [clientId]);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update mock data
    const existingIndex = mockNotificationPreferences.findIndex(
      (p) => p.client_id === clientId
    );

    const updatedPrefs: NotificationPreferences = {
      id: existingIndex !== -1 ? mockNotificationPreferences[existingIndex].id : `np${Date.now()}`,
      client_id: clientId,
      email_enabled: preferences.email_enabled ?? true,
      sms_enabled: preferences.sms_enabled ?? false,
      created_at: existingIndex !== -1
        ? mockNotificationPreferences[existingIndex].created_at
        : new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      mockNotificationPreferences[existingIndex] = updatedPrefs;
    } else {
      mockNotificationPreferences.push(updatedPrefs);
    }

    setIsSaving(false);
    onSave?.(updatedPrefs);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive messages from Peachy Pooches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label htmlFor="email-toggle" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive messages via email
              </p>
            </div>
          </div>
          <button
            id="email-toggle"
            role="switch"
            aria-checked={preferences.email_enabled}
            onClick={() =>
              setPreferences((prev) => ({
                ...prev,
                email_enabled: !prev.email_enabled,
              }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.email_enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.email_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* SMS notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label htmlFor="sms-toggle" className="font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive urgent messages via text
              </p>
            </div>
          </div>
          <button
            id="sms-toggle"
            role="switch"
            aria-checked={preferences.sms_enabled}
            onClick={() =>
              setPreferences((prev) => ({
                ...prev,
                sms_enabled: !prev.sms_enabled,
              }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences.sms_enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.sms_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Save button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
