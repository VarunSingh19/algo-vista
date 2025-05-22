import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import User from "./models/User";
import dbConnect from "./db";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-fallback-secret-key-for-development";
const JWT_EXPIRY = "30d"; // Token expires in 30 days

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => await bcrypt.compare(password, hashedPassword);

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export const generateToken = (userId: string): string =>
  jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    "Set-Cookie",
    `jwt=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
      60 * 60 * 24 * 30
    }`
  );
}

export function clearTokenCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    "jwt=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );
}

export function setAuthCookie(res: NextApiResponse, token: string): void {
  res.setHeader(
    "Set-Cookie",
    `jwt=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
      60 * 60 * 24 * 30
    }`
  );
}

export function clearAuthCookie(res: NextApiResponse): void {
  res.setHeader(
    "Set-Cookie",
    "jwt=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );
}

// ← FIXED HERE: await cookies().get()
export const isAuthenticated = async (request: NextRequest) => {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const tokenCookie = await cookieStore.get("jwt");
    const token = tokenCookie?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id);
    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
};

export const isAdmin = async (request: NextRequest) => {
  try {
    const user = await isAuthenticated(request);
    if (!user || user.role !== "admin") return null;
    return user;
  } catch {
    return null;
  }
};
