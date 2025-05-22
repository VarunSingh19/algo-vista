import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import CodingProblem from "@/lib/models/CodingProblem";
import { isAuthenticated, isAdmin } from "@/lib/auth";

// Validation schema for creating coding problems
const createProblemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
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
    .min(1, "At least one example is required"),
  solutionApproach: z.string().optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
});

// GET all coding problems (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract query parameters
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag");
    const difficulty = url.searchParams.get("difficulty");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Create filter for query
    const filter: any = {};
    if (tag) filter.tags = tag;
    if (difficulty) filter.difficulty = difficulty;

    // Query database
    const problems = await CodingProblem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CodingProblem.countDocuments(filter);

    return NextResponse.json({
      data: problems,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get problems error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coding problems" },
      { status: 500 }
    );
  }
}

// POST create new coding problem (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await isAuthenticated(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const admin = await isAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validationResult = createProblemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const problemData = {
      ...validationResult.data,
      authorId: user._id,
    };

    const newProblem = await CodingProblem.create(problemData);

    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error("Create problem error:", error);
    return NextResponse.json(
      { error: "Failed to create coding problem" },
      { status: 500 }
    );
  }
}
