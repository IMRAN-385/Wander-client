import { NextRequest, NextResponse } from 'next/server';
import { blogs } from '@/data/collections';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (slug) {
    const blog = blogs.find(b => b.slug === slug);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: blog });
  }

  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '6');
  const start = (page - 1) * limit;

  return NextResponse.json({
    success: true,
    data: {
      items: blogs.slice(start, start + limit),
      total: blogs.length,
      page,
      totalPages: Math.ceil(blogs.length / limit),
      hasMore: page < Math.ceil(blogs.length / limit),
    },
  });
}