import { getOffersApi } from "@api/Api";
import { TOffer } from "@api/types";
import { FETCH_ADD_OFFER, FETCH_OFFERS } from "@const/thunk-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getOffersThunk = createAsyncThunk(
  FETCH_OFFERS,
  async () => {
    const data = await getOffersApi();
    return data.offers;
  }
);

export const addOfferThunk = createAsyncThunk<
TOffer, 
{ offerUserId: number; skillOwnerId: number }
>(
  FETCH_ADD_OFFER,
  async ({ offerUserId, skillOwnerId }) => {

    //имитация задержки сервера
    await new Promise((resolve) => setTimeout( (resolve), 1000));

    //предзаполняем поля оффера
    const offer: TOffer = {
      offerUserId,
      skillOwnerId,
      accept: 0,
      daysSinceOffer: 0,
      daysSinceAccept: 0,
      sawOffer: 0,
      sawAccept: 0,
    };

    return offer;
  }
);