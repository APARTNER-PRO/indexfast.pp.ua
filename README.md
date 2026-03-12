# IndexFast — Backend Auth

PHP бекенд для авторизації: реєстрація, вхід, скидання пароля, Google OAuth.

---

## Структура файлів

```
/
├── .env                        ← твої налаштування (не в git!)
├── .env.example                ← шаблон
├── .htaccess                   ← захист, headers
│
├── api/
│   ├── config.php              ← всі константи
│   ├── db.php                  ← PDO singleton
│   ├── helpers.php             ← JWT, Email, RateLimit, Token
│   ├── middleware.php          ← CORS, JSON headers, requireAuth()
│   │
│   └── auth/
│       ├── register.php        ← POST /api/auth/register.php
│       ├── login.php           ← POST /api/auth/login.php
│       ├── forgot.php          ← POST /api/auth/forgot.php
│       ├── reset.php           ← POST /api/auth/reset.php
│       ├── verify-email.php    ← GET  /api/auth/verify-email.php?token=
│       ├── me.php              ← GET  /api/auth/me.php
│       └── google/
│           ├── redirect.php    ← GET  /api/auth/google/redirect.php
│           └── callback.php    ← GET  /api/auth/google/callback.php
│
└── sql/
    └── schema.sql              ← CREATE TABLE
```

---

## Встановлення

### 1. База даних

```sql
CREATE DATABASE indexfast CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'indexfast_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON indexfast.* TO 'indexfast_user'@'localhost';
FLUSH PRIVILEGES;
```

Потім імпортуй схему:
```bash
mysql -u indexfast_user -p indexfast < sql/schema.sql
```

### 2. .env файл

```bash
cp .env.example .env
nano .env   # заповни всі значення
```

### 3. Google OAuth

1. Відкрий [Google Cloud Console](https://console.cloud.google.com/)
2. Створи проєкт або вибери існуючий
3. **APIs & Services → OAuth consent screen** — заповни назву, email
4. **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://indexfast.pp.ua/api/auth/google/callback.php`
5. Скопіюй Client ID та Client Secret в `.env`

### 4. SMTP Email (Gmail)

1. Google Account → Security → **2-Step Verification** (увімкни)
2. Security → **App passwords** → Select app: Mail → Generate
3. Скопіюй 16-символьний пароль в `.env` як `SMTP_PASS`

---

## API Endpoints

### Реєстрація
```
POST /api/auth/register.php
Content-Type: application/json

{ "name": "Дмитро", "surname": "Коваль", "email": "d@example.com", "password": "pass123!" }

→ 200: { success, message, access_token, refresh_token, user }
→ 409: email вже існує
→ 422: валідація
→ 429: rate limit
```

### Вхід
```
POST /api/auth/login.php
Content-Type: application/json

{ "email": "d@example.com", "password": "pass123!" }

→ 200: { success, message, access_token, refresh_token, user }
→ 401: невірний email або пароль
→ 429: rate limit (5 спроб / 15 хв)
```

### Забутий пароль
```
POST /api/auth/forgot.php
{ "email": "d@example.com" }

→ 200: завжди успіх (anti-enumeration)
```

### Скидання пароля
```
POST /api/auth/reset.php
{ "token": "...", "password": "newpass123!" }

→ 200: пароль змінено
→ 400: токен невалідний/прострочений
```

### Поточний користувач
```
GET /api/auth/me.php
Authorization: Bearer <access_token>

→ 200: { success, user }
→ 401: не авторизований
```

### Google OAuth
```
GET /api/auth/google/redirect.php   ← відправляє на Google
GET /api/auth/google/callback.php   ← Google повертає сюди
  → Редіректить на /dashboard/#token=...&refresh=...
```

---

## Безпека

- **Паролі**: bcrypt cost=12
- **JWT**: HS256, access TTL=1год, refresh TTL=30 днів
- **Rate limiting**: DB-based (login: 5/15хв, register: 3/год, forgot: 3/год)
- **Timing attack**: `usleep(random_int(...))` при невірному паролі
- **CSRF**: state токен для Google OAuth
- **Anti-enumeration**: forgot завжди повертає успіх
- **SQL injection**: тільки PDO prepared statements
- **XSS**: `htmlspecialchars()` для всіх вхідних даних
- **.env**: захищений через .htaccess

---

## Підключення до фронтенду (auth.html)

В `auth.html` замінити `handleLogin()`, `handleRegister()` та `handleForgot()` на реальні fetch запити:

```javascript
async function handleLogin() {
    const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
        localStorage.setItem('access_token', data.access_token);
        window.location.href = '/dashboard/';
    } else {
        showAlert('login-error', data.message);
    }
}
```

---

## Вимоги

- PHP 8.1+
- MySQL 8.0+ або MariaDB 10.5+
- Модуль `mod_rewrite` (Apache)
- PHP extensions: `pdo_mysql`, `curl`, `openssl`, `json`
- (Опційно) PHPMailer для SMTP: `composer require phpmailer/phpmailer`
