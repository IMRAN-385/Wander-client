import { IReview, IBlog, IUser, IBooking } from '@/types';

export const reviews: IReview[] = [
  { _id: 'r1', destinationId: 'd1', userId: 'user1', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', rating: 5, comment: 'Bali exceeded every expectation. The temples were serene, the beaches pristine, and the locals incredibly welcoming. The rice terrace trek at sunrise was a spiritual experience. Will absolutely return.', createdAt: '2026-06-15T10:00:00Z' },
  { _id: 'r2', destinationId: 'd1', userId: 'user2', userName: 'Emma Watson', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', rating: 4, comment: 'Beautiful island with a rich cultural tapestry. Ubud was the highlight — the Monkey Forest and artisan workshops were unforgettable. Only downside was traffic in some tourist areas.', createdAt: '2026-06-20T14:00:00Z' },
  { _id: 'r3', destinationId: 'd2', userId: 'user1', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', rating: 5, comment: 'The Swiss Alps are absolutely breathtaking. Hiking in summer with wildflowers everywhere and the Matterhorn as a constant companion was pure magic. Every view belongs on a postcard.', createdAt: '2026-05-10T09:00:00Z' },
  { _id: 'r4', destinationId: 'd2', userId: 'admin1', userName: 'Sarah Johnson', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', rating: 5, comment: 'Winter skiing was world-class. Zermatt is a car-free village that feels like stepping into a fairytale. The Glacier Express journey was the highlight of my travel year. Pricy but worth every franc.', createdAt: '2026-04-28T16:00:00Z' },
  { _id: 'r5', destinationId: 'd3', userId: 'admin1', userName: 'Sarah Johnson', rating: 5, comment: 'Tokyo is unlike any city on Earth. The blend of ancient temples and futuristic technology is mind-bending. The food culture alone is worth the trip — from conveyor-belt sushi to Michelin kaiseki.', createdAt: '2026-06-01T11:00:00Z' },
  { _id: 'r6', destinationId: 'd4', userId: 'user2', userName: 'Emma Watson', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', rating: 5, comment: 'Santorini sunsets are everything people say and more. Watching the sun melt into the caldera from our infinity pool was a peak life experience. The white wine from volcanic soil is incredible.', createdAt: '2026-06-25T08:00:00Z' },
  { _id: 'r7', destinationId: 'd5', userId: 'user1', userName: 'Alex Rivera', rating: 4, comment: 'Incredible biodiversity! Saw sloths, toucans, and howler monkeys within the first day. Zip-lining through the cloud forest was exhilarating — felt like flying through a green cathedral.', createdAt: '2026-05-22T13:00:00Z' },
  { _id: 'r8', destinationId: 'd6', userId: 'admin1', userName: 'Sarah Johnson', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', rating: 4, comment: 'Marrakech is sensory overload in the best possible way. Staying in a traditional riad was magical. The souks are a maze of treasures. Don\'t miss a hammam experience — it\'s transformative.', createdAt: '2026-06-15T10:00:00Z' },
  { _id: 'r9', destinationId: 'd7', userId: 'user1', userName: 'Alex Rivera', rating: 5, comment: 'New Zealand is the adventure capital for a reason. Bungee jumping in Queenstown and hiking Franz Josef glacier were lifetime highlights. The landscape is so dramatic it feels unreal.', createdAt: '2026-05-25T09:00:00Z' },
  { _id: 'r10', destinationId: 'd8', userId: 'user2', userName: 'Emma Watson', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', rating: 5, comment: 'Driving the Amalfi Coast was a dream come true. Every turn reveals another postcard view. The food in Positano — fresh seafood with lemon and local wine — was the best of my life.', createdAt: '2026-06-28T15:00:00Z' },
  { _id: 'r11', destinationId: 'd9', userId: 'admin1', userName: 'Sarah Johnson', rating: 5, comment: 'Seeing the Northern Lights dance across the sky was one of the most profound moments of my life. Iceland\'s landscapes feel alien in the best way. The Blue Lagoon under snowfall was pure bliss.', createdAt: '2026-04-14T20:00:00Z' },
  { _id: 'r12', destinationId: 'd10', userId: 'user1', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', rating: 5, comment: 'The Maldives is paradise made physical. Snorkeling with manta rays and staying in an overwater villa was pure luxury. The underwater restaurant experience was surreal and magical.', createdAt: '2026-06-30T12:00:00Z' },
];

export const blogs: IBlog[] = [
  {
    _id: 'b1', title: 'The Art of Slow Travel: Why Less Is More', slug: 'art-of-slow-travel',
    excerpt: 'Discover how slowing down and immersing yourself in fewer destinations can lead to deeper, more meaningful travel experiences.',
    content: 'Long-form blog content about slow travel philosophy and practical tips...',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    category: 'Travel Tips', authorId: 'admin1', authorName: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80',
    tags: ['Slow Travel', 'Mindful Travel', 'Cultural Immersion'], readTime: 6,
    createdAt: '2026-06-20T08:00:00Z',
  },
  {
    _id: 'b2', title: 'Hidden Gems of Southeast Asia Beyond Bali', slug: 'hidden-gems-southeast-asia',
    excerpt: 'Beyond Bali\'s shores lie incredible destinations waiting to be discovered. Explore the lesser-known paradises of Southeast Asia.',
    content: 'Long-form blog content about Southeast Asian hidden gems...',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    category: 'Destinations', authorId: 'user1', authorName: 'Kenji Tanaka',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
    tags: ['Southeast Asia', 'Hidden Gems', 'Beaches'], readTime: 5,
    createdAt: '2026-06-15T10:00:00Z',
  },
  {
    _id: 'b3', title: 'Photography Guide: Capturing the Northern Lights', slug: 'northern-lights-photography',
    excerpt: 'Master the art of aurora photography with our comprehensive guide to settings, composition, and the best locations.',
    content: 'Long-form blog content about aurora photography...',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800',
    category: 'Photography', authorId: 'admin1', authorName: 'Sarah Johnson',
    tags: ['Photography', 'Northern Lights', 'Iceland'], readTime: 8,
    createdAt: '2026-06-10T14:00:00Z',
  },
  {
    _id: 'b4', title: 'A Food Lover\'s Guide to Tokyo\'s Best Street Food', slug: 'tokyo-street-food-guide',
    excerpt: 'Navigate Tokyo\'s incredible street food scene from hidden ramen shops to yakitori alleys and tsukiji market treasures.',
    content: 'Long-form blog content about Tokyo street food...',
    image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800',
    category: 'Food & Drink', authorId: 'user1', authorName: 'Kenji Tanaka',
    tags: ['Food', 'Tokyo', 'Street Food'], readTime: 7,
    createdAt: '2026-06-05T09:00:00Z',
  },
];

export const users: IUser[] = [
  { _id: 'admin1', name: 'Sarah Johnson', email: 'admin@wanderlust.com', password: '$2a$10$dGHMJvqLhMKDvqEPhBkKeOsPl6SWJVkWMAxLchCsUs7AQFjxGSK3K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', role: 'admin', wishlist: ['d1', 'd4', 'd9'], createdAt: '2026-01-01T00:00:00Z' },
  { _id: 'user1', name: 'Kenji Tanaka', email: 'demo@wanderlust.com', password: '$2a$10$dGHMJvqLhMKDvqEPhBkKeOsPl6SWJVkWMAxLchCsUs7AQFjxGSK3K', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', role: 'user', wishlist: ['d2', 'd7', 'd11'], createdAt: '2026-01-05T00:00:00Z' },
  { _id: 'user2', name: 'Emma Watson', email: 'emma@wanderlust.com', password: '$2a$10$dGHMJvqLhMKDvqEPhBkKeOsPl6SWJVkWMAxLchCsUs7AQFjxGSK3K', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', role: 'user', wishlist: ['d4', 'd8', 'd10'], createdAt: '2026-01-10T00:00:00Z' },
];

export const bookings: IBooking[] = [
  { _id: 'bk1', userId: 'user1', destinationId: 'd1', destinationName: 'Bali Tropical Paradise', destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300', checkIn: '2026-08-15T00:00:00Z', checkOut: '2026-08-22T00:00:00Z', guests: 2, totalPrice: 903, status: 'confirmed', createdAt: '2026-07-01T10:00:00Z' },
  { _id: 'bk2', userId: 'user1', destinationId: 'd7', destinationName: 'New Zealand South Island', destinationImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=300', checkIn: '2026-12-10T00:00:00Z', checkOut: '2026-12-20T00:00:00Z', guests: 1, totalPrice: 1950, status: 'pending', createdAt: '2026-07-05T14:00:00Z' },
];