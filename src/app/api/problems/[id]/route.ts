import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import CodingProblem from "@/lib/models/CodingProblem";
import Submission from "@/lib/models/Submission";
import { isAuthenticated, isAdmin } from "@/lib/auth";

// Validation schema for updating coding problems
const updateProblemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  tags: z.array(z.string()).optional(),
  constraints: z.string().optional(),
  examples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional(),
      })
    )
    .optional(),
  solutionApproach: z.string().optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
});

// GET specific coding problem (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const problem = await CodingProblem.findById(params.id);

    if (!problem) {
      return NextResponse.json(
        { error: "Coding problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error("Get problem error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coding problem" },
      { status: 500 }
    );
  }
}

// PUT update coding problem (admin only)
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

    const problem = await CodingProblem.findById(params.id);

    if (!problem) {
      return NextResponse.json(
        { error: "Coding problem not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = updateProblemSchema.safeParse(body);

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

    const updatedProblem = await CodingProblem.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("Update problem error:", error);
    return NextResponse.json(
      { error: "Failed to update coding problem" },
      { status: 500 }
    );
  }
}

// DELETE coding problem (admin only)
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

    const problem = await CodingProblem.findById(params.id);

    if (!problem) {
      return NextResponse.json(
        { error: "Coding problem not found" },
        { status: 404 }
      );
    }

    // Delete all submissions for this problem
    await Submission.deleteMany({ problemId: params.id });

    // Delete the problem
    await CodingProblem.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "Coding problem deleted successfully",
    });
  } catch (error) {
    console.error("Delete problem error:", error);
    return NextResponse.json(
      { error: "Failed to delete coding problem" },
      { status: 500 }
    );
  }
}
