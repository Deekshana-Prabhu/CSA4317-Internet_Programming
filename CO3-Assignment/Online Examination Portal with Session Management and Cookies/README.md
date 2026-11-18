# Online Examination Portal with Session Management and Cookies

A modern, robust, and fully functional **College Online Examination Portal** engineered using **Java Servlets**, **JavaServer Pages (JSP)**, **HttpSession**, and **HTTP Cookies** compliant with Apache Tomcat.

---

## 🎨 Theme & User Interface Design
- **Theme Palette:** Modern Light Blue (`#0284c7`, `#e0f2fe`), Pure White (`#ffffff`), and Soft Purple (`#7c3aed`, `#ede9fe`).
- **Navigation:** Professional **Left Sidebar Navigation** containing college emblem branding, live student authentication status, direct navigational links, and server session metadata.
- **Card-based Architecture:** Clean, rounded corners (`16px`), soft shadows, clear typography, and responsive layouts across Desktop, Tablet, and Mobile.
- **Aesthetic:** Crisp and distraction-free; avoids dark themes and excessive dashboard clutter.

---

## 🔑 Demonstration Credentials
| Role | Username | Password |
| :--- | :--- | :--- |
| **Student (Default)** | `student101` | `student123` |
| **Administrator** | `admin` | `admin123` |

---

## 📁 Project Directory Structure
```text
Online Examination Portal with Session Management and Cookies/
│
├── index.html                  # Welcome & Landing Page with Guidelines & Syllabus
├── login.html                  # Student Login Form with Cookie Restoration
├── login.jsp                   # JSP counterpart reading cookies server-side
├── dashboard.jsp               # Protected Student Dashboard (HttpSession)
├── instructions.jsp            # Examination Guidelines & Agreement Page
├── exam.jsp                    # Interactive Examination Interface (Timer & Palette)
├── result.jsp                  # Automated Result Computation & Detailed Review
├── session-demo.jsp            # "Session Tracking Demonstration" (Cookies vs HttpSession)
│
├── css/
│   └── style.css               # Master Stylesheet (Light Blue, White, Soft Purple)
│
├── js/
│   └── exam.js                 # Interactive Controller (Timer, Palette, Modal, Cookie Helper)
│
├── src/
│   ├── Question.java           # Question Model (10 Java Questions & Answer Keys)
│   ├── LoginServlet.java       # POST Authentication, Session Creation & Cookie Handler
│   ├── LogoutServlet.java      # Session Invalidation & Cookie Cleanup
│   ├── ExamServlet.java        # Session Protection & Question Dispatcher
│   └── ResultServlet.java      # Answer Evaluation, Scoring & History Tracker
│
├── WEB-INF/
│   ├── web.xml                 # Servlet Mappings & 5-Minute Session Timeout Config
│   └── classes/                # Pre-compiled .class bytecodes ready for Tomcat
│       └── com/exam/portal/
│           ├── Question.class
│           ├── LoginServlet.class
│           ├── LogoutServlet.class
│           ├── ExamServlet.class
│           └── ResultServlet.class
│
├── lib/
│   └── servlet-api.jar         # Servlet 3.x / Java EE API library for compilation
│
├── OnlineExamPortal.war        # Pre-packaged, ready-to-deploy Tomcat WAR file
├── compile.bat                 # Windows Batch script to recompile Java Servlets
├── compile.ps1                 # PowerShell script to recompile Java Servlets
└── README.md                   # Complete Documentation & Deployment Manual
```

---

## 🚀 Key Modules & Functional Features

### 1. Home / Welcome Page (`index.html`)
- **Title:** `ONLINE EXAMINATION PORTAL`
- **Subtitle:** `Test Your Knowledge. Track Your Progress.`
- Interactive student login CTA.
- Detailed examination syllabus breakdown (Java Basics, OOP, Classes/Objects, Inheritance, Exceptions, Servlets, JSP, JDBC, HttpSession, Cookies).
- Step-by-step examination workflow guidance and candidate guidelines.

### 2. Student Authentication (`login.html` & `login.jsp`, `LoginServlet.java`)
- **Form Method:** Submits via `POST` to `LoginServlet`.
- **Fields:** Username, Password, Remember Me checkbox, Preferred Language (English / Tamil).
- **Session Creation:** Initializes `HttpSession` with a **5-minute inactivity timeout** (`session.setMaxInactiveInterval(300)`).
- **Cookie Handling:**
  - When **"Remember Me"** is checked: Creates `rememberedUser` cookie with a **7-day lifespan** (`setMaxAge(604800)`).
  - Automatically restores and pre-fills the remembered username and preferred language on subsequent visits.
  - When unchecked: Deletes existing cookie via `setMaxAge(0)`.
