import { Router, Response } from "express";
import prisma from "../prisma";
import { AuthRequest, authenticateToken } from "../middleware/auth";

const router = Router();

const buildUserProfile = async (userId: string, includeNotifications: boolean) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      moderationStatus: true,
      fullName: true,
      gender: true,
      birthdate: true,
      bio: true,
      avatarUrl: true,
      cardImageUrl: true,
      offerTags: true,
      seekTags: true,
      isPrivate: true,
      location: true,
      rating: true,
      createdAt: true,
      skills: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const [activeExchanges, totalSkills, notifications] = await Promise.all([
    prisma.offerExchange.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    }),
    prisma.skill.count({ where: { userId } }),
    includeNotifications
      ? prisma.notification.count({ where: { userId, readAt: null } })
      : Promise.resolve(0),
  ]);

  return {
    ...user,
    skills: user.skills.map((skill) => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      type: skill.type,
      categoryName: skill.category.name,
    })),
    stats: {
      activeExchanges,
      totalSkills,
      reputation: user.rating,
      notifications,
    },
  };
};

router.get("/catalog", async (_req, res): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        moderationStatus: "APPROVED",
      },
      select: {
        id: true,
        fullName: true,
        gender: true,
        avatarUrl: true,
        cardImageUrl: true,
        location: true,
        offerTags: true,
        seekTags: true,
        bio: true,
        email: true,
        createdAt: true,
        skills: {
          select: {
            title: true,
            description: true,
            images: true,
            category: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mapped = users.map((user, index) => {
      const primarySkill = user.skills[0];
      const fallbackTag = user.offerTags[0] || user.seekTags[0] || "Навык не указан";

      return {
        id: user.id,
        name: user.fullName,
        gender: (user.gender || "unspecified").toLowerCase(),
        photo: user.avatarUrl?.startsWith("/uploads/avatars/") ? user.avatarUrl : "",
        from: user.location || "",
        skill: primarySkill?.title || fallbackTag,
        need_subcat: [],
        cat_text: primarySkill?.category?.name || "Общее",
        sub_text: primarySkill?.title || fallbackTag,
        categoryId: 0,
        subCategoryId: 0,
        description: primarySkill?.description || user.bio || "",
        images: user.cardImageUrl
          ? [user.cardImageUrl, ...(primarySkill?.images || [])]
          : user.avatarUrl?.startsWith("/uploads/skills/")
            ? [user.avatarUrl, ...(primarySkill?.images || [])]
            : (primarySkill?.images || []),
        birthdate: "",
        email: user.email,
        created_at: user.createdAt.toISOString(),
        about: user.bio || "",
        likedByMe: false,
        random: index,
      };
    });

    return res.json(mapped);
  } catch (error) {
    console.error("Get catalog users error:", error);
    return res.status(500).json({ message: "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°" });
  }
});

router.get("/me", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await buildUserProfile(userId, true);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°" });
  }
});

router.get("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;

    const user = await buildUserProfile(id, false);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).json({ message: "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°" });
  }
});

router.put("/me", authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { fullName, email, gender, birthdate, bio, location, avatarUrl, cardImageUrl, offerTags, seekTags, isPrivate } = req.body;

    const parsedBirthdate = typeof birthdate === "string" && birthdate.trim().length > 0
      ? new Date(birthdate)
      : undefined;

    if (parsedBirthdate && Number.isNaN(parsedBirthdate.getTime())) {
      return res.status(400).json({ message: "РќРµРєРѕСЂСЂРµРєС‚РЅР°СЏ РґР°С‚Р° СЂРѕР¶РґРµРЅРёСЏ" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(typeof fullName === "string" ? { fullName } : {}),
        ...(typeof email === "string" ? { email } : {}),
        ...(typeof gender === "string" ? { gender } : {}),
        ...(parsedBirthdate ? { birthdate: parsedBirthdate } : {}),
        ...(typeof bio === "string" ? { bio } : {}),
        ...(typeof location === "string" ? { location } : {}),
        ...(typeof avatarUrl === "string" ? { avatarUrl } : {}),
        ...(typeof cardImageUrl === "string" ? { cardImageUrl } : {}),
        ...(Array.isArray(offerTags) ? { offerTags: offerTags.filter((tag) => typeof tag === "string") } : {}),
        ...(Array.isArray(seekTags) ? { seekTags: seekTags.filter((tag) => typeof tag === "string") } : {}),
        ...(typeof isPrivate === "boolean" ? { isPrivate } : {}),
      },
    });

    const updated = await buildUserProfile(userId, true);

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Update current user error:", error);
    return res.status(500).json({ message: "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°" });
  }
});

export default router;



