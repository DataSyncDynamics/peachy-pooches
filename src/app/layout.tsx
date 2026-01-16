import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peachy Pooches | Professional Dog Grooming",
  description: "Book your dog grooming appointment online. Professional grooming services in a stress-free environment. Bath, groom, and spa treatments for all breeds.",
  keywords: ["dog grooming", "pet grooming", "dog spa", "pet care", "grooming appointment"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
