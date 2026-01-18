'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

interface Review {
  name: string;
  rating: number;
  timeAgo: string;
  text: string;
  photos?: string[];
}

const reviews: Review[] = [
  {
    name: "Sarita O'Neill",
    rating: 5,
    timeAgo: '4 months ago',
    text: 'I could not recommend Peachy Pooches enough! Our dog gets pretty bad separation anxiety, but he comes back from here calm and looking great. We love the way they cut his hair.',
    photos: IMAGES.reviewPhotos.sarita,
  },
  {
    name: 'JH Kim',
    rating: 5,
    timeAgo: '2 years ago',
    text: 'Wonderful first grooming for our pup who seems to have had a great time. Puppy is happy and we are happy. Many thanks and see you again soon!',
  },
  {
    name: 'Jaime Rafael Yandoc',
    rating: 5,
    timeAgo: '1 year ago',
    text: "I can't say enough good things about Peachy Pooches! The staff is incredibly friendly, knowledgeable, and genuinely loves animals. My dog Russell is usually a bit nervous, but they made him feel so comfortable.",
    photos: IMAGES.reviewPhotos.jaime,
  },
  {
    name: 'Val A',
    rating: 5,
    timeAgo: '2 years ago',
    text: 'Amazing first grooming experience for my little Toy Poodle. He was nervous and shaking going in, but the groomers were so gentle and assuring that I felt comfortable letting him go in.',
    photos: IMAGES.reviewPhotos.val,
  },
  {
    name: 'Liz B',
    rating: 5,
    timeAgo: '1 year ago',
    text: 'Peachy Pooches was wonderful with our recently-rescued Husky! He has a lot of anxiety and fear with the vet. The wonderful care from Peachy Pooches made for a great visit and a happy, clean pup!',
    photos: IMAGES.reviewPhotos.liz,
  },
  {
    name: 'Taylor Brandy',
    rating: 5,
    timeAgo: '11 months ago',
    text: 'They always do an amazing job on grooming our dog. Her haircut is always perfect and they take wonderful care of her. Would highly recommend them to anyone looking for a great dog groomer!',
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-primary fill-primary' : 'text-muted'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, isActive }: { review: Review; isActive: boolean }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-6 transition-all duration-300 ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
      }`}
    >
      {/* Review Content */}
      <div className="flex-1 flex flex-col">
        {/* Large decorative quote */}
        <Quote className="h-10 w-10 text-primary/20 fill-primary/10 mb-2 flex-shrink-0" />

        {/* Star Rating */}
        <StarRating rating={review.rating} />

        {/* Review Text */}
        <p className="text-base md:text-lg text-foreground leading-relaxed mb-4">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Reviewer Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
            {getInitials(review.name)}
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground text-sm">{review.name}</p>
            <p className="text-xs text-muted-foreground">{review.timeAgo}</p>
          </div>
        </div>
      </div>

      {/* Photos (if any) - hidden on mobile */}
      {review.photos && review.photos.length > 0 && (
        <div className="hidden md:flex flex-col gap-3 w-1/3 flex-shrink-0">
          {review.photos.slice(0, 2).map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md">
              <Image
                src={photo}
                alt={`Photo from ${review.name}`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 0px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Filter reviews to only include those with photos
  const filteredReviews = reviews.filter(
    (review) => review.photos && review.photos.length > 0
  );

  const goToReview = useCallback((index: number) => {
    if (index < 0) {
      setActiveIndex(filteredReviews.length - 1);
    } else if (index >= filteredReviews.length) {
      setActiveIndex(0);
    } else {
      setActiveIndex(index);
    }
  }, [filteredReviews.length]);

  const nextReview = useCallback(() => {
    goToReview(activeIndex + 1);
  }, [activeIndex, goToReview]);

  const prevReview = useCallback(() => {
    goToReview(activeIndex - 1);
  }, [activeIndex, goToReview]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextReview();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextReview]);

  // Touch handlers for swipe support
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextReview();
    } else if (isRightSwipe) {
      prevReview();
    }
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Customer Reviews
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-primary fill-primary"
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.8</span>
              <span>·</span>
              <span>49 Google Reviews</span>
            </div>
          </div>

          {/* Sliding Carousel Container */}
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={containerRef}
          >
            {/* Arrow Buttons */}
            <button
              onClick={prevReview}
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Sliding Track Container with overflow hidden */}
            <div className="overflow-hidden mx-8 md:mx-12">
              {/* Sliding Track */}
              <div
                className="flex gap-8 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${activeIndex} * (100% + 32px)))`,
                }}
              >
                {filteredReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full"
                  >
                    <ReviewCard review={review} isActive={index === activeIndex} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {filteredReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted hover:bg-muted-foreground/50 w-2.5'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Link */}
          <div className="text-center">
            <a
              href="https://www.google.com/search?q=peachy+pooches+mclean+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Leave a review on Google
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