- Displays real-time validation error alerts for invalid credentials (`?error=invalid`).

### 3. Student Dashboard (`dashboard.jsp`)
- Protected by `HttpSession` verification; unauthenticated access redirects to `login.html?error=unauthorized`.
- Employs HTTP cache-control headers (`no-cache, no-store, must-revalidate`) preventing back-button access after logout.
- Displays:
  - Personal welcome greeting (`Welcome back, student101!`).
  - Active session indicator with current Session ID.
  - Active exam details (Java Programming CS304, 10 Questions, 10 Minutes, 50% pass mark).
  - Previous examination performance records with score, percentage, and Pass/Fail status.
  - Direct links to launch the examination, review results, or access the Session Demo.

### 4. Examination Instructions (`instructions.jsp`)
- Full candidate guidelines including question weightage (1 mark each), navigation instructions, auto-submit countdown rules, and browser safety warnings.
- Mandatory agreement checkbox (`I Agree and Start Exam`).

### 5. Online Examination Interface (`exam.jsp`, `ExamServlet.java`)
- **Single-Question View:** Displays one question at a time with smooth Next and Previous navigation.
- **10 Core Java Topics:**
  1. *Java Architecture & Basics* (JIT Compiler, Bytecode execution)
  2. *OOP Principles* (Method Overriding & Runtime Polymorphism)
  3. *Classes & Objects* (`this` keyword and parameter shadowing)
  4. *Inheritance* (`super()` constructor invocation)
  5. *Exception Handling* (`finally` block resource management)
  6. *Java Servlets* (`init()` lifecycle initialization)
  7. *JSP* (`session` implicit object)
  8. *JDBC* (`PreparedStatement` SQL injection prevention)
  9. *Session Management* (`session.invalidate()` termination)
  10. *HTTP Cookies* (`setMaxAge(0)` browser deletion)
- **Question Palette:** 1 to 10 interactive grid indicating:
  - **Answered:** Highlighted in soft purple.
  - **Unanswered:** Light slate border.
  - **Current:** Primary blue outline.
- **Countdown Timer (10 Minutes):**
  - Displays real-time `mm:ss` countdown.
  - Visual color warning (orange) when under 2 minutes.
  - Visual pulsing warning (red) when under 30 seconds.
  - **Auto-Submission:** When the timer reaches `00:00`, answers are automatically submitted to `ResultServlet`.
- **Confirmation Modal:** Summarizes answered vs unanswered questions before allowing final manual submission.

### 6. Automated Result Evaluation (`result.jsp`, `ResultServlet.java`)
- Evaluates student responses against master answer key.
- Computes:
  - Total Questions (10)
  - Correct Answers
  - Incorrect Answers
  - Unanswered Questions
  - Total Score (1 mark per correct answer)
  - Percentage score
  - Pass / Fail status (Passing threshold: $\ge 50\%$)
- Prevents duplicate exam submissions within the same session.
- **View Answers Feature:** Interactive accordion displaying each question, the student's selected answer, the correct option, and conceptual explanations.
- Action buttons: *View Answers*, *Back to Dashboard*, and *Logout*.

### 7. Session Tracking Demonstration (`session-demo.jsp`)
- **Comparative Analysis Table:**
  | Feature | HTTP Cookies (Client-Side) | HttpSession (Server-Side) |
  | :--- | :--- | :--- |
  | **Storage Location** | User's Web Browser / Local Disk | Apache Tomcat Server Memory |
  | **Lifecycle** | Persists across visits until `MaxAge` expires | Inactive timeout (5 min) or until logout |
  | **Primary Role** | "Remember Me", Language Preferences | Authentication, Exam State, Scoring |
  | **Security** | Plain text on client; limited to 4KB | Opaque `JSESSIONID`; server protected |
  | **Invalidation** | Overwrite with `setMaxAge(0)` | `session.invalidate()` destroys state |
- **Live State Inspector:**
  - Displays actual values from `request.getCookies()` and `session.getAttribute()`.
  - Displays `Session ID`, `Creation Time`, `Last Accessed Time`, and `Max Inactive Interval`.
  - Live 5-minute inactivity countdown bar.
  - Interactive buttons to test standard logout (preserves cookies) vs full logout (clears both).

