import type { TNotificationEvent } from '@api/types';
import { describe, expect, it } from 'vitest';
import { getNotificationThunk } from './actions';
import {
  deleteAllNotification,
  markAsSeen,
  notificationReducer
} from './notification-slice';

const createEvent = (id: string, seen: 0 | 1): TNotificationEvent => ({
  id,
  type: 'CHAT_MESSAGE',
  seen,
  title: 'title',
  message: 'message',
  date: '2026-01-01T00:00:00.000Z'
});

describe('notification-slice', () => {
  it('writes payload on getNotificationThunk.fulfilled', () => {
    const payload = {
      userId: 'user-1',
      events: [createEvent('e-1', 0), createEvent('e-2', 1)]
    };

    const state = notificationReducer(
      undefined,
      getNotificationThunk.fulfilled(payload, 'req-1', { userId: 'user-1' })
    );

    expect(state.userID).toBe('user-1');
    expect(state.events).toHaveLength(2);
    expect(state.isLoading).toBe(false);
  });

  it('marks all notifications as seen', () => {
    const baseState = notificationReducer(
      undefined,
      getNotificationThunk.fulfilled(
        { userId: 'user-1', events: [createEvent('e-1', 0), createEvent('e-2', 0)] },
        'req-1',
        { userId: 'user-1' }
      )
    );

    const state = notificationReducer(baseState, markAsSeen());

    expect(state.events.every((event) => event.seen === 1)).toBe(true);
  });

  it('deletes only viewed notifications', () => {
    const baseState = notificationReducer(
      undefined,
      getNotificationThunk.fulfilled(
        { userId: 'user-1', events: [createEvent('e-1', 0), createEvent('e-2', 1)] },
        'req-1',
        { userId: 'user-1' }
      )
    );

    const state = notificationReducer(baseState, deleteAllNotification());

    expect(state.events).toHaveLength(1);
    expect(state.events[0].id).toBe('e-1');
  });
});
