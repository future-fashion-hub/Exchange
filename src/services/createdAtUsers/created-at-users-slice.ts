// src\services\createdAtUsers\created-at-users-slice.ts

import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@api/types';
import { getCreatedAtUsersThunk } from './actions';
import { toggleLikeAction } from '../../services/users/actions';

type CreatedAtUsersState = {
  users: TUser[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
};

const initialState: CreatedAtUsersState = {
  users: [],
  isLoading: false,
  error: null,
  page: 0,
  hasMore: true,
};

export const createdAtUsersSlice = createSlice({
  name: 'createdAtUsers',
  initialState,
  reducers: {
    resetCreatedAtUsers: (state) => {
      state.users = [];
      state.page = 0;
      state.hasMore = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCreatedAtUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCreatedAtUsersThunk.fulfilled, (state, action) => {
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
      .addCase(getCreatedAtUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки пользователей по created_at';
      })
      
      .addCase(toggleLikeAction, (state, action) => {
        const user = state.users.find(u => u.id === action.payload);
        if (user) {
          user.likedByMe = !user.likedByMe;
        }
      });
  },
});

export const { resetCreatedAtUsers } = createdAtUsersSlice.actions;
export const createdAtUsersReducer = createdAtUsersSlice.reducer;