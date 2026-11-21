-- ========================================================
-- UniMed Connect: Integrated Database Schema & Seed Data
-- Compatible with SQLite and MySQL (JAX-WS JDBC Integration)
-- ========================================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    attendance_rate DECIMAL(5,2) DEFAULT 0.0,
    cgpa DECIMAL(3,2) DEFAULT 0.0,
    enrolled_courses_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    course_code VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    instructor_name VARCHAR(100) NOT NULL,
    schedule VARCHAR(100) NOT NULL
);

-- 3. Student Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(20) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PRESENT', 'ABSENT', 'EXCUSED'
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);

-- 4. Academic Results Table
CREATE TABLE IF NOT EXISTS results (
    result_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(20) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) DEFAULT 100.0,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);

-- 5. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL,
    availability_status VARCHAR(50) NOT NULL, -- 'AVAILABLE', 'IN_CONSULTATION', 'OFFLINE'
    rating DECIMAL(3,2) DEFAULT 4.8
);

-- 6. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    department VARCHAR(100) NOT NULL,
    assigned_doctor_id VARCHAR(20),
    contact_phone VARCHAR(20),
    medical_condition VARCHAR(200),
    consultation_status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED', 'PENDING'
    last_visit_date DATE,
    FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(doctor_id)
);

-- 7. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id VARCHAR(30) PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    reason_for_visit TEXT,
    status VARCHAR(30) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'COMPLETED', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- 8. Video Sessions Table
CREATE TABLE IF NOT EXISTS video_sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'CLASSROOM', 'TELEHEALTH'
    host_id VARCHAR(30) NOT NULL,
    host_name VARCHAR(100) NOT NULL,
    participant_count INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'ENDED'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

-- 9. Service Transactions Table
CREATE TABLE IF NOT EXISTS service_transactions (
    transaction_id VARCHAR(50) PRIMARY KEY,
    service_name VARCHAR(50) NOT NULL,
    operation VARCHAR(50) NOT NULL,
    consumer_app VARCHAR(50) NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT NOT NULL,
    request_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Sample Fictional Seed Data
-- ========================================================

-- Insert Sample Students
INSERT OR IGNORE INTO students (student_id, name, department, year_of_study, email, attendance_rate, cgpa, enrolled_courses_count) VALUES
('STU1001', 'Sarah Chen', 'Computer Science', 3, 'sarah.chen@university.edu', 94.50, 3.88, 5),
('STU1002', 'Liam O''Connor', 'Health Informatics', 2, 'liam.oc@university.edu', 88.20, 3.65, 4),
('STU1003', 'Amina Yusuf', 'Biomedical Engineering', 4, 'amina.yusuf@university.edu', 96.00, 3.92, 6),
('STU1004', 'Carlos Rivera', 'Nursing & Health Sciences', 1, 'carlos.r@university.edu', 82.75, 3.40, 4),
('STU1005', 'Mei-Ling Zhou', 'Computer Science', 2, 'ml.zhou@university.edu', 91.00, 3.75, 5);

-- Insert Sample Courses
INSERT OR IGNORE INTO courses (course_code, course_name, department, credits, instructor_name, schedule) VALUES
('CS405', 'Distributed Systems & Web Services', 'Computer Science', 4, 'Prof. Marcus Vance', 'Mon/Wed 10:00 - 11:30'),
('HI301', 'Electronic Health Records & Standards', 'Health Informatics', 3, 'Dr. Aris Thorne', 'Tue/Thu 14:00 - 15:30'),
('BME410', 'Medical Imaging Systems & Telehealth', 'Biomedical Engineering', 4, 'Prof. Clara Higgins', 'Mon/Fri 09:00 - 10:30'),
('NUR204', 'Clinical Patient Care & Documentation', 'Nursing & Health Sciences', 3, 'Dr. Elena Rostova', 'Wed/Fri 13:00 - 14:30');

-- Insert Sample Results
INSERT OR IGNORE INTO results (student_id, course_code, semester, grade, marks_obtained, max_marks) VALUES
('STU1001', 'CS405', 'Fall 2026', 'A', 92.5, 100.0),
('STU1001', 'HI301', 'Fall 2026', 'A-', 88.0, 100.0),
('STU1002', 'HI301', 'Fall 2026', 'B+', 84.0, 100.0),
('STU1003', 'BME410', 'Fall 2026', 'A+', 97.0, 100.0),
('STU1004', 'NUR204', 'Fall 2026', 'B', 81.5, 100.0);

-- Insert Sample Doctors
INSERT OR IGNORE INTO doctors (doctor_id, doctor_id_pk, name, specialization, department, email, consultation_fee, availability_status, rating) 
SELECT 'DOC3001', 'DOC3001', 'Dr. Elena Rostova', 'Cardiovascular Medicine & Telehealth', 'Cardiology', 'e.rostova@hospital.unimed.org', 75.00, 'AVAILABLE', 4.95
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE doctor_id = 'DOC3001');

