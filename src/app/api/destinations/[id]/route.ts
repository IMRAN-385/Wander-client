import { NextRequest, NextResponse } from 'next/server';
import { destinations } from '@/data/destinations';
import { reviews } from '@/data/collections';
import { extractToken, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const destination = destinations.find(
    d => d._id === resolvedParams.id || d.slug === resolvedParams.id
  );

  if (!destination) {
    return NextResponse.json(
      { success: false, error: 'Not found' },
      { status: 404 }
    );
  }

  const destReviews = reviews.filter(r => r.destinationId === destination._id);
  const related = destinations
    .filter(d => d._id !== destination._id && d.category === destination.category)
    .slice(0, 4);

  return NextResponse.json({
    success: true,
    data: { destination, reviews: destReviews, related },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = extractToken(req.headers.get('authorization'));
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const idx = destinations.findIndex(d => d._id === id);
  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  if (payload.role !== 'admin' && destinations[idx].authorId !== payload.userId) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  destinations.splice(idx, 1);
  return NextResponse.json({ success: true, message: 'Deleted' });
}