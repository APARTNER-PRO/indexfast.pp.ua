-- ══════════════════════════════════════════════
--  IndexFast — schema_v4_indexes.sql
--  Повна оптимізація індексів і схеми
--  MySQL 8.0+ / MariaDB 10.6+
--  Запускати після schema_v1 + v2 + v3
-- ══════════════════════════════════════════════
SET NAMES utf8mb4;
SET foreign_key_checks = 0;   -- вимикаємо на час міграції
SET unique_checks      = 0;


-- ════════════════════════════════════════════════════════
--  АНАЛІЗ ПРОБЛЕМ (коментар для розуміння рішень)
-- ════════════════════════════════════════════════════════
--
--  users
--    ✗ Немає індексу на (is_active, plan) — фільтрація активних PRO/agency
--    ✗ Немає індексу на (last_login_at) — аналітика активності
--
--  tokens
--    ✗ Немає індексу на (expires_at, used_at) — воркер чистить протерміновані
--    ✓ uq_token, idx_user_type, idx_expires — є
--
--  rate_limits
--    ✗ last_attempt не індексований — cron очищення старих записів повільне
--    ✓ uq_ip_action — є (головний lookup)
--
--  sites
--    ✗ Немає покривного (covering) індексу для головного запиту dashboard:
--      SELECT id,domain,sitemap_url,status,total_urls,indexed_total,last_run_at
--      WHERE user_id=? ORDER BY created_at DESC
--    ✗ Немає індексу на (status) — для воркера / admin панелі
--    ✓ idx_user_id — є, але не covering
--
--  daily_usage
--    ✗ Немає індексу на (usage_date) — cleanup старих записів повільний
--    ✓ uq_user_date — є (головний lookup)
--    → Запит Plans::remaining(): WHERE user_id=? AND usage_date=? → покрито uq_user_date ✓
--    → Запит SUM за місяць: WHERE user_id=? AND usage_date>=... → потрібен composite idx
--
--  indexing_log
--    ✗ url VARCHAR(2048) — займає багато місця, пошук по url повільний
--    ✗ Немає індексу на (job_id, status) — воркер UPDATE WHERE job_id=? AND url=?
--    ✗ Немає індексу на (user_id, status, created_at) — фільтр логів по статусу
--    ✓ idx_user_date (user_id, created_at) — є
--    ✓ idx_site_id — є
--    → При мільйонах рядків потрібно PARTITIONING по місяцях
--
--  jobs
--    ✓ idx_worker (status, priority, available_at) — є, головний для воркера
--    ✓ idx_user_status (user_id, status, created_at) — є
--    ✓ idx_site_status (site_id, status) — є
--    ✗ Немає covering індексу для status.php: WHERE id=? AND user_id=?
--    ✗ payload JSON може бути великим — не індексується (це норма)
--
--  sessions
--    ✗ Немає індексу на (expires_at, user_id) — cleanup повільний
--    ✓ idx_user_id, idx_expires — є
-- ════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════
--  1. ТАБЛИЦЯ: users
-- ════════════════════════════════════════════════════════

-- Covering index для перевірки плану (використовується в кожному API запиті)
-- SELECT plan FROM users WHERE id=?  →  PRIMARY покриває ✓
-- SELECT id,name,surname,email,plan,avatar_url FROM users WHERE id=?  →  PRIMARY ✓

-- Для майбутньої аналітики і admin панелі
ALTER TABLE `users`
  ADD INDEX IF NOT EXISTS `idx_plan_active`    (`plan`, `is_active`),
  ADD INDEX IF NOT EXISTS `idx_created_at`     (`created_at`),
  ADD INDEX IF NOT EXISTS `idx_last_login`     (`last_login_at`);

-- Оптимізуємо типи (менше місця = швидше)
-- avatar_url VARCHAR(500) → VARCHAR(255) достатньо для URL
ALTER TABLE `users`
  MODIFY COLUMN `avatar_url` VARCHAR(255) DEFAULT NULL;


-- ════════════════════════════════════════════════════════
--  2. ТАБЛИЦЯ: tokens
-- ════════════════════════════════════════════════════════

