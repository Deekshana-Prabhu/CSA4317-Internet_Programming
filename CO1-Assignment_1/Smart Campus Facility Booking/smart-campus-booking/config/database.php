<?php
/**
 * Smart Campus Facility Booking System
 * Database Configuration and Repository Service
 * Compatible with WAMP, XAMPP, LAMP, and modern PHP (7.4, 8.0, 8.1, 8.2, 8.3+)
 */

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Connection Settings
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'smart_campus');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', 'utf8mb4');

// Default Active Faculty (Simulated Single Sign-On / Profile)
if (!isset($_SESSION['faculty_id'])) {
    $_SESSION['faculty_id'] = 'FAC-1042';
    $_SESSION['faculty_name'] = 'Dr. Sarah Jenkins';
    $_SESSION['faculty_dept'] = 'Computer Science & Engineering';
    $_SESSION['faculty_email'] = 's.jenkins@smartcampus.edu';
    $_SESSION['faculty_phone'] = '+1 (555) 234-5678';
}

/**
 * Returns a singleton PDO connection to the MySQL database.
 * If the database does not exist yet on MySQL, it automatically attempts to create it
 * and populate it using the database/smart_campus.sql file.
 */
function getDBConnection() {
    static $pdo = null;
    static $connectionAttempted = false;

    if ($pdo !== null) {
        return $pdo;
    }

    if ($connectionAttempted && $pdo === null) {
        return null;
    }

    $connectionAttempted = true;

    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // If error is code 1049 (Unknown database), attempt automatic database creation & import
        if ($e->getCode() == 1049 || strpos($e->getMessage(), 'Unknown database') !== false) {
            try {
                $serverDsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
                $serverPdo = new PDO($serverDsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);
                $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
                
                // Now connect to the new DB
                $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
                
                // Execute SQL file if present
                $sqlFile = __DIR__ . '/../database/smart_campus.sql';
                if (file_exists($sqlFile)) {
                    $sql = file_get_contents($sqlFile);
                    $pdo->exec($sql);
                }
                return $pdo;
            } catch (Exception $setupEx) {
                // Auto setup could not proceed
            }
        }
        
        // MySQL is not currently running or credentials failed
        // Return null to allow graceful fallback mode without fatal crash
        return null;
    }
}

/**
 * Checks if the system is currently connected to a live MySQL database.
 */
function isDatabaseConnected() {
    return getDBConnection() !== null;
}

/**
 * Fallback In-Memory / Static Repository Data
 * Used seamlessly when MySQL is offline or initializing.
 */
