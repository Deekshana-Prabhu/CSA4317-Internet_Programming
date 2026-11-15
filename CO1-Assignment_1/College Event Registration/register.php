<?php
/**
 * TECHNOVATE 2026 - Registration Processor
 * Handles technical & non-technical event registrations.
 * Generates unique persistent IDs (TEC2026-0001...)
 * Enforces participation dates: 26, 27, or 28 December 2026.
 * Compatible with PHP 7.4+, 8.0+, WAMP, LAMP, XAMPP.
 */

session_start();
require_once __DIR__ . '/db_connect.php';

// Check if request is AJAX
$is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
           || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)
           || (isset($_POST['is_ajax']) && $_POST['is_ajax'] === '1');

// 0. Handle Pass Retrieval (Read-only query to prevent generating new ID)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_pass') {
    $lookup_id = trim(filter_input(INPUT_GET, 'id', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
    header('Content-Type: application/json');
    if (!empty($lookup_id)) {
        $record = get_registration_by_id($lookup_id);
        if ($record) {
            echo json_encode(['status' => 'success', 'data' => $record]);
            exit;
        }
    }
    echo json_encode(['status' => 'error', 'message' => 'Registration pass not found.']);
    exit;
}

// Only allow POST requests for new registrations
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($is_ajax) {
        header('Content-Type: application/json');
        echo json_encode([
            'status'  => 'error',
            'message' => 'Invalid request method. Only POST is accepted.'
        ]);
        exit;
    } else {
        header('Location: index.php');
        exit;
    }
}

// 1. Collect & Sanitize Form Inputs
$student_name       = trim(filter_input(INPUT_POST, 'student_name', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$reg_number         = trim(filter_input(INPUT_POST, 'reg_number', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$email              = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL) ?? '');
$phone              = trim(filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$college_name       = trim(filter_input(INPUT_POST, 'college_name', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$department         = trim(filter_input(INPUT_POST, 'department', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$year_of_study      = trim(filter_input(INPUT_POST, 'year_of_study', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$participation_date = trim(filter_input(INPUT_POST, 'participation_date', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$gender             = trim(filter_input(INPUT_POST, 'gender', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$message            = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$terms              = isset($_POST['terms']) ? true : false;

// Handle array of selected technical & non-technical event categories
$event_categories = [];
if (isset($_POST['events']) && is_array($_POST['events'])) {
    foreach ($_POST['events'] as $evt) {
        $clean_evt = htmlspecialchars(trim($evt), ENT_QUOTES, 'UTF-8');
        if (!empty($clean_evt)) {
            $event_categories[] = $clean_evt;
        }
    }
} elseif (isset($_POST['event_category'])) {
    $event_categories[] = htmlspecialchars(trim($_POST['event_category']), ENT_QUOTES, 'UTF-8');
}

// 2. Comprehensive Validation
$errors = [];

if (empty($student_name) || strlen($student_name) < 2) {
    $errors[] = 'Please provide a valid full student name (minimum 2 characters).';
}

if (empty($reg_number) || strlen($reg_number) < 3) {
    $errors[] = 'Please provide a valid college register / roll number.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}

$clean_phone = preg_replace('/[\s\-+]/', '', $phone);
if (empty($phone) || !preg_match('/^[0-9]{10}$/', $clean_phone)) {
    $errors[] = 'Please provide a valid 10-digit mobile number.';
}

if (empty($college_name)) {
    $errors[] = 'Please enter your institution or college name.';
}

if (empty($department)) {
    $errors[] = 'Please select your department of study.';
}

if (empty($year_of_study)) {
    $errors[] = 'Please select your current year of study.';
}

if (empty($event_categories)) {
    $errors[] = 'Please select at least one event (technical or non-technical) to participate in.';
}

// Enforce symposium date: only 26, 27, or 28 December 2026
$valid_dates = ['2026-12-26', '2026-12-27', '2026-12-28'];
if (empty($participation_date) || !in_array($participation_date, $valid_dates)) {
    $errors[] = 'Participation date must be one of the symposium dates: 26, 27, or 28 December 2026.';
}

if (empty($gender)) {
    $errors[] = 'Please select your gender.';
}

if (!$terms) {
    $errors[] = 'You must agree to the symposium terms, conditions, and code of conduct.';
}

// 3. If validation fails, return errors
if (!empty($errors)) {
    if ($is_ajax) {
        header('Content-Type: application/json');
        echo json_encode([
            'status'  => 'error',
            'message' => implode(' ', $errors),
            'errors'  => $errors
        ]);
        exit;
    } else {
        $_SESSION['flash_error'] = implode('<br>', $errors);
        $_SESSION['form_data']   = $_POST;
        header('Location: index.php#register');
        exit;
    }
}

// 4. Generate Unique Sequential Persistent Registration Identifier (TEC2026-0001...)
$reg_id = generate_next_reg_id();

// 5. Structure Record
$record = [
    'reg_id'             => $reg_id,
    'student_name'       => $student_name,
    'reg_number'         => $reg_number,
    'email'              => $email,
    'phone'              => $clean_phone,
    'college_name'       => $college_name,
    'department'         => $department,
    'year_of_study'      => $year_of_study,
    'event_categories'   => $event_categories,
    'participation_date' => $participation_date,
    'gender'             => $gender,
    'message'            => $message,
    'created_at'         => date('Y-m-d H:i:s')
];

// 6. Save in MySQL and backup JSON storage
$save_result = save_registration_record($record);

// 7. Deliver Response
if ($is_ajax) {
    header('Content-Type: application/json');
    echo json_encode([
        'status'          => 'success',
        'message'         => 'Congratulations! Your registration is confirmed.',
        'registration_id' => $reg_id,
        'data'            => $record,
        'storage'         => [
            'database' => $save_result['saved_in_db'],
            'backup'   => $save_result['saved_in_file']
        ]
    ]);
    exit;
} else {
    $_SESSION['registration_success'] = $record;
    header('Location: index.php?status=success&id=' . urlencode($reg_id) . '#registration-confirmation');
    exit;
}
?>
