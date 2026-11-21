-- ========================================================
-- Online Student Admission and Registration Management System
-- Database Setup and Seed Data
-- Database Name: student_admission
-- Compatible with MySQL / MariaDB (XAMPP / WAMP)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `student_admission` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `student_admission`;

-- --------------------------------------------------------
-- Table structure for table `students`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Sample Seed Data for Demonstrating Portal Features
-- --------------------------------------------------------

INSERT INTO `students` (`student_id`, `student_name`, `dob`, `email`, `mobile`, `address`, `hsc_marks`, `department`, `registration_date`) VALUES
('ADM20260001', 'Aarav Sharma', '2006-04-12', 'aarav.sharma@example.com', '9876543210', 'Flat 402, Skyline Residency, Park Street, Pune, Maharashtra', 578, 'Computer Science and Engineering', '2026-11-15 09:30:00'),
('ADM20260002', 'Priya Patel', '2006-08-23', 'priya.patel@example.com', '9823456789', '12B, Green Avenue, Satellite Road, Ahmedabad, Gujarat', 562, 'Artificial Intelligence and Machine Learning', '2026-11-16 11:15:00'),
('ADM20260003', 'Rohan Verma', '2005-12-05', 'rohan.verma@example.com', '9712345678', 'Plot 55, Sector 14, Hiranandani Estate, Thane, Maharashtra', 545, 'Artificial Intelligence and Data Science', '2026-11-17 14:05:00'),
('ADM20260004', 'Ananya Iyer', '2006-02-18', 'ananya.iyer@example.com', '9845123456', '78/4, Rajaji Nagar, 2nd Stage, Bengaluru, Karnataka', 585, 'Computer Science and Engineering', '2026-11-18 10:20:00'),
('ADM20260005', 'Siddharth Nair', '2005-10-30', 'siddharth.nair@example.com', '9967812345', 'B-301, Palm Meadows, Kowdiar, Thiruvananthapuram, Kerala', 510, 'Electronics and Communication Engineering', '2026-11-18 16:40:00'),
('ADM20260006', 'Sneha Kulkarni', '2006-07-14', 'sneha.kulkarni@example.com', '9890123456', '23, Shivaji Housing Society, Senapati Bapat Road, Pune', 530, 'Information Technology', '2026-11-19 12:10:00'),
('ADM20260007', 'Karthik Sundaram', '2006-01-25', 'karthik.s@example.com', '9789012345', '45, Anna Nagar West Extension, Chennai, Tamil Nadu', 495, 'Mechanical Engineering', '2026-11-19 15:55:00'),
('ADM20260008', 'Meera Deshmukh', '2006-05-09', 'meera.d@example.com', '9833445566', '89, Tilak Road, Near SP College, Pune, Maharashtra', 550, 'Artificial Intelligence and Machine Learning', '2026-11-20 08:45:00'),
('ADM20260009', 'Aditya Joshi', '2005-11-19', 'aditya.joshi@example.com', '9765432109', '14, Ganga Heights, Kothrud, Pune, Maharashtra', 480, 'Civil Engineering', '2026-11-20 10:00:00'),
('ADM20260010', 'Tanvi Reddy', '2006-03-03', 'tanvi.reddy@example.com', '9949123456', 'Villa 22, Jubilee Hills Road No 10, Hyderabad, Telangana', 525, 'Electrical and Electronics Engineering', '2026-11-20 11:30:00');
