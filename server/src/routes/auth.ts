import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { createNotification } from '../services/notifications';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@mail.ru').trim().toLowerCase();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, fullName } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    if (normalizedEmail === ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Регистрация администратора запрещена' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName,
        moderationStatus: 'PENDING',
      },
    });

    await createNotification({
      userId: newUser.id,
      type: 'ACCOUNT_ON_MODERATION',
      title: 'Аккаунт отправлен на модерацию',
      message: 'Ваша карточка отправлена модератору и станет доступна в каталоге после подтверждения.',
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, role: newUser.role, fullName: newUser.fullName } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

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
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Auth me error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
