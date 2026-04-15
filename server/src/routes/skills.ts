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
        user: { select: { id: true, fullName: true, rating: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
