'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PixelImageProps {
  src: string;
  alt?: string;
  customGrid?: { rows: number; cols: number };
  className?: string;
}

export function PixelImage({
  src,
  alt = '',
  customGrid = { rows: 6, cols: 4 },
  className,
}: PixelImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pixelOrder, setPixelOrder] = useState<number[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  const totalPixels = customGrid.rows * customGrid.cols;

  // Generate randomized pixel reveal order when image changes
  useEffect(() => {
    setIsLoaded(false);
    const order = Array.from({ length: totalPixels }, (_, i) => i);
    // Fisher-Yates shuffle for random reveal order
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    setPixelOrder(order);
  }, [src, totalPixels]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Actual image underneath */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className="w-full h-full object-cover"
      />

      {/* Pixel grid overlay that reveals the image */}
      {isLoaded && (
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${customGrid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${customGrid.rows}, 1fr)`,
          }}
        >
          {pixelOrder.map((pixelIndex, animationIndex) => (
            <motion.div
              key={`${src}-${pixelIndex}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: animationIndex * 0.04,
                ease: 'easeOut',
              }}
              className="bg-background"
              style={{
                gridRow: Math.floor(pixelIndex / customGrid.cols) + 1,
                gridColumn: (pixelIndex % customGrid.cols) + 1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
