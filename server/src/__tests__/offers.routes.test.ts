import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock, createNotificationMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
    offerExchange: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
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

import offersRoutes from "../routes/offers";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/offers", offersRoutes);
  return app;
};

const authHeader = (payload: { id: string; role: string; email: string }) => {
  const token = jwt.sign(payload, "secret123");
  return { Authorization: `Bearer ${token}` };
};

describe("offers routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC_EXCHANGE_01: rejects self exchange request", async () => {
    const app = createApp();
    const response = await request(app)
      .post("/api/offers")
      .set(authHeader({ id: "user-1", role: "USER", email: "user@test.ru" }))
      .send({ receiverId: "user-1" });

    expect(response.status).toBe(400);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("TC_EXCHANGE_02: rejects duplicate pending exchange", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "receiver-1",
      fullName: "Receiver",
      email: "receiver@test.ru",
      avatarUrl: null,
      cardImageUrl: null,
    });
    prismaMock.offerExchange.findFirst.mockResolvedValue({
      id: "pending-1",
      status: "PENDING",
    });

    const app = createApp();
    const response = await request(app)
      .post("/api/offers")
      .set(authHeader({ id: "sender-1", role: "USER", email: "sender@test.ru" }))
      .send({ receiverId: "receiver-1" });

    expect(response.status).toBe(409);
  });

  it("TC_EXCHANGE_03: forbids decision by non-receiver", async () => {
    prismaMock.offerExchange.findUnique.mockResolvedValue({
      id: "offer-1",
      senderId: "sender-1",
      receiverId: "receiver-1",
      status: "PENDING",
      sender: {
        id: "sender-1",
        fullName: "Sender",
        email: "sender@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
      receiver: {
        id: "receiver-1",
        fullName: "Receiver",
        email: "receiver@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
    });

    const app = createApp();
    const response = await request(app)
      .patch("/api/offers/offer-1/decision")
      .set(authHeader({ id: "other-1", role: "USER", email: "other@test.ru" }))
      .send({ action: "approve" });

    expect(response.status).toBe(403);
    expect(prismaMock.offerExchange.update).not.toHaveBeenCalled();
  });

  it("TC_EXCHANGE_04: approves incoming exchange for receiver", async () => {
    prismaMock.offerExchange.findUnique.mockResolvedValue({
      id: "offer-1",
      senderId: "sender-1",
      receiverId: "receiver-1",
      status: "PENDING",
      sender: {
        id: "sender-1",
        fullName: "Sender",
        email: "sender@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
      receiver: {
        id: "receiver-1",
        fullName: "Receiver",
        email: "receiver@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
    });

    prismaMock.offerExchange.update.mockResolvedValue({
      id: "offer-1",
      senderId: "sender-1",
      receiverId: "receiver-1",
      status: "ACCEPTED",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:05.000Z"),
      sender: {
        id: "sender-1",
        fullName: "Sender",
        email: "sender@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
      receiver: {
        id: "receiver-1",
        fullName: "Receiver",
        email: "receiver@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
    });
    createNotificationMock.mockResolvedValue({ id: "notification-1" });

    const app = createApp();
    const response = await request(app)
      .patch("/api/offers/offer-1/decision")
      .set(authHeader({ id: "receiver-1", role: "USER", email: "receiver@test.ru" }))
      .send({ action: "approve" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: "offer-1",
        status: "ACCEPTED",
        direction: "incoming",
      }),
    );
    expect(createNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "sender-1",
      }),
    );
  });

  it("TC_EXCHANGE_05: returns grouped exchange lists for current user", async () => {
    prismaMock.offerExchange.findMany.mockResolvedValue([
      {
        id: "offer-in",
        senderId: "sender-1",
        receiverId: "me-1",
        status: "PENDING",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        sender: {
          id: "sender-1",
          fullName: "Sender",
          email: "sender@test.ru",
          avatarUrl: null,
          cardImageUrl: null,
        },
        receiver: {
          id: "me-1",
          fullName: "Me",
          email: "me@test.ru",
          avatarUrl: null,
          cardImageUrl: null,
        },
      },
      {
        id: "offer-accepted",
        senderId: "me-1",
        receiverId: "receiver-1",
        status: "ACCEPTED",
        createdAt: new Date("2026-01-01T00:00:10.000Z"),
        updatedAt: new Date("2026-01-01T00:00:10.000Z"),
        sender: {
          id: "me-1",
          fullName: "Me",
          email: "me@test.ru",
          avatarUrl: null,
          cardImageUrl: null,
        },
        receiver: {
          id: "receiver-1",
          fullName: "Receiver",
          email: "receiver@test.ru",
          avatarUrl: null,
          cardImageUrl: null,
        },
      },
    ]);

    const app = createApp();
    const response = await request(app)
      .get("/api/offers/me")
      .set(authHeader({ id: "me-1", role: "USER", email: "me@test.ru" }));

    expect(response.status).toBe(200);
    expect(response.body.incoming).toHaveLength(1);
    expect(response.body.outgoing).toHaveLength(1);
    expect(response.body.accepted).toHaveLength(1);
    expect(response.body.accepted[0]).toEqual(
      expect.objectContaining({ id: "offer-accepted", status: "ACCEPTED" }),
    );
  });

  it("TC_EXCHANGE_06: rejects invalid decision action", async () => {
    const app = createApp();
    const response = await request(app)
      .patch("/api/offers/offer-1/decision")
      .set(authHeader({ id: "receiver-1", role: "USER", email: "receiver@test.ru" }))
      .send({ action: "unknown" });

    expect(response.status).toBe(400);
    expect(prismaMock.offerExchange.findUnique).not.toHaveBeenCalled();
  });

  it("TC_EXCHANGE_07: rejects decision for already processed exchange", async () => {
    prismaMock.offerExchange.findUnique.mockResolvedValue({
      id: "offer-1",
      senderId: "sender-1",
      receiverId: "receiver-1",
      status: "ACCEPTED",
      sender: {
        id: "sender-1",
        fullName: "Sender",
        email: "sender@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
      receiver: {
        id: "receiver-1",
        fullName: "Receiver",
        email: "receiver@test.ru",
        avatarUrl: null,
        cardImageUrl: null,
      },
    });

    const app = createApp();
    const response = await request(app)
      .patch("/api/offers/offer-1/decision")
      .set(authHeader({ id: "receiver-1", role: "USER", email: "receiver@test.ru" }))
      .send({ action: "approve" });

    expect(response.status).toBe(400);
    expect(prismaMock.offerExchange.update).not.toHaveBeenCalled();
  });
});
