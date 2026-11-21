<?php
/**
 * Database Configuration File
 * Online Student Admission and Registration Management System
 * Compatible with PHP 8 and MySQL / MariaDB (XAMPP / WAMP)
 */

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'student_admission');
define('DB_PORT', 3306);

// Establish MySQLi Connection
$conn = null;
$db_error = null;

try {
    // Attempt connecting to MySQL server
    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, '', DB_PORT);

    if ($conn->connect_error) {
        $db_error = "MySQL Server Connection Failed: " . $conn->connect_error . ". Please make sure MySQL is running in XAMPP/WAMP.";
    } else {
        // Set charset to utf8mb4
        $conn->set_charset("utf8mb4");

        // Automatically create the database if it doesn't exist
        $create_db_sql = "CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        if ($conn->query($create_db_sql)) {
            // Select the database
            $conn->select_db(DB_NAME);

            // Automatically create the students table if it doesn't exist
            $create_table_sql = "CREATE TABLE IF NOT EXISTS `students` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `student_id` VARCHAR(20) NOT NULL UNIQUE,
                `student_name` VARCHAR(100) NOT NULL,
                `dob` DATE NOT NULL,
                `email` VARCHAR(100) NOT NULL UNIQUE,
                `mobile` VARCHAR(15) NOT NULL,
                `address` TEXT NOT NULL,
                `hsc_marks` INT NOT NULL,
                `department` VARCHAR(100) NOT NULL,
                `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (`student_id`),
                INDEX (`email`),
                INDEX (`department`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            
            $conn->query($create_table_sql);
        } else {
            $db_error = "Could not initialize database: " . $conn->error;
        }
    }
} catch (Exception $e) {
    $db_error = "Database Error: " . $e->getMessage();
}

/**
 * Helper function to safely escape strings for output
 */
function clean_output($data) {
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

/**
 * Standard Department List for Engineering Admission
 */
$DEPARTMENTS = [
    "Computer Science and Engineering",
    "Artificial Intelligence and Machine Learning",
    "Artificial Intelligence and Data Science",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering"
];
