import { createSlice } from '@reduxjs/toolkit';
import { TExchange } from '../../api/types';
import { addOfferThunk, getOffersThunk } from './actions';

export interface OffersState {
  offers: TExchange[];
  isOfferCreated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  isOfferCreated: false,
  isLoading: false,
  error: null,
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {},
  selectors: {
    getOffers: (state) => state.offers,
    isOfferCreated: (state) => state.isOfferCreated,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOffersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOffersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers = action.payload;
      })
      .addCase(getOffersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки обменов';
      })
      .addCase(addOfferThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addOfferThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers.unshift(action.payload);
        state.isOfferCreated = true;
      })
      .addCase(addOfferThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания предложения обмена';
      });
  },
});

export const { getOffers, isOfferCreated } = offersSlice.selectors;

export const offersReducer = offersSlice.reducer;
