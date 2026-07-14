'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ExternalLink, Plus, AlertTriangle } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { IDestination } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

function ManageContent() {
  const [destinations, setDestinations] = useState<IDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/destinations?limit=100')
      .then(r => r.json())
      .then(d => { if (d.success) setDestinations(d.data.items); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('wanderlust_token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setDestinations(p => p.filter(d => d._id !== id));
        toast.success('Destination deleted');
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch { toast.error('Error deleting'); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-dark-400 hover:text-dark-700 text-sm">← Dashboard</Link>
          <span className="text-dark-300">/</span>
          <span className="text-dark-900 font-medium">Manage</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-dark-900">Manage Destinations</h1>
            <p className="text-dark-400 mt-1">{destinations.length} total destinations</p>
          </motion.div>
          <Link href="/dashboard/add-destination"
            className="gradient-primary text-white font-semibold px-5 py-3 rounded-2xl inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add New
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : destinations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-3xl card-shadow">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2">No destinations yet</h3>
            <Link href="/dashboard/add-destination" className="text-primary-600 font-semibold">Add your first destination →</Link>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-50 border-b border-dark-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Destination</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase hidden sm:table-cell">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase hidden md:table-cell">Price</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Rating</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {destinations.map(d => (
                    <tr key={d._id} className="hover:bg-dark-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={d.images[0]} className="w-10 h-10 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <div className="font-semibold text-dark-900 text-sm truncate max-w-[180px]">{d.title}</div>
                            <div className="text-xs text-dark-400">{d.location}, {d.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell"><span className="text-xs bg-dark-50 px-2 py-1 rounded-full">{d.category}</span></td>
                      <td className="px-6 py-4 hidden md:table-cell"><span className="text-sm font-semibold">{formatPrice(d.price)}</span></td>
                      <td className="px-6 py-4 hidden lg:table-cell"><span className="text-sm">⭐ {d.rating.toFixed(1)}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/destination/${d.slug}`} className="p-2 rounded-xl hover:bg-dark-50 text-dark-400 hover:text-primary-600 transition-colors"><ExternalLink className="w-4 h-4" /></Link>
                          <button onClick={() => setDeleteId(d._id)} className="p-2 rounded-xl hover:bg-red-50 text-dark-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-dark-900/50 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-elevated" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-dark-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-dark-200 rounded-2xl text-sm font-medium hover:bg-dark-50">Cancel</button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-semibold hover:bg-red-600">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ManagePage() {
  return <ProtectedRoute><ManageContent /></ProtectedRoute>;
}