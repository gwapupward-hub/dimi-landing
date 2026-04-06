import { describe, it, expect, vi, beforeEach } from "vitest";
import { dimiRouter } from "./dimi";
import * as db from "../db";

// Mock the database module
vi.mock("../db", () => ({
  getSessions: vi.fn(),
  getSessionById: vi.fn(),
  createSession: vi.fn(),
  getCreators: vi.fn(),
  getCreatorByName: vi.fn(),
  createCreator: vi.fn(),
  addToWaitlist: vi.fn(),
  getWaitlist: vi.fn(),
  getWaitlistByEmail: vi.fn(),
  createFile: vi.fn(),
  getFilesByUserId: vi.fn(),
}));

// Mock the email module
vi.mock("../email", () => ({
  sendWaitlistConfirmation: vi.fn().mockResolvedValue(true),
}));

// Mock the notification module
vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the storage module
vi.mock("../storage", () => ({
  storagePut: vi.fn(),
  storageGet: vi.fn(),
}));

describe("DIMI Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Sessions", () => {
    it("should list all sessions", async () => {
      const mockSessions = [
        {
          id: 1,
          title: "Midnite Bounce v3",
          producerId: 1,
          genre: "Trap / Soul",
          bpm: 142,
          viewers: 1247,
          collaborators: 3,
          isLive: 1,
          color: "#2EE62E",
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getSessions).mockResolvedValue(mockSessions);

      const caller = dimiRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.sessions.list();
      expect(result).toEqual(mockSessions);
      expect(db.getSessions).toHaveBeenCalled();
    });

    it("should get session by id", async () => {
      const mockSession = {
        id: 1,
        title: "Midnite Bounce v3",
        producerId: 1,
        genre: "Trap / Soul",
        bpm: 142,
        viewers: 1247,
        collaborators: 3,
        isLive: 1,
        color: "#2EE62E",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getSessionById).mockResolvedValue(mockSession);

      const caller = dimiRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.sessions.getById({ id: 1 });
      expect(result).toEqual(mockSession);
      expect(db.getSessionById).toHaveBeenCalledWith(1);
    });
  });

  describe("Creators", () => {
    it("should list all creators", async () => {
      const mockCreators = [
        {
          id: 1,
          name: "PapiGwap",
          genre: "Trap / Soul",
          followers: 12400,
          isLive: 1,
          bio: "Producer",
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getCreators).mockResolvedValue(mockCreators);

      const caller = dimiRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.creators.list();
      expect(result).toEqual(mockCreators);
      expect(db.getCreators).toHaveBeenCalled();
    });

    it("should get creator by name", async () => {
      const mockCreator = {
        id: 1,
        name: "PapiGwap",
        genre: "Trap / Soul",
        followers: 12400,
        isLive: 1,
        bio: "Producer",
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getCreatorByName).mockResolvedValue(mockCreator);

      const caller = dimiRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.creators.getByName({ name: "PapiGwap" });
      expect(result).toEqual(mockCreator);
      expect(db.getCreatorByName).toHaveBeenCalledWith("PapiGwap");
    });
  });

  describe("Waitlist", () => {
    it("should add email to waitlist", async () => {
      const mockWaitlistEntry = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        signedUpAt: new Date(),
        notified: 0,
        notifiedAt: null,
      };

      // No existing email (not a duplicate)
      vi.mocked(db.getWaitlistByEmail).mockResolvedValue(null);
      vi.mocked(db.addToWaitlist).mockResolvedValue(mockWaitlistEntry);

      const caller = dimiRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.waitlist.signup({
        email: "test@example.com",
        name: "Test User",
      });

      expect(result.success).toBe(true);
      expect(result.duplicate).toBe(false);
      expect(result.message).toContain("in");
      expect(db.getWaitlistByEmail).toHaveBeenCalledWith("test@example.com");
      expect(db.addToWaitlist).toHaveBeenCalled();
    });

    it("should validate email format", async () => {
      const caller = dimiRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      expect(async () => {
        await caller.waitlist.signup({
          email: "invalid-email",
          name: "Test",
        });
      }).rejects.toThrow();
    });
  });
});
