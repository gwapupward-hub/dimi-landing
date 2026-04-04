import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { rooms, type InsertRoom, type Room } from "../drizzle/schema";

/**
 * Create a new room record.
 */
export async function createRoom(data: {
  hostUserId: number;
  roomName: string;
  description?: string | null;
  visibility: "public" | "private";
}): Promise<Room | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const values: InsertRoom = {
    hostUserId: data.hostUserId,
    roomName: data.roomName,
    description: data.description ?? null,
    visibility: data.visibility,
    status: "idle",
  };

  const result = await db.insert(rooms).values(values);
  const insertId = result[0].insertId;

  // Fetch and return the created room
  const created = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, insertId))
    .limit(1);

  return created.length > 0 ? created[0] : undefined;
}

/**
 * Get a room by its ID.
 */
export async function getRoomById(roomId: number): Promise<Room | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all rooms hosted by a specific user.
 */
export async function getRoomsByHostId(hostUserId: number): Promise<Room[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db
    .select()
    .from(rooms)
    .where(eq(rooms.hostUserId, hostUserId));
}
