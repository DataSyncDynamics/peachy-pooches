'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ExternalLink } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  timeAgo: string;
  text: string;
}

const reviews: Review[] = [
  {
    name: "Sarita O'Neill",
    rating: 5,
    timeAgo: '4 months ago',
    text: 'I could not recommend Peachy Pooches enough! Our dog gets pretty bad separation anxiety, but he comes back from here calm and looking great. We love the way they cut his hair.',
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
  },
  {
    name: 'Val A',
    rating: 5,
    timeAgo: '2 years ago',
    text: 'Amazing first grooming experience for my little Toy Poodle. He was nervous and shaking going in, but the groomers were so gentle and assuring that I felt comfortable letting him go in.',
  },
  {
    name: 'Liz B',
    rating: 5,
    timeAgo: '1 year ago',
    text: 'Peachy Pooches was wonderful with our recently-rescued Husky! He has a lot of anxiety and fear with the vet. The wonderful care from Peachy Pooches made for a great visit and a happy, clean pup!',
  },
  {
    name: 'Taylor Brandy',
    rating: 5,
    timeAgo: '11 months ago',
    text: 'They always do an amazing job on grooming our dog. Her haircut is always perfect and they take wonderful care of her. Would highly recommend them to anyone looking for a great dog groomer!',
  },
  {
    name: 'Michelle R',
    rating: 5,
    timeAgo: '8 months ago',
    text: 'Our labradoodle looks amazing after every visit! They do the cutest teddy bear cuts and he always comes out so fluffy and soft. The staff clearly loves what they do.',
  },
  {
    name: 'David Chen',
    rating: 5,
    timeAgo: '6 months ago',
    text: 'Excellent service every time! Our lab mix can be a handful but they handle him with such patience and care. He comes back looking and smelling wonderful.',
  },
  {
    name: 'Amanda K',
    rating: 5,
    timeAgo: '3 months ago',
    text: 'We bring both our pups here for full grooming and they always come back looking perfect. The team is so accommodating and the results speak for themselves!',
  },
  {
    name: 'Chris Martinez',
    rating: 5,
    timeAgo: '2 months ago',
    text: 'Best groomer in McLean hands down! Professional, friendly, and my dog is always so happy after his appointments. Highly recommend to anyone in the area.',
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
    <div className="flex gap-0.5 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? 'text-primary fill-primary' : 'text-muted'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-md flex flex-col h-full">
      {/* Quote icon */}
      <Quote className="h-6 w-6 text-primary/20 fill-primary/10 mb-2 flex-shrink-0" />

      {/* Star Rating */}
      <StarRating rating={review.rating} />

      {/* Review Text - with line clamp for consistency */}
      <p className="text-sm md:text-base text-foreground leading-relaxed mb-4 flex-1 line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mt-auto">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-semibold text-xs flex-shrink-0">
          {getInitials(review.name)}
        </div>
        <div className="text-left">
          <p className="font-medium text-foreground text-sm leading-tight">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const [activeSet, setActiveSet] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cardsPerSet = 4;
  const totalSets = Math.ceil(reviews.length / cardsPerSet); // 3 sets for 10 reviews

  const getCurrentSetReviews = useCallback(() => {
    const startIndex = activeSet * cardsPerSet;
    const setReviews: Review[] = [];
    for (let i = 0; i < cardsPerSet; i++) {
      setReviews.push(reviews[(startIndex + i) % reviews.length]);
    }
    return setReviews;
  }, [activeSet]);

  const goToSet = useCallback((index: number) => {
    if (index === activeSet) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSet(index);
      setIsTransitioning(false);
    }, 300);
  }, [activeSet]);

  const nextSet = useCallback(() => {
    const next = (activeSet + 1) % totalSets;
    goToSet(next);
  }, [activeSet, totalSets, goToSet]);

  // Auto-rotate every 7 seconds
  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const interval = setInterval(() => {
      nextSet();
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, isTransitioning, nextSet]);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
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

          {/* Grid Container */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Animated Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 transition-all duration-300 ${
                isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
              }`}
            >
              {getCurrentSetReviews().map((review, index) => (
                <ReviewCard key={`${activeSet}-${index}`} review={review} />
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalSets)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSet(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeSet
                    ? 'bg-primary w-8'
                    : 'bg-muted hover:bg-muted-foreground/50 w-2.5'
                }`}
                aria-label={`Go to review set ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Link */}
          <div className="text-center">
            <a
              href="https://www.google.com/search?q=peachy+pooches+mclean+reviews#lrd=0x89b7b537bd78e1a3:0xc3fdf9c9fa392557,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent/80 font-medium transition-colors"
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
