import { describe, it, expect } from "vitest";
import { validateResendApiKey } from "./email";

describe("Email Service - Resend Integration", () => {
  it("should have a valid Resend API key configured", async () => {
    const isValid = await validateResendApiKey();
    expect(isValid).toBe(true);
  });
});
