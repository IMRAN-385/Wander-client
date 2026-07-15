'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

const CATEGORIES = ['Beach', 'Mountains', 'City', 'Nature', 'Adventure', 'Coastal'];
const CONTINENTS = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];

type FormState = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  location: string;
  country: string;
  continent: string;
  price: string;
  bestSeason: string;
  activities: string;
  imageUrl: string;
};

export default function AddDestinationPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Beach',
    location: '',
    country: '',
    continent: 'Asia',
    price: '0',
    bestSeason: '',
    activities: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');

    try {
      const authToken =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const payload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        category: form.category,
        location: form.location.trim(),
        country: form.country.trim(),
        continent: form.continent,
        price: Number(form.price) || 0,
        bestSeason: form.bestSeason.trim(),
        activities: form.activities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      };

      const response = await fetch('/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        setServerError(data?.error || 'Failed to add destination.');
        return;
      }

      router.push('/dashboard/manage');
    } catch (err: any) {
      setServerError(err?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-dark-400 transition-colors hover:text-dark-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-dark-900">Add New Destination</h1>
          <p className="mt-1 text-dark-400">
            Share a destination with the Wanderlust community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 rounded-3xl bg-white p-6 card-shadow sm:p-8"
        >
          {serverError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="Paradise Beach Resort"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Short Description *
                </label>
                <input
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="A brief, enticing description"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Full Description *
                </label>
                <textarea
                  name="fullDescription"
                  rows={5}
                  value={form.fullDescription}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="Detailed description of the destination..."
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Continent
                </label>
                <select
                  name="continent"
                  value={form.continent}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                >
                  {CONTINENTS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Location *
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Paris"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Country *
                </label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. France"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Price ($/day)
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Best Season
                </label>
                <input
                  name="bestSeason"
                  value={form.bestSeason}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. June - August"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Activities (comma-separated)
                </label>
                <input
                  name="activities"
                  value={form.activities}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Hiking, Surfing, Food Tours"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-dark-700">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="accent" size="lg" className="flex-1" disabled={isSubmitting}>
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Adding...' : 'Submit Destination'}
              </Button>

              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-dark-200 px-8 font-medium text-dark-700 transition-colors hover:bg-dark-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}