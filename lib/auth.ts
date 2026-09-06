import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "auto_blog_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

/**
 * Creates a simple signature token for the admin session.
 */
function createSessionToken(password: string): string {
  // Simple deterministic hash token
  const combined = `auth:${password}:blog_salt`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `sess_${Math.abs(hash).toString(36)}`;
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const currentPassword = getAdminPassword();
  return inputPassword.trim() === currentPassword.trim();
}

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const expectedToken = createSessionToken(getAdminPassword());
  return sessionToken === expectedToken;
}

export function getSessionToken(): string {
  return createSessionToken(getAdminPassword());
}

export { ADMIN_COOKIE_NAME };
