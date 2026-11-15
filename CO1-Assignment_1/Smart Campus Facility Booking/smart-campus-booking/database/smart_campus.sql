-- ==========================================================
-- SMART CAMPUS FACILITY BOOKING SYSTEM
-- Database Schema and Initial Seed Data
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB (WAMP, XAMPP, LAMP)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `smart_campus` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_campus`;

-- --------------------------------------------------------
-- 1. Faculty Table
-- --------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `facilities`;
DROP TABLE IF EXISTS `faculty`;

CREATE TABLE `faculty` (
  `faculty_id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `contact_number` VARCHAR(30) NOT NULL,
  `designation` VARCHAR(100) DEFAULT 'Associate Professor',
  `avatar` VARCHAR(255) DEFAULT 'images/avatar-faculty.svg',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`faculty_id`),
  UNIQUE KEY `idx_faculty_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Faculty Members
INSERT INTO `faculty` (`faculty_id`, `name`, `department`, `email`, `contact_number`, `designation`, `avatar`) VALUES
('FAC-1042', 'Dr. Sarah Jenkins', 'Computer Science & Engineering', 's.jenkins@smartcampus.edu', '+1 (555) 234-5678', 'Professor & Head of Department', 'images/avatar-faculty.svg'),
('FAC-1088', 'Prof. Robert Martinez', 'Electronics & Communication', 'r.martinez@smartcampus.edu', '+1 (555) 345-6789', 'Associate Professor', 'images/avatar-faculty.svg'),
('FAC-1105', 'Dr. Elena Rostova', 'Mechanical & Robotics Engineering', 'e.rostova@smartcampus.edu', '+1 (555) 456-7890', 'Senior Research Fellow', 'images/avatar-faculty.svg'),
('FAC-1140', 'Dr. Marcus Vance', 'Information Technology & Data Science', 'm.vance@smartcampus.edu', '+1 (555) 567-8901', 'Assistant Professor', 'images/avatar-faculty.svg'),
('FAC-1215', 'Prof. Anita Deshmukh', 'Business & Management Studies', 'a.deshmukh@smartcampus.edu', '+1 (555) 678-9012', 'Dean of Academic Affairs', 'images/avatar-faculty.svg');

-- --------------------------------------------------------
-- 2. Facilities Table
-- --------------------------------------------------------
CREATE TABLE `facilities` (
  `facility_id` INT AUTO_INCREMENT NOT NULL,
  `facility_code` VARCHAR(20) NOT NULL,
  `facility_name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `building` VARCHAR(100) NOT NULL,
  `floor` VARCHAR(30) NOT NULL,
  `capacity` INT NOT NULL,
  `equipment` TEXT NOT NULL,
  `description` TEXT NOT NULL,
  `operating_hours` VARCHAR(80) DEFAULT '08:00 AM - 08:00 PM',
  `availability_status` ENUM('Available', 'Booked', 'Under Maintenance') NOT NULL DEFAULT 'Available',
  `image_url` VARCHAR(255) NOT NULL,
  `category` VARCHAR(60) NOT NULL DEFAULT 'Hall',
  `booking_rules` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`facility_id`),
  UNIQUE KEY `idx_facility_code` (`facility_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed 12 Smart Campus Facilities
INSERT INTO `facilities` (`facility_id`, `facility_code`, `facility_name`, `location`, `building`, `floor`, `capacity`, `equipment`, `description`, `operating_hours`, `availability_status`, `image_url`, `category`, `booking_rules`) VALUES
(1, 'FACIL-001', 'Seminar Hall A', 'Ramanujan Academic Block, 2nd Floor', 'Ramanujan Academic Block', '2nd Floor, Room 204', 180, '4K Laser Projector, Surround Sound, Wireless Microphones, Stage Lighting, Podium PC, High-Speed Wi-Fi', 'Spacious tiered auditorium designed for academic keynote lectures, inter-college seminars, and guest presentations with state-of-the-art acoustic cladding.', '08:00 AM - 08:00 PM', 'Available', 'images/facility-1.jpg', 'Auditorium & Hall', 'Booking must be made at least 24 hours in advance. Technical assistant required for stage lighting console. Food and refreshments restricted to foyer area.'),

(2, 'FACIL-002', 'Seminar Hall B', 'Ramanujan Academic Block, 1st Floor', 'Ramanujan Academic Block', '1st Floor, Room 108', 120, 'HD Projector, Dual Microphones, PA System, Video Conferencing, Smart Interactive Board, Air Conditioning', 'Contemporary seminar hall tailored for departmental symposiums, guest speaker interactions, and faculty panel conferences with flexible seating.', '08:00 AM - 07:00 PM', 'Available', 'images/facility-2.jpg', 'Auditorium & Hall', 'Reserve 12 hours ahead. AV check 15 minutes before the session starts. All equipment must be powered down following completion.'),

(3, 'FACIL-003', 'Computer Laboratory', 'Turing IT Center, 3rd Floor', 'Turing IT Center', '3rd Floor, Lab 301', 60, '60 High-Performance Workstations, Gigabit LAN, Overhead Projector, Centralized UPS, Dual Gigabit Switches', 'State-of-the-art computing facility equipped with high-spec desktop machines for programming examinations, hackathons, and software engineering practicals.', '08:30 AM - 07:30 PM', 'Booked', 'images/facility-3.jpg', 'Laboratory', 'Student attendance logs must be maintained. External USB storage devices restricted without administrator clearance. Strictly no beverages inside.'),

(4, 'FACIL-004', 'AI & ML Laboratory', 'Turing IT Center, 4th Floor', 'Turing IT Center', '4th Floor, Lab 402', 45, 'NVIDIA RTX GPU Workstations, Cloud ML Compute Rack, Dual Presentation Displays, Interactive Digital Whiteboard', 'Specialized deep learning and computer vision laboratory with dedicated GPU compute servers for advanced research, model training, and capstone projects.', '08:00 AM - 08:00 PM', 'Available', 'images/facility-4.jpg', 'Laboratory', 'Workstation reservations prioritize departmental AI research and scheduled practical labs. Compute jobs must comply with campus power policies.'),

(5, 'FACIL-005', 'Conference Room', 'Administrative Tower, 2nd Floor', 'Administrative Tower', '2nd Floor, Room 210', 35, 'Polycom 4K Video Bridge, 75\" UHD Touch Display, Omni-Directional Mics, Executive Ergonomic Seating, Teleconference Audio', 'Executive conference suite designed for board meetings, administrative panels, accreditation reviews, and collaborative hybrid video conferences.', '08:00 AM - 06:30 PM', 'Booked', 'images/facility-5.jpg', 'Conference Room', 'Head of Department or Dean approval required for external visitors. Teleconference bridge links should be requested at least 6 hours prior.'),

(6, 'FACIL-006', 'Auditorium', 'Grand Arts & Cultural Complex, 1st Floor', 'Grand Arts & Cultural Complex', 'Ground & 1st Floor', 600, 'Concert-Grade Line-Array Acoustics, Motorized 300\" Projection Screen, Green Rooms, Stage Rigging, Live Stream Broadcast Setup', 'The premier venue of the university campus for annual convocations, national conferences, cultural fests, and distinguished presidential addresses.', '08:00 AM - 09:00 PM', 'Booked', 'images/facility-6.jpg', 'Auditorium & Hall', 'Booking requires Dean or Campus Director endorsement. Stage management and electrical crew must be assigned 48 hours prior to the event.'),

(7, 'FACIL-007', 'Innovation Hub', 'Technology Incubation Block, 1st Floor', 'Technology Incubation Block', '1st Floor, Suite 101', 50, '3D Printers, Prototyping Workbenches, Modular Collaborative Furniture, Brainstorming Glass Walls, IoT Development Kits', 'Dynamic creative ideation and rapid prototyping maker space where students and faculty incubate startup ventures, patent prototypes, and design solutions.', '08:00 AM - 08:00 PM', 'Available', 'images/facility-7.jpg', 'Innovation Space', 'Safety goggles mandatory when operating fabrication machinery and 3D printing equipment. Clean work area upon completion.'),

(8, 'FACIL-008', 'Research Laboratory', 'Science & Engineering Wing, 2nd Floor', 'Science & Engineering Wing', '2nd Floor, Room 215', 30, 'Precision Measurement Units, Digital Oscilloscopes, RF Spectrum Analyzers, Isolated Power Benches, ESD Clean Mats', 'Advanced multidisciplinary laboratory dedicated to postgraduate research, circuit synthesis, sensor testing, and experimental validation.', '08:00 AM - 08:00 PM', 'Booked', 'images/facility-8.jpg', 'Laboratory', 'Authorized research scholars and faculty only. Chemical handling protocols and static charge grounding are mandatory.'),

(9, 'FACIL-009', 'Digital Learning Room', 'Central Library Wing, 2nd Floor', 'Central Library Wing', '2nd Floor, Room 205', 40, 'Lecture Capture Multi-Cam, Wireless Screen Mirroring, VR Headsets, Student Response Clickers, Ceiling Microphones', 'Next-generation smart classroom optimized for hybrid distance learning, MOOC recording, interactive simulations, and flipped classroom pedagogy.', '08:30 AM - 07:00 PM', 'Available', 'images/facility-9.jpg', 'Digital Learning', 'Recording storage quota assigned per faculty. Camera calibration should be completed 10 minutes prior to session onset.'),

(10, 'FACIL-010', 'Meeting Room', 'Administrative Tower, 1st Floor', 'Administrative Tower', '1st Floor, Room 104', 16, 'Video Conferencing System, 55\" Display, Whiteboard, Speakerphone, HDMI Matrix Switcher, High-Speed Wi-Fi', 'Intimate meeting room perfect for thesis defenses, interview committees, faculty recruitment, and cross-departmental coordination huddles.', '08:00 AM - 06:00 PM', 'Available', 'images/facility-10.jpg', 'Conference Room', 'Drop-in bookings subject to minimum 1-hour notice. Whiteboards should be erased after each session.'),

(11, 'FACIL-011', 'Executive Boardroom', 'Chancellery Block, 3rd Floor', 'Chancellery Block', '3rd Floor, Suite 300', 24, 'Biometric Access, 85\" Ultra-HD Display, Integrated Table Mics, Executive Video Bridge, Document Camera, Privacy Blinds', 'High-level executive boardroom with panoramic campus views, tailored for Senate summits, international delegation talks, and Chancellor councils.', '08:00 AM - 06:00 PM', 'Available', 'images/facility-11.jpg', 'Conference Room', 'Requires Vice-Chancellor or Registrar office clearance. Protocol catering service available on request.'),

(12, 'FACIL-012', 'IoT & Robotics Studio', 'Technology Incubation Block, 2nd Floor', 'Technology Incubation Block', '2nd Floor, Studio 202', 35, 'Robotic Arms, Embedded Development Kits, Soldering Stations, Drone Test Cage, High-Speed Camera, Signal Generators', 'Specialized experimental robotics and automated systems proving ground featuring autonomous rover testing courses and aerial drone nets.', '08:30 AM - 07:30 PM', 'Available', 'images/facility-12.jpg', 'Innovation Space', 'Drone flight testing strictly inside test cage. Safety circuit breaker must be activated during soldering tasks.');

-- --------------------------------------------------------
-- 3. Bookings Table
-- --------------------------------------------------------
CREATE TABLE `bookings` (
  `booking_id` VARCHAR(30) NOT NULL,
  `faculty_id` VARCHAR(20) NOT NULL,
  `facility_id` INT NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `participant_count` INT NOT NULL,
  `booking_purpose` VARCHAR(255) NOT NULL,
  `special_requirements` TEXT,
  `equipment_required` TEXT,
  `booking_status` ENUM('Approved', 'Pending', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `idx_booking_date` (`booking_date`),
  KEY `idx_faculty_bookings` (`faculty_id`),
  KEY `idx_facility_schedule` (`facility_id`, `booking_date`, `start_time`, `end_time`),
  CONSTRAINT `fk_bookings_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_bookings_facility` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`facility_id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Seed Bookings
-- Designed to accurately reflect the dashboard summary cards:
-- Total Facilities: 12
-- Available Facilities: 8
-- Currently Booked: 4 (Bookings Approved for today)
-- Pending Requests: 3
-- --------------------------------------------------------

INSERT INTO `bookings` (`booking_id`, `faculty_id`, `facility_id`, `booking_date`, `start_time`, `end_time`, `participant_count`, `booking_purpose`, `special_requirements`, `equipment_required`, `booking_status`, `created_at`) VALUES
-- 4 Approved Active Bookings for Today (Facilities 3, 5, 6, 8 are currently booked)
('BK-2026-1041', 'FAC-1042', 3, CURRENT_DATE(), '09:00:00', '12:00:00', 55, 'Advanced Cloud Computing Practical Examination', 'Ensure local server instances and compiler binaries are loaded on all 60 systems.', 'Workstation Access, Overhead Projector, High-Speed Wi-Fi / LAN', 'Approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('BK-2026-1042', 'FAC-1088', 5, CURRENT_DATE(), '10:00:00', '12:30:00', 28, 'ABET & NBA Accreditation Strategy Review', 'Teleconference link with external evaluators and water service required.', 'Polycom 4K Video Bridge, 75\" UHD Touch Display, Omni-Directional Mics', 'Approved', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('BK-2026-1043', 'FAC-1215', 6, CURRENT_DATE(), '13:30:00', '17:30:00', 450, 'Annual International Engineering Colloquium & Keynote', 'Podium mic, floral stage arrangement, live streaming to alumni YouTube channel.', 'Concert-Grade Line-Array Acoustics, Motorized 300\" Projection Screen, Stage Rigging, Live Stream Broadcast Setup', 'Approved', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('BK-2026-1044', 'FAC-1105', 8, CURRENT_DATE(), '14:00:00', '17:00:00', 22, 'Departmental Quantum Sensors Testing & Data Collection', 'Calibrated RF analyzers and cleanroom air filters must be running.', 'Precision Measurement Units, Digital Oscilloscopes, RF Spectrum Analyzers', 'Approved', DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- 3 Pending Requests (for Seminar Hall A, Innovation Hub, and AI & ML Laboratory)
('BK-2026-1081', 'FAC-1042', 1, DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), '10:00:00', '12:00:00', 140, 'Special Lecture: Generative AI & Autonomous Systems', 'Stage podium with wireless collar mic and dual slide presenter clicker.', '4K Laser Projector, Wireless Microphones, Stage Lighting, Podium PC', 'Pending', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('BK-2026-1082', 'FAC-1140', 7, DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY), '14:00:00', '17:00:00', 40, 'Inter-College Smart India Hackathon Ideation Session', 'Access to modular whiteboards and 3D printing filament stocks.', '3D Printers, Prototyping Workbenches, Modular Furniture', 'Pending', DATE_SUB(NOW(), INTERVAL 7 HOUR)),
('BK-2026-1083', 'FAC-1088', 4, DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY), '11:00:00', '13:00:00', 38, 'NVIDIA CUDA Deep Learning Accelerated Workshop', 'Allocate student accounts on the GPU cluster beforehand.', 'NVIDIA RTX GPU Workstations, Cloud ML Compute Rack, Dual Presentation Displays', 'Pending', DATE_SUB(NOW(), INTERVAL 12 HOUR)),

