'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { BUSINESS } from '@/lib/constants';
import { IMAGES } from '@/lib/images';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={IMAGES.logo}
            alt="Peachy Pooches Logo"
            width={120}
            height={19}
            className="h-8 w-auto"
          />
          <span className="text-sm text-muted-foreground">{BUSINESS.subtitle}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/book"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Book Now
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href={`tel:${BUSINESS.phone.replace(/-/g, '')}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{BUSINESS.phone}</span>
            </a>
            <a href={`sms:${BUSINESS.textNumber.replace(/-/g, '')}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Text Us</span>
            </a>
          </div>
          <Button asChild>
            <Link href="/book">Book Appointment</Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/client"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                My Appointments
              </Link>
              <div className="pt-4 border-t">
                <div className="space-y-3 mb-4">
                  <a href={`tel:${BUSINESS.phone.replace(/-/g, '')}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="h-4 w-4" />
                    <span>Call: {BUSINESS.phone}</span>
                  </a>
                  <a href={`sms:${BUSINESS.textNumber.replace(/-/g, '')}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>Text: {BUSINESS.textNumber}</span>
                  </a>
                </div>
                <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                  <Link href="/book">Book Appointment</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
