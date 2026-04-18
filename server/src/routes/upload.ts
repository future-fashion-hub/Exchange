import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import prisma from "../prisma";
import { AuthRequest, authenticateToken } from "../middleware/auth";

const router = Router();

const uploadsRoot = path.join(process.cwd(), "uploads");
const avatarsDir = path.join(uploadsRoot, "avatars");
const skillsDir = path.join(uploadsRoot, "skills");

for (const dir of [uploadsRoot, avatarsDir, skillsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAvatar = req.path.includes("avatar");
    cb(null, isAvatar ? avatarsDir : skillsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeExt = ext || ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images are allowed"));
      return;
    }

    cb(null, true);
  },
});

router.post("/avatar", authenticateToken, upload.single("image"), async (req: AuthRequest, res): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return res.status(201).json({ avatarUrl });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/skill-image", authenticateToken, upload.single("image"), async (req, res): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/uploads/skills/${req.file.filename}`;
    return res.status(201).json({ imageUrl });
  } catch (error) {
    console.error("Upload skill image error:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
