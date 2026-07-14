import { NextRequest, NextResponse } from 'next/server';
import { reviews } from '@/data/collections';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const destId = req.nextUrl.searchParams.get('destinationId');
  const filtered = destId
    ? reviews.filter(r => r.destinationId === destId)
    : reviews;
  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { destinationId, userId, userName, rating, comment } = body;

  if (!destinationId || !userId || !userName || !rating || !comment) {
    return NextResponse.json(
      { success: false, error: 'All fields required' },
      { status: 400 }
    );
  }

  const newReview = {
    _id: uuidv4(),
    destinationId,
    userId,
    userName,
    rating: Math.min(5, Math.max(1, rating)),
    comment,
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  return NextResponse.json({ success: true, data: newReview }, { status: 201 });
}