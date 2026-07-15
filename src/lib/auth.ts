import jwt from 'jsonwebtoken';
import { AuthPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'wanderlust-premium-secret-key-2026';
const JWT_EXPIRY = '7d';

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): AuthPayload | null {
  try { return jwt.verify(token, JWT_SECRET) as AuthPayload; }
  catch { return null; }
}

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}