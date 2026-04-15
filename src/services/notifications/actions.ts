import { getNotificationsApi } from "@api/Api";
import { TOffer, TResponseNotifications } from "@api/types";
import { FETCH_NOTIFICATIONS_ALL } from "@const/thunk-types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getNotificationThunk = createAsyncThunk<
  TResponseNotifications,
  { userId: number; offers: TOffer[] }
>(
  FETCH_NOTIFICATIONS_ALL,
  async({ userId, offers }) => {
    const notifications = await getNotificationsApi(userId, offers)
    return notifications
  }
)
