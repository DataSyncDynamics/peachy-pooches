import { NextRequest, NextResponse } from 'next/server';
import { mockClients, mockNotificationPreferences } from '@/lib/mock-data';
import { sendMessageNotification } from '@/lib/messaging/notifications';
import { NotificationPreferences } from '@/types/database';

// POST /api/messages/notifications - Send notification to a client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, message, isUrgent = false } = body;

    if (!clientId || !message) {
      return NextResponse.json(
        { error: 'Client ID and message are required' },
        { status: 400 }
      );
    }

    // Find client
    const client = mockClients.find((c) => c.id === clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get notification preferences
    const preferences = mockNotificationPreferences.find(
      (p) => p.client_id === clientId
    );

    // Send notification
    const result = await sendMessageNotification(
      client,
      preferences || null,
      message,
      isUrgent
    );

    return NextResponse.json({
      success: result.success,
      email: result.email,
      sms: result.sms,
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// GET /api/messages/notifications - Get notification preferences for a client
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 }
    );
  }

  const preferences = mockNotificationPreferences.find(
    (p) => p.client_id === clientId
  );

  // Return default preferences if none exist
  const defaultPrefs: Omit<NotificationPreferences, 'id' | 'created_at'> = {
    client_id: clientId,
    email_enabled: true,
    sms_enabled: false,
  };

  return NextResponse.json({
    preferences: preferences || defaultPrefs,
  });
}

// PATCH /api/messages/notifications - Update notification preferences
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, email_enabled, sms_enabled } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Find existing preferences
    let prefIndex = mockNotificationPreferences.findIndex(
      (p) => p.client_id === clientId
    );

    if (prefIndex === -1) {
      // Create new preferences
      const newPrefs: NotificationPreferences = {
        id: `np${Date.now()}`,
        client_id: clientId,
        email_enabled: email_enabled ?? true,
        sms_enabled: sms_enabled ?? false,
        created_at: new Date().toISOString(),
      };
      mockNotificationPreferences.push(newPrefs);
      prefIndex = mockNotificationPreferences.length - 1;
    } else {
      // Update existing
      if (email_enabled !== undefined) {
        mockNotificationPreferences[prefIndex].email_enabled = email_enabled;
      }
      if (sms_enabled !== undefined) {
        mockNotificationPreferences[prefIndex].sms_enabled = sms_enabled;
      }
    }

    return NextResponse.json({
      preferences: mockNotificationPreferences[prefIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
