-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 26, 2026 at 06:56 PM
-- Server version: 10.6.24-MariaDB-cll-lve
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `one729_indexfast`
--

-- --------------------------------------------------------

--
-- Table structure for table `daily_usage`
--

CREATE TABLE `daily_usage` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `usage_date` date NOT NULL,
  `urls_sent` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `urls_limit` smallint(5) UNSIGNED NOT NULL DEFAULT 20,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_usage`
--

INSERT INTO `daily_usage` (`id`, `user_id`, `usage_date`, `urls_sent`, `urls_limit`, `updated_at`) VALUES
(48, 1, '2026-03-19', 25, 100, '2026-03-19 12:25:55'),
(131, 2, '2026-03-19', 3, 20, '2026-03-19 14:58:18'),
(132, 2, '2026-03-20', 0, 20, '2026-03-20 09:05:09'),
(134, 1, '2026-03-20', 0, 500, '2026-03-20 09:31:26'),
(135, 1, '2026-03-21', 132, 5000, '2026-03-21 17:41:01'),
(337, 3, '2026-03-21', 0, 20, '2026-03-21 17:52:34'),
(338, 4, '2026-03-21', 0, 20, '2026-03-21 17:53:05'),
(340, 5, '2026-03-21', 11, 20, '2026-03-21 18:01:24'),
(364, 6, '2026-03-21', 0, 20, '2026-03-21 18:38:23'),
(366, 7, '2026-03-24', 0, 20, '2026-03-24 18:18:04'),
(371, 5, '2026-03-27', 0, 20, '2026-03-27 10:41:42'),
(384, 8, '2026-03-28', 0, 20, '2026-03-27 23:58:43'),
(385, 5, '2026-04-01', 0, 20, '2026-03-31 21:16:34'),
(387, 5, '2026-04-24', 0, 20, '2026-04-23 22:30:05'),
(388, 1, '2026-04-26', 0, 20, '2026-04-26 14:50:22'),
(399, 9, '2026-04-26', 0, 20, '2026-04-26 14:53:08'),
(405, 5, '2026-04-26', 796, 5000, '2026-04-26 15:44:26');

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `job_id` bigint(20) UNSIGNED DEFAULT NULL,
  `url_hash` char(64) GENERATED ALWAYS AS (sha2(`url`,256)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `indexing_log`
--

INSERT INTO `indexing_log` (`id`, `site_id`, `user_id`, `url`, `status`, `http_status`, `error_msg`, `created_at`, `job_id`) VALUES
(36, 4, 2, 'https://indexfast.pro/', 'pending', NULL, NULL, '2026-03-19 14:58:18', 4),
(37, 4, 2, 'https://indexfast.pro/about.html', 'pending', NULL, NULL, '2026-03-19 14:58:18', 4),
(38, 4, 2, 'https://indexfast.pro/affiliate.html', 'pending', NULL, NULL, '2026-03-19 14:58:18', 4),
(39, 6, 1, 'https://indexfast.pro/', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(40, 6, 1, 'https://indexfast.pro/about.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(41, 6, 1, 'https://indexfast.pro/affiliate.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(42, 6, 1, 'https://indexfast.pro/docs/', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(43, 6, 1, 'https://indexfast.pro/blog/', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(44, 6, 1, 'https://indexfast.pro/status.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(45, 6, 1, 'https://indexfast.pro/privacy-policy.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(46, 6, 1, 'https://indexfast.pro/terms.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(47, 6, 1, 'https://indexfast.pro/blog/yak-pryskoriti-indeksaciyu-saitu-v-google.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(48, 6, 1, 'https://indexfast.pro/blog/shcho-take-sitemap-xml.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(49, 6, 1, 'https://indexfast.pro/blog/google-search-console-posibnyk.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(50, 6, 1, 'https://indexfast.pro/blog/cron-jobs-dlya-seo.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
(51, 6, 1, 'https://indexfast.pro/blog/core-web-vitals-2025.html', 'pending', NULL, NULL, '2026-03-21 10:39:06', 5),
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
(117, 8, 1, 'https://hirewebdeveloper.pp.ua/api.html', 'pending', NULL, NULL, '2026-03-21 12:06:59', 7),
(118, 8, 1, 'https://hirewebdeveloper.pp.ua/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(119, 8, 1, 'https://hirewebdeveloper.pp.ua/en/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(120, 8, 1, 'https://hirewebdeveloper.pp.ua/about.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(121, 8, 1, 'https://hirewebdeveloper.pp.ua/en/about.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(122, 8, 1, 'https://hirewebdeveloper.pp.ua/services/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(123, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(124, 8, 1, 'https://hirewebdeveloper.pp.ua/services/laravel.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(125, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/laravel.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(126, 8, 1, 'https://hirewebdeveloper.pp.ua/services/php.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(127, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/php.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(128, 8, 1, 'https://hirewebdeveloper.pp.ua/services/fullstack.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(129, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/fullstack.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(130, 8, 1, 'https://hirewebdeveloper.pp.ua/services/api.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(131, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/api.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(132, 8, 1, 'https://hirewebdeveloper.pp.ua/pricing.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(133, 8, 1, 'https://hirewebdeveloper.pp.ua/en/pricing.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(134, 8, 1, 'https://hirewebdeveloper.pp.ua/stack/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(135, 8, 1, 'https://hirewebdeveloper.pp.ua/en/stack/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(136, 8, 1, 'https://hirewebdeveloper.pp.ua/fullstack.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(137, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(138, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(139, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/laravel-vs-symfony.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(140, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/laravel-vs-symfony.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(141, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/laravel-rest-api-tutorial.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(142, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/laravel-rest-api-tutorial.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(143, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/prestashop-vs-woocommerce.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(144, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/prestashop-vs-woocommerce.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(145, 8, 1, 'https://hirewebdeveloper.pp.ua/blog/how-to-hire-developer-ukraine.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(146, 8, 1, 'https://hirewebdeveloper.pp.ua/en/blog/how-to-hire-developer-ukraine.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(147, 8, 1, 'https://hirewebdeveloper.pp.ua/404.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(148, 8, 1, 'https://hirewebdeveloper.pp.ua/en/404.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(149, 8, 1, 'https://hirewebdeveloper.pp.ua/services/docker.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(150, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/docker.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(151, 8, 1, 'https://hirewebdeveloper.pp.ua/services/filament.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(152, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/filament.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(153, 8, 1, 'https://hirewebdeveloper.pp.ua/services/livewire.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(154, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/livewire.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(155, 8, 1, 'https://hirewebdeveloper.pp.ua/services/prestashop.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(156, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/prestashop.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(157, 8, 1, 'https://hirewebdeveloper.pp.ua/services/vuejs.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(158, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/vuejs.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(159, 8, 1, 'https://hirewebdeveloper.pp.ua/services/woocommerce.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(160, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/woocommerce.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(161, 8, 1, 'https://hirewebdeveloper.pp.ua/services/wordpress.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(162, 8, 1, 'https://hirewebdeveloper.pp.ua/en/services/wordpress.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(163, 8, 1, 'https://hirewebdeveloper.pp.ua/docker.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(164, 8, 1, 'https://hirewebdeveloper.pp.ua/filament.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(165, 8, 1, 'https://hirewebdeveloper.pp.ua/laravel.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(166, 8, 1, 'https://hirewebdeveloper.pp.ua/livewire.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(167, 8, 1, 'https://hirewebdeveloper.pp.ua/php.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(168, 8, 1, 'https://hirewebdeveloper.pp.ua/prestashop.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(169, 8, 1, 'https://hirewebdeveloper.pp.ua/vuejs.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(170, 8, 1, 'https://hirewebdeveloper.pp.ua/api.html', 'pending', NULL, NULL, '2026-03-21 17:41:01', 8),
(171, 10, 5, 'https://hire-web-developer.com/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(172, 10, 5, 'https://hire-web-developer.com/hire-flex-developer.html', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(173, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer.html', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(174, 10, 5, 'https://hire-web-developer.com/laravel-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(175, 10, 5, 'https://hire-web-developer.com/php-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(176, 10, 5, 'https://hire-web-developer.com/vuejs-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(177, 10, 5, 'https://hire-web-developer.com/prestashop-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(178, 10, 5, 'https://hire-web-developer.com/wordpress-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(179, 10, 5, 'https://hire-web-developer.com/bootstrap-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(180, 10, 5, 'https://hire-web-developer.com/docker/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(181, 10, 5, 'https://hire-web-developer.com/figma-developer/', 'pending', NULL, NULL, '2026-03-21 18:01:24', 9),
(182, 10, 5, 'https://hire-web-developer.com/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(183, 10, 5, 'https://hire-web-developer.com/hire-flex-developer.html', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(184, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer.html', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(185, 10, 5, 'https://hire-web-developer.com/laravel-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(186, 10, 5, 'https://hire-web-developer.com/php-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(187, 10, 5, 'https://hire-web-developer.com/vuejs-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(188, 10, 5, 'https://hire-web-developer.com/prestashop-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(189, 10, 5, 'https://hire-web-developer.com/wordpress-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(190, 10, 5, 'https://hire-web-developer.com/bootstrap-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(191, 10, 5, 'https://hire-web-developer.com/docker/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(192, 10, 5, 'https://hire-web-developer.com/figma-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(193, 10, 5, 'https://hire-web-developer.com/filamentphp-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(194, 10, 5, 'https://hire-web-developer.com/git-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(195, 10, 5, 'https://hire-web-developer.com/html-css-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(196, 10, 5, 'https://hire-web-developer.com/javascript-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(197, 10, 5, 'https://hire-web-developer.com/linux-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(198, 10, 5, 'https://hire-web-developer.com/livewire-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(199, 10, 5, 'https://hire-web-developer.com/mysql-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(200, 10, 5, 'https://hire-web-developer.com/oop-ddd-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(201, 10, 5, 'https://hire-web-developer.com/opencart-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(202, 10, 5, 'https://hire-web-developer.com/rest-api-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(203, 10, 5, 'https://hire-web-developer.com/scss-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(204, 10, 5, 'https://hire-web-developer.com/swagger-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(205, 10, 5, 'https://hire-web-developer.com/tailwindcss-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(206, 10, 5, 'https://hire-web-developer.com/twig-smarty-blade-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(207, 10, 5, 'https://hire-web-developer.com/typescript-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(208, 10, 5, 'https://hire-web-developer.com/vite-developer/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(209, 10, 5, 'https://hire-web-developer.com/contact/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(210, 10, 5, 'https://hire-web-developer.com/pricing/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(211, 10, 5, 'https://hire-web-developer.com/reviews/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(212, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(213, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(214, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(215, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(216, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(217, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(218, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(219, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(220, 10, 5, 'https://hire-web-developer.com/hire-php-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(221, 10, 5, 'https://hire-web-developer.com/hire-php-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(222, 10, 5, 'https://hire-web-developer.com/hire-php-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(223, 10, 5, 'https://hire-web-developer.com/hire-php-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(224, 10, 5, 'https://hire-web-developer.com/hire-php-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(225, 10, 5, 'https://hire-web-developer.com/hire-php-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(226, 10, 5, 'https://hire-web-developer.com/hire-php-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(227, 10, 5, 'https://hire-web-developer.com/hire-php-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(228, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(229, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(230, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(231, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(232, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(233, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(234, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(235, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(236, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(237, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(238, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(239, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(240, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(241, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(242, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(243, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(244, 10, 5, 'https://hire-web-developer.com/about.html', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(245, 10, 5, 'https://hire-web-developer.com/laravel/index.html', 'pending', NULL, NULL, '2026-04-26 15:15:37', 10),
(246, 10, 5, 'https://hire-web-developer.com/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(247, 10, 5, 'https://hire-web-developer.com/hire-flex-developer.html', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(248, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer.html', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(249, 10, 5, 'https://hire-web-developer.com/laravel-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(250, 10, 5, 'https://hire-web-developer.com/php-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(251, 10, 5, 'https://hire-web-developer.com/vuejs-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(252, 10, 5, 'https://hire-web-developer.com/prestashop-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(253, 10, 5, 'https://hire-web-developer.com/wordpress-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(254, 10, 5, 'https://hire-web-developer.com/bootstrap-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(255, 10, 5, 'https://hire-web-developer.com/docker/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(256, 10, 5, 'https://hire-web-developer.com/figma-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(257, 10, 5, 'https://hire-web-developer.com/filamentphp-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(258, 10, 5, 'https://hire-web-developer.com/git-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(259, 10, 5, 'https://hire-web-developer.com/html-css-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(260, 10, 5, 'https://hire-web-developer.com/javascript-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(261, 10, 5, 'https://hire-web-developer.com/linux-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(262, 10, 5, 'https://hire-web-developer.com/livewire-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(263, 10, 5, 'https://hire-web-developer.com/mysql-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(264, 10, 5, 'https://hire-web-developer.com/oop-ddd-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(265, 10, 5, 'https://hire-web-developer.com/opencart-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(266, 10, 5, 'https://hire-web-developer.com/rest-api-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(267, 10, 5, 'https://hire-web-developer.com/scss-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(268, 10, 5, 'https://hire-web-developer.com/swagger-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(269, 10, 5, 'https://hire-web-developer.com/tailwindcss-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(270, 10, 5, 'https://hire-web-developer.com/twig-smarty-blade-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(271, 10, 5, 'https://hire-web-developer.com/typescript-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(272, 10, 5, 'https://hire-web-developer.com/vite-developer/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(273, 10, 5, 'https://hire-web-developer.com/contact/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(274, 10, 5, 'https://hire-web-developer.com/pricing/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(275, 10, 5, 'https://hire-web-developer.com/reviews/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(276, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(277, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(278, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(279, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(280, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(281, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(282, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(283, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(284, 10, 5, 'https://hire-web-developer.com/hire-php-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(285, 10, 5, 'https://hire-web-developer.com/hire-php-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(286, 10, 5, 'https://hire-web-developer.com/hire-php-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(287, 10, 5, 'https://hire-web-developer.com/hire-php-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(288, 10, 5, 'https://hire-web-developer.com/hire-php-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(289, 10, 5, 'https://hire-web-developer.com/hire-php-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(290, 10, 5, 'https://hire-web-developer.com/hire-php-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(291, 10, 5, 'https://hire-web-developer.com/hire-php-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(292, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(293, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(294, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(295, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(296, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(297, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(298, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(299, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(300, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-australia/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(301, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-canada/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(302, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-france/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(303, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-germany/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(304, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-netherlands/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(305, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-poland/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(306, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-uk/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(307, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-usa/', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(308, 10, 5, 'https://hire-web-developer.com/about.html', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(309, 10, 5, 'https://hire-web-developer.com/laravel/index.html', 'pending', NULL, NULL, '2026-04-26 15:21:03', 11),
(310, 10, 5, 'https://hire-web-developer.com/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(311, 10, 5, 'https://hire-web-developer.com/hire-flex-developer.html', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(312, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer.html', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(313, 10, 5, 'https://hire-web-developer.com/laravel-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(314, 10, 5, 'https://hire-web-developer.com/php-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(315, 10, 5, 'https://hire-web-developer.com/vuejs-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(316, 10, 5, 'https://hire-web-developer.com/prestashop-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(317, 10, 5, 'https://hire-web-developer.com/wordpress-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(318, 10, 5, 'https://hire-web-developer.com/bootstrap-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(319, 10, 5, 'https://hire-web-developer.com/docker/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(320, 10, 5, 'https://hire-web-developer.com/figma-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(321, 10, 5, 'https://hire-web-developer.com/filamentphp-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(322, 10, 5, 'https://hire-web-developer.com/git-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(323, 10, 5, 'https://hire-web-developer.com/html-css-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(324, 10, 5, 'https://hire-web-developer.com/javascript-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(325, 10, 5, 'https://hire-web-developer.com/linux-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(326, 10, 5, 'https://hire-web-developer.com/livewire-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(327, 10, 5, 'https://hire-web-developer.com/mysql-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(328, 10, 5, 'https://hire-web-developer.com/oop-ddd-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(329, 10, 5, 'https://hire-web-developer.com/opencart-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(330, 10, 5, 'https://hire-web-developer.com/rest-api-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(331, 10, 5, 'https://hire-web-developer.com/scss-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(332, 10, 5, 'https://hire-web-developer.com/swagger-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(333, 10, 5, 'https://hire-web-developer.com/tailwindcss-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(334, 10, 5, 'https://hire-web-developer.com/twig-smarty-blade-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(335, 10, 5, 'https://hire-web-developer.com/typescript-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(336, 10, 5, 'https://hire-web-developer.com/vite-developer/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(337, 10, 5, 'https://hire-web-developer.com/contact/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(338, 10, 5, 'https://hire-web-developer.com/pricing/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(339, 10, 5, 'https://hire-web-developer.com/reviews/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(340, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-australia/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(341, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-canada/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(342, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-france/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(343, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-germany/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(344, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-netherlands/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(345, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-poland/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(346, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-uk/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(347, 10, 5, 'https://hire-web-developer.com/hire-laravel-developer-usa/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(348, 10, 5, 'https://hire-web-developer.com/hire-php-developer-australia/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(349, 10, 5, 'https://hire-web-developer.com/hire-php-developer-canada/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(350, 10, 5, 'https://hire-web-developer.com/hire-php-developer-france/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(351, 10, 5, 'https://hire-web-developer.com/hire-php-developer-germany/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(352, 10, 5, 'https://hire-web-developer.com/hire-php-developer-netherlands/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(353, 10, 5, 'https://hire-web-developer.com/hire-php-developer-poland/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(354, 10, 5, 'https://hire-web-developer.com/hire-php-developer-uk/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(355, 10, 5, 'https://hire-web-developer.com/hire-php-developer-usa/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(356, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-australia/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(357, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-canada/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(358, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-france/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(359, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-germany/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(360, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-netherlands/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(361, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-poland/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(362, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-uk/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(363, 10, 5, 'https://hire-web-developer.com/hire-prestashop-developer-usa/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(364, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-australia/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(365, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-canada/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(366, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-france/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(367, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-germany/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(368, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-netherlands/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(369, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-poland/', 'ok', 200, NULL, '2026-04-26 15:31:55', 12),
(370, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-uk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:31:55', 12),
(371, 10, 5, 'https://hire-web-developer.com/hire-wordpress-developer-usa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:31:55', 12),
(372, 10, 5, 'https://hire-web-developer.com/about.html', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:31:55', 12),
(373, 10, 5, 'https://hire-web-developer.com/laravel/index.html', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:31:55', 12),
(374, 11, 5, 'https://programist.matviy.pp.ua/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(375, 11, 5, 'https://programist.matviy.pp.ua/faq.html', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(376, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(377, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(378, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(379, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(380, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(381, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(382, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(383, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(384, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(385, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(386, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(387, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(388, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(389, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(390, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(391, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(392, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(393, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(394, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(395, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(396, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(397, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(398, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(399, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(400, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(401, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(402, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(403, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(404, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(405, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(406, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(407, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(408, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(409, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(410, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13);
INSERT INTO `indexing_log` (`id`, `site_id`, `user_id`, `url`, `status`, `http_status`, `error_msg`, `created_at`, `job_id`) VALUES
(411, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(412, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(413, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(414, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(415, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(416, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(417, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(418, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(419, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(420, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(421, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(422, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(423, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(424, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(425, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(426, 11, 5, 'https://programist.matviy.pp.ua/wordpress/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(427, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(428, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(429, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(430, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(431, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(432, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(433, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(434, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(435, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(436, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(437, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(438, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(439, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(440, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(441, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(442, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(443, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(444, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(445, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(446, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(447, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(448, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(449, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(450, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(451, 11, 5, 'https://programist.matviy.pp.ua/prestashop/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(452, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(453, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(454, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(455, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(456, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(457, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(458, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(459, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(460, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(461, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(462, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(463, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(464, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(465, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(466, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(467, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(468, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(469, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(470, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(471, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(472, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(473, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(474, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(475, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(476, 11, 5, 'https://programist.matviy.pp.ua/opencart/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(477, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(478, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(479, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(480, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(481, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(482, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(483, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(484, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(485, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(486, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(487, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(488, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(489, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(490, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(491, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(492, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(493, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(494, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(495, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(496, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(497, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(498, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(499, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(500, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(501, 11, 5, 'https://programist.matviy.pp.ua/laravel/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(502, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(503, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(504, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(505, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(506, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(507, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(508, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(509, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(510, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(511, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(512, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(513, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(514, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(515, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(516, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(517, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(518, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(519, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(520, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(521, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(522, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(523, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(524, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(525, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(526, 11, 5, 'https://programist.matviy.pp.ua/nextjs/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(527, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(528, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(529, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(530, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(531, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(532, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(533, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(534, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(535, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(536, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(537, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(538, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(539, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(540, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(541, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(542, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(543, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(544, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(545, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(546, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(547, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(548, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(549, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(550, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(551, 11, 5, 'https://programist.matviy.pp.ua/nodejs/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(552, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(553, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(554, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(555, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(556, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(557, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(558, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(559, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(560, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(561, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(562, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(563, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(564, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(565, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(566, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(567, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(568, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(569, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(570, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(571, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(572, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(573, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(574, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(575, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(576, 11, 5, 'https://programist.matviy.pp.ua/vue/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(577, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(578, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13);
INSERT INTO `indexing_log` (`id`, `site_id`, `user_id`, `url`, `status`, `http_status`, `error_msg`, `created_at`, `job_id`) VALUES
(579, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(580, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(581, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(582, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(583, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(584, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(585, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(586, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(587, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(588, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(589, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(590, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(591, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(592, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(593, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(594, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(595, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(596, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(597, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(598, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(599, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(600, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(601, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(602, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(603, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(604, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(605, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(606, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(607, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(608, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(609, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(610, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(611, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(612, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(613, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(614, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(615, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(616, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(617, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(618, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(619, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(620, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(621, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(622, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(623, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(624, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(625, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(626, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(627, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(628, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(629, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(630, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(631, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(632, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(633, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(634, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(635, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(636, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(637, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(638, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(639, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(640, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(641, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(642, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(643, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(644, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(645, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(646, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(647, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(648, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(649, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(650, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(651, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(652, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(653, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kyiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(654, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/lviv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(655, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kharkiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(656, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/odesa/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(657, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/dnipro/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(658, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/zaporizhzhia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(659, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/vinnytsia/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(660, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/poltava/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(661, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/chernivtsi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(662, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/cherkasy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(663, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/chernihiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(664, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/zhytomyr/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(665, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/ivano-frankivsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(666, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/rivne/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(667, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/lutsk/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(668, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/ternopil/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(669, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/mykolaiv/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(670, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/khmelnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(671, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/sumy/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(672, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kropyvnytskyi/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(673, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/uzhorod/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(674, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kryvyi-rih/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(675, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/mariupol/', 'error', 429, 'Quota exceeded for quota metric \'Publish requests\' and limit \'Publish requests per day\' of service \'indexing.googleapis.com\' for consumer \'project_number:1032201661139\'.', '2026-04-26 15:38:39', 13),
(676, 11, 5, 'https://programist.matviy.pp.ua/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(677, 11, 5, 'https://programist.matviy.pp.ua/faq.html', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(678, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(679, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(680, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(681, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(682, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(683, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(684, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(685, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(686, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(687, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(688, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(689, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(690, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(691, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(692, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(693, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(694, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(695, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(696, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(697, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(698, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(699, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(700, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(701, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(702, 11, 5, 'https://programist.matviy.pp.ua/rozrobka-saitiv/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(703, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(704, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(705, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(706, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(707, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(708, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(709, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(710, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(711, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(712, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(713, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(714, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(715, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(716, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(717, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(718, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(719, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(720, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(721, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(722, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(723, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(724, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(725, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(726, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(727, 11, 5, 'https://programist.matviy.pp.ua/internet-magazin/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(728, 11, 5, 'https://programist.matviy.pp.ua/wordpress/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(729, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(730, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(731, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(732, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(733, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(734, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(735, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(736, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(737, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(738, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(739, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(740, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(741, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(742, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(743, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(744, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(745, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(746, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(747, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(748, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(749, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(750, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(751, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(752, 11, 5, 'https://programist.matviy.pp.ua/wordpress/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(753, 11, 5, 'https://programist.matviy.pp.ua/prestashop/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(754, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(755, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(756, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(757, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(758, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(759, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(760, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(761, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(762, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(763, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(764, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(765, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(766, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(767, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(768, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(769, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(770, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(771, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(772, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(773, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(774, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(775, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(776, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(777, 11, 5, 'https://programist.matviy.pp.ua/prestashop/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(778, 11, 5, 'https://programist.matviy.pp.ua/opencart/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(779, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(780, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(781, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(782, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(783, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(784, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(785, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(786, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(787, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(788, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(789, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(790, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(791, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(792, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(793, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(794, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(795, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(796, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(797, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(798, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(799, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(800, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(801, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(802, 11, 5, 'https://programist.matviy.pp.ua/opencart/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(803, 11, 5, 'https://programist.matviy.pp.ua/laravel/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(804, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(805, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(806, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(807, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(808, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(809, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(810, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(811, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(812, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(813, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(814, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(815, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(816, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(817, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(818, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(819, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(820, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(821, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(822, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(823, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(824, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(825, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(826, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(827, 11, 5, 'https://programist.matviy.pp.ua/laravel/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(828, 11, 5, 'https://programist.matviy.pp.ua/nextjs/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(829, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(830, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(831, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(832, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(833, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(834, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(835, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(836, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(837, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(838, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(839, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(840, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(841, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(842, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14);
INSERT INTO `indexing_log` (`id`, `site_id`, `user_id`, `url`, `status`, `http_status`, `error_msg`, `created_at`, `job_id`) VALUES
(843, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(844, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(845, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(846, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(847, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(848, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(849, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(850, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(851, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(852, 11, 5, 'https://programist.matviy.pp.ua/nextjs/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(853, 11, 5, 'https://programist.matviy.pp.ua/nodejs/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(854, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(855, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(856, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(857, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(858, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(859, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(860, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(861, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(862, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(863, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(864, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(865, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(866, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(867, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(868, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(869, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(870, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(871, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(872, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(873, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(874, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(875, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(876, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(877, 11, 5, 'https://programist.matviy.pp.ua/nodejs/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(878, 11, 5, 'https://programist.matviy.pp.ua/vue/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(879, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(880, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(881, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(882, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(883, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(884, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(885, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(886, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(887, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(888, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(889, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(890, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(891, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(892, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(893, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(894, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(895, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(896, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(897, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(898, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(899, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(900, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(901, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(902, 11, 5, 'https://programist.matviy.pp.ua/vue/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(903, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(904, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(905, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(906, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(907, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(908, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(909, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(910, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(911, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(912, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(913, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(914, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(915, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(916, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(917, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(918, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(919, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(920, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(921, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(922, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(923, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(924, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(925, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(926, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(927, 11, 5, 'https://programist.matviy.pp.ua/seo-optimizatsiya/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(928, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(929, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(930, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(931, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(932, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(933, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(934, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(935, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(936, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(937, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(938, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(939, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(940, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(941, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(942, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(943, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(944, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(945, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(946, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(947, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(948, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(949, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(950, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(951, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(952, 11, 5, 'https://programist.matviy.pp.ua/pidtrymka-saitiv/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(953, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(954, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(955, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kyiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(956, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/lviv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(957, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kharkiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(958, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/odesa/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(959, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/dnipro/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(960, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/zaporizhzhia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(961, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/vinnytsia/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(962, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/poltava/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(963, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/chernivtsi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(964, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/cherkasy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(965, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/chernihiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(966, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/zhytomyr/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(967, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/ivano-frankivsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(968, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/rivne/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(969, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/lutsk/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(970, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/ternopil/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(971, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/mykolaiv/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(972, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/khmelnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(973, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/sumy/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(974, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kropyvnytskyi/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(975, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/uzhorod/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(976, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/kryvyi-rih/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14),
(977, 11, 5, 'https://programist.matviy.pp.ua/crm-erp/ukraine/mariupol/', 'pending', NULL, NULL, '2026-04-26 15:44:26', 14);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `site_id` int(10) UNSIGNED NOT NULL,
  `type` enum('index_urls') NOT NULL DEFAULT 'index_urls',
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  `status` enum('pending','processing','done','failed','cancelled') NOT NULL DEFAULT 'pending',
  `priority` tinyint(3) UNSIGNED NOT NULL DEFAULT 5,
  `total` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `sent` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `failed` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `max_attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 3,
  `last_error` varchar(500) DEFAULT NULL,
  `available_at` datetime NOT NULL DEFAULT current_timestamp(),
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `user_id`, `site_id`, `type`, `payload`, `status`, `priority`, `total`, `sent`, `failed`, `attempts`, `max_attempts`, `last_error`, `available_at`, `started_at`, `finished_at`, `created_at`) VALUES
(4, 2, 4, 'index_urls', '{\"urls\": [\"https://indexfast.pro/\", \"https://indexfast.pro/about.html\", \"https://indexfast.pro/affiliate.html\"]}', 'done', 5, 3, 3, 0, 3, 3, 'Token error', '2026-03-19 14:58:18', '2026-03-21 11:57:11', '2026-03-21 11:57:13', '2026-03-19 14:58:18'),
(5, 1, 6, 'index_urls', '{\"urls\": [\"https://indexfast.pro/\", \"https://indexfast.pro/about.html\", \"https://indexfast.pro/affiliate.html\", \"https://indexfast.pro/docs/\", \"https://indexfast.pro/blog/\", \"https://indexfast.pro/status.html\", \"https://indexfast.pro/privacy-policy.html\", \"https://indexfast.pro/terms.html\", \"https://indexfast.pro/blog/yak-pryskoriti-indeksaciyu-saitu-v-google.html\", \"https://indexfast.pro/blog/shcho-take-sitemap-xml.html\", \"https://indexfast.pro/blog/google-search-console-posibnyk.html\", \"https://indexfast.pro/blog/cron-jobs-dlya-seo.html\", \"https://indexfast.pro/blog/core-web-vitals-2025.html\"]}', 'done', 1, 13, 13, 0, 3, 3, 'Token error', '2026-03-21 10:39:06', '2026-03-21 11:57:05', '2026-03-21 11:57:11', '2026-03-21 10:39:06'),
(7, 1, 8, 'index_urls', '{\"urls\": [\"https://hirewebdeveloper.pp.ua/\", \"https://hirewebdeveloper.pp.ua/en/\", \"https://hirewebdeveloper.pp.ua/about.html\", \"https://hirewebdeveloper.pp.ua/en/about.html\", \"https://hirewebdeveloper.pp.ua/services/\", \"https://hirewebdeveloper.pp.ua/en/services/\", \"https://hirewebdeveloper.pp.ua/services/laravel.html\", \"https://hirewebdeveloper.pp.ua/en/services/laravel.html\", \"https://hirewebdeveloper.pp.ua/services/php.html\", \"https://hirewebdeveloper.pp.ua/en/services/php.html\", \"https://hirewebdeveloper.pp.ua/services/fullstack.html\", \"https://hirewebdeveloper.pp.ua/en/services/fullstack.html\", \"https://hirewebdeveloper.pp.ua/services/api.html\", \"https://hirewebdeveloper.pp.ua/en/services/api.html\", \"https://hirewebdeveloper.pp.ua/pricing.html\", \"https://hirewebdeveloper.pp.ua/en/pricing.html\", \"https://hirewebdeveloper.pp.ua/stack/\", \"https://hirewebdeveloper.pp.ua/en/stack/\", \"https://hirewebdeveloper.pp.ua/fullstack.html\", \"https://hirewebdeveloper.pp.ua/blog/\", \"https://hirewebdeveloper.pp.ua/en/blog/\", \"https://hirewebdeveloper.pp.ua/blog/laravel-vs-symfony.html\", \"https://hirewebdeveloper.pp.ua/en/blog/laravel-vs-symfony.html\", \"https://hirewebdeveloper.pp.ua/blog/laravel-rest-api-tutorial.html\", \"https://hirewebdeveloper.pp.ua/en/blog/laravel-rest-api-tutorial.html\", \"https://hirewebdeveloper.pp.ua/blog/prestashop-vs-woocommerce.html\", \"https://hirewebdeveloper.pp.ua/en/blog/prestashop-vs-woocommerce.html\", \"https://hirewebdeveloper.pp.ua/blog/how-to-hire-developer-ukraine.html\", \"https://hirewebdeveloper.pp.ua/en/blog/how-to-hire-developer-ukraine.html\", \"https://hirewebdeveloper.pp.ua/404.html\", \"https://hirewebdeveloper.pp.ua/en/404.html\", \"https://hirewebdeveloper.pp.ua/services/docker.html\", \"https://hirewebdeveloper.pp.ua/en/services/docker.html\", \"https://hirewebdeveloper.pp.ua/services/filament.html\", \"https://hirewebdeveloper.pp.ua/en/services/filament.html\", \"https://hirewebdeveloper.pp.ua/services/livewire.html\", \"https://hirewebdeveloper.pp.ua/en/services/livewire.html\", \"https://hirewebdeveloper.pp.ua/services/prestashop.html\", \"https://hirewebdeveloper.pp.ua/en/services/prestashop.html\", \"https://hirewebdeveloper.pp.ua/services/vuejs.html\", \"https://hirewebdeveloper.pp.ua/en/services/vuejs.html\", \"https://hirewebdeveloper.pp.ua/services/woocommerce.html\", \"https://hirewebdeveloper.pp.ua/en/services/woocommerce.html\", \"https://hirewebdeveloper.pp.ua/services/wordpress.html\", \"https://hirewebdeveloper.pp.ua/en/services/wordpress.html\", \"https://hirewebdeveloper.pp.ua/docker.html\", \"https://hirewebdeveloper.pp.ua/filament.html\", \"https://hirewebdeveloper.pp.ua/laravel.html\", \"https://hirewebdeveloper.pp.ua/livewire.html\", \"https://hirewebdeveloper.pp.ua/php.html\", \"https://hirewebdeveloper.pp.ua/prestashop.html\", \"https://hirewebdeveloper.pp.ua/vuejs.html\", \"https://hirewebdeveloper.pp.ua/api.html\"]}', 'done', 1, 53, 53, 0, 1, 3, NULL, '2026-03-21 12:06:59', '2026-03-21 12:07:28', '2026-03-21 12:07:47', '2026-03-21 12:06:59'),
(8, 1, 8, 'index_urls', '{\"urls\":[\"https:\\/\\/hirewebdeveloper.pp.ua\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/about.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/about.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/laravel.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/laravel.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/php.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/php.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/fullstack.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/fullstack.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/api.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/api.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/pricing.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/pricing.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/stack\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/stack\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/fullstack.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/blog\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/blog\\/\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/blog\\/laravel-vs-symfony.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/blog\\/laravel-vs-symfony.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/blog\\/laravel-rest-api-tutorial.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/blog\\/laravel-rest-api-tutorial.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/blog\\/prestashop-vs-woocommerce.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/blog\\/prestashop-vs-woocommerce.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/blog\\/how-to-hire-developer-ukraine.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/blog\\/how-to-hire-developer-ukraine.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/404.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/404.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/docker.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/docker.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/filament.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/filament.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/livewire.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/livewire.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/prestashop.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/prestashop.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/vuejs.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/vuejs.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/woocommerce.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/woocommerce.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/services\\/wordpress.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/en\\/services\\/wordpress.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/docker.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/filament.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/laravel.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/livewire.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/php.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/prestashop.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/vuejs.html\",\"https:\\/\\/hirewebdeveloper.pp.ua\\/api.html\"]}', 'done', 1, 53, 53, 0, 1, 3, NULL, '2026-03-21 17:41:01', '2026-04-26 15:19:35', '2026-04-26 15:19:53', '2026-03-21 17:41:01'),
(9, 5, 10, 'index_urls', '{\"urls\":[\"https:\\/\\/hire-web-developer.com\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-flex-developer.html\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer.html\",\"https:\\/\\/hire-web-developer.com\\/laravel-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/php-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vuejs-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/prestashop-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/wordpress-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/bootstrap-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/docker\\/\",\"https:\\/\\/hire-web-developer.com\\/figma-developer\\/\"]}', 'failed', 5, 11, 0, 0, 0, 3, 'Скасовано адміном', '2026-03-21 18:01:24', NULL, '2026-04-26 13:42:47', '2026-03-21 18:01:24'),
(10, 5, 10, 'index_urls', '{\"urls\":[\"https:\\/\\/hire-web-developer.com\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-flex-developer.html\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer.html\",\"https:\\/\\/hire-web-developer.com\\/laravel-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/php-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vuejs-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/prestashop-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/wordpress-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/bootstrap-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/docker\\/\",\"https:\\/\\/hire-web-developer.com\\/figma-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/filamentphp-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/git-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/html-css-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/javascript-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/linux-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/livewire-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/mysql-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/oop-ddd-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/opencart-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/rest-api-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/scss-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/swagger-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/tailwindcss-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/twig-smarty-blade-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/typescript-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vite-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/contact\\/\",\"https:\\/\\/hire-web-developer.com\\/pricing\\/\",\"https:\\/\\/hire-web-developer.com\\/reviews\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/about.html\",\"https:\\/\\/hire-web-developer.com\\/laravel\\/index.html\"]}', 'done', 1, 64, 64, 0, 1, 3, NULL, '2026-04-26 15:15:37', '2026-04-26 15:19:53', '2026-04-26 15:20:13', '2026-04-26 15:15:37'),
(11, 5, 10, 'index_urls', '{\"urls\":[\"https:\\/\\/hire-web-developer.com\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-flex-developer.html\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer.html\",\"https:\\/\\/hire-web-developer.com\\/laravel-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/php-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vuejs-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/prestashop-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/wordpress-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/bootstrap-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/docker\\/\",\"https:\\/\\/hire-web-developer.com\\/figma-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/filamentphp-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/git-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/html-css-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/javascript-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/linux-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/livewire-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/mysql-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/oop-ddd-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/opencart-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/rest-api-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/scss-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/swagger-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/tailwindcss-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/twig-smarty-blade-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/typescript-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vite-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/contact\\/\",\"https:\\/\\/hire-web-developer.com\\/pricing\\/\",\"https:\\/\\/hire-web-developer.com\\/reviews\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/about.html\",\"https:\\/\\/hire-web-developer.com\\/laravel\\/index.html\"]}', 'done', 1, 64, 64, 0, 1, 3, NULL, '2026-04-26 15:21:03', '2026-04-26 15:21:15', '2026-04-26 15:21:35', '2026-04-26 15:21:03'),
(12, 5, 10, 'index_urls', '{\"urls\":[\"https:\\/\\/hire-web-developer.com\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-flex-developer.html\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer.html\",\"https:\\/\\/hire-web-developer.com\\/laravel-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/php-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vuejs-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/prestashop-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/wordpress-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/bootstrap-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/docker\\/\",\"https:\\/\\/hire-web-developer.com\\/figma-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/filamentphp-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/git-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/html-css-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/javascript-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/linux-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/livewire-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/mysql-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/oop-ddd-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/opencart-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/rest-api-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/scss-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/swagger-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/tailwindcss-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/twig-smarty-blade-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/typescript-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/vite-developer\\/\",\"https:\\/\\/hire-web-developer.com\\/contact\\/\",\"https:\\/\\/hire-web-developer.com\\/pricing\\/\",\"https:\\/\\/hire-web-developer.com\\/reviews\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-laravel-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-php-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-prestashop-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-australia\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-canada\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-france\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-germany\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-netherlands\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-poland\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-uk\\/\",\"https:\\/\\/hire-web-developer.com\\/hire-wordpress-developer-usa\\/\",\"https:\\/\\/hire-web-developer.com\\/about.html\",\"https:\\/\\/hire-web-developer.com\\/laravel\\/index.html\"]}', 'done', 1, 64, 60, 4, 1, 3, NULL, '2026-04-26 15:31:55', '2026-04-26 15:32:05', '2026-04-26 15:32:07', '2026-04-26 15:31:55'),
(13, 5, 11, 'index_urls', '{\"urls\":[\"https:\\/\\/programist.matviy.pp.ua\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/faq.html\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/mariupol\\/\"]}', 'failed', 1, 302, 0, 302, 1, 3, NULL, '2026-04-26 15:38:39', '2026-04-26 15:39:20', '2026-04-26 15:39:29', '2026-04-26 15:38:39');
INSERT INTO `jobs` (`id`, `user_id`, `site_id`, `type`, `payload`, `status`, `priority`, `total`, `sent`, `failed`, `attempts`, `max_attempts`, `last_error`, `available_at`, `started_at`, `finished_at`, `created_at`) VALUES
(14, 5, 11, 'index_urls', '{\"urls\":[\"https:\\/\\/programist.matviy.pp.ua\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/faq.html\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/rozrobka-saitiv\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/internet-magazin\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/wordpress\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/prestashop\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/opencart\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/laravel\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nextjs\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/nodejs\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/vue\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/seo-optimizatsiya\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/pidtrymka-saitiv\\/ukraine\\/mariupol\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kyiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/lviv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kharkiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/odesa\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/dnipro\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/zaporizhzhia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/vinnytsia\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/poltava\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/chernivtsi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/cherkasy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/chernihiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/zhytomyr\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/ivano-frankivsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/rivne\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/lutsk\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/ternopil\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/mykolaiv\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/khmelnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/sumy\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kropyvnytskyi\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/uzhorod\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/kryvyi-rih\\/\",\"https:\\/\\/programist.matviy.pp.ua\\/crm-erp\\/ukraine\\/mariupol\\/\"]}', 'pending', 1, 302, 0, 0, 0, 3, NULL, '2026-04-26 15:44:26', NULL, NULL, '2026-04-26 15:44:26');

