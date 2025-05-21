import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import Sheet from '@/lib/models/Sheet';
import Progress from '@/lib/models/Progress';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Validation schema for updating sheets
const updateSheetSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  totalProblems: z.number().int().positive().optional(),
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
  ).optional()
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

// GET specific sheet (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const sheet = await Sheet.findById(params.id);

    if (!sheet) {
      return NextResponse.json(
        { error: 'Sheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sheet, { status: 200 });
  } catch (error) {
    console.error('Get sheet error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheet' },
      { status: 500 }
    );
  }
}

// PUT update sheet (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await isAdmin(request);

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await dbConnect();

    const sheet = await Sheet.findById(params.id);

    if (!sheet) {
      return NextResponse.json(
        { error: 'Sheet not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = updateSheetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update sheet
    const updatedSheet = await Sheet.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedSheet, { status: 200 });
  } catch (error) {
    console.error('Update sheet error:', error);
    return NextResponse.json(
      { error: 'Failed to update sheet' },
      { status: 500 }
    );
  }
}

// DELETE sheet (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await isAdmin(request);

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await dbConnect();

    const sheet = await Sheet.findById(params.id);

    if (!sheet) {
      return NextResponse.json(
        { error: 'Sheet not found' },
        { status: 404 }
      );
    }

    // Delete all progress records for this sheet
    await Progress.deleteMany({ sheetId: params.id });

    // Delete the sheet
    await Sheet.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Sheet deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete sheet error:', error);
    return NextResponse.json(
      { error: 'Failed to delete sheet' },
      { status: 500 }
    );
  }
}
