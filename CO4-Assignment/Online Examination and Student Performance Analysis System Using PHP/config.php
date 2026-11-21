<?php
/**
 * Online Examination and Student Performance Analysis System
 * Database Configuration File
 * 
 * Technology: PHP 8 & MySQL (MySQLi Extension)
 * Default XAMPP credentials used for plug-and-play local execution.
 */

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'online_examination');
define('DB_PORT', 3306);

// Prevent direct script execution output if required
mysqli_report(MYSQLI_REPORT_OFF);

// Attempt database connection
$conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection status
$db_connected = true;
$db_error_message = '';

if ($conn->connect_error) {
    $db_connected = false;
    $db_error_message = $conn->connect_error;
} else {
    // Set character set to utf8mb4 for unicode compatibility
    $conn->set_charset("utf8mb4");
}

/**
 * Helper function to safely escape output strings (prevents XSS)
 */
function sanitize_output($data) {
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

/**
 * Helper function to check if student is logged in via PHP session
 */
function is_student_authenticated() {
    return isset($_SESSION['student_id']) && !empty($_SESSION['student_id']);
}
?>