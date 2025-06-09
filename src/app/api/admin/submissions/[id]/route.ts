import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { isAuthenticated, isAdmin } from "@/lib/auth";

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
