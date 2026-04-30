import { describe, it, expect } from "vitest";
import { maskEmail } from "./maskEmail"; // adjust path as needed

// ─────────────────────────────────────────────────────────────
// maskEmail — Full Unit Test Suite
// ─────────────────────────────────────────────────────────────

describe("maskEmail", () => {

  // ── 1. Normal / Happy Path ──────────────────────────────────

  describe("normal emails", () => {
    it("masks middle characters, keeps first and last of local part", () => {
      expect(maskEmail("roberts@yopmail.com")).toBe("r*****s@yopmail.com");
    });

    it("masks a typical gmail address", () => {
      expect(maskEmail("alice@gmail.com")).toBe("a***e@gmail.com");
    });

    it("masks a longer local part correctly", () => {
      expect(maskEmail("johnsmith@example.com")).toBe("j*******h@example.com");
    });

    it("preserves the full domain after @", () => {
      const result = maskEmail("user@mydomain.org");
      expect(result.split("@")[1]).toBe("mydomain.org");
    });

    it("asterisk count equals local length minus 2", () => {
      const email = "abcde@test.com"; // local = "abcde" (5 chars) → 3 asterisks
      expect(maskEmail(email)).toBe("a***e@test.com");
    });
  });

  // ── 2. Edge Cases — Local Part Length ──────────────────────

  describe("local part length edge cases", () => {
    it("returns unchanged when local part is 1 character", () => {
      expect(maskEmail("a@example.com")).toBe("a@example.com");
    });

    it("masks second char when local part is exactly 2 characters", () => {
      expect(maskEmail("ab@example.com")).toBe("a*@example.com");
    });

    it("masks only middle char when local part is exactly 3 characters", () => {
      expect(maskEmail("abc@example.com")).toBe("a*c@example.com");
    });

    it("correctly handles 4-character local part", () => {
      expect(maskEmail("abcd@example.com")).toBe("a**d@example.com");
    });
  });

  // ── 3. Special Characters in Local Part ────────────────────

  describe("special characters in local part", () => {
    it("handles dot in local part", () => {
      expect(maskEmail("john.doe@example.com")).toBe("j*******e@example.com");
    });

    it("handles plus sign (email alias) in local part", () => {
      expect(maskEmail("john+filter@example.com")).toBe("j**********r@example.com");
    });

    it("handles underscore in local part", () => {
      expect(maskEmail("john_doe@example.com")).toBe("j*******e@example.com");
    });

    it("handles hyphen in local part", () => {
      expect(maskEmail("john-doe@example.com")).toBe("j*******e@example.com");
    });

    it("handles numeric local part", () => {
      expect(maskEmail("12345@example.com")).toBe("1***5@example.com");
    });

    it("handles mixed alphanumeric local part", () => {
      expect(maskEmail("u5er99@example.com")).toBe("u****9@example.com");
    });
  });

  // ── 4. Domain Variations ────────────────────────────────────

  describe("domain variations", () => {
    it("handles subdomain in domain part", () => {
      expect(maskEmail("user@mail.company.com")).toBe("u**r@mail.company.com");
    });

    it("handles country-code TLD (.co.uk)", () => {
      expect(maskEmail("john@example.co.uk")).toBe("j**n@example.co.uk");
    });

    it("handles new TLDs (.io, .dev, .ai)", () => {
      expect(maskEmail("dev@startup.io")).toBe("d**@startup.io");
    });

    it("preserves domain case as-is", () => {
      expect(maskEmail("user@MyDomain.COM")).toBe("u**r@MyDomain.COM");
    });
  });

  // ── 5. Invalid / Malformed Input ───────────────────────────

  describe("invalid or malformed input", () => {
    it("returns the input unchanged if there is no @ symbol", () => {
      expect(maskEmail("notanemail")).toBe("notanemail");
    });

    it("returns empty string when given an empty string", () => {
      expect(maskEmail("")).toBe("");
    });

    it("returns input unchanged when only @ is present", () => {
      expect(maskEmail("@")).toBe("@");
    });

    it("handles missing local part (starts with @)", () => {
      // local = "", domain = "domain.com" → no masking possible
      expect(maskEmail("@domain.com")).toBe("@domain.com");
    });

    it("handles missing domain part (ends with @)", () => {
      // local = "user", domain = "" → still masks local
      expect(maskEmail("user@")).toBe("u**r@");
    });
  });

  // ── 6. Unusual But Valid Input ──────────────────────────────

  describe("unusual but valid input", () => {
    it("handles uppercase local part", () => {
      expect(maskEmail("ROBERTS@yopmail.com")).toBe("R*****S@yopmail.com");
    });

    it("handles mixed-case local part", () => {
      expect(maskEmail("JohnDoe@example.com")).toBe("J*****e@example.com");
    });

    it("handles very long local part", () => {
      const local = "a" + "b".repeat(48) + "z"; // 50 chars
      const email = `${local}@example.com`;
      const result = maskEmail(email);
      expect(result).toBe(`a${"*".repeat(48)}z@example.com`);
    });

    it("handles single character domain label", () => {
      expect(maskEmail("user@x.com")).toBe("u**r@x.com");
    });
  });

  // ── 7. Return Type & Structure ──────────────────────────────

  describe("return value structure", () => {
    it("always returns a string", () => {
      expect(typeof maskEmail("test@example.com")).toBe("string");
    });

    it("always contains exactly one @ in result for valid emails", () => {
      const result = maskEmail("hello@world.com");
      expect(result.split("@").length - 1).toBe(1);
    });

    it("masked result has the same total length as original email", () => {
      const email = "roberts@yopmail.com";
      expect(maskEmail(email).length).toBe(email.length);
    });

    it("result starts with the first character of the original local part", () => {
      const email = "alice@gmail.com";
      expect(maskEmail(email)[0]).toBe("a");
    });

    it("character before @ matches last character of original local part", () => {
      const email = "alice@gmail.com";
      const result = maskEmail(email);
      const localResult = result.split("@")[0];
      expect(localResult[localResult.length - 1]).toBe("e");
    });

    it("middle section of local part contains only asterisks", () => {
      const result = maskEmail("roberts@yopmail.com");
      const localPart = result.split("@")[0]; // "r*****s"
      const middle = localPart.slice(1, -1);
      expect(/^\*+$/.test(middle)).toBe(true);
    });
  });

});
