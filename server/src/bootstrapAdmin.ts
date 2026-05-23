import bcrypt from 'bcryptjs';
import prisma from './prisma';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@mail.ru').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_NAME = process.env.ADMIN_NAME || 'admin';

export const ensureAdminUser = async () => {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

  if (existing) {
    const isPasswordValid = await bcrypt.compare(ADMIN_PASSWORD, existing.passwordHash);

    if (existing.role !== 'ADMIN' || existing.moderationStatus !== 'APPROVED' || !isPasswordValid) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: 'ADMIN',
          moderationStatus: 'APPROVED',
          fullName: existing.fullName || ADMIN_NAME,
          passwordHash,
        },
      });
    }

    return;
  }

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      fullName: ADMIN_NAME,
      role: 'ADMIN',
      moderationStatus: 'APPROVED',
    },
  });
};
