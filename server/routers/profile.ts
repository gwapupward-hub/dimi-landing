import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createProfile, getProfileByUserId, updateProfile, profileExists } from "../profile-db";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

export const profileRouter = router({
  /**
   * Get current user's profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getProfileByUserId(ctx.user.id);
    return profile || null;
  }),

  /**
   * Create a new profile for the authenticated user
   */
  create: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(2).max(255),
        bio: z.string().max(500).optional(),
        creatorRole: z.string().min(1).max(100),
        avatarUrl: z.string().optional(),
        avatarPlaceholderId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if profile already exists
      const exists = await profileExists(ctx.user.id);
      if (exists) {
        throw new Error("Profile already exists for this user");
      }

      let finalAvatarUrl: string | undefined;

      // If avatar URL is provided (base64), upload it to S3
      if (input.avatarUrl && input.avatarUrl.startsWith("data:")) {
        try {
          // Convert base64 to buffer
          const base64Data = input.avatarUrl.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");

          // Upload to S3
          const fileKey = `avatars/${ctx.user.id}-${nanoid()}.png`;
          const result = await storagePut(fileKey, buffer, "image/png");
          finalAvatarUrl = result.url;
        } catch (error) {
          console.error("[Profile] Failed to upload avatar:", error);
          // Continue without avatar if upload fails
        }
      }

      const profile = await createProfile({
        userId: ctx.user.id,
        displayName: input.displayName,
        bio: input.bio,
        avatarUrl: finalAvatarUrl,
        creatorRole: input.creatorRole,
      });

      if (!profile) {
        throw new Error("Failed to create profile");
      }

      return profile;
    }),

  /**
   * Update user's profile
   */
  update: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(2).max(255).optional(),
        bio: z.string().max(500).optional(),
        creatorRole: z.string().min(1).max(100).optional(),
        avatarUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let finalAvatarUrl: string | undefined;

      // If avatar URL is provided (base64), upload it to S3
      if (input.avatarUrl && input.avatarUrl.startsWith("data:")) {
        try {
          const base64Data = input.avatarUrl.split(",")[1];
          const buffer = Buffer.from(base64Data, "base64");

          const fileKey = `avatars/${ctx.user.id}-${nanoid()}.png`;
          const result = await storagePut(fileKey, buffer, "image/png");
          finalAvatarUrl = result.url;
        } catch (error) {
          console.error("[Profile] Failed to upload avatar:", error);
        }
      }

      const updateData: any = {};
      if (input.displayName) updateData.displayName = input.displayName;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.creatorRole) updateData.creatorRole = input.creatorRole;
      if (finalAvatarUrl) updateData.avatarUrl = finalAvatarUrl;

      const profile = await updateProfile(ctx.user.id, updateData);

      if (!profile) {
        throw new Error("Failed to update profile");
      }

      return profile;
    }),
});
