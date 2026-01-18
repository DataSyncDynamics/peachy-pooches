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
  ChevronDown,
} from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { IMAGES } from '@/lib/images';
import { Gallery } from '@/components/shared/gallery';
import { HeroDog } from '@/components/shared/hero-dog';
import { Reviews } from '@/components/shared/reviews';

const features = [
  {
    step: 1,
    icon: Calendar,
    title: 'Book 24/7',
    description: 'Schedule your appointment anytime, even at 2am on a Sunday',
    extendedDescription: 'Our online booking system is always available. Pick your preferred date and time that works for your schedule.',
  },
  {
    step: 2,
    icon: Clock,
    title: 'No Phone Tag',
    description: 'Skip the back-and-forth calls. Book in under 2 minutes',
    extendedDescription: 'No more waiting on hold or playing phone tag. Select your service, choose a time, and you\'re done.',
  },
  {
    step: 3,
    icon: Sparkles,
    title: 'Instant Confirmation',
    description: 'Get email confirmation with all the details you need',
    extendedDescription: 'Receive immediate confirmation with appointment details, directions, and what to expect.',
  },
  {
    step: 4,
    icon: Heart,
    title: 'Expert Care',
    description: 'Professional groomers who love what they do',
    extendedDescription: 'Your pup is pampered by experienced groomers who treat every dog like their own.',
    isReward: true,
  },
];

