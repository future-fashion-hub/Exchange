import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TExchange } from '../../api/types';
import type { TServerMessage } from '../../api/Api';
import { ChatPage } from './ChatPage';

const getOffersApiMock = vi.fn();
const getConversationApiMock = vi.fn();
const sendMessageApiMock = vi.fn();
let chatNewMessageHandler: ((message: TServerMessage) => void) | null = null;
const socketOnMock = vi.fn((event: string, handler: (message: TServerMessage) => void) => {
  if (event === 'chat:new_message') {
    chatNewMessageHandler = handler;
  }
});
const socketOffMock = vi.fn();
const socketEmitMock = vi.fn();
const connectSocketMock = vi.fn(() => ({
  on: socketOnMock,
  off: socketOffMock,
  emit: socketEmitMock,
}));

vi.mock('../../api/Api', () => ({
  getOffersApi: (...args: unknown[]) => getOffersApiMock(...args),
  getConversationApi: (...args: unknown[]) => getConversationApiMock(...args),
  sendMessageApi: (...args: unknown[]) => sendMessageApiMock(...args),
}));

vi.mock('../../shared/lib/socketClient', () => ({
  connectSocket: (...args: unknown[]) => connectSocketMock(...args),
}));

const createToken = (id: string) => {
  const payload = btoa(JSON.stringify({ id }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `x.${payload}.y`;
};

const makeAcceptedExchange = (id: string, peerId: string, peerName: string): TExchange => ({
  id,
  senderId: 'sender-1',
  receiverId: 'receiver-1',
  status: 'ACCEPTED',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  direction: 'incoming',
  peer: {
    id: peerId,
    fullName: peerName,
    email: `${peerName.toLowerCase().replace(/\s+/g, '.')}@test.ru`,
    avatarUrl: null,
    cardImageUrl: null,
  },
});

const renderChat = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/profile/chat" element={<ChatPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chatNewMessageHandler = null;
    localStorage.clear();
    localStorage.setItem('token', createToken('user-1'));
  });

  it('switches between chats and loads conversation for selected peer', async () => {
    getOffersApiMock.mockResolvedValue({
      incoming: [],
      outgoing: [],
      accepted: [
        makeAcceptedExchange('ex-1', 'peer-1', 'Peer One'),
        makeAcceptedExchange('ex-2', 'peer-2', 'Peer Two'),
      ],
    });
    getConversationApiMock.mockImplementation(async (peerId: string) => {
      if (peerId === 'peer-2') {
        return [
          {
            id: 'm-2',
            senderId: 'peer-2',
            receiverId: 'user-1',
            text: 'hello from peer two',
            createdAt: '2026-01-01T10:00:00.000Z',
            readAt: null,
          },
        ];
      }
      return [
        {
          id: 'm-1',
          senderId: 'peer-1',
          receiverId: 'user-1',
          text: 'hello from peer one',
          createdAt: '2026-01-01T10:01:00.000Z',
          readAt: null,
        },
      ];
    });

    const user = userEvent.setup();
    renderChat('/profile/chat?peerId=peer-2');

    await waitFor(() => expect(getConversationApiMock).toHaveBeenCalledWith('peer-2'));
    expect(await screen.findByText('hello from peer two')).toBeInTheDocument();

    await user.click(screen.getAllByText('Peer One')[0]);

    await waitFor(() => expect(getConversationApiMock).toHaveBeenCalledWith('peer-1'));
    expect(await screen.findByText('hello from peer one')).toBeInTheDocument();
    expect(socketEmitMock).toHaveBeenCalledWith('chat:join', 'peer-1');
  });

  it('sends message in selected dialog', async () => {
    getOffersApiMock.mockResolvedValue({
      incoming: [],
      outgoing: [],
      accepted: [makeAcceptedExchange('ex-1', 'peer-1', 'Peer One')],
    });
    getConversationApiMock.mockResolvedValue([]);
    const createdMessage = {
      id: 'm-new',
      senderId: 'user-1',
      receiverId: 'peer-1',
      text: 'new message text',
      createdAt: '2026-01-01T11:00:00.000Z',
      readAt: null,
    };
    sendMessageApiMock.mockResolvedValue(createdMessage);

    const user = userEvent.setup();
    const { container } = renderChat('/profile/chat?peerId=peer-1');

    await waitFor(() => expect(getConversationApiMock).toHaveBeenCalledWith('peer-1'));

    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    await user.type(input, 'new message text');
    await user.click(submitButton);

    await waitFor(() =>
      expect(sendMessageApiMock).toHaveBeenCalledWith('peer-1', 'new message text'),
    );
    await screen.findAllByTestId('chat-message-bubble');

    act(() => {
      chatNewMessageHandler?.(createdMessage);
    });

    const renderedBubbles = await screen.findAllByTestId('chat-message-bubble');
    expect(renderedBubbles).toHaveLength(1);
    expect(renderedBubbles[0]).toHaveAttribute('data-owner', 'mine');
    expect(screen.getByText('Вы')).toBeInTheDocument();
  });
});
