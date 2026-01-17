import { Service, BusinessHours, Client, Pet, Appointment, BlockedTime, Conversation, Message, MessageAttachment, MessageTemplate, NotificationPreferences } from '@/types/database';

// Real services from Peachy Pooches
export const mockServices: Service[] = [
  // Main Services
  {
    id: '1',
    name: 'Full Haircut',
    description: 'Complete grooming package including bath, blow-dry, haircut, ear cleaning, and nail trim. Our signature service!',
    duration_minutes: 150,
    price: 85,
    category: 'groom',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'In Between',
    description: 'Maintenance trim to keep your pup looking fresh between full grooms. Includes face, feet, and sanitary trim.',
    duration_minutes: 90,
    price: 65,
    category: 'groom',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Spa Bath',
    description: 'Luxurious bath experience with premium shampoo, blow-dry, ear cleaning, and nail trim. Perfect for short-haired breeds.',
    duration_minutes: 60,
    price: 45,
    category: 'bath',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Thera-Clean Microbubble Spa',
    description: 'Therapeutic deep clean using advanced microbubble technology. Ideal for dogs with sensitive skin, allergies, or skin conditions.',
    duration_minutes: 90,
    price: 75,
    category: 'specialty',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Add-on Services
  {
    id: '5',
    name: 'Teeth Brushing',
    description: 'Dental hygiene treatment with dog-safe toothpaste for fresh breath',
    duration_minutes: 10,
    price: 10,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Nail Grinding',
    description: 'Smooth nail filing for a polished finish, gentler than clipping',
    duration_minutes: 15,
    price: 15,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Blueberry Facial',
    description: 'Gentle facial scrub to brighten and clean tear stains',
    duration_minutes: 15,
    price: 12,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'De-shedding Treatment',
    description: 'Specialized treatment to reduce shedding with special shampoo and thorough brush out',
    duration_minutes: 30,
    price: 25,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Flea & Tick Treatment',
    description: 'Medicated bath to eliminate fleas and ticks',
    duration_minutes: 20,
    price: 15,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Real business hours: Tuesday-Saturday 8am-4pm, Closed Sun/Mon
export const mockBusinessHours: BusinessHours[] = [
  { id: '1', day_of_week: 0, open_time: '00:00', close_time: '00:00', is_closed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Sunday - Closed
  { id: '2', day_of_week: 1, open_time: '00:00', close_time: '00:00', is_closed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Monday - Closed
  { id: '3', day_of_week: 2, open_time: '08:00', close_time: '16:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Tuesday
  { id: '4', day_of_week: 3, open_time: '08:00', close_time: '16:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Wednesday
  { id: '5', day_of_week: 4, open_time: '08:00', close_time: '16:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Thursday
  { id: '6', day_of_week: 5, open_time: '08:00', close_time: '16:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Friday
  { id: '7', day_of_week: 6, open_time: '08:00', close_time: '16:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Saturday
];

// Generate sample clients
export const mockClients: Client[] = [
  {
    id: 'c1',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    first_name: 'Sarah',
    last_name: 'Johnson',
    notes: 'Prefers early morning appointments',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    email: 'mike.wilson@email.com',
    phone: '(555) 234-5678',
    first_name: 'Mike',
    last_name: 'Wilson',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    email: 'emily.davis@email.com',
    phone: '(555) 345-6789',
    first_name: 'Emily',
    last_name: 'Davis',
    notes: 'VIP client - always tips well',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockPets: Pet[] = [
  {
    id: 'p1',
    client_id: 'c1',
    name: 'Bella',
    breed: 'Golden Retriever',
    size: 'large',
    weight_lbs: 65,
    coat_type: 'Long, Double Coat',
    temperament_notes: 'Very friendly, loves treats',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    client_id: 'c1',
    name: 'Max',
    breed: 'Labrador',
    size: 'large',
    weight_lbs: 70,
    coat_type: 'Short, Dense',
    temperament_notes: 'Can be nervous around dryers',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    client_id: 'c2',
    name: 'Coco',
    breed: 'Poodle',
    size: 'medium',
    weight_lbs: 35,
    coat_type: 'Curly',
    temperament_notes: 'Great behavior',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p4',
    client_id: 'c3',
    name: 'Daisy',
    breed: 'Shih Tzu',
    size: 'small',
    weight_lbs: 12,
    coat_type: 'Long, Silky',
    temperament_notes: 'Needs gentle handling',
    special_instructions: 'Use hypoallergenic shampoo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generate sample appointments (some in the past, some in the future)
const today = new Date();
const getDateString = (daysFromNow: number, hour: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    client_id: 'c1',
    pet_id: 'p1',
    service_id: '4',
    start_time: getDateString(1, 10),
    end_time: getDateString(1, 12),
    status: 'confirmed',
    total_price: 105,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '3',
    start_time: getDateString(1, 14),
    end_time: getDateString(1, 16),
    status: 'confirmed',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a3',
    client_id: 'c3',
    pet_id: 'p4',
    service_id: '2',
    start_time: getDateString(2, 9),
    end_time: getDateString(2, 10),
    status: 'confirmed',
    total_price: 65,
    notes: 'Remember hypoallergenic shampoo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a4',
    client_id: 'c1',
    pet_id: 'p2',
    service_id: '7',
    start_time: getDateString(3, 11),
    end_time: getDateString(3, 12),
    status: 'pending',
    total_price: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a5',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '1',
    start_time: getDateString(-2, 10),
    end_time: getDateString(-2, 11),
    status: 'completed',
    total_price: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a6',
    client_id: 'c3',
    pet_id: 'p4',
    service_id: '2',
    start_time: getDateString(-5, 14),
    end_time: getDateString(-5, 15),
    status: 'completed',
    total_price: 65,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Lunch break blocked time (recurring daily)
export const mockBlockedTimes: BlockedTime[] = [
  {
    id: 'bt1',
    start_time: '12:00',
    end_time: '13:00',
    reason: 'Lunch Break',
    is_recurring: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to get appointments with joined data
export function getAppointmentsWithDetails(): (Appointment & { client: Client; pet: Pet; service: Service })[] {
  return mockAppointments.map((apt) => ({
    ...apt,
    client: mockClients.find((c) => c.id === apt.client_id)!,
    pet: mockPets.find((p) => p.id === apt.pet_id)!,
    service: mockServices.find((s) => s.id === apt.service_id)!,
  }));
}

// ============================================
// Messaging Mock Data
// ============================================

// Message Templates
export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 'mt1',
    name: 'Appointment Reminder',
    content: "Hi! Just a friendly reminder that you have an appointment scheduled with us. Please let us know if you need to reschedule. We can't wait to see your pup!",
    category: 'appointment',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mt2',
    name: 'Rabies Certificate Request',
    content: "Hi! We noticed we don't have a current rabies certificate on file for your pet. Could you please upload a copy at your earliest convenience? This helps us keep all our furry clients safe!",
    category: 'document_request',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mt3',
    name: 'Vaccination Record Request',
    content: "Hello! We need an updated vaccination record for your pet before their next appointment. Please upload a copy when you have a chance. Thank you!",
    category: 'document_request',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mt4',
    name: 'Appointment Confirmation',
    content: "Great news! Your appointment has been confirmed. We look forward to seeing you and your pup! If you have any questions, feel free to message us.",
    category: 'appointment',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mt5',
    name: 'Thank You',
    content: "Thank you for visiting Peachy Pooches! We loved having your pup in today. If you have any questions about their grooming or care, don't hesitate to reach out!",
    category: 'general',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Notification Preferences
export const mockNotificationPreferences: NotificationPreferences[] = [
  {
    id: 'np1',
    client_id: 'c1',
    email_enabled: true,
    sms_enabled: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'np2',
    client_id: 'c2',
    email_enabled: true,
    sms_enabled: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'np3',
    client_id: 'c3',
    email_enabled: true,
    sms_enabled: true,
    created_at: new Date().toISOString(),
  },
];

// Sample Conversations
const getMessageDateString = (hoursAgo: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    client_id: 'c1',
    appointment_id: 'a1',
    subject: 'Upcoming appointment for Bella',
    status: 'open',
    last_message_at: getMessageDateString(2),
    created_at: getMessageDateString(48),
    updated_at: getMessageDateString(2),
  },
  {
    id: 'conv2',
    client_id: 'c2',
    subject: 'Rabies certificate for Coco',
    status: 'open',
    last_message_at: getMessageDateString(5),
    created_at: getMessageDateString(72),
    updated_at: getMessageDateString(5),
  },
  {
    id: 'conv3',
    client_id: 'c3',
    appointment_id: 'a3',
    subject: 'Question about Daisy\'s shampoo',
    status: 'closed',
    last_message_at: getMessageDateString(120),
    created_at: getMessageDateString(168),
    updated_at: getMessageDateString(120),
  },
];

// Sample Messages
export const mockMessages: Message[] = [
  // Conversation 1: Sarah Johnson about Bella's appointment
  {
    id: 'msg1',
    conversation_id: 'conv1',
    sender_type: 'admin',
    content: "Hi Sarah! Just a reminder about Bella's appointment tomorrow at 10am for her Thera-Clean Microbubble Spa. Can't wait to see her!",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(48),
  },
  {
    id: 'msg2',
    conversation_id: 'conv1',
    sender_type: 'client',
    sender_id: 'c1',
    content: "Thank you for the reminder! We're looking forward to it. Quick question - should I bring Bella's regular shampoo or will you provide everything?",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(24),
  },
  {
    id: 'msg3',
    conversation_id: 'conv1',
    sender_type: 'admin',
    content: "We have everything here! The microbubble spa uses a special gentle cleanser that's great for Bella's coat. No need to bring anything, just Bella herself! 🐕",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(12),
  },
  {
    id: 'msg4',
    conversation_id: 'conv1',
    sender_type: 'client',
    sender_id: 'c1',
    content: "Perfect! See you tomorrow. Also, I wanted to ask - do you need her updated rabies certificate? I just got it renewed.",
    is_read: false,
    is_urgent: false,
    created_at: getMessageDateString(2),
  },

  // Conversation 2: Mike Wilson about Coco's rabies certificate
  {
    id: 'msg5',
    conversation_id: 'conv2',
    sender_type: 'admin',
    content: "Hi Mike! We noticed Coco's rabies certificate on file has expired. Could you please upload an updated copy when you get a chance? It helps us keep all our furry clients safe!",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(72),
  },
  {
    id: 'msg6',
    conversation_id: 'conv2',
    sender_type: 'client',
    sender_id: 'c2',
    content: "Oh! I didn't realize it had expired. I'll get that from the vet and upload it today.",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(48),
  },
  {
    id: 'msg7',
    conversation_id: 'conv2',
    sender_type: 'client',
    sender_id: 'c2',
    content: "Here's the updated certificate!",
    is_read: false,
    is_urgent: false,
    created_at: getMessageDateString(5),
  },

  // Conversation 3: Emily Davis about Daisy's shampoo (closed)
  {
    id: 'msg8',
    conversation_id: 'conv3',
    sender_type: 'client',
    sender_id: 'c3',
    content: "Hi! I wanted to check - are you still using the hypoallergenic shampoo for Daisy? Her skin has been a bit sensitive lately.",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(168),
  },
  {
    id: 'msg9',
    conversation_id: 'conv3',
    sender_type: 'admin',
    content: "Absolutely! We always use the hypoallergenic shampoo for Daisy. We have it noted in her profile. If her skin is extra sensitive, we can also do a shorter bath time and be extra gentle. Would you like us to do that for her next visit?",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(144),
  },
  {
    id: 'msg10',
    conversation_id: 'conv3',
    sender_type: 'client',
    sender_id: 'c3',
    content: "That would be wonderful, thank you so much for being so attentive to her needs! 💕",
    is_read: true,
    is_urgent: false,
    created_at: getMessageDateString(120),
  },
];

// Sample Attachments
export const mockMessageAttachments: MessageAttachment[] = [
  {
    id: 'att1',
    message_id: 'msg7',
    file_name: 'coco_rabies_cert_2024.pdf',
    file_type: 'application/pdf',
    file_size: 245000,
    storage_path: 'message-attachments/c2/coco_rabies_cert_2024.pdf',
    document_type: 'rabies_certificate',
    created_at: getMessageDateString(5),
  },
];

// Helper to get conversations with joined data
export function getConversationsWithDetails(): (Conversation & {
  client: Client;
  appointment?: Appointment & { pet: Pet; service: Service };
  unread_count: number;
  last_message?: Message;
})[] {
  return mockConversations.map((conv) => {
    const messages = mockMessages.filter((m) => m.conversation_id === conv.id);
    const unreadCount = messages.filter((m) => !m.is_read && m.sender_type === 'client').length;
    const lastMessage = messages.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const appointment = conv.appointment_id
      ? mockAppointments.find((a) => a.id === conv.appointment_id)
      : undefined;

    return {
      ...conv,
      client: mockClients.find((c) => c.id === conv.client_id)!,
      appointment: appointment
        ? {
            ...appointment,
            pet: mockPets.find((p) => p.id === appointment.pet_id)!,
            service: mockServices.find((s) => s.id === appointment.service_id)!,
          }
        : undefined,
      unread_count: unreadCount,
      last_message: lastMessage,
    };
  });
}

// Helper to get messages with attachments
export function getMessagesWithAttachments(conversationId: string): (Message & { attachments: MessageAttachment[] })[] {
  return mockMessages
    .filter((m) => m.conversation_id === conversationId)
    .map((m) => ({
      ...m,
      attachments: mockMessageAttachments.filter((a) => a.message_id === m.id),
    }))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}
