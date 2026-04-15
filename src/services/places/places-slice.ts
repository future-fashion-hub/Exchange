// src\services\places\places-slice.ts

import { createSlice } from '@reduxjs/toolkit';
import { getPlacesThunk } from './actions';
import { TPlace } from '@api/types';

type PlacesState = {
  places: TPlace[];
  isLoading: boolean;
  error: string | null;
};

const initialState: PlacesState = {
  places: [],
  isLoading: false,
  error: null
};

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPlacesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPlacesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.places = action.payload;
      })
      .addCase(getPlacesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки городов';
      });
  }
});

export const placesReducer = placesSlice.reducer;