// src\services\users\users-slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsersThunk, toggleLikeAction } from './actions';
import { TUser } from '@api/types';
import { getUserLikesThunk } from '../../services/user/actions';

type UsersState = {
  offerUser: TUser | null; //пользователь с кем делаем обмен
  users: TUser[];
  isLoading: boolean;
  error: string | null;
  page: number; // страница для пагинации
  hasMore: boolean;
};

const initialState: UsersState = {
  offerUser: null,
  users: [],
  isLoading: false,
  error: null,
  page: 0,
  hasMore: true 
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // установка текущей страницы
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    // установка флага наличия данных
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    // установка юзера с которым хотим сделать оффер
    setOfferUser: (state, action: PayloadAction<TUser>) => {
      state.offerUser = action.payload;
    },

    // сброс состояния к начальному
    resetUsers: (state) => {
      state.users = [];
      state.page = 0;
      state.hasMore = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  selectors: {
    getOfferUser: (state) => state.offerUser,
    getPlainUsers: (state) => state.users
  },
  extraReducers: builder => {
    builder
      .addCase(getUsersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        // проверка на уникальность id
        // первая страница грузится 2 раза,
        // если это убрать будут первая и вторая страница дублироваться
        // если подумать, это очень слабое место
        // так как одна новая карточка может перелистнуть целую страницу
        if (action.payload.users.length > 0) {
          const existingIds = new Set(state.users.map(u => u.id));
          // const newUsers = action.payload.users.filter(u => !existingIds.has(u.id));
          const newUsers = action.payload.users.filter(
            u => !existingIds.has(u.id))
            .map(u => ({...u, likedByMe: u.likedByMe ?? false})
          );

          if (newUsers.length > 0) {
            state.users = [...state.users, ...newUsers];
            state.page += 1;
          }
        }
        state.hasMore = action.payload.hasMore; 
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователей';
      })
      // фокус!!! ловим чужие события
      // проставляем лайки у всех пользователей
      // на основании списка лайков залогиненного пользователя
      .addCase(getUserLikesThunk.fulfilled, (state, action) => {
        const likedIds = new Set(action.payload);
        state.users = state.users.map(u => ({
          ...u,
          likedByMe: likedIds.has(u.id),
        }));
      })

      .addCase(toggleLikeAction, (state, action) => {
        const user = state.users.find(u => u.id === action.payload);
        if (user) {
          user.likedByMe = !user.likedByMe;
        }
      });      

  }
});

export const { getOfferUser, getPlainUsers } = usersSlice.selectors;
export const { setPage, setHasMore, resetUsers, setOfferUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
