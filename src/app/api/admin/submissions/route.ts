import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAuthenticated, isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await isAuthenticated(request);

    if (!user || !(await isAdmin(request))) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    const submissions = await Submission.find(filter)
      .populate({
        path: "userId",
        select: "name email",
        model: "User",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Submission.countDocuments(filter);

    return NextResponse.json({
      success: true,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await isAuthenticated(request);
    if (!user || !(await isAdmin(request))) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { status } = body;

    const submission = await Submission.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
