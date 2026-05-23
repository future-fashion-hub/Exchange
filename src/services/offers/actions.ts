import { createOfferApi, getOffersApi } from "@api/Api";
import { TExchange } from "@api/types";
import { FETCH_ADD_OFFER, FETCH_OFFERS } from "@const/thunk-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getOffersThunk = createAsyncThunk<TExchange[]>(
  FETCH_OFFERS,
  async () => {
    const data = await getOffersApi();
    const all = [...data.incoming, ...data.outgoing];
    const byId = new Map<string, TExchange>();
    all.forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
  }
);

export const addOfferThunk = createAsyncThunk<
  TExchange,
  { receiverId: string }
>(
  FETCH_ADD_OFFER,
  async ({ receiverId }) => {
    return createOfferApi(receiverId);
  }
);
