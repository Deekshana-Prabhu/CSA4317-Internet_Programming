-- ====================================================================
-- DATABASE SETUP SCRIPT FOR HOSPITAL APPOINTMENT AND PATIENT MANAGEMENT
-- Database Name: hospital_db
-- ====================================================================

CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

-- Drop tables in reverse foreign key order if re-running
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Doctor_Schedules;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Admins;

-- 1. Patients Table
CREATE TABLE Patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Doctors Table
CREATE TABLE Doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    available_days VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Doctor Schedules Table
CREATE TABLE Doctor_Schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    available_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    availability_status VARCHAR(30) NOT NULL DEFAULT 'Available',
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE,
    UNIQUE KEY uk_schedule (doctor_id, available_date, time_slot)
) ENGINE=InnoDB;

-- 4. Appointments Table
CREATE TABLE Appointments (
    appointment_id VARCHAR(50) PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    reason TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Confirmed',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE,
    -- Prevent duplicate booking for same doctor at same date and time
    UNIQUE KEY uk_doc_date_time (doctor_id, appointment_date, appointment_time)
) ENGINE=InnoDB;

-- 5. Admins Table
CREATE TABLE Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) DEFAULT 'Hospital Administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ====================================================================
-- SAMPLE DATA INSERTION
-- ====================================================================

-- Insert Hospital Administrators
INSERT INTO Admins (username, password, full_name) VALUES
('admin', 'admin123', 'Chief Medical Officer'),
('superadmin', 'admin@2026', 'Operations Director');

-- Insert Multi-Speciality Doctors
INSERT INTO Doctors (doctor_id, name, specialization, qualification, experience, fee, available_days) VALUES
(1, 'Dr. Rajesh Sharma', 'Cardiology', 'MBBS, MD, DM (Cardiology)', '15 Years', 900.00, 'Monday - Saturday'),
(2, 'Dr. Sneha Rao', 'Dermatology', 'MBBS, MD (Dermatology, Venereology & Leprosy)', '9 Years', 650.00, 'Monday - Friday'),
(3, 'Dr. Arvind Patel', 'Neurology', 'MBBS, MD (Med), DM (Neurology)', '18 Years', 1200.00, 'Tuesday - Saturday'),
(4, 'Dr. Vikram Malhotra', 'Orthopaedics', 'MBBS, MS (Orthopaedics), M.Ch', '14 Years', 800.00, 'Monday - Friday'),
(5, 'Dr. Priya Menon', 'Paediatrics', 'MBBS, MD (Paediatrics), DCH', '11 Years', 700.00, 'Monday - Saturday'),
(6, 'Dr. Amitava Sen', 'General Medicine', 'MBBS, MD (Internal Medicine)', '16 Years', 500.00, 'All Days (Mon - Sun)');

-- Insert Sample Patients
INSERT INTO Patients (patient_id, name, age, gender, email, mobile, address, password) VALUES
(1, 'Rajesh Kumar', 34, 'Male', 'rajesh.kumar@example.com', '9876543210', '42 Gandhi Road, T. Nagar, Chennai', 'patient123'),
(2, 'Ananya Sharma', 29, 'Female', 'ananya.sharma@example.com', '9876543211', '12 Lake View Street, Indiranagar, Bangalore', 'patient123'),
(3, 'Suresh Reddy', 48, 'Male', 'suresh.reddy@example.com', '9876543212', '78 Jubilee Hills, Road No. 36, Hyderabad', 'patient123');

-- Insert Doctor Schedules for current/upcoming dates
INSERT INTO Doctor_Schedules (doctor_id, available_date, time_slot, availability_status) VALUES
(1, '2026-11-20', '09:00 AM - 09:30 AM', 'Booked'),
(1, '2026-11-20', '09:30 AM - 10:00 AM', 'Available'),
(1, '2026-11-20', '10:00 AM - 10:30 AM', 'Available'),
(1, '2026-11-20', '11:00 AM - 11:30 AM', 'Available'),
(1, '2026-11-21', '09:00 AM - 09:30 AM', 'Available'),
(1, '2026-11-21', '09:30 AM - 10:00 AM', 'Available'),
(2, '2026-11-20', '10:00 AM - 10:30 AM', 'Available'),
(2, '2026-11-20', '10:30 AM - 11:00 AM', 'Booked'),
(2, '2026-11-20', '11:00 AM - 11:30 AM', 'Available'),
(2, '2026-11-21', '10:00 AM - 10:30 AM', 'Available'),
(3, '2026-11-20', '02:00 PM - 02:30 PM', 'Available'),
(3, '2026-11-20', '02:30 PM - 03:00 PM', 'Available'),
(3, '2026-11-21', '02:00 PM - 02:30 PM', 'Booked'),
(4, '2026-11-20', '11:00 AM - 11:30 AM', 'Available'),
(4, '2026-11-20', '11:30 AM - 12:00 PM', 'Available'),
(5, '2026-11-20', '04:00 PM - 04:30 PM', 'Available'),
(5, '2026-11-20', '04:30 PM - 05:00 PM', 'Available'),
(6, '2026-11-20', '09:00 AM - 09:30 AM', 'Available'),
(6, '2026-11-20', '09:30 AM - 10:00 AM', 'Available');

-- Insert Initial Sample Appointments
INSERT INTO Appointments (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
('APT-2026-1001', 1, 1, '2026-11-20', '09:00 AM - 09:30 AM', 'Routine cardiac health checkup and hypertension review', 'Confirmed'),
('APT-2026-1002', 2, 2, '2026-11-20', '10:30 AM - 11:00 AM', 'Skin allergy consultation and rash assessment', 'Confirmed'),
('APT-2026-1003', 3, 3, '2026-11-21', '02:00 PM - 02:30 PM', 'Frequent migraine and tension headache evaluation', 'Confirmed'),
('APT-2026-0901', 1, 6, '2026-11-10', '09:00 AM - 09:30 AM', 'General seasonal fever and weakness', 'Completed');
