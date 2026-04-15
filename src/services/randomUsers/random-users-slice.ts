// src\services\randomUsers\random-users-slice.ts

import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@api/types';
import { getRandomUsersThunk } from './actions';
import { toggleLikeAction } from '../../services/users/actions';

type RandomUsersState = {
  users: TUser[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
};

const initialState: RandomUsersState = {
  users: [],
  isLoading: false,
  error: null,
  page: 0,
  hasMore: true,
};

export const randomUsersSlice = createSlice({
  name: 'randomUsers',
  initialState,
  reducers: {
    resetRandomUsers: (state) => {
      state.users = [];
      state.page = 0;
      state.hasMore = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRandomUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRandomUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.users.length > 0) {
          const existingIds = new Set(state.users.map((u) => u.id));
          const newUsers = action.payload.users.filter((u) => !existingIds.has(u.id));
          if (newUsers.length > 0) {
            state.users = [...state.users, ...newUsers];
            state.page += 1;
          }
        }
        state.hasMore = action.payload.hasMore;
      })
      .addCase(getRandomUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки случайных пользователей';
      })

      .addCase(toggleLikeAction, (state, action) => {
        const user = state.users.find(u => u.id === action.payload);
        if (user) {
          user.likedByMe = !user.likedByMe;
        }
      });         
  },
});

export const { resetRandomUsers } = randomUsersSlice.actions;
export const randomUsersReducer = randomUsersSlice.reducer;
