import prisma from '../prisma';
import { getIo } from '../socket';

type NotificationPayload = {
  userId: string;
  type: 'ACCOUNT_ON_MODERATION' | 'ACCOUNT_APPROVED' | 'ACCOUNT_REJECTED' | 'CHAT_MESSAGE';
  title: string;
  message: string;
};

export const createNotification = async ({ userId, type, title, message }: NotificationPayload) => {
  const created = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });

  try {
    const io = getIo();
    io.to(`user:${userId}`).emit('notify:new', {
      id: created.id,
      type: created.type,
      title: created.title,
      message: created.message,
      createdAt: created.createdAt,
      readAt: created.readAt,
    });
  } catch {
    // Socket may be unavailable during bootstrap or tests.
  }

  return created;
};
