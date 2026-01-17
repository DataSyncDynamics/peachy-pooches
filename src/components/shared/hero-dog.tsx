'use client';

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface HeroDogProps {
  className?: string;
}

export function HeroDog({ className }: HeroDogProps) {
  return (
    <div className={className}>
      <Lottie
        animationData={require('@/../public/animations/dog-hero.json')}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
