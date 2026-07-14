'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6">🌍</motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-6xl font-display font-bold text-dark-900 mb-2">404</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-dark-900 mb-2">Lost in Wanderlust?</h2>
          <p className="text-dark-400 mb-8 leading-relaxed">
            This destination doesn&apos;t exist on our map. But there are hundreds of incredible places waiting to be discovered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/"
              className="gradient-primary text-white font-semibold px-8 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 shadow-glow hover:opacity-90 transition-opacity">
              <Compass className="w-5 h-5" /> Back to Home
            </Link>
            <Link href="/explore"
              className="bg-white border border-dark-200 text-dark-700 font-semibold px-8 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 hover:bg-dark-50 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Explore Destinations
            </Link>
          </div>
        </motion.div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-12">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i}
              className="w-2 h-2 rounded-full bg-primary-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}