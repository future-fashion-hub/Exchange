import { Router, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest, authenticateToken, requireAdmin } from '../middleware/auth';
import { createNotification } from '../services/notifications';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/moderation', async (_req: AuthRequest, res: Response): Promise<any> => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        role: 'USER',
        moderationStatus: 'PENDING',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        offerTags: true,
        seekTags: true,
        location: true,
        bio: true,
        avatarUrl: true,
        cardImageUrl: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.json(pendingUsers);
  } catch (error) {
    console.error('Admin moderation list error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.patch('/moderation/:userId', async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const rawUserId = req.params.userId;
    const userId = typeof rawUserId === 'string' ? rawUserId : '';
    const { action } = req.body as { action?: 'approve' | 'reject' };

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ message: 'action must be approve or reject' });
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (target.role !== 'USER') {
      return res.status(400).json({ message: 'Можно модерировать только обычных пользователей' });
    }

    const moderationStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { moderationStatus },
      select: {
        id: true,
        fullName: true,
        email: true,
        moderationStatus: true,
      },
    });

    await createNotification({
      userId,
      type: action === 'approve' ? 'ACCOUNT_APPROVED' : 'ACCOUNT_REJECTED',
      title: action === 'approve' ? 'Карточка подтверждена' : 'Карточка отклонена',
      message:
        action === 'approve'
          ? 'Модератор подтвердил вашу карточку. Теперь вы отображаетесь в каталоге.'
          : 'Модератор отклонил вашу карточку. Проверьте профиль и отправьте снова после правок.',
    });

    return res.json(updated);
  } catch (error) {
    console.error('Admin moderation decision error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
