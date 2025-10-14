# Настройка проекта Импров Товарищ

## Предварительные требования

- Node.js 18+ и npm
- Аккаунт MongoDB Atlas (бесплатно)
- Git
- Редактор кода (VS Code рекомендуется)

## Шаг 1: Клонирование и установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd improv-tovarisch

# Установите зависимости
npm install
```

## Шаг 2: Настройка MongoDB Atlas

### Создание кластера

1. Перейдите на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Создайте бесплатный аккаунт
3. Создайте новый кластер:
   - Выберите FREE tier (M0)
   - Регион: ближайший к вам
   - Имя кластера: `improv-tovarisch`

### Создание пользователя БД

1. В разделе **Database Access** создайте нового пользователя:
   - Username: `improv_user` (или свой)
   - Password: сгенерируйте надежный пароль
   - Роль: `Read and write to any database`

### Настройка сетевого доступа

1. В разделе **Network Access** добавьте IP адрес:
   - Для разработки: `0.0.0.0/0` (разрешить доступ отовсюду)
   - Для production: конкретный IP вашего сервера

### Получение Connection String

1. Нажмите **Connect** на вашем кластере
2. Выберите **Connect your application**
3. Скопируйте connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Шаг 3: Настройка переменных окружения

1. Скопируйте файл `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Откройте `.env.local` и заполните:

   ```env
   # MongoDB - вставьте ваш connection string
   MONGODB_URI=mongodb+srv://improv_user:YOUR_PASSWORD@cluster.mongodb.net/improv-tovarisch?retryWrites=true&w=majority

   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000

   # Сгенерируйте секрет командой: openssl rand -base64 32
   NEXTAUTH_SECRET=ваш_сгенерированный_секрет

   # Claude API (пока оставьте пустым, настроим позже)
   ANTHROPIC_API_KEY=
   ```

3. Генерация `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

## Шаг 4: Запуск проекта

```bash
# Запустите dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Шаг 5: Настройка Claude API (опционально, для AI функций)

1. Перейдите на [Anthropic Console](https://console.anthropic.com/)
2. Создайте аккаунт
3. Получите API ключ в разделе **API Keys**
4. Добавьте ключ в `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

## Проверка установки

Проверьте, что все работает:

1. **MongoDB подключение**: При запуске `npm run dev` вы должны увидеть в консоли:
   ```
   ✅ MongoDB connected
   ```

2. **Next.js**: Сервер запустился на `http://localhost:3000`

3. **TypeScript**: Нет ошибок компиляции

## Возможные проблемы

### Ошибка подключения к MongoDB

```
MongooseError: Could not connect to MongoDB
```

**Решение:**
- Проверьте правильность `MONGODB_URI`
- Убедитесь, что пароль не содержит специальных символов (или закодируйте их)
- Проверьте Network Access в MongoDB Atlas

### Port уже занят

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Решение:**
```bash
# Убейте процесс на порту 3000
lsof -ti:3000 | xargs kill -9

# Или используйте другой порт
PORT=3001 npm run dev
```

### TypeScript ошибки

**Решение:**
```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

## Следующие шаги

После успешной настройки:

1. Изучите структуру проекта в `README.md`
2. Ознакомьтесь с полной спецификацией в `docs/PROJECT_SPEC.md`
3. Начните разработку первого функционала

## Полезные команды

```bash
npm run dev          # Запуск dev сервера
npm run build        # Production build
npm run start        # Запуск production
npm run lint         # Проверка кода
```

## Дополнительные ресурсы

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Auth.js Docs](https://authjs.dev/)
