import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    notification: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("../prisma", () => ({
  default: prismaMock,
}));

import notificationsRoutes from "../routes/notifications";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/notifications", notificationsRoutes);
  return app;
};

const authHeader = (payload: { id: string; role: string; email: string }) => {
  const token = jwt.sign(payload, "secret123");
  return { Authorization: `Bearer ${token}` };
};

describe("notifications routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC_NOTIFY_01: returns notifications mapped to events", async () => {
    prismaMock.notification.findMany.mockResolvedValue([
      {
        id: "n1",
        userId: "user-1",
        type: "CHAT_MESSAGE",
        title: "Новое сообщение",
        message: "Привет",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        readAt: null,
      },
      {
        id: "n2",
        userId: "user-1",
        type: "CHAT_MESSAGE",
        title: "Запрос",
        message: "Проверьте обмен",
        createdAt: new Date("2026-01-02T00:00:00.000Z"),
        readAt: new Date("2026-01-02T01:00:00.000Z"),
      },
    ]);

    const app = createApp();
    const response = await request(app)
      .get("/api/notifications/me")
      .set(authHeader({ id: "user-1", role: "USER", email: "user@test.ru" }));

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe("user-1");
    expect(response.body.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "n1", seen: 0 }),
        expect.objectContaining({ id: "n2", seen: 1 }),
      ]),
    );
  });

  it("TC_NOTIFY_02: marks all unread notifications as read", async () => {
    prismaMock.notification.updateMany.mockResolvedValue({ count: 3 });

    const app = createApp();
    const response = await request(app)
      .patch("/api/notifications/me/read-all")
      .set(authHeader({ id: "user-1", role: "USER", email: "user@test.ru" }))
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1", readAt: null },
      }),
    );
  });
});
