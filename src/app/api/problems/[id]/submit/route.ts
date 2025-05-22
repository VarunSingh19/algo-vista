import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import CodingProblem from "@/lib/models/CodingProblem";
import Submission from "@/lib/models/Submission";
import { isAuthenticated } from "@/lib/auth";

// Validation schema for submissions
const submissionSchema = z.object({
  code: z.string().min(1, "Code submission is required"),
  language: z.enum(["javascript", "python", "java", "cpp", "c"]),
});

// POST submit a solution (authenticated only)
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

    // Check if problem exists
    const problem = await CodingProblem.findById(params.id);

    if (!problem) {
      return NextResponse.json(
        { error: "Coding problem not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validationResult = submissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Create submission
    const submission = await Submission.create({
      userId: user._id,
      userName: user.name,
      problemId: params.id,
      code: validationResult.data.code,
      language: validationResult.data.language,
      status: "Pending", // In a real app, you might process the submission asynchronously
    });

    return NextResponse.json(
      {
        message: "Solution submitted successfully",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit solution" },
      { status: 500 }
    );
  }
}
