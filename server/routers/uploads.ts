import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { createUploadUrl } from "../storage/s3";
import { getDb } from "../db";
import { stems } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const uploadsRouter = router({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        sessionId: z.number().int().positive(),
        fileName: z.string().min(1).max(255),
        fileType: z.string().min(1).max(64),
        fileSizeBytes: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await createUploadUrl(input.sessionId, input.fileName, input.fileType);
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Failed to create upload URL",
        });
      }
    }),

  confirmUpload: protectedProcedure
    .input(
      z.object({
        sessionId: z.number().int().positive(),
        name: z.string().min(1).max(255),
        s3Key: z.string().min(1).max(512),
        s3Url: z.string().min(1).max(1024),
        fileType: z.string().min(1).max(64),
        fileSizeBytes: z.number().int().positive(),
        durationSeconds: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const result = await db.insert(stems).values({
        sessionId: input.sessionId,
        uploadedBy: ctx.user.id,
        name: input.name,
        s3Key: input.s3Key,
        s3Url: input.s3Url,
        fileType: input.fileType,
        fileSizeBytes: input.fileSizeBytes,
        durationSeconds: input.durationSeconds,
      });
      const insertId = result[0].insertId;

      const created = await db.select().from(stems).where(eq(stems.id, insertId)).limit(1);
      return created[0];
    }),

  listStems: protectedProcedure
    .input(z.object({ sessionId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(stems).where(eq(stems.sessionId, input.sessionId));
    }),
});
