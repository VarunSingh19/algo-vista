import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAuthenticated } from "@/lib/auth";

// GET all submissions for the current user
export async function GET(request: NextRequest) {
  console.log("GET /api/submissions - Request received");

  try {
    const user = await isAuthenticated(request);
    console.log(
      "Authentication result:",
      user ? "User authenticated" : "Not authenticated"
    );

    if (!user) {
      console.log("Authentication required - returning 401");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();
    console.log("Database connected");

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    console.log("Query params:", { status, page, limit });

    const filter: any = { userId: user._id };
    if (status && status !== "all") {
      filter.status = status;
    }

    console.log("Applying filter:", filter);

    try {
      const submissions = await Submission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("problemId", "title");

      const total = await Submission.countDocuments(filter);

      console.log(
        `Found ${submissions.length} submissions out of ${total} total`
      );

      return NextResponse.json({
        data: submissions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
