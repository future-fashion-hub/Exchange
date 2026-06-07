import { describe, expect, it } from "vitest";
import type { TUser } from "../api/types";
import { canViewCatalog } from "./catalogAccess";

const makeUser = (overrides: Partial<TUser> = {}): TUser => ({
  id: "user-1",
  name: "Test User",
  role: "USER",
  moderationStatus: "APPROVED",
  gender: "unspecified",
  photo: "",
  from: "",
  skill: "",
  need_subcat: [],
  cat_text: "",
  sub_text: "",
  categoryId: 0,
  subCategoryId: 0,
  description: "",
  images: [],
  birthdate: "",
  email: "user@test.ru",
  created_at: "2026-01-01T00:00:00.000Z",
  about: "",
  likedByMe: false,
  random: 0,
  ...overrides,
});

describe("canViewCatalog", () => {
  it("allows guests to view catalog", () => {
    expect(canViewCatalog(null)).toBe(true);
  });

  it("allows approved users to view catalog", () => {
    expect(canViewCatalog(makeUser({ moderationStatus: "APPROVED" }))).toBe(true);
  });

  it("blocks users waiting for moderation", () => {
    expect(canViewCatalog(makeUser({ moderationStatus: "PENDING" }))).toBe(false);
  });

  it("blocks rejected users", () => {
    expect(canViewCatalog(makeUser({ moderationStatus: "REJECTED" }))).toBe(false);
  });

  it("allows admin regardless of moderation status", () => {
    expect(canViewCatalog(makeUser({ role: "ADMIN", moderationStatus: "PENDING" }))).toBe(true);
  });
});
