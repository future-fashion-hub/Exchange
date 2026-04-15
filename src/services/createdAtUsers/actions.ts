// src\services\createdAtUsers\actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { getCreatedAtUsersApi } from '@api/Api';
import { TResponseUsers } from '@api/types';
import { FETCH_USERS_BY_CREATE } from '@const/thunk-types';

const USERS_PAGE_SIZE = Number(import.meta.env.VITE_USERS_PAGE_SIZE);

export const getCreatedAtUsersThunk = createAsyncThunk<
  TResponseUsers,
  number,           // аргумент (page)
  { state: RootState }
>(
  FETCH_USERS_BY_CREATE,
  async (page, { getState }) => {
    // количество в списке пользователей отсортированом по дате создания
    const state = getState().createdAtUsers;
    const usersCount = state.users.length;
    const expectedMinIndex = (page - 1) * USERS_PAGE_SIZE;

    if (usersCount > expectedMinIndex) {
      return { users: [], hasMore: true };
    }

    const response = await getCreatedAtUsersApi(page);
    return response;
  }
);