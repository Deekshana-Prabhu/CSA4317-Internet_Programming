# Smart Campus Facility Booking System

A modern, responsive, full-stack university facility reservation and space management platform built with **HTML5, CSS3, JavaScript, PHP, and MySQL**. 

Designed for university faculty members to seamlessly explore campus spaces, check live room availability schedules, and submit conflict-free room reservations with an **interactive HTML5 drag-and-drop room allocation dock**.

---

## 🏛️ Key Features

### 1. Executive University Dashboard (`index.php` / `dashboard.php`)
- **Welcome Hero**: "Welcome to Smart Campus - Manage and reserve your campus spaces effortlessly."
- **Live Summary Metrics**:
  - **Total Facilities**: 12 (Across 5 academic blocks)
  - **Available Facilities**: 8 (Ready for immediate booking)
  - **Currently Booked**: 4 (Active academic sessions today)
  - **Pending Requests**: 3 (Awaiting departmental clearance)
- **Recently Requested Facilities Table**: Real-time reservation feed with status indicators and action buttons.
- **Quick Booking Actions**: Instant shortcut to the booking engine.

### 2. Explore 12 Campus Facilities (`facilities.php` & `facility-details.php`)
Includes the 12 campus facilities:
1. **Seminar Hall A** (Ramanujan Block, 180 seats, 4K Laser Projection, Acoustic Cladding)
2. **Seminar Hall B** (Ramanujan Block, 120 seats, Dual Microphones, PA System)
3. **Computer Laboratory** (Turing IT Center, 60 High-Performance Workstations, Gigabit LAN)
4. **AI & ML Laboratory** (Turing IT Center, 45 GPU Workstations, Cloud Compute Cluster)
5. **Conference Room** (Administrative Tower, 35 seats, Polycom 4K Video Bridge)
6. **Auditorium** (Grand Arts Complex, 600 seats, Concert Line-Array Acoustics)
7. **Innovation Hub** (Tech Incubation Block, 50 seats, 3D Prototyping & IoT Lab)
8. **Research Laboratory** (Science Wing, 30 seats, Precision Diagnostic Equipment)
9. **Digital Learning Room** (Central Library Wing, 40 seats, VR & Hybrid Lecture Pods)
10. **Meeting Room** (Administrative Tower, 16 seats, Collaborative Huddle Display)
11. **Executive Boardroom** (Chancellery Block, 24 seats, Ultra-HD Display, Video Bridge)
12. **IoT & Robotics Studio** (Incubation Block, 35 seats, Robotic Arms & Drone Cage)

Each facility card displays:
- High-resolution architectural room graphic
- Facility name, building, and floor location
- Seating capacity badge
- Available technical equipment chips
- Status badges: **Available**, **Booked**, **Under Maintenance**
- **View Details** modal and full page inspection
- **Book Now** direct pre-fill button

### 3. Interactive Drag-and-Drop Room Allocation (`booking.php`)
- **HTML5 Drag-and-Drop API**: Users can drag facility cards from the "Spaces Palette" into the interactive "Allocation Drop Zone".
- **Visual Feedback**: The drop zone highlights with a glowing teal border and animation when hovered over.
- **Auto-Population**: Dropping a card displays the allocated space with capacity indicators and automatically syncs the `<select name="facility_id">` dropdown.
- **Two-Way Sync**: Selecting a facility from the dropdown also reflects back in the allocation preview.
- **Remove / Replace**: Easy one-click removal and replacement of selected spaces.

### 4. Live Room Availability Calendar (`availability.php`)
- Interactive date navigator: Previous Day, Next Day, Today, and HTML5 Date picker.
- Facility filter to check schedules for any of the 12 facilities.
- **Color-Coded Slot Matrix**:
  - 🟢 **Green**: Available Slots (Click to book instantly)
  - 🔴 **Red**: Confirmed Bookings (Displays event purpose, prevents double-booking)
  - 🟡 **Yellow**: Pending Requests (Under departmental review)
  - ⚪ **Gray**: Maintenance & Sanitization intervals
- Prevents clicking or reserving occupied slots.

### 5. Professional Booking Form & Overlapping Prevention (`booking.php`)
- **HTML5 Controls**: Text, Email, Telephone, Date picker, Time picker, Number of participants, Select dropdown, Equipment checkboxes, and Special Requirements textarea.
- **Frontend & Backend Validation**: Mandatory field verification, chronological time check (`end_time > start_time`), future date enforcement, and capacity validation.
- **Overlapping Booking Prevention Engine**: Prepared statement SQL query detects time conflicts:
  ```sql
  SELECT COUNT(*) FROM bookings 
  WHERE facility_id = ? 
    AND booking_date = ? 
    AND booking_status IN ('Approved', 'Pending') 
    AND NOT (end_time <= ? OR start_time >= ?)
  ```
