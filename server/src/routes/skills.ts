import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, type } = req.query;

    const whereClause: any = {};
    if (search) {
      whereClause.title = { contains: String(search), mode: 'insensitive' };
    }
    if (category) {
      whereClause.categoryId = String(category);
    }
    if (type) {
      whereClause.type = String(type).toUpperCase();
    }

    const skills = await prisma.skill.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            rating: true,
            avatarUrl: true,
            bio: true,
            location: true,
            email: true,
            createdAt: true,
          },
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Temporary compatibility shape for existing frontend user cards.
    const mappedUsers = skills.map((skill, index) => ({
      id: skill.user.id,
      name: skill.user.fullName,
      gender: 'unspecified',
      photo: skill.user.avatarUrl || '',
      from: skill.user.location || '',
      skill: skill.title,
      need_subcat: [],
      cat_text: skill.category.name,
      sub_text: skill.title,
      categoryId: 0,
      subCategoryId: 0,
      description: skill.description,
      images: skill.images,
      birthdate: '2000-01-01',
      email: skill.user.email,
      created_at: skill.user.createdAt.toISOString(),
      about: skill.user.bio || '',
      likedByMe: false,
      random: index,
    }));

    res.json(mappedUsers);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
