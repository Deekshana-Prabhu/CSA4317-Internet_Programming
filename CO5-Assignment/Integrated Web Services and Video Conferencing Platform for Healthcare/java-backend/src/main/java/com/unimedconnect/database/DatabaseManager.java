package com.unimedconnect.database;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * DatabaseManager handles SQLite JDBC connections and automatic schema initialization.
 * Zero-configuration out of the box for educational/demonstration use.
 */
public class DatabaseManager {

    private static final String DB_URL = "jdbc:sqlite:unimedconnect.db";

    static {
        try {
            // Load SQLite JDBC Driver
            Class.forName("org.xerial.sqlite.JDBC");
            initDatabase();
        } catch (ClassNotFoundException e) {
            System.err.println("[DatabaseManager] SQLite JDBC Driver not found: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("[DatabaseManager] Database initialization warning: " + e.getMessage());
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    private static void initDatabase() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            // Initialize tables
            stmt.execute("CREATE TABLE IF NOT EXISTS students (" +
                    "student_id VARCHAR(20) PRIMARY KEY, " +
                    "name VARCHAR(100) NOT NULL, " +
                    "department VARCHAR(100) NOT NULL, " +
                    "year_of_study INT NOT NULL, " +
                    "email VARCHAR(100) UNIQUE NOT NULL, " +
                    "attendance_rate DECIMAL(5,2) DEFAULT 0.0, " +
                    "cgpa DECIMAL(3,2) DEFAULT 0.0, " +
                    "enrolled_courses_count INT DEFAULT 0)");

            stmt.execute("CREATE TABLE IF NOT EXISTS courses (" +
                    "course_code VARCHAR(20) PRIMARY KEY, " +
                    "course_name VARCHAR(150) NOT NULL, " +
                    "department VARCHAR(100) NOT NULL, " +
                    "credits INT NOT NULL, " +
                    "instructor_name VARCHAR(100) NOT NULL, " +
                    "schedule VARCHAR(100) NOT NULL)");

            stmt.execute("CREATE TABLE IF NOT EXISTS attendance (" +
                    "record_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "student_id VARCHAR(20) NOT NULL, " +
                    "course_code VARCHAR(20) NOT NULL, " +
                    "date DATE NOT NULL, " +
                    "status VARCHAR(20) NOT NULL)");

            stmt.execute("CREATE TABLE IF NOT EXISTS results (" +
                    "result_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "student_id VARCHAR(20) NOT NULL, " +
                    "course_code VARCHAR(20) NOT NULL, " +
                    "semester VARCHAR(20) NOT NULL, " +
                    "grade VARCHAR(5) NOT NULL, " +
                    "marks_obtained DECIMAL(5,2) NOT NULL, " +
                    "max_marks DECIMAL(5,2) DEFAULT 100.0)");

            stmt.execute("CREATE TABLE IF NOT EXISTS doctors (" +
                    "doctor_id VARCHAR(20) PRIMARY KEY, " +
                    "name VARCHAR(100) NOT NULL, " +
                    "specialization VARCHAR(100) NOT NULL, " +
                    "department VARCHAR(100) NOT NULL, " +
                    "email VARCHAR(100) NOT NULL, " +
                    "consultation_fee DECIMAL(10,2) NOT NULL, " +
                    "availability_status VARCHAR(50) NOT NULL, " +
                    "rating DECIMAL(3,2) DEFAULT 4.8)");

            stmt.execute("CREATE TABLE IF NOT EXISTS patients (" +
                    "patient_id VARCHAR(20) PRIMARY KEY, " +
                    "name VARCHAR(100) NOT NULL, " +
                    "age INT NOT NULL, " +
                    "gender VARCHAR(10) NOT NULL, " +
                    "department VARCHAR(100) NOT NULL, " +
                    "assigned_doctor_id VARCHAR(20), " +
                    "contact_phone VARCHAR(20), " +
                    "medical_condition VARCHAR(200), " +
                    "consultation_status VARCHAR(50) DEFAULT 'ACTIVE', " +
                    "last_visit_date DATE)");

            stmt.execute("CREATE TABLE IF NOT EXISTS appointments (" +
                    "appointment_id VARCHAR(30) PRIMARY KEY, " +
                    "patient_id VARCHAR(20) NOT NULL, " +
                    "doctor_id VARCHAR(20) NOT NULL, " +
                    "appointment_date DATE NOT NULL, " +
                    "time_slot VARCHAR(30) NOT NULL, " +
                    "reason_for_visit TEXT, " +
                    "status VARCHAR(30) DEFAULT 'SCHEDULED')");

            stmt.execute("CREATE TABLE IF NOT EXISTS video_sessions (" +
                    "session_id VARCHAR(50) PRIMARY KEY, " +
                    "title VARCHAR(150) NOT NULL, " +
                    "type VARCHAR(30) NOT NULL, " +
                    "host_id VARCHAR(30) NOT NULL, " +
                    "host_name VARCHAR(100) NOT NULL, " +
                    "participant_count INT DEFAULT 1, " +
                    "status VARCHAR(20) DEFAULT 'ACTIVE')");

            // Seed default students if empty
            stmt.execute("INSERT OR IGNORE INTO students VALUES " +
                    "('STU1001', 'Sarah Chen', 'Computer Science', 3, 'sarah.chen@university.edu', 94.50, 3.88, 5)," +
                    "('STU1002', 'Liam O''Connor', 'Health Informatics', 2, 'liam.oc@university.edu', 88.20, 3.65, 4)," +
                    "('STU1003', 'Amina Yusuf', 'Biomedical Engineering', 4, 'amina.yusuf@university.edu', 96.00, 3.92, 6)");

            // Seed default doctors if empty
            stmt.execute("INSERT OR IGNORE INTO doctors VALUES " +
                    "('DOC3001', 'Dr. Elena Rostova', 'Cardiovascular Medicine & Telehealth', 'Cardiology', 'e.rostova@hospital.unimed.org', 75.00, 'AVAILABLE', 4.95)," +
                    "('DOC3002', 'Dr. Jonathan Vance', 'Clinical Neurology', 'Neurology', 'j.vance@hospital.unimed.org', 90.00, 'AVAILABLE', 4.88)");

            // Seed default patients if empty
            stmt.execute("INSERT OR IGNORE INTO patients VALUES " +
                    "('PAT4001', 'James Wilson', 48, 'Male', 'Cardiology', 'DOC3001', '+1 (555) 234-8901', 'Stage 1 Hypertension & Arrhythmia Monitoring', 'ACTIVE', '2026-11-10')," +
                    "('PAT4002', 'Eleanor Vance', 62, 'Female', 'Neurology', 'DOC3002', '+1 (555) 876-1122', 'Mild Cognitive Impairment follow-up', 'ACTIVE', '2026-11-05')");

            // Seed default courses
            stmt.execute("INSERT OR IGNORE INTO courses VALUES " +
                    "('CS405', 'Distributed Systems & Web Services', 'Computer Science', 4, 'Prof. Marcus Vance', 'Mon/Wed 10:00 - 11:30')," +
                    "('HI301', 'Electronic Health Records & Standards', 'Health Informatics', 3, 'Dr. Aris Thorne', 'Tue/Thu 14:00 - 15:30')");

            System.out.println("[DatabaseManager] Database initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[DatabaseManager] DB Init Error: " + e.getMessage());
        }
    }
}
