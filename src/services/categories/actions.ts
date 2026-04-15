// src\services\categories\actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { FETCH_CATEGORIES_ALL } from '@const/thunk-types';
import { getSkillsCategoriesApi, getSkillsSubCategoriesApi } from '@api/Api';
import { TCategory, TSubcategory } from '@api/types';

export const getCategoriesThunk = createAsyncThunk(
  FETCH_CATEGORIES_ALL,
  async () => {
    const [categoriesRes, subcategoriesRes] = await Promise.all([
      getSkillsCategoriesApi(),
      getSkillsSubCategoriesApi()
    ]);

    return {
      categories: categoriesRes.categories as TCategory[],
      subcategories: subcategoriesRes.subcategories as TSubcategory[]
    };
  }
);