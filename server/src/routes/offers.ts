import { Router, Response } from "express";
import prisma from "../prisma";
import { AuthRequest, authenticateToken } from "../middleware/auth";
import { createNotification } from "../services/notifications";

const router = Router();

type OfferWithUsers = {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    cardImageUrl: string | null;
  };
  receiver: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    cardImageUrl: string | null;
  };
};

const toDto = (offer: OfferWithUsers, currentUserId: string) => {
  const direction = offer.receiverId === currentUserId ? "incoming" : "outgoing";
  const peer = direction === "incoming" ? offer.sender : offer.receiver;

  return {
    id: offer.id,
    senderId: offer.senderId,
    receiverId: offer.receiverId,
    status: offer.status,
    createdAt: offer.createdAt.toISOString(),
    updatedAt: offer.updatedAt.toISOString(),
    direction,
    peer: {
      id: peer.id,
      fullName: peer.fullName,
      email: peer.email,
      avatarUrl: peer.avatarUrl,
      cardImageUrl: peer.cardImageUrl,
    },
  };
};

router.get("/me", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offers = await prisma.offerExchange.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mapped = offers.map((offer) => toDto(offer as OfferWithUsers, userId));

    return res.json({
      incoming: mapped.filter((item) => item.direction === "incoming"),
      outgoing: mapped.filter((item) => item.direction === "outgoing"),
      accepted: mapped.filter((item) => item.status === "ACCEPTED"),
    });
  } catch (error) {
    console.error("Get my offers error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const senderId = req.user?.id;
    const { receiverId } = req.body;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof receiverId !== "string" || !receiverId.trim()) {
      return res.status(400).json({ message: "receiverId is required" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Нельзя создать обмен с самим собой" });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        cardImageUrl: true,
      },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Получатель не найден" });
    }

    const existingPending = await prisma.offerExchange.findFirst({
      where: {
        status: "PENDING",
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingPending) {
      return res.status(409).json({ message: "Запрос обмена уже отправлен и ожидает решения" });
    }

    const created = await prisma.offerExchange.create({
      data: {
        senderId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
      },
    });

    await createNotification({
      userId: receiverId,
      type: "CHAT_MESSAGE",
      title: "Новый запрос на обмен",
      message: `${created.sender.fullName} предложил(а) вам обмен`,
    });

    return res.status(201).json(toDto(created as OfferWithUsers, senderId));
  } catch (error) {
    console.error("Create offer error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.patch("/:id/decision", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const { action } = req.body as { action?: "approve" | "reject" };

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ message: "Offer id is required" });
    }

    if (action !== "approve" && action !== "reject") {
      return res.status(400).json({ message: "Action must be approve or reject" });
    }

    const offer = await prisma.offerExchange.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
      },
    });

    if (!offer) {
      return res.status(404).json({ message: "Обмен не найден" });
    }

    if (offer.receiverId !== userId) {
      return res.status(403).json({ message: "Только получатель может принять или отклонить обмен" });
    }

    if (offer.status !== "PENDING") {
      return res.status(400).json({ message: "Решение уже принято" });
    }

    const nextStatus = action === "approve" ? "ACCEPTED" : "REJECTED";

    const updated = await prisma.offerExchange.update({
      where: { id },
      data: { status: nextStatus },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            cardImageUrl: true,
          },
        },
      },
    });

    const updatedWithUsers = updated as OfferWithUsers;

    await createNotification({
      userId: updated.senderId,
      type: "CHAT_MESSAGE",
      title: nextStatus === "ACCEPTED" ? "Запрос обмена принят" : "Запрос обмена отклонен",
      message:
        nextStatus === "ACCEPTED"
          ? `${updatedWithUsers.receiver.fullName} принял(а) ваш обмен. Можно перейти в чат.`
          : `${updatedWithUsers.receiver.fullName} отклонил(а) ваш обмен.`,
    });

    return res.json(toDto(updatedWithUsers, userId));
  } catch (error) {
    console.error("Offer decision error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
