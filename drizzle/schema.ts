import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * DIMI Sessions table - stores live music production sessions
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  producerId: int("producerId").notNull(),
  genre: varchar("genre", { length: 100 }),
  bpm: int("bpm"),
  viewers: int("viewers").default(0).notNull(),
  collaborators: int("collaborators").default(0).notNull(),
  isLive: int("isLive").default(0).notNull(),
  color: varchar("color", { length: 7 }).default("#2EE62E").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * DIMI Creators table - stores producer/creator profiles
 */
export const creators = mysqlTable("creators", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  genre: varchar("genre", { length: 100 }),
  followers: int("followers").default(0).notNull(),
  isLive: int("isLive").default(0).notNull(),
  bio: text("bio"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = typeof creators.$inferInsert;

/**
 * DIMI Waitlist table - stores early access email signups
 */
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  signedUpAt: timestamp("signedUpAt").defaultNow().notNull(),
  notified: int("notified").default(0).notNull(),
  notifiedAt: timestamp("notifiedAt"),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;

/**
 * DIMI Files table - stores uploaded files metadata
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize").notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 500 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

/**
 * DIMI Auth Users table - stores custom email/password authentication
 * Separate from OAuth users to support both auth methods
 */
export const authUsers = mysqlTable("auth_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AuthUser = typeof authUsers.$inferSelect;
export type InsertAuthUser = typeof authUsers.$inferInsert;

/**
 * DIMI Auth Sessions table - stores session tokens for custom auth
 */
export const authSessions = mysqlTable("auth_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuthSession = typeof authSessions.$inferSelect;
export type InsertAuthSession = typeof authSessions.$inferInsert;

/**
 * DIMI Profiles table - stores user profile information
 * Linked to authUsers for custom auth users
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  bio: text("bio"),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  creatorRole: varchar("creatorRole", { length: 100 }).default("producer").notNull(),
  isProfileComplete: int("isProfileComplete").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * DIMI Rooms table - stores collaboration room records
 */
export const rooms = mysqlTable("rooms", {
  id: int("id").autoincrement().primaryKey(),
  hostUserId: int("hostUserId").notNull(),
  roomName: varchar("roomName", { length: 100 }).notNull(),
  description: text("description"),
  visibility: mysqlEnum("visibility", ["public", "private"]).default("private").notNull(),
  status: mysqlEnum("status", ["idle", "live", "ended"]).default("idle").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

/**
 * DIMI Releases table - stores release/rights workspace data linked to sessions
 */
export const releases = mysqlTable("releases", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 100 }),
  bpm: int("bpm"),
  musicalKey: varchar("musicalKey", { length: 20 }),
  duration: varchar("duration", { length: 20 }),
  status: mysqlEnum("status", ["draft", "pending_signatures", "all_signed", "locked"]).default("draft").notNull(),
  lockedAt: timestamp("lockedAt"),
  proofHash: varchar("proofHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Release = typeof releases.$inferSelect;
export type InsertRelease = typeof releases.$inferInsert;

/**
 * DIMI Release Contributors table - stores contributor splits and signature status
 */
export const releaseContributors = mysqlTable("release_contributors", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  handle: varchar("handle", { length: 255 }),
  role: varchar("role", { length: 100 }).notNull(),
  splitPercent: int("splitPercent").default(0).notNull(),
  hasSigned: int("hasSigned").default(0).notNull(),
  signedAt: timestamp("signedAt"),
  avatarColor: varchar("avatarColor", { length: 7 }).default("#2EE62E").notNull(),
  avatarInitials: varchar("avatarInitials", { length: 4 }).default("??").notNull(),
  isHost: int("isHost").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReleaseContributor = typeof releaseContributors.$inferSelect;
export type InsertReleaseContributor = typeof releaseContributors.$inferInsert;
