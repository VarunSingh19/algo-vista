import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAuthenticated } from "@/lib/auth";

// GET submissions with filtering options
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
    const problemId = url.searchParams.get("problemId");
    const status = url.searchParams.get("status");
    const allUsers = url.searchParams.get("allUsers") === "true";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    console.log("Query params:", { problemId, status, allUsers, page, limit });

    // Build the filter object
    interface SubmissionFilter {
      problemId?: string;
      userId?: string;
      status?: string;
    }

    const filter: SubmissionFilter = {};

    // Filter by problemId if provided
    if (problemId) {
      filter.problemId = problemId;
    }

    // Filter by user unless allUsers is requested
    if (!allUsers) {
      filter.userId = user._id;
    }

    // Filter by status if provided and not "all"
    if (status && status !== "all") {
      filter.status = status;
    }

    console.log("Applying filter:", filter);

    try {
      const submissions = await Submission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("problemId", "title")
        .populate("userId", "name email"); // Populate user info for allUsers requests

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
