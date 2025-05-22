import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAuthenticated } from "@/lib/auth";

// GET all submissions for the current user
export async function GET(request: NextRequest) {
  try {
    const user = await isAuthenticated(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filter: any = { userId: user._id };
    if (status && status !== "all") {
      filter.status = status;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("problemId", "title");

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
