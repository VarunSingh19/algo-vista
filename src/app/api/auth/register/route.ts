import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import { hashPassword, generateToken } from "@/lib/auth";
import { sendEmail, getWelcomeEmailTemplate } from "@/lib/email";
import { cookies } from "next/headers";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, otp } = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please verify your OTP first." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    // Clean up OTP records for this email
    await OTP.deleteMany({ email });

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "jwt",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Send welcome email (don't wait for it to complete)
    sendEmail({
      to: email,
      subject: "🎉 Welcome to VibeArmor - Your Coding Journey Begins!",
      html: getWelcomeEmailTemplate(name),
    }).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      socialLinks: user.socialLinks,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        user: userResponse,
        message: "Registration successful! Welcome to VibeArmor!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
