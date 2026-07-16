import type { Metadata } from 'next';
import './globals.css';
import AppProvider from '@/providers/AppProvider';
import  Navbar from '@/components/layout/Navbar';
import  Footer  from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Wanderlust — Discover Extraordinary Destinations',
  description: 'Explore breathtaking destinations around the world. Find your next adventure with Wanderlust — your premium travel discovery platform.',
  keywords: 'travel, destinations, luxury travel, adventure, wanderlust, vacation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="light">
      <body>
        <AppProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}