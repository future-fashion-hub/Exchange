// src\services\user\actions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByIdAPI, getUserLikesApi, logoutApi } from '../../api/Api';
import { TUser,TLikeType } from '../../api/types';
import { FETCH_LOGOUT_USER, FETCH_USER_BY_ID, FETCH_USER_LIKES } from "@const/thunk-types";

export const getUserThunk = createAsyncThunk<TUser | null, number>(
  FETCH_USER_BY_ID,
  async (userId: number) => {
    const user = await getUserByIdAPI(userId);
    return user;
  }
);

// грузим список лайков авторизованного пользователя
export const getUserLikesThunk = createAsyncThunk(
  FETCH_USER_LIKES,
  async (userId: number) => {
    // 
    const likes = await getUserLikesApi(userId);
    // оставляем только id пользователей, которых лайкнул текущий юзер
    return likes.map((like: TLikeType) => like.liked_id);
  }
);

export const logoutThunk = createAsyncThunk(
  FETCH_LOGOUT_USER,
  async () => {
    const response = await logoutApi();
    return response.success;   // вернём true при удаче
  }
);