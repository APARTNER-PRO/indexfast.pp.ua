-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: MySQL-5.7
-- Generation Time: Mar 21, 2026 at 07:38 PM
-- Server version: 5.7.44
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `indexfast`
--

-- --------------------------------------------------------

--
-- Table structure for table `daily_usage`
--

CREATE TABLE `daily_usage` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `usage_date` date NOT NULL,
  `urls_sent` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `urls_limit` smallint(5) UNSIGNED NOT NULL DEFAULT '20',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `daily_usage`
--

INSERT INTO `daily_usage` (`id`, `user_id`, `usage_date`, `urls_sent`, `urls_limit`, `updated_at`) VALUES
(48, 1, '2026-03-19', 25, 100, '2026-03-19 12:25:55'),
(131, 2, '2026-03-19', 3, 20, '2026-03-19 14:58:18'),
(132, 2, '2026-03-20', 0, 20, '2026-03-20 09:05:09'),
(134, 1, '2026-03-20', 0, 500, '2026-03-20 09:31:26'),
(135, 1, '2026-03-21', 79, 5000, '2026-03-21 12:06:59');

-- --------------------------------------------------------

--
-- Table structure for table `indexing_log`
--

CREATE TABLE `indexing_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `site_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(2048) NOT NULL,
  `status` enum('ok','error','pending') NOT NULL DEFAULT 'pending',
  `http_status` smallint(5) UNSIGNED DEFAULT NULL,
  `error_msg` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `job_id` bigint(20) UNSIGNED DEFAULT NULL,
  `url_hash` char(64) GENERATED ALWAYS AS (sha2(`url`,256)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `indexing_log`
--

INSERT INTO `indexing_log` (`id`, `site_id`, `user_id`, `url`, `status`, `http_status`, `error_msg`, `created_at`, `job_id`) VALUES
(36, 4, 2, 'https://indexfast.pp.ua/', 'pending', NULL, NULL, '2026-03-19 14:58:18', 4),
(37, 4, 2, 'https://indexfast.pp.ua/about.html', 'pending', NULL, NULL, '2026-03-19 14:58:18', 4),
(38, 4, 2, 'https://indexfast.pp.ua/affiliate.html', 'pending', NULL, NULL, '2026-03-19 14:58:18', 4),
(39, 6, 1, 'https://indexfast.pp.ua/', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(40, 6, 1, 'https://indexfast.pp.ua/about.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(41, 6, 1, 'https://indexfast.pp.ua/affiliate.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(42, 6, 1, 'https://indexfast.pp.ua/docs/', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(43, 6, 1, 'https://indexfast.pp.ua/blog/', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(44, 6, 1, 'https://indexfast.pp.ua/status.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(45, 6, 1, 'https://indexfast.pp.ua/privacy-policy.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(46, 6, 1, 'https://indexfast.pp.ua/terms.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(47, 6, 1, 'https://indexfast.pp.ua/blog/yak-pryskoriti-indeksaciyu-saitu-v-google.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(48, 6, 1, 'https://indexfast.pp.ua/blog/shcho-take-sitemap-xml.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(49, 6, 1, 'https://indexfast.pp.ua/blog/google-search-console-posibnyk.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(50, 6, 1, 'https://indexfast.pp.ua/blog/cron-jobs-dlya-seo.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(51, 6, 1, 'https://indexfast.pp.ua/blog/core-web-vitals-2025.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(65, 8, 1, 'https://hirewebdeveloper.pp.ua/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(66, 8, 1, 'https://hirewebdeveloper.pp.ua/en/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(67, 8, 1, 'https://hirewebdeveloper.pp.ua/about.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(68, 8, 1, 'https://hirewebdeveloper.pp.ua/en/about.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(69, 8, 1, 'https://hirewebdeveloper.pp.ua/services/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(70, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(71, 8, 1, 'https://hirewebdeveloper.pp.ua/services/laravel.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(72, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/laravel.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(73, 8, 1, 'https://hirewebdeveloper.pp.ua/services/php.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(74, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/php.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(75, 8, 1, 'https://hirewebdeveloper.pp.ua/services/fullstack.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(76, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/fullstack.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(77, 8, 1, 'https://hirewebdeveloper.pp.ua/services/api.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(78, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/api.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(79, 8, 1, 'https://hirewebdeveloper.pp.ua/pricing.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(80, 8, 1, 'https://hirewebdeveloper.pp.ua/en/pricing.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(81, 8, 1, 'https://hirewebdeveloper.pp.ua/stack/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(82, 8, 1, 'https://hirewebdeveloper.pp.ua/en/stack/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(83, 8, 1, 'https://hirewebdeveloper.pp.ua/fullstack.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(84, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(85, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(86, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/laravel-vs-symfony.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(87, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/laravel-vs-symfony.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(88, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/laravel-rest-api-tutorial.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(89, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/laravel-rest-api-tutorial.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(90, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/prestashop-vs-woocommerce.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(91, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/prestashop-vs-woocommerce.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(92, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/how-to-hire-developer-ukraine.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(93, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/how-to-hire-developer-ukraine.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(94, 8, 1, 'https://hirewebdeveloper.pp.ua/404.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(95, 8, 1, 'https://hirewebdeveloper.pp.ua/en/404.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(96, 8, 1, 'https://hirewebdeveloper.pp.ua/services/docker.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(97, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/docker.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(98, 8, 1, 'https://hirewebdeveloper.pp.ua/services/filament.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(99, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/filament.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(100, 8, 1, 'https://hirewebdeveloper.pp.ua/services/livewire.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(101, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/livewire.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(102, 8, 1, 'https://hirewebdeveloper.pp.ua/services/prestashop.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(103, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/prestashop.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(104, 8, 1, 'https://hirewebdeveloper.pp.ua/services/vuejs.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(105, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/vuejs.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(106, 8, 1, 'https://hirewebdeveloper.pp.ua/services/woocommerce.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(107, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/woocommerce.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(108, 8, 1, 'https://hirewebdeveloper.pp.ua/services/wordpress.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(109, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/wordpress.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(110, 8, 1, 'https://hirewebdeveloper.pp.ua/docker.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(111, 8, 1, 'https://hirewebdeveloper.pp.ua/filament.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(112, 8, 1, 'https://hirewebdeveloper.pp.ua/laravel.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(113, 8, 1, 'https://hirewebdeveloper.pp.ua/livewire.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(114, 8, 1, 'https://hirewebdeveloper.pp.ua/php.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(115, 8, 1, 'https://hirewebdeveloper.pp.ua/prestashop.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(116, 8, 1, 'https://hirewebdeveloper.pp.ua/vuejs.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(117, 8, 1, 'https://hirewebdeveloper.pp.ua/api.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `site_id` int(10) UNSIGNED NOT NULL,
  `type` enum('index_urls') NOT NULL DEFAULT 'index_urls',
  `payload` json NOT NULL,
  `status` enum('pending','processing','done','failed','cancelled') NOT NULL DEFAULT 'pending',
  `priority` tinyint(3) UNSIGNED NOT NULL DEFAULT '5',
  `total` smallint(5) UNSIGNED NOT NULL DEFAULT '0',
  `sent` smallint(5) UNSIGNED NOT NULL DEFAULT '0',
  `failed` smallint(5) UNSIGNED NOT NULL DEFAULT '0',
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `max_attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT '3',
  `last_error` varchar(500) DEFAULT NULL,
  `available_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `user_id`, `site_id`, `type`, `payload`, `status`, `priority`, `total`, `sent`, `failed`, `attempts`, `max_attempts`, `last_error`, `available_at`, `started_at`, `finished_at`, `created_at`) VALUES
(4, 2, 4, 'index_urls', '{\"urls\": [\"https://indexfast.pp.ua/\", \"https://indexfast.pp.ua/about.html\", \"https://indexfast.pp.ua/affiliate.html\"]}', 'done', 5, 3, 3, 0, 3, 3, 'Token error', '2026-03-19 14:58:18', '2026-03-21 11:57:11', '2026-03-21 11:57:13', '2026-03-19 14:58:18'),
(5, 1, 6, 'index_urls', '{\"urls\": [\"https://indexfast.pp.ua/\", \"https://indexfast.pp.ua/about.html\", \"https://indexfast.pp.ua/affiliate.html\", \"https://indexfast.pp.ua/docs/\", \"https://indexfast.pp.ua/blog/\", \"https://indexfast.pp.ua/status.html\", \"https://indexfast.pp.ua/privacy-policy.html\", \"https://indexfast.pp.ua/terms.html\", \"https://indexfast.pp.ua/blog/yak-pryskoriti-indeksaciyu-saitu-v-google.html\", \"https://indexfast.pp.ua/blog/shcho-take-sitemap-xml.html\", \"https://indexfast.pp.ua/blog/google-search-console-posibnyk.html\", \"https://indexfast.pp.ua/blog/cron-jobs-dlya-seo.html\", \"https://indexfast.pp.ua/blog/core-web-vitals-2025.html\"]}', 'done', 1, 13, 13, 0, 3, 3, 'Token error', '2026-03-21 10:39:06', '2026-03-21 11:57:05', '2026-03-21 11:57:11', '2026-03-21 10:39:06'),
(7, 1, 8, 'index_urls', '{\"urls\": [\"https://hirewebdeveloper.pp.ua/\", \"https://hirewebdeveloper.pp.ua/en/\", \"https://hirewebdeveloper.pp.ua/about.html\", \"https://hirewebdeveloper.pp.ua/en/about.html\", \"https://hirewebdeveloper.pp.ua/services/\", \"https://hirewebdeveloper.pp.ua/en/services/\", \"https://hirewebdeveloper.pp.ua/services/laravel.html\", \"https://hirewebdeveloper.pp.ua/en/services/laravel.html\", \"https://hirewebdeveloper.pp.ua/services/php.html\", \"https://hirewebdeveloper.pp.ua/en/services/php.html\", \"https://hirewebdeveloper.pp.ua/services/fullstack.html\", \"https://hirewebdeveloper.pp.ua/en/services/fullstack.html\", \"https://hirewebdeveloper.pp.ua/services/api.html\", \"https://hirewebdeveloper.pp.ua/en/services/api.html\", \"https://hirewebdeveloper.pp.ua/pricing.html\", \"https://hirewebdeveloper.pp.ua/en/pricing.html\", \"https://hirewebdeveloper.pp.ua/stack/\", \"https://hirewebdeveloper.pp.ua/en/stack/\", \"https://hirewebdeveloper.pp.ua/fullstack.html\", \"https://hirewebdeveloper.pp.ua/blog/\", \"https://hirewebdeveloper.pp.ua/en/blog/\", \"https://hirewebdeveloper.pp.ua/blog/laravel-vs-symfony.html\", \"https://hirewebdeveloper.pp.ua/en/blog/laravel-vs-symfony.html\", \"https://hirewebdeveloper.pp.ua/blog/laravel-rest-api-tutorial.html\", \"https://hirewebdeveloper.pp.ua/en/blog/laravel-rest-api-tutorial.html\", \"https://hirewebdeveloper.pp.ua/blog/prestashop-vs-woocommerce.html\", \"https://hirewebdeveloper.pp.ua/en/blog/prestashop-vs-woocommerce.html\", \"https://hirewebdeveloper.pp.ua/blog/how-to-hire-developer-ukraine.html\", \"https://hirewebdeveloper.pp.ua/en/blog/how-to-hire-developer-ukraine.html\", \"https://hirewebdeveloper.pp.ua/404.html\", \"https://hirewebdeveloper.pp.ua/en/404.html\", \"https://hirewebdeveloper.pp.ua/services/docker.html\", \"https://hirewebdeveloper.pp.ua/en/services/docker.html\", \"https://hirewebdeveloper.pp.ua/services/filament.html\", \"https://hirewebdeveloper.pp.ua/en/services/filament.html\", \"https://hirewebdeveloper.pp.ua/services/livewire.html\", \"https://hirewebdeveloper.pp.ua/en/services/livewire.html\", \"https://hirewebdeveloper.pp.ua/services/prestashop.html\", \"https://hirewebdeveloper.pp.ua/en/services/prestashop.html\", \"https://hirewebdeveloper.pp.ua/services/vuejs.html\", \"https://hirewebdeveloper.pp.ua/en/services/vuejs.html\", \"https://hirewebdeveloper.pp.ua/services/woocommerce.html\", \"https://hirewebdeveloper.pp.ua/en/services/woocommerce.html\", \"https://hirewebdeveloper.pp.ua/services/wordpress.html\", \"https://hirewebdeveloper.pp.ua/en/services/wordpress.html\", \"https://hirewebdeveloper.pp.ua/docker.html\", \"https://hirewebdeveloper.pp.ua/filament.html\", \"https://hirewebdeveloper.pp.ua/laravel.html\", \"https://hirewebdeveloper.pp.ua/livewire.html\", \"https://hirewebdeveloper.pp.ua/php.html\", \"https://hirewebdeveloper.pp.ua/prestashop.html\", \"https://hirewebdeveloper.pp.ua/vuejs.html\", \"https://hirewebdeveloper.pp.ua/api.html\"]}', 'done', 1, 53, 53, 0, 1, 3, NULL, '2026-03-21 12:06:59', '2026-03-21 12:07:28', '2026-03-21 12:07:47', '2026-03-21 12:06:59');

-- --------------------------------------------------------

--
-- Table structure for table `rate_limits`
--

CREATE TABLE `rate_limits` (
  `id` int(10) UNSIGNED NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint(6) NOT NULL DEFAULT '1',
  `blocked_until` datetime DEFAULT NULL,
  `last_attempt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rate_limits`
--

INSERT INTO `rate_limits` (`id`, `ip`, `action`, `attempts`, `blocked_until`, `last_attempt`) VALUES
(16, '127.0.0.1', 'login', 2, NULL, '2026-03-21 15:51:30');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `last_active` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `domain` varchar(255) NOT NULL,
  `sitemap_url` varchar(1000) NOT NULL,
  `status` enum('active','paused','error') NOT NULL DEFAULT 'active',
  `error_message` varchar(500) DEFAULT NULL,
  `total_urls` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `indexed_total` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `last_run_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sitemap_last_parsed` datetime DEFAULT NULL,
  `sitemap_url_count` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `user_id`, `domain`, `sitemap_url`, `status`, `error_message`, `total_urls`, `indexed_total`, `last_run_at`, `created_at`, `updated_at`, `sitemap_last_parsed`, `sitemap_url_count`) VALUES
(4, 2, 'indexfast.pp.ua/sitemap.xml', 'https://indexfast.pp.ua/sitemap.xml', 'active', NULL, 13, 0, NULL, '2026-03-19 14:57:51', '2026-03-19 14:58:07', NULL, 0),
(6, 1, 'indexfast.pp.ua/sitemap.xml', 'https://indexfast.pp.ua/sitemap.xml', 'active', NULL, 13, 0, NULL, '2026-03-21 09:25:11', '2026-03-21 09:25:13', NULL, 0),
(7, 1, 'hirewebdeveloper.pp.ua vip', 'https://hirewebdeveloper.pp.ua', 'error', 'Sitemap порожній або недоступний', 0, 0, NULL, '2026-03-21 12:06:08', '2026-03-21 12:06:19', NULL, 0),
(8, 1, 'hirewebdeveloper.pp.ua 777', 'https://hirewebdeveloper.pp.ua/sitemap.xml', 'active', NULL, 53, 0, NULL, '2026-03-21 12:06:49', '2026-03-21 12:06:50', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `site_credentials`
--

CREATE TABLE `site_credentials` (
  `site_id` int(10) UNSIGNED NOT NULL,
  `service_account` mediumtext NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `site_credentials`
--

INSERT INTO `site_credentials` (`site_id`, `service_account`, `updated_at`) VALUES
(4, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-19 14:57:51'),
(6, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 09:25:11'),
(7, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 12:06:08'),
(8, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 12:06:49');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `token` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('email_verify','password_reset','refresh') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `type`, `expires_at`, `used_at`, `created_at`) VALUES
(3, 2, '4bed3166e20d04269bdb09e00bf38782bd1b6ced909c39cbc4366d84609046c1', 'email_verify', '2026-03-20 16:52:38', NULL, '2026-03-19 14:52:38'),
(4, 2, 'bea7b42cb3066017c66cfbaf952e267df6dc84feef69a0610ed2d64540f7a3f2', 'refresh', '2026-03-20 16:52:38', NULL, '2026-03-19 14:52:38'),
(5, 1, 'c6d7c01fd43bd69b27b4ccdeb37bc35f66d317a11d49a92642348862bae1229e', 'email_verify', '2026-03-22 10:10:00', NULL, '2026-03-21 08:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `surname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `plan` enum('start','pro','agency') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'start',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `surname`, `avatar_url`, `google_id`, `google_email`, `email_verified`, `is_active`, `plan`, `created_at`, `updated_at`, `last_login_at`) VALUES
(1, 'test777@apartner.pro', '$2y$12$QtfQvnhLdXJDlVLmPnq1Juv1avd4OW0dYVVfwnpzQqH9WHz3ZZVKS', 'Roman1', 'Matviy8888', NULL, NULL, NULL, 1, 1, 'agency', '2026-03-19 09:59:14', '2026-03-21 13:59:48', '2026-03-21 13:59:48'),
(2, 'test@test.com', '$2y$12$ZE2BLnvABZ44Bn2AqIrNpOWiBE33OThbLXZLx0c6fAYOL5SiwnIiO', 'Roman', 'Matviy', NULL, NULL, NULL, 0, 1, 'start', '2026-03-19 14:52:38', '2026-03-21 19:37:57', '2026-03-20 09:05:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_usage`
--
ALTER TABLE `daily_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_date` (`user_id`,`usage_date`),
  ADD KEY `idx_user_date_sent` (`user_id`,`usage_date`,`urls_sent`),
  ADD KEY `idx_usage_date` (`usage_date`);

--
-- Indexes for table `indexing_log`
--
ALTER TABLE `indexing_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_url_hash` (`url_hash`),
  ADD KEY `idx_job_url` (`job_id`,`url_hash`),
  ADD KEY `idx_job_status` (`job_id`,`status`),
  ADD KEY `idx_site_log` (`site_id`,`created_at`,`status`,`http_status`),
  ADD KEY `idx_user_log` (`user_id`,`created_at`,`status`,`http_status`,`site_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_worker` (`status`,`priority`,`available_at`),
  ADD KEY `idx_id_user` (`id`,`user_id`),
  ADD KEY `idx_site_user_status` (`site_id`,`user_id`,`status`),
  ADD KEY `idx_user_status_cover` (`user_id`,`status`,`created_at`,`total`,`sent`,`failed`,`finished_at`);

--
-- Indexes for table `rate_limits`
--
ALTER TABLE `rate_limits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_ip_action` (`ip`,`action`),
  ADD KEY `idx_blocked` (`blocked_until`),
  ADD KEY `idx_last_attempt` (`last_attempt`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `idx_user_expires` (`user_id`,`expires_at`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_domain` (`user_id`,`domain`),
  ADD KEY `idx_user_dashboard` (`user_id`,`created_at`,`status`,`id`,`domain`(64),`total_urls`,`indexed_total`,`last_run_at`),
  ADD KEY `idx_status_updated` (`status`,`updated_at`);

--
-- Indexes for table `site_credentials`
--
ALTER TABLE `site_credentials`
  ADD PRIMARY KEY (`site_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_token` (`token`),
  ADD KEY `idx_user_type` (`user_id`,`type`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `idx_cleanup` (`expires_at`,`used_at`),
  ADD KEY `idx_user_type_expires` (`user_id`,`type`,`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_email` (`email`),
  ADD UNIQUE KEY `uq_google_id` (`google_id`),
  ADD KEY `idx_email_verified` (`email_verified`),
  ADD KEY `idx_plan_active` (`plan`,`is_active`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_last_login` (`last_login_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daily_usage`
--
ALTER TABLE `daily_usage`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

--
-- AUTO_INCREMENT for table `indexing_log`
--
ALTER TABLE `indexing_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `rate_limits`
--
ALTER TABLE `rate_limits`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `daily_usage`
--
ALTER TABLE `daily_usage`
  ADD CONSTRAINT `fk_daily_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `indexing_log`
--
ALTER TABLE `indexing_log`
  ADD CONSTRAINT `fk_log_site` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `fk_jobs_site` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jobs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sites`
--
ALTER TABLE `sites`
  ADD CONSTRAINT `fk_sites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `site_credentials`
--
ALTER TABLE `site_credentials`
  ADD CONSTRAINT `fk_cred_site` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `fk_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
