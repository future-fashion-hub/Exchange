// src\services\places\actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPlacesApi } from '../../api/Api';
import { TPlace } from '../../api/types';
import { FETCH_PLACES_ALL } from '@const/thunk-types';

export const getPlacesThunk = createAsyncThunk<TPlace[]>(
  FETCH_PLACES_ALL,
  async () => {
    const response = await getPlacesApi();
    return response.places;
  }
);