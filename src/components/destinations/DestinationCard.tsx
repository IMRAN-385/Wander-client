'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart } from 'lucide-react';
import { IDestination } from '@/types';
import { formatPrice } from '@/lib/utils';

interface Props {
  destination: IDestination;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

export default function DestinationCard({ destination, onWishlist, isWishlisted }: Props) {
  const imageUrl = destination?.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
  const title = destination?.title || 'Untitled Destination';
  const location = destination?.location || 'Unknown location';
  const country = destination?.country || 'Unknown country';
  const price = Number(destination?.price || 0);
  const rating = Number(destination?.rating || 0);
  const reviewCount = Number(destination?.reviewCount || 0);
  const description = destination?.shortDescription || destination?.fullDescription || 'Discover a memorable escape filled with unique experiences and local charm.';
  const category = destination?.category || 'Travel';
  const isTrending = Boolean(destination?.trending);
  const detailHref = destination?.slug ? `/destination/${destination.slug}` : '/explore';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden card-shadow hover:shadow-elevated relative"
    >
      <Link href={detailHref} className="flex flex-1 flex-col">
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="glass text-dark-800 text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {category}
            </span>
            {isTrending && (
              <span className="bg-accent-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Trending
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/90 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{location}, {country}</span>
            </div>
            <span className="glass-dark text-white text-xs font-bold px-3 py-1 rounded-full">
              {formatPrice(price)}/day
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-1 flex-col">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-accent-400 text-accent-400' : 'text-dark-200'}`}
              />
            ))}
            <span className="text-xs text-dark-400 ml-1 font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-dark-300">({reviewCount})</span>
          </div>

          <h3 className="font-display font-bold text-dark-900 line-clamp-1 mb-1.5 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-dark-400 line-clamp-2 leading-relaxed flex-1">
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-dark-100 pt-3">
            <span className="text-sm font-semibold text-dark-900">{formatPrice(price)}</span>
            <span className="text-xs font-semibold text-primary-600">View Details →</span>
          </div>
        </div>
      </Link>

      {onWishlist && (
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(destination._id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-dark-600'}`} />
        </button>
      )}
    </motion.div>
  );
}