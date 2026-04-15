// src\services\randomUsers\actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { getUsersByRandomApi } from '@api/Api';

const FETCH_RANDOM_USERS = 'randomUsers/fetch';
const USERS_PAGE_SIZE = Number(import.meta.env.VITE_USERS_PAGE_SIZE);

export const getRandomUsersThunk = createAsyncThunk<
  Awaited<ReturnType<typeof getUsersByRandomApi>>,
  number,
  { state: RootState }
>(
  FETCH_RANDOM_USERS,
  async (page, { getState }) => {
    const currentUsersCount = getState().randomUsers.users.length;
    const expectedMinIndex = (page - 1) * USERS_PAGE_SIZE;

    if (currentUsersCount > expectedMinIndex) {
      return { users: [], hasMore: true };
    }

    const response = await getUsersByRandomApi(page);
    return response;
  }
);