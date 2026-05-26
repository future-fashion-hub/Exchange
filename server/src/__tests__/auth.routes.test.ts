import bcrypt from "bcryptjs";
import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, createNotificationMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  createNotificationMock: vi.fn(),
}));

vi.mock("../prisma", () => ({
  default: prismaMock,
}));

vi.mock("../services/notifications", () => ({
  createNotification: createNotificationMock,
}));

import authRoutes from "../routes/auth";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  return app;
};

describe("auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC_AUTH_01: registers user with valid payload", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: "user-1",
      email: "new@test.ru",
      role: "USER",
      fullName: "New User",
    });
    createNotificationMock.mockResolvedValue({ id: "notification-1" });

    const app = createApp();
    const response = await request(app).post("/api/auth/register").send({
      email: "new@test.ru",
      password: "123456",
      fullName: "New User",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: "user-1",
          email: "new@test.ru",
          role: "USER",
        }),
      }),
    );
    expect(createNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        type: "ACCOUNT_ON_MODERATION",
      }),
    );
  });

  it("TC_AUTH_02: rejects registration for duplicate email", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "existing-user",
      email: "existing@test.ru",
    });

    const app = createApp();
    const response = await request(app).post("/api/auth/register").send({
      email: "existing@test.ru",
      password: "123456",
      fullName: "Existing User",
    });

    expect(response.status).toBe(400);
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it("TC_AUTH_03: rejects login with wrong password", async () => {
    const passwordHash = await bcrypt.hash("correct-pass", 10);
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "ivan@test.ru",
      role: "USER",
      fullName: "Ivan",
      passwordHash,
    });

    const app = createApp();
    const response = await request(app).post("/api/auth/login").send({
      email: "ivan@test.ru",
      password: "wrong-pass",
    });

    expect(response.status).toBe(401);
  });
});
