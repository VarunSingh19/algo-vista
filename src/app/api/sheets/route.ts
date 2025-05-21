import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import Sheet from '@/lib/models/Sheet';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Validation schema for creating sheets
const createSheetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  totalProblems: z.number().int().positive('Total problems must be positive'),
  sections: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      topics: z.array(
        z.object({
          id: z.string().min(1),
          title: z.string().min(1),
          problems: z.array(
            z.object({
              id: z.string().min(1),
              title: z.string().min(1),
              problemLink: z.string().optional(),
              videoLink: z.string().optional(),
              editorialLink: z.string().optional(),
              difficulty: z.enum(['Easy', 'Medium', 'Hard'])
            })
          )
        })
      )
    })
  )
});

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

// GET all sheets (public)
export async function GET() {
  try {
    await dbConnect();
    const sheets = await Sheet.find({}, 'title description totalProblems');

    return NextResponse.json(sheets, { status: 200 });
  } catch (error) {
    console.error('Get sheets error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheets' },
      { status: 500 }
    );
  }
}

// POST create new sheet (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminUser = await isAdmin(request);

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validationResult = createSheetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const sheetData = validationResult.data;

    // Create new sheet
    const sheet = await Sheet.create(sheetData);

    return NextResponse.json(sheet, { status: 201 });
  } catch (error) {
    console.error('Create sheet error:', error);
    return NextResponse.json(
      { error: 'Failed to create sheet' },
      { status: 500 }
    );
  }
}
