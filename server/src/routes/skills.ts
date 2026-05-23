import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/skills/categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });

    return res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

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
            cardImageUrl: true,
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
      photo: skill.user.cardImageUrl || skill.user.avatarUrl || '',
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

// POST /api/skills
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      type,
      categoryId,
      categoryName,
      images,
    } = req.body as {
      title?: string;
      description?: string;
      type?: string;
      categoryId?: string;
      categoryName?: string;
      images?: string[];
    };

    if (!title || !description) {
      return res.status(400).json({ message: 'Название и описание обязательны' });
    }

    let resolvedCategoryId = categoryId;

    if (!resolvedCategoryId && categoryName) {
      const normalized = categoryName.trim();
      if (normalized.length > 0) {
        const category = await prisma.category.upsert({
          where: { name: normalized },
          create: { name: normalized },
          update: {},
          select: { id: true },
        });

        resolvedCategoryId = category.id;
      }
    }

    if (!resolvedCategoryId) {
      const fallback = await prisma.category.upsert({
        where: { name: 'Общее' },
        create: { name: 'Общее' },
        update: {},
        select: { id: true },
      });
      resolvedCategoryId = fallback.id;
    }

    const skill = await prisma.skill.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        type: type === 'LEARN' ? 'LEARN' : 'TEACH',
        categoryId: resolvedCategoryId,
        userId,
        images: Array.isArray(images) ? images.filter((v) => typeof v === 'string') : [],
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
