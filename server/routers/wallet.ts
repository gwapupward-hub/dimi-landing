import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { creators } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

const GWAP_SCORE_API = process.env.GWAP_SCORE_API_URL ?? "https://api.gwapscore.xyz";

export const walletRouter = router({
  linkWallet: protectedProcedure
    .input(
      z.object({
        creatorId: z.number().int().positive(),
        walletAddress: z.string().min(32).max(44),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }
      await db
        .update(creators)
        .set({ walletAddress: input.walletAddress })
        .where(eq(creators.id, input.creatorId));
      return { success: true };
    }),

  refreshGwapScore: protectedProcedure
    .input(
      z.object({
        creatorId: z.number().int().positive(),
        walletAddress: z.string().min(32).max(44),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const res = await fetch(`${GWAP_SCORE_API}/v1/score/${input.walletAddress}`);
        if (!res.ok) {
          return { score: null, tier: null };
        }
        const data = (await res.json()) as { score?: number; tier?: string };
        const score = typeof data.score === "number" ? data.score : null;

        if (score !== null) {
          const db = await getDb();
          if (db) {
            await db.update(creators).set({ gwapScore: score }).where(eq(creators.id, input.creatorId));
          }
        }
        return { score, tier: data.tier ?? null };
      } catch (err) {
        console.warn("[wallet] refreshGwapScore failed:", err);
        return { score: null, tier: null };
      }
    }),
});
