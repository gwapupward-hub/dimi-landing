import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { createAuthUser, authenticateUser, createAuthSession, deleteAuthSession, getAuthUserByEmail, getAuthUserByUsername } from "../auth-db";
import { profileExists } from "../profile-db";
import { TRPCError } from "@trpc/server";

const AUTH_COOKIE_NAME = "dimi_auth_token";

export const authRouter = router({
  /**
   * Sign up - create new account
   */
  signup: publicProcedure
    .input(z.object({
      email: z.string().email("Invalid email format"),
      username: z.string().min(3, "Username must be at least 3 characters").max(100),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Validate passwords match
      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      // Check if email already exists
      const existingEmail = await getAuthUserByEmail(input.email);
      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Check if username already exists
      const existingUsername = await getAuthUserByUsername(input.username);
      if (existingUsername) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      // Create user
      const user = await createAuthUser({
        email: input.email,
        username: input.username,
        password: input.password,
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account",
        });
      }

      // Create session
      const session = await createAuthSession(user.id);
      if (!session) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create session",
        });
      }

      // Set session cookie
      ctx.res.cookie(AUTH_COOKIE_NAME, session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Check if user has completed profile
      const hasProfile = await profileExists(user.id);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        hasProfile,
      };
    }),

  /**
   * Login - authenticate existing user
   */
  login: publicProcedure
    .input(z.object({
      emailOrUsername: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await authenticateUser(input.emailOrUsername, input.password);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email/username or password",
        });
      }

      // Create session
      const session = await createAuthSession(user.id);
      if (!session) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create session",
        });
      }

      // Set session cookie
      ctx.res.cookie(AUTH_COOKIE_NAME, session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Check if user has completed profile
      const hasProfile = await profileExists(user.id);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        hasProfile,
      };
    }),

  /**
   * Logout - destroy session
   */
  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      const token = ctx.req.cookies?.[AUTH_COOKIE_NAME];
      if (token) {
        await deleteAuthSession(token);
      }

      ctx.res.clearCookie(AUTH_COOKIE_NAME);

      return { success: true };
    }),

  /**
   * Get current user
   */
  me: publicProcedure
    .query(async ({ ctx }) => {
      const token = ctx.req.cookies?.[AUTH_COOKIE_NAME];
      if (!token) {
        return null;
      }

      // This would require importing the auth-db function
      // For now, return null - will be implemented in context
      return null;
    }),
});

export { AUTH_COOKIE_NAME };
