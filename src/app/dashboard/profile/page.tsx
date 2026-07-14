'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useAuth } from '@/providers/AppProvider';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

function ProfileContent() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });

  const handleSave = (e: React.FormEvent) => { e.preventDefault(); toast.success('Profile updated'); };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-dark-400 hover:text-dark-700 text-sm">← Dashboard</Link>
          <span className="text-dark-300">/</span>
          <span className="text-dark-900 font-medium">Profile</span>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-dark-900">My Profile</h1>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 card-shadow text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {user?.name?.charAt(0)}
            </div>
            <h2 className="font-display font-bold text-dark-900 text-lg">{user?.name}</h2>
            <span className="inline-block mt-1 bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium">{user?.role}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 card-shadow">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-700 mb-1.5">
                  <User className="w-4 h-4 text-dark-400" /> Full Name
                </label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-700 mb-1.5">
                  <Mail className="w-4 h-4 text-dark-400" /> Email
                </label>
                <input value={form.email} disabled
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-2xl text-sm text-dark-400" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-700 mb-1.5">
                  <Shield className="w-4 h-4 text-dark-400" /> Role
                </label>
                <input value={user?.role || ''} disabled
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-2xl text-sm text-dark-400 capitalize" />
              </div>
              <button type="submit" className="w-full gradient-primary text-white font-semibold py-3.5 rounded-2xl hover:opacity-90 transition-opacity shadow-glow">
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}