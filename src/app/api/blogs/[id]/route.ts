import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { isAuthenticated, isAdmin } from "@/lib/auth";

// Validation schema for updating blogs
const updateBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters")
    .optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
  readTime: z.number().int().positive().optional(),
});

// GET specific blog (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Increment view count if not updating the blog (admin)
    if (!request.headers.get("x-admin-update")) {
      await Blog.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Get blog error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT update blog (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const body = await request.json();
    const validationResult = updateBlogSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData = {
      ...validationResult.data,
      updatedAt: new Date(),
    };

    const updatedBlog = await Blog.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE blog (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
