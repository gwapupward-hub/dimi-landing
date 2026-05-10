import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { creators, sessions } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const profilesRouter = router({
  getByHandle: publicProcedure
    .input(z.object({ handle: z.string().min(1).max(32) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }
      const result = await db
        .select()
        .from(creators)
        .where(eq(creators.handle, input.handle))
        .limit(1);
      if (result.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
      }
      return result[0];
    }),

  getSessionsByCreator: publicProcedure
    .input(z.object({ creatorId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(sessions)
        .where(eq(sessions.producerId, input.creatorId))
        .orderBy(sessions.isLive);
    }),
});
