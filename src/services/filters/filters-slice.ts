// src\services\filters\filters-slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GENDERS, TGender } from '@api/types';
import { SKILL_TYPES, TSkillType } from '../../shared/types/filters';

type FiltersState = {
  skillType: TSkillType;
  gender: TGender;
  places: string[];
  subcategories: number[];
  q: string;
};

const getInitialState = (): FiltersState => ({
  skillType: SKILL_TYPES.ALL,
  gender: GENDERS.UNSPECIFIED,
  places: [],
  subcategories: [],
  q: ''
});

const initialState = getInitialState();

export const isFiltersEmpty = (state: FiltersState): boolean => {
  return (
    state.gender === GENDERS.UNSPECIFIED &&
    state.places.length === 0 &&
    state.subcategories.length === 0 &&
    state.q.trim().length < 3
  );
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSkillType: (state, action: PayloadAction<TSkillType>) => {
      state.skillType = action.payload;
    },
    // toggleCategory: (state, action: PayloadAction<string>) => {
    //   if (state.categories.includes(action.payload)) {
    //     state.categories = state.categories.filter(c => c !== action.payload);
    //   } else {
    //     state.categories.push(action.payload);
    //   }
    // },
    setGender: (state, action: PayloadAction<TGender>) => {
      state.gender = action.payload;
    },
    setPlaces: (state, action: PayloadAction<string[]>) => {
      state.places = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.q = action.payload;
    },
    setSubcategories: (state, action: PayloadAction<number[]>) => {
      state.subcategories = action.payload;
    },
    resetFilters: () => getInitialState(),
  },
});

export const { setSkillType, setGender, setPlaces, setQuery, resetFilters, setSubcategories } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;
