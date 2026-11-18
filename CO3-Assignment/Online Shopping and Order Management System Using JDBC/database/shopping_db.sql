-- =======================================================
-- Database: shopping_db
-- Project: Online Shopping and Order Management System Using JDBC
-- Application Name: SHOPZONE
-- =======================================================

DROP DATABASE IF EXISTS shopping_db;
CREATE DATABASE shopping_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopping_db;

-- -------------------------------------------------------
-- 1. Table structure for table `customers`
-- -------------------------------------------------------
CREATE TABLE customers (
    customer_id VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 2. Table structure for table `products`
-- -------------------------------------------------------
CREATE TABLE products (
    product_id VARCHAR(20) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 3. Table structure for table `orders`
-- -------------------------------------------------------
CREATE TABLE orders (
    order_id VARCHAR(30) NOT NULL,
    customer_id VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(30) DEFAULT 'Confirmed',
    PRIMARY KEY (order_id),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) 
        REFERENCES customers (customer_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- 4. Table structure for table `order_items`
-- -------------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT NOT NULL,
    order_id VARCHAR(30) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) 
        REFERENCES orders (order_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) 
        REFERENCES products (product_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- Sample Data Insertion
-- =======================================================

-- 1. Insert Initial Sample Customers
INSERT INTO customers (customer_id, customer_name, email, mobile, password, address) VALUES
('CUST1001', 'Rahul Sharma', 'rahul@example.com', '9876543210', 'password123', 'Flat 402, Sunshine Heights, MG Road, Bengaluru, Karnataka - 560001'),
('CUST1002', 'Priya Patel', 'priya@example.com', '9812345678', 'priya123', '12, Shanti Kunj, Near Civil Lines, Jaipur, Rajasthan - 302006'),
('CUST1003', 'Aman Verma', 'aman@example.com', '9988776655', 'aman123', 'House No. 78, Sector 15, Chandigarh - 160015');

-- 2. Insert Required Products across all 5 Categories:
-- Categories: Electronics, Fashion, Home Appliances, Books, Accessories
INSERT INTO products (product_id, product_name, category, description, price, stock, image) VALUES
('P101', 'Wireless Headphones', 'Electronics', 'High-fidelity audio with active noise cancellation, deep bass, and up to 30-hour battery life.', 1500.00, 25, 'images/products/headphones.svg'),
('P102', 'Smart Watch', 'Electronics', 'Vibrant AMOLED touch display with real-time heart rate sensor, fitness tracker, and water resistance.', 2500.00, 18, 'images/products/smartwatch.svg'),
('P103', 'Laptop', 'Electronics', 'High performance 15.6-inch FHD display laptop powered by Intel Core i5 with 16GB RAM and 512GB SSD.', 45000.00, 10, 'images/products/laptop.svg'),
('P104', 'Backpack', 'Accessories', 'Durable, water-resistant travel & urban laptop backpack with multi-layer compartments and USB charging port.', 999.00, 35, 'images/products/backpack.svg'),
('P105', 'Bluetooth Speaker', 'Electronics', 'Portable 360-degree wireless speaker with dual bass radiators, IPX7 waterproof rating, and 12-hour playtime.', 1200.00, 20, 'images/products/speaker.svg'),
('P106', 'Running Shoes', 'Fashion', 'Ultra-lightweight breathable athletic shoes with responsive air-cushioned soles for maximum comfort.', 1800.00, 30, 'images/products/shoes.svg'),
('P107', 'Smartphone', 'Electronics', '6.5-inch Super AMOLED 120Hz display, 5G enabled, 50MP triple camera system, and 5000mAh battery.', 15000.00, 15, 'images/products/smartphone.svg'),
('P108', 'Keyboard', 'Electronics', 'Ergonomic mechanical gaming keyboard with responsive tactile switches and customizable dynamic RGB lighting.', 850.00, 40, 'images/products/keyboard.svg'),
('P109', 'Microwave Oven', 'Home Appliances', 'Multi-stage convection microwave oven with auto-cook recipes, grill mode, and child safety lock.', 6499.00, 12, 'images/products/microwave.svg'),
('P110', 'Coffee Maker', 'Home Appliances', 'Automatic programmable drip coffee maker with high-durability thermal carafe and keep-warm plate.', 3200.00, 14, 'images/products/coffeemaker.svg'),
('P111', 'Java Programming Guide', 'Books', 'Complete reference and definitive guide to Java, Object-Oriented Architecture, Servlets, and JDBC.', 750.00, 50, 'images/products/book_java.svg'),
('P112', 'Clean Code Handbook', 'Books', 'Renowned software engineering manual focused on agile craftsmanship, refactoring, and code readability.', 1100.00, 35, 'images/products/book_code.svg'),
('P113', 'Leather Wallet', 'Accessories', 'Handcrafted genuine top-grain leather bi-fold wallet featuring RFID protection and sleek slim profile.', 1299.00, 45, 'images/products/wallet.svg'),
('P114', 'Cotton Casual Shirt', 'Fashion', 'Premium 100% breathable organic cotton slim-fit button-down casual shirt for all-season styling.', 1250.00, 28, 'images/products/shirt.svg');

-- 3. Insert Sample Orders for Demo History
INSERT INTO orders (order_id, customer_id, total_amount, payment_method, order_date, order_status) VALUES
('ORD-10001', 'CUST1001', 4000.00, 'UPI', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Delivered'),
('ORD-10002', 'CUST1001', 999.00, 'Cash on Delivery', DATE_SUB(NOW(), INTERVAL 2 DAY), 'Shipped'),
('ORD-10003', 'CUST1002', 15850.00, 'Card', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Confirmed');

-- 4. Insert Sample Order Items for the Demo Orders
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('ORD-10001', 'P101', 1, 1500.00),
('ORD-10001', 'P102', 1, 2500.00),
('ORD-10002', 'P104', 1, 999.00),
('ORD-10003', 'P107', 1, 15000.00),
('ORD-10003', 'P108', 1, 850.00);

-- Verify records
SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS total_customers FROM customers;
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS total_orders FROM orders;
