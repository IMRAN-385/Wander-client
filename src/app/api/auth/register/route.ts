import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { users } from '@/data/collections';
import { IUser } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser: IUser = {
      _id: uuidv4(),
      name,
      email,
      password: hashed,
      role: 'user',
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    const token = signToken({
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            wishlist: newUser.wishlist,
          },
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}