<?php
/**
 * ============================================================================
 * Online Student Admission and Registration Management System
 * Apex Institute of Engineering & Technology (AIET)
 * 
 * Tech Stack: PHP 8, MySQLi, HTML5, CSS3, Minimal Vanilla JavaScript
 * Architecture: Single Index Architecture (All features run through index.php)
 * ============================================================================
 */

// Start PHP Session for Flash Messages and Confirmation Data
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include Database Configuration and Connection
require_once __DIR__ . '/config.php';

// Ensure Reports Directory Exists
$reports_dir = __DIR__ . '/reports';
if (!is_dir($reports_dir)) {
    mkdir($reports_dir, 0777, true);
}

/**
 * ============================================================================
 * 1. REPORT GENERATION HELPER (PHP FILE HANDLING)
 * Uses fopen(), fwrite(), and fclose()
 * ============================================================================
 */
function generate_student_report_file($student) {
    global $reports_dir;
    
    $student_id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $student['student_id']);
    $file_path = $reports_dir . '/' . $student_id . '_report.txt';
    
    $hsc_pct = round(((float)$student['hsc_marks'] / 600) * 100, 2);
    $reg_date = date('d-M-Y h:i A', strtotime($student['registration_date'] ?? 'now'));
    $dob_formatted = date('d-M-Y', strtotime($student['dob']));

    $content = "========================================================================\r\n";
    $content .= "       APEX INSTITUTE OF ENGINEERING & TECHNOLOGY (AIET)               \r\n";
    $content .= "        OFFICIAL STUDENT ADMISSION & REGISTRATION REPORT               \r\n";
    $content .= "========================================================================\r\n";
    $content .= " Generated On  : " . date('d-M-Y h:i:s A') . "\r\n";
    $content .= " Academic Year : 2026 - 2027\r\n";
    $content .= " Status        : CONFIRMED & REGISTERED\r\n";
    $content .= "------------------------------------------------------------------------\r\n";
    $content .= " STUDENT IDENTIFICATION DETAILS:\r\n";
    $content .= "------------------------------------------------------------------------\r\n";
    $content .= sprintf(" %-22s: %s\r\n", "Student ID", $student['student_id']);
    $content .= sprintf(" %-22s: %s\r\n", "Student Full Name", $student['student_name']);
    $content .= sprintf(" %-22s: %s\r\n", "Date of Birth", $dob_formatted);
    $content .= sprintf(" %-22s: %s\r\n", "Email ID", $student['email']);
    $content .= sprintf(" %-22s: %s\r\n", "Mobile Number", $student['mobile']);
    $content .= sprintf(" %-22s: %s\r\n", "Residential Address", str_replace(["\r", "\n"], " ", $student['address']));
    $content .= "------------------------------------------------------------------------\r\n";
    $content .= " ACADEMIC & ALLOTMENT DETAILS:\r\n";
    $content .= "------------------------------------------------------------------------\r\n";
    $content .= sprintf(" %-22s: %d / 600 (%.2f%%)\r\n", "HSC Examination Marks", (int)$student['hsc_marks'], $hsc_pct);
    $content .= sprintf(" %-22s: %s\r\n", "Preferred Department", $student['department']);
    $content .= sprintf(" %-22s: %s\r\n", "Registration Date", $reg_date);
    $content .= "------------------------------------------------------------------------\r\n";
    $content .= " DECLARATION & VERIFICATION:\r\n";
    $content .= " This is a computer-generated confirmation slip for admission to\r\n";
    $content .= " Bachelor of Engineering (B.E. / B.Tech) programme. All candidate details\r\n";
    $content .= " have been verified against submitted credentials.\r\n";
    $content .= "========================================================================\r\n";
    $content .= "                Office of Admissions & Student Affairs                  \r\n";
    $content .= "========================================================================\r\n";

    // Implement actual PHP file handling: fopen(), fwrite(), fclose()
    $handle = @fopen($file_path, "wb");
    if ($handle) {
        fwrite($handle, $content);
        fclose($handle);
        return true;
    }
    return false;
}

// Generate sample reports if database is seeded but reports folder is empty
if (is_dir($reports_dir) && $conn && !$conn->connect_error) {
    $existing_files = glob($reports_dir . '/*_report.txt');
    if (empty($existing_files)) {
        $seed_query = $conn->query("SELECT * FROM students");
        if ($seed_query && $seed_query->num_rows > 0) {
            while ($row = $seed_query->fetch_assoc()) {
                generate_student_report_file($row);
            }
        }
    }
}

/**
 * ============================================================================
 * 2. REPORT DOWNLOAD HANDLER
 * ============================================================================
 */
if (isset($_GET['download']) && !empty($_GET['download'])) {
    $download_id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_GET['download']);
    $file_to_download = $reports_dir . '/' . $download_id . '_report.txt';

    // If report does not exist on disk, attempt to generate it from DB
    if (!file_exists($file_to_download) && $conn && !$conn->connect_error) {
        $stmt = $conn->prepare("SELECT * FROM students WHERE student_id = ? LIMIT 1");
        if ($stmt) {
            $stmt->bind_param("s", $download_id);
            $stmt->execute();
            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                generate_student_report_file($row);
            }
            $stmt->close();
        }
    }

    if (file_exists($file_to_download)) {
        header('Content-Description: File Transfer');
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . basename($file_to_download) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file_to_download));
        readfile($file_to_download);
        exit;
    } else {
        $_SESSION['flash_error'] = "Requested report for Student ID " . clean_output($download_id) . " was not found.";
        header("Location: index.php?tab=reports");
        exit;
    }
}

/**
 * ============================================================================
 * 3. COOKIE PREFERENCES HANDLER
 * ============================================================================
 */
if (isset($_GET['action'])) {
    if ($_GET['action'] === 'set_preference' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $pref_dept = trim($_POST['preferred_department'] ?? '');
        if (in_array($pref_dept, $DEPARTMENTS, true)) {
            // Save cookie for 30 days
            setcookie('preferred_department', $pref_dept, time() + (86400 * 30), "/");
            $_SESSION['flash_success'] = "Preferred department cookie saved as: <strong>" . clean_output($pref_dept) . "</strong>";
        } else {
            $_SESSION['flash_error'] = "Invalid department selection.";
        }
        header("Location: index.php?tab=preferences");
        exit;
    }

    if ($_GET['action'] === 'clear_preference') {
        // Expire cookie
        setcookie('preferred_department', '', time() - 3600, "/");
        unset($_COOKIE['preferred_department']);
        $_SESSION['flash_success'] = "Saved department preference cookie has been cleared.";
        header("Location: index.php?tab=preferences");
        exit;
    }
}

