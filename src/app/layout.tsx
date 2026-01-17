import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peachy Pooches | Dog Spa & Grooming in McLean, VA",
  description: "Professional dog grooming in McLean, VA. Full haircuts, spa baths, Thera-Clean microbubble treatments. Book online 24/7. Pampering Your Pup, One Groom at a Time!",
  keywords: [
    "dog grooming McLean VA",
    "pet grooming McLean",
    "dog spa Northern Virginia",
    "Peachy Pooches",
    "dog haircut McLean",
    "pet grooming near me",
    "Thera-Clean dog spa",
    "dog grooming 22101",
  ],
  authors: [{ name: "Peachy Pooches" }],
  creator: "Peachy Pooches",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://peachy-pooches.vercel.app",
    siteName: "Peachy Pooches Dog Spa & Grooming",
    title: "Peachy Pooches | Dog Spa & Grooming in McLean, VA",
    description: "Professional dog grooming in McLean, VA. Full haircuts, spa baths, Thera-Clean microbubble treatments. Book online 24/7.",
    images: [
      {
        url: "https://peachypooches.net/wp-content/uploads/2023/10/Peachy-Pooches-Logo-New.png",
        width: 400,
        height: 400,
        alt: "Peachy Pooches Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peachy Pooches | Dog Spa & Grooming in McLean, VA",
    description: "Professional dog grooming in McLean, VA. Book online 24/7!",
    images: ["https://peachypooches.net/wp-content/uploads/2023/10/Peachy-Pooches-Logo-New.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "https://peachypooches.net/wp-content/uploads/2023/10/Peachy-Pooches-Logo-New.png",
    apple: "https://peachypooches.net/wp-content/uploads/2023/10/Peachy-Pooches-Logo-New.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="geo.region" content="US-VA" />
        <meta name="geo.placename" content="McLean" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
