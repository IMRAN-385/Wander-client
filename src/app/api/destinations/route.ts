import { NextRequest, NextResponse } from 'next/server';
import { destinations } from '@/data/destinations';
import { extractToken, verifyToken } from '@/lib/auth';
import { IDestination } from '@/types';
import { v4 as uuidv4 } from 'uuid';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const search = sp.get('search') || '';
  const category = sp.get('category') || '';
  const continent = sp.get('continent') || '';
  const minPrice = sp.get('minPrice') ? +sp.get('minPrice')! : undefined;
  const maxPrice = sp.get('maxPrice') ? +sp.get('maxPrice')! : undefined;
  const minRating = sp.get('minRating') ? +sp.get('minRating')! : undefined;
  const location = sp.get('location') || '';
  const sortBy = sp.get('sortBy') || 'newest';
  const page = sp.get('page') ? +sp.get('page')! : 1;
  const limit = sp.get('limit') ? +sp.get('limit')! : 8;
  const featured = sp.get('featured') === 'true';
  const trending = sp.get('trending') === 'true';

  let items = [...destinations];

  if (featured) items = items.filter(d => d.featured);
  if (trending) items = items.filter(d => d.trending);

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }
  if (category) items = items.filter(d => d.category === category);
  if (continent) items = items.filter(d => d.continent === continent);
  if (minPrice !== undefined) items = items.filter(d => d.price >= minPrice);
  if (maxPrice !== undefined) items = items.filter(d => d.price <= maxPrice);
  if (minRating !== undefined) items = items.filter(d => d.rating >= minRating);
  if (location) {
    const loc = location.toLowerCase();
    items = items.filter(d =>
      d.location.toLowerCase().includes(loc) ||
      d.country.toLowerCase().includes(loc)
    );
  }

  const sortMap: Record<string, (a: IDestination, b: IDestination) => number> = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'rating-desc': (a, b) => b.rating - a.rating,
    'rating-asc': (a, b) => a.rating - b.rating,
    'oldest': (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    'newest': (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    'popular': (a, b) => b.reviewCount - a.reviewCount,
  };
  items.sort(sortMap[sortBy] || sortMap['newest']);

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = items.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    success: true,
    data: { items: paginated, total, page, totalPages, hasMore: page < totalPages },
  });
}

export async function POST(req: NextRequest) {
  const token = extractToken(req.headers.get('authorization'));
  const payload = token ? verifyToken(token) : null;
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, shortDescription, fullDescription, category, location, country, price, bestSeason, activities, images, continent } = body;

  if (!title || !shortDescription || !fullDescription || !category || !location || !country) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const newDest: IDestination = {
    _id: uuidv4(),
    title,
    slug: slugify(title),
    shortDescription,
    fullDescription,
    images: images?.length ? images : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    category,
    location,
    country,
    continent: continent || 'Asia',
    price: price || 0,
    currency: 'USD',
    rating: 0,
    reviewCount: 0,
    bestSeason: bestSeason || 'Year-round',
    activities: activities || [],
    highlights: [],
    amenities: [],
    coordinates: { lat: 0, lng: 0 },
    featured: false,
    trending: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: payload.userId,
    authorName: payload.name,
  };

  destinations.push(newDest);
  return NextResponse.json({ success: true, data: newDest }, { status: 201 });
}