- **Unique Booking ID Generator**: Auto-generates identifiers like `BK-2026-7841`.
- **Booking Confirmation Slip**: Instant confirmation receipt with reference code, printable summary, and direct link to My Bookings.

### 6. Booking Management & History (`my-bookings.php`)
- Categorized status tabs: All, Pending, Approved, Rejected, Cancelled, and Historic Archive.
- **One-Click Cancellation**: Faculty can cancel pending/approved bookings with modal confirmation; updates database status to `Cancelled` and releases the time slot back to the campus pool.
- **Voucher Inspection Modal**: View complete booking voucher with equipment specs and special notes.

---

## 🎨 HTML5 & CSS3 Specifications Demonstrated

### HTML5 Semantic Elements
- `<header>`: Top navigation bar with logo, live date, and notification bell.
- `<nav>`: Sidebar navigation and filter links.
- `<aside>`: Collapsible sidebar container with faculty member profile card.
- `<main>`: Central content area.
- `<section>`: Distinct dashboard sections, summary cards, and allocation areas.
- `<article>`: Facility cards and summary metric widgets.
- `<footer>`: Campus information, contact details, support links, and copyright.
- `<table>`: Responsive tabular schedules and booking logs.
- `<figure>` / `<img>`: High-resolution vector facility images with fallback tags.

### All 3 Types of CSS3 Demonstrated
1. **External CSS** (`css/style.css`): Central theme stylesheet with root variables, typography, layout, cards, animations, and media queries.
2. **Internal CSS** (`<style>` in `includes/header.php`, `dashboard.php`, and `booking.php`): Page-specific keyframe animations (`headerPulseGlow`, `liveShimmer`), glassmorphism highlights, and theme overrides.
3. **Inline CSS** (`style="..."` in `includes/footer.php`, `my-bookings.php`, etc.): Explicit inline styling for percentage progress bars, custom alignment, and badge styles.

---

## 🚀 Installation & Localhost Setup

The application is fully compatible with **WAMP**, **XAMPP**, **LAMP**, and the **PHP Built-in Server**.

### Method A: Setup on WAMP Server (Windows)

1. **Copy Project Folder**:
   Copy the `Smart Campus Facility Booking` folder to your WAMP `www` directory:
   ```text
   C:\wamp64\www\smart-campus-booking
   ```

2. **Start WAMP Server**:
   Ensure the WAMP icon in the system tray turns **Green** (Apache and MySQL services running).

3. **Import Database**:
   - Open your browser and navigate to: `http://localhost/phpmyadmin`
   - Log in (Default user: `root`, password: empty).
   - Create a new database named `smart_campus` with collation `utf8mb4_unicode_ci`.
   - Click on the **Import** tab.
   - Choose the file: `database/smart_campus.sql`.
   - Click **Go** to execute the schema and populate seed data.
   *(Note: `config/database.php` also features automatic database auto-setup if MySQL root access is enabled!)*

4. **Launch Application**:
   Open your browser and visit:
   ```text
   http://localhost/smart-campus-booking/
   ```

---

### Method B: Setup on XAMPP (Windows/Mac/Linux)

1. **Copy Project Folder**:
   Copy the folder to your XAMPP `htdocs` directory:
   ```text
   C:\xampp\htdocs\smart-campus-booking
   ```

2. **Start Apache & MySQL**:
   Open the XAMPP Control Panel and click **Start** next to **Apache** and **MySQL**.

3. **Import Database**:
   - Open `http://localhost/phpmyadmin/`.
   - Import `database/smart_campus.sql` into the `smart_campus` database.

4. **Launch Application**:
   Visit: `http://localhost/smart-campus-booking/`

---

### Method C: Setup on LAMP (Linux)

1. **Copy Files**:
   ```bash
   sudo cp -r "Smart Campus Facility Booking" /var/www/html/smart-campus-booking
   sudo chown -R www-data:www-data /var/www/html/smart-campus-booking
   sudo chmod -R 755 /var/www/html/smart-campus-booking
   ```

2. **Import Database**:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS smart_campus DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p smart_campus < /var/www/html/smart-campus-booking/database/smart_campus.sql
   ```

3. **Access via Browser**:
   ```text
   http://localhost/smart-campus-booking/
   ```

---

### Method D: Quick Testing with PHP Built-in Server

If you have PHP installed on your terminal:
```bash
cd "C:\Users\ASUS\Downloads\Smart Campus Facility Booking"
php -S localhost:8000
```
Then open: `http://localhost:8000/`

*(If MySQL is not currently running, the system will automatically run in high-fidelity Demonstration Mode using the built-in session repository so you can immediately test all UI, calendar, drag-and-drop, and booking features!)*

---

## 🗄️ Database Architecture

The MySQL database contains three relational tables with foreign keys and indexes:

