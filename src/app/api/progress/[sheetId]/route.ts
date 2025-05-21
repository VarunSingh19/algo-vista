import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Progress from '@/lib/models/Progress';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Helper to get user ID from JWT
function getUserId(request: NextRequest) {
  try {
    const token = cookies().get('jwt')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    return decoded._id;
  } catch (error) {
    return null;
  }
}

// GET progress for a specific sheet
export async function GET(
  request: NextRequest,
  { params }: { params: { sheetId: string } }
) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find progress for this user and sheet
    let progress = await Progress.findOne({
      userId,
      sheetId: params.sheetId
    });

    // If no progress found, create empty progress
    if (!progress) {
      progress = {
        userId,
        sheetId: params.sheetId,
        completedProblemIds: []
      };
    }

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