-- --------------------------------------------------------

--
-- Table structure for table `rate_limits`
--

CREATE TABLE `rate_limits` (
  `id` int(10) UNSIGNED NOT NULL,
  `ip` varchar(45) NOT NULL,
  `action` varchar(50) NOT NULL,
  `attempts` smallint(6) NOT NULL DEFAULT 1,
  `blocked_until` datetime DEFAULT NULL,
  `last_attempt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rate_limits`
--

INSERT INTO `rate_limits` (`id`, `ip`, `action`, `attempts`, `blocked_until`, `last_attempt`) VALUES
(44, '13.62.18.195', 'forgot', 2, NULL, '2026-04-26 15:07:29'),
(45, '16.16.185.101', 'forgot', 1, NULL, '2026-04-26 15:06:13'),
(50, '51.20.98.167', 'login', 1, NULL, '2026-04-26 15:14:56');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(128) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `last_active` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
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
  `total_urls` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `indexed_total` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `last_run_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sitemap_last_parsed` datetime DEFAULT NULL,
  `sitemap_url_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `user_id`, `domain`, `sitemap_url`, `status`, `error_message`, `total_urls`, `indexed_total`, `last_run_at`, `created_at`, `updated_at`, `sitemap_last_parsed`, `sitemap_url_count`) VALUES
(4, 2, 'indexfast.pro/sitemap.xml', 'https://indexfast.pro/sitemap.xml', 'active', NULL, 13, 0, NULL, '2026-03-19 14:57:51', '2026-03-19 14:58:07', NULL, 0),
(6, 1, 'indexfast.pro/sitemap.xml', 'https://indexfast.pro/sitemap.xml', 'active', NULL, 13, 0, NULL, '2026-03-21 09:25:11', '2026-03-21 09:25:13', NULL, 0),
(7, 1, 'hirewebdeveloper.pp.ua vip', 'https://hirewebdeveloper.pp.ua', 'error', 'Sitemap порожній або недоступний', 0, 0, NULL, '2026-03-21 12:06:08', '2026-03-21 12:06:19', NULL, 0),
(8, 1, 'hirewebdeveloper.pp.ua 777', 'https://hirewebdeveloper.pp.ua/sitemap.xml', 'active', NULL, 53, 0, NULL, '2026-03-21 12:06:49', '2026-03-21 12:06:50', NULL, 0),
(10, 5, 'hire-web-developer.com', 'https://hire-web-developer.com/sitemap.xml', 'active', NULL, 64, 60, '2026-04-26 15:32:07', '2026-03-21 18:01:10', '2026-04-26 15:32:07', NULL, 0),
(11, 5, 'programist.matviy.pp.ua', 'https://programist.matviy.pp.ua/sitemap.xml', 'active', NULL, 302, 0, NULL, '2026-04-26 15:38:31', '2026-04-26 15:38:32', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `site_credentials`
--

CREATE TABLE `site_credentials` (
  `site_id` int(10) UNSIGNED NOT NULL,
  `service_account` mediumtext NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_credentials`
--

INSERT INTO `site_credentials` (`site_id`, `service_account`, `updated_at`) VALUES
(4, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-19 14:57:51'),
(6, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 09:25:11'),
(7, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 12:06:08'),
(8, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 12:06:49'),
(10, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-03-21 18:01:10'),
(11, 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiaW5kZXhmYXN0LTQ5MDcwOSIsCiAgInByaXZhdGVfa2V5X2lkIjogIjZkZTI5NzIwM2RmNGM5NjMyNWJlZjNiMmZhOWM4OGNiZTVlNjAzYzUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREpCVUxFbGt0T2E2OUFcbnZrS1daUVR0Q1paWnZkWFlMdEpxOTBPb3p3emVKVjZ5TFFyZWhSeTRqVlA4akZyZXVSZENnYkErOWZUM2xvU2JcbnF5a3k1S0YyNWFXTWhBRGxVZVFJenBTRHBvMVFuUUpkbmRPVlIzb290dVJObkkvUDROU1liL2EwWUhlSys2c1NcblZFSTF6OVJMS0s2QWFMc29UbExLcHlDWW84VmwzeU1KWW5Wc1ZwcktBZHV0WG14bjZHTDFnUUdHTU5peWNjTjNcbkdqbElCY1NCMC85QVBOUDFjS2lKTTkwcklFTlJhT042K2pJSHFnUm96MVlzdEFneGZRVmZJUnBXamhyOE16ZFFcbnpwRzRWWkFjN2NobkltSis5aVZjSmQ2MXo5dXloNWFwQ0JhMklHejVxZGdqWUV2MGlZTHk3bzNTYXJUeFZEU3RcbnhWK1ZIN21EQWdNQkFBRUNnZ0VBREJ1c2cySFlKRitaSFVtNGdnMlFwK1J4Y1hOZFM1bTZZK1lENWNtZTZVeVBcbjhTU0VhSlhVL29ySXVjZ01leWpqN1VZWmd4bFdpWWsvOEk1MU8xTUpKTHU5Wm9MVytQa2ZScWFHekkwK0t0SmlcblA1aFBrOGpMNDJMc3luMzVMWmpKeFdyTkRkMVhwZi8xdEhOdHo0YjJyeFpDdUlwV1o1MmNJQWZFRDEyaCtMcEdcbkxSb0c1bC9iQWJoV2hnQXhsYUhzVEkyclBOVFRYZUlNandyLy91UlZNNzVIaHZvSGNzcTNQTE0vOHdFVVFyRmFcbmR0a3ZQNUh1ak5IRUJuK05OOFNNc1ZoaDJxeDdHNjA3ZU5VQW8yeWNPV05DVytqdDByOUgxS0R4N1RnTXNHVVNcbm14SDFqNFJWcjBmZTd1SmVFYktYb204LzFzeWwxV3hIYlYvOGoreE81UUtCZ1FEcjVMbC9QdUJnRnZRVzZpSlRcbmp1aXIyekpUTmVCOVhla2Q0SlRhOW9GSzBHL0tKQ3Y2bmFQdzJKYm0zUFRORVBEZVpTcDAwVFJiMlloQm9YZEpcbmowL3h1WWhSWXVadW5jdEVjMXJHZ0h0dnBHQVpkL3BYUVdsNEZvVDlWN01VMEFIa1pRVjRMTnVSTlYvbXp2RnJcbldOb2pCL3hSeHVCbCtnSTl2Y0VZYWptZ05RS0JnUURhSjVqNXlJRWh5cXR3UFZYZXIvcmpaY3ZUSmpCZlRoWW5cbjVvTFdNK3lPTGxRVEM5RWpPRllTQ0hSejhDSThZdzgrRzlVK3hOUWppSndrZ3praG8vbDlmYVRFL2dKcURGamtcbndYaC9XTmhkd1dIa2poN1I1b3VCSllxcVRHQ05aZHgvNWtOK2tPMmUzVEFtaGc2a0thSkEwZU9ITEFnVUpEam9cbnlqOGFJbUVaMXdLQmdBR0pkUGZ5UmUzNldFN0o2YjFYb2daMG9DaFFvb3pPanRWR0FGSkk1dURBNk9tTlFNZ2FcblBOWTE0dzNRQkx4TlR2Unova25TangvR0ZCQXhhQ0NQa1hyR3RhK3FFRXhLTk9mV1JKSWtoaWxkRGM4OHErSGpcbnFEZERGa3k4Ukl0dks0UDhjSU91N3lOTUVMcmxRRWR0eGNZU3FEODBKNFFpazk4cEhGZjNZVGE5QW9HQkFJTURcbjZ2U0FQVVZORVY3c0J5a2hLUnp1WXRYaGhvV0dRUG9manc0VHl3cXN1aU5pSW16emhZVjQvRzh3bFc4TTB2ZXJcbkFZdWI3QWVYSUtjeEE5dTNQYnZtL0ZDdWVFYTJPYURRckl4V2tFTG1RK05la3hYZVRvUDJSdXYxeUxyQ3BRVlBcbkJkUDZPQ3NEamNwbEVsLzIvUkhPdThYUFpONnJ6bDNJTU5PQ09DeXJBb0dBRkR5MEVVRWpuRXJoWm1pS0tMeWJcbk9JejdrVjEyR0FmSlIyb2VENEJxRlVZbXpLcWNtbUlyeDhaVTB0cnhBOE5RZWFWS1RzS1NUcFVOTG5JTzRTdVFcbjVTcUxGVGlJblRDR3hNSVV5NVpKY1VEQldwNEJEaUJ6R0lGRDFTU3NITU4rNlJFVWpyVG9CeGkwMFloSUVraUFcbjhrNmtpcnFhMDJtNUFGbVNoaUQzVmN3PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImluZGV4ZmFzdEBpbmRleGZhc3QtNDkwNzA5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwMjAwODM5MzU4Nzg3MDU1NTIyNiIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvaW5kZXhmYXN0JTQwaW5kZXhmYXN0LTQ5MDcwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQ==', '2026-04-26 15:38:31');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `token` varchar(128) NOT NULL,
  `type` enum('email_verify','password_reset','refresh','unsubscribe') NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `type`, `expires_at`, `used_at`, `created_at`) VALUES
(3, 2, '4bed3166e20d04269bdb09e00bf38782bd1b6ced909c39cbc4366d84609046c1', 'email_verify', '2026-03-20 16:52:38', NULL, '2026-03-19 14:52:38'),
(4, 2, 'bea7b42cb3066017c66cfbaf952e267df6dc84feef69a0610ed2d64540f7a3f2', 'refresh', '2026-03-20 16:52:38', NULL, '2026-03-19 14:52:38'),
(5, 1, 'c6d7c01fd43bd69b27b4ccdeb37bc35f66d317a11d49a92642348862bae1229e', 'email_verify', '2026-03-22 10:10:00', NULL, '2026-03-21 08:10:00'),
(6, 3, 'ac6d1367d41cc73cad4f26c54d90efd721231eea3b6a227c01d39ce9074c843d', 'email_verify', '2026-03-22 19:51:53', NULL, '2026-03-21 17:51:53'),
(7, 4, '67559b4b42fee090d769f2fada2e70557a3fb848a2ce0e61671de72856dc8918', 'email_verify', '2026-03-22 19:53:05', NULL, '2026-03-21 17:53:05'),
(9, 6, '686a6d8038b3c174e59df5acc41bc87e95e646bbf0872cfab4cf3c9330841899', 'email_verify', '2026-03-22 20:38:23', NULL, '2026-03-21 18:38:23'),
(10, 7, '0eb8b7d813d4b5e76716cd67006d177ac0b6bdb48bd3302bb6e4b4cc62377340', 'email_verify', '2026-03-25 20:18:04', '2026-03-24 18:20:30', '2026-03-24 18:18:04'),
(11, 8, '22c57a213cfc3df4cfdba51a65fd61ea3645d4a5ebb1ae7439ddfacd31f57b3f', 'email_verify', '2026-03-29 01:58:43', NULL, '2026-03-27 23:58:43'),
(12, 9, '668d7627f343e011a49a411b413437b77ff40cebbfa7ec16de8ee6ad0253f978', 'email_verify', '2026-04-27 17:52:32', '2026-04-26 14:54:35', '2026-04-26 14:52:32'),
(14, 9, 'b2ff2b677bbd48d61786d9a5cc94a34e04638069838f182bf65150273e3811fd', 'password_reset', '2026-04-26 19:06:13', '2026-04-26 15:07:20', '2026-04-26 15:06:13'),
(15, 5, 'b5d289cf992a81363226ede75a4e38b17efebe7a485bd0fedae50b80e392a1e3', 'email_verify', '2026-04-27 18:07:29', '2026-04-26 15:07:49', '2026-04-26 15:07:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `surname` varchar(100) NOT NULL DEFAULT '',
  `avatar_url` varchar(255) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `google_email` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `marketing_consent` tinyint(1) NOT NULL DEFAULT 0,
  `gsc_access_token` text DEFAULT NULL,
  `gsc_token_expires` datetime DEFAULT NULL,
  `plan` enum('start','pro','agency') NOT NULL DEFAULT 'start',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `surname`, `avatar_url`, `google_id`, `google_email`, `email_verified`, `is_active`, `marketing_consent`, `gsc_access_token`, `gsc_token_expires`, `plan`, `created_at`, `updated_at`, `last_login_at`) VALUES
(1, 'test777@apartner.pro', '$2y$12$QtfQvnhLdXJDlVLmPnq1Juv1avd4OW0dYVVfwnpzQqH9WHz3ZZVKS', 'Roman', 'Matviy', NULL, NULL, NULL, 1, 1, 1, NULL, NULL, 'start', '2026-03-19 09:59:14', '2026-04-26 14:51:56', '2026-04-26 14:51:56'),
(2, 'test@test.com', '$2y$12$ZE2BLnvABZ44Bn2AqIrNpOWiBE33OThbLXZLx0c6fAYOL5SiwnIiO', 'Roman', 'Matviy', NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'agency', '2026-03-19 14:52:38', '2026-04-26 13:43:59', '2026-03-20 09:05:09'),
(3, '7775@test.com', '$2y$12$uNYu4vs5ARPFQ.CGjEPbCuWA3CdIw72BTyR7fN5QWkQJUiQlyXzV2', '99', '99', NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'pro', '2026-03-21 17:51:53', '2026-04-26 13:43:58', '2026-03-21 17:52:34'),
(4, '999@yyy.com', '$2y$12$kbYSC6wUeaw5WXr.3dGMnekJdKz/AiOdN8InebWAORPcvjNNy6Vr6', '999', '999', NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'pro', '2026-03-21 17:53:05', '2026-04-26 13:43:56', NULL),
(5, 'roman@matviy.pp.ua', '$2y$12$VeSqtX/JZNxhpEREbfbA6uyagYwERgYKagruoHUw4b8eEuZQfNY3C', '999', '999', NULL, NULL, NULL, 1, 1, 1, NULL, NULL, 'agency', '2026-03-21 17:58:05', '2026-04-26 15:50:02', '2026-04-26 15:15:30'),
(6, 't@t.ua', '$2y$12$TZyQlhy.HhZaoqJzVoVGVeV.KnvINoLj2OJUexseUmIBgkTeG7qfC', 'Yy', '', NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'pro', '2026-03-21 18:38:23', '2026-04-26 13:43:16', NULL),
(7, '888@matviy.pp.ua', '$2y$12$mhWzyBl7iFOG3kYLQis8Eu4BjYpmmCb865xPfyCjEfnJl0DR3g.RO', '1111', '1111', NULL, NULL, NULL, 1, 1, 0, NULL, NULL, 'agency', '2026-03-24 18:18:04', '2026-04-26 13:43:28', NULL),
(8, '9test@test.com', '$2y$12$ATtJzmieO8UjhPhBYogT..GaHVST4mlYTD/JpbRQJh/dRlxOE9MRm', 'Ttt', 'Tt', NULL, NULL, NULL, 0, 1, 0, NULL, NULL, 'pro', '2026-03-27 23:58:43', '2026-04-26 13:43:52', NULL),
(9, 'xxx@matviy.pp.ua', '$2y$12$58I5SR0Xn.6WwlQuqD4a6exTSjPPqzlg3ywjKtcX/8lqhsagCUrsC', 'xxx', 'xxx', NULL, NULL, NULL, 1, 1, 0, NULL, NULL, 'start', '2026-04-26 14:52:32', '2026-04-26 15:07:20', '2026-04-26 14:53:07');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=461;

--
-- AUTO_INCREMENT for table `indexing_log`
--
ALTER TABLE `indexing_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=978;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `rate_limits`
--
ALTER TABLE `rate_limits`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
