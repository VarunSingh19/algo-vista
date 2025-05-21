import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import { NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

// Sets JWT cookie in API response
export function setAuthCookie(res: NextApiResponse, token: string): void {
  const cookie = serialize('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

// Clear auth cookie (for logout)
export function clearAuthCookie(res: NextApiResponse): void {
  const cookie = serialize('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}
