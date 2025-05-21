import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Progress from '@/lib/models/Progress';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Validation schema for user updates by admin
const updateUserByAdminSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['user', 'admin']).optional(),
  avatarUrl: z.string().url().optional(),
  socialLinks: z.object({
    github: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    personalSite: z.string().optional()
  }).optional()
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

// GET specific user (admin only)
export async function GET(
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
    const user = await User.findById(params.id).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH update user (admin only)
export async function PATCH(
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

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = updateUserByAdminSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.role) user.role = updateData.role;
    if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;

    if (updateData.socialLinks) {
      if (updateData.socialLinks.github !== undefined) {
        user.socialLinks.github = updateData.socialLinks.github;
      }
      if (updateData.socialLinks.twitter !== undefined) {
        user.socialLinks.twitter = updateData.socialLinks.twitter;
      }
      if (updateData.socialLinks.linkedin !== undefined) {
        user.socialLinks.linkedin = updateData.socialLinks.linkedin;
      }
      if (updateData.socialLinks.personalSite !== undefined) {
        user.socialLinks.personalSite = updateData.socialLinks.personalSite;
      }
    }

    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (admin only)
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

    // Find user
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user's progress data
    await Progress.deleteMany({ userId: params.id });

    // Delete the user
    await User.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
