// src\services\user\user-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TNotificationEvent, TUser } from '../../api/types';
import { getUserLikesThunk, getUserThunk, logoutThunk } from './actions';

export interface UserState {
  user: TUser | null;
  likes: number[]; // id пользователей, которых лайкнул авторизованный юзер
  currentOffers: TNotificationEvent[];
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,   // это тот, кто сейчас залогинился
  likes: [],
  currentOffers: [],
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    setCurrentOffers: (state, action: PayloadAction<TNotificationEvent[]>) => {
      state.currentOffers = action.payload;
    },
    addCurrentOffers: (state, action: PayloadAction<TNotificationEvent>) => {
      state.currentOffers.push(action.payload);
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getOffers: (state) => state.currentOffers
  },
  extraReducers: builder => {
    builder
    .addCase(getUserThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
    })

    .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
    })
    .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователя';
    })
    .addCase(getUserLikesThunk.pending, state => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(getUserLikesThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.likes = action.payload; 
    })
    .addCase(getUserLikesThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки лайков';
    })

    .addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthChecked = false;
      state.isLoading = false;
    })
    .addCase(logoutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка при выходе';
    });
  }
});

// старые имена (используются сейчас в проекте)
export const { getUser } = userSlice.selectors;
export const { setUser } = userSlice.actions;

// новые имена (рекомендуется использовать дальше)
export const {
  getUser: getCurrentUser,
  getOffers
} = userSlice.selectors;

export const {
  setUser: setCurrentUser,
  setCurrentOffers,
  addCurrentOffers
} = userSlice.actions;

export const userReducer = userSlice.reducer;

