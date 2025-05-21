import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadImage } from '@/lib/cloudinary';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';

// Validation schema
const uploadSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
});

// Helper to check if user is authenticated
function isAuthenticated(request: NextRequest) {
  try {
    const token = cookies().get('jwt')?.value;

    if (!token) {
      return false;
    }

    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = uploadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { image } = validationResult.data;

    // Upload the image to Cloudinary
    const imageUrl = await uploadImage(image);

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}