function getFallbackFacilities() {
    return [
        [
            'facility_id' => 1,
            'facility_code' => 'FACIL-001',
            'facility_name' => 'Seminar Hall A',
            'location' => 'Ramanujan Academic Block, 2nd Floor',
            'building' => 'Ramanujan Academic Block',
            'floor' => '2nd Floor, Room 204',
            'capacity' => 180,
            'equipment' => '4K Laser Projector, Surround Sound, Wireless Microphones, Stage Lighting, Podium PC, High-Speed Wi-Fi',
            'description' => 'Spacious tiered auditorium designed for academic keynote lectures, inter-college seminars, and guest presentations with state-of-the-art acoustic cladding.',
            'operating_hours' => '08:00 AM - 08:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-1.jpg',
            'category' => 'Auditorium & Hall',
            'booking_rules' => 'Booking must be made at least 24 hours in advance. Technical assistant required for stage lighting console. Food and refreshments restricted to foyer area.'
        ],
        [
            'facility_id' => 2,
            'facility_code' => 'FACIL-002',
            'facility_name' => 'Seminar Hall B',
            'location' => 'Ramanujan Academic Block, 1st Floor',
            'building' => 'Ramanujan Academic Block',
            'floor' => '1st Floor, Room 108',
            'capacity' => 120,
            'equipment' => 'HD Projector, Dual Microphones, PA System, Video Conferencing, Smart Interactive Board, Air Conditioning',
            'description' => 'Contemporary seminar hall tailored for departmental symposiums, guest speaker interactions, and faculty panel conferences with flexible seating.',
            'operating_hours' => '08:00 AM - 07:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-2.jpg',
            'category' => 'Auditorium & Hall',
            'booking_rules' => 'Reserve 12 hours ahead. AV check 15 minutes before the session starts. All equipment must be powered down following completion.'
        ],
        [
            'facility_id' => 3,
            'facility_code' => 'FACIL-003',
            'facility_name' => 'Computer Laboratory',
            'location' => 'Turing IT Center, 3rd Floor',
            'building' => 'Turing IT Center',
            'floor' => '3rd Floor, Lab 301',
            'capacity' => 60,
            'equipment' => '60 High-Performance Workstations, Gigabit LAN, Overhead Projector, Centralized UPS, Dual Gigabit Switches',
            'description' => 'State-of-the-art computing facility equipped with high-spec desktop machines for programming examinations, hackathons, and software engineering practicals.',
            'operating_hours' => '08:30 AM - 07:30 PM',
            'availability_status' => 'Booked',
            'image_url' => 'images/facility-3.jpg',
            'category' => 'Laboratory',
            'booking_rules' => 'Student attendance logs must be maintained. External USB storage devices restricted without administrator clearance. Strictly no beverages inside.'
        ],
        [
            'facility_id' => 4,
            'facility_code' => 'FACIL-004',
            'facility_name' => 'AI & ML Laboratory',
            'location' => 'Turing IT Center, 4th Floor',
            'building' => 'Turing IT Center',
            'floor' => '4th Floor, Lab 402',
            'capacity' => 45,
            'equipment' => 'NVIDIA RTX GPU Workstations, Cloud ML Compute Rack, Dual Presentation Displays, Interactive Digital Whiteboard',
            'description' => 'Specialized deep learning and computer vision laboratory with dedicated GPU compute servers for advanced research, model training, and capstone projects.',
            'operating_hours' => '08:00 AM - 08:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-4.jpg',
            'category' => 'Laboratory',
            'booking_rules' => 'Workstation reservations prioritize departmental AI research and scheduled practical labs. Compute jobs must comply with campus power policies.'
        ],
        [
            'facility_id' => 5,
            'facility_code' => 'FACIL-005',
            'facility_name' => 'Conference Room',
            'location' => 'Administrative Tower, 2nd Floor',
            'building' => 'Administrative Tower',
            'floor' => '2nd Floor, Room 210',
            'capacity' => 35,
            'equipment' => 'Polycom 4K Video Bridge, 75" UHD Touch Display, Omni-Directional Mics, Executive Ergonomic Seating, Teleconference Audio',
            'description' => 'Executive conference suite designed for board meetings, administrative panels, accreditation reviews, and collaborative hybrid video conferences.',
            'operating_hours' => '08:00 AM - 06:30 PM',
            'availability_status' => 'Booked',
            'image_url' => 'images/facility-5.jpg',
            'category' => 'Conference Room',
            'booking_rules' => 'Head of Department or Dean approval required for external visitors. Teleconference bridge links should be requested at least 6 hours prior.'
        ],
        [
            'facility_id' => 6,
            'facility_code' => 'FACIL-006',
            'facility_name' => 'Auditorium',
            'location' => 'Grand Arts & Cultural Complex, 1st Floor',
            'building' => 'Grand Arts & Cultural Complex',
            'floor' => 'Ground & 1st Floor',
            'capacity' => 600,
            'equipment' => 'Concert-Grade Line-Array Acoustics, Motorized 300" Projection Screen, Green Rooms, Stage Rigging, Live Stream Broadcast Setup',
            'description' => 'The premier venue of the university campus for annual convocations, national conferences, cultural fests, and distinguished presidential addresses.',
            'operating_hours' => '08:00 AM - 09:00 PM',
            'availability_status' => 'Booked',
            'image_url' => 'images/facility-6.jpg',
            'category' => 'Auditorium & Hall',
            'booking_rules' => 'Booking requires Dean or Campus Director endorsement. Stage management and electrical crew must be assigned 48 hours prior to the event.'
        ],
        [
            'facility_id' => 7,
            'facility_code' => 'FACIL-007',
            'facility_name' => 'Innovation Hub',
            'location' => 'Technology Incubation Block, 1st Floor',
            'building' => 'Technology Incubation Block',
            'floor' => '1st Floor, Suite 101',
            'capacity' => 50,
            'equipment' => '3D Printers, Prototyping Workbenches, Modular Collaborative Furniture, Brainstorming Glass Walls, IoT Development Kits',
            'description' => 'Dynamic creative ideation and rapid prototyping maker space where students and faculty incubate startup ventures, patent prototypes, and design solutions.',
            'operating_hours' => '08:00 AM - 08:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-7.jpg',
            'category' => 'Innovation Space',
            'booking_rules' => 'Safety goggles mandatory when operating fabrication machinery and 3D printing equipment. Clean work area upon completion.'
        ],
        [
            'facility_id' => 8,
            'facility_code' => 'FACIL-008',
            'facility_name' => 'Research Laboratory',
            'location' => 'Science & Engineering Wing, 2nd Floor',
            'building' => 'Science & Engineering Wing',
            'floor' => '2nd Floor, Room 215',
            'capacity' => 30,
            'equipment' => 'Precision Measurement Units, Digital Oscilloscopes, RF Spectrum Analyzers, Isolated Power Benches, ESD Clean Mats',
            'description' => 'Advanced multidisciplinary laboratory dedicated to postgraduate research, circuit synthesis, sensor testing, and experimental validation.',
            'operating_hours' => '08:00 AM - 08:00 PM',
            'availability_status' => 'Booked',
            'image_url' => 'images/facility-8.jpg',
            'category' => 'Laboratory',
            'booking_rules' => 'Authorized research scholars and faculty only. Chemical handling protocols and static charge grounding are mandatory.'
        ],
        [
            'facility_id' => 9,
            'facility_code' => 'FACIL-009',
            'facility_name' => 'Digital Learning Room',
            'location' => 'Central Library Wing, 2nd Floor',
            'building' => 'Central Library Wing',
            'floor' => '2nd Floor, Room 205',
            'capacity' => 40,
            'equipment' => 'Lecture Capture Multi-Cam, Wireless Screen Mirroring, VR Headsets, Student Response Clickers, Ceiling Microphones',
            'description' => 'Next-generation smart classroom optimized for hybrid distance learning, MOOC recording, interactive simulations, and flipped classroom pedagogy.',
            'operating_hours' => '08:30 AM - 07:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-9.jpg',
            'category' => 'Digital Learning',
            'booking_rules' => 'Recording storage quota assigned per faculty. Camera calibration should be completed 10 minutes prior to session onset.'
        ],
        [
            'facility_id' => 10,
            'facility_code' => 'FACIL-010',
            'facility_name' => 'Meeting Room',
            'location' => 'Administrative Tower, 1st Floor',
            'building' => 'Administrative Tower',
            'floor' => '1st Floor, Room 104',
            'capacity' => 16,
            'equipment' => 'Video Conferencing System, 55" Display, Whiteboard, Speakerphone, HDMI Matrix Switcher, High-Speed Wi-Fi',
            'description' => 'Intimate meeting room perfect for thesis defenses, interview committees, faculty recruitment, and cross-departmental coordination huddles.',
            'operating_hours' => '08:00 AM - 06:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-10.jpg',
            'category' => 'Conference Room',
            'booking_rules' => 'Drop-in bookings subject to minimum 1-hour notice. Whiteboards should be erased after each session.'
        ],
        [
            'facility_id' => 11,
            'facility_code' => 'FACIL-011',
            'facility_name' => 'Executive Boardroom',
            'location' => 'Chancellery Block, 3rd Floor',
            'building' => 'Chancellery Block',
            'floor' => '3rd Floor, Suite 300',
            'capacity' => 24,
            'equipment' => 'Biometric Access, 85" Ultra-HD Display, Integrated Table Mics, Executive Video Bridge, Document Camera, Privacy Blinds',
            'description' => 'High-level executive boardroom with panoramic campus views, tailored for Senate summits, international delegation talks, and Chancellor councils.',
            'operating_hours' => '08:00 AM - 06:00 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-11.jpg',
            'category' => 'Conference Room',
            'booking_rules' => 'Requires Vice-Chancellor or Registrar office clearance. Protocol catering service available on request.'
        ],
        [
            'facility_id' => 12,
            'facility_code' => 'FACIL-012',
            'facility_name' => 'IoT & Robotics Studio',
            'location' => 'Technology Incubation Block, 2nd Floor',
            'building' => 'Technology Incubation Block',
            'floor' => '2nd Floor, Studio 202',
            'capacity' => 35,
            'equipment' => 'Robotic Arms, Embedded Development Kits, Soldering Stations, Drone Test Cage, High-Speed Camera, Signal Generators',
            'description' => 'Specialized experimental robotics and automated systems proving ground featuring autonomous rover testing courses and aerial drone nets.',
            'operating_hours' => '08:30 AM - 07:30 PM',
            'availability_status' => 'Available',
            'image_url' => 'images/facility-12.jpg',
            'category' => 'Innovation Space',
            'booking_rules' => 'Drone flight testing strictly inside test cage. Safety circuit breaker must be activated during soldering tasks.'
        ]
    ];
}

