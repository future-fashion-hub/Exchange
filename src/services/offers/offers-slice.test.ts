import type { TExchange } from '@api/types';
import { describe, expect, it } from 'vitest';
import { addOfferThunk, getOffersThunk } from './actions';
import { offersReducer } from './offers-slice';

const createExchange = (id: string): TExchange => ({
  id,
  senderId: 'sender-1',
  receiverId: 'receiver-1',
  status: 'PENDING',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  direction: 'outgoing',
  peer: {
    id: 'peer-1',
    fullName: 'Test User',
    email: 'test@example.com',
    avatarUrl: null,
    cardImageUrl: null
  }
});

describe('offers-slice', () => {
  it('returns initial state', () => {
    const state = offersReducer(undefined, { type: 'unknown' });

    expect(state.offers).toEqual([]);
    expect(state.isOfferCreated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('stores offers on getOffersThunk.fulfilled', () => {
    const payload = [createExchange('ex-1')];
    const state = offersReducer(
      undefined,
      getOffersThunk.fulfilled(payload, 'req-1')
    );

    expect(state.offers).toEqual(payload);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('prepends created offer and marks creation flag', () => {
    const existing = createExchange('ex-old');
    const initialState = offersReducer(
      undefined,
      getOffersThunk.fulfilled([existing], 'req-1')
    );
    const created = createExchange('ex-new');

    const state = offersReducer(
      initialState,
      addOfferThunk.fulfilled(created, 'req-2', { receiverId: 'receiver-1' })
    );

    expect(state.offers[0].id).toBe('ex-new');
    expect(state.offers[1].id).toBe('ex-old');
    expect(state.isOfferCreated).toBe(true);
  });
});
