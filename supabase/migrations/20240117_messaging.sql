-- Peachy Pooches Messaging System
-- Run this migration in your Supabase SQL editor

-- Conversations between admin and clients
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'client')),
  sender_id UUID,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File attachments
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image/jpeg', 'image/png', 'application/pdf')),
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  document_type TEXT CHECK (document_type IN ('rabies_certificate', 'vaccination_record', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pre-written admin response templates
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('appointment', 'reminder', 'document_request', 'general')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client notification preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_conversations_client_id ON conversations(client_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = FALSE;

-- Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Insert default message templates
INSERT INTO message_templates (name, content, category) VALUES
  ('Appointment Reminder', 'Hi! Just a friendly reminder that you have an appointment scheduled with us. Please let us know if you need to reschedule. We can''t wait to see your pup!', 'appointment'),
  ('Rabies Certificate Request', 'Hi! We noticed we don''t have a current rabies certificate on file for your pet. Could you please upload a copy at your earliest convenience? This helps us keep all our furry clients safe!', 'document_request'),
  ('Vaccination Record Request', 'Hello! We need an updated vaccination record for your pet before their next appointment. Please upload a copy when you have a chance. Thank you!', 'document_request'),
  ('Appointment Confirmation', 'Great news! Your appointment has been confirmed. We look forward to seeing you and your pup! If you have any questions, feel free to message us.', 'appointment'),
  ('Thank You', 'Thank you for visiting Peachy Pooches! We loved having your pup in today. If you have any questions about their grooming or care, don''t hesitate to reach out!', 'general');

-- Storage bucket for attachments (run this in Supabase Storage settings or via API)
-- Create bucket: message-attachments
-- Set to public read access
