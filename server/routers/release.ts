import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getReleaseBySessionId,
  getReleaseById,
  createRelease,
  getContributorsByReleaseId,
  createContributor,
  updateContributorSplits,
  signContributor,
  allContributorsSigned,
  updateReleaseStatus,
} from "../release-db";
import { getSessionById } from "../db";
import { TRPCError } from "@trpc/server";

export const releaseRouter = router({
  /**
   * Get a release with its contributors by session ID.
   * Public so the page can load without auth (read-only view).
   */
  getBySession: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const session = await getSessionById(input.sessionId);
      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      const release = await getReleaseBySessionId(input.sessionId);
      if (!release) {
        return { session, release: null, contributors: [] };
      }

      const contributors = await getContributorsByReleaseId(release.id);
      return { session, release, contributors };
    }),

  /**
   * Create a release for a session (auto-creates from session data).
   * Protected — only authenticated users can create releases.
   */
  create: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        title: z.string().min(1).max(255),
        genre: z.string().max(100).optional(),
        bpm: z.number().int().min(1).max(999).optional(),
        musicalKey: z.string().max(20).optional(),
        duration: z.string().max(20).optional(),
        contributors: z
          .array(
            z.object({
              name: z.string().min(1).max(255),
              handle: z.string().max(255).optional(),
              role: z.string().min(1).max(100),
              splitPercent: z.number().int().min(0).max(100),
              avatarColor: z.string().max(7).optional(),
              avatarInitials: z.string().max(4).optional(),
              isHost: z.boolean().optional(),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ input }) => {
      // Check if release already exists for this session
      const existing = await getReleaseBySessionId(input.sessionId);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A release already exists for this session",
        });
      }

      const release = await createRelease({
        sessionId: input.sessionId,
        title: input.title,
        genre: input.genre ?? null,
        bpm: input.bpm ?? null,
        musicalKey: input.musicalKey ?? null,
        duration: input.duration ?? null,
        status: "pending_signatures",
      });

      if (!release) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create release",
        });
      }

      // Create contributors
      for (const c of input.contributors) {
        await createContributor({
          releaseId: release.id,
          name: c.name,
          handle: c.handle ?? null,
          role: c.role,
          splitPercent: c.splitPercent,
          avatarColor: c.avatarColor ?? "#2EE62E",
          avatarInitials: c.avatarInitials ?? c.name.substring(0, 2).toUpperCase(),
          isHost: c.isHost ? 1 : 0,
        });
      }

      const contributors = await getContributorsByReleaseId(release.id);
      return { release, contributors };
    }),

  /**
   * Update split percentages for contributors.
   * Protected — only authenticated users can update splits.
   */
  updateSplits: protectedProcedure
    .input(
      z.object({
        releaseId: z.number(),
        splits: z.array(
          z.object({
            contributorId: z.number(),
            splitPercent: z.number().int().min(0).max(100),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const release = await getReleaseById(input.releaseId);
      if (!release) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Release not found",
        });
      }

      if (release.status === "locked") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update splits on a locked release",
        });
      }

      await updateContributorSplits(input.splits);

      const contributors = await getContributorsByReleaseId(input.releaseId);
      return { success: true, contributors };
    }),

  /**
   * Sign a contributor on a release.
   * Protected — only authenticated users can sign.
   */
  sign: protectedProcedure
    .input(
      z.object({
        releaseId: z.number(),
        contributorId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const release = await getReleaseById(input.releaseId);
      if (!release) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Release not found",
        });
      }

      if (release.status === "locked") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Release is already locked",
        });
      }

      await signContributor(input.contributorId);

      // Check if all contributors have signed
      const allSigned = await allContributorsSigned(input.releaseId);
      if (allSigned) {
        await updateReleaseStatus(input.releaseId, "all_signed");
      }

      const contributors = await getContributorsByReleaseId(input.releaseId);
      const updatedRelease = await getReleaseById(input.releaseId);
      return { release: updatedRelease, contributors, allSigned };
    }),

  /**
   * Lock a release (write proof hash).
   * Protected — only authenticated users can lock.
   */
  lock: protectedProcedure
    .input(
      z.object({
        releaseId: z.number(),
        proofHash: z.string().min(1).max(128),
      })
    )
    .mutation(async ({ input }) => {
      const release = await getReleaseById(input.releaseId);
      if (!release) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Release not found",
        });
      }

      if (release.status === "locked") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Release is already locked",
        });
      }

      const allSigned = await allContributorsSigned(input.releaseId);
      if (!allSigned) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "All contributors must sign before locking",
        });
      }

      await updateReleaseStatus(input.releaseId, "locked", input.proofHash);

      const updatedRelease = await getReleaseById(input.releaseId);
      return { release: updatedRelease };
    }),
});