### 1. `faculty` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `faculty_id` | VARCHAR(20) | Primary Key (e.g., `FAC-1042`) |
| `name` | VARCHAR(100) | Full Faculty Name |
| `department` | VARCHAR(100) | Academic Department |
| `email` | VARCHAR(120) | University Email Address |
| `contact_number` | VARCHAR(30) | Phone Number |
| `designation` | VARCHAR(100) | Academic Title |

### 2. `facilities` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `facility_id` | INT AUTO_INCREMENT | Primary Key |
| `facility_code` | VARCHAR(20) | Unique Code (e.g., `FACIL-001`) |
| `facility_name` | VARCHAR(100) | Facility Title |
| `location` | VARCHAR(150) | Full location description |
| `building` | VARCHAR(100) | Campus Block name |
| `floor` | VARCHAR(30) | Floor & Room Number |
| `capacity` | INT | Seating Capacity |
| `equipment` | TEXT | Available Audio/Visual Hardware |
| `description` | TEXT | Architectural Description |
| `operating_hours` | VARCHAR(80) | Operating Schedule |
| `availability_status`| ENUM | `Available`, `Booked`, `Under Maintenance` |
| `image_url` | VARCHAR(255) | Local Vector Asset Path |
| `category` | VARCHAR(60) | Category Classification |

### 3. `bookings` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `booking_id` | VARCHAR(30) | Unique Booking Code (e.g., `BK-2026-1041`) |
| `faculty_id` | VARCHAR(20) | Foreign Key -> `faculty.faculty_id` |
| `facility_id` | INT | Foreign Key -> `facilities.facility_id` |
| `booking_date` | DATE | Date of reservation |
| `start_time` | TIME | Start Time |
| `end_time` | TIME | End Time |
| `participant_count` | INT | Number of Attendees |
| `booking_purpose` | VARCHAR(255) | Event/Meeting Purpose |
| `special_requirements` | TEXT | Special Instructions |
| `equipment_required` | TEXT | Checked Equipment |
| `booking_status` | ENUM | `Approved`, `Pending`, `Rejected`, `Cancelled` |
| `created_at` | TIMESTAMP | Submission Timestamp |

---

## 📁 Project Directory Structure

```text
smart-campus-booking/
├── index.php                 # Application entry point (routes to dashboard)
├── dashboard.php             # Main dashboard with summary metrics & recent requests
├── facilities.php            # Explore facilities with search & multi-filter
├── facility-details.php      # Detailed facility view & daily slot preview
├── availability.php          # Room availability calendar with color-coded slots
├── booking.php               # Booking form with HTML5 drag-and-drop allocation
├── my-bookings.php           # Faculty booking management & cancellation
├── contact.php               # Campus contact directory, booking rules & FAQs
├── config/
│   └── database.php          # PDO database connection, prepared queries & fallback
├── includes/
│   ├── header.php            # Semantic header, top nav bar, internal CSS
│   ├── sidebar.php           # Modern sidebar navigation & faculty profile card
│   └── footer.php            # Semantic footer, inline CSS, modals & scripts
├── css/
│   └── style.css             # External responsive CSS3 stylesheet & animations
├── js/
│   └── script.js             # Drag-and-drop, live search, calendar & validation
├── images/                   # 14 high-resolution offline SVG assets
│   ├── logo.svg              # Smart Campus university insignia
│   ├── avatar-faculty.svg    # Faculty profile avatar
│   └── facility-1.svg ... 12 # 12 custom facility architectural graphics
├── database/
│   └── smart_campus.sql      # MySQL schema and pre-populated seed data
└── README.md                 # Complete project documentation & setup guide
```

---

## 🧪 Testing Checklist

- [x] **Dashboard Metrics**: Accurately shows 12 Total, 8 Available, 4 Booked, 3 Pending.
- [x] **Explore Facilities**: All 12 facilities render with images, badges, and filters.
- [x] **Facility Details**: Displays large graphic, specifications, rules, and operating hours.
- [x] **Drag-and-Drop Allocation**: Smoothly drag cards from palette to drop zone; auto-populates dropdown.
- [x] **Availability Calendar**: Green for available, Red for booked, Yellow for pending; slot clicking works.
- [x] **Form Validation**: Validates required fields, date/time logic, and participants count.
- [x] **Conflict Prevention**: Overlapping booking detection prevents duplicate reservations.
- [x] **Booking Cancellation**: One-click cancellation updates status to `Cancelled` and releases time slot.
- [x] **Responsive Design**: Adapts cleanly across mobile, tablet, and wide desktop screens.
- [x] **Offline Stability**: Built-in SVG vector assets ensure crisp display without external network dependencies.

---

## 👨‍🏫 Faculty Profile (Simulated Authentication)
- **Active Faculty**: Dr. Sarah Jenkins
- **Faculty ID**: `FAC-1042`
- **Department**: Department of Computer Science & Engineering
- **Email**: `s.jenkins@smartcampus.edu`
- **Phone**: `+1 (555) 234-5678`

---
*Smart Campus Facility Booking System &copy; 2026. Built with modern web standards.*
