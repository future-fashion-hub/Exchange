// src\services\users\actions.ts

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store";
import { FETCH_ALL_USERS } from "@const/thunk-types";
import { getUsersApi } from "@api/Api";
import { TResponseUsers } from "@api/types";

const USERS_PAGE_SIZE = Number(import.meta.env.VITE_USERS_PAGE_SIZE);

export const getUsersThunk = createAsyncThunk<
  TResponseUsers,  
  number,
  { state: RootState }
>(
  FETCH_ALL_USERS,
  async (page, { getState }) => {
    // количество в списке пользователей
    const state = getState().users;
    const usersCount = state.users.length;
    const expectedMinIndex = (page - 1) * USERS_PAGE_SIZE;

    // если уже загружено больше, чем нужно - возвращаем пустоту
    if (usersCount > expectedMinIndex) {
      return { users: [], hasMore: true };
    }

    const response = await getUsersApi(page);
    return response;
  }
);

export const toggleLikeAction = createAction<number>('user_likes/toggle');