import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate pet age from birth date
 * Returns a human-readable string like "2 yrs" or "8 mo"
 */
export function calculatePetAge(birthDate: string | undefined): string | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  const now = new Date();

  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  let totalMonths = years * 12 + months;

  // Adjust if day hasn't passed yet this month
  if (now.getDate() < birth.getDate()) {
    totalMonths--;
  }

  if (totalMonths < 0) return null;

  if (totalMonths < 12) {
    return `${totalMonths} mo`;
  }

  const displayYears = Math.floor(totalMonths / 12);
  return `${displayYears} yr${displayYears !== 1 ? 's' : ''}`;
}

/**
 * Check if vaccination is expiring soon
 * Returns: 'valid' (30+ days), 'expiring' (<30 days), 'expired'
 */
export function getVaccinationStatus(expiryDate: string | undefined): 'valid' | 'expiring' | 'expired' | null {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  const now = new Date();

  // Set to start of day for accurate comparison
  now.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry < 30) return 'expiring';
  return 'valid';
}

/**
 * Check if pet's birthday is within the specified days ahead
 * Only checks month and day, ignoring year
 */
export function isBirthdaySoon(birthDate: string | undefined, daysAhead: number = 7): boolean {
  if (!birthDate) return false;

  const birth = new Date(birthDate);
  const now = new Date();

  // Create a date for this year's birthday
  const thisYearBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());

  // If birthday already passed this year, check next year
  if (thisYearBirthday < now) {
    thisYearBirthday.setFullYear(now.getFullYear() + 1);
  }

  const daysUntil = Math.ceil((thisYearBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return daysUntil >= 0 && daysUntil <= daysAhead;
}