-- Cleanup протермінованих токенів: DELETE WHERE expires_at < NOW() AND used_at IS NOT NULL
-- Існуючий idx_expires покриває expires_at, але не used_at
ALTER TABLE `tokens`
  ADD INDEX IF NOT EXISTS `idx_cleanup` (`expires_at`, `used_at`),
  -- Швидка інвалідація refresh токенів конкретного юзера
  ADD INDEX IF NOT EXISTS `idx_user_type_expires` (`user_id`, `type`, `expires_at`);


-- ════════════════════════════════════════════════════════
--  3. ТАБЛИЦЯ: rate_limits
-- ════════════════════════════════════════════════════════

-- Cleanup старих записів (cron): DELETE WHERE last_attempt < DATE_SUB(NOW(), INTERVAL 1 DAY)
ALTER TABLE `rate_limits`
  ADD INDEX IF NOT EXISTS `idx_last_attempt` (`last_attempt`);


-- ════════════════════════════════════════════════════════
--  4. ТАБЛИЦЯ: sites
-- ════════════════════════════════════════════════════════

-- Головний запит dashboard (виконується при кожному завантаженні):
-- SELECT id,domain,sitemap_url,status,error_message,total_urls,indexed_total,last_run_at
-- FROM sites WHERE user_id=? ORDER BY created_at DESC
--
-- Поточний idx_user_id(user_id) — не covering, MySQL читає дані з таблиці
-- Covering index включає всі поля запиту → zero table lookups
ALTER TABLE `sites`
  DROP INDEX IF EXISTS `idx_user_id`;   -- замінюємо на covering

ALTER TABLE `sites`
  -- Covering index для dashboard query
  ADD INDEX `idx_user_dashboard` (
    `user_id`,          -- WHERE
    `created_at`,       -- ORDER BY
    `status`,           -- SELECT
    `id`,               -- SELECT
    `domain`(64),       -- SELECT (prefix — VARCHAR(255) не можна повністю в index)
    `total_urls`,       -- SELECT
    `indexed_total`,    -- SELECT
    `last_run_at`       -- SELECT
  ),

  -- Для воркера і admin: пошук за статусом
  ADD INDEX IF NOT EXISTS `idx_status_updated` (`status`, `updated_at`),

  -- Пошук дублікату при додаванні сайту: WHERE user_id=? AND domain=?
  ADD UNIQUE KEY IF NOT EXISTS `uq_user_domain` (`user_id`, `domain`);

-- Видаляємо service_account з sites (тепер у site_credentials)
-- (зробимо тільки якщо ще не видалено)
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'sites'
    AND COLUMN_NAME  = 'service_account'
);

