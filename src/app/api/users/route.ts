import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Progress from '@/lib/models/Progress';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Helper to check if user is admin
async function isAdmin(request: NextRequest) {
  try {
    await dbConnect();

    const token = cookies().get('jwt')?.value;

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id);

    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
}

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminUser = await isAdmin(request);

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await dbConnect();
    const users = await User.find().select('-passwordHash');

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
