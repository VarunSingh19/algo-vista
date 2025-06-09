// import { NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';
// import dbConnect from '@/lib/db';
// import User from '@/lib/models/User';
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

// const JWT_SECRET = process.env.JWT_SECRET || 'varunsingh';

// // Validation schema for user updates
// const updateUserSchema = z.object({
//   name: z.string().min(2).optional(),
//   avatarUrl: z.string().url().optional(),
//   socialLinks: z.object({
//     github: z.string().optional(),
//     twitter: z.string().optional(),
//     linkedin: z.string().optional(),
//     personalSite: z.string().optional()
//   }).optional()
// });

// // Helper to get the current user from JWT
// async function getCurrentUser(request: NextRequest) {
//   try {
//     await dbConnect();

//     const token = cookies().get('jwt')?.value;

//     if (!token) {
//       return null;
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
//     const user = await User.findById(decoded._id).select('-passwordHash');

//     return user;
//   } catch (error) {
//     return null;
//   }
// }

// // GET current user
// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error('Get user error:', error);
//     return NextResponse.json(
//       { error: 'Failed to get user data' },
//       { status: 500 }
//     );
//   }
// }

// // PATCH update current user
// export async function PATCH(request: NextRequest) {
//   try {
//     const user = await getCurrentUser(request);

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const validationResult = updateUserSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         { error: validationResult.error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     const updateData = validationResult.data;

//     // Update only specified fields
//     if (updateData.name) user.name = updateData.name;
//     if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;

//     if (updateData.socialLinks) {
//       if (updateData.socialLinks.github !== undefined) {
//         user.socialLinks.github = updateData.socialLinks.github;
//       }
//       if (updateData.socialLinks.twitter !== undefined) {
//         user.socialLinks.twitter = updateData.socialLinks.twitter;
//       }
//       if (updateData.socialLinks.linkedin !== undefined) {
//         user.socialLinks.linkedin = updateData.socialLinks.linkedin;
//       }
//       if (updateData.socialLinks.personalSite !== undefined) {
//         user.socialLinks.personalSite = updateData.socialLinks.personalSite;
//       }
//     }

//     await user.save();

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error('Update user error:', error);
//     return NextResponse.json(
//       { error: 'Failed to update user data' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

// Validation schema for user updates
const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  bio: z.string().min(10).optional(),
  avatarUrl: z.string().url().optional(),
  socialLinks: z
    .object({
      github: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      personalSite: z.string().optional(),
    })
    .optional(),
});

// Helper to get the current user from JWT
async function getCurrentUser(request: NextRequest) {
  try {
    await dbConnect();

    const token = cookies().get("jwt")?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id).select("-passwordHash");
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// GET current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to get user data" },
      { status: 500 }
    );
  }
}

// PATCH update current user
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update only specified fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.location) user.location = updateData.location;
    if (updateData.bio) user.bio = updateData.bio;
    if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;

    if (updateData.socialLinks) {
      const links = updateData.socialLinks;
      if (links.github !== undefined) user.socialLinks.github = links.github;
      if (links.twitter !== undefined) user.socialLinks.twitter = links.twitter;
      if (links.linkedin !== undefined)
        user.socialLinks.linkedin = links.linkedin;
      if (links.personalSite !== undefined)
        user.socialLinks.personalSite = links.personalSite;
    }

    await user.save();
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}
