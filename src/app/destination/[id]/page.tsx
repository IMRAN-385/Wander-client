'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  Navigation,
  ChevronLeft,
  Heart,
  Share2,
} from 'lucide-react';
import DestinationCard from '@/components/destinations/DestinationCard';
import { useAuth } from '@/providers/AppProvider';

function formatPrice(value: number | string | undefined) {
  const num = Number(value || 0);
  return `$${num.toLocaleString()}`;
}

function formatDate(value: string | undefined) {
  if (!value) return 'TBD';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'TBD' : date.toLocaleDateString();
}

function getTimeAgo(value: string | undefined) {
  if (!value) return 'just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'just now';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function DestinationDetailPage() {
  const params = useParams<{ id?: string; slug?: string }>();
  const routeParam = params?.id ?? params?.slug;
  const { user, toggleWishlist } = useAuth() as any;

  const [destination, setDestination] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!routeParam) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/destinations/${routeParam}`, { cache: 'no-store' });
        const text = await res.text();
        let data: any = null;

        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Destination payload parse failed:', text.slice(0, 300));
            throw parseError;
          }
        }

        if (!res.ok) {
          throw new Error(data?.message || 'Unable to load destination');
        }

        const item = data?.data?.destination ?? data?.destination ?? null;
        const reviewList = Array.isArray(data?.data?.reviews) ? data.data.reviews : Array.isArray(data?.reviews) ? data.reviews : [];
        const relatedList = Array.isArray(data?.data?.related) ? data.data.related : Array.isArray(data?.related) ? data.related : [];

        setDestination(item);
        setReviews(reviewList);
        setRelated(relatedList);
      } catch (error) {
        console.error('Destination load failed:', error);
        setDestination(null);
        setReviews([]);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [routeParam]);

  const destinationImages = useMemo(() => {
    if (Array.isArray(destination?.images) && destination.images.length > 0) {
      return destination.images;
    }
    return ['/images/placeholder.jpg'];
  }, [destination]);

  const wishlistIds = Array.isArray(user?.wishlist) ? user.wishlist : [];
  const isWishlisted = Boolean(destination?._id && wishlistIds.includes(destination._id));

  const highlights = Array.isArray(destination?.highlights) ? destination.highlights : [];
  const activities = Array.isArray(destination?.activities) ? destination.activities : [];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse space-y-6">
        <div className="h-96 rounded-3xl bg-dark-100" />
        <div className="h-8 w-2/3 rounded bg-dark-100" />
        <div className="h-4 w-1/2 rounded bg-dark-100" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center">
        <div className="mb-4 text-6xl">😕</div>
        <h1 className="mb-2 text-3xl font-bold text-dark-900">Destination Not Found</h1>
        <Link href="/explore" className="font-semibold text-primary-600">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden sm:h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={destinationImages[activeImage] || destinationImages[0]}
            alt={destination.title || 'Destination image'}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />

        {destinationImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {destinationImages.map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === activeImage ? 'w-8 bg-white' : 'w-2.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute left-4 top-4">
          <Link
            href="/explore"
            className="glass inline-flex rounded-full p-2.5 transition-colors hover:bg-white/90"
          >
            <ChevronLeft className="h-5 w-5 text-dark-700" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white p-6 card-shadow sm:p-8"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                  {destination.category || 'Travel'}
                </span>
                <span className="rounded-full bg-dark-50 px-3 py-1.5 text-xs text-dark-600">
                  {destination.continent || 'Worldwide'}
                </span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="mb-2 text-2xl font-bold text-dark-900 sm:text-3xl lg:text-4xl">
                    {destination.title || 'Untitled Destination'}
                  </h1>
                  <div className="flex items-center gap-1.5 text-sm text-dark-400">
                    <MapPin className="h-4 w-4" />
                    {destination.location || 'Unknown'}, {destination.country || 'Unknown'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWishlist?.(destination._id)}
                    className={`rounded-full border p-3 transition-all ${
                      isWishlisted
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : 'border-dark-200 bg-white text-dark-400 hover:border-dark-300'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="rounded-full border border-dark-200 bg-white p-3 text-dark-400 transition-all hover:border-dark-300">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(destination.rating || 0))
                        ? 'fill-accent-400 text-accent-400'
                        : 'text-dark-200'
                    }`}
                  />
                ))}
                <span className="text-lg font-bold text-dark-900">
                  {Number(destination.rating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-dark-400">
                  ({Number(destination.reviewCount || reviews.length).toString()} reviews)
                </span>
              </div>

              <p className="mt-6 whitespace-pre-line leading-relaxed text-dark-600">
                {destination.fullDescription || destination.shortDescription || 'No description available.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-white p-6 card-shadow sm:p-8"
            >
              <h2 className="mb-6 text-xl font-bold text-dark-900">Key Information</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-dark-50 p-4">
                  <Clock className="mb-2 h-5 w-5 text-primary-600" />
                  <div className="mb-0.5 text-xs text-dark-400">Best Season</div>
                  <div className="text-sm font-semibold text-dark-900">
                    {destination.bestSeason || 'Any season'}
                  </div>
                </div>

                <div className="rounded-2xl bg-dark-50 p-4">
                  <Calendar className="mb-2 h-5 w-5 text-primary-600" />
                  <div className="mb-0.5 text-xs text-dark-400">Price</div>
                  <div className="text-sm font-semibold text-dark-900">
                    {formatPrice(destination.price)}{' '}
                    <span className="text-xs font-normal text-dark-400">/day</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-dark-50 p-4">
                  <Navigation className="mb-2 h-5 w-5 text-primary-600" />
                  <div className="mb-0.5 text-xs text-dark-400">Continent</div>
                  <div className="text-sm font-semibold text-dark-900">
                    {destination.continent || 'Worldwide'}
                  </div>
                </div>
              </div>

              {highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-semibold text-dark-900">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((h: string, i: number) => (
                      <span key={i} className="rounded-full bg-primary-50 px-3 py-1.5 text-xs text-primary-700">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activities.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-semibold text-dark-900">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {activities.map((a: string, i: number) => (
                      <span key={i} className="rounded-full border border-dark-100 bg-dark-50 px-3 py-1.5 text-xs text-dark-600">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-white p-6 card-shadow sm:p-8"
            >
              <h2 className="mb-6 text-xl font-bold text-dark-900">
                Reviews ({reviews.length})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r._id || r.id} className="rounded-2xl bg-dark-50 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                            {(r.userName || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-dark-900">
                              {r.userName || 'Traveler'}
                            </div>
                            <div className="text-xs text-dark-400">{getTimeAgo(r.createdAt)}</div>
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Number(r.rating || 0)
                                  ? 'fill-accent-400 text-accent-400'
                                  : 'text-dark-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-dark-600">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-400">No reviews yet.</p>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 rounded-3xl bg-white p-6 card-shadow"
            >
              <div className="mb-1 text-3xl font-bold text-dark-900">
                {formatPrice(destination.price)}
              </div>
              <div className="mb-6 text-sm text-dark-400">per day per person</div>

              <button className="mb-3 w-full rounded-2xl bg-gradient-to-r from-primary-600 to-primary-400 py-3.5 font-semibold text-white shadow-glow transition-opacity hover:opacity-90">
                Reserve Now
              </button>

              <p className="text-center text-xs text-dark-400">
                Listed by {destination.authorName || 'Wanderlust'} on {formatDate(destination.createdAt)}
              </p>
            </motion.div>

            <div className="grid grid-cols-4 gap-2">
              {destinationImages.slice(0, 4).map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border-2 transition-all ${
                    i === activeImage ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-dark-100 pt-12">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-dark-900 sm:text-3xl">
                More {destination.category || 'Travel'} Destinations
              </h2>
              <Link
                href={`/explore?category=${destination.category || ''}`}
                className="hidden text-sm font-semibold text-primary-600 sm:inline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((d: any) => (
                <DestinationCard
                  key={d._id || d.id}
                  destination={d}
                  onWishlist={toggleWishlist}
                  isWishlisted={wishlistIds.includes(d._id || d.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}