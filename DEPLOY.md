# IndexFast — Інструкція деплою на Shared Hosting

## Що є в цьому архіві

```
indexfast-deploy/
├── public_html/          ← завантажити на хостинг (сюди)
│   ├── api/              ← PHP бекенд
│   │   ├── auth/         ← реєстрація, логін, Google OAuth
│   │   ├── dashboard/    ← статистика дашборду
│   │   ├── indexing/     ← запуск індексації, логи, статус job
│   │   └── sites/        ← управління сайтами
│   ├── blog/             ← статті блогу
│   ├── dashboard/        ← React SPA (після npm run build)
│   ├── index.html        ← головна лендінг
│   ├── auth.html         ← сторінка авторизації
│   └── ...               ← решта HTML сторінок
├── worker/               ← PHP воркер черги (НЕ в public_html)
│   ├── worker.php        ← головний воркер (cron)
│   ├── cleanup.php       ← очищення старих даних (cron)
│   └── health.php        ← перевірка стану (cron)
├── sql/                  ← SQL міграції (запустити один раз)
│   ├── schema.sql        ← [1] основні таблиці
│   ├── schema_v2.sql     ← [2] sites, indexing_log, daily_usage
│   ├── schema_v3.sql     ← [3] jobs, site_credentials
│   └── schema_v4_indexes.sql ← [4] оптимізація індексів
├── frontend/             ← React вихідний код (для збірки)
├── .env.example          ← шаблон змінних середовища
└── DEPLOY.md             ← ця інструкція
```

---

## Крок 1. Перевірка хостингу

Перед деплоєм переконайтесь що хостинг підтримує:

| Вимога | Перевірка |
|--------|-----------|
| PHP 8.1+ | Hostinger → hPanel → PHP Configuration |
| MySQL 8.0+ | hPanel → Databases → перевір версію |
| Cron Jobs | hPanel → Advanced → Cron Jobs |
| OPcache | має бути увімкнено за замовчуванням |

> **Hostinger Business і вище** — все вище є. ✅

---

## Крок 2. База даних

### 2.1 Створи БД на хостингу

**Hostinger hPanel:**
1. Databases → MySQL Databases
2. Create new database: `indexfast_db`
3. Create new user: `indexfast_user` + сильний пароль
4. Add user to database → All Privileges

### 2.2 Виконай SQL міграції (у порядку!)

**Варіант A — через phpMyAdmin:**
1. hPanel → Databases → phpMyAdmin
2. Вибери базу `indexfast_db`
3. Вкладка "SQL" → вставити вміст файлу → Execute
4. Повтори для кожного файлу по порядку:

```
sql/schema.sql             ← спочатку
sql/schema_v2.sql          ← потім
sql/schema_v3.sql          ← потім
sql/schema_v4_indexes.sql  ← останній
```

**Варіант B — через SSH (якщо є):**
```bash
mysql -u indexfast_user -p indexfast_db < sql/schema.sql
mysql -u indexfast_user -p indexfast_db < sql/schema_v2.sql
mysql -u indexfast_user -p indexfast_db < sql/schema_v3.sql
mysql -u indexfast_user -p indexfast_db < sql/schema_v4_indexes.sql
```

---

## Крок 3. Налаштування .env

### 3.1 Створи файл .env

Скопіюй `.env.example` → `.env`:
```bash
cp .env.example .env
```

### 3.2 Заповни значення

```env
APP_URL=https://indexfast.pp.ua   # твій домен

DB_HOST=localhost
DB_NAME=indexfast_db              # назва бази з кроку 2.1
DB_USER=indexfast_user            # юзер бази
DB_PASS=твій_пароль

# Згенеруй: openssl rand -hex 32
JWT_SECRET=вставити_32_символи_випадкового_рядка

# SMTP — для листів підтвердження
SMTP_USER=your@gmail.com
SMTP_PASS=16_символів_app_password
MAIL_FROM=noreply@indexfast.pp.ua
```

