import { describe, it, expect } from "vitest";
import { validatePhone, isPhoneEnabled } from "./validatePhone";

// ─── validatePhone ───────────────────────────────────────────────────────────

describe("validatePhone", () => {

  // Empty / blank
  describe("empty input", () => {
    it("returns required error for empty string", () => {
      expect(validatePhone("")).toBe("Phone number is required");
    });

    it("returns required error for whitespace only", () => {
      expect(validatePhone("   ")).toBe("Phone number is required");
    });
  });

  // Too short (< 3 digits)
  describe("too short", () => {
    it("returns format error for 1 digit", () => {
      expect(validatePhone("1")).toBe("Please enter valid phone format");
    });

    it("returns format error for 2 digits", () => {
      expect(validatePhone("12")).toBe("Please enter valid phone format");
    });

    it("returns format error for 2 digits with spaces", () => {
      expect(validatePhone("1 2")).toBe("Please enter valid phone format");
    });
  });

  // Valid range (3–13 digits)
  describe("valid input", () => {
    it("returns no error for exactly 3 digits", () => {
      expect(validatePhone("123")).toBe("");
    });

    it("returns no error for 7 digits", () => {
      expect(validatePhone("1234567")).toBe("");
    });

    it("returns no error for exactly 13 digits", () => {
      expect(validatePhone("1234567890123")).toBe("");
    });

    it("returns no error for digits with spaces", () => {
      expect(validatePhone("123 456 7890")).toBe("");
    });

    it("returns no error for digits with dashes", () => {
      expect(validatePhone("123-456-7890")).toBe("");
    });

    it("returns no error for digits with plus prefix", () => {
      expect(validatePhone("+1234567890")).toBe("");
    });
  });

  // Too long (> 13 digits)
  describe("too long", () => {
    it("returns format error for 14 digits", () => {
      expect(validatePhone("12345678901234")).toBe("Please enter valid phone format");
    });

    it("returns format error for 20 digits", () => {
      expect(validatePhone("12345678901234567890")).toBe("Please enter valid phone format");
    });
  });
});

// ─── isPhoneEnabled ──────────────────────────────────────────────────────────

describe("isPhoneEnabled", () => {

  // Disabled cases
  describe("button disabled", () => {
    it("returns false for empty string", () => {
      expect(isPhoneEnabled("")).toBe(false);
    });

    it("returns false for 1 digit", () => {
      expect(isPhoneEnabled("1")).toBe(false);
    });

    it("returns false for 2 digits", () => {
      expect(isPhoneEnabled("12")).toBe(false);
    });

    it("returns false for exactly 3 digits", () => {
      expect(isPhoneEnabled("123")).toBe(false);
    });

    it("returns false for 14 digits", () => {
      expect(isPhoneEnabled("12345678901234")).toBe(false);
    });

    it("returns false for 20 digits", () => {
      expect(isPhoneEnabled("12345678901234567890")).toBe(false);
    });
  });

  // Enabled cases
  describe("button enabled", () => {
    it("returns true for exactly 4 digits", () => {
      expect(isPhoneEnabled("1234")).toBe(true);
    });

    it("returns true for 10 digits", () => {
      expect(isPhoneEnabled("1234567890")).toBe(true);
    });

    it("returns true for exactly 13 digits", () => {
      expect(isPhoneEnabled("1234567890123")).toBe(true);
    });

    it("returns true for 10 digits with dashes", () => {
      expect(isPhoneEnabled("123-456-7890")).toBe(true);
    });

    it("returns true for digits with plus prefix", () => {
      expect(isPhoneEnabled("+1234567890")).toBe(true);
    });
  });
});