/**
 * ============================================================================
 * 4. UNIQUE STUDENT ID GENERATOR
 * Generates formatted ID: ADM2026 + 4-digit sequence
 * ============================================================================
 */
function get_next_student_id($conn) {
    $prefix = "ADM" . date('Y');
    $default_id = $prefix . "0001";
    
    if (!$conn || $conn->connect_error) {
        return $prefix . rand(1000, 9999);
    }

    $sql = "SELECT student_id FROM students WHERE student_id LIKE '{$prefix}%' ORDER BY id DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $last_id = $row['student_id'];
        $numeric_part = (int)substr($last_id, strlen($prefix));
        $next_num = $numeric_part + 1;
        return $prefix . sprintf("%04d", $next_num);
    }
    
    return $default_id;
}

$generated_student_id = get_next_student_id($conn);

/**
 * ============================================================================
 * 5. STUDENT REGISTRATION FORM PROCESSING & VALIDATION
 * ============================================================================
 */
$errors = [];
$form_data = [
    'student_id'   => $generated_student_id,
    'student_name' => '',
    'dob'          => '',
    'email'        => '',
    'mobile'       => '',
    'address'      => '',
    'hsc_marks'    => '',
    'department'   => $_COOKIE['preferred_department'] ?? ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register_student'])) {
    // Collect & Sanitize Input Values
    $form_data['student_id']   = trim($_POST['student_id'] ?? '');
    $form_data['student_name'] = trim($_POST['student_name'] ?? '');
    $form_data['dob']          = trim($_POST['dob'] ?? '');
    $form_data['email']        = trim($_POST['email'] ?? '');
    $form_data['mobile']       = trim($_POST['mobile'] ?? '');
    $form_data['address']      = trim($_POST['address'] ?? '');
    $form_data['hsc_marks']    = trim($_POST['hsc_marks'] ?? '');
    $form_data['department']   = trim($_POST['department'] ?? '');

    // 1. Validate Student ID
    if (empty($form_data['student_id'])) {
        $errors['student_id'] = "Student ID is required.";
    } elseif (!preg_match("/^[a-zA-Z0-9_\-]+$/", $form_data['student_id'])) {
        $errors['student_id'] = "Student ID contains invalid characters.";
    }

    // 2. Validate Student Name (Letters and spaces only)
    if (empty($form_data['student_name'])) {
        $errors['student_name'] = "Student Name is required.";
    } elseif (!preg_match("/^[a-zA-Z\s]{2,60}$/", $form_data['student_name'])) {
        $errors['student_name'] = "Student Name must contain letters and spaces only (2-60 characters).";
    }

    // 3. Validate Date of Birth
    if (empty($form_data['dob'])) {
        $errors['dob'] = "Date of Birth is required.";
    } else {
        $dob_timestamp = strtotime($form_data['dob']);
        if (!$dob_timestamp) {
            $errors['dob'] = "Invalid Date of Birth format.";
        } else {
            // Check reasonable age: between 15 and 45 years old
            $birth_year = (int)date('Y', $dob_timestamp);
            $curr_year = (int)date('Y');
            $age = $curr_year - $birth_year;
            if ($age < 15 || $age > 45) {
                $errors['dob'] = "Candidate age must be between 15 and 45 years.";
            }
        }
    }

    // 4. Validate Email ID
    if (empty($form_data['email'])) {
        $errors['email'] = "Email ID is required.";
    } elseif (!filter_var($form_data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Please provide a valid email address (e.g., student@example.com).";
    }

    // 5. Validate Mobile Number (Exactly 10 digits)
    if (empty($form_data['mobile'])) {
        $errors['mobile'] = "Mobile Number is required.";
    } elseif (!preg_match("/^[0-9]{10}$/", $form_data['mobile'])) {
        $errors['mobile'] = "Mobile Number must be exactly 10 digits.";
    }

    // 6. Validate Address
    if (empty($form_data['address'])) {
        $errors['address'] = "Residential Address is required.";
    } elseif (strlen($form_data['address']) < 5) {
        $errors['address'] = "Address must be at least 5 characters long.";
    }

    // 7. Validate HSC Marks (Between 0 and 600)
    if ($form_data['hsc_marks'] === '') {
        $errors['hsc_marks'] = "HSC Marks are required.";
    } elseif (!is_numeric($form_data['hsc_marks'])) {
        $errors['hsc_marks'] = "HSC Marks must be a valid number.";
    } else {
        $hsc_val = (int)$form_data['hsc_marks'];
        if ($hsc_val < 0 || $hsc_val > 600) {
            $errors['hsc_marks'] = "HSC Marks must be between 0 and 600.";
        }
    }

    // 8. Validate Preferred Department
    if (empty($form_data['department'])) {
        $errors['department'] = "Please select a preferred engineering department.";
    } elseif (!in_array($form_data['department'], $DEPARTMENTS, true)) {
        $errors['department'] = "Selected department is not valid.";
    }

    // Database Uniqueness Verification (Student ID and Email)
    if (empty($errors)) {
        if (!$conn || $conn->connect_error) {
            $errors['db'] = "Database connection unavailable. Please check MySQL in XAMPP/WAMP.";
        } else {
            // Check duplicate Student ID
            $check_id_stmt = $conn->prepare("SELECT id FROM students WHERE student_id = ? LIMIT 1");
            if ($check_id_stmt) {
                $check_id_stmt->bind_param("s", $form_data['student_id']);
                $check_id_stmt->execute();
                $check_id_stmt->store_result();
                if ($check_id_stmt->num_rows > 0) {
                    $errors['student_id'] = "This Student ID is already registered. Generating a fresh one.";
                    $form_data['student_id'] = get_next_student_id($conn);
                }
                $check_id_stmt->close();
            }

            // Check duplicate Email
            $check_email_stmt = $conn->prepare("SELECT id FROM students WHERE email = ? LIMIT 1");
            if ($check_email_stmt) {
                $check_email_stmt->bind_param("s", $form_data['email']);
                $check_email_stmt->execute();
                $check_email_stmt->store_result();
                if ($check_email_stmt->num_rows > 0) {
                    $errors['email'] = "A student with this Email address is already registered.";
                }
                $check_email_stmt->close();
            }
        }
    }

    // If All Validations Pass, Insert Into Database Using Prepared Statements
    if (empty($errors)) {
        $hsc_int = (int)$form_data['hsc_marks'];
        $insert_sql = "INSERT INTO students (student_id, student_name, dob, email, mobile, address, hsc_marks, department) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $insert_stmt = $conn->prepare($insert_sql);
        if ($insert_stmt) {
            $insert_stmt->bind_param(
                "ssssssis",
                $form_data['student_id'],
                $form_data['student_name'],
                $form_data['dob'],
                $form_data['email'],
                $form_data['mobile'],
                $form_data['address'],
                $hsc_int,
                $form_data['department']
            );

            if ($insert_stmt->execute()) {
                // Save/update department cookie to remember preference
                setcookie('preferred_department', $form_data['department'], time() + (86400 * 30), "/");

                // Prepare data for report generation
                $student_record = [
                    'student_id'        => $form_data['student_id'],
                    'student_name'      => $form_data['student_name'],
                    'dob'               => $form_data['dob'],
                    'email'             => $form_data['email'],
                    'mobile'            => $form_data['mobile'],
                    'address'           => $form_data['address'],
                    'hsc_marks'         => $hsc_int,
                    'department'        => $form_data['department'],
                    'registration_date' => date('Y-m-d H:i:s')
                ];

                // Generate text report file
                generate_student_report_file($student_record);

                // Store in session for confirmation screen
                $_SESSION['confirmation_data'] = $student_record;
                $_SESSION['flash_success'] = "Registration completed successfully! Student ID: " . clean_output($form_data['student_id']);

                $insert_stmt->close();
                header("Location: index.php?tab=confirmation");
                exit;
            } else {
                $errors['db'] = "Failed to insert record: " . $insert_stmt->error;
            }
            $insert_stmt->close();
        } else {
            $errors['db'] = "Database query preparation failed: " . $conn->error;
        }
    }
}

/**
 * ============================================================================
 * 6. ACTIVE TAB DETERMINATION
 * ============================================================================
 */
$allowed_tabs = ['dashboard', 'register', 'records', 'departments', 'reports', 'preferences', 'confirmation'];
$current_tab = $_GET['tab'] ?? 'dashboard';
if (!in_array($current_tab, $allowed_tabs, true)) {
    $current_tab = 'dashboard';
}

/**
 * ============================================================================
 * 7. RETRIEVE DYNAMIC STATISTICS & DASHBOARD DATA FROM MYSQL
 * ============================================================================
 */
$total_students = 0;
$today_registrations = 0;
$avg_hsc_marks = 0;
$dept_counts = [];
$recent_students = [];
$most_preferred_dept = "Computer Science and Engineering";
$max_dept_count = 0;

// Initialize department count array with 0 for all 8 departments
foreach ($DEPARTMENTS as $dept) {
    $dept_counts[$dept] = [
        'count' => 0,
        'avg_marks' => 0,
        'percentage' => 0
    ];
}

if ($conn && !$conn->connect_error) {
    // 1. Total Registered Students
    $res = $conn->query("SELECT COUNT(*) AS total FROM students");
    if ($res) {
        $total_students = (int)($res->fetch_assoc()['total'] ?? 0);
    }

    // 2. Today's Registrations
    $res = $conn->query("SELECT COUNT(*) AS today_total FROM students WHERE DATE(registration_date) = CURDATE()");
    if ($res) {
        $today_registrations = (int)($res->fetch_assoc()['today_total'] ?? 0);
    }

    // 3. Average HSC Marks
    $res = $conn->query("SELECT AVG(hsc_marks) AS avg_marks FROM students");
    if ($res) {
        $avg_val = $res->fetch_assoc()['avg_marks'] ?? 0;
        $avg_hsc_marks = $avg_val ? round((float)$avg_val, 1) : 0;
    }

    // 4. Department-wise distribution
    $res = $conn->query("SELECT department, COUNT(*) AS count, AVG(hsc_marks) AS avg_marks FROM students GROUP BY department");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $d_name = $row['department'];
            $c = (int)$row['count'];
            $a = round((float)$row['avg_marks'], 1);
            $pct = $total_students > 0 ? round(($c / $total_students) * 100, 1) : 0;

            $dept_counts[$d_name] = [
                'count' => $c,
                'avg_marks' => $a,
                'percentage' => $pct
            ];

            if ($c > $max_dept_count) {
                $max_dept_count = $c;
                $most_preferred_dept = $d_name;
            }
        }
    }

    // 5. Recent 5 Student Registrations
    $res = $conn->query("SELECT * FROM students ORDER BY registration_date DESC, id DESC LIMIT 5");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $recent_students[] = $row;
        }
    }
}

