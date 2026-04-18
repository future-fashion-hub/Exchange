import React, { useEffect, useMemo, useState } from 'react';
import { getConversationApi, sendMessageApi, TServerMessage } from '../../api/Api';
import { connectSocket, disconnectSocket } from '../../shared/lib/socketClient';

type TChatPreview = {
  id: string;
  name: string;
  msg: string;
  time: string;
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const parseUserIdFromToken = (token: string | null): string => {
  if (!token) {
    return '';
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.id === 'string' ? payload.id : '';
  } catch {
    return '';
  }
};

export const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<TServerMessage[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const currentUserId = useMemo(() => parseUserIdFromToken(token), [token]);

  const [chatList] = useState<TChatPreview[]>([
    { id: 'peer-1', name: 'Елена Родригес', msg: 'Могу завтра вечером. В...', time: '10:10' },
    { id: 'peer-2', name: 'Джулиан Чен', msg: 'Спасибо за урок!', time: 'Вчера' },
    { id: 'peer-3', name: 'Анна Смирнова', msg: 'Жду подтверждения', time: 'Пн' },
  ]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = connectSocket(token);

    socket.on('chat:new_message', (incoming: TServerMessage) => {
      if (
        incoming.senderId === selectedPeerId ||
        (incoming.senderId === currentUserId && incoming.receiverId === selectedPeerId)
      ) {
        setMessages((prev) => [...prev, incoming]);
      }
    });

    socket.on('notify:new', () => {
      // Notification stream is intentionally handled in websocket layer.
    });

    return () => {
      socket.off('chat:new_message');
      socket.off('notify:new');
      disconnectSocket();
    };
  }, [token, selectedPeerId, currentUserId]);

  useEffect(() => {
    if (!selectedPeerId || !token) {
      return;
    }

    setIsLoading(true);
    getConversationApi(selectedPeerId)
      .then((items) => setMessages(items))
      .catch(() => setMessages([]))
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
        setMessages((prev) => [...prev, created]);
        setMessage('');
      })
      .catch(() => {
        // Errors are intentionally non-blocking for draft UX.
      });
  };

  return (
    <div className="min-h-[80vh] flex bg-[#F9FAF7] dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 m-8 font-sans">
      
      {/* Sidebar: Chat List */}
      <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">Сообщения</h2>
          <div className="mt-4 relative">
            <input type="text" placeholder="Поиск..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-transparent rounded-xl focus:ring-primary focus:border-transparent dark:text-white transition-all"/>
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedPeerId(chat.id)}
              className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedPeerId === chat.id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
            >
               <div className="flex justify-between items-baseline mb-1">
                 <h4 className="font-bold text-gray-900 dark:text-white">{chat.name}</h4>
                 <span className="text-xs text-gray-400">{chat.time}</span>
               </div>
               <p className="text-sm text-gray-500 truncate">{chat.msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">Е</div>
             <div>
               <h3 className="font-bold text-lg dark:text-white">Елена Родригес</h3>
               <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span> В сети
               </p>
             </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {isLoading && <p className="text-sm text-gray-400">Загрузка истории...</p>}
          {!isLoading && messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMine ? 'bg-primary text-white rounded-br-none shadow-md' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700'}`}>
                <p>{msg.text}</p>
                <div className={`text-xs mt-2 text-right ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );})}
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Напишите сообщение..." 
              className="flex-grow bg-gray-100 dark:bg-gray-700 dark:text-white border-transparent rounded-full px-6 py-3 py-3 focus:ring-primary focus:border-primary transition-all shadow-inner"
            />
            <button type="submit" disabled={!message.trim()} className="bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
};
