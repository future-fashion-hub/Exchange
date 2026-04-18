import { Router, Response } from "express";
import prisma from "../prisma";
import { AuthRequest, authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/me", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        offerTags: true,
        seekTags: true,
        isPrivate: true,
        location: true,
        rating: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        offerTags: true,
        seekTags: true,
        isPrivate: true,
        location: true,
        rating: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.put("/me", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { fullName, bio, location, avatarUrl, offerTags, seekTags, isPrivate } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof fullName === "string" ? { fullName } : {}),
        ...(typeof bio === "string" ? { bio } : {}),
        ...(typeof location === "string" ? { location } : {}),
        ...(typeof avatarUrl === "string" ? { avatarUrl } : {}),
        ...(Array.isArray(offerTags) ? { offerTags: offerTags.filter((tag) => typeof tag === "string") } : {}),
        ...(Array.isArray(seekTags) ? { seekTags: seekTags.filter((tag) => typeof tag === "string") } : {}),
        ...(typeof isPrivate === "boolean" ? { isPrivate } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        offerTags: true,
        seekTags: true,
        isPrivate: true,
        location: true,
        rating: true,
        createdAt: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update current user error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
