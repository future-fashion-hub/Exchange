import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

type TokenPayload = {
  id: string;
  role: string;
  email: string;
};

let io: Server | null = null;

const getTokenFromSocket = (socket: Socket): string | null => {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken;
  }

  const header = socket.handshake.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return null;
};

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = getTokenFromSocket(socket);
    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
      socket.data.user = payload;
      return next();
    } catch {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as TokenPayload;
    socket.join(`user:${user.id}`);

    socket.on("chat:join", (peerId: string) => {
      if (!peerId) {
        return;
      }

      const roomName = [user.id, peerId].sort().join(":");
      socket.join(`chat:${roomName}`);
    });

    socket.on("disconnect", () => {
      // Room cleanup is handled by socket.io.
    });
  });

  return io;
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
};
