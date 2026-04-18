import { Router, Response } from "express";
import prisma from "../prisma";
import { AuthRequest, authenticateToken } from "../middleware/auth";
import { getIo } from "../socket";

const router = Router();

router.get("/:peerId", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { peerId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof peerId !== "string" || !peerId) {
      return res.status(400).json({ message: "peerId is required" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: peerId },
          { senderId: peerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return res.json(messages);
  } catch (error) {
    console.error("Get conversation error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const senderId = req.user?.id;
    const { receiverId, text } = req.body;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof receiverId !== "string" || !receiverId || !text || typeof text !== "string") {
      return res.status(400).json({ message: "receiverId and text are required" });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
    });

    const io = getIo();
    io.to(`user:${receiverId}`).emit("chat:new_message", message);
    io.to(`user:${receiverId}`).emit("notify:new", {
      type: "chat",
      senderId,
      text,
      createdAt: message.createdAt,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
