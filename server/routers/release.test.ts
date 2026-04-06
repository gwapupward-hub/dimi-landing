import { describe, it, expect, vi, beforeEach } from "vitest";
import { releaseRouter } from "./release";
import * as releaseDb from "../release-db";
import * as db from "../db";

// Mock the release-db module
vi.mock("../release-db", () => ({
  getReleaseBySessionId: vi.fn(),
  getReleaseById: vi.fn(),
  createRelease: vi.fn(),
  getContributorsByReleaseId: vi.fn(),
  createContributor: vi.fn(),
  updateContributorSplits: vi.fn(),
  signContributor: vi.fn(),
  allContributorsSigned: vi.fn(),
  updateReleaseStatus: vi.fn(),
}));

// Mock the db module (for getSessionById)
vi.mock("../db", () => ({
  getSessionById: vi.fn(),
  getDb: vi.fn(),
}));

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

const mockRelease = {
  id: 1,
  sessionId: 1,
  title: "Dark Side of Midnight",
  genre: "Trap / Soul",
  bpm: 142,
  musicalKey: "F# Minor",
  duration: "3:47",
  status: "pending_signatures" as const,
  proofHash: null,
  lockedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockContributors = [
  {
    id: 1,
    releaseId: 1,
    name: "Metro Luz",
    handle: "@metroluz",
    role: "Producer",
    splitPercent: 50,
    hasSigned: 1,
    signedAt: new Date(),
    avatarColor: "#2EE62E",
    avatarInitials: "ML",
    isHost: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    releaseId: 1,
    name: "KayDee",
    handle: "@kaydee",
    role: "Co-Producer",
    splitPercent: 30,
    hasSigned: 1,
    signedAt: new Date(),
    avatarColor: "#F5A623",
    avatarInitials: "KD",
    isHost: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    releaseId: 1,
    name: "Ari Lennox",
    handle: "@arilennox",
    role: "Vocalist",
    splitPercent: 20,
    hasSigned: 0,
    signedAt: null,
    avatarColor: "#3DD6C8",
    avatarInitials: "AL",
    isHost: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Release Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBySession", () => {
    it("should return release with contributors for a valid session", async () => {
      vi.mocked(db.getSessionById).mockResolvedValue(mockSession);
      vi.mocked(releaseDb.getReleaseBySessionId).mockResolvedValue(mockRelease);
      vi.mocked(releaseDb.getContributorsByReleaseId).mockResolvedValue(mockContributors);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.getBySession({ sessionId: 1 });
      expect(result.session).toEqual(mockSession);
      expect(result.release).toEqual(mockRelease);
      expect(result.contributors).toHaveLength(3);
      expect(result.contributors[0].name).toBe("Metro Luz");
    });

    it("should throw NOT_FOUND for invalid session", async () => {
      vi.mocked(db.getSessionById).mockResolvedValue(undefined);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      await expect(caller.getBySession({ sessionId: 999 })).rejects.toThrow(
        "Session not found"
      );
    });

    it("should return null release when session has no release", async () => {
      vi.mocked(db.getSessionById).mockResolvedValue(mockSession);
      vi.mocked(releaseDb.getReleaseBySessionId).mockResolvedValue(undefined);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: null,
      });

      const result = await caller.getBySession({ sessionId: 1 });
      expect(result.release).toBeNull();
      expect(result.contributors).toEqual([]);
    });
  });

  describe("sign", () => {
    it("should sign a contributor and check all-signed status", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue(mockRelease);
      vi.mocked(releaseDb.signContributor).mockResolvedValue(undefined);
      vi.mocked(releaseDb.allContributorsSigned).mockResolvedValue(false);
      vi.mocked(releaseDb.getContributorsByReleaseId).mockResolvedValue(mockContributors);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      const result = await caller.sign({ releaseId: 1, contributorId: 3 });
      expect(releaseDb.signContributor).toHaveBeenCalledWith(3);
      expect(result.allSigned).toBe(false);
    });

    it("should update release status when all contributors sign", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue(mockRelease);
      vi.mocked(releaseDb.signContributor).mockResolvedValue(undefined);
      vi.mocked(releaseDb.allContributorsSigned).mockResolvedValue(true);
      vi.mocked(releaseDb.getContributorsByReleaseId).mockResolvedValue(mockContributors);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      const result = await caller.sign({ releaseId: 1, contributorId: 3 });
      expect(releaseDb.updateReleaseStatus).toHaveBeenCalledWith(1, "all_signed");
      expect(result.allSigned).toBe(true);
    });

    it("should reject signing on a locked release", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue({
        ...mockRelease,
        status: "locked",
      });

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      await expect(
        caller.sign({ releaseId: 1, contributorId: 3 })
      ).rejects.toThrow("Release is already locked");
    });
  });

  describe("lock", () => {
    it("should lock a release when all contributors have signed", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue({
        ...mockRelease,
        status: "all_signed",
      });
      vi.mocked(releaseDb.allContributorsSigned).mockResolvedValue(true);
      vi.mocked(releaseDb.updateReleaseStatus).mockResolvedValue(undefined);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      await caller.lock({ releaseId: 1, proofHash: "abc123" });
      expect(releaseDb.updateReleaseStatus).toHaveBeenCalledWith(1, "locked", "abc123");
    });

    it("should reject locking when not all contributors have signed", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue(mockRelease);
      vi.mocked(releaseDb.allContributorsSigned).mockResolvedValue(false);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      await expect(
        caller.lock({ releaseId: 1, proofHash: "abc123" })
      ).rejects.toThrow("All contributors must sign before locking");
    });
  });

  describe("updateSplits", () => {
    it("should update splits on an unlocked release", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue(mockRelease);
      vi.mocked(releaseDb.updateContributorSplits).mockResolvedValue(undefined);
      vi.mocked(releaseDb.getContributorsByReleaseId).mockResolvedValue(mockContributors);

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      const result = await caller.updateSplits({
        releaseId: 1,
        splits: [
          { contributorId: 1, splitPercent: 40 },
          { contributorId: 2, splitPercent: 35 },
          { contributorId: 3, splitPercent: 25 },
        ],
      });

      expect(result.success).toBe(true);
      expect(releaseDb.updateContributorSplits).toHaveBeenCalled();
    });

    it("should reject split updates on a locked release", async () => {
      vi.mocked(releaseDb.getReleaseById).mockResolvedValue({
        ...mockRelease,
        status: "locked",
      });

      const caller = releaseRouter.createCaller({
        req: {} as any,
        res: {} as any,
        user: { id: "user1", openId: "open1", name: "Test", role: "user" },
      });

      await expect(
        caller.updateSplits({
          releaseId: 1,
          splits: [{ contributorId: 1, splitPercent: 40 }],
        })
      ).rejects.toThrow("Cannot update splits on a locked release");
    });
  });
});
