import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import Progress from "@/lib/models/Progress";
import Submission from "@/lib/models/Submission";

export async function GET(req: NextRequest) {
  try {
    const user = await isAuthenticated(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user._id.toString();
    // Get date range (default to last 30 days)
    const searchParams = req.nextUrl.searchParams;
    const days = Number.parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all progress updates in date range
    const progressUpdates = await Progress.find({
      userId,
      updatedAt: { $gte: startDate },
    }).populate("sheetId");

    // Get all submissions in date range
    const submissions = await Submission.find({
      userId,
      createdAt: { $gte: startDate },
    }).populate("problemId");

    // Aggregate data by day
    const activityByDay = new Map();

    // Process progress updates
    progressUpdates.forEach((update) => {
      const date = new Date(update.updatedAt).toISOString().split("T")[0];

      if (!activityByDay.has(date)) {
        activityByDay.set(date, {
          date,
          problemsSolved: 0,
          timeSpent: 0, // in minutes
          sheetsWorkedOn: [],
        });
      }

      const dayData = activityByDay.get(date);

      // Add sheet if not already included
      if (
        update.sheetId &&
        !dayData.sheetsWorkedOn.includes(update.sheetId._id.toString())
      ) {
        dayData.sheetsWorkedOn.push(update.sheetId._id.toString());
      }

      // Count problems solved (if completedProblemIds was updated)
      if (update.completedProblemIds && update._previousCompletedProblemIds) {
        const newProblems =
          update.completedProblemIds.length -
          update._previousCompletedProblemIds.length;
        if (newProblems > 0) {
          dayData.problemsSolved += newProblems;
        }
      }

      // Add time spent (if tracked)
      if (update.timeSpent) {
        dayData.timeSpent += update.timeSpent / 60; // Convert seconds to minutes
      }
    });

    // Process submissions
    submissions.forEach((submission) => {
      const date = new Date(submission.createdAt).toISOString().split("T")[0];

      if (!activityByDay.has(date)) {
        activityByDay.set(date, {
          date,
          problemsSolved: 0,
          timeSpent: 0,
          sheetsWorkedOn: [],
        });
      }

      const dayData = activityByDay.get(date);

      // Count successful submissions
      if (submission.status === "accepted") {
        dayData.problemsSolved += 1;
      }

      // Add time spent on submission (if tracked)
      if (submission.timeSpent) {
        dayData.timeSpent += submission.timeSpent / 60; // Convert seconds to minutes
      }
    });

    // Convert map to array and sort by date
    const activityData = Array.from(activityByDay.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(activityData);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}
