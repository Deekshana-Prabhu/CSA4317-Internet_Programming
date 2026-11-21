# Online Examination and Student Performance Analysis System

A modern, responsive, and secure web application engineered with **PHP 8**, **MySQL (MySQLi)**, **HTML5**, **CSS3**, and **JavaScript**.

The system provides a comprehensive computer-based testing portal where students can authenticate, undertake timed examinations, receive instantaneous automated evaluation and grading, download certified result transcripts, and track academic progress through visual performance analytics.

---

## 📋 Table of Contents
1. [Key Features & Highlights](#key-features--highlights)
2. [Technology Stack](#technology-stack)
3. [Project File Structure](#project-file-structure)
4. [Dual Operational Modes](#dual-operational-modes)
5. [Browser Demonstration Mode (Without XAMPP)](#browser-demonstration-mode-without-xampp)
6. [Demo Student Login Credentials](#demo-student-login-credentials)
7. [Full XAMPP & MySQL Setup Guide](#full-xampp--mysql-setup-guide)
8. [Database Architecture & Schema](#database-architecture--schema)
9. [Automated Grading & Assessment Benchmark](#automated-grading--assessment-benchmark)
10. [PHP File Handling & Report Generation](#php-file-handling--report-generation)
11. [Cookie Implementation](#cookie-implementation)
12. [GitHub Guidelines](#github-guidelines)

---

## 🌟 Key Features & Highlights

- **Fixed Vertical Left Sidebar Navigation:**
  - Modern primary navigation with icons, active state glowing pills, and smooth transitions.
  - Collapsible sidebar mode with desktop toggle.
  - Mobile responsive slide-over drawer triggered via hamburger button with blur backdrop.
- **Student Authentication & Session Security:**
  - Robust server-side input validation using PHP Regular Expressions (`preg_match`).
  - Password hashing and verification using `password_hash()` and `password_verify()`.
  - PHP session protection (`$_SESSION`) preventing unauthorized examination attempts.
- **Interactive Examination Engine:**
  - Assessment interface rendering one question at a time.
  - 15 curated multiple-choice questions across 6 core domains: PHP Fundamentals, HTML, CSS, JavaScript, MySQL, and Basic Programming Concepts.
  - Real-time 15-minute countdown timer with automatic submission on expiry.
  - Visual Question Palette (buttons 1–15) tracking Answered, Unanswered, and Current states.
  - Clear Option button and Previous/Next question navigation.
  - Submission confirmation dialog displaying answered vs unanswered counts.
  - Prevention of duplicate examination submissions.
- **Automatic Mark Calculation & Grading:**
  - 1 mark for each correct answer; 0 marks for incorrect or unanswered questions (Max marks = 15).
  - Passing score benchmark: **40.0%**.
  - Automated letter grade classification (A+, A, B, C, D, F).
  - Detailed score card with question-by-question review, explanations, and printable view.
- **Visual Performance Analytics:**
  - Real-time aggregation of Total Examinations, Passed/Failed ratio, Average Percentage, Highest & Lowest scores.
  - Pure CSS-driven subject-wise average distribution bar charts.
  - Dynamic Overall Standing rating verdict.
- **PHP File Handling (`reports/`):**
  - Generates an official plain-text examination report transcript after every submission using `fopen()`, `fwrite()`, `fclose()`, and `file_exists()`.
  - One-click Download Report action.
- **Cookie Preferences:**
  - Saves non-sensitive preferences (preferred examination subject, UI font scale) using `setcookie()` and `$_COOKIE`.
  - Automatically pre-selects the saved subject when launching a new examination session.
- **Clean Print Stylesheet (`@media print`):**
  - Instant print-ready scorecard layout hiding sidebars, navigation, and web banners.

---

## 🛠 Technology Stack

- **HTML5:** Semantic structure, accessible forms, and modular containers.
- **CSS3:** Custom responsive layout, CSS variables, glassmorphism card elevation, animated progress bars, and print stylesheet. No third-party UI frameworks (pure vanilla CSS).
- **JavaScript (ES6):** Client-side timers, DOM manipulation, navigation state, and complete browser demonstration simulation.
- **PHP 8:** Backend request routing, session lifecycle, regex input validation, grading algorithms, and file handling.
- **MySQL / MariaDB:** Relational database storage with foreign key constraints, cascading updates, and indexing.
- **MySQLi Extension:** Prepared statements and database transactions (`begin_transaction`, `commit`, `rollback`).

---

## 📁 Project File Structure

Strictly conforms to the required minimal architectural structure:

```
Online_Examination/
│
├── index.php         # Unified PHP application (Dashboard, Login, Exam Engine, Grading, Analytics, Cookies, Reports)
├── index.html        # Static browser preview interface (for instant demonstration without PHP/XAMPP)
├── config.php        # MySQL database connection configuration using MySQLi
├── style.css         # Complete responsive website stylesheet (Light Blue, Soft Purple, White theme)
├── script.js         # Browser demonstration engine, interactive exam state, and client-side simulation
├── database.sql      # Database schema, table structures, 18 sample questions, and demo student records
├── README.md         # Comprehensive documentation, setup guide, credentials, and architecture
│
└── reports/          # Storage directory for PHP-generated examination text reports
    ├── .gitkeep
    └── report_EXAM-20241115-001.txt
```

---

## 🔄 Dual Operational Modes

This project is architected with dual compatibility:

1. **Browser Demonstration Mode (Without XAMPP):**
   - Ideal for immediate preview and interactive demonstration directly in your web browser.
   - Requires **no local server or database installation**.
   - Uses `localStorage` to simulate student sessions, question evaluation, history, and analytics.
   - Displays a distinct top notification banner indicating demonstration status.
2. **Actual PHP & MySQL Backend Mode (With XAMPP):**
   - Activated automatically when served via an Apache/PHP web server (e.g. XAMPP).
   - Executes server-side session authentication, MySQLi transactions, regular expression validation, database storage, and file handling.

---

## 🚀 Browser Demonstration Mode (Without XAMPP)

To preview the portal immediately without installing XAMPP or PHP:

1. Locate `index.html` inside the project folder.
2. Double-click `index.html` or open it in any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave).
3. The application will launch instantly with complete interactivity:
   - You can log in using any of the pre-configured demo student accounts.
   - Start an assessment, navigate between questions, and test the countdown timer.
   - Submit the exam to view automatic mark calculation and letter grade assignment.
   - Download the generated `.txt` report transcript or trigger the print dialog.
   - Inspect dynamic subject analytics and examination history.

---

## 🔑 Demo Student Login Credentials

The following pre-configured student accounts are documented in `database.sql` and supported in demonstration mode:

| Student ID | Student Full Name | Email Address | Password | Role |
| :--- | :--- | :--- | :--- | :--- |
| **`STU2024001`** | John Doe | `john.doe@example.com` | **`demo123`** | Student (Pre-seeded with history) |
| **`STU2024002`** | Jane Smith | `jane.smith@example.com` | **`demo123`** | Student (Candidate) |
| **`STU2024003`** | Alex Johnson | `alex.j@example.com` | **`demo123`** | Student (Candidate) |

> **Quick Fill:** The Student Login interface includes one-click demo pill buttons to automatically populate these credentials.

---

## 💻 Full XAMPP & MySQL Setup Guide

When ready to run the project with a genuine PHP and MySQL backend:

### Step 1: Install & Launch XAMPP
- Download and install [XAMPP](https://www.apachefriends.org/) (PHP 8.0 or newer recommended).
- Open the **XAMPP Control Panel**.
- Start the **Apache** and **MySQL** services.

### Step 2: Deploy Project Directory
- Copy or move the entire project folder to XAMPP's webroot directory:
  ```
  C:\xampp\htdocs\Online_Examination\
  ```

### Step 3: Import Database Schema & Sample Data
- Open your browser and navigate to **phpMyAdmin**:
  ```
  http://localhost/phpmyadmin/
  ```
- Click on the **Import** tab at the top.
- Click **Choose File** and select `database.sql` from your project folder.
- Click **Go** (or **Import**) at the bottom.
- phpMyAdmin will automatically execute the script, creating the `online_examination` database and populating all 4 tables with sample questions and students.

### Step 4: Verify Database Connection (`config.php`)
The default credentials in `config.php` match standard XAMPP settings:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'online_examination');
```
*(If your MySQL server has a root password, update `DB_PASS` accordingly).*

### Step 5: Run the Application
Open your web browser and navigate to:
```
http://localhost/Online_Examination/index.php
```
You can now log in, take live examinations, store records in MySQL, and generate server reports.

---

## 🗄 Database Architecture & Schema

The database `online_examination` contains four interconnected relational tables:

```
+------------------+         +----------------------+
|     students     |         |      questions       |
+------------------+         +----------------------+
| PK student_id    |<----+   | PK question_id       |<----+
|    student_name  |     |   |    subject           |     |
|    email         |     |   |    question          |     |
|    password      |     |   |    option_a          |     |
|    created_at    |     |   |    option_b          |     |
+------------------+     |   |    option_c          |     |
                         |   |    option_d          |     |
                         |   |    correct_answer    |     |
                         |   +----------------------+     |
                         |                                |
                         |                                |
+------------------------+-----+         +----------------+-----+
|         examinations         |         |       answers        |
+------------------------------+         +----------------------+
| PK examination_id            |<---+    | PK answer_id         |
| FK student_id                |    +----| FK examination_id    |
|    subject                   |         | FK question_id       |
|    total_questions           |         |    selected_answer   |
|    correct_answers           |         |    is_correct        |
|    incorrect_answers         |         +----------------------+
|    unanswered_questions      |
|    total_marks               |
|    percentage                |
|    grade                     |
|    result_status             |
|    examination_date          |
+------------------------------+
```

### Table Details:
1. **`students`**: Stores registered student profiles with hashed passwords (`PASSWORD_BCRYPT`).
2. **`questions`**: Contains the assessment question bank across all subject domains.
3. **`examinations`**: Stores examination session metadata, aggregate marks, percentages, grades, and pass/fail verdicts.
4. **`answers`**: Records student-selected responses linked with foreign keys to both `examinations` and `questions`.

---

## 📊 Automated Grading & Assessment Benchmark

Marks and grades are computed automatically by the engine:

$$\text{Total Marks} = \sum \text{Correct Answers} \quad (\text{Max } 15 \text{ marks})$$

$$\text{Percentage} = \left(\frac{\text{Total Marks}}{15}\right) \times 100$$

### Grading Reference Table:

| Percentage Range | Assigned Grade | Academic Classification | Status |
| :---: | :---: | :---: | :---: |
| **90% – 100%** | **A+** | Outstanding Distinction | **PASS** |
| **80% – 89%** | **A** | Excellent | **PASS** |
| **70% – 79%** | **B** | Very Good | **PASS** |
| **60% – 69%** | **C** | Good | **PASS** |
| **40% – 59%** | **D** | Satisfactory Pass | **PASS** |
| **Below 40%** | **F** | Unsatisfactory | **FAIL** |

- **Passing Threshold:** $\ge 40.0\%$ (A minimum of 6 marks out of 15).

---

## 📄 PHP File Handling & Report Generation

After every submitted examination, the PHP backend creates a text report transcript inside the `reports/` folder:

- **Filename Format:** `report_{EXAMINATION_ID}.txt` (e.g., `report_EXAM-20241115-001.txt`).
- **PHP File Operations Used:**
  - `fopen($path, 'w')`: Safely opens a file pointer for writing.
  - `fwrite($fp, $content)`: Writes formatted student performance transcript data.
  - `fclose($fp)`: Flushes and releases the file handle.
  - `file_exists($path)`: Verifies file existence before streaming downloads via `readfile()`.
- **Security:** Examination IDs are strictly validated using regular expressions (`/^[A-Za-z0-9_-]+$/`) to prevent directory traversal attacks.

---

## 🍪 Cookie Implementation

The application uses PHP cookies (`setcookie` and `$_COOKIE`) for non-sensitive student preferences:

- **`pref_subject`**: Stores the student's preferred default assessment subject (e.g. `PHP Fundamentals`). Automatically selects this subject when opening the examination interface.
- **`pref_font_size`**: Remembers question typography scale (Standard, Medium, Large).
- **Clear Preferences:** Students can clear saved preference cookies anytime via the Preferences interface or via `index.php?action=clear_preferences`.
- *Security Guarantee:* Passwords, session tokens, and examination answers are **never** stored in cookies.

---

## 🐙 GitHub Guidelines

This repository is formatted and structured for direct upload to GitHub:

1. **Repository Contents:**
   - Source code files (`index.php`, `index.html`, `config.php`, `style.css`, `script.js`).
   - Database creation file (`database.sql`).
   - Reports directory placeholder (`reports/.gitkeep`).
   - Documentation (`README.md`).
2. **Exclusions:**
   - No sensitive database passwords or credentials.
   - No `node_modules` or bulky third-party dependencies.
   - No personal student transcripts.
3. **GitHub Pages Notice:**
   - GitHub Pages is a static file host; it will serve `index.html` in demonstration mode.
   - GitHub Pages **cannot execute PHP or connect to MySQL**. To run the genuine PHP backend with database storage, use a local server like XAMPP or a PHP-enabled hosting provider.

---

## 👥 Authors & Academic Attribution
- **Project Title:** Online Examination and Student Performance Analysis System Using PHP and MySQL
- **Academic Program:** Internet Programming (IP) Assignment 4
- **Institution:** Apex Institute of Technology
- **Year:** 2024–2025
