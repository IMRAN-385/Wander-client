'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Users, MapPin } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useAuth } from '@/providers/AppProvider';
import { bookings } from '@/data/collections';
import { formatPrice, formatDate } from '@/lib/utils';

function BookingsContent() {
  const { user } = useAuth();
  const userBookings = bookings.filter(b => b.userId === user?._id);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-dark-400 hover:text-dark-700 text-sm">
            ← Dashboard
          </Link>
          <span className="text-dark-300">/</span>
          <span className="text-dark-900 font-medium">My Bookings</span>
        </div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-dark-900">My Bookings</h1>
          <p className="text-dark-400 mt-1">{userBookings.length} bookings</p>
        </motion.div>

        {userBookings.length > 0 ? (
          <div className="mt-8 space-y-4">
            {userBookings.map((b, i) => (
              <motion.div key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-5 card-shadow flex flex-col sm:flex-row gap-4 items-start"
              >
                <img src={b.destinationImage} alt={b.destinationName}
                  className="w-full sm:w-32 h-32 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-dark-900">{b.destinationName}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-dark-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDate(b.checkIn)} - {formatDate(b.checkOut)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {b.guests} guests
                    </span>
                  </div>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                  <span className="text-xl font-display font-bold text-dark-900">
                    {formatPrice(b.totalPrice)}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    b.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : b.status === 'pending'
                      ? 'bg-accent-100 text-accent-700'
                      : 'bg-red-100 text-red-700'
                  }`}>{b.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <BookOpen className="w-16 h-16 text-dark-200 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">No bookings yet</h3>
            <p className="text-dark-400 mb-6">Explore destinations and plan your next adventure.</p>
            <Link href="/explore"
              className="gradient-primary text-white font-semibold px-8 py-3 rounded-full inline-block">
              Explore Destinations
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return <ProtectedRoute><BookingsContent /></ProtectedRoute>;
}