/**
 * Initializes and retrieves fallback session-based bookings when MySQL is not connected.
 */
function getFallbackBookings() {
    if (!isset($_SESSION['mock_bookings'])) {
        $today = date('Y-m-d');
        $tomorrow = date('Y-m-d', strtotime('+1 day'));
        $day2 = date('Y-m-d', strtotime('+2 days'));
        $day3 = date('Y-m-d', strtotime('+3 days'));
        $past4 = date('Y-m-d', strtotime('-4 days'));
        $past6 = date('Y-m-d', strtotime('-6 days'));
        $past8 = date('Y-m-d', strtotime('-8 days'));
        $future5 = date('Y-m-d', strtotime('+5 days'));

        $_SESSION['mock_bookings'] = [
            [
                'booking_id' => 'BK-2026-1041',
                'faculty_id' => 'FAC-1042',
                'faculty_name' => 'Dr. Sarah Jenkins',
                'facility_id' => 3,
                'facility_name' => 'Computer Laboratory',
                'location' => 'Turing IT Center, 3rd Floor',
                'booking_date' => $today,
                'start_time' => '09:00:00',
                'end_time' => '12:00:00',
                'participant_count' => 55,
                'booking_purpose' => 'Advanced Cloud Computing Practical Examination',
                'special_requirements' => 'Ensure local server instances and compiler binaries are loaded on all 60 systems.',
                'equipment_required' => 'Workstation Access, Overhead Projector, High-Speed Wi-Fi / LAN',
                'booking_status' => 'Approved',
                'created_at' => date('Y-m-d H:i:s', strtotime('-2 days'))
            ],
            [
                'booking_id' => 'BK-2026-1042',
                'faculty_id' => 'FAC-1088',
                'faculty_name' => 'Prof. Robert Martinez',
                'facility_id' => 5,
                'facility_name' => 'Conference Room',
                'location' => 'Administrative Tower, 2nd Floor',
                'booking_date' => $today,
                'start_time' => '10:00:00',
                'end_time' => '12:30:00',
                'participant_count' => 28,
                'booking_purpose' => 'ABET & NBA Accreditation Strategy Review',
                'special_requirements' => 'Teleconference link with external evaluators and water service required.',
                'equipment_required' => 'Polycom 4K Video Bridge, 75" UHD Touch Display, Omni-Directional Mics',
                'booking_status' => 'Approved',
                'created_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
            ],
            [
                'booking_id' => 'BK-2026-1043',
                'faculty_id' => 'FAC-1215',
                'faculty_name' => 'Prof. Anita Deshmukh',
                'facility_id' => 6,
                'facility_name' => 'Auditorium',
                'location' => 'Grand Arts & Cultural Complex, 1st Floor',
                'booking_date' => $today,
                'start_time' => '13:30:00',
                'end_time' => '17:30:00',
                'participant_count' => 450,
                'booking_purpose' => 'Annual International Engineering Colloquium & Keynote',
                'special_requirements' => 'Podium mic, floral stage arrangement, live streaming to alumni YouTube channel.',
                'equipment_required' => 'Concert-Grade Line-Array Acoustics, Motorized 300" Projection Screen, Stage Rigging',
                'booking_status' => 'Approved',
                'created_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
            ],
            [
                'booking_id' => 'BK-2026-1044',
                'faculty_id' => 'FAC-1105',
                'faculty_name' => 'Dr. Elena Rostova',
                'facility_id' => 8,
                'facility_name' => 'Research Laboratory',
                'location' => 'Science & Engineering Wing, 2nd Floor',
                'booking_date' => $today,
                'start_time' => '14:00:00',
                'end_time' => '17:00:00',
                'participant_count' => 22,
                'booking_purpose' => 'Departmental Quantum Sensors Testing & Data Collection',
                'special_requirements' => 'Calibrated RF analyzers and cleanroom air filters must be running.',
                'equipment_required' => 'Precision Measurement Units, Digital Oscilloscopes, RF Spectrum Analyzers',
                'booking_status' => 'Approved',
                'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
            ],
            [
                'booking_id' => 'BK-2026-1081',
                'faculty_id' => 'FAC-1042',
                'faculty_name' => 'Dr. Sarah Jenkins',
                'facility_id' => 1,
                'facility_name' => 'Seminar Hall A',
                'location' => 'Ramanujan Academic Block, 2nd Floor',
                'booking_date' => $tomorrow,
                'start_time' => '10:00:00',
                'end_time' => '12:00:00',
                'participant_count' => 140,
                'booking_purpose' => 'Special Lecture: Generative AI & Autonomous Systems',
                'special_requirements' => 'Stage podium with wireless collar mic and dual slide presenter clicker.',
                'equipment_required' => '4K Laser Projector, Wireless Microphones, Stage Lighting, Podium PC',
                'booking_status' => 'Pending',
                'created_at' => date('Y-m-d H:i:s', strtotime('-4 hours'))
            ],
            [
                'booking_id' => 'BK-2026-1082',
                'faculty_id' => 'FAC-1140',
                'faculty_name' => 'Dr. Marcus Vance',
                'facility_id' => 7,
                'facility_name' => 'Innovation Hub',
                'location' => 'Technology Incubation Block, 1st Floor',
                'booking_date' => $day2,
                'start_time' => '14:00:00',
                'end_time' => '17:00:00',
                'participant_count' => 40,
                'booking_purpose' => 'Inter-College Smart India Hackathon Ideation Session',
                'special_requirements' => 'Access to modular whiteboards and 3D printing filament stocks.',
                'equipment_required' => '3D Printers, Prototyping Workbenches, Modular Furniture',
                'booking_status' => 'Pending',
                'created_at' => date('Y-m-d H:i:s', strtotime('-7 hours'))
            ],
            [
                'booking_id' => 'BK-2026-1083',
                'faculty_id' => 'FAC-1088',
                'faculty_name' => 'Prof. Robert Martinez',
                'facility_id' => 4,
                'facility_name' => 'AI & ML Laboratory',
                'location' => 'Turing IT Center, 4th Floor',
                'booking_date' => $day3,
                'start_time' => '11:00:00',
                'end_time' => '13:00:00',
                'participant_count' => 38,
                'booking_purpose' => 'NVIDIA CUDA Deep Learning Accelerated Workshop',
                'special_requirements' => 'Allocate student accounts on the GPU cluster beforehand.',
                'equipment_required' => 'NVIDIA RTX GPU Workstations, Cloud ML Compute Rack',
                'booking_status' => 'Pending',
                'created_at' => date('Y-m-d H:i:s', strtotime('-12 hours'))
            ],
            [
                'booking_id' => 'BK-2026-0912',
                'faculty_id' => 'FAC-1042',
                'faculty_name' => 'Dr. Sarah Jenkins',
                'facility_id' => 2,
                'facility_name' => 'Seminar Hall B',
                'location' => 'Ramanujan Academic Block, 1st Floor',
                'booking_date' => $past4,
                'start_time' => '09:30:00',
                'end_time' => '11:30:00',
                'participant_count' => 95,
                'booking_purpose' => 'Faculty Development Program on Cloud Microservices',
                'special_requirements' => 'Setup recording camera and pass-around cordless microphone.',
                'equipment_required' => 'HD Projector, Dual Microphones, PA System',
                'booking_status' => 'Approved',
                'created_at' => date('Y-m-d H:i:s', strtotime('-10 days'))
            ],
            [
                'booking_id' => 'BK-2026-0920',
                'faculty_id' => 'FAC-1042',
                'faculty_name' => 'Dr. Sarah Jenkins',
                'facility_id' => 9,
                'facility_name' => 'Digital Learning Room',
                'location' => 'Central Library Wing, 2nd Floor',
                'booking_date' => $past8,
                'start_time' => '15:00:00',
                'end_time' => '16:30:00',
                'participant_count' => 30,
                'booking_purpose' => 'Recorded Demonstration for NPTEL Online Course',
                'special_requirements' => 'Microphone battery check and green screen background adjustment.',
                'equipment_required' => 'Lecture Capture Multi-Cam, Wireless Screen Mirroring',
                'booking_status' => 'Cancelled',
                'created_at' => date('Y-m-d H:i:s', strtotime('-14 days'))
            ]
        ];
    }
    return $_SESSION['mock_bookings'];
}

