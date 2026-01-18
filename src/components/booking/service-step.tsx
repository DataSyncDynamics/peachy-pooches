'use client';

import { mockServices } from '@/lib/mock-data';
import { formatDuration, formatPrice } from '@/lib/availability';
import { useBooking } from '@/lib/booking-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  bath: 'Bath Services',
  groom: 'Full Grooming',
  specialty: 'Specialty Services',
  addon: 'Add-ons',
};

export function ServiceStep() {
  const { formData, updateFormData } = useBooking();
  const selectedId = formData.service?.id;
  const selectedAddOns = formData.selectedAddOns || [];

  const groupedServices = mockServices.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    },
    {} as Record<string, typeof mockServices>
  );

  const categories = ['groom', 'bath', 'specialty', 'addon'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">Select a Service</h2>
        <p className="text-muted-foreground mt-2">
          Choose the perfect grooming service for your pup
        </p>
      </div>

      {categories.map((category) => {
        const services = groupedServices[category];
        if (!services || services.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {categoryLabels[category]}
            </h3>
            <div className="grid gap-3">
              {services.map((service) => {
                const isAddOn = category === 'addon';
                const isSelected = isAddOn
                  ? selectedAddOns.some(addon => addon.id === service.id)
                  : selectedId === service.id;

                const handleClick = () => {
                  if (isAddOn) {
                    const isCurrentlySelected = selectedAddOns.some(a => a.id === service.id);
                    const newAddOns = isCurrentlySelected
                      ? selectedAddOns.filter(a => a.id !== service.id)
                      : [...selectedAddOns, service];
                    updateFormData({ selectedAddOns: newAddOns });
                  } else {
                    updateFormData({ service });
                  }
                };

                return (
                  <Card
                    key={service.id}
                    className={cn(
                      'cursor-pointer transition-all duration-200 hover:shadow-md',
                      isSelected
                        ? 'ring-2 ring-primary bg-accent/50'
                        : 'hover:bg-accent/30'
                    )}
                    onClick={handleClick}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">
                              {service.name}
                            </h4>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(service.duration_minutes)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-semibold text-primary">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
