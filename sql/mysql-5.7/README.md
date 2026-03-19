# SQL міграції — MySQL 5.7

Використовуй ці файли якщо у тебе MySQL 5.7.

## Порядок виконання

```
schema.sql              ← [1] основні таблиці (users, tokens, sessions)
schema_v2.sql           ← [2] sites, indexing_log, daily_usage
schema_v3.sql           ← [3] jobs, site_credentials
schema_v4_indexes.sql   ← [4] оптимізація індексів
```

Після виконання SQL — скопіюй `worker.php` з цієї папки
замість `worker/worker.php` в деплої.

## Відмінності від MySQL 8.0

| Конструкція | MySQL 8.0 | MySQL 5.7 |
|---|---|---|
| `ADD COLUMN IF NOT EXISTS` | ✅ | ❌ → `ADD COLUMN` |
| `DROP INDEX IF EXISTS` | ✅ | ❌ → `DROP INDEX` |
| `SKIP LOCKED` | ✅ | ❌ → прибрано |
| `ROW_NUMBER() OVER()` | ✅ | ❌ → в PHP окремим запитом |
| `GENERATED ALWAYS AS` | ✅ | ✅ |

## Важливо

Якщо якийсь ALTER TABLE падає з помилкою "Duplicate column name"
або "Can't DROP ... doesn't exist" — це означає що міграція вже
частково виконувалась. Просто пропусти цей рядок і продовжуй.