---

## ⚙️ How to Deploy & Run on Apache Tomcat

### Option A: Quick WAR Deployment (Recommended)
1. Download or copy `OnlineExamPortal.war` from the project root.
2. Paste `OnlineExamPortal.war` into your Tomcat directory under the `webapps` folder:
   ```text
   <TOMCAT_HOME>\webapps\OnlineExamPortal.war
   ```
3. Start Tomcat using:
   - **Windows:** `<TOMCAT_HOME>\bin\startup.bat`
   - **Linux/macOS:** `<TOMCAT_HOME>/bin/startup.sh`
4. Open your browser and navigate to:
   ```text
   http://localhost:8080/OnlineExamPortal/
   ```

---

### Option B: Deploying as an Exploded Directory
1. Copy the entire project folder to `<TOMCAT_HOME>\webapps\OnlineExamPortal`.
2. Ensure the servlet `.class` files are present in `WEB-INF\classes\com\exam\portal\`.
   *(If recompiling is needed, run `compile.bat` or `.\compile.ps1`).*
3. Start Tomcat:
   ```text
   <TOMCAT_HOME>\bin\startup.bat
   ```
4. Access the portal at:
   ```text
   http://localhost:8080/OnlineExamPortal/
   ```

---

### Option C: Running via Eclipse IDE for Enterprise Java (Java EE)
1. Open Eclipse IDE and choose **File &rarr; Import &rarr; Web &rarr; WAR file**.
2. Select `OnlineExamPortal.war` from the project directory.
3. Target runtime: Select **Apache Tomcat v8.5 / v9.0 / v10.0**.
4. Click **Finish**.
5. Right-click the imported project &rarr; **Run As &rarr; Run on Server** &rarr; Select Tomcat.
6. The application will launch in the integrated browser at `http://localhost:8080/OnlineExamPortal/`.

---

### Option D: Running via IntelliJ IDEA Ultimate
1. Open IntelliJ IDEA and select **Open** &rarr; Select this project folder.
2. Go to **Run &rarr; Edit Configurations...**
3. Click `+` and choose **Tomcat Server &rarr; Local**.
4. In the **Deployment** tab, click `+` &rarr; **Artifact** (or select `OnlineExamPortal.war`).
5. Set Application context to `/OnlineExamPortal`.
6. Click **Apply** and press **Run**.

---

## 🧪 Testing Verification Checklist

| Test Item | Expected Result | Verified Status |
| :--- | :--- | :---: |
| **Login Valid** | Credentials `student101` / `student123` authenticate and redirect to `dashboard.jsp` | ✅ PASS |
| **Login Invalid** | Redirects to `login.html?error=invalid` with visible warning alert | ✅ PASS |
| **Remember Me** | Cookie `rememberedUser` set with 7-day expiration; auto-fills on next visit | ✅ PASS |
| **Session Protection** | Direct URL access to protected pages without session redirects to login | ✅ PASS |
| **5-Min Timeout** | `session.setMaxInactiveInterval(300)` invalidates inactive sessions after 5 min | ✅ PASS |
| **Question Palette** | Real-time updates: answered questions turn purple; count updates dynamically | ✅ PASS |
| **10-Min Timer** | Counts down from 10:00; warning at <2m; auto-submits form at 00:00 | ✅ PASS |
| **Submit Confirmation**| Modal summarizes answered vs unanswered questions before submitting | ✅ PASS |
| **Score Evaluation** | Evaluates 10 MCQs; calculates score, percentage, and Pass/Fail status | ✅ PASS |
| **Duplicate Prevention**| Prevents multiple attempts by checking `examTaken` session attribute | ✅ PASS |
| **View Answers** | Displays question review with selected answer, correct key, and explanation | ✅ PASS |
| **Session Demo** | Shows live comparisons between server-side `HttpSession` and browser `Cookie` | ✅ PASS |
| **Logout & Invalidate**| Invalidates `HttpSession`, clears cached data, and preserves/clears cookies | ✅ PASS |

---

## 📜 Academic Integrity & Course Information
- **Course:** Internet Programming (CS304 / IT204)
- **Assignment:** Assignment 3 - Online Examination Portal with Session Management and Cookies
- **Implementation:** Standard Java EE Servlets, JSP 2.3, Servlet 3.1 Specification.
