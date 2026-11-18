# ONLINE HOSPITAL APPOINTMENT BOOKING AND PATIENT MANAGEMENT SYSTEM

A comprehensive, enterprise-grade Java Dynamic Web Application developed for a multi-speciality hospital. Built with pure **Java Servlets**, **JSP (JavaServer Pages)**, **JSTL (JavaServer Pages Standard Tag Library)**, **JDBC**, **MySQL**, **HttpSession**, and **HTTP Cookies**.

---

## 1. Project Architecture & Technologies

- **Backend**: Java Servlets (Java EE / Jakarta Servlet API)
- **Frontend / Views**: JSP with JSTL Core Tags (`<c:forEach>`, `<c:if>`, `<c:choose>`, `<c:when>`, `<c:out>`)
- **UI Design System**: Light Blue (`#0284c7`), White (`#ffffff`), and Soft Lavender (`#7c3aed`), medical icons, doctor avatar cards, responsive vertical sidebar navigation.
- **Database**: MySQL 8.x (`hospital_db`)
- **Persistence Layer**: Native JDBC with `PreparedStatement`, `Connection`, `ResultSet`, and ACID transaction rollback handling
- **Web Application Server**: Apache Tomcat 9.0.x
- **Session Management**: `HttpSession` for role-based authentication and dashboard access control
- **Browser Cookies**: "Remember Me" email persistence (7 days) and Preferred Language persistence (30 days)

---

## 2. Directory Structure & File Inventory

The project is structured compactly adhering strictly to the maximum file limit (< 80 files):

```
Online Hospital Appointment Booking and Patient Management System/
|
├── src/
│   ├── DatabaseConnection.java            # JDBC connection manager (MySQL hospital_db)
│   ├── Patient.java                       # Patient Model
│   ├── Doctor.java                        # Doctor Model
│   ├── DoctorSchedule.java                # Doctor Schedule Model
│   ├── Appointment.java                   # Appointment Model
│   ├── Admin.java                         # Administrator Model
│   ├── PatientDAO.java                    # Patient JDBC Data Access Object
│   ├── DoctorDAO.java                     # Doctor JDBC Data Access Object
│   ├── AppointmentDAO.java                # Appointment & Schedule Transaction DAO
│   ├── AdminDAO.java                      # Administrator JDBC Data Access Object
│   ├── PatientRegisterServlet.java        # Patient registration & field validation
│   ├── PatientLoginServlet.java           # Patient login, session & cookie handler
│   ├── DoctorServlet.java                 # Doctor cards directory & dept filters
│   ├── AppointmentBookingServlet.java     # Booking form, duplicate slot check & POST
│   ├── MyAppointmentsServlet.java         # Patient history & appointment cancellation
│   ├── AdminLoginServlet.java             # Admin login & metrics aggregation
│   ├── DoctorManagementServlet.java       # Admin CRUD for doctors
│   ├── AppointmentManagementServlet.java  # Admin appointment & patient manager
│   ├── LogoutServlet.java                 # Invalidate session & logout redirect
│   └── PatientProfileServlet.java         # Patient profile update & language cookies
|
├── WebContent/
│   ├── index.jsp                          # HEALTHCARE - Hospital Appointment Portal
│   ├── patient.jsp                        # Patient Dashboard with vertical sidebar
│   ├── doctors.jsp                        # Multi-speciality doctor cards
│   ├── booking.jsp                        # Consultation booking form
│   ├── confirmation.jsp                   # Booking confirmation receipt
│   ├── appointments.jsp                   # Patient appointment history & cancel
│   ├── profile.jsp                        # Profile & language preferences
│   ├── admin.jsp                          # Administrator Dashboard
│   ├── admin-doctors.jsp                  # Admin doctor management & add form
│   ├── admin-appointments.jsp             # Admin appointment status manager
│   ├── admin-patients.jsp                 # Admin patient directory
│   ├── style.css                          # Modern medical CSS stylesheet
│   └── WEB-INF/
│       ├── web.xml                        # Servlet mappings & deployment descriptor
│       ├── classes/                       # Compiled Java bytecode (.class)
│       └── lib/
│           ├── mysql-connector-j-8.0.33.jar
│           ├── jstl-1.2.jar
│           ├── taglibs-standard-impl-1.2.5.jar
│           ├── taglibs-standard-spec-1.2.5.jar
│           └── javax.servlet-api-3.0.1.jar
|
├── database/
│   └── hospital_db.sql                    # MySQL schema creation & sample data
|
├── lib/
│   └── (Required JAR files)
|
└── README.md
```

