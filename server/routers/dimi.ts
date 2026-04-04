import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { createSession, getSessions, getSessionById, createCreator, getCreators, getCreatorByName, addToWaitlist, getWaitlist, createFile, getFilesByUserId } from "../db";
import { storagePut, storageGet } from "../storage";

export const dimiRouter = router({
  // Sessions
  sessions: router({
    list: publicProcedure.query(async () => {
      return getSessions();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getSessionById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        producerId: z.number(),
        genre: z.string().optional(),
        bpm: z.number().optional(),
        viewers: z.number().default(0),
        collaborators: z.number().default(0),
        isLive: z.number().default(0),
        color: z.string().default("#2EE62E"),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createSession(input);
      }),
  }),

  // Creators
  creators: router({
    list: publicProcedure.query(async () => {
      return getCreators();
    }),
    getByName: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input }) => {
        return getCreatorByName(input.name);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        genre: z.string().optional(),
        followers: z.number().default(0),
        isLive: z.number().default(0),
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return createCreator(input);
      }),
  }),

  // Waitlist
  waitlist: router({
    signup: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return addToWaitlist(input);
      }),
    list: protectedProcedure.query(async () => {
      return getWaitlist();
    }),
  }),

  // Files / Storage
  files: router({
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
        data: z.string(), // base64 encoded
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("User not authenticated");

        // Decode base64 data
        const buffer = Buffer.from(input.data, "base64");

        // Upload to storage
        const storageResult = await storagePut(
          `files/${ctx.user.id}/${Date.now()}-${input.fileName}`,
          buffer,
          input.mimeType
        );

        // Save metadata to database
        const fileRecord = await createFile({
          userId: ctx.user.id,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          storageKey: storageResult.key,
          storageUrl: storageResult.url,
          description: input.description,
        });

        return fileRecord;
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("User not authenticated");
      return getFilesByUserId(ctx.user.id);
    }),
    getDownloadUrl: protectedProcedure
      .input(z.object({ storageKey: z.string() }))
      .query(async ({ input }) => {
        return storageGet(input.storageKey);
      }),
  }),
});
