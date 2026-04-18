import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth';
import skillsRoutes from './routes/skills';
import usersRoutes from './routes/users';
import messagesRoutes from './routes/messages';
import uploadRoutes from './routes/upload';
import { initSocket } from './socket';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Основные роуты
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);

// Заглушка для неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Обработка ошибок (базовая)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