-- Historic / Past & Cancelled Bookings for History view
('BK-2026-0912', 'FAC-1042', 2, DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), '09:30:00', '11:30:00', 95, 'Faculty Development Program on Cloud Microservices', 'Setup recording camera and pass-around cordless microphone.', 'HD Projector, Dual Microphones, PA System', 'Approved', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('BK-2026-0915', 'FAC-1042', 10, DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), '14:00:00', '15:30:00', 14, 'Department Curriculum Revision Advisory Committee', 'Video bridge connection with industry advisory board member.', 'Video Conferencing System, 55\" Display, Whiteboard', 'Approved', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('BK-2026-0920', 'FAC-1042', 9, DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY), '15:00:00', '16:30:00', 30, 'Recorded Demonstration for NPTEL Online Course', 'Microphone battery check and green screen background adjustment.', 'Lecture Capture Multi-Cam, Wireless Screen Mirroring', 'Cancelled', DATE_SUB(NOW(), INTERVAL 14 DAY)),
('BK-2026-0925', 'FAC-1042', 11, DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), '09:00:00', '10:30:00', 20, 'Research Grant Review Committee with State Council', 'Formal boardroom configuration with executive water bottles.', 'Biometric Access, 85\" Ultra-HD Display, Integrated Table Mics', 'Rejected', DATE_SUB(NOW(), INTERVAL 1 DAY));
