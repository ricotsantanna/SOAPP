import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { getUserById, getOrCreateDemoUser, User } from '@/lib/db';

/**
 * Resolves the currently authenticated user from session token cookie,
 * Authorization header, or fallback demo user if no token is present.
 */
export async function getAuthenticatedUser(req?: Request): Promise<User> {
  try {
    let token: string | undefined = undefined;

    // Check request Authorization header
    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // Fallback to HTTP-only cookie
    if (!token) {
      try {
        const cookieStore = cookies();
        token = cookieStore.get('socialone_session')?.value;
      } catch {}
    }

    if (token) {
      const decoded = verifySessionToken(token);
      if (decoded && decoded.userId) {
        const user = await getUserById(decoded.userId);
        if (user) return user;
      }
    }
  } catch (err) {
    console.warn('Error resolving authenticated user session:', err);
  }

  // Fallback default demo account
  return getOrCreateDemoUser("checknextip@gmail.com");
}