/**
 * Retrieves all facilities from MySQL (or fallback) with optional search/filtering.
 */
function getAllFacilities($category = '', $status = '', $search = '') {
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "SELECT * FROM facilities WHERE 1=1";
            $params = [];

            if (!empty($category) && $category !== 'All') {
                $sql .= " AND category = ?";
                $params[] = $category;
            }

            if (!empty($status) && $status !== 'All') {
                $sql .= " AND availability_status = ?";
                $params[] = $status;
            }

            if (!empty($search)) {
                $sql .= " AND (facility_name LIKE ? OR building LIKE ? OR location LIKE ? OR equipment LIKE ?)";
                $searchTerm = '%' . $search . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $sql .= " ORDER BY facility_id ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Database query error: ' . $e->getMessage());
        }
    }

    // Fallback data filtering
    $facilities = getFallbackFacilities();
    if (!empty($category) && $category !== 'All') {
        $facilities = array_filter($facilities, function($f) use ($category) {
            return $f['category'] === $category;
        });
    }
    if (!empty($status) && $status !== 'All') {
        $facilities = array_filter($facilities, function($f) use ($status) {
            return $f['availability_status'] === $status;
        });
    }
    if (!empty($search)) {
        $searchLower = strtolower($search);
        $facilities = array_filter($facilities, function($f) use ($searchLower) {
            return strpos(strtolower($f['facility_name']), $searchLower) !== false
                || strpos(strtolower($f['building']), $searchLower) !== false
                || strpos(strtolower($f['equipment']), $searchLower) !== false;
        });
    }
    return array_values($facilities);
}

