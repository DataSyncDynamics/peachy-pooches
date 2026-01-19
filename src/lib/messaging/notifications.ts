import { Resend } from 'resend';
import twilio from 'twilio';
import { Client, NotificationPreferences } from '@/types/database';

// Initialize Resend for email - lazy initialization to avoid build errors
let resend: Resend | null = null;
function getResendClient(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// Initialize Twilio for SMS - only if valid credentials are provided
// Twilio account SIDs start with 'AC'
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const isValidTwilioConfig = twilioAccountSid?.startsWith('AC') && twilioAuthToken;

let twilioClient: ReturnType<typeof twilio> | null = null;
if (isValidTwilioConfig) {
  try {
    twilioClient = twilio(twilioAccountSid, twilioAuthToken);
  } catch {
    console.warn('Failed to initialize Twilio client - SMS notifications disabled');
  }
}

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const FROM_EMAIL = 'Peachy Pooches <noreply@peachypooches.com>';

interface NotificationResult {
  success: boolean;
  email?: { sent: boolean; error?: string };
  sms?: { sent: boolean; error?: string };
}

export async function sendMessageNotification(
  client: Client,
  preferences: NotificationPreferences | null,
  messageContent: string,
  isUrgent: boolean = false
): Promise<NotificationResult> {
  const result: NotificationResult = { success: false };

  // Default to email enabled if no preferences set
  const emailEnabled = preferences?.email_enabled ?? true;
  const smsEnabled = preferences?.sms_enabled ?? false;

  // Send email notification
  const emailClient = getResendClient();
  if (emailEnabled && client.email && emailClient) {
    try {
      await emailClient.emails.send({
        from: FROM_EMAIL,
        to: client.email,
        subject: isUrgent
          ? '🚨 Urgent Message from Peachy Pooches'
          : 'New Message from Peachy Pooches',
        html: generateEmailHtml(client.first_name, messageContent, isUrgent),
      });
      result.email = { sent: true };
    } catch (error) {
      result.email = {
        sent: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  // Send SMS notification for urgent messages or if SMS is enabled
  if ((isUrgent || smsEnabled) && client.phone && twilioClient && TWILIO_PHONE_NUMBER) {
    try {
      // Format phone number (assuming US format)
      const formattedPhone = formatPhoneNumber(client.phone);

      await twilioClient.messages.create({
        body: isUrgent
          ? `🚨 URGENT from Peachy Pooches: ${truncateMessage(messageContent, 140)}`
          : `Peachy Pooches: ${truncateMessage(messageContent, 140)}`,
        from: TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });
      result.sms = { sent: true };
    } catch (error) {
      result.sms = {
        sent: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS'
      };
    }
  }

  result.success = (result.email?.sent || result.sms?.sent) ?? false;
  return result;
}

function generateEmailHtml(firstName: string, messageContent: string, isUrgent: boolean): string {
  const urgentBanner = isUrgent
    ? `<div style="background-color: #ef4444; color: white; padding: 12px; text-align: center; font-weight: bold; border-radius: 8px; margin-bottom: 16px;">
        🚨 This is an urgent message
       </div>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f9a8d4 0%, #fbbf24 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🐕 Peachy Pooches</h1>
      </div>

      ${urgentBanner}

      <p style="font-size: 16px;">Hi ${firstName},</p>

      <p style="font-size: 16px;">You have a new message from Peachy Pooches:</p>

      <div style="background-color: #f8f9fa; border-left: 4px solid #f9a8d4; padding: 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; white-space: pre-wrap;">${messageContent}</p>
      </div>

      <p style="font-size: 16px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/messages"
           style="display: inline-block; background-color: #f9a8d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          View & Reply
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

      <p style="font-size: 12px; color: #666;">
        Peachy Pooches Pet Grooming<br>
        Questions? Reply to this message or call us!
      </p>
    </body>
    </html>
  `;
}

function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If 10 digits, assume US number and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If 11 digits starting with 1, add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // Otherwise return as-is with + prefix
  return digits.startsWith('+') ? digits : `+${digits}`;
}

function truncateMessage(message: string, maxLength: number): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength - 3) + '...';
}
