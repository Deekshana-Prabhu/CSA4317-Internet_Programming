-- =====================================================================
-- Online Examination and Student Performance Analysis System
-- Database Schema and Sample Data
-- Database Name: online_examination
-- Technology: MySQL / MariaDB (PHP 8 + MySQLi compatible)
-- =====================================================================

-- Step 1: Create Database if not exists
CREATE DATABASE IF NOT EXISTS `online_examination` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `online_examination`;

-- Step 2: Drop existing tables if re-importing (ordered by foreign key constraints)
DROP TABLE IF EXISTS `answers`;
DROP TABLE IF EXISTS `examinations`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `students`;

-- =====================================================================
-- Table 1: students
-- Stores registered student credentials and profile info
-- =====================================================================
CREATE TABLE `students` (
    `student_id` VARCHAR(20) NOT NULL,
    `student_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Table 2: questions
-- Stores multiple-choice question bank across multiple core subjects
-- =====================================================================
CREATE TABLE `questions` (
    `question_id` INT AUTO_INCREMENT NOT NULL,
    `subject` VARCHAR(60) NOT NULL,
    `question` TEXT NOT NULL,
    `option_a` VARCHAR(255) NOT NULL,
    `option_b` VARCHAR(255) NOT NULL,
    `option_c` VARCHAR(255) NOT NULL,
    `option_d` VARCHAR(255) NOT NULL,
    `correct_answer` CHAR(1) NOT NULL,
    PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Table 3: examinations
-- Stores student examination session results, marks, percentage, and grade
-- =====================================================================
CREATE TABLE `examinations` (
    `examination_id` VARCHAR(50) NOT NULL,
    `student_id` VARCHAR(20) NOT NULL,
    `subject` VARCHAR(60) NOT NULL,
    `total_questions` INT NOT NULL DEFAULT 15,
    `correct_answers` INT NOT NULL DEFAULT 0,
    `incorrect_answers` INT NOT NULL DEFAULT 0,
    `unanswered_questions` INT NOT NULL DEFAULT 0,
    `total_marks` INT NOT NULL DEFAULT 0,
    `percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `grade` VARCHAR(5) NOT NULL,
    `result_status` VARCHAR(10) NOT NULL,
    `examination_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`examination_id`),
    CONSTRAINT `fk_exam_student` 
        FOREIGN KEY (`student_id`) 
        REFERENCES `students` (`student_id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Table 4: answers
-- Stores individual question responses for each examination attempt
-- =====================================================================
CREATE TABLE `answers` (
    `answer_id` INT AUTO_INCREMENT NOT NULL,
    `examination_id` VARCHAR(50) NOT NULL,
    `question_id` INT NOT NULL,
    `selected_answer` CHAR(1) NULL,
    `is_correct` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`answer_id`),
    CONSTRAINT `fk_ans_exam` 
        FOREIGN KEY (`examination_id`) 
        REFERENCES `examinations` (`examination_id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT `fk_ans_question` 
        FOREIGN KEY (`question_id`) 
        REFERENCES `questions` (`question_id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- Insert Sample Students
-- All passwords are hashed using PHP password_hash() for 'demo123'
-- Hash: $2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm
-- =====================================================================
INSERT INTO `students` (`student_id`, `student_name`, `email`, `password`) VALUES
('STU2024001', 'John Doe', 'john.doe@example.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm'),
('STU2024002', 'Jane Smith', 'jane.smith@example.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm'),
('STU2024003', 'Alex Johnson', 'alex.j@example.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm');

-- =====================================================================
-- Insert Questions (18 Multiple Choice Questions across 6 Domains)
-- Covering: PHP Fundamentals, HTML, CSS, JavaScript, MySQL, Basic Programming
-- =====================================================================
INSERT INTO `questions` (`question_id`, `subject`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`) VALUES
-- 1. PHP Fundamentals
(1, 'PHP Fundamentals', 'Which superglobal array in PHP is used to collect form data sent with method="post"?', '$_GET', '$_POST', '$_REQUEST', '$_SERVER', 'B'),
(2, 'PHP Fundamentals', 'How are variables declared in PHP?', 'var $name;', '$name = value;', 'dim $name;', 'variable name;', 'B'),
(3, 'PHP Fundamentals', 'Which PHP function is specifically used to open a file for read/write operations?', 'file_open()', 'fopen()', 'open_file()', 'load_file()', 'B'),

-- 2. HTML
(4, 'HTML', 'Which HTML5 semantic element represents a container for introductory content or navigation links?', '<navheader>', '<top>', '<header>', '<intro>', 'C'),
(5, 'HTML', 'Which attribute specifies that an input field in an HTML form must be completed before submission?', 'validate', 'mandatory', 'required', 'important', 'C'),
(6, 'HTML', 'Which HTML tag is used to create an unordered (bulleted) list?', '<ol>', '<ul>', '<li>', '<list>', 'B'),

-- 3. CSS
(7, 'CSS', 'Which CSS property defines the font size of an element?', 'font-style', 'text-size', 'font-size', 'typeface-size', 'C'),
(8, 'CSS', 'In the CSS Flexible Box layout, which property defines the main axis direction of flex items?', 'flex-flow', 'flex-direction', 'align-items', 'justify-content', 'B'),
(9, 'CSS', 'Which CSS property creates spacing outside an element boundary, pushing adjacent elements away?', 'padding', 'margin', 'border-spacing', 'outline-offset', 'B'),

-- 4. JavaScript
(10, 'JavaScript', 'Which keyword declares a block-scoped variable whose value cannot be reassigned?', 'var', 'let', 'const', 'immutable', 'C'),
(11, 'JavaScript', 'What is the return value of evaluating `typeof null` in standard JavaScript?', '\"null\"', '\"undefined\"', '\"object\"', '\"boolean\"', 'C'),
(12, 'JavaScript', 'Which modern DOM method attaches an event handler function to a specified element?', 'element.attach()', 'element.addEventListener()', 'element.listen()', 'element.on()', 'B'),

-- 5. MySQL
(13, 'MySQL', 'Which SQL clause is used to filter records and return only those matching a specific condition?', 'ORDER BY', 'GROUP BY', 'WHERE', 'HAVING', 'C'),
(14, 'MySQL', 'Which SQL statement clause arranges the retrieved result set in ascending or descending order?', 'SORT BY', 'ORDER BY', 'ALIGN BY', 'FILTER BY', 'B'),
(15, 'MySQL', 'In relational databases, what links a foreign key column to the primary key of another table?', 'Referential Integrity', 'Cyclic Index', 'Data Redundancy', 'Binary Linkage', 'A'),

-- 6. Basic Programming Concepts
(16, 'Basic Programming Concepts', 'What is the worst-case time complexity of binary search on a pre-sorted array of size n?', 'O(n)', 'O(1)', 'O(log n)', 'O(n^2)', 'C'),
(17, 'Basic Programming Concepts', 'Which Object-Oriented Programming pillar bundles data and related methods inside a class to prevent direct access?', 'Polymorphism', 'Inheritance', 'Encapsulation', 'Abstraction', 'C'),
(18, 'Basic Programming Concepts', 'Which data structure strictly operates under the Last-In, First-Out (LIFO) protocol?', 'Queue', 'Stack', 'Linked List', 'Binary Tree', 'B');

-- =====================================================================
-- Insert Sample Examination History & Results (for STU2024001)
-- Allows immediate preview of analytics, charts, and history upon import
-- =====================================================================
INSERT INTO `examinations` (`examination_id`, `student_id`, `subject`, `total_questions`, `correct_answers`, `incorrect_answers`, `unanswered_questions`, `total_marks`, `percentage`, `grade`, `result_status`, `examination_date`) VALUES
('EXAM-20241115-001', 'STU2024001', 'Full Stack Development', 15, 14, 1, 0, 14, 93.33, 'A+', 'Pass', '2024-11-15 10:30:00'),
('EXAM-20241118-002', 'STU2024001', 'PHP Fundamentals', 15, 12, 2, 1, 12, 80.00, 'A', 'Pass', '2024-11-18 14:15:00'),
('EXAM-20241119-003', 'STU2024001', 'MySQL & Databases', 15, 11, 3, 1, 11, 73.33, 'B', 'Pass', '2024-11-19 16:45:00');

-- Insert Sample Answers for EXAM-20241115-001
INSERT INTO `answers` (`examination_id`, `question_id`, `selected_answer`, `is_correct`) VALUES
('EXAM-20241115-001', 1, 'B', 1),
('EXAM-20241115-001', 2, 'B', 1),
('EXAM-20241115-001', 3, 'B', 1),
('EXAM-20241115-001', 4, 'C', 1),
('EXAM-20241115-001', 5, 'C', 1),
('EXAM-20241115-001', 6, 'B', 1),
('EXAM-20241115-001', 7, 'C', 1),
('EXAM-20241115-001', 8, 'B', 1),
('EXAM-20241115-001', 9, 'B', 1),
('EXAM-20241115-001', 10, 'C', 1),
('EXAM-20241115-001', 11, 'C', 1),
('EXAM-20241115-001', 12, 'B', 1),
('EXAM-20241115-001', 13, 'C', 1),
('EXAM-20241115-001', 14, 'A', 0),
('EXAM-20241115-001', 15, 'A', 1);
