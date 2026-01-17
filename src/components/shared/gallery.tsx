'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMAGES } from '@/lib/images';

interface GalleryProps {
  images?: readonly string[] | string[];
  title?: string;
  columns?: 3 | 4;
}

export function Gallery({
  images = IMAGES.gallery,
  title = 'Our Happy Pups',
  columns = 4,
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const gridCols = columns === 3
    ? 'grid-cols-2 md:grid-cols-3'
    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out some of our recent grooming transformations
            </p>
          </div>
        )}

        <div className={`grid ${gridCols} gap-4`}>
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Image
                src={src}
                alt={`Groomed dog ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
            <div className="relative aspect-square md:aspect-video flex items-center justify-center">
              {selectedIndex !== null && (
                <Image
                  src={images[selectedIndex]}
                  alt={`Groomed dog ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}

              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
              >
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
              >
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-2 right-2 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {selectedIndex !== null && `${selectedIndex + 1} / ${images.length}`}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
