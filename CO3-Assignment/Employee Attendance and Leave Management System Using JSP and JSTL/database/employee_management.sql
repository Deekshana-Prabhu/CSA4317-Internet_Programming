-- ================================================================
-- EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM
-- Database Creation & Sample Seed Data Script
-- Database: employee_management
-- ================================================================

CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

-- ----------------------------------------------------------------
-- 1. Table: Employees
-- ----------------------------------------------------------------
DROP TABLE IF EXISTS Leave_Applications;
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Admins;

CREATE TABLE Employees (
    employee_id VARCHAR(20) NOT NULL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- 2. Table: Admins
-- ----------------------------------------------------------------
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) DEFAULT 'System Administrator',
    email VARCHAR(100) DEFAULT 'admin@techcorp.com',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- 3. Table: Attendance
-- ----------------------------------------------------------------
CREATE TABLE Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    attendance_date DATE NOT NULL,
    check_in TIME NULL,
    check_out TIME NULL,
    status VARCHAR(20) NOT NULL, -- 'Present' or 'Absent'
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE,
    UNIQUE KEY unique_emp_date (employee_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------
-- 4. Table: Leave_Applications
-- ----------------------------------------------------------------
CREATE TABLE Leave_Applications (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    leave_type VARCHAR(50) NOT NULL, -- 'Casual Leave', 'Medical Leave', 'Earned Leave'
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    number_of_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- SAMPLE SEED DATA
-- ================================================================

-- Insert sample Employees
-- Test credentials: EMP101 / emp123
INSERT INTO Employees (employee_id, employee_name, email, department, username, password) VALUES
('EMP101', 'John Doe', 'john.doe@techcorp.com', 'Software Engineering', 'EMP101', 'emp123'),
('EMP102', 'Jane Smith', 'jane.smith@techcorp.com', 'Quality Assurance', 'EMP102', 'emp123'),
('EMP103', 'Robert Brown', 'robert.brown@techcorp.com', 'DevOps & Cloud', 'EMP103', 'emp123'),
('EMP104', 'Emily Davis', 'emily.davis@techcorp.com', 'UI/UX Design', 'EMP104', 'emp123'),
('EMP105', 'Michael Wilson', 'michael.wilson@techcorp.com', 'Product Management', 'EMP105', 'emp123');

-- Insert sample Admin
-- Test credentials: admin / admin123
INSERT INTO Admins (username, password, full_name, email) VALUES
('admin', 'admin123', 'System Administrator', 'admin@techcorp.com');

-- Insert sample Attendance Records for EMP101 (demonstrating Present and Absent)
INSERT INTO Attendance (employee_id, attendance_date, check_in, check_out, status) VALUES
('EMP101', '2026-11-03', '09:02:15', '17:35:40', 'Present'),
('EMP101', '2026-11-04', '08:55:10', '17:42:18', 'Present'),
('EMP101', '2026-11-05', '09:12:05', '18:05:00', 'Present'),
('EMP101', '2026-11-06', '09:05:30', '17:30:15', 'Present'),
('EMP101', '2026-11-07', NULL, NULL, 'Absent'),
('EMP101', '2026-11-10', '08:58:44', '17:31:20', 'Present'),
('EMP101', '2026-11-11', '09:01:10', '17:45:00', 'Present'),
('EMP101', '2026-11-12', '09:15:22', '18:10:05', 'Present'),
('EMP101', '2026-11-13', NULL, NULL, 'Absent'),
('EMP101', '2026-11-14', '08:50:35', '17:30:00', 'Present'),
('EMP101', '2026-11-17', '09:03:12', '17:38:25', 'Present'),
('EMP101', '2026-11-18', '09:00:00', '17:30:00', 'Present');

-- Attendance for EMP102
INSERT INTO Attendance (employee_id, attendance_date, check_in, check_out, status) VALUES
('EMP102', '2026-11-14', '09:05:00', '17:35:00', 'Present'),
('EMP102', '2026-11-17', '08:55:00', '17:40:00', 'Present'),
('EMP102', '2026-11-18', '09:10:00', '17:30:00', 'Present');

-- Attendance for EMP103
INSERT INTO Attendance (employee_id, attendance_date, check_in, check_out, status) VALUES
('EMP103', '2026-11-14', '09:15:00', '17:50:00', 'Present'),
('EMP103', '2026-11-17', NULL, NULL, 'Absent'),
('EMP103', '2026-11-18', '09:00:00', '17:30:00', 'Present');

-- Attendance for EMP104
INSERT INTO Attendance (employee_id, attendance_date, check_in, check_out, status) VALUES
('EMP104', '2026-11-17', '08:45:00', '17:15:00', 'Present'),
('EMP104', '2026-11-18', '08:50:00', '17:25:00', 'Present');

-- Attendance for EMP105
INSERT INTO Attendance (employee_id, attendance_date, check_in, check_out, status) VALUES
('EMP105', '2026-11-17', '09:20:00', '18:00:00', 'Present'),
('EMP105', '2026-11-18', '09:05:00', '17:45:00', 'Present');

-- Insert sample Leave Applications
-- EMP101 has Pending, Approved, and Rejected to verify all status labels
INSERT INTO Leave_Applications (employee_id, leave_type, from_date, to_date, number_of_days, reason, status, applied_at) VALUES
('EMP101', 'Casual Leave', '2026-11-24', '2026-11-25', 2, 'Attending family wedding ceremony.', 'Pending', '2026-11-18 10:15:00'),
('EMP101', 'Medical Leave', '2026-11-07', '2026-11-07', 1, 'Doctor appointment and fever rest.', 'Approved', '2026-11-05 14:20:00'),
('EMP101', 'Earned Leave', '2026-10-15', '2026-10-17', 3, 'Personal vacation with family.', 'Rejected', '2026-10-10 09:30:00'),

-- EMP102 pending leave
('EMP102', 'Medical Leave', '2026-11-26', '2026-11-28', 3, 'Scheduled dental surgery and recovery.', 'Pending', '2026-11-17 11:45:00'),

-- EMP103 approved leave
('EMP103', 'Earned Leave', '2026-12-01', '2026-12-05', 5, 'Year-end personal travel.', 'Approved', '2026-11-16 16:00:00'),

-- EMP104 pending leave
('EMP104', 'Casual Leave', '2026-11-22', '2026-11-22', 1, 'Personal bank and administrative work.', 'Pending', '2026-11-18 09:10:00');
