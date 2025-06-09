import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { isAuthenticated, isAdmin } from "@/lib/auth";

// Validation schema for creating blogs
const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
  readTime: z.number().int().positive().optional(),
});

// GET all blogs (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract query parameters
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Create filter for query
    const filter: { published: boolean; tags?: string } = { published: true };
    if (tag) {
      filter.tags = tag;
    }

    // Query database
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    return NextResponse.json({
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST create new blog (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await isAuthenticated(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const admin = await isAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validationResult = createBlogSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const blogData = {
      ...validationResult.data,
      authorId: user._id,
      authorName: user.name,
    };

    const newBlog = await Blog.create(blogData);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