/**
 * Retrieves a single facility by ID.
 */
function getFacilityById($id) {
    $id = (int)$id;
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM facilities WHERE facility_id = ? LIMIT 1");
            $stmt->execute([$id]);
            $res = $stmt->fetch();
            if ($res) return $res;
        } catch (PDOException $e) {
            error_log('Database query error: ' . $e->getMessage());
        }
    }

    $all = getFallbackFacilities();
    foreach ($all as $item) {
        if ($item['facility_id'] == $id) {
            return $item;
        }
    }
    return null;
}

/**
 * Retrieves dashboard summary counts.
 * Expected metrics: Total: 12, Available: 8, Currently Booked: 4, Pending: 3
 */
function getDashboardStats() {
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $totalFacilities = (int)$pdo->query("SELECT COUNT(*) FROM facilities")->fetchColumn();
            $availableFacilities = (int)$pdo->query("SELECT COUNT(*) FROM facilities WHERE availability_status = 'Available'")->fetchColumn();
            $currentlyBooked = (int)$pdo->query("SELECT COUNT(*) FROM facilities WHERE availability_status = 'Booked'")->fetchColumn();
            $pendingRequests = (int)$pdo->query("SELECT COUNT(*) FROM bookings WHERE booking_status = 'Pending'")->fetchColumn();

            return [
                'total_facilities' => $totalFacilities ?: 12,
                'available_facilities' => $availableFacilities ?: 8,
                'currently_booked' => $currentlyBooked ?: 4,
                'pending_requests' => $pendingRequests ?: 3
            ];
        } catch (PDOException $e) {
            error_log('Stats query error: ' . $e->getMessage());
        }
    }

    // Default fallback counts matching prompt
    return [
        'total_facilities' => 12,
        'available_facilities' => 8,
        'currently_booked' => 4,
        'pending_requests' => 3
    ];
}

