'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Heart, MapPin, Settings, Plus, BookOpen, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useAuth } from '@/providers/AppProvider';
import { destinations } from '@/data/destinations';
import { bookings } from '@/data/collections';
import { formatPrice } from '@/lib/utils';

const chartData = [
  { name: 'Jan', trips: 4 }, { name: 'Feb', trips: 3 }, { name: 'Mar', trips: 7 },
  { name: 'Apr', trips: 5 }, { name: 'May', trips: 8 }, { name: 'Jun', trips: 6 },
  { name: 'Jul', trips: 2 },
];

const quickLinks = [
  { href: '/dashboard/profile', icon: Settings, label: 'Profile', color: 'bg-primary-50 text-primary-600' },
  { href: '/dashboard/wishlist', icon: Heart, label: 'Wishlist', color: 'bg-red-50 text-red-500' },
  { href: '/dashboard/bookings', icon: BookOpen, label: 'Bookings', color: 'bg-secondary-50 text-secondary-600' },
  { href: '/dashboard/add-destination', icon: Plus, label: 'Add New', color: 'bg-accent-50 text-accent-600' },
  { href: '/dashboard/manage', icon: MapPin, label: 'Manage', color: 'bg-purple-50 text-purple-600' },
];

function DashboardContent() {
  const { user } = useAuth();
  const userBookings = bookings.filter(b => b.userId === user?._id);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-dark-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-dark-400 mt-1">Here is your travel overview</p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={link.href}
                className={`block ${link.color} rounded-3xl p-5 hover:shadow-md transition-all hover:scale-[1.02]`}
              >
                <link.icon className="w-6 h-6 mb-3" />
                <div className="font-semibold text-dark-900 text-sm">{link.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-4">
            {[
              { label: 'Total Bookings', value: userBookings.length, icon: BookOpen },
              { label: 'Wishlist Items', value: user?.wishlist?.length || 0, icon: Heart },
              { label: 'Reviews Written', value: 3, icon: BarChart3 },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-3xl p-5 card-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-dark-900">{s.value}</div>
                  <div className="text-xs text-dark-400">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 card-shadow"
          >
            <h3 className="font-display font-bold text-dark-900 mb-4">Monthly Travel Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="trips" fill="#0F766E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        {userBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-3xl p-6 card-shadow"
          >
            <h3 className="font-display font-bold text-dark-900 mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {userBookings.map(b => (
                <div key={b._id} className="flex items-center gap-4 p-3 bg-dark-50 rounded-2xl">
                  <img src={b.destinationImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-dark-900 text-sm">{b.destinationName}</div>
                    <div className="text-xs text-dark-400">
                      {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-dark-900">{formatPrice(b.totalPrice)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      b.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : b.status === 'pending'
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-red-100 text-red-700'
                    }`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}