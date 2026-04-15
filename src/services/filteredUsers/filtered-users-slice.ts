// src\services\filteredUsers\filtered-users-slice.ts

import { TUser } from '@api/types';
import { createSlice } from '@reduxjs/toolkit';
import { getFilteredUsersThunk } from './actions';
import { toggleLikeAction } from '../../services/users/actions';

type FilteredUsersState = {
  users: TUser[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
};

const initialState: FilteredUsersState = {
  users: [],
  isLoading: false,
  error: null,
  page: 0,
  hasMore: true,
};

export const filteredUsersSlice = createSlice({
  name: 'filteredUsers',
  initialState,
  reducers: {
    resetFilteredUsers: (state) => {
      state.users = [];
      state.page = 0;
      state.hasMore = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilteredUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFilteredUsersThunk.fulfilled, (state, action) => {
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
      .addCase(getFilteredUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки filtered пользователей';
      })
      
      .addCase(toggleLikeAction, (state, action) => {
        const user = state.users.find(u => u.id === action.payload);
        if (user) {
          user.likedByMe = !user.likedByMe;
        }
      });
  },
});

export const { resetFilteredUsers } = filteredUsersSlice.actions;
export const filteredUsersReducer = filteredUsersSlice.reducer;