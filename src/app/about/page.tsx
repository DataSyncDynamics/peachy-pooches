import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Heart } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { IMAGES } from '@/lib/images';
import { PixelPhotoShowcase } from '@/components/shared/pixel-photo-showcase';

// Curated showcase photos for the pixel image carousel
const SHOWCASE_PHOTOS = [
  IMAGES.gallery[0].src,   // Goldendoodle
  IMAGES.gallery[4].src,   // Variety
  IMAGES.gallery[10].src,  // Different breed
  IMAGES.gallery[15].src,  // Grooming style
  IMAGES.gallery[20].src,  // Happy pup
  IMAGES.gallery[26].src,  // Distinct look
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="default" />

      {/* Hero Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Heart className="h-3 w-3 mr-1 fill-current" />
            About Us
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Where Every Dog is Pampered{' '}
            <span className="text-primary">with Love and Expertise</span>
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Pixel Image Showcase */}
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <PixelPhotoShowcase
                images={SHOWCASE_PHOTOS}
                interval={5000}
                grid={{ rows: 6, cols: 4 }}
                className="w-full h-full"
              />
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Peachy Pooches, we offer professional, personalized dog spa and grooming
                services designed to keep your furry friend looking and feeling their best.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Our welcoming environment is designed to make every visit a positive
                experience. We use only quality, pet-safe products and take the time to
                understand each dog&apos;s unique personality and needs.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                From full grooming sessions to relaxing spa baths with customizable add-ons,
                we treat each pup as an individual. Our experienced groomers are passionate
                about what they do and committed to providing the highest level of care.
              </p>

              <p className="text-xl font-semibold text-foreground">
                At Peachy Pooches, every dog is treated like family.
              </p>

              <Button asChild size="lg" className="mt-4">
                <Link href="/book">
                  Book Your Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Image
                src={IMAGES.logo}
                alt="Peachy Pooches"
                width={120}
                height={19}
                className="h-6 w-auto"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-muted-foreground">
              <span>{BUSINESS.address.city}, {BUSINESS.address.state}</span>
              <span className="hidden md:inline">|</span>
              <a href={`tel:${BUSINESS.phone.replace(/-/g, '')}`} className="hover:text-foreground transition-colors">
                {BUSINESS.phone}
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