SET @sql = IF(@col_exists > 0,
  'ALTER TABLE `sites` DROP COLUMN `service_account`',
  'SELECT 1'  -- no-op
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ════════════════════════════════════════════════════════
--  5. ТАБЛИЦЯ: daily_usage
-- ════════════════════════════════════════════════════════

-- Запит SUM за поточний місяць (stats.php):
-- SELECT SUM(urls_sent) FROM daily_usage
-- WHERE user_id=? AND usage_date >= DATE_FORMAT(CURDATE(),'%Y-%m-01')
--
-- uq_user_date(user_id, usage_date) — вже є і покриває цей range scan ✓
-- Але SUM(urls_sent) не в індексі — додаємо covering:
ALTER TABLE `daily_usage`
  ADD INDEX IF NOT EXISTS `idx_user_date_sent` (`user_id`, `usage_date`, `urls_sent`),
  ADD INDEX IF NOT EXISTS `idx_usage_date`     (`usage_date`);  -- cleanup по даті


-- ════════════════════════════════════════════════════════
--  6. ТАБЛИЦЯ: indexing_log
-- ════════════════════════════════════════════════════════

-- Ця таблиця росте найшвидше — потенційно мільйони рядків
-- Поточна проблема: url VARCHAR(2048) — величезний рядок, не індексується добре

-- Додаємо url_hash для точного пошуку по URL
ALTER TABLE `indexing_log`
  ADD COLUMN IF NOT EXISTS `url_hash` CHAR(64) GENERATED ALWAYS AS (SHA2(`url`, 256)) STORED,
  ADD INDEX  IF NOT EXISTS `idx_url_hash` (`url_hash`);

-- Воркер виконує: UPDATE ... WHERE job_id=? AND url=?
-- Замінюємо на: UPDATE ... WHERE job_id=? AND url_hash=SHA2(?,256)
-- Composite для воркера
ALTER TABLE `indexing_log`
  DROP INDEX IF EXISTS `idx_job_id`,                        -- замінюємо
  ADD  INDEX IF NOT EXISTS `idx_job_url`    (`job_id`, `url_hash`),   -- воркер UPDATE
  ADD  INDEX IF NOT EXISTS `idx_job_status` (`job_id`, `status`);     -- прогрес job

-- Covering index для logs.php (GET логи по сайту):
-- SELECT id,url,status,http_status,error_msg,created_at
-- WHERE site_id=? ORDER BY created_at DESC LIMIT 50
ALTER TABLE `indexing_log`
  DROP INDEX IF EXISTS `idx_site_id`,                       -- замінюємо
  ADD  INDEX IF NOT EXISTS `idx_site_log` (
    `site_id`,
    `created_at`,    -- ORDER BY DESC
    `status`,        -- SELECT
    `http_status`    -- SELECT
  );

-- Covering index для логів юзера (без фільтру по сайту):
-- SELECT url,status,http_status,error_msg,created_at FROM indexing_log
-- JOIN sites ON ... WHERE user_id=? ORDER BY created_at DESC LIMIT 20
ALTER TABLE `indexing_log`
  DROP INDEX IF EXISTS `idx_user_date`,                     -- замінюємо
  ADD  INDEX IF NOT EXISTS `idx_user_log` (
    `user_id`,
    `created_at`,
    `status`,
    `http_status`,
    `site_id`        -- для JOIN без table lookup на sites
  );


-- ── PARTITIONING indexing_log по місяцях
-- При > 1M рядків партиціонування дає 10-100x приріст на range запитах по created_at
-- УВАГА: видаляє і відновлює таблицю — запускати в maintenance window!
--
-- Для увімкнення розкоментуйте блок нижче:
--
-- ALTER TABLE `indexing_log`
--   PARTITION BY RANGE (YEAR(`created_at`) * 100 + MONTH(`created_at`)) (
--     PARTITION p202501 VALUES LESS THAN (202502),
--     PARTITION p202502 VALUES LESS THAN (202503),
--     PARTITION p202503 VALUES LESS THAN (202504),
--     PARTITION p202504 VALUES LESS THAN (202505),
--     PARTITION p202505 VALUES LESS THAN (202506),
--     PARTITION p202506 VALUES LESS THAN (202507),
--     PARTITION p202507 VALUES LESS THAN (202508),
--     PARTITION p202508 VALUES LESS THAN (202509),
--     PARTITION p202509 VALUES LESS THAN (202510),
--     PARTITION p202510 VALUES LESS THAN (202511),
--     PARTITION p202511 VALUES LESS THAN (202512),
--     PARTITION p202512 VALUES LESS THAN (202601),
--     PARTITION p202601 VALUES LESS THAN (202602),
--     PARTITION p202602 VALUES LESS THAN (202603),
--     PARTITION p202603 VALUES LESS THAN (202604),
--     PARTITION p_future VALUES LESS THAN MAXVALUE
--   );
--
-- Додавати нові партиції щомісяця:
-- ALTER TABLE `indexing_log`
--   REORGANIZE PARTITION p_future INTO (
--     PARTITION p202604 VALUES LESS THAN (202605),
--     PARTITION p_future VALUES LESS THAN MAXVALUE
--   );


-- ════════════════════════════════════════════════════════
--  7. ТАБЛИЦЯ: jobs
-- ════════════════════════════════════════════════════════

-- Поточні індекси добрі. Додаємо:
-- status.php: SELECT j.* FROM jobs j WHERE j.id=? AND j.user_id=?
ALTER TABLE `jobs`
  ADD INDEX IF NOT EXISTS `idx_id_user` (`id`, `user_id`);

-- Covering для dashboard (активний job для сайту):
-- SELECT id FROM jobs WHERE site_id=? AND user_id=? AND status IN ('pending','processing')
ALTER TABLE `jobs`
  DROP INDEX IF EXISTS `idx_site_status`,
  ADD  INDEX IF NOT EXISTS `idx_site_user_status` (`site_id`, `user_id`, `status`);

-- Covering для user dashboard (список jobs):
-- SELECT id,status,total,sent,failed,created_at,finished_at FROM jobs
-- WHERE user_id=? AND status=? ORDER BY created_at DESC
ALTER TABLE `jobs`
  DROP INDEX IF EXISTS `idx_user_status`,
  ADD  INDEX IF NOT EXISTS `idx_user_status_cover` (
    `user_id`,
    `status`,
    `created_at`,
    `total`,
    `sent`,
    `failed`,
    `finished_at`
  );


-- ════════════════════════════════════════════════════════
--  8. ТАБЛИЦЯ: sessions
-- ════════════════════════════════════════════════════════

-- Cleanup: DELETE FROM sessions WHERE expires_at < NOW()
-- idx_expires вже є ✓
-- Covering для перевірки сесії: WHERE id=? — PRIMARY ✓

-- Додаємо для cleanup з урахуванням user_id (якщо потрібне logout all devices):
ALTER TABLE `sessions`
  ADD INDEX IF NOT EXISTS `idx_user_expires` (`user_id`, `expires_at`);


-- ════════════════════════════════════════════════════════
--  9. ТАБЛИЦЯ: site_credentials
-- ════════════════════════════════════════════════════════

-- PRIMARY KEY (site_id) вже є і покриває всі запити ✓
-- Немає що додавати — таблиця проста і маленька


-- ════════════════════════════════════════════════════════
--  10. АНАЛІЗ ЗАПИТІВ ЧЕРЕЗ EXPLAIN
--  (запустити вручну для перевірки ефективності індексів)
-- ════════════════════════════════════════════════════════

-- EXPLAIN SELECT id,domain,sitemap_url,status,error_message,total_urls,indexed_total,last_run_at
--   FROM sites WHERE user_id=1 ORDER BY created_at DESC;
-- → Очікуємо: type=ref, key=idx_user_dashboard, Extra=Using index

-- EXPLAIN SELECT urls_sent,urls_limit FROM daily_usage WHERE user_id=1 AND usage_date='2026-03-13';
-- → Очікуємо: type=const, key=uq_user_date

-- EXPLAIN SELECT * FROM jobs WHERE status='pending' AND available_at<=NOW()
--   ORDER BY priority ASC, available_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED;
-- → Очікуємо: type=range, key=idx_worker

-- EXPLAIN SELECT url,status,http_status,created_at FROM indexing_log
--   WHERE site_id=1 ORDER BY created_at DESC LIMIT 50;
-- → Очікуємо: type=ref, key=idx_site_log, Extra=Using index


-- ════════════════════════════════════════════════════════
--  11. InnoDB ENGINE налаштування (my.cnf)
-- ════════════════════════════════════════════════════════
-- Ці параметри не можна задати через SQL в MySQL 8 — тільки my.cnf або SET PERSIST

-- Виконати одноразово якщо MySQL 8.0 і є права SUPER:
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_buffer_pool_size         = 536870912;  -- 512MB (50-70% RAM сервера)
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_buffer_pool_instances    = 4;           -- по 128MB кожен
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_log_buffer_size          = 67108864;   -- 64MB
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_flush_log_at_trx_commit  = 2;          -- менш строго, +30% швидкість writes
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_io_capacity              = 2000;        -- SSD IOPS
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_io_capacity_max          = 4000;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_read_io_threads          = 8;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST innodb_write_io_threads         = 8;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST max_connections                 = 300;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST thread_cache_size               = 32;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST table_open_cache                = 4000;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST sort_buffer_size                = 4194304;    -- 4MB
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST join_buffer_size                = 4194304;    -- 4MB
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST tmp_table_size                  = 67108864;   -- 64MB
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST max_heap_table_size             = 67108864;   -- 64MB

-- Повільні запити: логувати все що > 1s
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST slow_query_log                  = 1;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST long_query_time                 = 1;
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST slow_query_log_file             = '/var/log/mysql/slow.log';
-- [SHARED-HOSTING: не підтримується] -- SET PERSIST log_queries_not_using_indexes   = 1;


SET foreign_key_checks = 1;
SET unique_checks      = 1;
