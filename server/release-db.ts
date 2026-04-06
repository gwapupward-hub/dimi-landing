import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  releases,
  releaseContributors,
  type Release,
  type InsertRelease,
  type ReleaseContributor,
  type InsertReleaseContributor,
} from "../drizzle/schema";

/**
 * Get a release by session ID (each session has at most one release).
 */
export async function getReleaseBySessionId(
  sessionId: number
): Promise<Release | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(releases)
    .where(eq(releases.sessionId, sessionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get a release by its own ID.
 */
export async function getReleaseById(
  releaseId: number
): Promise<Release | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(releases)
    .where(eq(releases.id, releaseId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new release linked to a session.
 */
export async function createRelease(
  data: InsertRelease
): Promise<Release | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(releases).values(data);
  const insertId = result[0].insertId;

  const created = await db
    .select()
    .from(releases)
    .where(eq(releases.id, insertId))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

/**
 * Update release status.
 */
export async function updateReleaseStatus(
  releaseId: number,
  status: "draft" | "pending_signatures" | "all_signed" | "locked",
  proofHash?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = { status };
  if (status === "locked") {
    updateData.lockedAt = new Date();
  }
  if (proofHash) {
    updateData.proofHash = proofHash;
  }

  await db.update(releases).set(updateData).where(eq(releases.id, releaseId));
}

/**
 * Get all contributors for a release.
 */
export async function getContributorsByReleaseId(
  releaseId: number
): Promise<ReleaseContributor[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(releaseContributors)
    .where(eq(releaseContributors.releaseId, releaseId));
}

/**
 * Create a contributor for a release.
 */
export async function createContributor(
  data: InsertReleaseContributor
): Promise<ReleaseContributor | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(releaseContributors).values(data);
  const insertId = result[0].insertId;

  const created = await db
    .select()
    .from(releaseContributors)
    .where(eq(releaseContributors.id, insertId))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

/**
 * Update a contributor's split percentage.
 */
export async function updateContributorSplit(
  contributorId: number,
  splitPercent: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(releaseContributors)
    .set({ splitPercent })
    .where(eq(releaseContributors.id, contributorId));
}

/**
 * Batch update multiple contributor splits at once.
 */
export async function updateContributorSplits(
  updates: Array<{ contributorId: number; splitPercent: number }>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  for (const u of updates) {
    await db
      .update(releaseContributors)
      .set({ splitPercent: u.splitPercent })
      .where(eq(releaseContributors.id, u.contributorId));
  }
}

/**
 * Sign a contributor (mark as signed).
 */
export async function signContributor(contributorId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(releaseContributors)
    .set({ hasSigned: 1, signedAt: new Date() })
    .where(eq(releaseContributors.id, contributorId));
}

/**
 * Check if all contributors for a release have signed.
 */
export async function allContributorsSigned(
  releaseId: number
): Promise<boolean> {
  const contributors = await getContributorsByReleaseId(releaseId);
  if (contributors.length === 0) return false;
  return contributors.every((c) => c.hasSigned === 1);
}

/**
 * Get all releases (for listing).
 */
export async function getAllReleases(): Promise<Release[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(releases).orderBy(releases.createdAt);
}