/**
 * ============================================================================
 * 8. STUDENT RECORDS QUERY (SEARCH & FILTER)
 * ============================================================================
 */
$records_search = trim($_GET['search'] ?? '');
$records_dept_filter = trim($_GET['filter_dept'] ?? '');
$all_students = [];
$filtered_student_count = 0;

if ($current_tab === 'records' && $conn && !$conn->connect_error) {
    $records_sql = "SELECT * FROM students WHERE 1=1";
    $params = [];
    $types = "";

    if (!empty($records_search)) {
        $records_sql .= " AND (student_id LIKE ? OR student_name LIKE ? OR email LIKE ?)";
        $search_wildcard = "%" . $records_search . "%";
        $params[] = $search_wildcard;
        $params[] = $search_wildcard;
        $params[] = $search_wildcard;
        $types .= "sss";
    }

    if (!empty($records_dept_filter) && in_array($records_dept_filter, $DEPARTMENTS, true)) {
        $records_sql .= " AND department = ?";
        $params[] = $records_dept_filter;
        $types .= "s";
    }

    $records_sql .= " ORDER BY id DESC";

    $stmt = $conn->prepare($records_sql);
    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $records_res = $stmt->get_result();
        while ($row = $records_res->fetch_assoc()) {
            $all_students[] = $row;
        }
        $filtered_student_count = count($all_students);
        $stmt->close();
    }
}

/**
 * ============================================================================
 * 9. REPORTS LISTING
 * ============================================================================
 */