### 3.3 Де розмістити .env

**.env має бути на ОДИН рівень ВИЩЕ public_html:**
```
/home/username/          ← .env сюди
/home/username/public_html/  ← сайт тут
```

**Hostinger — через File Manager:**
1. hPanel → File Manager
2. Перейди в `/home/username/` (корінь акаунту, НЕ public_html)
3. New File → `.env` → вставити вміст

> **Чому не в public_html?** Файл .env не повинен бути доступний через браузер.
> config.php шукає .env в `dirname(__DIR__, 2)` від папки `/api/` — це і є корінь акаунту.

---

## Крок 4. Завантаження файлів

### 4.1 Завантаж вміст папки `public_html/` на хостинг

**Через File Manager (Hostinger):**
1. Заархівуй папку `public_html/` → `public_html.zip`
2. hPanel → File Manager → відкрий `/home/username/public_html/`
3. Upload → вибери `public_html.zip` → Extract here

**Через FTP (FileZilla):**
```
Host:     ftp.indexfast.pp.ua або IP хостингу
Port:     21
User:     FTP логін з hPanel
Pass:     FTP пароль
```
Завантаж вміст папки `public_html/` в `/home/username/public_html/`

### 4.2 Завантаж worker/ на хостинг (поза public_html)

Папка `worker/` має бути **поза** публічною директорією:
```
/home/username/worker/worker.php   ← сюди
/home/username/worker/cleanup.php
/home/username/worker/health.php
```

> Якщо немає доступу поза public_html — розмісти в `public_html/worker/`
> і додай в `public_html/worker/.htaccess`:
> ```
> Order Deny,Allow
> Deny from all
> ```

---

## Крок 5. Cron Jobs

**Hostinger hPanel → Advanced → Cron Jobs**

Додай три завдання:

### Воркер черги (кожну хвилину)
```
* * * * *
```
Команда:
```
/usr/local/bin/php /home/USERNAME/worker/worker.php >> /home/USERNAME/logs/worker.log 2>&1
```

### Очищення (щодня о 03:00)
```
0 3 * * *
```
Команда:
```
/usr/local/bin/php /home/USERNAME/worker/cleanup.php >> /home/USERNAME/logs/cleanup.log 2>&1
```

### Health check (кожні 5 хвилин)
```
*/5 * * * *
```
Команда:
```
/usr/local/bin/php /home/USERNAME/worker/health.php >> /home/USERNAME/logs/health.log 2>&1
```

> ⚠️ Замін `USERNAME` на свій логін Hostinger (видно в File Manager у шляху `/home/USERNAME/`)

> ⚠️ Шлях до PHP на Hostinger: `/usr/local/bin/php`
> Для перевірки: SSH → `which php`

### Створи папку для логів
```
/home/USERNAME/logs/
```
Через File Manager: New Folder → `logs`

---

## Крок 6. React Dashboard

### 6.1 Встанови Node.js локально (якщо немає)
```bash
# Windows: https://nodejs.org (LTS версія)
# Mac: brew install node
```

### 6.2 Зроби білд
```bash
cd frontend/
npm install
npm run build
```

Результат з'явиться у `frontend/../public_html/app/` — **одразу в правильному місці**.

### 6.3 Завантаж на хостинг
Вміст папки `public_html/app/` вже готовий — завантаж разом з рештою `public_html/`.

### 6.4 URL після білду

| URL | Що |
|-----|-----|
| `/app/login` | Вхід |
| `/app/register` | Реєстрація |
| `/app/forgot` | Відновлення пароля |
| `/app/dashboard` | Особистий кабінет |

> Якщо немає Node.js локально — напиши, зберемо білд окремо.

---

## Крок 7. Перевірка після деплою

### 7.1 Перевір API
Відкрий у браузері:
```
https://indexfast.pp.ua/api/db_check.php?token=ТВІЙтокенЗ.env
```
Має показати таблиці і ✅ для параметрів MySQL.
Після перевірки — **видали** `public_html/api/db_check.php`.