---

## 3. Database Setup (MySQL)

1. Open your MySQL Command Line Client or MySQL Workbench.
2. Run the provided database initialization script located at `database/hospital_db.sql`:

```sql
SOURCE /path/to/database/hospital_db.sql;
```

Or execute directly from PowerShell / Terminal:
```powershell
mysql -u root -p < "database\hospital_db.sql"
```

The script sets up:
- **`hospital_db`** database
- **`Patients`** table (name, age, gender, email, mobile, address, password)
- **`Doctors`** table (name, specialization, qualification, experience, fee, available_days)
- **`Doctor_Schedules`** table (doctor_id, available_date, time_slot, availability_status)
- **`Appointments`** table (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) with a unique constraint on `(doctor_id, appointment_date, appointment_time)`
- **`Admins`** table (admin_id, username, password, full_name)
- Sample doctors across 6 required specializations: **Cardiology**, **Dermatology**, **Neurology**, **Orthopaedics**, **Paediatrics**, and **General Medicine**.

---

## 4. Default Login Credentials

### Administrator Credentials:
- **Username**: `admin`
- **Password**: `admin123`
*(Secondary Admin: `superadmin` / `admin@2026`)*

### Sample Patient Credentials:
- **Email**: `rajesh.kumar@example.com` | **Password**: `patient123`
- **Email**: `ananya.sharma@example.com` | **Password**: `patient123`
- **Email**: `suresh.reddy@example.com` | **Password**: `patient123`

*(You can also register a new patient via the registration form on the portal)*

---

## 5. Key Functional Highlights

1. **Duplicate Booking Prevention**:
   - Client-side and server-side checks prohibit booking in the past.
   - Database uniqueness and transaction lock (`conn.setAutoCommit(false)`) verify slot availability.
   - Prevents two patients from booking the same doctor's slot on the same date.
   - Prevents the same patient from double-booking identical slots.
   - Displays clear contextual warning when a slot is already taken.
2. **Session Security & Role Separation**:
   - Patients and Administrators have separate dashboards and sessions (`session.getAttribute("patient")` vs `session.getAttribute("admin")`).
   - Unauthenticated direct URL visits redirect to `index.jsp` with an error alert.
   - `LogoutServlet` calls `session.invalidate()` cleanly.
3. **Cookie Preferences**:
   - `remember_patient_email`: Stores patient email for 7 days when "Remember Me" is checked.
   - `patient_lang`: Stores language preference (English, Español, Français, हिन्दी) for 30 days.
   - Sensitive credentials like passwords are strictly omitted from cookies.
4. **Dynamic JSTL & JDBC**:
   - All doctor cards, departments, appointment tables, and stats are loaded from the database and rendered via `<c:forEach>`, `<c:if>`, `<c:choose>`, and `<c:out>`.

---

## 6. How to Deploy and Run on Apache Tomcat

1. Compile all Java sources in `src/` to `WebContent/WEB-INF/classes/`:
   ```powershell
   javac -cp "WebContent\WEB-INF\lib\*;C:\path\to\tomcat\lib\*" -d "WebContent\WEB-INF\classes" src\*.java
   ```
2. Copy the `WebContent` folder to Tomcat's `webapps` directory under the context name `HospitalAppointmentSystem` (or symlink):
   ```powershell
   Copy-Item -Recurse "WebContent" "C:\tools\tomcat\apache-tomcat-9.0.86\webapps\HospitalAppointmentSystem"
   ```
3. Start Tomcat using:
   ```powershell
   C:\tools\tomcat\apache-tomcat-9.0.86\bin\startup.bat
   ```
4. Access the web portal in your browser:
   ```
   http://localhost:8080/HospitalAppointmentSystem/
   ```
