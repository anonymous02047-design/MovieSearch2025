import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminUser {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const tokenCookie = request.cookies.get('adminToken');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  // Check for admin_token in cookies (fallback)
  const adminTokenCookie = request.cookies.get('admin_token');
  if (adminTokenCookie) {
    return adminTokenCookie.value;
  }

  return null;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = getAdminTokenFromRequest(request);
  if (!token) return false;

  const admin = verifyAdminToken(token);
  return admin !== null && admin.role === 'admin';
}

export function requireAdminAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    if (!isAdminAuthenticated(request)) {
      return new Response(
        JSON.stringify({ error: 'Admin authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(request, ...args);
  };
}
