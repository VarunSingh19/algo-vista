import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import User from "../models/User";
import dbConnect from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "varunsingh";

// Extended request interface to include user
export interface AuthRequest extends NextApiRequest {
  user?: any;
}

// Middleware to attach user to request if authenticated
export async function withAuth(
  req: AuthRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };

    // If token was successfully verified, connect to DB and find user
    await dbConnect();
    const user = await User.findById(decoded._id).select("-passwordHash");

    if (user) {
      req.user = user;
    }

    return next();
  } catch (error) {
    // Invalid token, but we'll still continue (just not authenticated)
    return next();
  }
}

// Helper to require authentication
export function requireAuth(
  req: AuthRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  return next();
}

// Helper to require admin role
export function requireAdmin(
  req: AuthRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
}
