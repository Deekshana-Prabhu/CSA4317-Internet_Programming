<?php
/**
 * ShopEase - Integrated E-Commerce Product and Order Management System
 * Database Configuration & Global Settings
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'shopease_db');

$pdo = null;
$db_connected = false;
$db_error = null;

try {
    // Attempt PDO Connection to MySQL
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    $db_connected = true;
} catch (PDOException $e) {
    // Graceful fallback for environments without active MySQL / XAMPP
    $db_connected = false;
    $db_error = $e->getMessage();
}

// Helper: Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['customer_id']) && !empty($_SESSION['customer_id']);
}

// Helper: Get logged in customer info
function getCurrentCustomer() {
    return $_SESSION['customer'] ?? null;
}

// Set application constants
define('APP_NAME', 'ShopEase');
define('APP_TAGLINE', 'Discover. Shop. Enjoy.');
define('CURRENCY_SYMBOL', '₹');
define('REPORTS_DIR', __DIR__ . '/orders/');

// Ensure orders directory exists for PHP file operations
if (!file_exists(REPORTS_DIR)) {
    @mkdir(REPORTS_DIR, 0777, true);
}
?>
