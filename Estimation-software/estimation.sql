-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2025 at 02:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `estimation`
--

-- --------------------------------------------------------

--
-- Table structure for table `counter`
--

CREATE TABLE `counter` (
  `id` int(11) NOT NULL,
  `last_estimation_number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counter`
--

INSERT INTO `counter` (`id`, `last_estimation_number`) VALUES
(1, 'E27');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry`
--

CREATE TABLE `enquiry` (
  `enquiry_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `complete` int(11) DEFAULT 0,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enquiry`
--

INSERT INTO `enquiry` (`enquiry_id`, `customer_name`, `phone_number`, `email`, `complete`, `date`) VALUES
(1, 'Raja', '9876543210', 'raja@example.com', 1, '2025-08-28 14:27:11'),
(2, 'Muthu', '8765432109', 'muthu@example.com', 0, '2025-08-28 14:27:11');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_items`
--

CREATE TABLE `enquiry_items` (
  `item_id` int(11) NOT NULL,
  `enquiry_id` int(11) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enquiry_items`
--

INSERT INTO `enquiry_items` (`item_id`, `enquiry_id`, `product_id`, `quantity`) VALUES
(1, 1, 'P001', 5),
(2, 1, 'P003', 2),
(3, 2, 'P002', 1),
(4, 2, 'P005', 4);

-- --------------------------------------------------------

--
-- Table structure for table `estimations`
--

CREATE TABLE `estimations` (
  `estimation_number` varchar(20) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `is_marked` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estimations`
--

INSERT INTO `estimations` (`estimation_number`, `customer_name`, `phone_number`, `discount`, `total_amount`, `is_marked`, `created_at`) VALUES
('E1', 'Prabhu', '1234567890', 10.00, 243.00, 0, '2025-08-27 18:09:59'),
('E10', 'Joker', '2222', 20.00, 136.00, 0, '2025-08-27 19:23:46'),
('E11', 'Joker', '1234567890', 12.00, 198.00, 0, '2025-08-27 19:31:07'),
('E12', 'Joker', '1234567890', 12.00, 2420.00, 0, '2025-08-27 19:35:05'),
('E13', 'Joker', '1234567890', 12.00, 220.00, 1, '2025-08-27 19:47:34'),
('E14', 'Joker', '1234567891', 12.00, 3080.00, 0, '2025-08-28 04:47:34'),
('E15', 'root', '4383749348', 76.00, 14880.00, 0, '2025-08-28 04:49:04'),
('E16', 'xfdvsd', '4346653456', 12.00, 338.80, 1, '2025-08-28 05:18:57'),
('E17', 'Joker', '3949234024', 40.00, 600.00, 1, '2025-08-28 05:35:42'),
('E18', 'Joker', '3949234024', 8.00, 920.00, 1, '2025-08-28 05:37:35'),
('E19', 'root', '1234567891', 6.00, 2113310.82, 0, '2025-08-28 07:20:30'),
('E2', 'Tamil', '1234567890', 0.00, 135.00, 0, '2025-08-27 18:23:12'),
('E20', 'Jokers', '1234567891', 50.00, 8276459.50, 0, '2025-08-28 07:24:15'),
('E21', 'Jokerssss', '1234567891', 90.00, 1655291.90, 0, '2025-08-28 07:40:35'),
('E22', 'Raja', '9876543210', 0.00, 1390.00, 0, '2025-08-28 09:09:44'),
('E23', 'Jokerssss', '1234567891', 90.00, 1655505.90, 0, '2025-08-28 09:45:00'),
('E24', 'Jokerssss', '1234567891', 90.00, 1655505.90, 0, '2025-08-28 10:04:11'),
('E25', 'Raja', '9876543210', 10.00, 1251.00, 0, '2025-08-28 12:14:02'),
('E26', 'Raja', '9876543210', 10.00, 1251.00, 0, '2025-08-28 12:14:28'),
('E27', 'Raja', '9876543210', 0.00, 1390.00, 0, '2025-08-28 12:15:57'),
('E3', 'Joker', '00000000000', 50.00, 1620.00, 0, '2025-08-27 18:28:27'),
('E4', 'English', '1234567890', 10.00, 9000.00, 0, '2025-08-27 18:34:27'),
('E5', 'Joker', '3333333333', 30.00, 91000.00, 0, '2025-08-27 18:41:27'),
('E6', 'Jokers', '1234567894', 20.00, 8000.00, 0, '2025-08-28 04:51:50'),
('E7', 'Joker', '38483479343', 30.00, 1547.00, 0, '2025-08-27 18:57:56'),
('E8', 'Joker', '3333333', 20.00, 106665.60, 0, '2025-08-27 19:01:21'),
('E9', 'Joker', '2222', 20.00, 136.00, 0, '2025-08-27 19:22:24');

-- --------------------------------------------------------

--
-- Table structure for table `estimation_items`
--

CREATE TABLE `estimation_items` (
  `id` int(11) NOT NULL,
  `estimation_number` varchar(20) DEFAULT NULL,
  `product_id` varchar(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estimation_items`
--

INSERT INTO `estimation_items` (`id`, `estimation_number`, `product_id`, `quantity`) VALUES
(1, 'E1', 'P003', 1),
(2, 'E2', 'P002', 1),
(3, 'E3', 'P003', 12),
(4, 'E4', 'P007', 1),
(5, 'E5', 'P007', 13),
(7, 'E7', 'P001', 13),
(8, 'E8', 'P010', 12),
(9, 'E9', 'P001', 1),
(10, 'E10', 'P001', 1),
(11, 'E11', 'P005', 1),
(12, 'E12', 'P005', 11),
(13, 'E13', 'P005', 1),
(16, 'E14', 'P005', 10),
(17, 'E14', 'P009', 1),
(18, 'E15', 'P008', 31),
(21, 'E6', 'P006', 10),
(23, 'E16', 'P002', 1),
(24, 'E16', 'P005', 1),
(25, 'E17', 'P006', 1),
(26, 'E18', 'P009', 1),
(27, 'E19', 'P001', 1),
(28, 'E19', 'P002', 1),
(29, 'E19', 'P003', 1),
(30, 'E19', 'P004', 1),
(31, 'E19', 'P005', 1),
(32, 'E19', 'P006', 1),
(33, 'E19', 'P007', 1),
(34, 'E19', 'P008', 1),
(35, 'E19', 'P009', 1),
(36, 'E19', 'P010', 1),
(37, 'E19', 'P011', 1),
(38, 'E20', 'P001', 1),
(39, 'E20', 'P002', 1),
(40, 'E20', 'P003', 2),
(41, 'E20', 'P004', 1),
(42, 'E20', 'P005', 1),
(43, 'E20', 'P006', 1),
(44, 'E20', 'P007', 1),
(45, 'E20', 'P008', 1),
(46, 'E20', 'P009', 1),
(47, 'E20', 'P010', 1),
(48, 'E20', 'P011', 1),
(49, 'E20', 'P012', 1),
(50, 'E20', 'P013', 1),
(51, 'E20', 'P014', 1),
(52, 'E20', 'P015', 1),
(53, 'E20', 'P016', 1),
(54, 'E20', 'P017', 1),
(55, 'E21', 'P001', 1),
(56, 'E21', 'P002', 1),
(57, 'E21', 'P003', 2),
(58, 'E21', 'P004', 1),
(59, 'E21', 'P005', 1),
(60, 'E21', 'P006', 1),
(61, 'E21', 'P007', 1),
(62, 'E21', 'P008', 1),
(63, 'E21', 'P009', 1),
(64, 'E21', 'P010', 1),
(65, 'E21', 'P011', 1),
(66, 'E21', 'P012', 1),
(67, 'E21', 'P013', 1),
(68, 'E21', 'P014', 1),
(69, 'E21', 'P015', 1),
(70, 'E21', 'P016', 1),
(71, 'E21', 'P017', 1),
(72, 'E22', 'P001', 5),
(73, 'E22', 'P003', 2),
(91, 'E23', 'P001', 12),
(92, 'E23', 'P002', 1),
(93, 'E23', 'P003', 3),
(94, 'E23', 'P004', 1),
(95, 'E23', 'P005', 1),
(96, 'E23', 'P006', 1),
(97, 'E23', 'P007', 1),
(98, 'E23', 'P008', 1),
(99, 'E23', 'P009', 1),
(100, 'E23', 'P010', 1),
(101, 'E23', 'P011', 1),
(102, 'E23', 'P012', 1),
(103, 'E23', 'P013', 1),
(104, 'E23', 'P014', 1),
(105, 'E23', 'P015', 1),
(106, 'E23', 'P016', 1),
(107, 'E23', 'P017', 1),
(108, 'E24', 'P001', 12),
(109, 'E24', 'P002', 1),
(110, 'E24', 'P003', 3),
(111, 'E24', 'P004', 1),
(112, 'E24', 'P005', 1),
(113, 'E24', 'P006', 1),
(114, 'E24', 'P007', 1),
(115, 'E24', 'P008', 1),
(116, 'E24', 'P009', 1),
(117, 'E24', 'P010', 1),
(118, 'E24', 'P011', 1),
(119, 'E24', 'P012', 1),
(120, 'E24', 'P013', 1),
(121, 'E24', 'P014', 1),
(122, 'E24', 'P015', 1),
(123, 'E24', 'P016', 1),
(124, 'E24', 'P017', 1),
(125, 'E25', 'P001', 5),
(126, 'E25', 'P003', 2),
(127, 'E26', 'P001', 5),
(128, 'E26', 'P003', 2),
(129, 'E27', 'P001', 5),
(130, 'E27', 'P003', 2);

-- --------------------------------------------------------

--
-- Table structure for table `marked_estimations`
--

CREATE TABLE `marked_estimations` (
  `id` int(11) NOT NULL,
  `marked_number` varchar(50) NOT NULL,
  `estimation_number` varchar(20) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `marked_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marked_estimations`
--

INSERT INTO `marked_estimations` (`id`, `marked_number`, `estimation_number`, `customer_name`, `phone_number`, `discount`, `total_amount`, `marked_at`) VALUES
(1, 'M-20250828071900-E16', 'E16', 'xfdvsd', '4346653456', 12.00, 338.80, '2025-08-28 10:49:00'),
(2, 'M-20250828073613-E17', 'E17', 'Joker', '3949234024', 40.00, 600.00, '2025-08-28 11:06:13'),
(3, 'M-20250828073737-E18', 'E18', 'Joker', '3949234024', 8.00, 920.00, '2025-08-28 11:07:37'),
(4, 'M-20250828074817-E13', 'E13', 'Joker', '1234567890', 12.00, 220.00, '2025-08-28 11:18:17'),
(5, 'M-20250828074820-E13', 'E13', 'Joker', '1234567890', 12.00, 220.00, '2025-08-28 11:18:20');

-- --------------------------------------------------------

--
-- Table structure for table `marked_estimation_items`
--

CREATE TABLE `marked_estimation_items` (
  `id` int(11) NOT NULL,
  `marked_number` varchar(50) NOT NULL,
  `product_id` varchar(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marked_estimation_items`
--

INSERT INTO `marked_estimation_items` (`id`, `marked_number`, `product_id`, `quantity`, `price_per_unit`, `total_price`) VALUES
(1, 'M-20250828071900-E16', 'P002', 1, 135.00, 135.00),
(2, 'M-20250828071900-E16', 'P005', 1, 250.00, 250.00),
(3, 'M-20250828073613-E17', 'P006', 1, 1000.00, 1000.00),
(4, 'M-20250828073737-E18', 'P009', 1, 1000.00, 1000.00),
(5, 'M-20250828074817-E13', 'P005', 1, 250.00, 250.00),
(6, 'M-20250828074820-E13', 'P005', 1, 250.00, 250.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `tamil_name` varchar(100) DEFAULT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `offer_price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `in_stock` tinyint(1) DEFAULT 0,
  `content` varchar(100) DEFAULT NULL,
  `image` varchar(1000) DEFAULT 'image.jpg',
  `video` varchar(100) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `tamil_name`, `original_price`, `offer_price`, `category`, `in_stock`, `content`, `image`, `video`, `instagram`, `last_updated`) VALUES
('P001', 'Flower Pot Deluxe', 'Flower Pot Deluxe', 200.00, 170.00, 'Day Time Crackers', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/////', 'https://www.instagram.com////', '2025-08-27 17:38:13'),
('P002', 'Sparkler Star', 'பொறி நட்சத்திரம்', 150.00, 135.00, 'Night Time Crackers', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/watch?v=fw2', 'https://www.instagram.com/p/fw2/', '2025-08-27 22:18:27'),
('P003', 'Crackle Bomb', 'வெடி குண்டு', 300.00, 270.00, 'Aerial Fireworks', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/watch?v=fw3', 'https://www.instagram.com/p/fw3/', '2025-08-27 22:18:27'),
('P004', 'Pop-Pops', 'பாப்-பாப்ஸ்', 50.00, 45.00, 'NewKids Crackers', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/watch?v=fw4', 'https://www.instagram.com/p/fw4/', '2025-08-27 17:43:08'),
('P005', 'Rainbow Fountain', 'வானவில் நீரூற்று', 250.00, 250.00, 'Fancy Crackers', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/watch?v=fw5', 'https://www.instagram.com/p/fw5/', '2025-08-27 19:32:25'),
('P006', 'Sample Cracker', 'Sample Cracker', 1000.00, 1000.00, 'Aerial Fireworks', 1, '1PKT', 'image.jpg', 'https://www.youtube.com/watch?v=undefined', 'https://www.instagram.com/product_link', '2025-08-27 17:47:25'),
('P007', '1wala', '1', 10000.00, 10000.00, '0', 1, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-27 17:22:11'),
('P008', '2wala', 'fsdffs', 2000.00, 2000.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-27 17:32:00'),
('P009', '3wala', '3', 1000.00, 1000.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-27 17:32:50'),
('P010', '11111', '11111', 11111.00, 11111.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-27 17:38:32'),
('P011', '22222222', '22222222', 2222222.00, 2222222.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-27 17:44:56'),
('P012', 'hdfj', '0', 43354.00, 43354.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-28 07:21:15'),
('P013', 'xvjdsfkv', '0', 9343.00, 9343.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-28 07:21:26'),
('P014', 'djkfgkdfg', '0', 934803.00, 934803.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-28 07:21:39'),
('P015', 'dhbksj', '0', 8273923.00, 8273923.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-28 07:21:59'),
('P016', 'jcfnkdxfvd', '0', 4566567.00, 4566567.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-28 07:22:11'),
('P017', 'dsfnvsdfg', '0', 476456.00, 476456.00, '0', 0, '1PKT', 'image.jpg', 'https://www.youtube.com/', 'https://www.instagram.com/', '2025-08-28 07:22:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `counter`
--
ALTER TABLE `counter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry`
--
ALTER TABLE `enquiry`
  ADD PRIMARY KEY (`enquiry_id`);

--
-- Indexes for table `enquiry_items`
--
ALTER TABLE `enquiry_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `enquiry_id` (`enquiry_id`);

--
-- Indexes for table `estimations`
--
ALTER TABLE `estimations`
  ADD PRIMARY KEY (`estimation_number`);

--
-- Indexes for table `estimation_items`
--
ALTER TABLE `estimation_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estimation_number` (`estimation_number`);

--
-- Indexes for table `marked_estimations`
--
ALTER TABLE `marked_estimations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `marked_number` (`marked_number`);

--
-- Indexes for table `marked_estimation_items`
--
ALTER TABLE `marked_estimation_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marked_number` (`marked_number`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `enquiry`
--
ALTER TABLE `enquiry`
  MODIFY `enquiry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `enquiry_items`
--
ALTER TABLE `enquiry_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `estimation_items`
--
ALTER TABLE `estimation_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `marked_estimations`
--
ALTER TABLE `marked_estimations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `marked_estimation_items`
--
ALTER TABLE `marked_estimation_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enquiry_items`
--
ALTER TABLE `enquiry_items`
  ADD CONSTRAINT `enquiry_items_ibfk_1` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiry` (`enquiry_id`) ON DELETE CASCADE;

--
-- Constraints for table `estimation_items`
--
ALTER TABLE `estimation_items`
  ADD CONSTRAINT `estimation_items_ibfk_1` FOREIGN KEY (`estimation_number`) REFERENCES `estimations` (`estimation_number`) ON DELETE CASCADE;

--
-- Constraints for table `marked_estimation_items`
--
ALTER TABLE `marked_estimation_items`
  ADD CONSTRAINT `marked_estimation_items_ibfk_1` FOREIGN KEY (`marked_number`) REFERENCES `marked_estimations` (`marked_number`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
