// src\widgets\notifications-table\NotificationsTable.tsx

import { useEffect, useState } from 'react';
import { TNotificationEvent } from '@api/types';
import { getNotificationsApi } from '@api/Api';
import { useSelector } from '@store';
import { getCurrentUser } from '../../services/user/user-slice';
import { getOffers } from '../../services/offers/offers-slice';

export const NotificationsTable = () => {
  const [events, setEvents] = useState<TNotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Это авторизованный пользователь
  const currentUser = useSelector(getCurrentUser);
  const offers = useSelector(getOffers);

  useEffect(() => {
    if (!currentUser) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getNotificationsApi(currentUser.id, offers)
      .then((res) => setEvents(res.events))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // если нет авторизованного пользователя
  if (!currentUser) {
    return <div>Нет пользователя</div>;
  }

  // если запрос в процессе
  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Тип</th>
          <th colSpan={2}>От кого</th>
          <th>Я Видел</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, i) => (
          <tr key={i}>
            <td>{event.type}</td>
            <td>{event.anotherUserId}</td>
            <td>{event.anotherUserName}</td>
            <td>{event.seen ? 'Да' : 'Нет'}</td>
            <td>{event.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
