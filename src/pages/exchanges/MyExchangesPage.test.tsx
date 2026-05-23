import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TExchange, TMyExchangesResponse } from '../../api/types';
import { MyExchangesPage } from './MyExchangesPage';

const navigateMock = vi.fn();
const getOffersApiMock = vi.fn();
const decideOfferApiMock = vi.fn();
const socketOnMock = vi.fn();
const socketOffMock = vi.fn();
const connectSocketMock = vi.fn(() => ({
  on: socketOnMock,
  off: socketOffMock,
}));

vi.mock('../../api/Api', () => ({
  getOffersApi: (...args: unknown[]) => getOffersApiMock(...args),
  decideOfferApi: (...args: unknown[]) => decideOfferApiMock(...args),
}));

vi.mock('../../shared/lib/socketClient', () => ({
  connectSocket: (...args: unknown[]) => connectSocketMock(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const makeExchange = (id: string, direction: 'incoming' | 'outgoing', status: TExchange['status'], peerName: string): TExchange => ({
  id,
  senderId: direction === 'incoming' ? 'peer-id' : 'me-id',
  receiverId: direction === 'incoming' ? 'me-id' : 'peer-id',
  status,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  direction,
  peer: {
    id: `${id}-peer`,
    fullName: peerName,
    email: `${peerName.toLowerCase().replace(/\s+/g, '.')}@test.ru`,
    avatarUrl: null,
    cardImageUrl: null,
  },
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <MyExchangesPage />
    </MemoryRouter>,
  );

describe('MyExchangesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('redirects to login when token is missing', async () => {
    getOffersApiMock.mockResolvedValue({ incoming: [], outgoing: [], accepted: [] });

    renderPage();

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/auth/login'));
    expect(getOffersApiMock).not.toHaveBeenCalled();
  });

  it('loads and renders incoming, outgoing and accepted exchanges', async () => {
    localStorage.setItem('token', 'token-1');
    const payload: TMyExchangesResponse = {
      incoming: [makeExchange('in-1', 'incoming', 'PENDING', 'Incoming User')],
      outgoing: [makeExchange('out-1', 'outgoing', 'PENDING', 'Outgoing User')],
      accepted: [makeExchange('acc-1', 'incoming', 'ACCEPTED', 'Accepted User')],
    };
    getOffersApiMock.mockResolvedValue(payload);

    renderPage();

    await screen.findByText('Incoming User');
    expect(screen.getByText('Outgoing User')).toBeInTheDocument();
    expect(screen.getByText('Accepted User')).toBeInTheDocument();
    expect(connectSocketMock).toHaveBeenCalledWith('token-1');
    expect(socketOnMock).toHaveBeenCalledWith('notify:new', expect.any(Function));
  });

  it('approves incoming exchange and opens peer chat', async () => {
    localStorage.setItem('token', 'token-1');
    const incoming = makeExchange('in-1', 'incoming', 'PENDING', 'Incoming User');
    getOffersApiMock.mockResolvedValue({
      incoming: [incoming],
      outgoing: [],
      accepted: [],
    });
    decideOfferApiMock.mockResolvedValue({
      ...incoming,
      status: 'ACCEPTED',
    });
    const user = userEvent.setup();

    renderPage();

    const nameNode = await screen.findByText('Incoming User');
    const card = nameNode.closest('article');
    expect(card).toBeTruthy();

    const cardButtons = within(card as HTMLElement).getAllByRole('button');
    await user.click(cardButtons[1]);

    await waitFor(() => {
      expect(decideOfferApiMock).toHaveBeenCalledWith('in-1', 'approve');
      expect(navigateMock).toHaveBeenCalledWith(`/profile/chat?peerId=${incoming.peer.id}`);
    });
  });

  it('opens chat from accepted exchange card', async () => {
    localStorage.setItem('token', 'token-1');
    const accepted = makeExchange('acc-1', 'incoming', 'ACCEPTED', 'Accepted User');
    getOffersApiMock.mockResolvedValue({
      incoming: [],
      outgoing: [],
      accepted: [accepted],
    });
    const user = userEvent.setup();

    renderPage();

    const nameNode = await screen.findByText('Accepted User');
    const card = nameNode.closest('article');
    expect(card).toBeTruthy();

    const openChatButton = within(card as HTMLElement).getByRole('button');
    await user.click(openChatButton);

    expect(navigateMock).toHaveBeenCalledWith(`/profile/chat?peerId=${accepted.peer.id}`);
  });
});