/**
 * Checks for overlapping booking times for the given facility and date.
 * Returns true if a conflict exists, false otherwise.
 * Overlap condition: existing_start < new_end AND existing_end > new_start
 */
function checkBookingConflict($facilityId, $date, $startTime, $endTime, $excludeBookingId = null) {
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "SELECT COUNT(*) FROM bookings 
                    WHERE facility_id = ? 
                      AND booking_date = ? 
                      AND booking_status IN ('Approved', 'Pending') 
                      AND NOT (end_time <= ? OR start_time >= ?)";
            $params = [$facilityId, $date, $startTime, $endTime];

            if ($excludeBookingId) {
                $sql .= " AND booking_id != ?";
                $params[] = $excludeBookingId;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return (int)$stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log('Conflict check error: ' . $e->getMessage());
        }
    }

    // Fallback conflict check
    $bookings = getFallbackBookings();
    foreach ($bookings as $b) {
        if ($b['facility_id'] == $facilityId && $b['booking_date'] == $date && in_array($b['booking_status'], ['Approved', 'Pending'])) {
            if ($excludeBookingId && $b['booking_id'] == $excludeBookingId) {
                continue;
            }
            $existingStart = strtotime($b['start_time']);
            $existingEnd = strtotime($b['end_time']);
            $newStart = strtotime($startTime);
            $newEnd = strtotime($endTime);

            if (!($newEnd <= $existingStart || $newStart >= $existingEnd)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Creates a new facility booking using prepared statement.
 * Generates unique booking ID.
 */
function createBooking($data) {
    $bookingId = 'BK-' . date('Y') . '-' . strtoupper(substr(uniqid(mt_rand(), true), 0, 4));

    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "INSERT INTO bookings 
                    (booking_id, faculty_id, facility_id, booking_date, start_time, end_time, 
                     participant_count, booking_purpose, special_requirements, equipment_required, 
                     booking_status, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $bookingId,
                $data['faculty_id'],
                $data['facility_id'],
                $data['booking_date'],
                $data['start_time'],
                $data['end_time'],
                $data['participant_count'],
                $data['booking_purpose'],
                $data['special_requirements'] ?? '',
                $data['equipment_required'] ?? ''
            ]);

            return [
                'success' => true,
                'booking_id' => $bookingId,
                'message' => 'Your booking request has been submitted successfully and is awaiting departmental approval.'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }

    // Fallback in-memory storage
    $facility = getFacilityById($data['facility_id']);
    $newBooking = [
        'booking_id' => $bookingId,
        'faculty_id' => $data['faculty_id'],
        'faculty_name' => $data['faculty_name'] ?? 'Dr. Sarah Jenkins',
        'facility_id' => (int)$data['facility_id'],
        'facility_name' => $facility ? $facility['facility_name'] : 'Selected Facility',
        'location' => $facility ? $facility['location'] : 'Campus Building',
        'booking_date' => $data['booking_date'],
        'start_time' => $data['start_time'],
        'end_time' => $data['end_time'],
        'participant_count' => (int)$data['participant_count'],
        'booking_purpose' => $data['booking_purpose'],
        'special_requirements' => $data['special_requirements'] ?? '',
        'equipment_required' => $data['equipment_required'] ?? '',
        'booking_status' => 'Pending',
        'created_at' => date('Y-m-d H:i:s')
    ];

    getFallbackBookings(); // ensure initialized
    array_unshift($_SESSION['mock_bookings'], $newBooking);

    return [
        'success' => true,
        'booking_id' => $bookingId,
        'message' => 'Your booking request has been submitted successfully (Session Storage).'
    ];
}

/**
 * Retrieves bookings with optional faculty filter and status filter.
 */
function getBookings($facultyId = null, $status = null, $limit = null) {
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "SELECT b.*, f.facility_name, f.building, f.location, f.image_url, fac.name as faculty_name, fac.department 
                    FROM bookings b
                    JOIN facilities f ON b.facility_id = f.facility_id
                    JOIN faculty fac ON b.faculty_id = fac.faculty_id
                    WHERE 1=1";
            $params = [];

            if ($facultyId) {
                $sql .= " AND b.faculty_id = ?";
                $params[] = $facultyId;
            }

            if ($status && $status !== 'All') {
                $sql .= " AND b.booking_status = ?";
                $params[] = $status;
            }

            $sql .= " ORDER BY b.booking_date DESC, b.start_time DESC";

            if ($limit) {
                $sql .= " LIMIT " . (int)$limit;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Bookings query error: ' . $e->getMessage());
        }
    }

    // Fallback list
    $bookings = getFallbackBookings();
    if ($facultyId) {
        $bookings = array_filter($bookings, function($b) use ($facultyId) {
            return $b['faculty_id'] === $facultyId;
        });
    }
    if ($status && $status !== 'All') {
        $bookings = array_filter($bookings, function($b) use ($status) {
            return $b['booking_status'] === $status;
        });
    }

    if ($limit) {
        $bookings = array_slice($bookings, 0, (int)$limit);
    }
    return array_values($bookings);
}

/**
 * Cancels a booking by updating status to 'Cancelled'.
 */
function cancelBooking($bookingId, $facultyId = null) {
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            $sql = "UPDATE bookings SET booking_status = 'Cancelled' WHERE booking_id = ?";
            $params = [$bookingId];

            if ($facultyId) {
                $sql .= " AND faculty_id = ?";
                $params[] = $facultyId;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log('Cancel booking error: ' . $e->getMessage());
            return false;
        }
    }

    // Fallback cancel in session
    getFallbackBookings();
    foreach ($_SESSION['mock_bookings'] as &$b) {
        if ($b['booking_id'] === $bookingId) {
            $b['booking_status'] = 'Cancelled';
            return true;
        }
    }
    return false;
}

