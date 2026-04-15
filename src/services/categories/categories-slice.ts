// src\services\categories\categories-slice.ts

import { createSlice } from '@reduxjs/toolkit';
import { TCategory, TSubcategory } from '@api/types';
import { getCategoriesThunk } from './actions';

type CategoriesState = {
  categories: TCategory[];
  subcategories: TSubcategory[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CategoriesState = {
  categories: [],
  subcategories: [],
  isLoading: false,
  error: null
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCategoriesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
      })
      .addCase(getCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки категорий';
      });
  }
});

export const categoriesReducer = categoriesSlice.reducer;