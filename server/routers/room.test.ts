import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type CookieCall = {
  name: string;
  options: Record<string, unknown>;
};

function createAuthContext(userId: number = 1): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: {
      id: userId,
      openId: `test-user-room-${userId}`,
      email: `roomtest${userId}@example.com`,
      name: `Room Test User ${userId}`,
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("room.create", () => {
  it("creates a room successfully with valid input", async () => {
    const { ctx } = createAuthContext(9001);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.room.create({
      roomName: "Test Studio Session",
      description: "A test room for vitest",
      visibility: "private",
    });

    expect(result.success).toBe(true);
    expect(result.room).toBeDefined();
    expect(result.room.roomName).toBe("Test Studio Session");
    expect(result.room.description).toBe("A test room for vitest");
    expect(result.room.visibility).toBe("private");
    expect(result.room.status).toBe("idle");
    expect(result.room.hostUserId).toBe(9001);
    expect(result.room.id).toBeGreaterThan(0);
  });

  it("creates a public room", async () => {
    const { ctx } = createAuthContext(9002);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.room.create({
      roomName: "Public Jam",
      visibility: "public",
    });

    expect(result.success).toBe(true);
    expect(result.room.visibility).toBe("public");
    expect(result.room.roomName).toBe("Public Jam");
  });

  it("creates a room without description", async () => {
    const { ctx } = createAuthContext(9003);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.room.create({
      roomName: "No Description Room",
      visibility: "private",
    });

    expect(result.success).toBe(true);
    expect(result.room.description).toBeNull();
  });

  it("rejects empty room name", async () => {
    const { ctx } = createAuthContext(9004);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.room.create({
        roomName: "",
        visibility: "private",
      })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.room.create({
        roomName: "Unauthorized Room",
        visibility: "private",
      })
    ).rejects.toThrow();
  });
});

describe("room.getById", () => {
  it("retrieves a created room by ID", async () => {
    const { ctx } = createAuthContext(9005);
    const caller = appRouter.createCaller(ctx);

    // Create a room first
    const created = await caller.room.create({
      roomName: "Lookup Room",
      description: "For getById test",
      visibility: "public",
    });

    // Retrieve it
    const room = await caller.room.getById({ roomId: created.room.id });

    expect(room).toBeDefined();
    expect(room.id).toBe(created.room.id);
    expect(room.roomName).toBe("Lookup Room");
    expect(room.description).toBe("For getById test");
  });

  it("throws NOT_FOUND for non-existent room", async () => {
    const { ctx } = createAuthContext(9006);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.room.getById({ roomId: 999999 })
    ).rejects.toThrow();
  });
});

describe("room.myRooms", () => {
  it("returns rooms hosted by the authenticated user", async () => {
    const { ctx } = createAuthContext(9007);
    const caller = appRouter.createCaller(ctx);

    // Create two rooms
    await caller.room.create({
      roomName: "My Room 1",
      visibility: "private",
    });
    await caller.room.create({
      roomName: "My Room 2",
      visibility: "public",
    });

    const myRooms = await caller.room.myRooms();

    expect(myRooms.length).toBeGreaterThanOrEqual(2);
    const names = myRooms.map((r) => r.roomName);
    expect(names).toContain("My Room 1");
    expect(names).toContain("My Room 2");
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.room.myRooms()).rejects.toThrow();
  });
});
