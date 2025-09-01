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

```bash
# Клониране на проекта
git clone <PROJECT_URL>
cd igrite-bg

# Инсталиране на dependencies
npm install

# Стартиране на MongoDB (трябва да е инсталиран локално)
mongod

# Стартиране в development mode (frontend + backend)
npm run dev:full

# Или стартиране поотделно:
# Backend server
npm run dev:server

# Frontend (в друг терминал)
npm run dev
```

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3001`

## 📊 База данни

Проектът използва MongoDB за съхранение на данни:

- **games** колекция - съхранява всички игри
- **categories** колекция - съхранява категориите

### MongoDB Setup

1. Инсталирайте MongoDB локално или използвайте MongoDB Atlas
2. Обновете `MONGODB_URI` в `.env` файла
3. Сървърът автоматично ще създаде нужните колекции и индекси

## 📁 Структура на проекта

```
src/
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
│   ├── gameStorage.ts   # MongoDB API клиент за игри
│   └── categoryStorage.ts # MongoDB API клиент за категории
server/                  # Backend API
├── index.ts            # Express сървър с MongoDB
└── package.json        # Backend dependencies
└── index.css           # Design system
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
- **Express.js** - Web framework
- **MongoDB** - NoSQL база данни
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests

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
# Build за production
npm run build

# Preview на build
npm run preview
```

Build файловете ще бъдат в `dist/` директорията.

## 📝 License

Този проект е създаден за образователни цели.