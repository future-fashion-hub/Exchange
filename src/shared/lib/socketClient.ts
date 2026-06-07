import { io, Socket } from 'socket.io-client';

export type ChatMessagePayload = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  readAt: string | null;
};

export type NotificationPayload = {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socketInstance: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  return socketInstance;
};

export const getSocket = (): Socket | null => socketInstance;

export const disconnectSocket = () => {
  if (!socketInstance) {
    return;
  }

  socketInstance.disconnect();
  socketInstance = null;
};
