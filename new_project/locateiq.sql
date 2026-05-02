-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2026 at 07:48 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `locateiq`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_chat_analysis`
--

CREATE TABLE `ai_chat_analysis` (
  `chatID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `aiResponse` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `confidenceScore` decimal(6,2) DEFAULT NULL,
  `project_name` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cluster_val` int(11) DEFAULT NULL,
  `suitability_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score_val` decimal(6,2) DEFAULT NULL,
  `timestamp_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ai_chat_analysis`
--

INSERT INTO `ai_chat_analysis` (`chatID`, `userID`, `message`, `aiResponse`, `confidenceScore`, `project_name`, `location_label`, `cluster_val`, `suitability_label`, `score_val`, `timestamp_created`) VALUES
(1, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Cluster: 2, Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 04:36:00'),
(2, 1, 'Project: مشفى في اربيل, Type: عام, Location: عسير', 'Cluster: 2, Suitability: غير مُوصى به, Score: 24.66%', '0.25', 'مشفى في اربيل', 'عسير', 2, 'غير مُوصى به', '24.66', '2026-05-02 04:45:01'),
(3, 1, 'Project: مشفى في عسير, Type: عام, Location: عسير', 'Cluster: 2, Suitability: غير مُوصى به, Score: 24.66%', '0.25', 'مشفى في عسير', 'عسير', 2, 'غير مُوصى به', '24.66', '2026-05-02 04:45:33'),
(4, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Cluster: 2, Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:07:56'),
(5, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Cluster: 2, Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:11:08'),
(6, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Cluster: 2, Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:11:16'),
(7, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Cluster: 2, Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:12:24'),
(8, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:36:25'),
(9, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:44:35'),
(10, 1, 'Project: مقهى في أبها, Type: مقهى, Location: أبها', 'Suitability: مناسب متوسط, Score: 46.31%', '0.46', 'مقهى في أبها', 'أبها', 2, 'مناسب متوسط', '46.31', '2026-05-02 05:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `liq_dataset`
--

CREATE TABLE `liq_dataset` (
  `id` int(10) UNSIGNED NOT NULL,
  `city` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `neighborhood` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `population_density` double NOT NULL,
  `services_count` double NOT NULL,
  `competitors_count` double NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `liq_dataset`
--

INSERT INTO `liq_dataset` (`id`, `city`, `neighborhood`, `population_density`, `services_count`, `competitors_count`, `latitude`, `longitude`) VALUES
(1, 'Khamis Mushait', 'حي العرق الشمالي', 3799, 39, 30, 18.306, 42.7332),
(2, 'Khamis Mushait', 'حي ام سرور', 3800, 41, 26, 18.3148, 42.7332),
(3, 'Khamis Mushait', 'حي الشرفية', 3800, 58, 40, 18.317, 42.7353),
(4, 'Khamis Mushait', 'حي قمبر', 3800, 44, 29, 18.306, 42.7374),
(5, 'Khamis Mushait', 'حي الربيع', 3800, 47, 28, 18.3082, 42.7395),
(6, 'Khamis Mushait', 'حي السلام', 3800, 71, 53, 18.3104, 42.7416),
(7, 'Khamis Mushait', 'حي نشوان', 3800, 51, 27, 18.3126, 42.7437),
(8, 'Khamis Mushait', 'حي المصيف', 3800, 47, 42, 18.3148, 42.729),
(9, 'Khamis Mushait', 'حي الصناعية', 3800, 50, 43, 18.317, 42.7311),
(10, 'Abha', 'حي المنهل', 4500, 10, 21, 18.2164, 42.5053),
(11, 'Abha', 'حي النصب', 4500, 10, 21, 18.2184, 42.5073),
(12, 'Abha', 'حي وسط المدينة', 4500, 11, 21, 18.2204, 42.5093),
(13, 'Abha', 'حي النزهة', 4500, 57, 50, 18.2224, 42.5113),
(14, 'Abha', 'حي ذرة', 4500, 10, 21, 18.2244, 42.5133),
(15, 'Abha', 'حي شمسان', 4500, 20, 23, 18.2164, 42.5153),
(16, 'Abha', 'حي القرى', 4500, 22, 22, 18.2184, 42.5173),
(17, 'Abha', 'حي الوردتين', 4500, 10, 21, 18.2204, 42.5053),
(18, 'Abha', 'حي الوادي', 3200, 12, 22, 18.2164, 42.5093),
(19, 'Abha', 'حي الضباب', 4500, 16, 22, 18.2184, 42.5133),
(20, 'Abha', 'حي الوصايف', 4500, 15, 23, 18.2204, 42.5153),
(21, 'Abha', 'حي الشرفية', 4500, 58, 40, 18.2224, 42.5173),
(22, 'Abha', 'حي العزيزية', 4500, 54, 51, 18.2244, 42.5053),
(23, 'Abha', 'حي الشفاء', 3200, 50, 54, 18.2164, 42.5073),
(24, 'Abha', 'حي المفتاحة', 3200, 12, 22, 18.2184, 42.5093),
(25, 'Abha', 'حي السروات', 3200, 12, 21, 18.2204, 42.5113),
(26, 'Abha', 'حي المروج', 3200, 13, 22, 18.2224, 42.5133),
(27, 'Abha', 'حي السد', 3200, 53, 44, 18.2244, 42.5153),
(28, 'Abha', 'حي الخشع', 3200, 23, 23, 18.2164, 42.5173),
(29, 'Abha', 'حي القابل', 3200, 10, 21, 18.2184, 42.5053),
(30, 'Abha', 'حي الفيصلية', 3200, 10, 21, 18.2204, 42.5073),
(31, 'Abha', 'حي الخالدية', 3200, 49, 51, 18.2224, 42.5093),
(32, 'Abha', 'حي العرين', 3200, 9, 20, 18.2244, 42.5113),
(33, 'Abha', 'حي البديع', 3200, 17, 22, 18.2164, 42.5133),
(34, 'Khamis Mushait', 'حي الحمراء', 3800, 40, 22, 18.317, 42.7353),
(35, 'Khamis Mushait', 'حي الهرير الغربى', 3800, 44, 29, 18.306, 42.7374),
(36, 'Khamis Mushait', 'حي المراث', 3800, 47, 28, 18.3082, 42.7395),
(37, 'Khamis Mushait', 'حي الظرفة', 3800, 51, 30, 18.3104, 42.7416),
(38, 'Khamis Mushait', 'حي تارة', 3800, 51, 27, 18.3126, 42.7437),
(39, 'Khamis Mushait', 'حي النجاح', 3800, 37, 21, 18.3148, 42.729),
(40, 'Khamis Mushait', 'حي الجبل', 3800, 39, 22, 18.317, 42.7311),
(41, 'Khamis Mushait', 'حي شمال التضامن', 3800, 39, 30, 18.306, 42.7332),
(42, 'Khamis Mushait', 'حي الوفاء', 3800, 43, 32, 18.3082, 42.7353),
(43, 'Khamis Mushait', 'حي التعاون', 3800, 54, 51, 18.3104, 42.7374),
(44, 'Khamis Mushait', 'حي أحد', 3800, 48, 28, 18.3126, 42.7395),
(45, 'Khamis Mushait', 'حي الدوحة', 3800, 43, 32, 18.3082, 42.7353),
(46, 'Khamis Mushait', 'حي العزيزية', 3800, 54, 51, 18.3104, 42.7374),
(47, 'Abha', 'حي الروضة', 3200, 63, 52, 18.2184, 42.5113),
(48, 'Abha', 'حي الفل', 3200, 15, 22, 18.2204, 42.5133),
(49, 'Abha', 'حي الروابي', 3200, 14, 20, 18.2224, 42.5153),
(50, 'Khamis Mushait', 'حي الوقواق', 5200, 45, 29, 18.3126, 42.7353),
(51, 'Khamis Mushait', 'حي الهرير الشرقى', 5200, 45, 28, 18.3148, 42.7374),
(52, 'Khamis Mushait', 'حي الوقبة', 5200, 46, 27, 18.317, 42.7395),
(53, 'Khamis Mushait', 'حي مصلوم', 5200, 46, 29, 18.306, 42.7416),
(54, 'Khamis Mushait', 'حي الراقي', 5200, 48, 27, 18.3082, 42.7437),
(55, 'Khamis Mushait', 'حي الأسواق', 5200, 37, 28, 18.3104, 42.729),
(56, 'Khamis Mushait', 'حي الواحة', 5200, 39, 28, 18.3126, 42.7311),
(57, 'Khamis Mushait', 'حي السد', 5200, 53, 44, 18.3148, 42.7332),
(58, 'Khamis Mushait', 'حي الجزيرة', 5200, 40, 22, 18.317, 42.7353),
(59, 'Khamis Mushait', 'حي طيب الاسم', 5200, 44, 29, 18.306, 42.7374),
(60, 'Khamis Mushait', 'حي الزهور', 5200, 69, 50, 18.3082, 42.7395),
(61, 'Khamis Mushait', 'حي الروضة', 5200, 63, 52, 18.3104, 42.7416),
(62, 'Khamis Mushait', 'حي المنتزه', 5200, 51, 27, 18.3126, 42.7437),
(63, 'Khamis Mushait', 'حي ضمك', 5200, 37, 21, 18.3148, 42.729),
(64, 'Khamis Mushait', 'حي الخزان', 5200, 39, 22, 18.317, 42.7311),
(65, 'Khamis Mushait', 'حي الخالدية', 5200, 49, 51, 18.306, 42.7332),
(66, 'Abha', 'حي الربوة', 4500, 10, 21, 18.2224, 42.5073),
(67, 'Abha', 'حي المطار', 3200, 15, 18, 18.2244, 42.5173),
(68, 'Abha', 'حي المصيف', 3200, 47, 42, 18.2164, 42.5053),
(69, 'Abha', 'حي سلطانة', 3200, 10, 21, 18.2184, 42.5073),
(70, 'Abha', 'حي الصناعية', 3200, 50, 43, 18.2204, 42.5093),
(71, 'Abha', 'حي البحيره', 3200, 12, 21, 18.2224, 42.5113),
(72, 'Abha', 'حي العقيق', 3200, 10, 21, 18.2244, 42.5133),
(73, 'Abha', 'حي السلام', 3200, 71, 53, 18.2164, 42.5153),
(74, 'Abha', 'حي الزهور', 3200, 69, 50, 18.2184, 42.5173),
(75, 'Abha', 'حي المسك', 3200, 10, 21, 18.2204, 42.5053),
(76, 'Khamis Mushait', 'حي ذهبان الغربى', 5200, 35, 31, 18.306, 42.729),
(77, 'Khamis Mushait', 'حي ذهبان الشرقى', 5200, 40, 32, 18.3082, 42.7311),
(78, 'Khamis Mushait', 'حي الرصراص 1', 5200, 40, 31, 18.3104, 42.7332),
(79, 'Khamis Mushait', 'حي النهضة', 5200, 43, 32, 18.3082, 42.7353),
(80, 'Khamis Mushait', 'حي الفتح', 5200, 45, 30, 18.3104, 42.7374),
(81, 'Khamis Mushait', 'حي شباعه', 5200, 48, 28, 18.3126, 42.7395),
(82, 'Khamis Mushait', 'حي المعزاب', 5200, 47, 28, 18.3148, 42.7416),
(83, 'Khamis Mushait', 'حي المثناة', 5200, 46, 25, 18.317, 42.7437),
(84, 'Khamis Mushait', 'حي المعمورة', 5200, 35, 31, 18.306, 42.729),
(85, 'Khamis Mushait', 'حي النسيم', 3800, 48, 53, 18.3082, 42.7311),
(86, 'Khamis Mushait', 'حي شكر', 3800, 40, 31, 18.3104, 42.7332),
(87, 'Khamis Mushait', 'حي النزهة', 3800, 57, 50, 18.3126, 42.7353),
(88, 'Khamis Mushait', 'حي عتود', 3800, 45, 28, 18.3148, 42.7374),
(89, 'Khamis Mushait', 'حي ال هميلة', 3800, 46, 27, 18.317, 42.7395),
(90, 'Khamis Mushait', 'حي العرق الجنوبي', 3800, 46, 29, 18.306, 42.7416),
(91, 'Khamis Mushait', 'حي الصقور', 3800, 48, 27, 18.3082, 42.7437),
(92, 'Khamis Mushait', 'حي البوادي', 3800, 37, 28, 18.3104, 42.729),
(93, 'Khamis Mushait', 'حي النخيل', 3800, 39, 28, 18.3126, 42.7311),
(94, 'Abha', 'حي التعاون', 3200, 54, 51, 18.2244, 42.5073),
(95, 'Abha', 'حي النسيم', 4500, 48, 53, 18.2244, 42.5093),
(96, 'Abha', 'حي الاندلس', 4500, 15, 22, 18.2164, 42.5113),
(97, 'Abha', 'حي الصفا', 3200, 20, 23, 18.2184, 42.5153),
(98, 'Abha', 'حي ج 35', 3200, 21, 19, 18.2204, 42.5173),
(99, 'Abha', 'حي المقضى', 3200, 10, 21, 18.2224, 42.5053),
(100, 'Khamis Mushait', 'حي القافلة', 3800, 48, 28, 18.3126, 42.7395),
(101, 'Khamis Mushait', 'حي مخطط الموسى', 3800, 47, 28, 18.3148, 42.7416),
(102, 'Khamis Mushait', 'حي سكن القاعدة الجوية', 3800, 46, 25, 18.317, 42.7437),
(103, 'Khamis Mushait', 'حي الرونه', 3800, 35, 31, 18.306, 42.729),
(104, 'Khamis Mushait', 'حي الشفاء', 3800, 50, 54, 18.3082, 42.7311),
(105, 'Khamis Mushait', 'حي ذلالة', 3800, 40, 31, 18.3104, 42.7332),
(106, 'Khamis Mushait', 'حي الرصراص 2', 3800, 45, 29, 18.3126, 42.7353),
(107, 'Khamis Mushait', 'حي سكن المدينة العسكرية', 3800, 45, 28, 18.3148, 42.7374),
(108, 'Khamis Mushait', 'حي سكن مجموعة اللواء الرابع عشر', 3800, 46, 27, 18.317, 42.7395),
(109, 'Khamis Mushait', 'حي الجامعيين', 3800, 46, 29, 18.306, 42.7416),
(110, 'Khamis Mushait', 'حي شعب ذهبان', 3800, 47, 28, 18.3148, 42.7416),
(111, 'Khamis Mushait', 'حي الوسام', 3800, 48, 27, 18.3082, 42.7437),
(112, 'Khamis Mushait', 'حي اليرموك', 3800, 37, 28, 18.3104, 42.729),
(113, 'Khamis Mushait', 'حي الحرابى', 3800, 39, 28, 18.3126, 42.7311);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA-256 hex',
  `language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'ar',
  `registrationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `phoneNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `profileImage` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `email`, `password`, `language`, `registrationDate`, `phoneNumber`, `nationalID`, `birthDate`, `profileImage`) VALUES
(1, 'ahmad mouhammad', 'ahmad@gmail.com', 'b6d0f776ec1b0f17a373031e4144746ab155d6c9f6cb45e8ba2cc2d8c8529065', 'ar', '2026-05-02 04:34:46', NULL, NULL, NULL, NULL),
(2, 'Admin', 'admin@locateiq.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'ar', '2026-05-02 05:43:20', NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_chat_analysis`
--
ALTER TABLE `ai_chat_analysis`
  ADD PRIMARY KEY (`chatID`),
  ADD KEY `idx_chat_user_time` (`userID`,`timestamp_created`);

--
-- Indexes for table `liq_dataset`
--
ALTER TABLE `liq_dataset`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_neighborhood` (`neighborhood`(100));

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_chat_analysis`
--
ALTER TABLE `ai_chat_analysis`
  MODIFY `chatID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `liq_dataset`
--
ALTER TABLE `liq_dataset`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_chat_analysis`
--
ALTER TABLE `ai_chat_analysis`
  ADD CONSTRAINT `fk_chat_user` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
