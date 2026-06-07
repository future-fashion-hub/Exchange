import { describe, expect, it } from "vitest";
import type { TNotificationEvent, TNotificationType } from "@api/types";
import { getNotificationTargetPath } from "./notificationNavigation";

const makeNotification = (
  type: TNotificationType,
  title: string,
  message = "",
): TNotificationEvent => ({
  id: `${type}-${title}`,
  type,
  seen: 0,
  title,
  message,
  date: "2026-01-01T00:00:00.000Z",
});

describe("getNotificationTargetPath", () => {
  it("hides action for account moderation notification", () => {
    expect(
      getNotificationTargetPath(
        makeNotification("ACCOUNT_ON_MODERATION", "Аккаунт отправлен на модерацию"),
      ),
    ).toBeNull();
  });

  it("sends account decision notifications to profile", () => {
    expect(
      getNotificationTargetPath(makeNotification("ACCOUNT_APPROVED", "Аккаунт подтвержден")),
    ).toBe("/profile");
    expect(
      getNotificationTargetPath(makeNotification("ACCOUNT_REJECTED", "Аккаунт отклонен")),
    ).toBe("/profile");
  });

  it("sends exchange request notifications to exchanges page", () => {
    expect(
      getNotificationTargetPath(makeNotification("CHAT_MESSAGE", "Новый запрос на обмен")),
    ).toBe("/profile/exchanges");
  });

  it("sends accepted exchange and chat messages to chat page", () => {
    expect(
      getNotificationTargetPath(makeNotification("CHAT_MESSAGE", "Запрос обмена принят")),
    ).toBe("/profile/chat");
    expect(
      getNotificationTargetPath(makeNotification("CHAT_MESSAGE", "Новое сообщение")),
    ).toBe("/profile/chat");
  });
});
