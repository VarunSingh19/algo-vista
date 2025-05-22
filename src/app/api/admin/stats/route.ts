import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Sheet from "@/lib/models/Sheet";
import Progress from "@/lib/models/Progress";
import Blog from "@/lib/models/Blog";
import BlogRead from "@/lib/models/BlogRead";
import CodingProblem from "@/lib/models/CodingProblem";
import Submission from "@/lib/models/Submission";
import { isAdmin } from "@/lib/auth";

// GET admin statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get counts
    const userCount = await User.countDocuments();
    const sheetCount = await Sheet.countDocuments();
    const blogCount = await Blog.countDocuments();
    const problemCount = await CodingProblem.countDocuments();
    const submissionCount = await Submission.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id name email role avatarUrl createdAt");

    // Get recent blog reads
    const blogReads = await BlogRead.find()
      .sort({ readAt: -1 })
      .limit(100)
      .populate("userId", "name email")
      .populate("blogId", "title");

    // Get recent submissions
    const submissions = await Submission.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("userId", "name email")
      .populate("problemId", "title difficulty");

    // Get all problems (need for calculating stats)
    const problems = await CodingProblem.find().select("_id title difficulty");

    // Get all blogs (need for calculating stats)
    const blogs = await Blog.find().select("_id title views");

    // Aggregate stats
    const stats = {
      counts: {
        users: userCount,
        sheets: sheetCount,
        blogs: blogCount,
        problems: problemCount,
        submissions: submissionCount,
      },
      recentUsers,
      blogReads,
      submissions,
      problems,
      blogs,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}
