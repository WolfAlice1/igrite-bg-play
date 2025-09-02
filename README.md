# игрите.bg - Безплатни HTML Игри

Модерен уебсайт за HTML игри, насочен към българската аудитория, с красив дизайн и пълнофункционален админ панел.

## ✨ Функции

- 🎮 **Модерен дизайн** - Dark theme с purple/blue градиенти
- 🎯 **Категории игри** - Action, Puzzle, Racing, Arcade и др.
- 🔍 **Търсене и филтри** - Лесно намиране на игри
- 👨‍💼 **Админ панел** - CRUD операции за игри
- 📱 **Responsive дизайн** - Работи на всички устройства
- 🚀 **SEO оптимизиран** - Bulgarian meta tags и structured data
- 💾 **JSON persistence** - Няма нужда от база данни
- 📦 **Bulk import** - Масово добавяне на игри от JSON

## 🚀 Стартиране

### С Docker (препоръчително)

```bash
# Клониране на проекта
git clone <PROJECT_URL>
cd igrite-bg

# Стартиране на цялата система (MongoDB + Backend + Frontend)
docker-compose up -d
```

Системата ще бъде достъпна на:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- MongoDB: `localhost:27017`

### Локално разработване

```bash
# Клониране на проекта
git clone <PROJECT_URL>
cd igrite-bg

# Копиране на environment файла
cp .env.example .env

# Инсталиране на dependencies
npm install

# Стартиране на MongoDB (ако не използвате Docker)
# Трябва да имате MongoDB инсталиран локално

# Стартиране на backend сървъра
npm run dev:backend

# Стартиране в development mode
npm run dev
```

Frontend ще бъде достъпен на `http://localhost:8080`
Backend API ще бъде достъпен на `http://localhost:3001`

## 📁 Структура на проекта

```
src/
├── server/              # Backend Express сървър
│   └── app.ts           # Главен backend файл
├── services/            # Backend услуги
│   ├── gameService.ts   # Game CRUD операции
│   └── categoryService.ts # Category CRUD операции
├── models/              # MongoDB модели
│   ├── Game.ts          # Game модел
│   └── Category.ts      # Category модел
├── config/              # Конфигурация
│   └── database.ts      # MongoDB връзка
├── components/          # React компоненти
│   ├── GameCard.tsx     # Карта за игра
│   ├── GameGrid.tsx     # Мрежа от игри
│   └── Header.tsx       # Хедър с търсене и навигация
├── pages/               # Страници
│   ├── Index.tsx        # Главна страница
│   ├── GamePage.tsx     # Страница за игра
│   └── AdminPage.tsx    # Админ панел
├── types/               # TypeScript типове
│   └── game.ts          # Game интерфейс
├── utils/               # Utility функции
│   └── gameStorage.ts   # JSON storage логика
└── index.css           # Design system
```

## 🐳 Docker Commands

```bash
# Стартиране на всички услуги
docker-compose up -d

# Спиране на всички услуги
docker-compose down

# Преглед на логове
docker-compose logs -f

# Рестартиране на конкретна услуга
docker-compose restart igrite-bg

# Изтриване на всички данни (включително MongoDB)
docker-compose down -v
```

## 🎮 Как да добавите игри

### Чрез админ панел:
1. Отидете на `/admin`
2. Кликнете "Добави игра"
3. Попълнете формата
4. Натиснете "Запазване"

### Bulk import:
1. Отидете на `/admin` → "Импорт"
2. Поставете JSON в следния формат:

```json
[
  {
    "id": "1",
    "title": "Име на играта",
    "description": "Описание...",
    "instructions": "Инструкции...",
    "url": "https://iframe-url.com",
    "category": "Action",
    "tags": "tag1, tag2, tag3",
    "thumb": "https://image-url.jpg",
    "width": "800",
    "height": "600"
  }
]
```

## 🛠️ Технологии

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Анимации
- **Vite** - Build tool
- **shadcn/ui** - UI компоненти
- **React Router** - Routing
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **TypeScript** - Type safety
- **Docker** - Containerization

## 🎨 Design System

Уебсайтът използва тъмна тема с:
- **Primary colors**: Purple/Blue градиенти
- **Typography**: Inter font family
- **Animations**: Smooth transitions и hover effects
- **Components**: Модерни UI компоненти с glass morphism

## 📱 SEO Функции

- Bulgarian language meta tags
- Open Graph optimizations
- Twitter Cards
- Structured Data (JSON-LD)
- Canonical URLs
- Responsive meta viewport

## 🚧 Deployment

```bash
# С Docker (препоръчително)
docker-compose up -d

# Или локално
# Build за production
npm run build

# Preview на build
npm run preview
```

Build файловете ще бъдат в `dist/` директорията.

## 🔧 Environment Variables

Копирайте `.env.example` към `.env` и конфигурирайте:

- `MONGODB_URI` - MongoDB connection string
- `REACT_APP_API_URL` - Backend API URL
- `PORT` - Backend port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## 📝 License

Този проект е създаден за образователни цели.