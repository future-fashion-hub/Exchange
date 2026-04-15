// src\services\popularUsers\actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { getPopularUsersApi } from '@api/Api';
import { TResponseUsers } from '@api/types';
import { FETCH_USERS_BY_LIKES } from '@const/thunk-types';

const USERS_PAGE_SIZE = Number(import.meta.env.VITE_USERS_PAGE_SIZE);

export const getPopularUsersThunk = createAsyncThunk<
  TResponseUsers,
  number,           // аргумент (page)
  { state: RootState }
>(
  FETCH_USERS_BY_LIKES,
  async (page, { getState }) => {
  // количество в списке пользователей отсортированом по количеству лайков
    const state = getState().popularUsers;
    const usersCount = state.users.length;
    const expectedMinIndex = (page - 1) * USERS_PAGE_SIZE;

    if (usersCount > expectedMinIndex) {
      return { users: [], hasMore: true };
    }

    const response = await getPopularUsersApi(page);
    return response;
  }
);
