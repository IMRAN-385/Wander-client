'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Globe, Shield, Heart, Zap, Users, Target } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Trust & Authenticity', desc: 'Every destination is verified. Every review is from real travelers. No AI-generated fluff.' },
  { icon: Globe, title: 'Global Perspective', desc: 'We celebrate destinations across every continent, promoting cultural understanding through travel.' },
  { icon: Heart, title: 'Community First', desc: 'Our platform is built by travelers, for travelers. The community drives our curation.' },
  { icon: Zap, title: 'Innovation', desc: 'Smart search, intuitive filters, and beautiful design make discovery effortless.' },
  { icon: Users, title: 'Inclusivity', desc: 'Travel information for all abilities, budgets, and styles. Everyone deserves inspiration.' },
  { icon: Target, title: 'Sustainability', desc: 'We promote responsible tourism that respects environments and supports local communities.' },
];

const ScrollReveal = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>{children}</motion.div>;
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 bg-gradient-to-br from-primary-200 via-primary-800 to-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-300 text-sm font-semibold uppercase tracking-wider">Our Story</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-3 mb-4">About Wanderlust</h1>
            <p className="text-primary-200/80 text-lg max-w-2xl mx-auto leading-relaxed">
              We believe travel transforms lives. Our mission is to help every traveler discover extraordinary destinations and create unforgettable memories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">How It Started</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 mt-2 mb-6">Born from a passion for exploration</h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                <p>Wanderlust was born in 2024 from a simple observation: travel discovery should be inspiring, not overwhelming. Our founder, Sarah Johnson, had visited over 40 countries and realized that the most memorable travel experiences came from fellow travelers' recommendations rather than generic guidebooks.</p>
                <p>What started as a small passion project has grown into a vibrant community of explorers sharing their favorite destinations, hidden gems, and honest reviews. Today, Wanderlust features over 200 destinations across 60+ countries, curated and verified by real travelers.</p>
                <p>We are headquartered in Chattogram, Bangladesh, with a distributed team of travel enthusiasts working from around the globe. Our commitment to authentic, high-quality content remains at the heart of everything we do.</p>
              </div>
            </ScrollReveal>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600" alt="Our story" className="rounded-4xl shadow-elevated w-full h-96 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 mt-2">What Drives Us</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-6 card-shadow hover-glow text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-dark-900 mb-2">{v.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-900 mb-4">Join Our Community</h2>
          <p className="text-dark-400 max-w-md mx-auto mb-8">Whether you are a seasoned globetrotter or planning your first trip, Wanderlust is your home for travel inspiration.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/explore" className="gradient-primary text-white font-semibold px-8 py-3.5 rounded-full">Start Exploring</Link>
            <Link href="/contact" className="bg-white border border-dark-200 text-dark-700 font-semibold px-8 py-3.5 rounded-full hover:bg-dark-50">Contact Us</Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
