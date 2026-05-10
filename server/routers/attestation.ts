import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { attestations } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const attestationRouter = router({
  record: protectedProcedure
    .input(
      z.object({
        releaseId: z.number().int().positive(),
        documentHash: z.string().length(64),
        txSignature: z.string().max(128).optional(),
        network: z.string().max(16).default("mainnet-beta"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }
      const result = await db.insert(attestations).values({
        releaseId: input.releaseId,
        documentHash: input.documentHash,
        txSignature: input.txSignature,
        network: input.network,
      });
      const insertId = result[0].insertId;
      const created = await db
        .select()
        .from(attestations)
        .where(eq(attestations.id, insertId))
        .limit(1);
      return created[0];
    }),

  getByRelease: protectedProcedure
    .input(z.object({ releaseId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(attestations)
        .where(eq(attestations.releaseId, input.releaseId))
        .orderBy(attestations.attestedAt);
    }),
});
