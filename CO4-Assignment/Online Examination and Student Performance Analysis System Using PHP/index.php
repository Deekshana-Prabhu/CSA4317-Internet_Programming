<?php
/**
 * Online Examination and Student Performance Analysis System
 * Complete Unified Application File: index.php
 * 
 * Features:
 * - Student Login & Session Authentication
 * - Server-side Regular Expression Validation
 * - MySQLi Prepared Statements & Transactions
 * - Real-time Examination Engine with Timer & Question Palette
 * - Automatic Mark Calculation & Grading Rules (40% Pass, A+, A, B, C, D, F)
 * - PHP File Handling: Report Generation inside reports/ (fopen, fwrite, fclose, file_exists)
 * - Cookie Management for User Preferences (setcookie, $_COOKIE)
 * - Visual Student Performance Analytics & Examination History
 * - Seamless Fallback to Browser Demonstration Mode
 * 
 * Technology: PHP 8, MySQLi, HTML5, CSS3, JavaScript
 */

// Start Output Buffering & PHP Session
ob_start();
session_start();

// Include Database Configuration
require_once __DIR__ . '/config.php';

// Ensure reports directory exists
$reports_dir = __DIR__ . '/reports';
if (!file_exists($reports_dir)) {
    @mkdir($reports_dir, 0777, true);
}

// Global Message Containers
$feedback_message = '';
$feedback_type = ''; // 'success', 'danger', 'info'
$active_section = 'dashboard';

// =====================================================================
// ACTION 1: DOWNLOAD REPORT (PHP File Handling: file_exists, readfile)
// =====================================================================
if (isset($_GET['action']) && $_GET['action'] === 'download_report') {
    $req_exam_id = isset($_GET['exam_id']) ? trim($_GET['exam_id']) : '';
    // Regex sanitize examination ID
    if (preg_match('/^[A-Za-z0-9_-]+$/', $req_exam_id)) {
        $report_path = $reports_dir . '/report_' . $req_exam_id . '.txt';
        if (file_exists($report_path)) {
            header('Content-Description: File Transfer');
            header('Content-Type: text/plain; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . basename($report_path) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($report_path));
            readfile($report_path);
            exit;
        } else {
            $feedback_message = "Requested examination report file was not found on the server.";
            $feedback_type = "danger";
        }
    } else {
        $feedback_message = "Invalid examination report identifier format.";
        $feedback_type = "danger";
    }
}

// =====================================================================
// ACTION 2: STUDENT LOGOUT
// =====================================================================
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    header("Location: index.php#login");
    exit;
}

// =====================================================================
// ACTION 3: PREFERENCES MANAGEMENT (PHP Cookies: setcookie, $_COOKIE)
// =====================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_preferences') {
    $pref_subject = isset($_POST['pref_default_subject']) ? trim($_POST['pref_default_subject']) : 'PHP Fundamentals';
    $pref_font = isset($_POST['pref_font_size']) ? trim($_POST['pref_font_size']) : 'standard';
    
    // Cookie valid for 30 days
    setcookie('pref_subject', $pref_subject, time() + (86400 * 30), '/');
    setcookie('pref_font_size', $pref_font, time() + (86400 * 30), '/');
    
    $_COOKIE['pref_subject'] = $pref_subject;
    $_COOKIE['pref_font_size'] = $pref_font;
    
    $feedback_message = "Your portal preferences have been successfully stored in secure cookies.";
    $feedback_type = "success";
    $active_section = 'preferences';
}

if (isset($_GET['action']) && $_GET['action'] === 'clear_preferences') {
    setcookie('pref_subject', '', time() - 3600, '/');
    setcookie('pref_font_size', '', time() - 3600, '/');
    unset($_COOKIE['pref_subject']);
    unset($_COOKIE['pref_font_size']);
    
    $feedback_message = "Preferences cookies cleared successfully.";
    $feedback_type = "info";
    $active_section = 'preferences';
}

// =====================================================================
// ACTION 4: STUDENT LOGIN & REGEX VALIDATION
// =====================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $student_id = isset($_POST['student_id']) ? trim($_POST['student_id']) : '';
    $student_name = isset($_POST['student_name']) ? trim($_POST['student_name']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $remember = isset($_POST['remember_me']) ? true : false;

    // Server-Side Regular Expression Validations
    $errors = array();

    if (empty($student_id)) {
        $errors[] = "Student ID is required.";
    } elseif (!preg_match('/^[A-Za-z0-9_-]{4,20}$/', $student_id)) {
        $errors[] = "Student ID must be 4 to 20 alphanumeric characters (letters, numbers, hyphens).";
    }

    if (empty($student_name)) {
        $errors[] = "Student Full Name is required.";
    } elseif (!preg_match('/^[a-zA-Z\s]{2,50}$/', $student_name)) {
        $errors[] = "Student Name must contain only alphabetical characters and spaces (2 to 50 characters).";
    }

    if (empty($password)) {
        $errors[] = "Password is required.";
    } elseif (strlen($password) < 4) {
        $errors[] = "Password must be at least 4 characters in length.";
    }

    if (empty($errors)) {
        $auth_success = false;
        $student_email = strtolower($student_id) . "@college.edu";

        if ($db_connected) {
            // Prepared Statement to authenticate against MySQL
            $stmt = $conn->prepare("SELECT `student_id`, `student_name`, `email`, `password` FROM `students` WHERE `student_id` = ? LIMIT 1");
            if ($stmt) {
                $stmt->bind_param("s", $student_id);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($row = $result->fetch_assoc()) {
                    // Password verification using password_verify() or demo match
                    if (password_verify($password, $row['password']) || $password === 'demo123') {
                        $auth_success = true;
                        $student_name = $row['student_name'];
                        $student_email = $row['email'];
                    } else {
                        $errors[] = "Authentication failed: Invalid password entered.";
                    }
                } else {
                    // If student ID is not yet in table, insert for demo convenience
                    $hashed_pwd = password_hash($password, PASSWORD_BCRYPT);
                    $ins_stmt = $conn->prepare("INSERT INTO `students` (`student_id`, `student_name`, `email`, `password`) VALUES (?, ?, ?, ?)");
                    if ($ins_stmt) {
                        $ins_stmt->bind_param("ssss", $student_id, $student_name, $student_email, $hashed_pwd);
                        $ins_stmt->execute();
                        $ins_stmt->close();
                        $auth_success = true;
                    }
                }
                $stmt->close();
            }
        } else {
            // Database offline: Allow demo login
            $auth_success = true;
        }

        if ($auth_success) {
            $_SESSION['student_id'] = $student_id;
            $_SESSION['student_name'] = $student_name;
            $_SESSION['email'] = $student_email;

            if ($remember) {
                setcookie('remember_student', $student_id, time() + (86400 * 30), '/');
            }

            $feedback_message = "Authentication successful. Welcome, " . sanitize_output($student_name) . "!";
            $feedback_type = "success";
            $active_section = 'dashboard';
        }
    }

    if (!empty($errors)) {
        $feedback_message = implode("<br>", $errors);
        $feedback_type = "danger";
        $active_section = 'login';
    }
}

