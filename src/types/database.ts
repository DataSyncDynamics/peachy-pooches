export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: 'bath' | 'groom' | 'specialty' | 'addon';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  client_id: string;
  name: string;
  breed: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  weight_lbs?: number;
  coat_type?: string;
  temperament_notes?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  pet_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Client;
  pet?: Pet;
  service?: Service;
}

export interface BusinessHours {
  id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  open_time: string; // HH:MM format
  close_time: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockedTime {
  id: string;
  start_time: string;
  end_time: string;
  reason: string;
  is_recurring: boolean;
  recurring_day?: number;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  label: string;
}

export interface BookingFormData {
  service?: Service;
  date?: Date;
  time?: string;
  pet?: {
    name: string;
    breed: string;
    size: Pet['size'];
    notes?: string;
  };
  client?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export type BookingStep = 'service' | 'datetime' | 'pet' | 'contact' | 'confirm';

// Messaging Types
export interface Conversation {
  id: string;
  client_id: string;
  appointment_id?: string;
  subject?: string;
  status: 'open' | 'closed' | 'archived';
  last_message_at: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Client;
  appointment?: Appointment;
  unread_count?: number;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'admin' | 'client';
  sender_id?: string;
  content: string;
  is_read: boolean;
  is_urgent: boolean;
  created_at: string;
  // Joined fields
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_type: 'image/jpeg' | 'image/png' | 'application/pdf';
  file_size: number;
  storage_path: string;
  document_type?: 'rabies_certificate' | 'vaccination_record' | 'other';
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category?: 'appointment' | 'reminder' | 'document_request' | 'general';
  is_active: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  client_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  created_at: string;
}
