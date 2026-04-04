import { eq } from "drizzle-orm";
import { profiles, Profile, InsertProfile } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create a new user profile
 */
export async function createProfile(data: {
  userId: number;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  creatorRole: string;
}): Promise<Profile | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(profiles).values({
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
      creatorRole: data.creatorRole,
      isProfileComplete: 1,
    });

    const createdProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, data.userId))
      .limit(1);

    return createdProfiles[0] || null;
  } catch (error) {
    console.error("[Profile] Failed to create profile:", error);
    return null;
  }
}

/**
 * Get profile by user ID
 */
export async function getProfileByUserId(userId: number): Promise<Profile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result[0];
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: number,
  data: Partial<{
    displayName: string;
    bio: string;
    avatarUrl: string;
    creatorRole: string;
  }>
): Promise<Profile | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: Record<string, any> = {};

    if (data.displayName !== undefined) {
      updateData.displayName = data.displayName;
    }
    if (data.bio !== undefined) {
      updateData.bio = data.bio;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }
    if (data.creatorRole !== undefined) {
      updateData.creatorRole = data.creatorRole;
    }

    if (Object.keys(updateData).length === 0) {
      const profile = await getProfileByUserId(userId);
    return profile || null;
    }

    await db.update(profiles).set(updateData).where(eq(profiles.userId, userId));

    const profile = await getProfileByUserId(userId);
    return profile || null;
  } catch (error) {
    console.error("[Profile] Failed to update profile:", error);
    return null;
  }
}

/**
 * Check if profile exists for user
 */
export async function profileExists(userId: number): Promise<boolean> {
  const profile = await getProfileByUserId(userId);
  return !!profile;
}