// Enhanced service data for journey cards
const enhancedServices = [
  {
    id: 'full-haircut',
    name: 'Full Haircut',
    description: 'Complete grooming including bath, blow-dry, haircut, ear cleaning, and nail trim',
    price: 85,
    duration: '2-3 hours',
    includedFeatures: ['Bath', 'Haircut', 'Nails', 'Ears', 'Blow-dry'],
    perfectFor: 'Dogs needing a fresh style or those with matted coats',
    accentColor: 'gold',
    imageUrl: IMAGES.services.fullHaircut,
  },
  {
    id: 'in-between',
    name: 'In Between',
    description: 'Maintenance trim to keep your pup looking fresh between full grooms',
    price: 65,
    duration: '1-1.5 hours',
    includedFeatures: ['Bath', 'Light Trim', 'Nails', 'Ears'],
    perfectFor: 'Pups who need a quick refresh between full grooming sessions',
    accentColor: 'mixed',
    imageUrl: IMAGES.services.inBetween,
  },
  {
    id: 'spa-bath',
    name: 'Spa Bath',
    description: 'Luxurious bath with blow-dry, ear cleaning, and nail trim',
    price: 45,
    duration: '1 hour',
    includedFeatures: ['Bath', 'Blow-dry', 'Nails', 'Ears'],
    perfectFor: 'Short-haired breeds or dogs who just need a good clean',
    accentColor: 'mint',
    imageUrl: IMAGES.services.spaBath,
  },
  {
    id: 'thera-clean',
    name: 'Thera-Clean Microbubble Spa',
    description: 'Therapeutic deep clean using advanced microbubble technology for sensitive skin',
    price: 75,
    duration: '1.5 hours',
    includedFeatures: ['Microbubble Bath', 'Deep Clean', 'Skin Therapy'],
    perfectFor: 'Dogs with allergies, sensitive skin, or skin conditions',
    accentColor: 'purple',
    imageUrl: IMAGES.services.theraClean,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Full-Page Hero Section */}
      <section className="relative min-h-[100dvh] bg-[#212934] overflow-hidden">
        {/* Header with transparent variant */}
        <Header variant="transparent" />

        {/* Hero Content */}
        <div className="container relative mx-auto px-4 pt-24 pb-16 min-h-[100dvh] flex flex-col">
          <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Text content */}
            <div className="text-center md:text-left order-2 md:order-1">
              <Badge className="mb-4 animate-fade-up bg-[#f5bf3b]/20 text-[#f5bf3b] border-[#f5bf3b]/30 hover:bg-[#f5bf3b]/30">
                <Star className="h-3 w-3 mr-1 fill-current" />
                McLean, VA&apos;s Premier Dog Spa
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-up animation-delay-100">
                {BUSINESS.tagline.split(',')[0]},{' '}
                <span className="text-[#f5bf3b]">{BUSINESS.tagline.split(',')[1]}</span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl animate-fade-up animation-delay-200">
                Professional dog grooming in a stress-free environment. Book your
                appointment online in under 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up animation-delay-300">
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-[#f5bf3b] hover:bg-[#f5bf3b]/90 text-[#212934] font-semibold">
                  <Link href="/book">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 bg-white/10 border-white/50 text-white hover:bg-white/20 hover:border-white/70">
                  <Link href="/book">View Services</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-8 text-sm text-[#daf2e6]">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Instant Confirmation
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Easy Rescheduling
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Walk-ins Welcome
                </span>
              </div>
            </div>

            {/* Right: Large Animated dog */}
            <div className="flex justify-center order-1 md:order-2">
              <HeroDog className="w-56 h-56 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px]" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 pb-8 text-white/40 animate-bounce">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Features Section - Timeline Journey */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-secondary text-foreground border-secondary">
              Simple & Easy
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Book your pup&apos;s spa day in just a few simple steps
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isReward = 'isReward' in feature && feature.isReward;
              return (
                <div key={feature.title} className="relative animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Connecting line on desktop (hidden on last card) */}
                  {index < features.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/40 to-primary/10 z-0" />
                  )}

                  <Card className={`relative bg-card border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isReward
                      ? 'border-pink-300 hover:border-pink-400 bg-gradient-to-br from-white to-pink-50'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}>
                    <CardContent className="p-6 pt-8 text-center">
                      {/* Step Badge */}
                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                        isReward
                          ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white'
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {feature.step}
                      </div>

                      {/* Icon Circle */}
                      <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        isReward
                          ? 'bg-gradient-to-br from-pink-100 to-rose-200'
                          : 'bg-gradient-to-br from-primary/20 to-secondary'
                      }`}>
                        <Icon className={`h-10 w-10 ${isReward ? 'text-pink-600' : 'text-primary'}`} />
                      </div>

                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.extendedDescription}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview - Journey Cards */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Tailored Grooming
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From relaxing spa baths to full grooming packages, we offer everything
              your pup needs to look and feel their best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {enhancedServices.map((service, index) => {
              // Determine accent colors based on service type
              const getAccentClasses = () => {
                switch (service.accentColor) {
                  case 'gold':
                    return {
                      header: 'from-amber-100 via-orange-50 to-amber-100',
                      border: 'hover:border-amber-400',
                      price: 'text-amber-600',
                      pill: 'bg-amber-100 text-amber-800',
                      perfectFor: 'bg-amber-50 border-amber-200',
                      button: 'hover:bg-amber-500',
                    };
                  case 'mint':
                    return {
                      header: 'from-emerald-100 via-teal-50 to-emerald-100',
                      border: 'hover:border-emerald-400',
                      price: 'text-emerald-600',
                      pill: 'bg-emerald-100 text-emerald-800',
                      perfectFor: 'bg-emerald-50 border-emerald-200',
                      button: 'hover:bg-emerald-500',
                    };
                  case 'purple':
                    return {
                      header: 'from-violet-100 via-purple-50 to-violet-100',
                      border: 'hover:border-violet-400',
                      price: 'text-violet-600',
                      pill: 'bg-violet-100 text-violet-800',
                      perfectFor: 'bg-violet-50 border-violet-200',
                      button: 'hover:bg-violet-500',
                    };
                  default: // mixed
                    return {
                      header: 'from-amber-100 via-emerald-50 to-amber-100',
                      border: 'hover:border-primary',
                      price: 'text-primary',
                      pill: 'bg-secondary text-foreground',
                      perfectFor: 'bg-secondary/50 border-secondary',
                      button: 'hover:bg-primary',
                    };
                }
              };
              const accent = getAccentClasses();

              return (
                <Card
                  key={service.id}
                  className={`group bg-white rounded-2xl shadow-md hover:shadow-xl border-2 border-transparent transition-all duration-300 overflow-hidden animate-scale-in ${accent.border}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Dog Photo Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={`${service.name} grooming result`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Subtle gradient overlay at bottom for smooth transition */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>

                  <CardContent className="p-6">
                    {/* Title and Price Row */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Starting at</p>
                        <p className={`text-3xl font-bold ${accent.price}`}>
                          ${service.price}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.includedFeatures.map((feature) => (
                        <span
                          key={feature}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${accent.pill}`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Perfect For Box */}
                    <div className={`rounded-lg p-4 border mb-4 ${accent.perfectFor}`}>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Perfect For</p>
                      <p className="text-sm">{service.perfectFor}</p>
                    </div>

                    {/* CTA Button */}
                    <Button
                      asChild
                      className={`w-full bg-foreground text-background py-3 rounded-lg transition-colors group-hover:text-white ${accent.button}`}
                    >
                      <Link href="/book">
                        Schedule Appointment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add-ons callout */}
          <div className="mt-12 text-center">
            <Card className="inline-block bg-white/80 backdrop-blur border-0 shadow-sm">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  <span className="font-semibold text-foreground">Plus add-on services:</span> teeth brushing, nail grinding, blueberry facial, de-shedding & more!
                </p>
                <Button asChild>
                  <Link href="/book">
                    View All Services & Book
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery
        title="Our Happy Pups"
        columns={4}
      />

      {/* Reviews Section */}
      <Reviews />

      {/* Hours & Location */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hours */}
              <div className="bg-primary rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <Clock className="h-10 w-10 text-primary-foreground/80 mb-4" />
                <h3 className="text-xl font-bold text-primary-foreground mb-6">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-primary-foreground/20">
                    <span className="text-primary-foreground/70">Sunday</span>
                    <span className="font-medium text-primary-foreground/60">Closed</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-primary-foreground/20">
                    <span className="text-primary-foreground/70">Monday</span>
                    <span className="font-medium text-primary-foreground/60">Closed</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-primary-foreground/70">Tuesday - Saturday</span>
                    <span className="font-semibold text-primary-foreground">8:00 AM - 4:00 PM</span>
                  </div>
                </div>
                <p className="text-sm text-primary-foreground/60 mt-6 pt-4 border-t border-primary-foreground/20">
                  ✨ Online booking available 24/7
                </p>
              </div>

              {/* Contact */}
              <div className="bg-secondary rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <MapPin className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-6">Location & Contact</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Visit Us</p>
                    <p className="font-medium text-foreground">{BUSINESS.address.street}</p>
                    <p className="text-foreground/80">{BUSINESS.address.floor}</p>
                    <p className="text-foreground/80">{BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}</p>
                  </div>
                  <div className="space-y-3">
                    <a
                      href={`tel:${BUSINESS.phone.replace(/-/g, '')}`}
                      className="flex items-center gap-3 text-foreground hover:text-accent transition-colors group"
                    >
                      <Phone className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{BUSINESS.phone}</span>
                    </a>
                    <a
                      href={`sms:${BUSINESS.textNumber.replace(/-/g, '')}`}
                      className="flex items-center gap-3 text-foreground hover:text-accent transition-colors group"
                    >
                      <MessageSquare className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Text: {BUSINESS.textNumber}</span>
                    </a>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="flex items-center gap-3 text-foreground hover:text-accent transition-colors group"
                    >
                      <Mail className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{BUSINESS.email}</span>
                    </a>
                  </div>
                </div>
              </div>
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
