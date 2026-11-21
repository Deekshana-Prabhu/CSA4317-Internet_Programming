-- ===============================================================
-- ShopEase - Integrated E-Commerce Product and Order Management System
-- MySQL Database Setup Script
-- Database: shopease_db
-- ===============================================================

CREATE DATABASE IF NOT EXISTS `shopease_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shopease_db`;

-- Drop tables in reverse order of foreign keys
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `customers`;

-- 1. Customers Table
CREATE TABLE `customers` (
  `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mobile` VARCHAR(15) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Products Table
CREATE TABLE `products` (
  `product_id` VARCHAR(20) PRIMARY KEY,
  `product_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Shopping Cart Table
CREATE TABLE `cart` (
  `cart_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `product_id` VARCHAR(20) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Orders Table
CREATE TABLE `orders` (
  `order_id` VARCHAR(30) PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `order_status` VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
  `delivery_address` TEXT NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Order Items Table
CREATE TABLE `order_items` (
  `item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(30) NOT NULL,
  `product_id` VARCHAR(20) NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============================================================
-- Sample Product Records (16 Products across 5 Categories)
-- ===============================================================

INSERT INTO `products` (`product_id`, `product_name`, `category`, `description`, `price`, `stock`, `image`) VALUES
-- Electronics
('PROD101', 'Wireless Noise Canceling Headphones', 'Electronics', 'High-fidelity acoustic stereo sound with active 32dB noise cancellation and 40-hour playtime.', 3499.00, 15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'),
('PROD102', 'Smart Fitness Tracker AMOLED', 'Electronics', '1.43-inch vibrant touch AMOLED display with continuous heart rate, SpO2 sensor, and 120 sports modes.', 2299.00, 22, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80'),
('PROD103', 'Ultra-Slim 20000mAh Power Bank', 'Electronics', 'Triple output 22.5W Power Delivery high-speed charging in an aircraft-grade aluminum alloy body.', 1499.00, 30, 'https://images.unsplash.com/photo-1609592426861-125026fd0025?w=600&auto=format&fit=crop&q=80'),
('PROD104', '4K Ultra HD Waterproof Action Camera', 'Electronics', 'Ultra-wide 170-degree lens with 6-axis gyro stabilization and 30m underwater waterproof housing.', 5999.00, 8, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'),

-- Fashion
('PROD105', 'Men\'s Tailored Oxford Cotton Shirt', 'Fashion', 'Breathable 100% combed cotton long-sleeve button-down shirt designed for all-day comfort and elegance.', 1299.00, 18, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'),
('PROD106', 'Women\'s Floral Georgette Anarkali', 'Fashion', 'Graceful flared floral embroidered georgette ethnic festive gown with matching chiffon dupatta.', 1899.00, 14, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'),
('PROD107', 'Unisex Polarized Aviator Sunglasses', 'Fashion', 'UV400 protective polarized lenses in an ultra-lightweight metallic alloy frame with silicone nose pads.', 999.00, 25, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'),
('PROD108', 'Classic Handcrafted Leather Dress Shoes', 'Fashion', 'Finest full-grain leather oxfords with cushioned orthopedic insoles and non-slip rubber outsoles.', 2799.00, 12, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80'),

-- Home Appliances
('PROD109', '1.8L Stainless Steel Electric Kettle', 'Home Appliances', 'Fast-heating 1500W cordless electric jug with auto shut-off and boil-dry protection technology.', 899.00, 35, 'https://images.unsplash.com/photo-1594213114663-dd95fb52cb8b?w=600&auto=format&fit=crop&q=80'),
('PROD110', 'Smart Digital Air Fryer 4.5L Touch', 'Home Appliances', 'Rapid 360-degree hot air circulation for 90% less oil crispy cooking with 8 one-touch presets.', 4499.00, 10, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80'),
('PROD111', 'Robotic Vacuum & Floor Mop 2-in-1', 'Home Appliances', 'Intelligent LiDAR gyroscope room mapping with 2800Pa suction power and automatic dock charging.', 8999.00, 6, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80'),

-- Accessories
('PROD112', 'Handmade Bi-Fold RFID Leather Wallet', 'Accessories', 'Authentic hunter leather with RFID blocking foil, 8 card compartments, and coin zipper pocket.', 799.00, 40, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80'),
('PROD113', 'Anti-Theft Water-Resistant Laptop Bag', 'Accessories', 'High-density Oxford fabric backpack featuring built-in USB charging port and padded 15.6-inch compartment.', 1699.00, 20, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'),
('PROD114', 'Rose-Gold Analog Quartz Wristwatch', 'Accessories', 'Luxury minimalist dial protected by scratch-proof sapphire crystal glass with stainless steel mesh strap.', 1999.00, 16, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80'),

-- Beauty and Personal Care
('PROD115', 'Organic Vitamin C Glow Face Serum', 'Beauty and Personal Care', 'Pure 20% ethyl ascorbic acid enriched with hyaluronic acid and ferulic acid for bright, spotless radiance.', 599.00, 50, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'),
('PROD116', 'Ceramic Tourmaline 2-in-1 Hair Styler', 'Beauty and Personal Care', 'Fast 30-second PTC heating plates with negative ion technology for frizz-free straight and curly hair.', 1799.00, 15, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80');

-- ===============================================================
-- Sample Customer Record (password: 'password123')
-- ===============================================================

INSERT INTO `customers` (`customer_id`, `customer_name`, `email`, `mobile`, `password`, `address`) VALUES
(1, 'Rahul Sharma', 'rahul.sharma@example.com', '9876543210', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', '402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001');

-- ===============================================================
-- Sample Order & Order Items Records
-- ===============================================================

INSERT INTO `orders` (`order_id`, `customer_id`, `order_date`, `total_amount`, `payment_method`, `order_status`, `delivery_address`) VALUES
('ORD-2026-1001', 1, '2026-11-20 14:30:00', 5798.00, 'UPI Demo Payment', 'Delivered', '402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001'),
('ORD-2026-1002', 1, '2026-11-21 09:15:00', 2299.00, 'Cash on Delivery', 'Confirmed', '402, Greenfield Heights, MG Road, Bengaluru, Karnataka - 560001');

INSERT INTO `order_items` (`item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 'ORD-2026-1001', 'PROD101', 1, 3499.00),
(2, 'ORD-2026-1001', 'PROD102', 1, 2299.00),
(3, 'ORD-2026-1002', 'PROD102', 1, 2299.00);
