'use client';

import { useBooking } from '@/lib/booking-context';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dog, Ruler } from 'lucide-react';
import { Pet } from '@/types/database';

const sizeOptions: { value: Pet['size']; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: 'Under 20 lbs' },
  { value: 'medium', label: 'Medium', description: '20-50 lbs' },
  { value: 'large', label: 'Large', description: '50-80 lbs' },
  { value: 'xlarge', label: 'X-Large', description: 'Over 80 lbs' },
];

const popularBreeds = [
  'Golden Retriever',
  'Labrador',
  'Poodle',
  'French Bulldog',
  'German Shepherd',
  'Bulldog',
  'Beagle',
  'Shih Tzu',
  'Yorkshire Terrier',
  'Dachshund',
  'Boxer',
  'Husky',
  'Maltese',
  'Pomeranian',
  'Cocker Spaniel',
  'Mixed Breed',
  'Other',
];

interface PetFormState {
  name: string;
  breed: string;
  size: Pet['size'] | undefined;
  notes: string;
}

export function PetStep() {
  const { formData, updateFormData } = useBooking();
  const pet: PetFormState = formData.pet ? {
    name: formData.pet.name,
    breed: formData.pet.breed,
    size: formData.pet.size,
    notes: formData.pet.notes || '',
  } : { name: '', breed: '', size: undefined, notes: '' };

  const updatePet = (updates: Partial<PetFormState>) => {
    const newPet = { ...pet, ...updates };
    if (newPet.name && newPet.breed && newPet.size) {
      updateFormData({
        pet: {
          name: newPet.name,
          breed: newPet.breed,
          size: newPet.size,
          notes: newPet.notes,
        },
      });
    } else {
      // Still update for partial data, but cast to expected type
      updateFormData({
        pet: newPet as { name: string; breed: string; size: Pet['size']; notes?: string },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Tell Us About Your Pup
        </h2>
        <p className="text-muted-foreground mt-2">
          Help us prepare for the perfect grooming experience
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Pet Name */}
          <div className="space-y-2">
            <Label htmlFor="petName" className="flex items-center gap-2">
              <Dog className="h-4 w-4" />
              Pet Name *
            </Label>
            <Input
              id="petName"
              placeholder="What's your dog's name?"
              value={pet.name}
              onChange={(e) => updatePet({ name: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            <Select
              value={pet.breed}
              onValueChange={(value) => updatePet({ breed: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {popularBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Size *
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePet({ size: option.value })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    pet.size === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Special Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any allergies, sensitivities, or things we should know about?"
              value={pet.notes || ''}
              onChange={(e) => updatePet({ notes: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              e.g., &quot;Nervous around dryers&quot;, &quot;Sensitive skin - use gentle shampoo&quot;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
