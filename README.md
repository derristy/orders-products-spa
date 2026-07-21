# Orders & Products SPA (Inventory)

> ### 🔗 Демо: **https://orders-products-spa.derristy.com**
> **Логин:** `admin` &nbsp;·&nbsp; **Пароль:** `admin`
>
> Развёрнуто на VPS в Docker: HTTPS, REST API, WebSocket, данные в SQLite.

SPA для складского учёта: **Приходы (Orders)** и **Продукты (Products)**. Тестовое задание.

Список приходов с раскрытием карточки и списком продуктов, попап удаления, страница
продуктов с фильтрами, живые часы и счётчик активных вкладок через WebSocket.

## Стек

- **Vue 3** (`<script setup>`, TypeScript) + **Vite**
- **Vuex 4** — глобальное состояние (модули `orders`, `products`, `auth`)
- **Vue Router 4** — роутинг с lazy-загрузкой страниц, анимацией переходов и JWT-гвардом
- **vue-i18n** — 4 локали: русский, украинский, казахский, английский
- **JWT** — авторизация (логин, защита REST-роутов, хранение токена в Web Storage)
- **Bootstrap 5** + собственный слой стилей (BEM, изоляция через `scoped`)
- **Express + Socket.io** — REST API и WebSocket-счётчик сессий (папка `server/`)
- **SQLite** (встроенный `node:sqlite`) — хранение данных, переживает перезапуск
- **Vitest** — юнит-тесты
- **Docker** — упаковка приложения со всем окружением
- **ESLint + Prettier** — линтинг и форматирование

## Структура

```
src/
  api/            REST-клиент
  components/      layout / orders / products
  composables/     useClock, useSessionCounter
  router/          роуты (lazy)
  store/           Vuex: modules + persist (Web Storage)
  utils/           форматирование дат и сумм (+ .spec.ts)
  views/           OrdersView, ProductsView
server/            Express + Socket.io (REST + WS + раздача сборки)
```

## Требования

- Node.js **22+** и npm — для локального запуска
- либо **Docker** — для контейнерного запуска

## Установка

```bash
npm install
```

## Запуск (разработка)

Нужны два процесса — фронтенд (Vite) и сервер (REST + WS). Одной командой:

```bash
npm run dev:all
```

- фронтенд: http://localhost:5173
- API + WebSocket: http://localhost:4000 (Vite проксирует `/api` на него)

Либо по отдельности в двух терминалах:

```bash
npm run server   # Express + Socket.io на :4000
npm run dev       # Vite на :5173
```

> Порт сервера — **4000** (можно переопределить переменной `PORT`).
> При необходимости скопируйте `.env.example` в `.env`.

## Запуск (production, без Docker)

```bash
npm run build     # сборка фронтенда в dist/
npm run server    # сервер отдаёт dist/ + API + WS на :4000
```

Приложение целиком: http://localhost:4000

## Запуск через Docker

```bash
docker compose up --build
```

Открыть: http://localhost:4000

Или вручную:

```bash
docker build -t orders-products-spa .
docker run -p 4000:4000 orders-products-spa
```

## Тесты

```bash
npm test          # прогон Vitest
npm run test:watch
```

## Линт и формат

```bash
npm run lint
npm run format
```

## Авторизация

Приложение защищено JWT. При первом входе используйте демо-доступ:

```
логин:  admin
пароль: admin
```

Токен сохраняется в Web Storage; защищённые REST-роуты требуют заголовок
`Authorization: Bearer <token>`. Секрет можно задать переменной `JWT_SECRET`.

## API

| Метод  | Путь                | Доступ | Описание                          |
| ------ | ------------------- | ------ | --------------------------------- |
| POST   | `/api/auth/login`   | public | вход, возвращает `{ token, user }` |
| GET    | `/api/orders`       | JWT    | список приходов с продуктами      |
| GET    | `/api/orders/:id`   | JWT    | один приход                       |
| PUT    | `/api/orders/reorder` | JWT  | сохранить порядок приходов (`{ ids }`) |
| DELETE | `/api/orders/:id`   | JWT    | удалить приход                    |
| GET    | `/api/products`     | JWT    | все продукты (`?type=` — фильтр)  |

WebSocket (Socket.io) на том же порту вещает событие `sessions` с количеством
активных подключений при подключении/отключении вкладок.

## Хранение данных

Данные лежат в **SQLite** (файл `server/data.sqlite`, путь настраивается `DB_PATH`).
При первом запуске база заполняется демо-данными (25 приходов, продукты, группы,
пользователи). Изменения (создание/удаление/сортировка/CRUD) сохраняются и
переживают перезапуск. В Docker файл вынесен в volume `db-data`, поэтому
`docker compose down && up` не сбрасывает данные.

## Реализованный функционал

- Навигация между Orders и Products (роутинг + анимации переходов)
- TopMenu: дата/время в реальном времени + счётчик активных вкладок (Socket.io)
- Orders: список, раскрытие карточки прихода рядом со списком, продукты прихода,
  две даты создания, сумма прихода в двух валютах, попап удаления
- Drag-and-drop сортировка приходов (перетаскивание за иконку, порядок сохраняется)
- Products: список всех продуктов, фильтр по типу и спецификации, поля продукта
  (название, тип, гарантия в двух форматах, цена в двух валютах, название прихода)
- Авторизация по JWT: страница входа, защита роутов и REST API, выход
- Переключение языка (RU / UK / KK / EN) с сохранением выбора
- Сохранение выбранных фильтров в Web Storage
- Юнит-тесты на утилиты и геттеры стора
