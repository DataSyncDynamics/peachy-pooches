// Peachy Pooches Business Information

export const BUSINESS = {
  name: 'Peachy Pooches',
  tagline: 'Pampering Your Pup, One Groom at a Time!',
  subtitle: 'Dog Spa & Grooming',
  phone: '703-712-8207',
  textNumber: '703-415-8003',
  email: 'admin@peachypooches.net',
  address: {
    street: '6730 Curran St',
    floor: '1st Floor',
    city: 'McLean',
    state: 'VA',
    zip: '22101',
    full: '6730 Curran St (1st Floor), McLean, VA 22101',
  },
  hours: {
    display: 'Tuesday–Saturday, 8:00 AM–4:00 PM',
    open: '8:00 AM',
    close: '4:00 PM',
    closedDays: ['Sunday', 'Monday'],
  },
  social: {
    facebook: 'https://www.facebook.com/peachypooches',
  },
} as const;

// Brand Colors
export const COLORS = {
  cream: '#fcf7f6',
  mint: '#daf2e6',
  gold: '#f5bf3b',
  slateBlue: '#559fb8',
  charcoal: '#212934',
} as const;

// Services offered
export const SERVICES = {
  main: [
    {
      id: 'full-haircut',
      name: 'Full Haircut',
      description: 'Complete grooming including bath, blow-dry, haircut, ear cleaning, and nail trim',
      price: 85,
      duration: '2-3 hours',
      category: 'groom',
    },
    {
      id: 'in-between',
      name: 'In Between',
      description: 'Maintenance trim to keep your pup looking fresh between full grooms',
      price: 65,
      duration: '1-1.5 hours',
      category: 'groom',
    },
    {
      id: 'spa-bath',
      name: 'Spa Bath',
      description: 'Luxurious bath with blow-dry, ear cleaning, and nail trim',
      price: 45,
      duration: '1 hour',
      category: 'bath',
    },
    {
      id: 'thera-clean',
      name: 'Thera-Clean Microbubble Spa',
      description: 'Therapeutic deep clean using advanced microbubble technology for sensitive skin',
      price: 75,
      duration: '1.5 hours',
      category: 'specialty',
    },
  ],
  addons: [
    { id: 'teeth-brushing', name: 'Teeth Brushing', price: 10 },
    { id: 'nail-grinding', name: 'Nail Grinding', price: 15 },
    { id: 'blueberry-facial', name: 'Blueberry Facial', price: 12 },
    { id: 'de-shedding', name: 'De-shedding Treatment', price: 25 },
    { id: 'flea-tick', name: 'Flea & Tick Treatment', price: 15 },
    { id: 'medicated-bath', name: 'Medicated Bath', price: 20 },
    { id: 'pawdicure', name: 'Pawdicure', price: 15 },
    { id: 'ear-cleaning', name: 'Ear Cleaning', price: 8 },
    { id: 'cologne-bandana', name: 'Cologne & Bandana', price: 5 },
  ],
} as const;
