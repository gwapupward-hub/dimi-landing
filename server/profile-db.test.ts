import { describe, it, expect } from "vitest";
import { createProfile, getProfileByUserId, updateProfile, profileExists } from "./profile-db";

describe("Profile Database Functions", () => {
  const testUserId = 9999 + Math.floor(Math.random() * 10000);

  it("should create a new profile", async () => {
    const profile = await createProfile({
      userId: testUserId,
      displayName: "Test Producer",
      bio: "Making beats since 2020",
      creatorRole: "producer",
    });

    expect(profile).toBeDefined();
    expect(profile?.displayName).toBe("Test Producer");
    expect(profile?.bio).toBe("Making beats since 2020");
    expect(profile?.creatorRole).toBe("producer");
    expect(profile?.isProfileComplete).toBe(1);
  });

  it("should retrieve profile by user ID", async () => {
    const profile = await getProfileByUserId(testUserId);

    expect(profile).toBeDefined();
    expect(profile?.userId).toBe(testUserId);
    expect(profile?.displayName).toBeDefined();
  });

  it("should check if profile exists", async () => {
    const exists = await profileExists(testUserId);
    expect(exists).toBe(true);
  });

  it("should handle non-existent profile check", async () => {
    const nonExistentId = 99999 + Math.floor(Math.random() * 10000);
    const exists = await profileExists(nonExistentId);
    expect(exists).toBe(false);
  });

  it("should update profile", async () => {
    const updated = await updateProfile(testUserId, {
      displayName: "Updated Producer",
      bio: "Updated bio",
    });

    expect(updated).toBeDefined();
    expect(updated?.displayName).toBe("Updated Producer");
    expect(updated?.bio).toBe("Updated bio");
  });


});
