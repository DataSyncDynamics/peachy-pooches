'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { BUSINESS } from '@/lib/constants';
import { IMAGES } from '@/lib/images';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isTransparent = variant === 'transparent';

  return (
    <header
      className={
        isTransparent
          ? 'absolute top-0 left-0 right-0 z-50 w-full'
          : 'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      }
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={IMAGES.logo}
            alt="Peachy Pooches Logo"
            width={120}
            height={19}
            className={`h-8 w-auto ${isTransparent ? 'brightness-0 invert' : ''}`}
          />
          <span className={`text-sm ${isTransparent ? 'text-white/70' : 'text-muted-foreground'}`}>
            {BUSINESS.subtitle}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#services"
            className={`text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Services
          </Link>
          <Link
            href="/#how-it-works"
            className={`text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            How It Works
          </Link>
          <Link
            href="/#gallery"
            className={`text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Gallery
          </Link>
          <Link
            href="/#reviews"
            className={`text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Reviews
          </Link>
          <Link
            href="/#contact"
            className={`text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Contact
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            About
          </Link>
          <Button
            variant="outline"
            size="sm"
            asChild
            className={isTransparent ? 'bg-white/10 border-white/50 text-white hover:bg-white/20 hover:border-white/70' : ''}
          >
            <Link href="/admin">Admin</Link>
          </Button>
          <div className={`flex items-center gap-4 ${isTransparent ? 'text-white/80' : 'text-muted-foreground'}`}>
            <a
              href={`tel:${BUSINESS.phone.replace(/-/g, '')}`}
              className={`flex items-center gap-1.5 transition-colors ${isTransparent ? 'hover:text-white' : 'hover:text-foreground'}`}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm">{BUSINESS.phone}</span>
            </a>
            <a
              href={`sms:${BUSINESS.textNumber.replace(/-/g, '')}`}
              className={`flex items-center gap-1.5 transition-colors ${isTransparent ? 'hover:text-white' : 'hover:text-foreground'}`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Text Us</span>
            </a>
          </div>
          <Button asChild className={isTransparent ? 'bg-[#f5bf3b] hover:bg-[#f5bf3b]/90 text-[#212934]' : ''}>
            <Link href="/book">Book Appointment</Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className={isTransparent ? 'text-white hover:bg-white/10' : ''}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link href="/#services" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="/#gallery" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/#reviews" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                Reviews
              </Link>
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                Contact
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
