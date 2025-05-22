import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import BlogRead from "@/lib/models/BlogRead";
import { isAuthenticated } from "@/lib/auth";

// POST mark blog as read (authenticated only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await isAuthenticated(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if blog exists
    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Create or update BlogRead entry
    await BlogRead.findOneAndUpdate(
      { userId: user._id, blogId: params.id },
      { userId: user._id, blogId: params.id, readAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Blog marked as read",
      success: true,
    });
  } catch (error) {
    console.error("Mark blog as read error:", error);
    return NextResponse.json(
      { error: "Failed to mark blog as read" },
      { status: 500 }
    );
  }
}
