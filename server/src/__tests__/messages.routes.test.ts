import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  message: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
};

const emitMock = vi.fn();
const toMock = vi.fn(() => ({ emit: emitMock }));
const getIoMock = vi.fn(() => ({ to: toMock }));
const createNotificationMock = vi.fn();

vi.mock("../prisma", () => ({
  default: prismaMock,
}));

vi.mock("../socket", () => ({
  getIo: getIoMock,
}));

vi.mock("../services/notifications", () => ({
  createNotification: createNotificationMock,
}));

import messagesRoutes from "../routes/messages";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/messages", messagesRoutes);
  return app;
};

const authHeader = (payload: { id: string; role: string; email: string }) => {
  const token = jwt.sign(payload, "secret123");
  return { Authorization: `Bearer ${token}` };
};

describe("messages routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC_CHAT_01: returns conversation for two users", async () => {
    prismaMock.message.findMany.mockResolvedValue([
      {
        id: "msg-1",
        senderId: "user-1",
        receiverId: "peer-1",
        text: "hello",
        createdAt: new Date("2026-01-01T10:00:00.000Z"),
        readAt: null,
      },
    ]);

    const app = createApp();
    const response = await request(app)
      .get("/api/messages/peer-1")
      .set(authHeader({ id: "user-1", role: "USER", email: "user@test.ru" }));

    expect(response.status).toBe(200);
    expect(prismaMock.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { senderId: "user-1", receiverId: "peer-1" },
            { senderId: "peer-1", receiverId: "user-1" },
          ],
        },
      }),
    );
    expect(response.body).toHaveLength(1);
  });

  it("TC_CHAT_02: validates send payload", async () => {
    const app = createApp();
    const response = await request(app)
      .post("/api/messages")
      .set(authHeader({ id: "user-1", role: "USER", email: "user@test.ru" }))
      .send({ receiverId: "", text: "" });

    expect(response.status).toBe(400);
    expect(prismaMock.message.create).not.toHaveBeenCalled();
  });

  it("TC_CHAT_03: sends message, emits socket event and creates notification", async () => {
    prismaMock.message.create.mockResolvedValue({
      id: "msg-2",
      senderId: "user-1",
      receiverId: "peer-1",
      text: "new message",
      createdAt: new Date("2026-01-01T10:01:00.000Z"),
      readAt: null,
    });
    createNotificationMock.mockResolvedValue({ id: "notif-1" });

    const app = createApp();
    const response = await request(app)
      .post("/api/messages")
      .set(authHeader({ id: "user-1", role: "USER", email: "user@test.ru" }))
      .send({ receiverId: "peer-1", text: "new message" });

    expect(response.status).toBe(201);
    expect(getIoMock).toHaveBeenCalled();
    expect(toMock).toHaveBeenCalledWith("user:peer-1");
    expect(emitMock).toHaveBeenCalledWith(
      "chat:new_message",
      expect.objectContaining({ id: "msg-2", text: "new message" }),
    );
    expect(createNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "peer-1",
        type: "CHAT_MESSAGE",
      }),
    );
  });
});

