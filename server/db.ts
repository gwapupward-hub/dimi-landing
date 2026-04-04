import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, sessions, creators, waitlist, files, Session, Creator, Waitlist, File, InsertSession, InsertCreator, InsertWaitlist, InsertFile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// DIMI Sessions queries
export async function createSession(data: InsertSession): Promise<Session | null> {
  const db = await getDb();
  if (!db) return null;
  await db.insert(sessions).values(data);
  const result = await db.select().from(sessions).orderBy(sessions.createdAt);
  return result[result.length - 1] ?? null;
}

export async function getSessions(): Promise<Session[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sessions).orderBy(sessions.createdAt);
}

export async function getSessionById(id: number): Promise<Session | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
  return result[0];
}

// DIMI Creators queries
export async function createCreator(data: InsertCreator): Promise<Creator | null> {
  const db = await getDb();
  if (!db) return null;
  await db.insert(creators).values(data);
  const result = await getCreatorByName(data.name);
  return result ?? null;
}

export async function getCreators(): Promise<Creator[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(creators).orderBy(creators.createdAt);
}

export async function getCreatorByName(name: string): Promise<Creator | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(creators).where(eq(creators.name, name)).limit(1);
  return result[0];
}

// DIMI Waitlist queries
export async function addToWaitlist(data: InsertWaitlist): Promise<Waitlist | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.insert(waitlist).values(data);
    const result = await getWaitlistByEmail(data.email);
    return result ?? null;
  } catch (error) {
    console.warn("[Database] Email already on waitlist or error:", error);
    return null;
  }
}

export async function getWaitlist(): Promise<Waitlist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(waitlist).orderBy(waitlist.signedUpAt);
}

export async function getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(waitlist).where(eq(waitlist.email, email)).limit(1);
  return result[0];
}

// DIMI Files queries
export async function createFile(data: InsertFile): Promise<File | null> {
  const db = await getDb();
  if (!db) return null;
  await db.insert(files).values(data);
  const result = await db.select().from(files).orderBy(files.createdAt);
  return result[result.length - 1] ?? null;
}

export async function getFilesByUserId(userId: number): Promise<File[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(files).where(eq(files.userId, userId)).orderBy(files.createdAt);
}

export async function getFileById(id: number): Promise<File | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(files).where(eq(files.id, id)).limit(1);
  return result[0];
}
