import { NotificationTypes, TNotificationEvent } from "@api/types";

const normalize = (value: string) => value.toLowerCase();

const hasAny = (value: string, parts: string[]) =>
  parts.some((part) => value.includes(part));

export const getNotificationTargetPath = (event: TNotificationEvent): string | null => {
  if (event.type === NotificationTypes.ACCOUNT_ON_MODERATION) {
    return null;
  }

  if (
    event.type === NotificationTypes.ACCOUNT_APPROVED ||
    event.type === NotificationTypes.ACCOUNT_REJECTED
  ) {
    return "/profile";
  }

  if (event.type === NotificationTypes.CHAT_MESSAGE) {
    const text = normalize(`${event.title} ${event.message}`);

    if (hasAny(text, ["принят", "сообщ"])) {
      return "/profile/chat";
    }

    if (hasAny(text, ["обмен", "запрос", "отклон"])) {
      return "/profile/exchanges";
    }

    return "/profile/chat";
  }

  return null;
};
