import { Service, BusinessHours, Client, Pet, Appointment, BlockedTime } from '@/types/database';

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Bath & Brush',
    description: 'Full bath with premium shampoo, blow dry, brush out, ear cleaning, and nail trim',
    duration_minutes: 60,
    price: 45,
    category: 'bath',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Full Groom - Small',
    description: 'Complete grooming for dogs under 20 lbs. Includes bath, haircut, styling, and all finishing touches',
    duration_minutes: 90,
    price: 65,
    category: 'groom',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Full Groom - Medium',
    description: 'Complete grooming for dogs 20-50 lbs. Includes bath, haircut, styling, and all finishing touches',
    duration_minutes: 120,
    price: 85,
    category: 'groom',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Full Groom - Large',
    description: 'Complete grooming for dogs 50-80 lbs. Includes bath, haircut, styling, and all finishing touches',
    duration_minutes: 150,
    price: 105,
    category: 'groom',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Full Groom - X-Large',
    description: 'Complete grooming for dogs over 80 lbs. Includes bath, haircut, styling, and all finishing touches',
    duration_minutes: 180,
    price: 125,
    category: 'groom',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Puppy First Groom',
    description: 'Gentle introduction to grooming for puppies under 6 months. Includes mini bath, light trim, and lots of positive reinforcement',
    duration_minutes: 45,
    price: 40,
    category: 'specialty',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'De-shedding Treatment',
    description: 'Specialized treatment to reduce shedding. Includes bath with de-shedding shampoo and conditioner, thorough brush out, and blow dry',
    duration_minutes: 90,
    price: 75,
    category: 'specialty',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Nail Trim Only',
    description: 'Quick nail trim and filing',
    duration_minutes: 15,
    price: 15,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Teeth Brushing',
    description: 'Dental hygiene treatment with dog-safe toothpaste',
    duration_minutes: 10,
    price: 10,
    category: 'addon',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockBusinessHours: BusinessHours[] = [
  { id: '1', day_of_week: 0, open_time: '00:00', close_time: '00:00', is_closed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Sunday - Closed
  { id: '2', day_of_week: 1, open_time: '00:00', close_time: '00:00', is_closed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Monday - Closed
  { id: '3', day_of_week: 2, open_time: '09:00', close_time: '17:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Tuesday
  { id: '4', day_of_week: 3, open_time: '09:00', close_time: '17:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Wednesday
  { id: '5', day_of_week: 4, open_time: '09:00', close_time: '17:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Thursday
  { id: '6', day_of_week: 5, open_time: '09:00', close_time: '17:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Friday
  { id: '7', day_of_week: 6, open_time: '09:00', close_time: '15:00', is_closed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Saturday
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
