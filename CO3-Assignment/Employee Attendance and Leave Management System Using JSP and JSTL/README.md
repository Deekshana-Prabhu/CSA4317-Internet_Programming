# EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM
> **Enterprise IT Web Application built with Java Servlets, JSP, JSTL, JDBC, and MySQL.**
> **Optimized & Compact Project Structure: 39 Files Total (Well below the 79-file limit).**

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Project File Structure (39 Essential Files)](#2-project-file-structure-39-essential-files)
3. [Optimization Summary](#3-optimization-summary)
4. [Key Features & Preserved Functionality](#4-key-features--preserved-functionality)
5. [Test Credentials](#5-test-credentials)
6. [Database Setup (MySQL)](#6-database-setup-mysql)
7. [Deployment & Running in Eclipse / Tomcat](#7-deployment--running-in-eclipse--tomcat)
8. [JSTL Core Tags, Session & Cookie Architecture](#8-jstl-core-tags-session--cookie-architecture)

---

## 1. Project Overview
The **Employee Attendance and Leave Management System** is a full-featured Java web application designed for an enterprise IT company. It streamlines daily attendance logging, employee leave applications, real-time approval status tracking, and centralized HR administration.

Built following the standard **MVC (Model-View-Controller)** pattern:
- **Model**: Java Beans (`Employee`, `Attendance`, `LeaveApplication`, `Admin`) & Data Access Objects (`EmployeeDAO`, `AttendanceDAO`, `LeaveDAO`, `AdminDAO`).
- **View**: Dynamic JSP pages utilizing **JSTL Core Tags** (`<c:forEach>`, `<c:if>`, `<c:choose>`, `<c:when>`, `<c:otherwise>`) with modern responsive CSS.
- **Controller**: Java Servlets managing routing, input validation, authentication, and session control.
- **Persistence**: MySQL Database connected via standard JDBC (`PreparedStatement`, `ResultSet`, `Connection`).

---

## 2. Project File Structure (39 Essential Files)

The project has been reorganized and optimized into a clean, compact Java Web Application structure containing **exactly 39 files** (zero duplicates, zero binary bloat, no `.class` files, and no unneeded runtime folders):

```
Employee Attendance and Leave Management System/
│
├── database/
│   └── employee_management.sql              # Database schema & sample seed data (1 file)
│
├── src/
│   ├── DB/
│   │   └── DatabaseConnection.java          # JDBC Driver, Connection & PreparedStatement utilities (1 file)
│   │
│   ├── model/
│   │   ├── Employee.java                    # Employee Entity Bean (1 file)
│   │   ├── Attendance.java                  # Attendance Entity Bean (1 file)
│   │   ├── LeaveApplication.java            # Leave Application Entity Bean (1 file)
│   │   └── Admin.java                       # Administrator Entity Bean (1 file)
│   │
│   ├── dao/
│   │   ├── EmployeeDAO.java                 # SELECT, COUNT, Authentication queries (1 file)
│   │   ├── AttendanceDAO.java               # INSERT, SELECT, Range Filtering, Mark Attendance (1 file)
│   │   ├── LeaveDAO.java                    # INSERT, SELECT, UPDATE status, Balance calculation (1 file)
│   │   └── AdminDAO.java                    # Admin Authentication query (1 file)
│   │
│   └── servlet/
│       ├── EmployeeLoginServlet.java        # Employee login, Session & Remember Me Cookie (1 file)
│       ├── AdminLoginServlet.java           # Admin login & Session management (1 file)
│       ├── EmployeeDashboardServlet.java    # Loads Employee KPIs, metrics & recent records (1 file)
│       ├── AdminDashboardServlet.java       # Loads Admin KPIs, metrics & pending requests (1 file)
│       ├── AttendanceServlet.java           # Attendance logs, date range filter & daily check-in (1 file)
│       ├── LeaveApplicationServlet.java     # Validates & stores leave applications via POST (1 file)
│       ├── LeaveHistoryServlet.java         # Retrieves employee leave history with JSTL (1 file)
│       ├── LeaveApprovalServlet.java        # Admin Approve/Reject decisions (UPDATE MySQL) (1 file)
│       ├── EmployeeDetailsServlet.java      # Loads registered workforce directory for admin (1 file)
│       ├── LeaveRequestsServlet.java        # Displays pending and past leave applications (1 file)
│       └── LogoutServlet.java               # Session invalidation for Employee & Admin (1 file)
│
├── WebContent/
│   ├── index.jsp                            # Welcome portal (EMPLOYEE MANAGEMENT PORTAL) (1 file)
│   ├── employee-login.jsp                   # Employee sign-in form with Remember Me cookie (1 file)
│   ├── admin-login.jsp                      # Administrator sign-in form (1 file)
│   ├── employee-dashboard.jsp               # Employee dashboard with KPI cards & sidebar (1 file)
│   ├── attendance.jsp                       # My Attendance records table with date filter (1 file)
│   ├── apply-leave.jsp                      # Apply Leave form with validations (POST) (1 file)
│   ├── leave-history.jsp                    # Leave History with JSTL status badges (1 file)
│   ├── admin-dashboard.jsp                  # Administrator dashboard with KPI cards & actions (1 file)
│   ├── employee-details.jsp                 # Admin view of registered employees (1 file)
│   ├── leave-requests.jsp                   # Admin review of pending & all leave requests (1 file)
│   ├── admin-attendance.jsp                 # Admin view of company-wide attendance logs (1 file)
│   ├── profile.jsp                          # Employee profile page (1 file)
│   │
│   ├── css/
│   │   └── style.css                        # Unified Modern CSS stylesheet (1 file)
│   │
│   └── WEB-INF/
│       ├── web.xml                          # Servlet mapping & deployment descriptor (1 file)
│       └── lib/
│           ├── jstl-1.2.jar                 # Standard JSTL Core Tag Library (1 file)
│           ├── mysql-connector-j-8.0.33.jar # Official MySQL JDBC Driver (1 file)
│           └── javax.servlet-api-3.0.1.jar  # Java Servlet API library (1 file)
│
└── README.md                                # Comprehensive documentation & manual (1 file)
```

---

## 3. Optimization Summary

| Optimization Action | Details | Files Removed |
| :--- | :--- | :--- |
| **Removed Duplicate Project Folder** | Deleted redundant `EmployeeAttendanceSystem/` sub-tree which cloned the entire project. | -62 files |
| **Purged Compiled Output (`.class`)** | Removed `WEB-INF/classes/` bytecode files; these are generated dynamically upon IDE build. | -20 files |
| **Deduplicated Library Jars** | Eliminated redundant root `lib/` directory while keeping all 3 required JARs in `WebContent/WEB-INF/lib/`. | -3 files |
| **Removed Temporary Server Scripts** | Removed temporary `.bat` server runners and empty directories (`WebContent/js/`). | -2 files |
| **Consolidated CSS & Scripts** | Combined styles into a single unified stylesheet (`WebContent/css/style.css`) and inline JavaScript validation. | 0 bloat |
| **Net Result** | **Reduced from 123 files down to 39 essential files (50% below the 79-file ceiling).** | **-84 files** |

---

## 4. Key Features & Preserved Functionality

### 👤 Employee Capabilities
- **Authentication & Cookies**: Employee sign-in (`EMP101` / `emp123`) with HTTP Cookie for "Remember Me".
- **Employee Dashboard**: Welcome banner, 4 KPI cards (Total Working Days, Present Days, Absent Days, Leave Balance), quick attendance marking, recent attendance logs, and leave status table.
- **My Attendance Page**: Full attendance roster with date-wise filtering (`From Date` to `To Date`).
- **Apply Leave Page**: Validated form (`Leave Type`, `From Date`, `To Date`, `Number of Days`, `Reason`); prevents past dates; end date must be $\ge$ start date; submits via `POST` with initial status `Pending`.
- **Leave History Page**: Historical logs with color-coded status badges via JSTL (`Pending` in amber, `Approved` in green, `Rejected` in red).
- **Profile Page**: Details about employee department, ID, and email.

### 🛡️ Administrator Capabilities
- **Admin Dashboard**: Company overview metrics (Total Employees, Total Attendance Logs, Pending Leave Requests, Approved Requests), recent company-wide check-ins, and 1-click Approve/Reject buttons.
- **Employee Details Page**: Comprehensive directory of registered workforce members with attendance ratios.
- **Attendance Records Page**: Company-wide attendance log with employee and date filtering.
- **Leave Requests Page**: Centralized decision portal for approving or rejecting leave applications in MySQL. Updates reflect immediately on employee history.

---

## 5. Test Credentials

| Role | Username / ID | Password | Access Link | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | `EMP101` | `emp123` | [employee-login.jsp](file:///WebContent/employee-login.jsp) | Software Engineer (John Doe) |
| **Employee** | `EMP102` | `emp123` | [employee-login.jsp](file:///WebContent/employee-login.jsp) | QA Engineer (Jane Smith) |
| **Employee** | `EMP103` | `emp123` | [employee-login.jsp](file:///WebContent/employee-login.jsp) | Cloud DevOps (Robert Brown) |
| **Administrator** | `admin` | `admin123` | [admin-login.jsp](file:///WebContent/admin-login.jsp) | System Administrator |

*(Tip: In the login pages, clicking the sample credentials banner auto-fills the login form!)*

---

## 6. Database Setup (MySQL)

### Database Name: `employee_management`
The database script is located at [database/employee_management.sql](file:///database/employee_management.sql).

### Execution Command:
```bash
mysql -u root -p < database/employee_management.sql
```
*Or open `database/employee_management.sql` in phpMyAdmin / MySQL Workbench and execute.*

### Tables Seeded:
1. `Employees` (employee_id, employee_name, email, department, username, password)
2. `Admins` (admin_id, username, password, full_name, email)
3. `Attendance` (attendance_id, employee_id, attendance_date, check_in, check_out, status)
4. `Leave_Applications` (leave_id, employee_id, leave_type, from_date, to_date, number_of_days, reason, status)

---

## 7. Deployment & Running in Eclipse / Tomcat

1. Open **Eclipse IDE for Enterprise Java and Web Developers**.
2. Click **File -> Import... -> General -> Existing Projects into Workspace**.
3. Select this folder as root directory and click **Finish**.
4. In Eclipse, right-click the project -> **Run As -> Run on Server** (select Apache Tomcat 9.0).
5. Access the application in your browser:
   ```
   http://localhost:8080/EmployeeAttendanceSystem/
   ```
   or
   ```
   http://localhost:8080/
   ```

---

## 8. JSTL Core Tags, Session & Cookie Architecture

### 1. JSTL Dynamic Tags
- **`<c:forEach>`**: Iterates through database records retrieved from MySQL.
- **`<c:if>`**: Renders dynamic notifications and controls direct access.
- **`<c:choose>`, `<c:when>`, `<c:otherwise>`**: Evaluates application status dynamically (`Approved`, `Rejected`, `Pending`).

### 2. Session Management
- Protected pages check for `session.getAttribute("employeeId")` or `session.getAttribute("adminUsername")`.
- Unauthorized requests redirect to `employee-login.jsp?error=unauthorized` or `admin-login.jsp?error=unauthorized`.
- `LogoutServlet` calls `session.invalidate()` to securely purge session state.

### 3. Cookies
- `rememberEmployee` cookie is persisted with 7-day expiration when the employee selects "Remember Me" and is cleared if unchecked.
