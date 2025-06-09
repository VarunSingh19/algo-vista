import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Progress from "@/lib/models/Progress";
import Sheet from "@/lib/models/Sheet";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-fallback-secret-key-for-development";

// Helper to check if user is admin
async function isAdmin() {
  try {
    await dbConnect();

    const token = (await cookies()).get("jwt")?.value;

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id);

    return user?.role === "admin";
  } catch (error) {
    return false;
  }
}

interface Problem {
  id: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

interface Topic {
  problems?: Problem[];
}

interface Section {
  topics?: Topic[];
}

interface SheetData {
  sections?: Section[];
}

// Calculate difficulties for a sheet
async function calculateDifficulties(sheet: SheetData) {
  const difficulties: Record<string, { total: number; problems: string[] }> = {
    Easy: { total: 0, problems: [] },
    Medium: { total: 0, problems: [] },
    Hard: { total: 0, problems: [] },
  };

  // Process each section
  if (sheet.sections && Array.isArray(sheet.sections)) {
    for (const section of sheet.sections) {
      // Process each topic
      if (section.topics && Array.isArray(section.topics)) {
        for (const topic of section.topics) {
          // Process each problem
          if (topic.problems && Array.isArray(topic.problems)) {
            for (const problem of topic.problems) {
              const difficulty = problem.difficulty || "Medium";
              difficulties[difficulty].total += 1;
              difficulties[difficulty].problems.push(problem.id);
            }
          }
        }
      }
    }
  }

  return difficulties;
}

// GET progress report for a specific sheet (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const adminUser = await isAdmin();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get sheetId from query params
    const url = new URL(request.url);
    const sheetId = url.searchParams.get("sheetId");

    if (!sheetId) {
      return NextResponse.json(
        { error: "Sheet ID is required" },
        { status: 400 }
      );
    }

    // Get sheet data to calculate total problems and difficulties
    const sheet = await Sheet.findById(sheetId);
    if (!sheet) {
      return NextResponse.json({ error: "Sheet not found" }, { status: 404 });
    }

    // Calculate difficulties for the sheet
    const difficulties = await calculateDifficulties(sheet);

    // Get all user progress for this sheet
    const progressEntries = await Progress.find({ sheetId }).lean();

    // Get all users with progress
    const userIds = [...new Set(progressEntries.map((entry) => entry.userId))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();

    // Map user data
    interface UserDoc {
      _id: { toString(): string };
      name: string;
      email: string;
      __v?: number;
    }

    const userMap = (users as UserDoc[]).reduce<Record<string, { name: string; email: string }>>((acc, user) => {
      acc[user._id.toString()] = { name: user.name, email: user.email };
      return acc;
    }, {});

    // Calculate progress statistics for each user
    const progressReport = progressEntries.map((entry) => {
      const userId = entry.userId.toString();
      const userName = userMap[userId]?.name || "Unknown User";
      const userEmail = userMap[userId]?.email || "unknown@example.com";
      const completedProblems = entry.completedProblemIds.length;
      const totalProblems = sheet.totalProblems;
      const completionPercentage =
        Math.round((completedProblems / totalProblems) * 100) || 0;

      // Calculate difficulty breakdown
    interface DifficultyProgress {
        completed: number;
        total: number;
    }

    interface DifficultyBreakdown {
        Easy: DifficultyProgress;
        Medium: DifficultyProgress;
        Hard: DifficultyProgress;
    }

                const byDifficulty: DifficultyBreakdown = {
                    Easy: {
                        completed: entry.completedProblemIds.filter((id: string) =>
                            difficulties.Easy.problems.includes(id)
                        ).length,
                        total: difficulties.Easy.total,
                    },
                    Medium: {
                        completed: entry.completedProblemIds.filter((id: string) =>
                            difficulties.Medium.problems.includes(id)
                        ).length,
                        total: difficulties.Medium.total,
                    },
                    Hard: {
                        completed: entry.completedProblemIds.filter((id: string) =>
                            difficulties.Hard.problems.includes(id)
                        ).length,
                        total: difficulties.Hard.total,
                    },
                };

      return {
        userId,
        userName,
        userEmail,
        completionPercentage,
        completedProblems,
        totalProblems,
        byDifficulty,
      };
    });

    return NextResponse.json(progressReport, { status: 200 });
  } catch (error) {
    console.error("Get progress report error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress report" },
      { status: 500 }
    );
  }
}
