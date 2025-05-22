import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAuthenticated, isAdmin } from "@/lib/auth";

// GET all submissions for a problem (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Changed to Promise
) {
  try {
    // ✅ Await params before using them
    const resolvedParams = await params;

    const user = await isAuthenticated(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // If not admin, only return user's own submissions
    const isUserAdmin = await isAdmin(request);

    await dbConnect();

    // Extract query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Create filter for query
    const filter: any = { problemId: resolvedParams.id }; // ✅ Use resolvedParams.id

    // If not admin, only show user's own submissions
    if (!isUserAdmin) {
      filter.userId = user._id;
    }

    if (status) {
      filter.status = status;
    }

    // Query database
    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments(filter);

    return NextResponse.json({
      data: submissions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
