import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Calendar,
  Sparkles,
  Heart,
  Star,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { BUSINESS, SERVICES } from '@/lib/constants';
import { IMAGES } from '@/lib/images';
import { Gallery } from '@/components/shared/gallery';
import { HeroDog } from '@/components/shared/hero-dog';

const features = [
  {
    icon: Calendar,
    title: 'Book 24/7',
    description: 'Schedule your appointment anytime, even at 2am on a Sunday',
  },
  {
    icon: Clock,
    title: 'No Phone Tag',
    description: 'Skip the back-and-forth calls. Book in under 2 minutes',
  },
  {
    icon: Sparkles,
    title: 'Instant Confirmation',
    description: "Get email confirmation with all the details you need",
  },
  {
    icon: Heart,
    title: 'Expert Care',
    description: 'Professional groomers who love what they do',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden">
        {/* Hero Background - we'll use a gradient overlay since we may not have a real hero image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#daf2e6]/40 via-background to-[#f5bf3b]/20" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Text content */}
            <div className="text-center md:text-left">
              <Badge variant="secondary" className="mb-4 animate-fade-up bg-secondary text-secondary-foreground">
                <Star className="h-3 w-3 mr-1 fill-current" />
                McLean, VA&apos;s Premier Dog Spa
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fade-up animation-delay-100">
                {BUSINESS.tagline.split(',')[0]},{' '}
                <span className="text-primary">{BUSINESS.tagline.split(',')[1]}</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-up animation-delay-200">
                Professional dog grooming in a stress-free environment. Book your
                appointment online in under 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up animation-delay-300">
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90">
                  <Link href="/book">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8">
                  <Link href="/book">View Services & Pricing</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Instant Confirmation
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Easy Rescheduling
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Walk-ins Welcome
                </span>
              </div>
            </div>

            {/* Right: Animated dog */}
            <div className="hidden md:flex justify-center">
              <HeroDog className="w-80 h-80 lg:w-96 lg:h-96" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-background border-0 shadow-sm animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From relaxing spa baths to full grooming packages, we offer everything
              your pup needs to look and feel their best
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {SERVICES.main.map((service, index) => (
              <Card key={service.id} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">
                    ${service.price}+
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add-ons callout */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Plus add-on services: teeth brushing, nail grinding, blueberry facial, de-shedding & more!
            </p>
            <Button asChild variant="outline">
              <Link href="/book">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery
        title="Our Happy Pups"
        columns={4}
      />

      {/* Hours & Location */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hours */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-destructive">Closed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday</span>
                      <span className="text-destructive">Closed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuesday - Saturday</span>
                      <span className="font-medium">8:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Online booking available 24/7
                  </p>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Location & Contact</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Address</p>
                      <p>{BUSINESS.address.street}</p>
                      <p>{BUSINESS.address.floor}</p>
                      <p>{BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}</p>
                    </div>
                    <div className="space-y-2">
                      <a
                        href={`tel:${BUSINESS.phone.replace(/-/g, '')}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {BUSINESS.phone}
                      </a>
                      <a
                        href={`sms:${BUSINESS.textNumber.replace(/-/g, '')}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Text: {BUSINESS.textNumber}
                      </a>
                      <a
                        href={`mailto:${BUSINESS.email}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {BUSINESS.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center relative">
              <div className="relative z-10">
                <Image
                  src={IMAGES.logo}
                  alt="Peachy Pooches"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 opacity-90"
                />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Book?
                </h2>
                <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
                  Skip the phone call and book your appointment online. It takes
                  less than 2 minutes!
                </p>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 text-lg"
                >
                  <Link href="/book">
                    Book Your Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={IMAGES.logo}
                alt="Peachy Pooches"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="font-semibold">{BUSINESS.name}</span>
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
