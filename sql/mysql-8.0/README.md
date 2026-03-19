# SQL міграції — MySQL 8.0+

Використовуй ці файли якщо у тебе MySQL 8.0 або вище.

## Порядок виконання

```
schema.sql              ← [1] основні таблиці (users, tokens, sessions)
schema_v2.sql           ← [2] sites, indexing_log, daily_usage
schema_v3.sql           ← [3] jobs, site_credentials
schema_v4_indexes.sql   ← [4] оптимізація індексів (covering, url_hash)
```

## Що є в цих файлах

- `ADD COLUMN IF NOT EXISTS` — безпечне додавання колонок
- `DROP INDEX IF EXISTS` — безпечне видалення індексів
- `ROW_NUMBER() OVER (PARTITION BY ...)` — в schema_v4
- `FOR UPDATE SKIP LOCKED` — в worker.php (атомарне захоплення jobs)
- `GENERATED ALWAYS AS (SHA2(...))` — url_hash колонка
