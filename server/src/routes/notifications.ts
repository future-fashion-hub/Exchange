import { Router, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return res.json({
      userId,
      events: notifications.map((item) => ({
        id: item.id,
        type: item.type,
        seen: item.readAt ? 1 : 0,
        date: item.createdAt.toISOString(),
        title: item.title,
        message: item.message,
      })),
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.patch('/me/read-all', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Read all notifications error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
