import { getNotificationsApi } from "@api/Api";
import { TResponseNotifications } from "@api/types";
import { FETCH_NOTIFICATIONS_ALL } from "@const/thunk-types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getNotificationThunk = createAsyncThunk<
  TResponseNotifications,
  { userId: string | number }
>(
  FETCH_NOTIFICATIONS_ALL,
  async() => {
    const notifications = await getNotificationsApi()
    return notifications
  }
)