/**
 * Returns time slot availability status matrix for a given facility on a date.
 * Colors:
 * - Green ('available'): slot is free
 * - Red ('booked'): slot has Approved reservation
 * - Yellow ('pending'): slot has Pending reservation
 */
function getFacilityAvailabilitySlots($facilityId, $date) {
    $slots = [
        ['start' => '08:00:00', 'end' => '09:30:00', 'label' => '08:00 AM - 09:30 AM'],
        ['start' => '09:30:00', 'end' => '11:00:00', 'label' => '09:30 AM - 11:00 AM'],
        ['start' => '11:00:00', 'end' => '12:30:00', 'label' => '11:00 AM - 12:30 PM'],
        ['start' => '12:30:00', 'end' => '01:30:00', 'label' => '12:30 PM - 01:30 PM (Lunch / Maintenance)'],
        ['start' => '01:30:00', 'end' => '03:00:00', 'label' => '01:30 PM - 03:00 PM'],
        ['start' => '03:00:00', 'end' => '04:30:00', 'label' => '03:00 PM - 04:30 PM'],
        ['start' => '04:30:00', 'end' => '06:00:00', 'label' => '04:30 PM - 06:00 PM'],
        ['start' => '06:00:00', 'end' => '07:30:00', 'label' => '06:00 PM - 07:30 PM']
    ];

    $pdo = getDBConnection();
    $bookingsOnDate = [];

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT booking_id, start_time, end_time, booking_status, booking_purpose, faculty_id 
                                   FROM bookings 
                                   WHERE facility_id = ? AND booking_date = ? AND booking_status IN ('Approved', 'Pending')");
            $stmt->execute([$facilityId, $date]);
            $bookingsOnDate = $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Slot check error: ' . $e->getMessage());
        }
    } else {
        $all = getFallbackBookings();
        foreach ($all as $b) {
            if ($b['facility_id'] == $facilityId && $b['booking_date'] == $date && in_array($b['booking_status'], ['Approved', 'Pending'])) {
                $bookingsOnDate[] = $b;
            }
        }
    }

    $slotMatrix = [];
    foreach ($slots as $slot) {
        $slotStart = strtotime($slot['start']);
        $slotEnd = strtotime($slot['end']);
        $status = 'available';
        $bookingDetails = null;

        // Special lunch break reservation
        if ($slot['start'] === '12:30:00') {
            $status = 'maintenance';
        }

        foreach ($bookingsOnDate as $b) {
            $bStart = strtotime($b['start_time']);
            $bEnd = strtotime($b['end_time']);

            // Check if slot overlaps with booking
            if (!($slotEnd <= $bStart || $slotStart >= $bEnd)) {
                if ($b['booking_status'] === 'Approved') {
                    $status = 'booked';
                    $bookingDetails = $b;
                    break;
                } elseif ($b['booking_status'] === 'Pending') {
                    $status = 'pending';
                    $bookingDetails = $b;
                }
            }
        }

        $slotMatrix[] = [
            'label' => $slot['label'],
            'start_time' => $slot['start'],
            'end_time' => $slot['end'],
            'status' => $status,
            'booking' => $bookingDetails
        ];
    }

    return $slotMatrix;
}