// Fallback session student for Demonstration preview
if (!isset($_SESSION['student_id'])) {
    $_SESSION['student_id'] = 'STU2024001';
    $_SESSION['student_name'] = 'John Doe';
    $_SESSION['email'] = 'john.doe@example.com';
}

$current_student_id = $_SESSION['student_id'];
$current_student_name = $_SESSION['student_name'];

// =====================================================================
// ACTION 5: EXAMINATION SUBMISSION & AUTOMATIC MARK CALCULATION
// =====================================================================
$recent_exam_result = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit_examination') {
    if (!is_student_authenticated()) {
        $feedback_message = "Unauthorized: Please log in before submitting examinations.";
        $feedback_type = "danger";
        $active_section = 'login';
    } else {
        $subject = isset($_POST['subject']) ? trim($_POST['subject']) : 'PHP Fundamentals';
        $user_answers = isset($_POST['answers']) && is_array($_POST['answers']) ? $_POST['answers'] : array();
        
        // Allowed subjects
        $allowed_subjects = array('PHP Fundamentals', 'Web Development', 'MySQL & Databases', 'Full Stack Development');
        if (!in_array($subject, $allowed_subjects)) {
            $subject = 'PHP Fundamentals';
        }

        // Fetch Questions for Evaluation
        $eval_questions = array();
        if ($db_connected) {
            $q_query = $conn->query("SELECT `question_id`, `subject`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer` FROM `questions` LIMIT 15");
            if ($q_query && $q_query->num_rows > 0) {
                while ($q_row = $q_query->fetch_assoc()) {
                    $eval_questions[] = $q_row;
                }
            }
        }

        // Fallback question bank if questions table is empty or DB offline
        if (empty($eval_questions)) {
            $eval_questions = array(
                array('question_id' => 1, 'subject' => 'PHP Fundamentals', 'question' => 'Which superglobal array in PHP is used to collect form data sent with method="post"?', 'option_a' => '$_GET', 'option_b' => '$_POST', 'option_c' => '$_REQUEST', 'option_d' => '$_SERVER', 'correct_answer' => 'B'),
                array('question_id' => 2, 'subject' => 'PHP Fundamentals', 'question' => 'How are variables declared in PHP?', 'option_a' => 'var $name;', 'option_b' => '$name = value;', 'option_c' => 'dim $name;', 'option_d' => 'variable name;', 'correct_answer' => 'B'),
                array('question_id' => 3, 'subject' => 'PHP Fundamentals', 'question' => 'Which PHP function is specifically used to open a file for read/write operations?', 'option_a' => 'file_open()', 'option_b' => 'fopen()', 'option_c' => 'open_file()', 'option_d' => 'load_file()', 'correct_answer' => 'B'),
                array('question_id' => 4, 'subject' => 'HTML', 'question' => 'Which HTML5 semantic element represents a container for introductory content or navigation links?', 'option_a' => '<navheader>', 'option_b' => '<top>', 'option_c' => '<header>', 'option_d' => '<intro>', 'correct_answer' => 'C'),
                array('question_id' => 5, 'subject' => 'HTML', 'question' => 'Which attribute specifies that an input field in an HTML form must be completed before submission?', 'option_a' => 'validate', 'option_b' => 'mandatory', 'option_c' => 'required', 'option_d' => 'important', 'correct_answer' => 'C'),
                array('question_id' => 6, 'subject' => 'HTML', 'question' => 'Which HTML tag is used to create an unordered (bulleted) list?', 'option_a' => '<ol>', 'option_b' => '<ul>', 'option_c' => '<li>', 'option_d' => '<list>', 'correct_answer' => 'B'),
                array('question_id' => 7, 'subject' => 'CSS', 'question' => 'Which CSS property defines the font size of an element?', 'option_a' => 'font-style', 'option_b' => 'text-size', 'option_c' => 'font-size', 'option_d' => 'typeface-size', 'correct_answer' => 'C'),
                array('question_id' => 8, 'subject' => 'CSS', 'question' => 'In the CSS Flexible Box layout, which property defines the main axis direction of flex items?', 'option_a' => 'flex-flow', 'option_b' => 'flex-direction', 'option_c' => 'align-items', 'option_d' => 'justify-content', 'correct_answer' => 'B'),
                array('question_id' => 9, 'subject' => 'CSS', 'question' => 'Which CSS property creates spacing outside an element boundary, pushing adjacent elements away?', 'option_a' => 'padding', 'option_b' => 'margin', 'option_c' => 'border-spacing', 'option_d' => 'outline-offset', 'correct_answer' => 'B'),
                array('question_id' => 10, 'subject' => 'JavaScript', 'question' => 'Which keyword declares a block-scoped variable whose value cannot be reassigned?', 'option_a' => 'var', 'option_b' => 'let', 'option_c' => 'const', 'option_d' => 'immutable', 'correct_answer' => 'C'),
                array('question_id' => 11, 'subject' => 'JavaScript', 'question' => 'What is the return value of evaluating `typeof null` in standard JavaScript?', 'option_a' => '"null"', 'option_b' => '"undefined"', 'option_c' => '"object"', 'option_d' => '"boolean"', 'correct_answer' => 'C'),
                array('question_id' => 12, 'subject' => 'JavaScript', 'question' => 'Which modern DOM method attaches an event handler function to a specified element?', 'option_a' => 'element.attach()', 'option_b' => 'element.addEventListener()', 'option_c' => 'element.listen()', 'option_d' => 'element.on()', 'correct_answer' => 'B'),
                array('question_id' => 13, 'subject' => 'MySQL', 'question' => 'Which SQL clause is used to filter records and return only those matching a specific condition?', 'option_a' => 'ORDER BY', 'option_b' => 'GROUP BY', 'option_c' => 'WHERE', 'option_d' => 'HAVING', 'correct_answer' => 'C'),
                array('question_id' => 14, 'subject' => 'MySQL', 'question' => 'Which SQL statement clause arranges the retrieved result set in ascending or descending order?', 'option_a' => 'SORT BY', 'option_b' => 'ORDER BY', 'option_c' => 'ALIGN BY', 'option_d' => 'FILTER BY', 'correct_answer' => 'B'),
                array('question_id' => 15, 'subject' => 'MySQL', 'question' => 'In relational databases, what links a foreign key column to the primary key of another table?', 'option_a' => 'Referential Integrity', 'option_b' => 'Cyclic Index', 'option_c' => 'Data Redundancy', 'option_d' => 'Binary Linkage', 'correct_answer' => 'A')
            );
        }

        // Automatic Mark Calculation Logic
        $total_questions = count($eval_questions);
        $correct_answers = 0;
        $incorrect_answers = 0;
        $unanswered_questions = 0;
        $answer_records = array();

        foreach ($eval_questions as $q) {
            $qid = $q['question_id'];
            $selected = isset($user_answers[$qid]) ? strtoupper(trim($user_answers[$qid])) : '';

            // Validate answer option format
            if (!in_array($selected, array('A', 'B', 'C', 'D', ''))) {
                $selected = '';
            }

            $is_correct = 0;
            if ($selected === '') {
                $unanswered_questions++;
            } elseif ($selected === $q['correct_answer']) {
                $correct_answers++;
                $is_correct = 1;
            } else {
                $incorrect_answers++;
            }

            $answer_records[] = array(
                'question_id' => $qid,
                'question_text' => $q['question'],
                'selected' => $selected,
                'correct' => $q['correct_answer'],
                'is_correct' => $is_correct
            );
        }

        // Calculate marks and percentages
        $total_marks = $correct_answers; // 1 mark per correct answer
        $percentage = round(($total_marks / 15) * 100, 2);
        $pass_benchmark = 40.0;
        $result_status = ($percentage >= $pass_benchmark) ? 'Pass' : 'Fail';

        // Grade Mapping
        if ($percentage >= 90) $grade = 'A+';
        elseif ($percentage >= 80) $grade = 'A';
        elseif ($percentage >= 70) $grade = 'B';
        elseif ($percentage >= 60) $grade = 'C';
        elseif ($percentage >= 40) $grade = 'D';
        else $grade = 'F';

        // Examination ID
        $exam_id = 'EXAM-' . date('Ymd') . '-' . rand(1000, 9999);
        $exam_date = date('Y-m-d H:i:s');

        // Database Insertion using Transactions & Prepared Statements
        if ($db_connected) {
            $conn->begin_transaction();
            try {
                $ins_exam = $conn->prepare("INSERT INTO `examinations` 
                    (`examination_id`, `student_id`, `subject`, `total_questions`, `correct_answers`, `incorrect_answers`, `unanswered_questions`, `total_marks`, `percentage`, `grade`, `result_status`, `examination_date`)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                $ins_exam->bind_param("sssiiiiidsss", 
                    $exam_id, 
                    $current_student_id, 
                    $subject, 
                    $total_questions, 
                    $correct_answers, 
                    $incorrect_answers, 
                    $unanswered_questions, 
                    $total_marks, 
                    $percentage, 
                    $grade, 
                    $result_status, 
                    $exam_date
                );
                $ins_exam->execute();
                $ins_exam->close();

                // Insert Individual Answer Records
                $ins_ans = $conn->prepare("INSERT INTO `answers` (`examination_id`, `question_id`, `selected_answer`, `is_correct`) VALUES (?, ?, ?, ?)");
                foreach ($answer_records as $ar) {
                    $sel_char = empty($ar['selected']) ? null : $ar['selected'];
                    $ins_ans->bind_param("sisi", $exam_id, $ar['question_id'], $sel_char, $ar['is_correct']);
                    $ins_ans->execute();
                }
                $ins_ans->close();

                // Commit Transaction
                $conn->commit();
            } catch (Exception $e) {
                $conn->rollback();
            }
        }

        // =================================================================
        // PHP FILE HANDLING: GENERATE REPORT FILE (fopen, fwrite, fclose)
        // =================================================================
        $report_content = "========================================================================\n";
        $report_content .= "ONLINE EXAMINATION & PERFORMANCE ANALYSIS SYSTEM - OFFICIAL REPORT\n";
        $report_content .= "Apex Institute of Technology | Academic Year 2024-2025\n";
        $report_content .= "========================================================================\n\n";
        $report_content .= "EXAMINATION DETAILS\n";
        $report_content .= "------------------------------------------------------------------------\n";
        $report_content .= "Examination ID     : " . $exam_id . "\n";
        $report_content .= "Examination Date   : " . $exam_date . "\n";
        $report_content .= "Subject            : " . $subject . "\n";
        $report_content .= "Status             : OFFICIAL RECORD (Archived)\n\n";
        $report_content .= "STUDENT CREDENTIALS\n";
        $report_content .= "------------------------------------------------------------------------\n";
        $report_content .= "Student ID         : " . $current_student_id . "\n";
        $report_content .= "Student Name       : " . $current_student_name . "\n";
        $report_content .= "Email              : " . $_SESSION['email'] . "\n\n";
        $report_content .= "PERFORMANCE METRICS & MARKS\n";
        $report_content .= "------------------------------------------------------------------------\n";
        $report_content .= "Total Questions    : " . $total_questions . "\n";
        $report_content .= "Correct Answers    : " . $correct_answers . "\n";
        $report_content .= "Incorrect Answers  : " . $incorrect_answers . "\n";
        $report_content .= "Unanswered         : " . $unanswered_questions . "\n";
        $report_content .= "Total Marks        : " . $total_marks . " / 15\n";
        $report_content .= "Percentage Score   : " . number_format($percentage, 2) . "%\n";
        $report_content .= "Assigned Grade     : " . $grade . "\n";
        $report_content .= "Result Verdict     : " . strtoupper($result_status) . "\n\n";
        $report_content .= "GRADING REFERENCE BENCHMARK\n";
        $report_content .= "------------------------------------------------------------------------\n";
        $report_content .= "90% - 100% : A+ (Distinction)\n";
        $report_content .= "80% - 89%  : A  (Excellent)\n";
        $report_content .= "70% - 79%  : B  (Very Good)\n";
        $report_content .= "60% - 69%  : C  (Good)\n";
        $report_content .= "40% - 59%  : D  (Pass)\n";
        $report_content .= "Below 40%  : F  (Fail)\n";
        $report_content .= "Pass Threshold     : 40.00%\n\n";
        $report_content .= "------------------------------------------------------------------------\n";
        $report_content .= "Generated via PHP File Handling on " . date('Y-m-d H:i:s') . "\n";
        $report_content .= "Digital Verification Hash: " . bin2hex(random_bytes(8)) . "\n";
        $report_content .= "========================================================================\n";

        $report_file_path = $reports_dir . '/report_' . $exam_id . '.txt';
        $fp = @fopen($report_file_path, 'w');
        if ($fp) {
            fwrite($fp, $report_content);
            fclose($fp);
        }

        // Cache result in variable for immediate display
        $recent_exam_result = array(
            'examination_id' => $exam_id,
            'student_id' => $current_student_id,
            'student_name' => $current_student_name,
            'subject' => $subject,
            'total_questions' => $total_questions,
            'correct_answers' => $correct_answers,
            'incorrect_answers' => $incorrect_answers,
            'unanswered_questions' => $unanswered_questions,
            'total_marks' => $total_marks,
            'percentage' => $percentage,
            'grade' => $grade,
            'result_status' => $result_status,
            'examination_date' => $exam_date,
            'report_file' => 'report_' . $exam_id . '.txt'
        );

        $feedback_message = "Examination evaluated successfully! Marks: {$total_marks}/15 ({$percentage}% - Grade {$grade}).";
        $feedback_type = "success";
        $active_section = 'results';
    }
}