$generated_reports_list = [];
if ($current_tab === 'reports' && is_dir($reports_dir)) {
    $files = scandir($reports_dir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..' && str_ends_with($file, '_report.txt')) {
            $file_full = $reports_dir . '/' . $file;
            $student_id_extracted = str_replace('_report.txt', '', $file);
            $generated_reports_list[] = [
                'file_name'   => $file,
                'student_id'  => $student_id_extracted,
                'size_kb'     => round(filesize($file_full) / 1024, 2),
                'modified'    => date('d-M-Y h:i A', filemtime($file_full))
            ];
        }
    }
    // Sort newest reports first
    usort($generated_reports_list, function($a, $b) {
        return strcmp($b['student_id'], $a['student_id']);
    });
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIET Admissions - Student Admission & Registration Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="app-container">

    <!-- ========================================================
         2. LEFT SIDEBAR (PRIMARY NAVIGATION)
         ======================================================== -->
    <aside class="sidebar" id="primarySidebar">
        <!-- College Logo & Name -->
        <div class="sidebar-header">
            <div class="college-logo-container" title="Apex Institute of Engineering & Technology">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
            </div>
            <div class="college-branding">
                <div class="college-name">APEX INSTITUTE</div>
                <div class="college-tagline">Engineering Admission</div>
            </div>
        </div>

        <!-- Navigation Menu -->
        <ul class="sidebar-menu">
            <li class="sidebar-heading">Navigation</li>
            
            <li class="menu-item <?= $current_tab === 'dashboard' ? 'active' : '' ?>">
                <a href="index.php?tab=dashboard" title="Dashboard">
                    <span class="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                            <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                            <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                            <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                        </svg>
                    </span>
                    <span class="menu-label">Dashboard</span>
                </a>
            </li>

            <li class="menu-item <?= $current_tab === 'register' ? 'active' : '' ?>">
                <a href="index.php?tab=register" title="Student Registration">
                    <span class="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </span>
                    <span class="menu-label">Student Registration</span>
                </a>
            </li>

            <li class="menu-item <?= $current_tab === 'records' ? 'active' : '' ?>">
                <a href="index.php?tab=records" title="Student Records">
                    <span class="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </span>
                    <span class="menu-label">Student Records</span>
                </a>
            </li>

            <li class="menu-item <?= $current_tab === 'departments' ? 'active' : '' ?>">
                <a href="index.php?tab=departments" title="Department Statistics">
                    <span class="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="20" x2="18" y2="10"></line>
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                    </span>
                    <span class="menu-label">Department Statistics</span>
                </a>
            </li>

            <li class="menu-item <?= $current_tab === 'reports' ? 'active' : '' ?>">
                <a href="index.php?tab=reports" title="Registration Reports">
                    <span class="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </span>
                    <span class="menu-label">Registration Reports</span>
                </a>
            </li>

            <li class="sidebar-heading">Settings</li>

            <li class="menu-item <?= $current_tab === 'preferences' ? 'active' : '' ?>">
                <a href="index.php?tab=preferences" title="Preferences">
                    <span class="menu-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </span>
                    <span class="menu-label">Preferences</span>
                </a>
            </li>
        </ul>

        <!-- Sidebar Footer Status -->
        <div class="sidebar-footer">
            <div class="system-status">
                <span class="status-dot"></span>
                <span>Portal Live</span>
            </div>
            <button type="button" class="sidebar-toggle-btn" id="sidebarCollapseBtn" title="Collapse/Expand Sidebar">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
        </div>
    </aside>

    <!-- Mobile Sidebar Backdrop -->
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <!-- ========================================================
         MAIN APPLICATION WRAPPER
         ======================================================== -->
    <main class="main-wrapper" id="mainWrapper">
        
        <!-- Top Header Bar -->
        <header class="top-header">
            <div class="header-left">
                <button type="button" class="mobile-hamburger" id="mobileMenuBtn" aria-label="Toggle Mobile Menu">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div class="page-title-box">
                    <h1>
                        <?php
                            switch ($current_tab) {
                                case 'dashboard':    echo "Admission Dashboard"; break;
                                case 'register':     echo "Student Registration Form"; break;
                                case 'records':      echo "Registered Student Records"; break;
                                case 'departments':  echo "Department-wise Statistics"; break;
                                case 'reports':      echo "Generated Registration Reports"; break;
                                case 'preferences':  echo "Portal Preferences & Cookies"; break;
                                case 'confirmation': echo "Registration Confirmation"; break;
                            }
                        ?>
                    </h1>
                    <p>Apex Institute of Engineering & Technology Admission Portal 2026-27</p>
                </div>
            </div>

            <div class="header-right">
                <div class="header-badge">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span><?= date('l, d M Y') ?></span>
                </div>
                <div class="academic-year-pill">B.E. / B.Tech Admissions</div>
            </div>
        </header>

        <!-- Main Content Area -->
        <div class="content-body">

            <!-- System / Database Connection Alerts -->
            <?php if (!empty($db_error)): ?>
                <div class="alert alert-danger">
                    <div class="alert-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <div class="alert-content">
                        <strong>Database Notice:</strong>
                        <?= clean_output($db_error) ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Session Flash Success Alerts -->
            <?php if (isset($_SESSION['flash_success'])): ?>
                <div class="alert alert-success">
                    <div class="alert-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <div class="alert-content">
                        <?= $_SESSION['flash_success'] ?>
                    </div>
                </div>
                <?php unset($_SESSION['flash_success']); ?>
            <?php endif; ?>

            <!-- Session Flash Error Alerts -->
            <?php if (isset($_SESSION['flash_error'])): ?>
                <div class="alert alert-danger">
                    <div class="alert-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <div class="alert-content">
                        <?= $_SESSION['flash_error'] ?>
                    </div>
                </div>
                <?php unset($_SESSION['flash_error']); ?>
            <?php endif; ?>

            <?php
            // ====================================================================
            // TAB 1: DASHBOARD
            // ====================================================================
            if ($current_tab === 'dashboard'):
            ?>
                <!-- Welcome Banner -->
                <div class="welcome-banner">
                    <div class="welcome-text">
                        <h2>Welcome to Apex Engineering Admission Portal!</h2>
                        <p>Streamlined admission management system for undergraduate engineering programs. Monitor live registrations, department capacities, and student records in real time.</p>
                    </div>
                    <a href="index.php?tab=register" class="welcome-action-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>New Registration</span>
                    </a>
                </div>

                <!-- 4 Key Statistics Cards -->
                <div class="stats-grid">
                    <!-- Total Students -->
                    <div class="stat-card">
                        <div class="stat-icon-wrapper purple">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-label">Total Registered Students</div>
                            <div class="stat-value"><?= number_format($total_students) ?></div>
                            <div class="stat-subtext">Verified admissions</div>
                        </div>
                    </div>

                    <!-- Total Departments -->
                    <div class="stat-card">
                        <div class="stat-icon-wrapper blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-label">Total Departments</div>
                            <div class="stat-value"><?= count($DEPARTMENTS) ?></div>
                            <div class="stat-subtext">Active engineering disciplines</div>
                        </div>
                    </div>

                    <!-- Today's Registrations -->
                    <div class="stat-card">
                        <div class="stat-icon-wrapper green">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-label">Today's Registrations</div>
                            <div class="stat-value"><?= number_format($today_registrations) ?></div>
                            <div class="stat-subtext"><?= date('M d, Y') ?></div>
                        </div>
                    </div>

                    <!-- Average HSC Marks -->
                    <div class="stat-card">
                        <div class="stat-icon-wrapper amber">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <div class="stat-info">
                            <div class="stat-label">Average HSC Marks</div>
                            <div class="stat-value"><?= $avg_hsc_marks > 0 ? $avg_hsc_marks : 'N/A' ?></div>
                            <div class="stat-subtext">
                                <?= $avg_hsc_marks > 0 ? round(($avg_hsc_marks / 600) * 100, 1) . '% Aggregate' : 'Out of 600 marks' ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Split: Department Distribution Chart & Recent Registrations -->
                <div class="dashboard-grid">
                    
                    <!-- Recent Student Registrations Table -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h3>Recent Registrations</h3>
                                <p>Latest applicant submissions received</p>
                            </div>
                            <a href="index.php?tab=records" class="btn btn-outline-purple btn-sm">View All Records</a>
                        </div>
                        <div class="card-body" style="padding: 0;">
                            <?php if (!empty($recent_students)): ?>
                                <div class="table-responsive">
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Student ID</th>
                                                <th>Candidate Name</th>
                                                <th>Preferred Department</th>
                                                <th>HSC Marks</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($recent_students as $student): ?>
                                                <tr>
                                                    <td>
                                                        <span class="student-id-badge"><?= clean_output($student['student_id']) ?></span>
                                                    </td>
                                                    <td style="font-weight: 600; color: var(--text-primary);">
                                                        <?= clean_output($student['student_name']) ?>
                                                    </td>
                                                    <td>
                                                        <span class="dept-badge"><?= clean_output($student['department']) ?></span>
                                                    </td>
                                                    <td>
                                                        <?php
                                                            $score = (int)$student['hsc_marks'];
                                                            $class = ($score >= 500) ? 'marks-high' : (($score >= 400) ? 'marks-mid' : 'marks-low');
                                                        ?>
                                                        <span class="marks-badge <?= $class ?>"><?= $score ?> / 600</span>
                                                    </td>
                                                    <td style="font-size: 12px; color: var(--text-muted);">
                                                        <?= date('d M, H:i', strtotime($student['registration_date'])) ?>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <div class="empty-state">
                                    <div class="empty-state-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    </div>
                                    <h4>No Registrations Recorded Yet</h4>
                                    <p>Start registering candidates to view real-time admission records.</p>
                                    <div style="margin-top: 16px;">
                                        <a href="index.php?tab=register" class="btn btn-primary btn-sm">Register First Student</a>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Department-wise Distribution (CSS Progress Bars) -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title-group">
                                <h3>Department Distribution</h3>
                                <p>Student intake ratio across branches</p>
                            </div>
                            <a href="index.php?tab=departments" class="btn btn-outline-blue btn-sm">Full Stats</a>
                        </div>
                        <div class="card-body">
                            <div class="dept-progress-list">
                                <?php foreach ($DEPARTMENTS as $idx => $d_name): 
                                    $data = $dept_counts[$d_name] ?? ['count' => 0, 'percentage' => 0];
                                    $cnt = $data['count'];
                                    $pct = $data['percentage'];
                                ?>
                                    <div class="dept-progress-item">
                                        <div class="dept-progress-header">
                                            <span class="dept-progress-name"><?= clean_output($d_name) ?></span>
                                            <span class="dept-progress-count"><?= $cnt ?> (<?= $pct ?>%)</span>
                                        </div>
                                        <div class="progress-bar-bg">
                                            <div class="progress-bar-fill <?= $idx % 2 === 1 ? 'blue-bar' : '' ?>" style="width: <?= max(4, $pct) ?>%;"></div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                </div>

            <?php
            // ====================================================================
            // TAB 2: STUDENT REGISTRATION FORM
            // ====================================================================
            elseif ($current_tab === 'register'):
            ?>
                <div class="form-card">
                    <div class="form-header-box">
                        <div>
                            <h2>Candidate Registration Form</h2>
                            <p>Fill in the applicant's official academic and contact information.</p>
                        </div>
                        <span class="academic-year-pill">B.E. / B.Tech 2026</span>
                    </div>

                    <!-- Form Validation Error Banner -->
                    <?php if (!empty($errors)): ?>
                        <div class="alert alert-danger">
                            <div class="alert-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <div class="alert-content">
                                <strong>Please correct the following errors:</strong>
                                <ul class="alert-list">
                                    <?php foreach ($errors as $field_err): ?>
                                        <li><?= clean_output($field_err) ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Form -->
                    <form action="index.php?tab=register" method="POST" autocomplete="off" id="registrationForm">
                        <div class="form-grid">
                            
                            <!-- 1. Student ID (Automatically generated unique ID) -->
                            <div class="form-group">
                                <label class="form-label" for="student_id">
                                    Student ID <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                            <line x1="7" y1="8" x2="17" y2="8"></line>
                                            <line x1="7" y1="12" x2="13" y2="12"></line>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="student_id" 
                                        name="student_id" 
                                        class="form-control" 
                                        value="<?= clean_output($form_data['student_id']) ?>" 
                                        readonly 
                                        title="Auto-generated unique identifier"
                                    >
                                </div>
                                <span class="field-hint">Automatically generated unique admission number.</span>
                            </div>

                            <!-- 2. Student Name -->
                            <div class="form-group">
                                <label class="form-label" for="student_name">
                                    Student Name <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="student_name" 
                                        name="student_name" 
                                        class="form-control <?= isset($errors['student_name']) ? 'is-invalid' : '' ?>" 
                                        placeholder="Enter full legal name (e.g. John Doe)"
                                        value="<?= clean_output($form_data['student_name']) ?>" 
                                        required
                                    >
                                </div>
                                <?php if (isset($errors['student_name'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['student_name']) ?></span>
                                <?php endif; ?>
                            </div>

                            <!-- 3. Date of Birth -->
                            <div class="form-group">
                                <label class="form-label" for="dob">
                                    Date of Birth <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                    </div>
                                    <input 
                                        type="date" 
                                        id="dob" 
                                        name="dob" 
                                        class="form-control <?= isset($errors['dob']) ? 'is-invalid' : '' ?>" 
                                        value="<?= clean_output($form_data['dob']) ?>" 
                                        max="<?= date('Y-m-d', strtotime('-14 years')) ?>"
                                        required
                                    >
                                </div>
                                <?php if (isset($errors['dob'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['dob']) ?></span>
                                <?php endif; ?>
                            </div>

                            <!-- 4. Email ID -->
                            <div class="form-group">
                                <label class="form-label" for="email">
                                    Email ID <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        class="form-control <?= isset($errors['email']) ? 'is-invalid' : '' ?>" 
                                        placeholder="candidate@example.com"
                                        value="<?= clean_output($form_data['email']) ?>" 
                                        required
                                    >
                                </div>
                                <?php if (isset($errors['email'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['email']) ?></span>
                                <?php endif; ?>
                            </div>

                            <!-- 5. Mobile Number -->
                            <div class="form-group">
                                <label class="form-label" for="mobile">
                                    Mobile Number <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </div>
                                    <input 
                                        type="tel" 
                                        id="mobile" 
                                        name="mobile" 
                                        maxlength="10"
                                        class="form-control <?= isset($errors['mobile']) ? 'is-invalid' : '' ?>" 
                                        placeholder="10-digit mobile number"
                                        value="<?= clean_output($form_data['mobile']) ?>" 
                                        required
                                    >
                                </div>
                                <?php if (isset($errors['mobile'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['mobile']) ?></span>
                                <?php else: ?>
                                    <span class="field-hint">Must be exactly 10 digits without country code.</span>
                                <?php endif; ?>
                            </div>

                            <!-- 6. HSC Marks -->
                            <div class="form-group">
                                <label class="form-label" for="hsc_marks">
                                    HSC Marks (0–600) <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                    </div>
                                    <input 
                                        type="number" 
                                        id="hsc_marks" 
                                        name="hsc_marks" 
                                        min="0" 
                                        max="600" 
                                        step="1"
                                        class="form-control <?= isset($errors['hsc_marks']) ? 'is-invalid' : '' ?>" 
                                        placeholder="Total marks scored out of 600"
                                        value="<?= clean_output($form_data['hsc_marks']) ?>" 
                                        required
                                    >
                                </div>
                                <?php if (isset($errors['hsc_marks'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['hsc_marks']) ?></span>
                                <?php endif; ?>
                            </div>

                            <!-- 7. Preferred Department (Dropdown with Cookie Memory) -->
                            <div class="form-group full-width">
                                <label class="form-label" for="department">
                                    Preferred Department <span class="required-star">*</span>
                                </label>
                                <div class="input-wrapper">
                                    <div class="input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                            <polyline points="2 17 12 22 22 17"></polyline>
                                            <polyline points="2 12 12 17 22 12"></polyline>
                                        </svg>
                                    </div>
                                    <select 
                                        id="department" 
                                        name="department" 
                                        class="form-control <?= isset($errors['department']) ? 'is-invalid' : '' ?>" 
                                        required
                                    >
                                        <option value="">-- Choose Engineering Department --</option>
                                        <?php foreach ($DEPARTMENTS as $dept_item): ?>
                                            <option value="<?= clean_output($dept_item) ?>" <?= ($form_data['department'] === $dept_item) ? 'selected' : '' ?>>
                                                <?= clean_output($dept_item) ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <?php if (isset($errors['department'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['department']) ?></span>
                                <?php elseif (!empty($_COOKIE['preferred_department'])): ?>
                                    <span class="field-hint" style="color: var(--primary-purple); font-weight: 500;">
                                        Pre-selected from your saved preference cookie.
                                    </span>
                                <?php endif; ?>
                            </div>

                            <!-- 8. Address -->
                            <div class="form-group full-width">
                                <label class="form-label" for="address">
                                    Residential Address <span class="required-star">*</span>
                                </label>
                                <textarea 
                                    id="address" 
                                    name="address" 
                                    rows="3" 
                                    class="form-control no-icon <?= isset($errors['address']) ? 'is-invalid' : '' ?>" 
                                    placeholder="Enter complete permanent residential address including city and pincode" 
                                    required
                                ><?= clean_output($form_data['address']) ?></textarea>
                                <?php if (isset($errors['address'])): ?>
                                    <span class="field-error-msg"><?= clean_output($errors['address']) ?></span>
                                <?php endif; ?>
                            </div>

                        </div>

                        <!-- Form Action Buttons -->
                        <div class="form-actions">
                            <button type="reset" class="btn btn-secondary" onclick="window.location.href='index.php?tab=register'">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                    <path d="M3 3v5h5"></path>
                                </svg>
                                <span>Reset Form</span>
                            </button>
                            <button type="submit" name="register_student" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                </svg>
                                <span>Submit Admission Application</span>
                            </button>
                        </div>
                    </form>
                </div>

            <?php
            // ====================================================================
            // TAB 3: STUDENT RECORDS
            // ====================================================================
            elseif ($current_tab === 'records'):
            ?>
                <!-- Filter & Search Toolbar -->
                <div class="filter-bar-card">
                    <form action="index.php" method="GET" class="search-input-group">
                        <input type="hidden" name="tab" value="records">
                        
                        <div class="input-wrapper" style="flex: 1;">
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                name="search" 
                                class="form-control" 
                                placeholder="Search by Student ID, Name or Email..." 
                                value="<?= clean_output($records_search) ?>"
                            >
                        </div>

                        <select name="filter_dept" class="form-control no-icon" style="max-width: 250px;">
                            <option value="">All Departments</option>
                            <?php foreach ($DEPARTMENTS as $dept): ?>
                                <option value="<?= clean_output($dept) ?>" <?= ($records_dept_filter === $dept) ? 'selected' : '' ?>>
                                    <?= clean_output($dept) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>

                        <button type="submit" class="btn btn-primary">
                            <span>Search</span>
                        </button>

                        <?php if (!empty($records_search) || !empty($records_dept_filter)): ?>
                            <a href="index.php?tab=records" class="btn btn-secondary">Clear</a>
                        <?php endif; ?>
                    </form>

                    <div style="font-size: 13.5px; font-weight: 600; color: var(--text-secondary);">
                        Total Records: <span style="color: var(--primary-purple);"><?= $filtered_student_count ?></span>
                    </div>
                </div>

                <!-- Student Records Table Card -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3>Registered Candidate Directory</h3>
                            <p>Showing verified student admissions in the system</p>
                        </div>
                        <a href="index.php?tab=register" class="btn btn-primary btn-sm">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>Add Candidate</span>
                        </a>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <?php if (!empty($all_students)): ?>
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student ID</th>
                                            <th>Student Name</th>
                                            <th>Date of Birth</th>
                                            <th>Contact Details</th>
                                            <th>Preferred Department</th>
                                            <th>HSC Marks</th>
                                            <th>Registered On</th>
                                            <th>Report Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($all_students as $idx => $student): ?>
                                            <tr>
                                                <td style="color: var(--text-muted); font-size: 12px;"><?= $idx + 1 ?></td>
                                                <td>
                                                    <span class="student-id-badge"><?= clean_output($student['student_id']) ?></span>
                                                </td>
                                                <td style="font-weight: 600; color: var(--text-primary);">
                                                    <?= clean_output($student['student_name']) ?>
                                                </td>
                                                <td><?= date('d-M-Y', strtotime($student['dob'])) ?></td>
                                                <td>
                                                    <div style="font-size: 13px; color: var(--text-primary);"><?= clean_output($student['email']) ?></div>
                                                    <div style="font-size: 12px; color: var(--text-muted);"><?= clean_output($student['mobile']) ?></div>
                                                </td>
                                                <td>
                                                    <span class="dept-badge"><?= clean_output($student['department']) ?></span>
                                                </td>
                                                <td>
                                                    <?php
                                                        $score = (int)$student['hsc_marks'];
                                                        $class = ($score >= 500) ? 'marks-high' : (($score >= 400) ? 'marks-mid' : 'marks-low');
                                                        $pct = round(($score / 600) * 100, 1);
                                                    ?>
                                                    <span class="marks-badge <?= $class ?>"><?= $score ?>/600 (<?= $pct ?>%)</span>
                                                </td>
                                                <td style="font-size: 12px; color: var(--text-muted);">
                                                    <?= date('d-M-Y h:i A', strtotime($student['registration_date'])) ?>
                                                </td>
                                                <td>
                                                    <a href="index.php?download=<?= urlencode($student['student_id']) ?>" class="btn btn-outline-purple btn-sm" title="Download Text Report">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                            <polyline points="7 10 12 15 17 10"></polyline>
                                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                                        </svg>
                                                        <span>Download</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <h4>No Student Records Found</h4>
                                <p>No admission records match your search criteria. Try a different keyword or filter.</p>
                                <div style="margin-top: 16px;">
                                    <a href="index.php?tab=records" class="btn btn-secondary btn-sm">Clear Filter</a>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

            <?php
            // ====================================================================
            // TAB 4: DEPARTMENT STATISTICS
            // ====================================================================
            elseif ($current_tab === 'departments'):
            ?>
                <!-- Overview Header -->
                <div class="welcome-banner" style="margin-bottom: 24px;">
                    <div class="welcome-text">
                        <h2>Department-wise Registration Analytics</h2>
                        <p>Real-time intake distribution across all 8 accredited undergraduate engineering disciplines. Compare department demand and applicant performance.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.15); padding: 12px 20px; border-radius: var(--border-radius); border: 1px solid rgba(255,255,255,0.25);">
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">Most Preferred Department</div>
                        <div style="font-size: 17px; font-weight: 800;"><?= clean_output($most_preferred_dept) ?></div>
                    </div>
                </div>

                <!-- Department Cards Grid -->
                <div class="dept-stats-grid">
                    <?php foreach ($DEPARTMENTS as $dept_name): 
                        $stat = $dept_counts[$dept_name] ?? ['count' => 0, 'avg_marks' => 0, 'percentage' => 0];
                        $is_top = ($dept_name === $most_preferred_dept && $stat['count'] > 0);
                    ?>
                        <div class="dept-stat-card <?= $is_top ? 'most-preferred' : '' ?>">
                            <?php if ($is_top): ?>
                                <span class="preferred-badge">Top Choice</span>
                            <?php endif; ?>

                            <div>
                                <div class="dept-card-title"><?= clean_output($dept_name) ?></div>
                                <div class="dept-metric-row">
                                    <div class="dept-metric-number"><?= $stat['count'] ?></div>
                                    <div class="dept-metric-pct"><?= $stat['percentage'] ?>% of Admissions</div>
                                </div>

                                <!-- Progress Bar -->
                                <div class="progress-bar-bg" style="margin-bottom: 14px;">
                                    <div class="progress-bar-fill" style="width: <?= max(4, $stat['percentage']) ?>%;"></div>
                                </div>
                            </div>

                            <div style="border-top: 1px solid var(--border-light); padding-top: 12px; display: flex; justify-content: space-between; font-size: 12.5px;">
                                <span style="color: var(--text-muted);">Avg HSC Score:</span>
                                <span style="font-weight: 700; color: var(--text-primary);">
                                    <?= $stat['avg_marks'] > 0 ? $stat['avg_marks'] . ' / 600' : 'No records' ?>
                                </span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

            <?php
            // ====================================================================
            // TAB 5: REGISTRATION REPORTS (PHP FILE HANDLING)
            // ====================================================================
            elseif ($current_tab === 'reports'):
            ?>
                <div class="card">
                    <div class="card-header">
                        <div class="card-title-group">
                            <h3>Generated Student Admission Reports</h3>
                            <p>Official candidate admission confirmation text files stored in <code>/reports</code> directory</p>
                        </div>
                        <div style="font-size: 13px; font-weight: 600; color: var(--primary-purple);">
                            <?= count($generated_reports_list) ?> Total Reports Generated
                        </div>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <?php if (!empty($generated_reports_list)): ?>
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student ID</th>
                                            <th>Report Filename</th>
                                            <th>File Size</th>
                                            <th>Last Generated Date</th>
                                            <th>Download Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($generated_reports_list as $i => $report): ?>
                                            <tr>
                                                <td style="color: var(--text-muted); font-size: 12px;"><?= $i + 1 ?></td>
                                                <td>
                                                    <span class="student-id-badge"><?= clean_output($report['student_id']) ?></span>
                                                </td>
                                                <td style="font-family: monospace; font-size: 13px; color: var(--text-primary);">
                                                    <?= clean_output($report['file_name']) ?>
                                                </td>
                                                <td><?= $report['size_kb'] ?> KB</td>
                                                <td style="font-size: 12.5px; color: var(--text-muted);">
                                                    <?= $report['modified'] ?>
                                                </td>
                                                <td>
                                                    <a href="index.php?download=<?= urlencode($report['student_id']) ?>" class="btn btn-primary btn-sm">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                            <polyline points="7 10 12 15 17 10"></polyline>
                                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                                        </svg>
                                                        <span>Download File</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="empty-state">
                                <div class="empty-state-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                                <h4>No Confirmation Reports Found</h4>
                                <p>Confirmation reports are automatically generated upon successful candidate registrations.</p>
                                <div style="margin-top: 16px;">
                                    <a href="index.php?tab=register" class="btn btn-primary btn-sm">Submit New Registration</a>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

            <?php
            // ====================================================================
            // TAB 6: PREFERENCES (COOKIE HANDLING)
            // ====================================================================
            elseif ($current_tab === 'preferences'):
                $saved_cookie_dept = $_COOKIE['preferred_department'] ?? '';
            ?>
                <div class="pref-container">
                    <div class="pref-box">
                        <div class="form-header-box">
                            <div>
                                <h2>Admission Preferences & Cookie Management</h2>
                                <p>Customize default form behaviors using browser cookies</p>
                            </div>
                            <span class="header-badge">Cookie Status: <?= !empty($saved_cookie_dept) ? 'Active' : 'Not Set' ?></span>
                        </div>

                        <!-- Current Saved Preference View -->
                        <div style="background: #f8fafc; border: 1.5px solid var(--border-color); border-radius: var(--border-radius); padding: 20px; margin-bottom: 24px;">
                            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">
                                Currently Saved Preferred Department
                            </div>
                            <div style="font-size: 18px; font-weight: 700; color: var(--primary-purple);">
                                <?= !empty($saved_cookie_dept) ? clean_output($saved_cookie_dept) : 'None (No preference cookie saved)' ?>
                            </div>
                            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                                When saved, the student registration form will automatically pre-select this engineering stream for rapid entry.
                            </p>
                        </div>

                        <!-- Update Cookie Form -->
                        <form action="index.php?tab=preferences&action=set_preference" method="POST">
                            <div class="form-group" style="margin-bottom: 20px;">
                                <label class="form-label" for="pref_department">Select Department to Remember:</label>
                                <select name="preferred_department" id="pref_department" class="form-control no-icon" required>
                                    <option value="">-- Choose Department --</option>
                                    <?php foreach ($DEPARTMENTS as $d_opt): ?>
                                        <option value="<?= clean_output($d_opt) ?>" <?= ($saved_cookie_dept === $d_opt) ? 'selected' : '' ?>>
                                            <?= clean_output($d_opt) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <button type="submit" class="btn btn-primary">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    </svg>
                                    <span>Save Preference Cookie</span>
                                </button>

                                <?php if (!empty($saved_cookie_dept)): ?>
                                    <a href="index.php?tab=preferences&action=clear_preference" class="btn btn-secondary">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        <span>Clear Preference</span>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </form>

                        <!-- Cookie Notice & Security Callout -->
                        <div class="cookie-notice-banner">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <div>
                                <strong>Privacy & Cookie Implementation Policy:</strong>
                                <p style="margin-top: 3px;">
                                    This portal utilizes HTTP cookies strictly to enhance user convenience by storing the preferred engineering department selection via <code>setcookie()</code>. In compliance with strict institutional security standards, sensitive student personal data (such as names, phone numbers, email addresses, or academic scores) is <strong>never stored</strong> within client-side cookies.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            <?php
            // ====================================================================
            // TAB 7: REGISTRATION CONFIRMATION SCREEN
            // ====================================================================
            elseif ($current_tab === 'confirmation'):
                $confirmed_student = $_SESSION['confirmation_data'] ?? null;
            ?>
                <div class="confirmation-wrapper">
                    <div class="confirmation-card">
                        
                        <div class="success-badge-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <h2 class="confirmation-title">Registration Successful!</h2>
                        <p class="confirmation-subtitle">The candidate's admission application has been registered into the central database.</p>

                        <?php if ($confirmed_student): ?>
                            <div class="confirmation-details-box">
                                <div class="confirm-row">
                                    <span class="confirm-label">Student ID</span>
                                    <span class="confirm-value" style="font-family: monospace; font-size: 15px; color: var(--primary-purple);">
                                        <?= clean_output($confirmed_student['student_id']) ?>
                                    </span>
                                </div>
                                <div class="confirm-row">
                                    <span class="confirm-label">Candidate Name</span>
                                    <span class="confirm-value"><?= clean_output($confirmed_student['student_name']) ?></span>
                                </div>
                                <div class="confirm-row">
                                    <span class="confirm-label">Allocated Department</span>
                                    <span class="confirm-value" style="color: var(--accent-blue);">
                                        <?= clean_output($confirmed_student['department']) ?>
                                    </span>
                                </div>
                                <div class="confirm-row">
                                    <span class="confirm-label">HSC Marks</span>
                                    <span class="confirm-value">
                                        <?= clean_output($confirmed_student['hsc_marks']) ?> / 600 
                                        (<?= round(((int)$confirmed_student['hsc_marks'] / 600) * 100, 2) ?>%)
                                    </span>
                                </div>
                                <div class="confirm-row">
                                    <span class="confirm-label">Registered Contact</span>
                                    <span class="confirm-value"><?= clean_output($confirmed_student['email']) ?> | <?= clean_output($confirmed_student['mobile']) ?></span>
                                </div>
                                <div class="confirm-row">
                                    <span class="confirm-label">Registration Date</span>
                                    <span class="confirm-value"><?= date('d-M-Y h:i A', strtotime($confirmed_student['registration_date'])) ?></span>
                                </div>
                            </div>

                            <div class="confirmation-actions">
                                <!-- Download Confirmation Report Button -->
                                <a href="index.php?download=<?= urlencode($confirmed_student['student_id']) ?>" class="btn btn-primary">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    <span>Download Confirmation Report</span>
                                </a>

                                <!-- Print Confirmation Button -->
                                <button type="button" class="btn btn-secondary" onclick="window.print()">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                        <rect x="6" y="14" width="12" height="8"></rect>
                                    </svg>
                                    <span>Print Confirmation</span>
                                </button>

                                <!-- Register Another Student Button -->
                                <a href="index.php?tab=register" class="btn btn-outline-purple">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    <span>Register Another Student</span>
                                </a>
                            </div>

                        <?php else: ?>
                            <div class="empty-state">
                                <h4>No Active Confirmation Data Found</h4>
                                <p>Please submit a new candidate application from the registration form.</p>
                                <div style="margin-top: 16px;">
                                    <a href="index.php?tab=register" class="btn btn-primary">Go to Registration</a>
                                </div>
                            </div>
                        <?php endif; ?>

                    </div>
                </div>

            <?php endif; ?>

        </div>
    </main>

</div>

<!-- Minimal Vanilla JavaScript for Interactive UI -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const sidebar = document.getElementById('primarySidebar');
        const mainWrapper = document.getElementById('mainWrapper');
        const collapseBtn = document.getElementById('sidebarCollapseBtn');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');

        // Desktop Collapsible Sidebar
        if (collapseBtn) {
            collapseBtn.addEventListener('click', function () {
                sidebar.classList.toggle('collapsed');
                mainWrapper.classList.toggle('sidebar-collapsed');
            });
        }

        // Mobile Hamburger Drawer Toggle
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function () {
                sidebar.classList.toggle('mobile-open');
                sidebarBackdrop.classList.toggle('active');
            });
        }

        // Close mobile drawer on backdrop click
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', function () {
                sidebar.classList.remove('mobile-open');
                sidebarBackdrop.classList.remove('active');
            });
        }
    });
</script>

</body>
</html>
