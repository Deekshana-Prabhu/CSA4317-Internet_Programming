# Online Student Admission and Registration Management System

A complete, attractive, modern, and fully functional engineering college admission portal developed using **PHP 8**, **MySQL / MySQLi**, **HTML5**, **CSS3**, and **minimal vanilla JavaScript**.

The entire web application runs seamlessly through a **single `index.php`** architecture and is specifically designed for effortless execution via **XAMPP** or **WAMP**.

---

## 🎨 Design & Visual Features

- **Color Palette**: Light blue (`#0284c7`, `#e0f2fe`), soft purple (`#7c3aed`, `#ede9fe`), and clean white.
- **Modern Dashboard**: Responsive cards, real-time statistics, CSS progress bar charts, and subtle hover animations.
- **Institutional Branding**: Apex Institute of Engineering & Technology (AIET) logo placeholder and official header.
- **Responsive Layout**: Designed for desktops, laptops, tablets, and smartphones.

---

## 🧭 Left Sidebar Navigation

Fixed, vertical **left sidebar** as the primary navigation featuring:
1. **Dashboard** (`?tab=dashboard`)
2. **Student Registration** (`?tab=register`)
3. **Student Records** (`?tab=records`)
4. **Department Statistics** (`?tab=departments`)
5. **Registration Reports** (`?tab=reports`)
6. **Preferences** (`?tab=preferences`)

### Sidebar Capabilities
- Highlighted active state for the current tab.
- Self-contained SVG icons with hover transitions.
- Desktop collapse/expand toggle button.
- Mobile off-canvas hamburger drawer with dark backdrop.
- Main content properly aligned beside the sidebar without top-nav dependency.

---

## ⚙️ Core Application Modules

### 1. Dashboard
- Personalized welcome banner with quick registration action.
- **Total Registered Students** (live database count).
- **Total Departments** (8 engineering departments).
- **Today's Registrations** (dynamic filter by `CURDATE()`).
- **Average HSC Marks** (aggregate score out of 600).
- **Department Distribution**: Pure CSS progress bar charts showing percentage and headcount.
- **Recent Registrations**: Displays the 5 latest applicants with department badges and score indicators.

### 2. Student Registration Form
- **Student ID**: Automatically generated unique ID (e.g., `ADM20260001`).
- **Student Name**: Validated for letters and spaces (2–60 chars).
- **Date of Birth**: Valid date picker with age restriction (15–45 years).
- **Email ID**: Validated RFC-compliant email address (unique in database).
- **Mobile Number**: Validated for exactly 10 digits.
- **Residential Address**: Multi-line textarea (minimum 5 characters).
- **HSC Marks**: Number input validated between 0 and 600.
- **Preferred Department**: Dropdown with 8 accredited branches:
  - Computer Science and Engineering
  - Artificial Intelligence and Machine Learning
  - Artificial Intelligence and Data Science
  - Information Technology
  - Electronics and Communication Engineering
  - Electrical and Electronics Engineering
  - Mechanical Engineering
  - Civil Engineering
- **Form Usability**: Required-field indicators (`*`), placeholders, sticky values preserved on validation failure, inline error alerts, and reset functionality.

### 3. Server-Side Validation & Security
- Validation performed entirely on server-side using PHP regular expressions and built-in functions.
- Prevents duplicate Student IDs and duplicate email addresses.
- Uses **MySQLi prepared statements** (`prepare()`, `bind_param()`, `execute()`) for all database operations to eliminate SQL injection vulnerabilities.
- Safe output sanitization using `htmlspecialchars()`.

### 4. Student Records
- Responsive data table listing all registered candidates.
- Real-time search by **Student ID**, **Student Name**, or **Email**.
- Department-based dropdown filter.
- Dynamic student count indicator.
- Individual **Download Report** action button for each candidate.
- Informative empty state when no matching records exist.

### 5. Department Statistics
- Real-time admission breakdown across all 8 engineering disciplines.
- Automatic calculation and badging of the **Most Preferred Department** (Top Choice).
- CSS-based visual distribution bars and average HSC marks per department.

### 6. PHP File Handling & Confirmation Reports
- Implements PHP file handling via `fopen()`, `fwrite()`, and `fclose()`.
- Generates official admission confirmation text slips stored in `reports/` (`{STUDENT_ID}_report.txt`).
- Includes a dedicated **Registration Reports** tab to browse, review, and download generated slips.
- Direct download handler via `index.php?download={STUDENT_ID}`.

### 7. Cookie Implementation (Preferences)
- Remembers user's preferred department using `setcookie('preferred_department', ...)`.
- Automatically pre-selects the saved department in the registration form upon reopening.
- Includes a dedicated **Preferences** tab with a **Clear Preference** option (`setcookie(..., time() - 3600)`).
- Strict privacy adherence: **Never stores sensitive personal data in cookies**.

### 8. Registration Confirmation
- Displays an attractive confirmation receipt screen immediately after registration.
- Shows student name, ID, allocated department, score, and contact details.
- Action buttons:
  - **Download Confirmation Report** (text file).
  - **Print Confirmation** (`window.print()`).
  - **Register Another Student**.

---

## 📁 File Structure

Strict adherence to the requested minimum file structure:

```
Student_Admission/
│
├── index.php        # Complete portal: routing, forms, records, stats, cookies, reports
├── config.php       # Database credentials, connection & auto-setup helper
├── style.css        # Responsive styling with light blue & soft purple theme
├── database.sql     # Database schema and 10 realistic seed records
├── README.md        # Comprehensive documentation
│
└── reports/         # Directory containing student confirmation text reports
    ├── ADM20260001_report.txt
    ├── ADM20260002_report.txt
    └── ...
```

---

## 🚀 Execution Guide (XAMPP / WAMP)

### Step 1: Copy Project to Server Root
1. Copy or move this folder into your XAMPP or WAMP web root:
   - **XAMPP**: `C:\xampp\htdocs\Student_Admission\`
   - **WAMP**: `C:\wamp64\www\Student_Admission\`

### Step 2: Start Apache and MySQL
1. Open **XAMPP Control Panel** or **WAMP Server**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

### Step 3: Database Setup (Two Easy Methods)
- **Method A (Automatic)**:
  `config.php` contains an automatic database and table initialization helper. Simply launching the portal will automatically create the `student_admission` database and `students` table if they do not exist!
- **Method B (phpMyAdmin Import)**:
  1. Open your browser and navigate to `http://localhost/phpmyadmin/`.
  2. Click **Import**.
  3. Select `database.sql` and click **Import / Go**.

### Step 4: Access the Application
Open your browser and visit:
```
http://localhost/Student_Admission/
```
Or if running directly from `htdocs`:
```
http://localhost/
```

---

## 🛡️ Technical Compliance
- **PHP Version**: Compatible with PHP 8.0+.
- **Database**: MySQL / MariaDB via MySQLi extension.
- **Frontend**: Clean HTML5, CSS3, minimal vanilla JS (no external JS/CSS dependencies or frameworks).
- **Total Files**: Under 10 core files (well below the 50-file limit).
