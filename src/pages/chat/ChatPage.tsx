import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getConversationApi, getOffersApi, sendMessageApi, TServerMessage } from '../../api/Api';
import { connectSocket } from '../../shared/lib/socketClient';
import { toAbsoluteServerUrl } from '../../shared/lib/helpers';
import skillPlaceholder from '../../shared/assets/images/school-board.png';
import {
  LuInfo,
  LuPaperclip,
  LuSearch,
  LuSendHorizontal,
  LuSmile,
} from 'react-icons/lu';

type TChatPreview = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastMessage?: string;
};

const parseUserIdFromToken = (token: string | null): string => {
  if (!token) {
    return '';
  }

  try {
    const encodedPayload = token.split('.')[1];
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(paddedBase64));
    return typeof payload.id === 'string' ? payload.id : '';
  } catch {
    return '';
  }
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const appendUniqueMessages = (
  current: TServerMessage[],
  nextMessages: TServerMessage | TServerMessage[],
) => {
  const incoming = Array.isArray(nextMessages) ? nextMessages : [nextMessages];
  const existingIds = new Set(current.map((item) => item.id));
  const uniqueIncoming = incoming.filter((item) => !existingIds.has(item.id));

  return uniqueIncoming.length > 0 ? [...current, ...uniqueIncoming] : current;
};

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<TServerMessage[]>([]);
  const [chatList, setChatList] = useState<TChatPreview[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialPeerApplied, setIsInitialPeerApplied] = useState(false);

  const token = localStorage.getItem('token');
  const currentUserId = useMemo(() => parseUserIdFromToken(token), [token]);

  useEffect(() => {
    getOffersApi()
      .then((data) => {
        const peers = new Map<string, TChatPreview>();

        data.accepted.forEach((item) => {
          if (peers.has(item.peer.id)) {
            return;
          }

          peers.set(item.peer.id, {
            id: item.peer.id,
            name: item.peer.fullName,
            avatar: item.peer.avatarUrl ? toAbsoluteServerUrl(item.peer.avatarUrl) : skillPlaceholder,
            status: 'Обмен подтвержден',
          });
        });

        const prepared = Array.from(peers.values());
        setChatList(prepared);

        const peerFromQuery = searchParams.get('peerId');
        if (!isInitialPeerApplied && peerFromQuery && prepared.some((item) => item.id === peerFromQuery)) {
          setSelectedPeerId(peerFromQuery);
          setIsInitialPeerApplied(true);
          return;
        }

        setSelectedPeerId((prev) => {
          if (prev && prepared.some((item) => item.id === prev)) {
            return prev;
          }

          return prepared[0]?.id || '';
        });
      })
      .catch((error) => {
        console.error('Failed to load accepted exchanges:', error);
        setChatList([]);
      });
  }, [searchParams, isInitialPeerApplied]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = connectSocket(token);

    const handleIncomingMessage = (incoming: TServerMessage) => {
      const isCurrentDialog =
        incoming.senderId === selectedPeerId ||
        (incoming.senderId === currentUserId && incoming.receiverId === selectedPeerId);

      if (isCurrentDialog) {
        setMessages((prev) => appendUniqueMessages(prev, incoming));
      }

      const peerId = incoming.senderId === currentUserId ? incoming.receiverId : incoming.senderId;
      setChatList((prev) =>
        prev.map((item) =>
          item.id === peerId
            ? { ...item, lastMessage: incoming.text }
            : item,
        ),
      );
    };

    socket.on('chat:new_message', handleIncomingMessage);

    return () => {
      socket.off('chat:new_message', handleIncomingMessage);
    };
  }, [token, selectedPeerId, currentUserId]);

  useEffect(() => {
    if (!token || !selectedPeerId) {
      setMessages([]);
      return;
    }

    const socket = connectSocket(token);
    socket.emit('chat:join', selectedPeerId);

    setIsLoading(true);
    getConversationApi(selectedPeerId)
      .then((items) => setMessages(appendUniqueMessages([], items)))
      .catch((error) => {
        console.error('Failed to load conversation:', error);
        setMessages([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedPeerId, token]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedPeerId) {
      return;
    }

    const text = message.trim();
    sendMessageApi(selectedPeerId, text)
      .then((created) => {
        setMessages((prev) => appendUniqueMessages(prev, created));
        setChatList((prev) =>
          prev.map((item) =>
            item.id === selectedPeerId
              ? { ...item, lastMessage: created.text }
              : item,
          ),
        );
        setMessage('');
      })
      .catch((error) => {
        console.error('Send message error:', error);
      });
  };

  const selectedPeer = chatList.find((chat) => chat.id === selectedPeerId);

  return (
    <div className="min-h-[84vh] bg-[#eeedf7] rounded-2xl border border-[#e2e6f5] overflow-hidden mx-4 my-6 lg:mx-8 font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] min-h-[84vh]">
        <section className="bg-[#f4f3fb] border-r border-[#dfe4f2] p-5">
          <h2 className="text-[40px] leading-none font-extrabold text-slate-800 mb-5">Чаты</h2>

          {chatList.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#ccd4ef] bg-white p-4 text-sm text-slate-500">
              Пока нет активных чатов. Примите обмен в разделе «Мои обмены».
            </div>
          )}

          <div className="space-y-2">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedPeerId(chat.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left transition-all border ${selectedPeerId === chat.id ? 'bg-white border-[#dce2f7] shadow-sm' : 'border-transparent hover:bg-white/70'}`}
              >
                <div className="flex items-start gap-3">
                  <img src={chat.avatar} alt={chat.name} className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 truncate">{chat.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{chat.status}</p>
                    {chat.lastMessage && (
                      <p className="text-sm text-primary truncate mt-1">{chat.lastMessage}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-[#f4f3fb] flex flex-col">
          <header className="h-20 px-7 border-b border-[#dfe4f2] flex items-center justify-between bg-[#f3f2fb]">
            {selectedPeer ? (
              <div className="flex items-center gap-3">
                <img src={selectedPeer.avatar} alt={selectedPeer.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="font-extrabold text-slate-800 text-xl leading-none">{selectedPeer.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedPeer.status}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Выберите чат слева</p>
            )}
            <button className="text-slate-500" aria-label="Информация">
              <LuInfo size={18} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-7">
            {isLoading && <p className="text-sm text-slate-400">Загрузка истории...</p>}
            {!isLoading && messages.length === 0 && selectedPeerId && (
              <p className="text-sm text-slate-500">Напишите первое сообщение, чтобы начать диалог.</p>
            )}
            <div className="space-y-3">
              {!isLoading && messages.map((msg) => {
                const mine = msg.senderId === currentUserId;
                const senderLabel = mine ? 'Вы' : selectedPeer?.name || 'Собеседник';
                return (
                  <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      data-testid="chat-message-bubble"
                      data-owner={mine ? 'mine' : 'peer'}
                      className={`max-w-[72%] rounded-2xl px-4 py-3 ${mine ? 'bg-primary text-white rounded-br-md' : 'bg-[#e8e9fc] text-slate-700 rounded-bl-md'}`}
                    >
                      <div className={`mb-1 text-[11px] font-semibold ${mine ? 'text-blue-100 text-right' : 'text-slate-500'}`}>
                        {senderLabel}
                      </div>
                      <p className="leading-relaxed text-[15px]">{msg.text}</p>
                      <div className={`mt-2 text-[11px] ${mine ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="px-7 pb-6 pt-3">
            <form onSubmit={handleSend} className="rounded-2xl border border-[#d8deef] bg-[#ececf9] p-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите ваше сообщение..."
                className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 px-2 py-2"
                disabled={!selectedPeerId}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500 px-2">
                  <button type="button" aria-label="Поиск"><LuSearch size={16} /></button>
                  <button type="button" aria-label="Эмодзи"><LuSmile size={16} /></button>
                  <button type="button" aria-label="Вложение"><LuPaperclip size={16} /></button>
                </div>
                <button
                  type="submit"
                  disabled={!message.trim() || !selectedPeerId}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-white font-semibold shadow-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Отправить <LuSendHorizontal size={16} />
                </button>
              </div>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
};