INSERT OR IGNORE INTO doctors (doctor_id, name, specialization, department, email, consultation_fee, availability_status, rating) VALUES
('DOC3002', 'Dr. Jonathan Vance', 'Clinical Neurology', 'Neurology', 'j.vance@hospital.unimed.org', 90.00, 'AVAILABLE', 4.88),
('DOC3003', 'Dr. Sophia Patel', 'General Pediatrics & Adolescent Care', 'Pediatrics', 's.patel@hospital.unimed.org', 65.00, 'IN_CONSULTATION', 4.92),
('DOC3004', 'Dr. Tariq Al-Mansoor', 'Internal Medicine & Chronic Care', 'General Medicine', 't.almansoor@hospital.unimed.org', 70.00, 'AVAILABLE', 4.85);

-- Insert Sample Patients
INSERT OR IGNORE INTO patients (patient_id, name, age, gender, department, assigned_doctor_id, contact_phone, medical_condition, consultation_status, last_visit_date) VALUES
('PAT4001', 'James Wilson', 48, 'Male', 'Cardiology', 'DOC3001', '+1 (555) 234-8901', 'Stage 1 Hypertension & Arrhythmia Monitoring', 'ACTIVE', '2026-11-10'),
('PAT4002', 'Eleanor Vance', 62, 'Female', 'Neurology', 'DOC3002', '+1 (555) 876-1122', 'Mild Cognitive Impairment follow-up', 'ACTIVE', '2026-11-05'),
('PAT4003', 'Noah Campbell', 9, 'Male', 'Pediatrics', 'DOC3003', '+1 (555) 432-9087', 'Pediatric Asthma Management', 'ACTIVE', '2026-10-28'),
('PAT4004', 'Fatima Zahra', 34, 'Female', 'General Medicine', 'DOC3004', '+1 (555) 901-2244', 'Type 2 Diabetes Routine Review', 'PENDING', '2026-11-18');

-- Insert Sample Appointments
INSERT OR IGNORE INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, time_slot, reason_for_visit, status) VALUES
('APT-2026-8801', 'PAT4001', 'DOC3001', '2026-11-22', '10:00 AM - 10:30 AM', 'Bi-weekly Telehealth Blood Pressure Evaluation', 'SCHEDULED'),
('APT-2026-8802', 'PAT4002', 'DOC3002', '2026-11-22', '11:30 AM - 12:00 PM', 'Neurological motor assessment and scan review', 'SCHEDULED'),
('APT-2026-8803', 'PAT4003', 'DOC3003', '2026-11-23', '02:00 PM - 02:30 PM', 'Follow-up on inhaler dosage and spirometry', 'SCHEDULED'),
('APT-2026-8790', 'PAT4004', 'DOC3004', '2026-11-18', '09:00 AM - 09:30 AM', 'Blood glucose monitoring and nutritional guidance', 'COMPLETED');

-- Insert Sample Video Sessions
INSERT OR IGNORE INTO video_sessions (session_id, title, type, host_id, host_name, participant_count, status) VALUES
('CONF-CLS-405', 'CS405: SOAP Web Services & Distributed RPC', 'CLASSROOM', 'FAC2004', 'Prof. Marcus Vance', 24, 'ACTIVE'),
('CONF-MED-3001', 'Telehealth Consultation - J. Wilson (Cardiology)', 'TELEHEALTH', 'DOC3001', 'Dr. Elena Rostova', 2, 'ACTIVE');

-- Insert Initial Transactions
INSERT OR IGNORE INTO service_transactions (transaction_id, service_name, operation, consumer_app, status_code, response_time_ms) VALUES
('TXN-9011', 'StudentService', 'getStudentById', 'UniversityPortal', 200, 84),
('TXN-9012', 'HealthcareService', 'getPatientById', 'HospitalEHR', 200, 112),
('TXN-9013', 'ClassroomService', 'getCourseDetails', 'ElearningApp', 200, 76),
('TXN-9014', 'VideoSessionService', 'getSessionStatus', 'VideoGateway', 200, 45);
