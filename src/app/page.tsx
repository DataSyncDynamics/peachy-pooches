import Link from 'next/link';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dog,
  Clock,
  Calendar,
  Sparkles,
  Heart,
  Star,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

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

const services = [
  { name: 'Bath & Brush', price: 45, duration: '1 hour' },
  { name: 'Full Groom', price: '65-125', duration: '1.5-3 hours' },
  { name: 'Puppy First Groom', price: 40, duration: '45 min' },
  { name: 'De-shedding Treatment', price: 75, duration: '1.5 hours' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/20" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Now Booking Online
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Pampered Pups,{' '}
              <span className="text-primary">Happy Owners</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional dog grooming in a stress-free environment. Book your
              appointment online in under 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <Link href="/book">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8">
                <Link href="/book">View Services & Pricing</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Instant Confirmation
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Easy Rescheduling
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-background">
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
              From quick baths to full spa treatments, we have everything your
              pup needs to look and feel their best
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.map((service) => (
              <Card key={service.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">
                    ${service.price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/book">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hours */}
              <Card>
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
                      <span className="text-muted-foreground">Tuesday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span>9:00 AM - 3:00 PM</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Online booking available 24/7
                  </p>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Location & Contact</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Address</p>
                      <p>123 Grooming Lane</p>
                      <p>Dogtown, CA 90210</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Phone</p>
                      <a
                        href="tel:5551234766"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        (555) 123-GROOM
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
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center">
              <Dog className="h-12 w-12 mx-auto mb-4 opacity-80" />
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dog className="h-6 w-6 text-primary" />
              <span className="font-semibold">Peachy Pooches</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Peachy Pooches Dog Grooming. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
