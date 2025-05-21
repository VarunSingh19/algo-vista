import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import Progress from '@/lib/models/Progress';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Validation schema
const toggleSchema = z.object({
  sheetId: z.string().min(1, 'Sheet ID is required'),
  problemId: z.string().min(1, 'Problem ID is required')
});

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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = toggleSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { sheetId, problemId } = validationResult.data;

    await dbConnect();

    // Find progress for this user and sheet
    let progress = await Progress.findOne({ userId, sheetId });

    if (!progress) {
      // Create new progress if not exists
      progress = new Progress({
        userId,
        sheetId,
        completedProblemIds: [problemId]
      });
    } else {
      // Toggle problem completion
      const isCompleted = progress.completedProblemIds.includes(problemId);

      if (isCompleted) {
        // Remove problem from completed list
        progress.completedProblemIds = progress.completedProblemIds.filter(
          id => id !== problemId
        );
      } else {
        // Add problem to completed list
        progress.completedProblemIds.push(problemId);
      }
    }

    await progress.save();

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.error('Toggle progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
