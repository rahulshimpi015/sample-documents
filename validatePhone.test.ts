import { describe, it, expect } from "vitest";
import { validatePhone, isPhoneEnabled } from "./validatePhone";

// ─── validatePhone ───────────────────────────────────────────────────────────

describe("validatePhone", () => {

  describe("empty input", () => {
    it("returns required error for empty string", () =>
      expect(validatePhone("")).toBe("Phone number is required"));

    it("returns required error for undefined-like empty", () =>
      expect(validatePhone("")).toBe("Phone number is required"));
  });

  describe("too short (< 4 digits)", () => {
    it("returns format error for 1 digit", () =>
      expect(validatePhone("1")).toBe("Please enter valid phone format"));

    it("returns format error for 2 digits", () =>
      expect(validatePhone("12")).toBe("Please enter valid phone format"));

    it("returns format error for exactly 3 digits", () =>
      expect(validatePhone("123")).toBe("Please enter valid phone format"));
  });

  describe("valid range (4–13 digits)", () => {
    it("returns no error for exactly 4 digits", () =>
      expect(validatePhone("1234")).toBe(""));

    it("returns no error for 7 digits", () =>
      expect(validatePhone("1234567")).toBe(""));

    it("returns no error for 10 digits", () =>
      expect(validatePhone("1234567890")).toBe(""));

    it("returns no error for exactly 13 digits", () =>
      expect(validatePhone("1234567890123")).toBe(""));
  });

  describe("too long (> 13 digits)", () => {
    it("returns format error for 14 digits", () =>
      expect(validatePhone("12345678901234")).toBe("Please enter valid phone format"));

    it("returns format error for 20 digits", () =>
      expect(validatePhone("12345678901234567890")).toBe("Please enter valid phone format"));
  });
});

// ─── isPhoneEnabled — now derived from validatePhone ─────────────────────────

describe("isPhoneEnabled", () => {

  describe("returns false (button disabled)", () => {
    it("empty string",  () => expect(isPhoneEnabled("")).toBe(false));
    it("1 digit",       () => expect(isPhoneEnabled("1")).toBe(false));
    it("2 digits",      () => expect(isPhoneEnabled("12")).toBe(false));
    it("3 digits",      () => expect(isPhoneEnabled("123")).toBe(false));
    it("14 digits",     () => expect(isPhoneEnabled("12345678901234")).toBe(false));
    it("20 digits",     () => expect(isPhoneEnabled("12345678901234567890")).toBe(false));
  });

  describe("returns true (button enabled)", () => {
    it("exactly 4 digits",  () => expect(isPhoneEnabled("1234")).toBe(true));
    it("10 digits",         () => expect(isPhoneEnabled("1234567890")).toBe(true));
    it("exactly 13 digits", () => expect(isPhoneEnabled("1234567890123")).toBe(true));
  });

  describe("consistent with validatePhone", () => {
    it("isPhoneEnabled returns true only when validatePhone returns empty string", () => {
      const cases = ["", "1", "123", "1234", "1234567890123", "12345678901234"];
      cases.forEach((val) => {
        expect(isPhoneEnabled(val)).toBe(validatePhone(val) === "");
      });
    });
  });
});
