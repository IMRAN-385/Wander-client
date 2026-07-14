'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { destinationSchema, type DestinationFormData } from '@/lib/validators';
import { Input, Textarea } from '@/data/components/ui/Input';
import { Button } from '@/data/components/ui/Button';
import api from '@/lib/api-client';

const CATEGORIES = ['Beach', 'Mountains', 'City', 'Nature', 'Adventure', 'Coastal'];
const CONTINENTS = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];

function AddForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      title: '', shortDescription: '', fullDescription: '',
      category: 'Beach', location: '', country: '', continent: 'Asia',
      price: 0, bestSeason: '', activities: '', imageUrl: '',
    },
  });

  const onSubmit = async (data: DestinationFormData) => {
    setServerError('');
    try {
      const activities = data.activities
        ? data.activities.split(',').map(a => a.trim()).filter(a => a)
        : [];
      const res = await api.post('/api/destinations', {
        ...data,
        price: Number(data.price) || 0,
        activities,
        images: data.imageUrl ? [data.imageUrl] : undefined,
      });
      if (res.data.success) {
        toast.success('Destination added successfully!');
        router.push('/dashboard/manage');
      } else {
        setServerError(res.data.error || 'Failed to add');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/dashboard"
            className="inline-flex items-center gap-1.5 text-dark-400 hover:text-dark-700 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold text-dark-900">Add New Destination</h1>
          <p className="text-dark-400 mt-1">Share a destination with the Wanderlust community</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 bg-white rounded-3xl p-6 sm:p-8 card-shadow">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Input id="title" label="Title *" placeholder="Paradise Beach Resort"
                  {...register('title')} error={errors.title?.message} />
              </div>
              <div className="sm:col-span-2">
                <Input id="shortDescription" label="Short Description *"
                  placeholder="A brief, enticing description"
                  {...register('shortDescription')} error={errors.shortDescription?.message} />
              </div>
              <div className="sm:col-span-2">
                <Textarea id="fullDescription" label="Full Description *" rows={5}
                  placeholder="Detailed description of the destination..."
                  {...register('fullDescription')} error={errors.fullDescription?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Category *</label>
                <select {...register('category')}
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Continent</label>
                <select {...register('continent')}
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  {CONTINENTS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <Input id="location" label="Location *" placeholder="e.g. Paris"
                {...register('location')} error={errors.location?.message} />
              <Input id="country" label="Country *" placeholder="e.g. France"
                {...register('country')} error={errors.country?.message} />
              <Input id="price" label="Price ($/day)" type="number" placeholder="0"
                {...register('price')} />
              <Input id="bestSeason" label="Best Season" placeholder="e.g. June - August"
                {...register('bestSeason')} />

              <div className="sm:col-span-2">
                <Input id="activities" label="Activities (comma-separated)"
                  placeholder="e.g. Hiking, Surfing, Food Tours"
                  {...register('activities')} />
              </div>
              <div className="sm:col-span-2">
                <Input id="imageUrl" label="Image URL" type="url"
                  placeholder="https://images.unsplash.com/..."
                  {...register('imageUrl')} error={errors.imageUrl?.message} />
                <p className="text-xs text-dark-400 mt-1">Optional. A default image will be used if not provided.</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="accent" size="lg" className="flex-1" disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Adding...' : 'Submit Destination'}
              </Button>
              <Link href="/dashboard"
                className="inline-flex items-center justify-center h-12 px-8 border border-dark-200 rounded-2xl text-dark-700 font-medium hover:bg-dark-50 transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function AddDestinationPage() {
  return <ProtectedRoute><AddForm /></ProtectedRoute>;
}