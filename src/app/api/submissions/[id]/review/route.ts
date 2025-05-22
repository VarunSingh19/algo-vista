import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAdmin } from "@/lib/auth";

// Validation schema for submission review
const reviewSchema = z.object({
  status: z.enum([
    "Accepted",
    "Wrong Answer",
    "Time Limit Exceeded",
    "Memory Limit Exceeded",
    "Runtime Error",
    "Compilation Error",
  ]),
  feedback: z.string().optional(),
  executionTime: z.number().optional(),
  memoryUsed: z.number().optional(),
});

// PUT review a submission (admin only)
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

    const submission = await Submission.findById(params.id);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Update submission with review data
    const updatedSubmission = await Submission.findByIdAndUpdate(
      params.id,
      {
        ...validationResult.data,
        reviewed: true,
        reviewedBy: admin._id,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Submission reviewed successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to review submission" },
      { status: 500 }
    );
  }
}
