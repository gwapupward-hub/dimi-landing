import { eq } from "drizzle-orm";
import { authUsers, authSessions, AuthUser, InsertAuthUser, AuthSession, InsertAuthSession } from "../drizzle/schema";
import { getDb } from "./db";
import crypto from "crypto";

/**
 * Hash password using bcrypt-like approach with Node.js crypto
 * In production, use bcrypt or argon2 library
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":");
  const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return computedHash === storedHash;
}

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create a new auth user (sign up)
 */
export async function createAuthUser(data: {
  email: string;
  username: string;
  password: string;
}): Promise<AuthUser | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const passwordHash = await hashPassword(data.password);
    const result = await db.insert(authUsers).values({
      email: data.email.toLowerCase(),
      username: data.username,
      passwordHash,
    });

    // Fetch the created user
    const users = await db.select().from(authUsers).where(eq(authUsers.email, data.email.toLowerCase())).limit(1);
    return users[0] ?? null;
  } catch (error) {
    console.error("[Auth] Failed to create user:", error);
    return null;
  }
}

/**
 * Get auth user by email
 */
export async function getAuthUserByEmail(email: string): Promise<AuthUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(authUsers).where(eq(authUsers.email, email.toLowerCase())).limit(1);
  return result[0];
}

/**
 * Get auth user by username
 */
export async function getAuthUserByUsername(username: string): Promise<AuthUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(authUsers).where(eq(authUsers.username, username)).limit(1);
  return result[0];
}

/**
 * Get auth user by ID
 */
export async function getAuthUserById(id: number): Promise<AuthUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(authUsers).where(eq(authUsers.id, id)).limit(1);
  return result[0];
}

/**
 * Authenticate user (login)
 */
export async function authenticateUser(emailOrUsername: string, password: string): Promise<AuthUser | null> {
  const db = await getDb();
  if (!db) return null;

  // Try email first, then username
  let user = await getAuthUserByEmail(emailOrUsername);
  if (!user) {
    user = await getAuthUserByUsername(emailOrUsername);
  }

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Create a new session
 */
export async function createAuthSession(userId: number, expiresInDays: number = 30): Promise<AuthSession | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const token = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const result = await db.insert(authSessions).values({
      userId,
      token,
      expiresAt,
    });

    const sessions = await db.select().from(authSessions).where(eq(authSessions.token, token)).limit(1);
    return sessions[0] ?? null;
  } catch (error) {
    console.error("[Auth] Failed to create session:", error);
    return null;
  }
}

/**
 * Get session by token
 */
export async function getAuthSessionByToken(token: string): Promise<AuthSession | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(authSessions).where(eq(authSessions.token, token)).limit(1);
  const session = result[0];

  // Check if session is expired
  if (session && session.expiresAt < new Date()) {
    // Delete expired session
    await db.delete(authSessions).where(eq(authSessions.token, token));
    return undefined;
  }

  return session;
}

/**
 * Delete session by token
 */
export async function deleteAuthSession(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(authSessions).where(eq(authSessions.token, token));
    return true;
  } catch (error) {
    console.error("[Auth] Failed to delete session:", error);
    return false;
  }
}

/**
 * Get user by session token (convenience function)
 */
export async function getUserBySessionToken(token: string): Promise<AuthUser | null> {
  const session = await getAuthSessionByToken(token);
  if (!session) return null;

  const user = await getAuthUserById(session.userId);
  return user ?? null;
}