### 7.2 Перевір авторизацію
```
https://indexfast.pp.ua/auth.html
```
Зареєструйся → має перенаправити на `/dashboard/`

### 7.3 Перевір лендінг
```
https://indexfast.pp.ua/
```

### 7.4 Перевір воркер
Через phpMyAdmin → таблиця `jobs`:
1. Додай тестовий сайт через дашборд
2. Натисни "Запустити індексацію"
3. Через 1-2 хвилини перевір чи з'явились записи в таблиці `indexing_log`

---

## Часті проблеми

### "Database connection error"
→ Перевір значення DB_* в `.env`
→ Переконайся що `.env` у `/home/USERNAME/` (не в public_html)

### "Unauthorized: відсутній токен"
→ JWT_SECRET не заповнений або порожній
→ Перевір що `.env` читається (db_check.php покаже)

### Воркер не запускається
→ Перевір шлях до PHP: `which php` через SSH або питай підтримку Hostinger
→ Перевір що `/home/USERNAME/logs/` існує і доступна для запису

### Google OAuth не працює
→ GOOGLE_CLIENT_ID і GOOGLE_CLIENT_SECRET не заповнені
→ Authorized redirect URI в Google Console: `https://indexfast.pp.ua/api/auth/google/callback.php`

### SKIP LOCKED помилка
→ Хостинг має MySQL старіше 8.0
→ Напиши підтримці Hostinger щоб оновили MySQL до 8.0

### React dashboard показує білий екран
→ Перевір що білд зроблено (`npm run build`)
→ Перевір що файли у `/dashboard/` (не в підпапці)
→ Відкрий консоль браузера (F12) — подивись на помилки

---

## Структура URL після деплою

| URL | Що |
|-----|----|
| `https://indexfast.pp.ua/` | Лендінг |
| `https://indexfast.pp.ua/auth.html` | Вхід / Реєстрація |
| `https://indexfast.pp.ua/dashboard/` | Особистий кабінет (React) |
| `https://indexfast.pp.ua/api/auth/login.php` | API: логін |
| `https://indexfast.pp.ua/api/auth/register.php` | API: реєстрація |
| `https://indexfast.pp.ua/api/dashboard/stats.php` | API: статистика |
| `https://indexfast.pp.ua/api/sites/index.php` | API: сайти |
| `https://indexfast.pp.ua/api/indexing/run.php` | API: запуск індексації |
| `https://indexfast.pp.ua/blog/` | Блог |

---

## Розділення Frontend і Backend на різні хостинги

### Backend (API) — окремий хостинг/домен

1. Завантаж тільки папку `public_html/api/` на бекенд хостинг
2. У `.env` бекенду вкажи:
   ```env
   APP_URL=https://api.indexfast.pp.ua
   FRONTEND_URL=https://indexfast.pp.ua
   ```
   `FRONTEND_URL` — домен(и) де розміщений frontend (для CORS).
   Кілька доменів через кому:
   ```env
   FRONTEND_URL=https://indexfast.pp.ua,https://app.indexfast.com
   ```

### Frontend — окремий хостинг (Vercel, Netlify, GitHub Pages)

1. Створи файл `frontend/.env.local`:
   ```env
   VITE_API_URL=https://api.indexfast.pp.ua/api
   ```
2. Збери React:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. Завантаж `dist/dashboard/` на frontend хостинг

### auth.html — вказати API домен

Якщо `auth.html` на іншому домені ніж API, додай атрибут до `<body>`:
```html
<body data-api-url="https://api.indexfast.pp.ua/api">
```

### Лендінг + Auth (статичний хостинг)

Можна розмістити на Vercel/Netlify:
- `public_html/*.html` (крім `api/`)
- `public_html/blog/`
- `public_html/dashboard/` (після npm run build)

`vercel.json` вже є в архіві з правильними redirects.
