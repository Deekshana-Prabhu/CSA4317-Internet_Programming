-- =====================================================================
-- Database Name: medic_connect_db
-- System: MediConnect – Smart Healthcare Management System
-- Technology: MySQL 8.0+ / JDBC / JAX-WS SOAP Web Services
-- =====================================================================

DROP DATABASE IF EXISTS medic_connect_db;
CREATE DATABASE medic_connect_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE medic_connect_db;

-- ---------------------------------------------------------------------
-- 1. Table: doctors
-- Stores physician directory and department assignments
-- ---------------------------------------------------------------------
CREATE TABLE doctors (
    doctor_id VARCHAR(20) PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    availability VARCHAR(50) NOT NULL DEFAULT 'Available',
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    room_no VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. Table: patients
-- Centralized patient health records and primary physician linkage
-- ---------------------------------------------------------------------
CREATE TABLE patients (
    patient_id VARCHAR(20) PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    doctor_id VARCHAR(20),
    department VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_doctor FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------
-- 3. Table: appointments
-- Multi-department clinical scheduling records
-- ---------------------------------------------------------------------
CREATE TABLE appointments (
    appointment_id VARCHAR(20) PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    appointment_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) 
        REFERENCES doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------
-- 4. Table: laboratory_reports
-- Diagnostic test results and pathology observations
-- ---------------------------------------------------------------------
CREATE TABLE laboratory_reports (
    report_id VARCHAR(20) PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    laboratory_name VARCHAR(100) NOT NULL,
    test_result VARCHAR(255) NOT NULL,
    reference_range VARCHAR(100),
    report_status VARCHAR(30) NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lab_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------
-- 5. Table: pharmacy
-- Hospital pharmacy formulary inventory & dispensing control
-- ---------------------------------------------------------------------
CREATE TABLE pharmacy (
    medicine_id VARCHAR(20) PRIMARY KEY,
    medicine_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    available_stock INT NOT NULL DEFAULT 0,
    prescription_status VARCHAR(30) NOT NULL DEFAULT 'Prescription Required',
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    manufacturer VARCHAR(100),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX idx_patients_dept ON patients(department);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_lab_patient ON laboratory_reports(patient_id);
CREATE INDEX idx_pharmacy_category ON pharmacy(category);

-- =====================================================================
-- SAMPLE DEMONSTRATION DATA (Fictional Data)
-- =====================================================================

-- Insert Doctors
INSERT INTO doctors (doctor_id, doctor_name, specialization, department, availability, contact_email, contact_phone, room_no) VALUES
('DOC-101', 'Dr. Sarah Mitchell', 'Interventional Cardiology', 'Cardiology', 'Available', 's.mitchell@mediconnect.org', '+1 (555) 234-5671', 'Room 302'),
('DOC-102', 'Dr. Robert Chen', 'Cerebrovascular Neurology', 'Neurology', 'Available', 'r.chen@mediconnect.org', '+1 (555) 234-5672', 'Room 415'),
('DOC-103', 'Dr. Elena Rostova', 'Joint Reconstruction & Trauma', 'Orthopedics', 'In Surgery', 'e.rostova@mediconnect.org', '+1 (555) 234-5673', 'Room 210'),
('DOC-104', 'Dr. Marcus Vance', 'Pediatric Pulmonology', 'Pediatrics', 'Available', 'm.vance@mediconnect.org', '+1 (555) 234-5674', 'Room 108'),
('DOC-105', 'Dr. Aisha Patel', 'Internal Medicine & Diabetology', 'General Medicine', 'Available', 'a.patel@mediconnect.org', '+1 (555) 234-5675', 'Room 102'),
('DOC-106', 'Dr. David Kim', 'Clinical & Surgical Dermatology', 'Dermatology', 'On Call', 'd.kim@mediconnect.org', '+1 (555) 234-5676', 'Room 501');

-- Insert Patients (12 Fictional Patients)
INSERT INTO patients (patient_id, patient_name, age, gender, blood_group, mobile, email, address, doctor_id, department) VALUES
('PAT-1001', 'Arthur Pendelton', 58, 'Male', 'O+', '+1 (555) 019-2831', 'arthur.p@example.com', '742 Evergreen Terrace, Springfield', 'DOC-101', 'Cardiology'),
('PAT-1002', 'Beatrice Montgomery', 42, 'Female', 'A+', '+1 (555) 018-9921', 'b.montgomery@example.com', '1204 Elmhurst Avenue, Boston', 'DOC-102', 'Neurology'),
('PAT-1003', 'Carlos Santillan', 35, 'Male', 'B+', '+1 (555) 017-3847', 'carlos.s@example.com', '4802 Horizon Boulevard, Chicago', 'DOC-103', 'Orthopedics'),
('PAT-1004', 'Daisy Abernathy', 9, 'Female', 'O-', '+1 (555) 016-1294', 'abernathy.family@example.com', '88 Pinewood Lane, Seattle', 'DOC-104', 'Pediatrics'),
('PAT-1005', 'Edward Thorne', 67, 'Male', 'AB+', '+1 (555) 015-8832', 'edward.thorne@example.com', '315 Harbor Point, San Diego', 'DOC-105', 'General Medicine'),
('PAT-1006', 'Fiona Gallagher', 28, 'Female', 'A-', '+1 (555) 014-4721', 'fiona.g@example.com', '627 Maple Street, Austin', 'DOC-106', 'Dermatology'),
('PAT-1007', 'George Washington Clark', 51, 'Male', 'B-', '+1 (555) 013-9081', 'gw.clark@example.com', '910 Riverbed Court, Denver', 'DOC-101', 'Cardiology'),
('PAT-1008', 'Helena Vance', 39, 'Female', 'O+', '+1 (555) 012-3498', 'h.vance@example.com', '1520 Sunset Ridge, Phoenix', 'DOC-105', 'General Medicine'),
('PAT-1009', 'Ian MacLeod', 63, 'Male', 'A+', '+1 (555) 011-7712', 'ian.macleod@example.com', '24 High Street, Philadelphia', 'DOC-103', 'Orthopedics'),
('PAT-1010', 'Julia Ramirez', 31, 'Female', 'AB-', '+1 (555) 010-6644', 'julia.ramirez@example.com', '703 West End Ave, New York', 'DOC-102', 'Neurology'),
('PAT-1011', 'Kevin Sterling', 12, 'Male', 'O+', '+1 (555) 009-5531', 'sterling.parents@example.com', '412 Oakridge Way, Atlanta', 'DOC-104', 'Pediatrics'),
('PAT-1012', 'Laura Higgins', 47, 'Female', 'B+', '+1 (555) 008-2219', 'laura.higgins@example.com', '190 Birchwood Trail, Portland', 'DOC-106', 'Dermatology');

-- Insert Appointments
INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, appointment_status, notes) VALUES
('APT-2001', 'PAT-1001', 'DOC-101', '2026-11-21', '09:30 AM', 'Confirmed', 'Routine cardiovascular follow-up post stent placement'),
('APT-2002', 'PAT-1002', 'DOC-102', '2026-11-21', '10:15 AM', 'Confirmed', 'Migraine with aura evaluation and EEG review'),
('APT-2003', 'PAT-1003', 'DOC-103', '2026-11-21', '11:00 AM', 'Pending', 'Post-ACL reconstructive rehabilitation check'),
('APT-2004', 'PAT-1004', 'DOC-104', '2026-11-21', '02:00 PM', 'Confirmed', 'Pediatric annual wellness and asthma management'),
('APT-2005', 'PAT-1005', 'DOC-105', '2026-11-21', '03:15 PM', 'Completed', 'Type-2 diabetes blood glucose review & medication titration'),
('APT-2006', 'PAT-1006', 'DOC-106', '2026-11-21', '04:00 PM', 'Confirmed', 'Eczema flare-up assessment and topical therapy review'),
('APT-2007', 'PAT-1007', 'DOC-101', '2026-11-22', '09:00 AM', 'Confirmed', 'Hypertension management and ECG reading'),
('APT-2008', 'PAT-1008', 'DOC-105', '2026-11-22', '10:30 AM', 'Pending', 'General wellness assessment and lipid panel discussion'),
('APT-2009', 'PAT-1009', 'DOC-103', '2026-11-22', '01:30 PM', 'Confirmed', 'Osteoarthritis management and joint mobility test'),
('APT-2010', 'PAT-1010', 'DOC-102', '2026-11-23', '11:15 AM', 'Pending', 'Neuropathy screening and reflex response monitoring'),
('APT-2011', 'PAT-1011', 'DOC-104', '2026-11-23', '03:45 PM', 'Confirmed', 'Seasonal bronchitis recovery follow-up'),
('APT-2012', 'PAT-1012', 'DOC-106', '2026-11-24', '10:00 AM', 'Cancelled', 'Rescheduling requested by patient due to travel');

-- Insert Laboratory Reports
INSERT INTO laboratory_reports (report_id, patient_id, test_name, test_date, laboratory_name, test_result, reference_range, report_status) VALUES
('LAB-3001', 'PAT-1001', 'Lipid Profile', '2026-11-19', 'Central Cardio Pathology Lab', 'Total Cholesterol: 184 mg/dL (HDL: 52, LDL: 104, Trig: 140)', '< 200 mg/dL', 'Completed'),
('LAB-3002', 'PAT-1001', 'Complete Blood Count', '2026-11-19', 'Central Hematology Lab', 'WBC: 6.8 K/uL, RBC: 4.8 M/uL, Platelets: 240 K/uL', 'WBC: 4.5-11.0 K/uL', 'Completed'),
('LAB-3003', 'PAT-1002', 'Thyroid Function Test', '2026-11-18', 'Endocrine Diagnostics Unit', 'TSH: 2.14 mIU/L, Free T4: 1.28 ng/dL', 'TSH: 0.4-4.0 mIU/L', 'Completed'),
('LAB-3004', 'PAT-1003', 'Hemoglobin Test', '2026-11-20', 'BioChem Specialty Diagnostic', 'Hb: 14.5 g/dL (Normal)', '13.5 - 17.5 g/dL', 'Completed'),
('LAB-3005', 'PAT-1004', 'Complete Blood Count', '2026-11-20', 'Pediatric Diagnostic Core', 'WBC: 7.2 K/uL, Platelets: 285 K/uL', 'WBC: 5.0-12.0 K/uL', 'Completed'),
('LAB-3006', 'PAT-1005', 'Blood Glucose (Fasting & PP)', '2026-11-20', 'Metabolic Health Laboratory', 'Fasting: 118 mg/dL, Post Prandial: 162 mg/dL', 'Fasting: 70-99 mg/dL', 'Completed'),
('LAB-3007', 'PAT-1005', 'Hemoglobin Test (HbA1c)', '2026-11-18', 'Metabolic Health Laboratory', 'HbA1c: 6.7% (Fair Glycemic Control)', '< 5.7% (Normal)', 'Completed'),
('LAB-3008', 'PAT-1006', 'Skin Allergy Panel IgE', '2026-11-21', 'ImmunoDerm Testing Lab', 'Total IgE: 145 IU/mL (Moderate elevation)', '< 100 IU/mL', 'Pending'),
('LAB-3009', 'PAT-1007', 'Lipid Profile', '2026-11-17', 'Central Cardio Pathology Lab', 'Total Cholesterol: 215 mg/dL (Elevated LDL 138)', '< 200 mg/dL', 'Completed'),
('LAB-3010', 'PAT-1008', 'Thyroid Function Test', '2026-11-21', 'Endocrine Diagnostics Unit', 'Sample received in laboratory for TSH/FT3 assay', 'TSH: 0.4-4.0 mIU/L', 'In Analysis'),
('LAB-3011', 'PAT-1009', 'Serum Uric Acid & ESR', '2026-11-16', 'Rheumatology Clinical Lab', 'Uric Acid: 6.2 mg/dL, ESR: 18 mm/hr', 'Uric Acid: 3.5-7.2 mg/dL', 'Completed'),
('LAB-3012', 'PAT-1010', 'Vitamin B12 & Folate', '2026-11-19', 'NeuroVascular Reference Lab', 'B12: 480 pg/mL, Folate: 11.2 ng/mL', 'B12: 200-900 pg/mL', 'Completed');

-- Insert Pharmacy Formulary
INSERT INTO pharmacy (medicine_id, medicine_name, category, available_stock, prescription_status, unit_price, manufacturer, expiry_date) VALUES
('MED-4001', 'Atorvastatin 20mg', 'Antihypertensives & Lipids', 240, 'Prescription Required', 14.50, 'Pfizer Pharma', '2027-08-31'),
('MED-4002', 'Metformin HCl 500mg', 'Antidiabetics', 380, 'Prescription Required', 8.25, 'Merck Health', '2027-11-30'),
('MED-4003', 'Amoxicillin & Clavulanate 625mg', 'Antibiotics', 150, 'Prescription Required', 18.00, 'GSK Healthcare', '2027-04-15'),
('MED-4004', 'Levothyroxine Sodium 50mcg', 'Endocrine / Thyroid', 210, 'Prescription Required', 12.00, 'Abbott Diagnostics', '2028-01-20'),
('MED-4005', 'Pantoprazole 40mg', 'Antacids & Gastro', 420, 'Over The Counter', 7.50, 'Sun Pharma', '2027-09-15'),
('MED-4006', 'Ibuprofen 400mg', 'Analgesics & Anti-inflammatory', 500, 'Over The Counter', 5.00, 'Bayer Consumer Health', '2028-03-30'),
('MED-4007', 'Montelukast Sodium 10mg', 'Respiratory & Allergy', 180, 'Prescription Required', 16.75, 'Merck & Co.', '2027-06-25'),
('MED-4008', 'Amlodipine Besylate 5mg', 'Antihypertensives', 290, 'Prescription Required', 9.20, 'Novartis AG', '2027-12-10'),
('MED-4009', 'Paracetamol 650mg Fast-Release', 'Analgesics & Antipyretics', 650, 'Over The Counter', 3.50, 'GSK Consumer Health', '2028-05-31'),
('MED-4010', 'Hydrocortisone Cream 1%', 'Dermatologicals', 95, 'Over The Counter', 11.00, 'Galderma Labs', '2027-07-20'),
('MED-4011', 'Vitamin D3 60,000 IU Softgels', 'Vitamins & Supplements', 320, 'Over The Counter', 15.00, 'Cadila Healthcare', '2028-02-28'),
('MED-4012', 'Losartan Potassium 50mg', 'Antihypertensives', 160, 'Prescription Required', 11.50, 'AstraZeneca', '2027-10-18');

-- =====================================================================
-- DEMONSTRATION QUERIES FOR JAVA SOAP WEB SERVICES (JDBC PREPAREDSTATEMENTS)
-- =====================================================================

-- Query 1: Retrieve Patient by ID with Doctor Details
-- Used by: HealthcareInformationServiceImpl.getPatientById(String patientId)
SELECT 
    p.patient_id, 
    p.patient_name, 
    p.age, 
    p.gender, 
    p.blood_group, 
    p.mobile, 
    p.email, 
    p.address, 
    COALESCE(d.doctor_name, 'Unassigned') AS doctor_name, 
    p.department
FROM patients p
LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
WHERE p.patient_id = 'PAT-1001';

-- Query 2: Retrieve Laboratory Reports by Patient ID
-- Used by: HealthcareInformationServiceImpl.getLaboratoryReports(String patientId)
SELECT 
    report_id, 
    patient_id, 
    test_name, 
    test_date, 
    laboratory_name, 
    test_result, 
    reference_range, 
    report_status
FROM laboratory_reports
WHERE patient_id = 'PAT-1001'
ORDER BY test_date DESC;

-- Query 3: Retrieve Appointments by Patient ID
-- Used by: HealthcareInformationServiceImpl.getAppointments(String patientId)
SELECT 
    a.appointment_id, 
    a.patient_id, 
    d.doctor_name, 
    a.appointment_date, 
    a.appointment_time, 
    a.appointment_status,
    a.notes
FROM appointments a
JOIN doctors d ON a.doctor_id = d.doctor_id
WHERE a.patient_id = 'PAT-1001'
ORDER BY a.appointment_date DESC;

-- Query 4: Retrieve All Patients
-- Used by: HealthcareInformationServiceImpl.getAllPatients()
SELECT 
    p.patient_id, 
    p.patient_name, 
    p.age, 
    p.gender, 
    p.blood_group, 
    p.mobile, 
    p.email, 
    p.address, 
    COALESCE(d.doctor_name, 'Unassigned') AS doctor_name, 
    p.department
FROM patients p
LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
ORDER BY p.patient_id ASC;
