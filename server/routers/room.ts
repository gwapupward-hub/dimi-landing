import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { createRoom, getRoomById, getRoomsByHostId } from "../room-db";
import { TRPCError } from "@trpc/server";

export const roomRouter = router({
  /**
   * Create a new room. Authenticated user becomes the host.
   */
  create: protectedProcedure
    .input(
      z.object({
        roomName: z
          .string()
          .min(1, "Room name is required")
          .max(100, "Room name must be 100 characters or fewer"),
        description: z
          .string()
          .max(500, "Description must be 500 characters or fewer")
          .optional(),
        visibility: z.enum(["public", "private"] as const),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const room = await createRoom({
        hostUserId: ctx.user.id,
        roomName: input.roomName,
        description: input.description ?? null,
        visibility: input.visibility,
      });

      if (!room) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create room",
        });
      }

      return {
        success: true,
        room,
      };
    }),

  /**
   * Get a room by ID.
   */
  getById: publicProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      const room = await getRoomById(input.roomId);

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      return room;
    }),

  /**
   * Get rooms hosted by the authenticated user.
   */
  myRooms: protectedProcedure.query(async ({ ctx }) => {
    return getRoomsByHostId(ctx.user.id);
  }),
});
