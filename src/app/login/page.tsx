'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, Calendar, Navigation, ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { IDestination, IReview } from '@/types';
import DestinationCard from '@/components/destinations/DestinationCard';
import { formatPrice, formatDate, getTimeAgo } from '@/lib/utils';
import { useAuth } from '@/providers/AppProvider';

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, toggleWishlist } = useAuth();
  const [destination, setDestination] = useState<IDestination | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [related, setRelated] = useState<IDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/destinations/${id}`);
        const data = await res.json();
        if (data.success) {
          setDestination(data.data.destination);
          setReviews(data.data.reviews || []);
          setRelated(data.data.related || []);
        }
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-96 bg-dark-100 rounded-3xl" />
        <div className="h-8 w-2/3 bg-dark-100 rounded" />
        <div className="h-4 w-1/2 bg-dark-100 rounded" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">Destination Not Found</h1>
        <Link href="/explore" className="text-primary-600 font-semibold">← Back to Explore</Link>
      </div>
    );
  }

  const isWishlisted = user?.wishlist?.includes(destination._id);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Image Gallery */}
      <div className="relative h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={destination.images[activeImage]}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />

        {destination.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {destination.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeImage ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-4 left-4">
          <Link href="/explore" className="glass rounded-full p-2.5 inline-flex hover:bg-white/90 transition-colors">
            <ChevronLeft className="w-5 h-5 text-dark-700" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 card-shadow">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {destination.category}
                </span>
                <span className="bg-dark-50 text-dark-600 text-xs px-3 py-1.5 rounded-full">
                  {destination.continent}
                </span>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-dark-900 mb-2">
                    {destination.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-dark-400 text-sm">
                    <MapPin className="w-4 h-4" /> {destination.location}, {destination.country}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWishlist(destination._id)}
                    className={`p-3 rounded-full border transition-all ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-dark-200 text-dark-400 hover:border-dark-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white border border-dark-200 text-dark-400 hover:border-dark-300 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${
                    i < Math.round(destination.rating) ? 'fill-accent-400 text-accent-400' : 'text-dark-200'
                  }`} />
                ))}
                <span className="text-lg font-bold text-dark-900">{destination.rating.toFixed(1)}</span>
                <span className="text-sm text-dark-400">({destination.reviewCount} reviews)</span>
              </div>

              <p className="text-dark-600 leading-relaxed mt-6 whitespace-pre-line">
                {destination.fullDescription}
              </p>
            </motion.div>

            {/* Key Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 card-shadow"
            >
              <h2 className="text-xl font-display font-bold text-dark-900 mb-6">Key Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-dark-50 rounded-2xl p-4">
                  <Clock className="w-5 h-5 text-primary-600 mb-2" />
                  <div className="text-xs text-dark-400 mb-0.5">Best Season</div>
                  <div className="text-sm font-semibold text-dark-900">{destination.bestSeason}</div>
                </div>
                <div className="bg-dark-50 rounded-2xl p-4">
                  <Calendar className="w-5 h-5 text-primary-600 mb-2" />
                  <div className="text-xs text-dark-400 mb-0.5">Price</div>
                  <div className="text-sm font-semibold text-dark-900">
                    {formatPrice(destination.price)} <span className="text-xs text-dark-400 font-normal">/day</span>
                  </div>
                </div>
                <div className="bg-dark-50 rounded-2xl p-4">
                  <Navigation className="w-5 h-5 text-primary-600 mb-2" />
                  <div className="text-xs text-dark-400 mb-0.5">Continent</div>
                  <div className="text-sm font-semibold text-dark-900">{destination.continent}</div>
                </div>
              </div>

              {destination.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-dark-900 mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((h, i) => (
                      <span key={i} className="bg-primary-50 text-primary-700 text-xs px-3 py-1.5 rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-semibold text-dark-900 mb-3">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.activities.map((a, i) => (
                    <span key={i} className="bg-dark-50 text-dark-600 text-xs px-3 py-1.5 rounded-full border border-dark-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 card-shadow"
            >
              <h2 className="text-xl font-display font-bold text-dark-900 mb-6">
                Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-dark-50 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                            {r.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-dark-900 text-sm">{r.userName}</div>
                            <div className="text-xs text-dark-400">{getTimeAgo(r.createdAt)}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${
                              i < r.rating ? 'fill-accent-400 text-accent-400' : 'text-dark-200'
                            }`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-dark-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-400 text-sm">No reviews yet.</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 card-shadow sticky top-24"
            >
              <div className="text-3xl font-display font-bold text-dark-900 mb-1">
                {formatPrice(destination.price)}
              </div>
              <div className="text-sm text-dark-400 mb-6">per day per person</div>
              <button className="w-full gradient-primary text-white font-semibold py-3.5 rounded-2xl hover:opacity-90 transition-opacity shadow-glow mb-3">
                Reserve Now
              </button>
              <p className="text-xs text-dark-400 text-center">
                Listed by {destination.authorName} on {formatDate(destination.createdAt)}
              </p>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {destination.images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-dark-100">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark-900">
                More {destination.category} Destinations
              </h2>
              <Link
                href={`/explore?category=${destination.category}`}
                className="text-primary-600 font-semibold text-sm hidden sm:inline"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(d => (
                <DestinationCard
                  key={d._id}
                  destination={d}
                  onWishlist={toggleWishlist}
                  isWishlisted={user?.wishlist?.includes(d._id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}