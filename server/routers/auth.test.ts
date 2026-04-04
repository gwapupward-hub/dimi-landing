import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

describe("Auth Router - Profile Completion Enforcement", () => {
  const testPassword = "TestPassword123!";

  // Mock context for testing
  const createMockContext = (): TrpcContext => {
    const cookies: Record<string, string> = {};
    return {
      user: null,
      req: {
        cookies,
        protocol: "https",
        headers: {},
      } as any,
      res: {
        cookie: (name: string, value: string, options: any) => {
          cookies[name] = value;
        },
        clearCookie: (name: string) => {
          delete cookies[name];
        },
      } as any,
    };
  };

  describe("signup endpoint", () => {
    it("should return hasProfile=false for new user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.signup({
        email: `test-${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
        password: testPassword,
        confirmPassword: testPassword,
      });

      expect(result.success).toBe(true);
      expect(result.hasProfile).toBe(false);
      expect(result.user.email).toBeDefined();
      expect(result.user.username).toBeDefined();
    });
  });

  describe("login endpoint", () => {
    it("should return hasProfile=false for user without profile", async () => {
      const email = `login-test-${Date.now()}@example.com`;
      const username = `loginuser_${Date.now()}`;

      // First create a user
      const signupCtx = createMockContext();
      const signupCaller = appRouter.createCaller(signupCtx);

      await signupCaller.auth.signup({
        email,
        username,
        password: testPassword,
        confirmPassword: testPassword,
      });

      // Then login with username
      const loginCtx = createMockContext();
      const loginCaller = appRouter.createCaller(loginCtx);

      const loginResult = await loginCaller.auth.login({
        emailOrUsername: username,
        password: testPassword,
      });

      // Should indicate no profile exists
      expect(loginResult.success).toBe(true);
      expect(loginResult.hasProfile).toBe(false);
    });

    it("should return hasProfile=true for user with profile", async () => {
      const email = `profile-test-${Date.now()}@example.com`;
      const username = `profileuser_${Date.now()}`;

      // Create user
      const signupCtx = createMockContext();
      const signupCaller = appRouter.createCaller(signupCtx);

      const signupResult = await signupCaller.auth.signup({
        email,
        username,
        password: testPassword,
        confirmPassword: testPassword,
      });

      // Create profile for this user
      const profileCtx = createMockContext();
      profileCtx.user = {
        id: signupResult.user.id,
        email: signupResult.user.email,
        username: signupResult.user.username,
      } as any;

      const profileCaller = appRouter.createCaller(profileCtx);

      await profileCaller.profile.create({
        displayName: "Test User",
        bio: "Test bio",
        creatorRole: "producer",
      });

      // Now login and check hasProfile
      const loginCtx = createMockContext();
      const loginCaller = appRouter.createCaller(loginCtx);

      const loginResult = await loginCaller.auth.login({
        emailOrUsername: username,
        password: testPassword,
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.hasProfile).toBe(true);
    });
  });
});
