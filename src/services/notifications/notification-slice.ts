import { TNotificationEvent } from "@api/types";
import { createSlice } from "@reduxjs/toolkit";
import { getNotificationThunk } from "./actions";

interface notificationState {
  userID: number | null;
  events: TNotificationEvent[];
  error: string | null;
  isLoading: boolean; 
}

const initialState: notificationState = {
  userID: null,
  events: [],
  error: null,
  isLoading: false
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markAsSeen: (state) => {
      state.events.forEach(element => {
        element.seen = 1;
      });
    },
    deleteAllNotification: (state) => {
      state.events = state.events.filter(element => element.seen === 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotificationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.userID = action.payload.userId;
      })
      .addCase(getNotificationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки уведомлений';
      })
  },
  selectors: {
    getUserID: (state) => state.userID,
    getEvents: (state) => state.events,
    getError: (state) => state.error, 
    getIsLoading: (state) => state.isLoading,
    getUnseenCount: (state) => state.events.filter(event => event.seen === 0).length,
    // Селекторы для разделения уведомлений
    getNewNotifications: (state) => state.events.filter(event => event.seen === 0),
    getViewedNotifications: (state) => state.events.filter(event => event.seen === 1)
  }
})

export const {
  markAsSeen,
  deleteAllNotification,
} = notificationSlice.actions;

export const {
  getUserID,
  getEvents,
  getError,
  getIsLoading,
  getUnseenCount,
  getNewNotifications,
  getViewedNotifications
} = notificationSlice.selectors;

export const notificationReducer = notificationSlice.reducer;
