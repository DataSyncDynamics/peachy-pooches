import { Service, BusinessHours, Client, Pet, Appointment, BlockedTime, Conversation, Message, MessageAttachment, MessageTemplate, NotificationPreferences, Stylist, ClientDocument } from '@/types/database';

// Real services from Peachy Pooches
export const mockServices: Service[] = [
  // Main Services
  {
    id: '1',
    name: 'Full Haircut',
    description: 'Complete grooming package including bath, blow-dry, haircut, ear cleaning, and nail trim. Our signature service!',
    duration_minutes: 150,
    price: 175,
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
    price: 120,
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
    price: 85,
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
    price: 145,
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
    price: 25,
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
    price: 35,
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
    price: 30,
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
    price: 55,
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
    price: 40,
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

// Stylists
export const mockStylists: Stylist[] = [
  { id: 'st1', name: 'Jessica', color: '#f472b6', is_active: true },  // Pink
  { id: 'st2', name: 'Maria', color: '#60a5fa', is_active: true },    // Blue
  { id: 'st3', name: 'Taylor', color: '#4ade80', is_active: true },   // Green
  { id: 'st4', name: 'Ashley', color: '#fbbf24', is_active: true },   // Amber
  { id: 'st5', name: 'Jordan', color: '#a78bfa', is_active: true },   // Purple
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
    verification_status: 'verified',
    verified_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    verified_by: 'Admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    email: 'mike.wilson@email.com',
    phone: '(555) 234-5678',
    first_name: 'Mike',
    last_name: 'Wilson',
    verification_status: 'documents_requested',
    verification_notes: 'Waiting for updated rabies certificate for Coco',
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
    verification_status: 'verified',
    verified_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    verified_by: 'Admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c4',
    email: 'jennifer.martinez@email.com',
    phone: '(555) 456-7890',
    first_name: 'Jennifer',
    last_name: 'Martinez',
    notes: 'Prefers afternoon appointments',
    verification_status: 'pending_review',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c5',
    email: 'david.chen@email.com',
    phone: '(555) 567-8901',
    first_name: 'David',
    last_name: 'Chen',
    notes: 'Has two dogs - often books back-to-back',
    verification_status: 'pending_review',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to generate dates relative to today
const getRelativeDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Helper to generate birthdate (years ago)
const getBirthdate = (yearsAgo: number, monthsAgo: number = 0) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  date.setMonth(date.getMonth() - monthsAgo);
  return date.toISOString().split('T')[0];
};

// Helper to create a birthday coming up in N days
const getUpcomingBirthday = (daysFromNow: number, yearsOld: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setFullYear(date.getFullYear() - yearsOld);
  return date.toISOString().split('T')[0];
};

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
    birth_date: getBirthdate(3, 6),
    vaccination_expiry: getRelativeDate(120),
    preferred_style: 'Natural trim',
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
    birth_date: getUpcomingBirthday(5, 5), // Birthday in 5 days!
    vaccination_expiry: getRelativeDate(45),
    preferred_style: 'Short summer cut',
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
    birth_date: getBirthdate(2, 0),
    vaccination_expiry: getRelativeDate(15), // Expiring soon
    preferred_style: 'Teddy bear cut',
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
    birth_date: getBirthdate(4, 2),
    vaccination_expiry: getRelativeDate(-10), // Expired!
    preferred_style: 'Puppy cut',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p5',
    client_id: 'c4',
    name: 'Luna',
    breed: 'Bernedoodle',
    size: 'large',
    weight_lbs: 55,
    coat_type: 'Wavy, Thick',
    temperament_notes: 'Playful and energetic',
    birth_date: getBirthdate(2, 3),
    vaccination_expiry: getRelativeDate(90),
    preferred_style: 'Teddy bear cut',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p6',
    client_id: 'c5',
    name: 'Rocky',
    breed: 'French Bulldog',
    size: 'small',
    weight_lbs: 25,
    coat_type: 'Short, Smooth',
    temperament_notes: 'Loves belly rubs',
    birth_date: getBirthdate(3, 0),
    vaccination_expiry: getRelativeDate(60),
    preferred_style: 'Standard bath and brush',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p7',
    client_id: 'c5',
    name: 'Pepper',
    breed: 'Chihuahua',
    size: 'small',
    weight_lbs: 6,
    coat_type: 'Short',
    temperament_notes: 'Can be nervous - needs calm environment',
    special_instructions: 'Handle gently, speaks softly',
    birth_date: getBirthdate(5, 6),
    vaccination_expiry: getRelativeDate(30),
    preferred_style: 'Bath and nail trim',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generate sample appointments (some in the past, some in the future)
const today = new Date();

// Helper to get next available business day at a specific hour
const getNextAvailableBusinessDay = (hour: number, minute: number = 0) => {
  const date = new Date(today);
  // If today is closed (Sun=0 or Mon=1), move to next business day
  while (date.getDay() === 0 || date.getDay() === 1) {
    date.setDate(date.getDate() + 1);
  }
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// Helper to get next business day (Tue-Sat, skipping Sun=0, Mon=1)
const getNextBusinessDay = (daysFromNow: number, hour: number) => {
  const date = new Date(today);

  // For future appointments, find the next open day
  if (daysFromNow > 0) {
    let businessDaysCount = 0;
    while (businessDaysCount < daysFromNow) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      // Skip Sunday (0) and Monday (1)
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        businessDaysCount++;
      }
    }
  } else {
    // For past appointments, go back but land on business days
    date.setDate(date.getDate() + daysFromNow);
    // If landed on closed day, move to previous open day
    while (date.getDay() === 0 || date.getDay() === 1) {
      date.setDate(date.getDate() - 1);
    }
  }

  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const mockAppointments: Appointment[] = [
  // "Today's" appointments - but on next business day if today is closed
  {
    id: 'today1',
    client_id: 'c1',
    pet_id: 'p1',
    service_id: '1',
    stylist_id: 'st1',
    start_time: getNextAvailableBusinessDay(8, 0),
    end_time: getNextAvailableBusinessDay(10, 30),
    status: 'confirmed',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'today2',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '3',
    stylist_id: 'st2',
    start_time: getNextAvailableBusinessDay(9, 30),
    end_time: getNextAvailableBusinessDay(10, 30),
    status: 'confirmed',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'today3',
    client_id: 'c1',
    pet_id: 'p2',
    service_id: '2',
    stylist_id: 'st1',
    start_time: getNextAvailableBusinessDay(11, 0),
    end_time: getNextAvailableBusinessDay(12, 30),
    status: 'confirmed',
    total_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'today4',
    client_id: 'c3',
    pet_id: 'p4',
    service_id: '1',
    stylist_id: 'st3',
    start_time: getNextAvailableBusinessDay(11, 0),
    end_time: getNextAvailableBusinessDay(13, 30),
    status: 'confirmed',
    notes: 'Use hypoallergenic shampoo',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'today5',
    client_id: 'c1',
    pet_id: 'p1',
    service_id: '3',
    stylist_id: 'st2',
    start_time: getNextAvailableBusinessDay(13, 0),
    end_time: getNextAvailableBusinessDay(14, 0),
    status: 'pending',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'today6',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '2',
    stylist_id: 'st1',
    start_time: getNextAvailableBusinessDay(14, 30),
    end_time: getNextAvailableBusinessDay(16, 0),
    status: 'confirmed',
    total_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Future appointments
  {
    id: 'a1',
    client_id: 'c1',
    pet_id: 'p1',
    service_id: '4',
    stylist_id: 'st1',
    start_time: getNextBusinessDay(1, 10),
    end_time: getNextBusinessDay(1, 12),
    status: 'confirmed',
    total_price: 195,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '3',
    stylist_id: 'st2',
    start_time: getNextBusinessDay(1, 14),
    end_time: getNextBusinessDay(1, 16),
    status: 'confirmed',
    total_price: 165,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a3',
    client_id: 'c3',
    pet_id: 'p4',
    service_id: '2',
    stylist_id: 'st3',
    start_time: getNextBusinessDay(2, 9),
    end_time: getNextBusinessDay(2, 10),
    status: 'confirmed',
    total_price: 120,
    notes: 'Remember hypoallergenic shampoo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a4',
    client_id: 'c1',
    pet_id: 'p2',
    service_id: '7',
    stylist_id: 'st1',
    start_time: getNextBusinessDay(3, 11),
    end_time: getNextBusinessDay(3, 12),
    status: 'pending',
    total_price: 145,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // More Day +1 appointments
  {
    id: 'a5',
    client_id: 'c4',
    pet_id: 'p5',
    service_id: '1',
    stylist_id: 'st4', // Ashley
    start_time: getNextBusinessDay(1, 8),
    end_time: getNextBusinessDay(1, 10),
    status: 'confirmed',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a6',
    client_id: 'c5',
    pet_id: 'p6',
    service_id: '3',
    stylist_id: 'st5', // Jordan
    start_time: getNextBusinessDay(1, 9),
    end_time: getNextBusinessDay(1, 10),
    status: 'confirmed',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a7',
    client_id: 'c5',
    pet_id: 'p7',
    service_id: '3',
    stylist_id: 'st5', // Jordan - back to back with Rocky
    start_time: getNextBusinessDay(1, 10),
    end_time: getNextBusinessDay(1, 11),
    status: 'confirmed',
    notes: 'Handle gently - nervous',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Day +2 appointments
  {
    id: 'a8',
    client_id: 'c1',
    pet_id: 'p1',
    service_id: '2',
    stylist_id: 'st1', // Jessica
    start_time: getNextBusinessDay(2, 8),
    end_time: getNextBusinessDay(2, 9),
    status: 'confirmed',
    total_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a9',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '4',
    stylist_id: 'st2', // Maria
    start_time: getNextBusinessDay(2, 10),
    end_time: getNextBusinessDay(2, 11),
    status: 'pending',
    total_price: 145,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a10',
    client_id: 'c4',
    pet_id: 'p5',
    service_id: '2',
    stylist_id: 'st3', // Taylor
    start_time: getNextBusinessDay(2, 11),
    end_time: getNextBusinessDay(2, 12),
    status: 'confirmed',
    total_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a11',
    client_id: 'c3',
    pet_id: 'p4',
    service_id: '3',
    stylist_id: 'st4', // Ashley
    start_time: getNextBusinessDay(2, 14),
    end_time: getNextBusinessDay(2, 15),
    status: 'confirmed',
    notes: 'Use hypoallergenic shampoo',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // UNASSIGNED - Walk-in booking
  {
    id: 'unassigned1',
    client_id: 'c4',
    pet_id: 'p5',
    service_id: '1',
    stylist_id: undefined, // UNASSIGNED
    start_time: getNextBusinessDay(2, 9),
    end_time: getNextBusinessDay(2, 11),
    status: 'pending',
    notes: 'Online booking - needs stylist assignment',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Day +3 appointments
  {
    id: 'a12',
    client_id: 'c5',
    pet_id: 'p6',
    service_id: '4',
    stylist_id: 'st1', // Jessica
    start_time: getNextBusinessDay(3, 8),
    end_time: getNextBusinessDay(3, 9),
    status: 'confirmed',
    total_price: 145,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a13',
    client_id: 'c1',
    pet_id: 'p2',
    service_id: '3',
    stylist_id: 'st2', // Maria
    start_time: getNextBusinessDay(3, 10),
    end_time: getNextBusinessDay(3, 11),
    status: 'pending',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a14',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '1',
    stylist_id: 'st5', // Jordan
    start_time: getNextBusinessDay(3, 13),
    end_time: getNextBusinessDay(3, 15),
    status: 'confirmed',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // UNASSIGNED - Online booking
  {
    id: 'unassigned2',
    client_id: 'c5',
    pet_id: 'p7',
    service_id: '3',
    stylist_id: undefined, // UNASSIGNED
    start_time: getNextBusinessDay(3, 14),
    end_time: getNextBusinessDay(3, 15),
    status: 'pending',
    notes: 'Walk-in request - assign stylist',
    total_price: 85,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Day +4 appointments
  {
    id: 'a15',
    client_id: 'c3',
    pet_id: 'p4',
    service_id: '1',
    stylist_id: 'st3', // Taylor
    start_time: getNextBusinessDay(4, 9),
    end_time: getNextBusinessDay(4, 11),
    status: 'confirmed',
    notes: 'Use hypoallergenic shampoo',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a16',
    client_id: 'c4',
    pet_id: 'p5',
    service_id: '4',
    stylist_id: 'st4', // Ashley
    start_time: getNextBusinessDay(4, 11),
    end_time: getNextBusinessDay(4, 12),
    status: 'pending',
    total_price: 145,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a17',
    client_id: 'c1',
    pet_id: 'p1',
    service_id: '2',
    stylist_id: 'st1', // Jessica
    start_time: getNextBusinessDay(4, 14),
    end_time: getNextBusinessDay(4, 15),
    status: 'confirmed',
    total_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // UNASSIGNED - Phone booking
  {
    id: 'unassigned3',
    client_id: 'c2',
    pet_id: 'p3',
    service_id: '2',
    stylist_id: undefined, // UNASSIGNED
    start_time: getNextBusinessDay(4, 8),
    end_time: getNextBusinessDay(4, 9),
    status: 'pending',
    notes: 'Phone booking - customer requested any available stylist',
    total_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // UNASSIGNED - New client inquiry
  {
    id: 'unassigned4',
    client_id: 'c5',
    pet_id: 'p6',
    service_id: '1',
    stylist_id: undefined, // UNASSIGNED
    start_time: getNextBusinessDay(4, 13),
    end_time: getNextBusinessDay(4, 15),
    status: 'pending',
    notes: 'New client - first visit, assign experienced stylist',
    total_price: 175,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Past appointments (completed this month - realistic grooming business volume)
  // ~3-4 dogs per day, 5 days/week = 60-80 dogs/month
  // Average price ~$150 = $9,000-12,000/month revenue
  ...generateCompletedAppointments(),
];

// Generate ~55 completed appointments spread across the current month
function generateCompletedAppointments(): Appointment[] {
  const completed: Appointment[] = [];
  const clients = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const clientPets: Record<string, string[]> = {
    c1: ['p1', 'p2'],
    c2: ['p3'],
    c3: ['p4'],
    c4: ['p5'],
    c5: ['p6', 'p7'],
  };
  const stylists = ['st1', 'st2', 'st3', 'st4', 'st5'];

  // Service prices and durations
  const services = [
    { id: '1', price: 175, duration: 150 }, // Full Haircut
    { id: '2', price: 120, duration: 90 },  // In Between
    { id: '3', price: 85, duration: 60 },   // Spa Bath
    { id: '4', price: 145, duration: 90 },  // Thera-Clean
  ];

  // Go back through the month, generating appointments on business days
  let appointmentCount = 0;
  for (let daysBack = 2; daysBack <= 28 && appointmentCount < 55; daysBack++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysBack);

    // Skip Sunday (0) and Monday (1)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 1) continue;

    // Generate 3-4 appointments per business day
    const appointmentsPerDay = 3 + Math.floor(Math.random() * 2);
    const timeSlots = [8, 10, 12, 14];

    for (let slot = 0; slot < appointmentsPerDay && appointmentCount < 55; slot++) {
      const clientId = clients[appointmentCount % clients.length];
      const petOptions = clientPets[clientId];
      const petId = petOptions[Math.floor(Math.random() * petOptions.length)];
      const stylistId = stylists[appointmentCount % stylists.length];
      const service = services[Math.floor(Math.random() * services.length)];
      const hour = timeSlots[slot];

      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duration);

      // Add small variations to price (+/- $20 for size/add-ons)
      const priceVariation = Math.floor(Math.random() * 40) - 10;
      const finalPrice = service.price + priceVariation;

      completed.push({
        id: `completed${appointmentCount + 1}`,
        client_id: clientId,
        pet_id: petId,
        service_id: service.id,
        stylist_id: stylistId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'completed',
        total_price: finalPrice,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      appointmentCount++;
    }
  }

  return completed;
}

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
export function getAppointmentsWithDetails(): (Appointment & { client: Client; pet: Pet; service: Service; stylist?: Stylist })[] {
  return mockAppointments.map((apt) => ({
    ...apt,
    client: mockClients.find((c) => c.id === apt.client_id)!,
    pet: mockPets.find((p) => p.id === apt.pet_id)!,
    service: mockServices.find((s) => s.id === apt.service_id)!,
    stylist: apt.stylist_id ? mockStylists.find((st) => st.id === apt.stylist_id) : undefined,
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
  {
    id: 'att2',
    message_id: 'msg4',
    file_name: 'bella_vaccination_record.pdf',
    file_type: 'application/pdf',
    file_size: 312000,
    storage_path: 'message-attachments/c1/bella_vaccination_record.pdf',
    document_type: 'vaccination_record',
    created_at: getMessageDateString(2),
  },
];

// Client Documents for verification
export const mockClientDocuments: ClientDocument[] = [
  {
    id: 'doc1',
    client_id: 'c2',
    pet_id: 'p3', // Coco
    attachment_id: 'att1',
    document_type: 'rabies_certificate',
    status: 'pending_review',
    created_at: getMessageDateString(5),
  },
  {
    id: 'doc2',
    client_id: 'c1',
    pet_id: 'p1', // Bella
    attachment_id: 'att2',
    document_type: 'vaccination_record',
    status: 'approved',
    reviewed_at: getMessageDateString(1),
    reviewed_by: 'Admin',
    expiry_date: getRelativeDate(120),
    created_at: getMessageDateString(2),
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

// ============================================
// Mutation Helpers (for admin actions)
// ============================================

// Update appointment status
export function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment['status']
): Appointment | null {
  const index = mockAppointments.findIndex((a) => a.id === appointmentId);
  if (index === -1) return null;

  mockAppointments[index] = {
    ...mockAppointments[index],
    status,
    updated_at: new Date().toISOString(),
  };
  return mockAppointments[index];
}

// Update appointment time
export function updateAppointmentTime(
  appointmentId: string,
  startTime: string,
  endTime: string
): Appointment | null {
  const index = mockAppointments.findIndex((a) => a.id === appointmentId);
  if (index === -1) return null;

  mockAppointments[index] = {
    ...mockAppointments[index],
    start_time: startTime,
    end_time: endTime,
    updated_at: new Date().toISOString(),
  };
  return mockAppointments[index];
}

// Update appointment stylist
export function updateAppointmentStylist(
  appointmentId: string,
  stylistId: string | null
): Appointment | null {
  const index = mockAppointments.findIndex((a) => a.id === appointmentId);
  if (index === -1) return null;

  mockAppointments[index] = {
    ...mockAppointments[index],
    stylist_id: stylistId || undefined,
    updated_at: new Date().toISOString(),
  };
  return mockAppointments[index];
}

// Update client
export function updateClient(
  clientId: string,
  updates: Partial<Pick<Client, 'first_name' | 'last_name' | 'email' | 'phone' | 'notes'>>
): Client | null {
  const index = mockClients.findIndex((c) => c.id === clientId);
  if (index === -1) return null;

  mockClients[index] = {
    ...mockClients[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return mockClients[index];
}

// Service CRUD operations
export function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Service {
  const newService: Service = {
    ...service,
    id: `s${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockServices.push(newService);
  return newService;
}

export function updateService(
  serviceId: string,
  updates: Partial<Pick<Service, 'name' | 'description' | 'duration_minutes' | 'price' | 'category' | 'is_active'>>
): Service | null {
  const index = mockServices.findIndex((s) => s.id === serviceId);
  if (index === -1) return null;

  mockServices[index] = {
    ...mockServices[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return mockServices[index];
}

export function deleteService(serviceId: string): boolean {
  const index = mockServices.findIndex((s) => s.id === serviceId);
  if (index === -1) return false;

  mockServices.splice(index, 1);
  return true;
}

// Message template CRUD operations
export function updateMessageTemplate(
  templateId: string,
  updates: Partial<Pick<MessageTemplate, 'name' | 'content' | 'category' | 'is_active'>>
): MessageTemplate | null {
  const index = mockMessageTemplates.findIndex((t) => t.id === templateId);
  if (index === -1) return null;

  mockMessageTemplates[index] = {
    ...mockMessageTemplates[index],
    ...updates,
  };
  return mockMessageTemplates[index];
}

export function createMessageTemplate(
  template: Omit<MessageTemplate, 'id' | 'created_at'>
): MessageTemplate {
  const newTemplate: MessageTemplate = {
    ...template,
    id: `mt${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  mockMessageTemplates.push(newTemplate);
  return newTemplate;
}

// Business settings update
export function updateBusinessHours(hours: BusinessHours[]): void {
  hours.forEach((h) => {
    const index = mockBusinessHours.findIndex((bh) => bh.id === h.id);
    if (index !== -1) {
      mockBusinessHours[index] = {
        ...h,
        updated_at: new Date().toISOString(),
      };
    }
  });
}

// ============================================
// Client Verification Mutation Helpers
// ============================================

// Verify a client
export function verifyClient(clientId: string, notes?: string): Client | null {
  const index = mockClients.findIndex((c) => c.id === clientId);
  if (index === -1) return null;

  mockClients[index] = {
    ...mockClients[index],
    verification_status: 'verified',
    verification_notes: notes,
    verified_at: new Date().toISOString(),
    verified_by: 'Admin',
    updated_at: new Date().toISOString(),
  };
  return mockClients[index];
}

// Request documents from client
export function requestDocuments(clientId: string, notes?: string): Client | null {
  const index = mockClients.findIndex((c) => c.id === clientId);
  if (index === -1) return null;

  mockClients[index] = {
    ...mockClients[index],
    verification_status: 'documents_requested',
    verification_notes: notes,
    updated_at: new Date().toISOString(),
  };
  return mockClients[index];
}

// Reject a client
export function rejectClient(clientId: string, notes?: string): Client | null {
  const index = mockClients.findIndex((c) => c.id === clientId);
  if (index === -1) return null;

  mockClients[index] = {
    ...mockClients[index],
    verification_status: 'rejected',
    verification_notes: notes,
    updated_at: new Date().toISOString(),
  };
  return mockClients[index];
}

// Approve a client document
export function approveDocument(
  documentId: string,
  expiryDate?: string
): ClientDocument | null {
  const index = mockClientDocuments.findIndex((d) => d.id === documentId);
  if (index === -1) return null;

  mockClientDocuments[index] = {
    ...mockClientDocuments[index],
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: 'Admin',
    expiry_date: expiryDate,
  };

  // Update pet vaccination_expiry if this is a vaccination document
  const doc = mockClientDocuments[index];
  if (doc.pet_id && expiryDate && (doc.document_type === 'rabies_certificate' || doc.document_type === 'vaccination_record')) {
    const petIndex = mockPets.findIndex((p) => p.id === doc.pet_id);
    if (petIndex !== -1) {
      mockPets[petIndex] = {
        ...mockPets[petIndex],
        vaccination_expiry: expiryDate,
        updated_at: new Date().toISOString(),
      };
    }
  }

  return mockClientDocuments[index];
}

// Reject a client document
export function rejectDocument(documentId: string, notes?: string): ClientDocument | null {
  const index = mockClientDocuments.findIndex((d) => d.id === documentId);
  if (index === -1) return null;

  mockClientDocuments[index] = {
    ...mockClientDocuments[index],
    status: 'rejected',
    reviewed_at: new Date().toISOString(),
    reviewed_by: 'Admin',
    notes,
  };
  return mockClientDocuments[index];
}

// Get clients needing review (pending_review or documents_requested)
export function getClientsNeedingReview(): Client[] {
  return mockClients.filter(
    (c) => c.verification_status === 'pending_review' || c.verification_status === 'documents_requested'
  );
}

// Get pending documents for review
export function getPendingDocuments(): (ClientDocument & {
  client: Client;
  pet?: Pet;
  attachment: MessageAttachment
})[] {
  return mockClientDocuments
    .filter((d) => d.status === 'pending_review')
    .map((doc) => ({
      ...doc,
      client: mockClients.find((c) => c.id === doc.client_id)!,
      pet: doc.pet_id ? mockPets.find((p) => p.id === doc.pet_id) : undefined,
      attachment: mockMessageAttachments.find((a) => a.id === doc.attachment_id)!,
    }));
}

// Get documents for a specific client
export function getClientDocuments(clientId: string): (ClientDocument & {
  pet?: Pet;
  attachment: MessageAttachment;
})[] {
  return mockClientDocuments
    .filter((d) => d.client_id === clientId)
    .map((doc) => ({
      ...doc,
      pet: doc.pet_id ? mockPets.find((p) => p.id === doc.pet_id) : undefined,
      attachment: mockMessageAttachments.find((a) => a.id === doc.attachment_id)!,
    }));
}
