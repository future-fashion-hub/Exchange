# Exchange

Платформа обмена навыками с ролями `Гость`, `Пользователь`, `Администратор`.

Проект состоит из двух частей:
- `frontend` (React + TypeScript + Vite)
- `backend` (Node.js + Express + TypeScript + Prisma + PostgreSQL + Socket.IO)

## Основные возможности

- Авторизация и регистрация пользователей
- Трехшаговая регистрация профиля
- Каталог карточек навыков с фильтрацией
- Создание запросов на обмен
- Раздел «Мои обмены» (входящие, исходящие, принятые)
- Уведомления по обменам и сообщениям
- Чат в реальном времени через WebSocket
- Административная модерация пользователей
- Загрузка медиа (аватар и изображение карточки)

## Стек технологий

### Frontend
- React 18
- TypeScript
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Vitest + Testing Library

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT
- Multer
- Vitest + Supertest

## Структура проекта

- `src/` — клиентское приложение
- `server/src/` — серверная логика
- `server/prisma/` — схема базы данных
- `server/uploads/` — локальное хранение пользовательских файлов
- `scripts/` — скрипты запуска и сборки frontend

## Быстрый старт

### 1) Установка зависимостей

В корне проекта:

```bash
npm i
```

В серверной части:

```bash
cd server
npm i
```

### 2) Настройка окружения backend

Создайте файл `server/.env` и заполните минимум:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/skillswap
```

### 3) Подготовка базы данных

В директории `server`:

```bash
npm run prisma:generate
npm run prisma:push
```

### 4) Запуск backend

В директории `server`:

```bash
npm run dev
```

Сервер по умолчанию доступен на `http://localhost:5000`.

### 5) Запуск frontend

В корне проекта:

```bash
npm run dev
```

Клиент доступен на `http://localhost:3000`.

## Сборка

### Frontend

```bash
npm run build
npm run preview
```

### Backend

```bash
cd server
npm run build
npm start
```

## Тестирование

### Frontend тесты

```bash
npm test
```

### Backend тесты

```bash
cd server
npm test
```

## API-домены

- `/api/auth`
- `/api/users`
- `/api/skills`
- `/api/offers`
- `/api/messages`
- `/api/notifications`
- `/api/upload`
- `/api/admin`

## Примечания

- В репозитории реализованы unit/integration тесты для критичных сценариев backend и frontend.

