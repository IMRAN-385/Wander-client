import { IDestination } from '@/types';

export const destinations: IDestination[] = [
  {
    _id: 'd1', title: 'Bali Tropical Paradise', slug: 'bali-tropical-paradise',
    shortDescription: 'Discover the enchanting island of Bali with its pristine beaches, sacred temples, and vibrant cultural heritage.',
    fullDescription: 'Bali is a living canvas of natural beauty and spiritual depth...',
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'],
    category: 'Beach', location: 'Bali', country: 'Indonesia', continent: 'Asia',
    price: 129, currency: 'USD', rating: 4.8, reviewCount: 342,
    bestSeason: 'April to October',
    activities: ['Surfing', 'Temple Tours', 'Snorkeling', 'Yoga Retreats', 'Rice Terrace Trekking'],
    highlights: ['Sacred temples at sunset', 'World-class surf breaks', 'Traditional Balinese cuisine', 'Luxury jungle resorts'],
    amenities: ['Beach Access', 'Spa', 'Infinity Pool', 'Restaurant', 'Yoga Studio'],
    coordinates: { lat: -8.4095, lng: 115.1889 },
    featured: true, trending: true,
    createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-07-10T12:00:00Z',
    authorId: 'admin1', authorName: 'Sarah Johnson',
  },
  // ... 11 more destinations
];

export const categories = ['Beach', 'Mountains', 'City', 'Nature', 'Adventure', 'Coastal'];
export const continents = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];