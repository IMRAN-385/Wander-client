export interface IDestination {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  category: string;
  location: string;
  country: string;
  continent: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  bestSeason: string;
  activities: string[];
  highlights: string[];
  amenities: string[];
  coordinates: { lat: number; lng: number };
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  wishlist: string[];
  createdAt: string;
}

export interface IReview {
  _id: string;
  destinationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IBooking {
  _id: string;
  userId: string;
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  readTime: number;
  createdAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FilterParams {
  search?: string;
  category?: string;
  continent?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
  country?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}