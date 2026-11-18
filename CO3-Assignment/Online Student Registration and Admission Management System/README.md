# Online Student Registration and Admission Management System

A complete, modern, and attractive web-based **Student Admission Portal** for an engineering college developed using **HTML5, CSS3, JavaScript, Java Servlets (GET & POST), and JSP (JavaServer Pages)**, ready for deployment on **Apache Tomcat**.

---

## 1. Project Overview & Features

### 🎨 Modern & Responsive UI
- **Color Palette:** Professional combination of **Light Blue** (`#2563eb`, `#38bdf8`, `#e0f2fe`), **Soft Lavender** (`#7c3aed`, `#8b5cf6`, `#ede9fe`, `#f5f3ff`), and **Clean White** surfaces.
- **Sidebar Navigation:** Sleek vertical sidebar navigation with college crest logo badge, categorized menu items, and real-time admission session indicators.
- **Responsive Layout:** Fluid layout built with CSS Grid and Flexbox, with a mobile navigation drawer toggle.
- **Light Theme:** Clean, airy, and aesthetic design avoiding dark themes or cluttered dashboards.

### 📄 Pages Included
1. **Welcome / Home Page (`index.html`)**
   - Displays the title *"Student Admission Portal"*.
   - Short welcome message and highlights.
   - Quick action buttons: *"New Registration"* and *"View Student Details"*.
   - College admission schedule, engineering branch details, and eligibility criteria.
2. **Student Registration Page (`register.html`)**
   - Well-structured HTML form containing:
     - Student Full Name
     - Register Number
     - Email Address
     - Mobile Number (10 digits)
     - Date of Birth
     - Gender (Radio options)
     - Residential Address & State
     - Department Choices (AI & ML, CSE, ECE, EEE, IT, Mechanical, Civil)
     - Class 10 Marks & Class 12 Marks (%)
     - Preferred Alternative Department
   - Client-side validation (`js/validation.js`) with inline real-time error feedback.
   - Server-side validation and duplicate register number prevention in `RegistrationServlet`.
   - Submit and Reset buttons.
3. **Registration Confirmation Page (`success.jsp`)**
   - Success alert after form submission via HTTP POST.
   - Displays the student information in an attractive card.
   - Prominently highlights the assigned Registration Number with a print receipt option.
   - *"Register Another Student"* and *"View All Students"* navigation buttons.
4. **Student Details Page (`students.jsp` / `StudentDetailsServlet`)**
   - Professional table displaying all registered candidates.
   - Shows Student Name, Register Number, Contact Info, Department, and Marks.
   - **Search:** Search candidates by Register Number or Student Name.
   - **Department Filter:** Dynamic dropdown filter.
   - **View Option:** Interactive modal showing full candidate profile.
   - **Delete Option:** Deletes student record with confirmation via HTTP GET.

---

## 2. Servlet Architecture & Life Cycle

### 🏛️ Servlet Architecture
```
  [ Client Browser ]
         |
    (HTTP Request)
         v
 [ Apache Tomcat Web Server ]
         |
         v
 [ Java Servlet Engine ]
   ├── RegistrationServlet (POST)   ───> Validates & Saves in StudentDataStore ───> Forwards to success.jsp
   └── StudentDetailsServlet (GET)  ───> Fetches / Searches / Deletes records ───> Forwards to students.jsp
         |
         v
  [ JSP View Rendering ] ───> Browser displays dynamic HTML response
```

### 🔄 Servlet Life Cycle Methods Implemented
Both `RegistrationServlet` and `StudentDetailsServlet` explicitly implement the core Servlet Life Cycle methods:
1. `init(ServletConfig config)`:
   - Called once when the servlet is first loaded by Apache Tomcat.
   - Initializes the servlet and links to the in-memory `StudentDataStore`.
2. `service(HttpServletRequest request, HttpServletResponse response)`:
   - Dispatches each client request to `doGet()` or `doPost()`.
   - Logs incoming request method and client address.
3. `doGet()` / `doPost()`:
   - `doPost()` in `RegistrationServlet`: Parses parameters, executes validation, checks duplicate register numbers, and forwards to `success.jsp`.
   - `doGet()` in `StudentDetailsServlet`: Handles record retrieval, search filtering (`?search=...`), and record deletion (`?action=delete&regNo=...`).
4. `destroy()`:
   - Called when Tomcat unloads the servlet or shuts down to cleanly release system resources.

---

## 3. Project Directory Structure