// Retrieve Student Examination History from Database
$exam_history = array();
if ($db_connected) {
    $hist_stmt = $conn->prepare("SELECT `examination_id`, `subject`, `total_questions`, `correct_answers`, `incorrect_answers`, `unanswered_questions`, `total_marks`, `percentage`, `grade`, `result_status`, `examination_date` 
        FROM `examinations` WHERE `student_id` = ? ORDER BY `examination_date` DESC");
    if ($hist_stmt) {
        $hist_stmt->bind_param("s", $current_student_id);
        $hist_stmt->execute();
        $hist_res = $hist_stmt->get_result();
        while ($row = $hist_res->fetch_assoc()) {
            $exam_history[] = $row;
        }
        $hist_stmt->close();
    }
}

// If history is empty, populate demo fallback records
if (empty($exam_history)) {
    $exam_history = array(
        array(
            'examination_id' => 'EXAM-20241115-001',
            'subject' => 'Full Stack Development',
            'total_questions' => 15,
            'correct_answers' => 14,
            'incorrect_answers' => 1,
            'unanswered_questions' => 0,
            'total_marks' => 14,
            'percentage' => 93.33,
            'grade' => 'A+',
            'result_status' => 'Pass',
            'examination_date' => '2024-11-15 10:30:00'
        ),
        array(
            'examination_id' => 'EXAM-20241118-002',
            'subject' => 'PHP Fundamentals',
            'total_questions' => 15,
            'correct_answers' => 12,
            'incorrect_answers' => 2,
            'unanswered_questions' => 1,
            'total_marks' => 12,
            'percentage' => 80.00,
            'grade' => 'A',
            'result_status' => 'Pass',
            'examination_date' => '2024-11-18 14:15:00'
        ),
        array(
            'examination_id' => 'EXAM-20241119-003',
            'subject' => 'MySQL & Databases',
            'total_questions' => 15,
            'correct_answers' => 11,
            'incorrect_answers' => 3,
            'unanswered_questions' => 1,
            'total_marks' => 11,
            'percentage' => 73.33,
            'grade' => 'B',
            'result_status' => 'Pass',
            'examination_date' => '2024-11-19 16:45:00'
        )
    );
}

// Compute Performance Analytics
$total_attended = count($exam_history);
$passed_count = 0;
$failed_count = 0;
$total_pct_sum = 0;
$highest_score = 0;
$lowest_score = 15;
$subject_aggregates = array();

foreach ($exam_history as $eh) {
    if (strtolower($eh['result_status']) === 'pass') {
        $passed_count++;
    } else {
        $failed_count++;
    }
    $pct_val = (float)$eh['percentage'];
    $marks_val = (float)$eh['total_marks'];
    $total_pct_sum += $pct_val;

    if ($marks_val > $highest_score) $highest_score = $marks_val;
    if ($marks_val < $lowest_score) $lowest_score = $marks_val;

    $s_name = $eh['subject'];
    if (!isset($subject_aggregates[$s_name])) {
        $subject_aggregates[$s_name] = array('total' => 0, 'count' => 0);
    }
    $subject_aggregates[$s_name]['total'] += $pct_val;
    $subject_aggregates[$s_name]['count']++;
}

$avg_percentage = ($total_attended > 0) ? round($total_pct_sum / $total_attended, 1) : 0.0;
$pass_rate = ($total_attended > 0) ? round(($passed_count / $total_attended) * 100, 0) : 0;

// Read Saved Cookie Preferences
$cookie_subject = isset($_COOKIE['pref_subject']) ? $_COOKIE['pref_subject'] : 'PHP Fundamentals';
$cookie_font = isset($_COOKIE['pref_font_size']) ? $_COOKIE['pref_font_size'] : 'standard';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Examination &amp; Student Performance Analysis System</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        // Signal that PHP Backend environment is active
        window.IS_PHP_BACKEND = <?php echo $db_connected ? 'true' : 'false'; ?>;
    </script>
</head>
<body class="has-banner">

    <!-- Top Mode Status Banner -->
    <div class="demo-mode-banner" id="demoModeBanner">
        <div class="demo-banner-content">
            <span class="demo-badge"><?php echo $db_connected ? 'PHP + MySQL Active' : 'XAMPP Demo Ready'; ?></span>
            <span>
                <?php if ($db_connected): ?>
                    <strong>Live PHP 8 Backend:</strong> Connected to MySQL database <code>online_examination</code>. Sessions, transactions &amp; file reports are active.
                <?php else: ?>
                    <strong>Demonstration &amp; XAMPP Setup:</strong> MySQL connection pending. You can preview all functionality via browser simulation, or import <code>database.sql</code> into phpMyAdmin.
                <?php endif; ?>
            </span>
        </div>
        <button class="demo-banner-close" onclick="document.getElementById('demoModeBanner').style.display='none'; document.body.classList.remove('has-banner');">&times;</button>
    </div>

    <!-- Mobile Sidebar Backdrop -->
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <!-- LEFT SIDEBAR (PRIMARY NAVIGATION) -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="brand-wrapper">
                <div class="brand-logo" title="Apex Institute Portal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                </div>
                <div class="brand-info">
                    <span class="brand-title">EduExam Portal</span>
                    <span class="brand-subtitle">Apex Institute of Tech</span>
                </div>
            </div>
            <button class="sidebar-toggle-btn" id="sidebarToggleBtn" title="Toggle Sidebar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="11 17 6 12 11 7"/>
                    <polyline points="18 17 13 12 18 7"/>
                </svg>
            </button>
        </div>

        <!-- Sidebar Navigation List -->
        <nav class="sidebar-nav">
            <div class="nav-section-label">Main Navigation</div>

            <a href="#dashboard" class="nav-item <?php echo ($active_section === 'dashboard') ? 'active' : ''; ?>" data-target="dashboard">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </span>
                <span class="nav-text">Dashboard</span>
            </a>

            <a href="#login" class="nav-item <?php echo ($active_section === 'login') ? 'active' : ''; ?>" data-target="login">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                </span>
                <span class="nav-text">Student Login</span>
            </a>

            <a href="#examination" class="nav-item <?php echo ($active_section === 'examination') ? 'active' : ''; ?>" data-target="examination">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </span>
                <span class="nav-text">Online Examination</span>
                <span class="nav-badge">15 Q</span>
            </a>

            <a href="#results" class="nav-item <?php echo ($active_section === 'results') ? 'active' : ''; ?>" data-target="results">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </span>
                <span class="nav-text">My Results</span>
            </a>

            <a href="#performance" class="nav-item <?php echo ($active_section === 'performance') ? 'active' : ''; ?>" data-target="performance">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </span>
                <span class="nav-text">Performance Analysis</span>
            </a>

            <a href="#history" class="nav-item <?php echo ($active_section === 'history') ? 'active' : ''; ?>" data-target="history">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                </span>
                <span class="nav-text">Examination History</span>
            </a>

            <div class="nav-section-label" style="margin-top: 14px;">Settings &amp; Session</div>

            <a href="#preferences" class="nav-item <?php echo ($active_section === 'preferences') ? 'active' : ''; ?>" data-target="preferences">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </span>
                <span class="nav-text">Preferences</span>
            </a>

            <a href="index.php?action=logout" class="nav-item" data-target="logout" style="color: var(--danger);">
                <span class="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
                <span class="nav-text">Logout</span>
            </a>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
            <div class="user-avatar" id="sidebarUserAvatar">
                <?php echo strtoupper(substr($current_student_name, 0, 2)); ?>
            </div>
            <div class="user-meta">
                <span class="user-name" id="sidebarUserName"><?php echo sanitize_output($current_student_name); ?></span>
                <span class="user-role" id="sidebarUserRole"><?php echo sanitize_output($current_student_id); ?></span>
            </div>
        </div>
    </aside>

    <!-- MAIN WRAPPER -->
    <div class="main-wrapper">
        <header class="topbar">
            <div class="topbar-left">
                <button class="mobile-menu-btn" id="mobileMenuBtn" title="Open Navigation Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
                <div class="page-breadcrumb">
                    <h2 class="page-title" id="topbarPageTitle">Student Dashboard</h2>
                    <span class="page-subtitle" id="topbarGreeting">Welcome back, <?php echo sanitize_output($current_student_name); ?></span>
                </div>
            </div>

            <div class="topbar-right">
                <div class="status-indicator-pill">
                    <span class="status-dot"></span>
                    <span>System Online</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="navigateToSection('examination')">
                    Start Exam
                </button>
            </div>
        </header>

        <main class="content-area">
            <!-- Server Feedback Alerts -->
            <?php if (!empty($feedback_message)): ?>
                <div class="alert alert-<?php echo $feedback_type; ?>" style="margin-bottom: 24px;">
                    <?php echo $feedback_message; ?>
                </div>
            <?php endif; ?>

            <!-- =======================================================
                 SECTION 1: DASHBOARD
                 ======================================================= -->
            <section class="app-section active-section" id="section-dashboard">
                <div class="dashboard-hero">
                    <div class="hero-text">
                        <h1>Online Examination &amp; Performance Portal</h1>
                        <p>Welcome to the Apex Institute of Technology academic assessment portal. Take your scheduled examinations, receive instant evaluated scorecards, and review subject analytics.</p>
                    </div>
                    <div class="hero-actions">
                        <button class="btn btn-white" onclick="navigateToSection('examination')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Quick Start Examination
                        </button>
                    </div>
                </div>

                <!-- 5 Metric Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon-wrap purple">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Total Attended</span>
                            <span class="stat-value" id="dashTotalExams"><?php echo $total_attended; ?></span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-wrap green">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Exams Passed</span>
                            <span class="stat-value" id="dashPassedExams" style="color: var(--success);"><?php echo $passed_count; ?></span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-wrap red">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Exams Failed</span>
                            <span class="stat-value" id="dashFailedExams" style="color: var(--danger);"><?php echo $failed_count; ?></span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-wrap blue">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Average Percentage</span>
                            <span class="stat-value" id="dashAvgPercentage"><?php echo $avg_percentage; ?>%</span>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon-wrap amber">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div class="stat-info">
                            <span class="stat-label">Highest Score</span>
                            <span class="stat-value" id="dashHighestScore"><?php echo $highest_score; ?> / 15</span>
                        </div>
                    </div>
                </div>

                <!-- Recent Examinations Table Card -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            Recent Examination Results
                        </h3>
                        <button class="btn btn-outline btn-sm" onclick="navigateToSection('history')">
                            View All History →
                        </button>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Subject &amp; Exam ID</th>
                                        <th>Marks Obtained</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="dashRecentTableBody">
                                    <?php if (!empty($exam_history)): ?>
                                        <?php foreach (array_slice($exam_history, 0, 5) as $exam): ?>
                                            <tr>
                                                <td>
                                                    <strong><?php echo sanitize_output($exam['subject']); ?></strong><br>
                                                    <small style="color:var(--text-muted);"><?php echo sanitize_output($exam['examination_id']); ?></small>
                                                </td>
                                                <td><?php echo $exam['total_marks']; ?> / <?php echo $exam['total_questions']; ?></td>
                                                <td><strong><?php echo number_format($exam['percentage'], 1); ?>%</strong></td>
                                                <td><span class="badge badge-grade"><?php echo sanitize_output($exam['grade']); ?></span></td>
                                                <td>
                                                    <span class="badge <?php echo strtolower($exam['result_status']) === 'pass' ? 'badge-pass' : 'badge-fail'; ?>">
                                                        <?php echo sanitize_output($exam['result_status']); ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="btn btn-outline btn-sm" onclick="viewHistoricalResult('<?php echo sanitize_output($exam['examination_id']); ?>')">
                                                        View Result
                                                    </button>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =======================================================
                 SECTION 2: STUDENT LOGIN
                 ======================================================= -->
            <section class="app-section" id="section-login">
                <div class="login-container">
                    <div class="login-header">
                        <div class="login-header-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <h2>Student Login Portal</h2>
                        <p>Authenticate with your student identification details</p>
                    </div>

                    <div id="loginAlert" style="display: none;"></div>

                    <form id="studentLoginForm" method="POST" action="index.php">
                        <input type="hidden" name="action" value="login">

                        <div class="form-group">
                            <label class="form-label" for="loginStudentId">Student ID</label>
                            <input type="text" name="student_id" id="loginStudentId" class="form-control" placeholder="e.g. STU2024001" value="<?php echo sanitize_output($current_student_id); ?>" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="loginStudentName">Student Full Name</label>
                            <input type="text" name="student_name" id="loginStudentName" class="form-control" placeholder="e.g. John Doe" value="<?php echo sanitize_output($current_student_name); ?>" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="loginPassword">Password</label>
                            <input type="password" name="password" id="loginPassword" class="form-control" placeholder="Enter password" value="demo123" required>
                        </div>

                        <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
                            <label class="form-check">
                                <input type="checkbox" name="remember_me" id="loginRememberMe" checked>
                                <span>Remember Me</span>
                            </label>
                            <a href="#login" onclick="showToast('Use demo account below: Password is demo123', 'info')" style="font-size: 0.85rem;">Need Assistance?</a>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                            Authenticate &amp; Enter Portal
                        </button>
                    </form>

                    <div class="demo-credentials-box">
                        <h4>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            Demo Accounts (Password: <code>demo123</code>):
                        </h4>
                        <div class="quick-login-pills">
                            <button type="button" class="btn-pill" onclick="fillDemoLogin('STU2024001', 'John Doe', 'demo123')">Student 1 (John Doe)</button>
                            <button type="button" class="btn-pill" onclick="fillDemoLogin('STU2024002', 'Jane Smith', 'demo123')">Student 2 (Jane Smith)</button>
                            <button type="button" class="btn-pill" onclick="fillDemoLogin('STU2024003', 'Alex Johnson', 'demo123')">Student 3 (Alex Johnson)</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =======================================================
                 SECTION 3: ONLINE EXAMINATION INTERFACE
                 ======================================================= -->
            <section class="app-section" id="section-examination">
                <div class="card" id="examPreStartCard">
                    <div class="card-header">
                        <h3 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                            Examination Session Setup
                        </h3>
                    </div>
                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px;">
                            <div class="stat-card" style="padding: 16px;">
                                <div class="stat-info">
                                    <span class="stat-label">Total Questions</span>
                                    <span class="stat-value">15 MCQs</span>
                                </div>
                            </div>
                            <div class="stat-card" style="padding: 16px;">
                                <div class="stat-info">
                                    <span class="stat-label">Maximum Marks</span>
                                    <span class="stat-value">15 Marks</span>
                                </div>
                            </div>
                            <div class="stat-card" style="padding: 16px;">
                                <div class="stat-info">
                                    <span class="stat-label">Allotted Duration</span>
                                    <span class="stat-value">15 Minutes</span>
                                </div>
                            </div>
                            <div class="stat-card" style="padding: 16px;">
                                <div class="stat-info">
                                    <span class="stat-label">Passing Benchmark</span>
                                    <span class="stat-value" style="color: var(--success);">40.0% (6/15)</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style="max-width: 480px; margin-bottom: 24px;">
                            <label class="form-label" for="examSubjectSelect"><strong>Select Assessment Subject Domain:</strong></label>
                            <select id="examSubjectSelect" class="form-control">
                                <option value="PHP Fundamentals" <?php echo ($cookie_subject === 'PHP Fundamentals') ? 'selected' : ''; ?>>PHP Fundamentals</option>
                                <option value="Web Development" <?php echo ($cookie_subject === 'Web Development') ? 'selected' : ''; ?>>Web Development (HTML, CSS, JS)</option>
                                <option value="MySQL &amp; Databases" <?php echo ($cookie_subject === 'MySQL & Databases') ? 'selected' : ''; ?>>MySQL &amp; Relational Databases</option>
                                <option value="Full Stack Development" <?php echo ($cookie_subject === 'Full Stack Development') ? 'selected' : ''; ?>>Full Stack Development (Comprehensive)</option>
                            </select>
                        </div>

                        <div class="alert alert-info" style="margin-bottom: 24px;">
                            <strong>Examination Instructions:</strong>
                            <ul style="margin-left: 20px; margin-top: 6px;">
                                <li>Each question contains four options (A, B, C, D) with exactly one correct answer.</li>
                                <li>Each correct answer awards <strong>+1 mark</strong>. No negative marking for wrong answers.</li>
                                <li>You may navigate freely between questions using the Question Palette on the right.</li>
                                <li>The timer will automatically submit your responses if it reaches 00:00.</li>
                            </ul>
                        </div>

                        <button class="btn btn-primary" onclick="startNewExamination()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Start Online Examination Now
                        </button>
                    </div>
                </div>

                <div id="examActiveContainer" style="display: none;">
                    <div class="exam-meta-bar">
                        <div class="exam-meta-item">
                            <span class="exam-meta-label">Session ID</span>
                            <span class="exam-meta-val" id="examMetaId">EXAM-XXXX</span>
                        </div>
                        <div class="exam-meta-item">
                            <span class="exam-meta-label">Candidate</span>
                            <span class="exam-meta-val" id="examMetaStudent"><?php echo sanitize_output($current_student_name); ?></span>
                        </div>
                        <div class="exam-meta-item">
                            <span class="exam-meta-label">Subject Domain</span>
                            <span class="exam-meta-val" id="examMetaSubject">PHP Fundamentals</span>
                        </div>
                        <div class="timer-box" id="examTimerBox">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                            <span class="timer-display" id="examTimerDisplay">15:00</span>
                        </div>
                    </div>

                    <div class="exam-layout">
                        <div class="question-card" id="activeQuestionCard">
                            <div class="question-header">
                                <span class="question-number-badge" id="activeQuestionNumBadge">Question 1 of 15</span>
                                <span class="question-subject-badge" id="activeQuestionSubjectBadge">Domain</span>
                            </div>

                            <div class="question-text" id="activeQuestionText">
                                Loading assessment question...
                            </div>

                            <div class="options-list" id="activeQuestionOptions"></div>

                            <div class="question-actions">
                                <button class="btn btn-secondary btn-sm" onclick="clearCurrentAnswer()">
                                    Clear Selection
                                </button>
                                <div style="display: flex; gap: 10px;">
                                    <button class="btn btn-outline" id="examPrevBtn" onclick="prevQuestion()">
                                        ← Previous
                                    </button>
                                    <button class="btn btn-primary" id="examNextBtn" onclick="nextQuestion()">
                                        Next Question →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="exam-palette-sidebar">
                            <h4 class="palette-title">Question Palette (15)</h4>
                            <div class="palette-grid" id="questionPaletteGrid"></div>

                            <div class="palette-legend">
                                <div class="legend-item">
                                    <div class="legend-indicator answered"></div>
                                    <span>Answered</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-indicator current"></div>
                                    <span>Current Question</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-indicator unanswered"></div>
                                    <span>Unanswered</span>
                                </div>
                            </div>

                            <button class="btn btn-danger" style="width: 100%; margin-top: 10px;" onclick="openSubmitModal()">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                Submit Examination
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-overlay" id="submitConfirmModal">
                    <div class="modal-box">
                        <div class="modal-header">
                            <div class="modal-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </div>
                            <h3>Confirm Examination Submission</h3>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to finalize and submit your examination? Once submitted, your answers will be automatically graded and saved to your official academic history.</p>
                            <div class="modal-stats-preview">
                                <div class="modal-stat">
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">Answered Questions</span>
                                    <span class="modal-stat-num" id="modalAnsweredCount" style="color: var(--primary);">0</span>
                                </div>
                                <div class="modal-stat">
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">Unanswered Questions</span>
                                    <span class="modal-stat-num" id="modalUnansweredCount" style="color: var(--danger);">15</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeSubmitModal()">Continue Examination</button>
                            <button class="btn btn-danger" onclick="submitExamination(false)">Yes, Submit Final Answers</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =======================================================
                 SECTION 4: MY RESULTS
                 ======================================================= -->
            <section class="app-section" id="section-results">
                <div class="result-card">
                    <div class="result-card-header">
                        <div class="result-title">
                            <h2>Academic Examination Result Card</h2>
                            <span style="opacity: 0.9; font-size: 0.9rem;">Official Computerized Performance Evaluation</span>
                        </div>
                        <div>
                            <span class="badge badge-pass" id="resStatusBadge" style="font-size: 1rem; padding: 6px 16px;">PASS</span>
                        </div>
                    </div>

                    <div class="result-card-body">
                        <div class="result-hero-metrics">
                            <div class="score-badge-circle">
                                <span class="score-num" id="resMarksScore">14</span>
                                <span class="score-max">OUT OF 15</span>
                            </div>
                            <div class="result-meta-grid">
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Examination ID</span>
                                    <span class="result-meta-val" id="resExamId">EXAM-20241115-001</span>
                                </div>
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Student Name</span>
                                    <span class="result-meta-val" id="resStudentName"><?php echo sanitize_output($current_student_name); ?></span>
                                </div>
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Student ID</span>
                                    <span class="result-meta-val" id="resStudentId"><?php echo sanitize_output($current_student_id); ?></span>
                                </div>
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Subject Domain</span>
                                    <span class="result-meta-val" id="resSubject">Full Stack Development</span>
                                </div>
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Percentage Score</span>
                                    <span class="result-meta-val" id="resPercentage" style="color: var(--primary);">93.3%</span>
                                </div>
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Assigned Grade</span>
                                    <span class="result-meta-val" id="resGradeBadge" style="color: var(--success);">A+</span>
                                </div>
                                <div class="result-meta-cell">
                                    <span class="result-meta-label">Submission Date</span>
                                    <span class="result-meta-val" id="resDate" style="font-size: 0.95rem;">2024-11-15 10:30</span>
                                </div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
                            <div class="stat-card" style="padding: 14px;">
                                <div class="stat-info">
                                    <span class="stat-label">Total Questions</span>
                                    <span class="stat-value" id="resTotalQ">15</span>
                                </div>
                            </div>
                            <div class="stat-card" style="padding: 14px;">
                                <div class="stat-info">
                                    <span class="stat-label">Correct Answers</span>
                                    <span class="stat-value" id="resCorrect" style="color: var(--success);">14</span>
                                </div>
                            </div>
                            <div class="stat-card" style="padding: 14px;">
                                <div class="stat-info">
                                    <span class="stat-label">Incorrect Answers</span>
                                    <span class="stat-value" id="resIncorrect" style="color: var(--danger);">1</span>
                                </div>
                            </div>
                            <div class="stat-card" style="padding: 14px;">
                                <div class="stat-info">
                                    <span class="stat-label">Unanswered</span>
                                    <span class="stat-value" id="resUnanswered" style="color: var(--warning);">0</span>
                                </div>
                            </div>
                        </div>

                        <div class="result-actions-bar">
                            <button class="btn btn-primary" onclick="downloadResultReport()">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download Result Report (.txt)
                            </button>
                            <button class="btn btn-secondary" onclick="printResultReport()">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                Print Official Scorecard
                            </button>
                            <button class="btn btn-outline" onclick="navigateToSection('dashboard')">
                                Back to Dashboard
                            </button>
                        </div>

                        <div style="margin-top: 36px; border-top: 1px solid var(--border-color); padding-top: 24px;">
                            <h3 style="font-size: 1.15rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                Question-by-Question Assessment Review
                            </h3>
                            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">Review submitted selections alongside validated answer explanations.</p>
                            <div class="answer-summary-list" id="resAnswerSummaryContainer"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =======================================================
                 SECTION 5: STUDENT PERFORMANCE ANALYSIS
                 ======================================================= -->
            <section class="app-section" id="section-performance">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-info">
                            <span class="stat-label">Total Examinations</span>
                            <span class="stat-value" id="perfTotalAttended"><?php echo $total_attended; ?></span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <span class="stat-label">Cumulative Average</span>
                            <span class="stat-value" id="perfAvgPercentage" style="color: var(--primary);"><?php echo $avg_percentage; ?>%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <span class="stat-label">Highest Score</span>
                            <span class="stat-value" id="perfHighestScore" style="color: var(--success);"><?php echo $highest_score; ?> / 15</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <span class="stat-label">Lowest Score</span>
                            <span class="stat-value" id="perfLowestScore" style="color: var(--warning);"><?php echo $lowest_score; ?> / 15</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <span class="stat-label">Passed / Failed</span>
                            <span class="stat-value"><span id="perfPassedExams" style="color:var(--success);"><?php echo $passed_count; ?></span> / <span id="perfFailedExams" style="color:var(--danger);"><?php echo $failed_count; ?></span></span>
                        </div>
                    </div>
                </div>

                <div class="performance-overview-grid">
                    <div class="chart-card">
                        <h3 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                            Subject-Wise Performance Distribution
                        </h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Dynamic average percentage across attended subject categories:</p>

                        <div class="bar-chart-container" id="perfSubjectChartContainer">
                            <?php if (!empty($subject_aggregates)): ?>
                                <?php foreach ($subject_aggregates as $s_name => $agg): 
                                    $sub_avg = round($agg['total'] / $agg['count'], 1);
                                    $color_cls = ($sub_avg >= 75) ? 'green' : (($sub_avg >= 50) ? 'blue' : 'amber');
                                ?>
                                    <div class="bar-chart-row">
                                        <div class="bar-label-group">
                                            <span><?php echo sanitize_output($s_name); ?> (<?php echo $agg['count']; ?> exam<?php echo $agg['count'] > 1 ? 's' : ''; ?>)</span>
                                            <span><strong><?php echo $sub_avg; ?>%</strong></span>
                                        </div>
                                        <div class="progress-track">
                                            <div class="progress-fill <?php echo $color_cls; ?>" style="width: <?php echo $sub_avg; ?>%"></div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div class="card" style="margin-bottom: 0;">
                            <div class="card-header">
                                <h4 style="font-size: 0.95rem;">Overall Success Ratio</h4>
                            </div>
                            <div class="card-body">
                                <div class="bar-label-group" style="margin-bottom: 8px;">
                                    <span>Pass Rate Benchmark</span>
                                    <span id="perfPassRateLabel" style="font-weight: 700; color: var(--success);"><?php echo $pass_rate; ?>%</span>
                                </div>
                                <div class="progress-track" style="height: 14px;">
                                    <div class="progress-fill green" id="perfPassRateFill" style="width: <?php echo $pass_rate; ?>%;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="rating-banner">
                            <div class="rating-badge-large" id="perfVerdictBadge">
                                <?php echo ($avg_percentage >= 85) ? 'A+' : (($avg_percentage >= 70) ? 'A' : (($avg_percentage >= 50) ? 'B' : 'C')); ?>
                            </div>
                            <div>
                                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary);">Overall Standing</span>
                                <h4 id="perfVerdictText" style="color: var(--text-primary); font-size: 1.05rem; margin-top: 2px;">
                                    <?php 
                                        if ($avg_percentage >= 85) echo "Outstanding / Distinction Performance";
                                        elseif ($avg_percentage >= 70) echo "Excellent Academic Standing";
                                        elseif ($avg_percentage >= 50) echo "Good Competence - Consistent Progress";
                                        else echo "Needs Structured Practice & Revision";
                                    ?>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =======================================================
                 SECTION 6: EXAMINATION HISTORY
                 ======================================================= -->
            <section class="app-section" id="section-history">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                            Examination Attendance &amp; Result History
                        </h3>
                        <button class="btn btn-primary btn-sm" onclick="navigateToSection('examination')">
                            Take New Exam
                        </button>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Examination ID</th>
                                        <th>Subject Domain</th>
                                        <th>Date &amp; Time</th>
                                        <th>Total Marks</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                        <th>Scorecard</th>
                                    </tr>
                                </thead>
                                <tbody id="historyTableBody">
                                    <?php if (!empty($exam_history)): ?>
                                        <?php foreach ($exam_history as $exam): ?>
                                            <tr>
                                                <td><code><?php echo sanitize_output($exam['examination_id']); ?></code></td>
                                                <td><strong><?php echo sanitize_output($exam['subject']); ?></strong></td>
                                                <td><?php echo sanitize_output($exam['examination_date']); ?></td>
                                                <td><strong><?php echo $exam['total_marks']; ?></strong> / <?php echo $exam['total_questions']; ?></td>
                                                <td><strong><?php echo number_format($exam['percentage'], 1); ?>%</strong></td>
                                                <td><span class="badge badge-grade"><?php echo sanitize_output($exam['grade']); ?></span></td>
                                                <td>
                                                    <span class="badge <?php echo strtolower($exam['result_status']) === 'pass' ? 'badge-pass' : 'badge-fail'; ?>">
                                                        <?php echo sanitize_output($exam['result_status']); ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="btn btn-outline btn-sm" onclick="viewHistoricalResult('<?php echo sanitize_output($exam['examination_id']); ?>')">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <!-- =======================================================
                 SECTION 7: PREFERENCES
                 ======================================================= -->
            <section class="app-section" id="section-preferences">
                <div class="card" style="max-width: 680px;">
                    <div class="card-header">
                        <h3 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            Portal &amp; Examination Preferences
                        </h3>
                    </div>
                    <div class="card-body">
                        <form id="preferencesForm" method="POST" action="index.php">
                            <input type="hidden" name="action" value="save_preferences">

                            <div class="form-group">
                                <label class="form-label" for="prefDefaultSubject">Default Examination Subject</label>
                                <select name="pref_default_subject" id="prefDefaultSubject" class="form-control">
                                    <option value="PHP Fundamentals" <?php echo ($cookie_subject === 'PHP Fundamentals') ? 'selected' : ''; ?>>PHP Fundamentals</option>
                                    <option value="Web Development" <?php echo ($cookie_subject === 'Web Development') ? 'selected' : ''; ?>>Web Development</option>
                                    <option value="MySQL &amp; Databases" <?php echo ($cookie_subject === 'MySQL & Databases') ? 'selected' : ''; ?>>MySQL &amp; Databases</option>
                                    <option value="Full Stack Development" <?php echo ($cookie_subject === 'Full Stack Development') ? 'selected' : ''; ?>>Full Stack Development</option>
                                </select>
                                <small style="color: var(--text-muted); display: block; margin-top: 4px;">Stored in PHP Cookies (<code>setcookie</code>). Pre-selected whenever you open the Online Examination.</small>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="prefFontSize">Question Interface Font Scale</label>
                                <select name="pref_font_size" id="prefFontSize" class="form-control">
                                    <option value="standard" <?php echo ($cookie_font === 'standard') ? 'selected' : ''; ?>>Standard (Default)</option>
                                    <option value="medium" <?php echo ($cookie_font === 'medium') ? 'selected' : ''; ?>>Medium (+10%)</option>
                                    <option value="large" <?php echo ($cookie_font === 'large') ? 'selected' : ''; ?>>Large (+20%)</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-check">
                                    <input type="checkbox" id="prefTimerAlert" checked>
                                    <span>Enable visual pulsing alerts when timer drops below 3 minutes</span>
                                </label>
                            </div>

                            <div style="display: flex; gap: 12px; margin-top: 24px;">
                                <button type="submit" class="btn btn-primary">Save Preferences (Cookie)</button>
                                <a href="index.php?action=clear_preferences" class="btn btn-secondary">Clear Preferences</a>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- JavaScript Engine -->
    <script src="script.js"></script>
</body>
</html>
<?php
// Flush output buffer
ob_end_flush();
?>