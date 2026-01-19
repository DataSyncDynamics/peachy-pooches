'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelImage } from '@/components/magicui/pixel-image';
import { cn } from '@/lib/utils';

interface PixelPhotoShowcaseProps {
  images: string[];
  interval?: number;
  grid?: { rows: number; cols: number };
  className?: string;
}

export function PixelPhotoShowcase({
  images,
  interval = 5000,
  grid = { rows: 6, cols: 4 },
  className,
}: PixelPhotoShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval, isPaused]);

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <PixelImage
            src={images[currentIndex]}
            customGrid={grid}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              idx === currentIndex
                ? 'bg-primary w-4'
                : 'bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