```
Online Student Registration and Admission Management System/
│
├── index.html                    # Welcome / Home Page
├── register.html                 # Student Registration Form
├── success.jsp                   # Dynamic Registration Confirmation Page
├── students.jsp                  # Dynamic Student Records Directory
│
├── css/
│   └── style.css                 # Light Blue & Soft Lavender responsive styles
│
├── js/
│   └── validation.js             # Client-side input validation & modal interactions
│
├── lib/
│   └── servlet-api.jar           # Servlet API library for standalone compilation
│
├── src/
│   ├── RegistrationServlet.java         # Root package wrapper
│   ├── StudentDetailsServlet.java       # Root package wrapper
│   └── com/college/admission/
│       ├── Student.java                 # JavaBean Model class
│       ├── StudentDataStore.java        # Thread-safe in-memory data store
│       ├── RegistrationServlet.java     # Backend Servlet handling POST registrations
│       └── StudentDetailsServlet.java   # Backend Servlet handling GET retrievals & deletion
│
├── WEB-INF/
│   ├── web.xml                   # Web Deployment Descriptor mapping servlets
│   └── classes/                  # Pre-compiled .class files ready for Tomcat
│       ├── RegistrationServlet.class
│       ├── StudentDetailsServlet.class
│       └── com/college/admission/
│           ├── Student.class
│           ├── StudentDataStore.class
│           ├── RegistrationServlet.class
│           └── StudentDetailsServlet.class
│
├── compile.bat                   # 1-Click Windows batch script to compile Java code
├── compile.ps1                   # 1-Click PowerShell script to compile Java code
└── README.md                     # Documentation and execution guide
```

---

## 4. How to Run Using Apache Tomcat

### Option A: Direct Deployment to Apache Tomcat (Recommended)

1. **Locate your Apache Tomcat directory** (e.g., `C:\apache-tomcat-9.0.x`).
2. Copy the entire project folder:
   ```
   "Online Student Registration and Admission Management System"
   ```
   into Tomcat's `webapps/` folder, and rename it to a simple context name like `admission`:
   ```
   C:\apache-tomcat-9.0.x\webapps\admission\
   ```
3. Ensure the folder contains `WEB-INF/web.xml` and `WEB-INF/classes/` (pre-compiled files are already included!).
4. Start Apache Tomcat:
   - On Windows: Run `C:\apache-tomcat-9.0.x\bin\startup.bat`
5. Open your web browser and navigate to:
   ```
   http://localhost:8080/admission/
   ```
6. You will see the **Student Admission Portal** home page!

---

### Option B: Running in Eclipse IDE for Enterprise Java (JEE)

1. Open Eclipse and choose **File > Import > Existing Projects into Workspace** (or **File > New > Dynamic Web Project** and copy files).
2. Set Target Runtime to **Apache Tomcat v9.0** (or Tomcat v8.5/v10).
3. If using Tomcat 10+, use standard javax/jakarta compatibility or Tomcat 9.
4. Right-click the project > **Run As > Run on Server**.
5. Select your configured Tomcat Server and click **Finish**.
6. The application opens at `http://localhost:8080/admission/`.

---

### Option C: Compiling Java Sources Manually

If you modify any Java files in `src/`, recompile them anytime using:
- **Windows Command Prompt:** Double-click `compile.bat` or run:
  ```cmd
  compile.bat
  ```
- **PowerShell:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\compile.ps1
  ```
The compiled `.class` files are placed automatically into `WEB-INF\classes\`.

---

## 5. Testing the Application Features

1. **Home Page (`index.html`):**
   - Click *"New Registration"* to open the form.
   - Click *"View Student Details"* to view existing enrolled applicants.
2. **Registration Form Validation (`register.html`):**
   - Submit an empty form to observe immediate client-side validation errors.
   - Test invalid inputs (e.g. invalid email, non-10 digit phone number, marks > 100).
   - Fill valid details and click *"Submit Registration"*.
3. **Registration Confirmation (`success.jsp`):**
   - Upon submitting, `RegistrationServlet` processes the POST request and forwards data to `success.jsp`.
   - Check the student information card displaying the candidate's name, register number, contact, marks, and branch.
   - Click *"Register Another Student"* or *"View All Students"*.
4. **Duplicate Prevention:**
   - Try registering a candidate with an existing register number (e.g. `REG2026101`).
   - The servlet detects the duplicate and displays an alert indicating the duplicate register number.
5. **Student Directory & Management (`students.jsp` / `StudentDetailsServlet`):**
   - Access `http://localhost:8080/admission/students`.
   - Use the live search bar to search candidates by name or register number.
   - Filter by department using the dropdown.
   - Click the 👁️ **View** icon to see full profile details in a modal.
   - Click the 🗑️ **Delete** icon to remove a student via GET request (`?action=delete&regNo=...`).
