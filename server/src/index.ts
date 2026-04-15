import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import skillsRoutes from './routes/skills';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Основные роуты
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);

// Заглушка для неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Обработка ошибок (базовая)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
