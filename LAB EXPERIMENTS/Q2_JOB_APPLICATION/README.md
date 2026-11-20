# CAREERHUB – ONLINE JOB APPLICATION PORTAL
> **Tagline:** *Your Career. Your Future.*

A complete, modern, professional, and interactive Job Application Form website built with pure **HTML5, CSS3, and Vanilla JavaScript**. Designed to run directly by opening `index.html` in any web browser without any server, Node.js, build tools, or dependencies.

---

## 🌟 Key Highlights & Features

### 1. Modern Design & Professional UI
- **Color Scheme:** Clean white & light blue background (`#f4f8fc`), dark navy blue headings (`#0f2b48`), and corporate royal blue buttons (`#2563eb`).
- **Modern Layout:** Subtle shadows, smooth card transitions, rounded corners, responsive grid layout, and embedded vector SVG icons (100% offline-ready).
- **Sticky Navigation Bar:** Instant smooth-scrolling links to Home, Available Jobs, Apply Now, Track Application, Admin Portal, and Contact Us.

### 2. Available Jobs Section (6 Roles)
- **Software Developer** (Engineering & IT | Bengaluru | Full-time | 0–3 Yrs)
- **Data Analyst** (Data & Analytics | Mumbai Hybrid | Full-time | 1–4 Yrs)
- **AI/ML Engineer** (Artificial Intelligence | Hyderabad / Remote | Full-time | 1–5 Yrs)
- **Web Developer** (Frontend & Web Tech | Pune Hybrid | Full-time | 0–3 Yrs)
- **UI/UX Designer** (Product Design | Bengaluru / Remote | Full-time | 1–4 Yrs)
- **Cybersecurity Analyst** (Information Security | Chennai On-site | Full-time | 2–5 Yrs)
- **Interactive "Apply For This Position" Action:** Automatically scrolls to the form, selects the position, sets the corresponding department, and highlights the field.

### 3. Comprehensive Form with Real-Time Validation
- **Personal Information:**
  - Full Name (required, min 3 characters, alphabets and spaces only)
  - Email Address (required, RFC email regex format)
  - Mobile Number (required, 10-digit Indian mobile number starting with 6–9)
  - Date of Birth (compulsory, enforces minimum 18 years of age)
  - Gender (compulsory: Male / Female / Other / Prefer not to say)
  - Highest Qualification (compulsory dropdown: SSLC, HSC, Diploma, Bachelor's Degree, Master's Degree, PhD, Other)
- **Professional Information:**
  - Applying for Position (dropdown with 6 core positions)
  - Department (auto-populated based on position selection)
  - Years of Experience (Fresher 0 Yrs, 1–2 Yrs, 3–5 Yrs, 5–8 Yrs, 8+ Yrs)
  - Technical Skills (with quick-add chips for popular skills)
  - Current Address (validated for minimum length)
  - Resume Upload (Drag & drop or file browse; accepts `.pdf`, `.doc`, `.docx` up to 5 MB)
- **No Browser Alert() Popups:** Clear inline error messages and green checkmark indicators on valid fields.

### 4. Interactive Unique Features
- **Form Progress Indicator:** Dynamically updates percentage completion (0% to 100%) with animated color shifts.
- **Draft Auto-Saving:** Saves entered form inputs to `localStorage` automatically on change, preventing accidental data loss on refresh.
- **Unique Application ID Generator:** Automatically creates a structured ID (e.g., `CH-2026-84920`) upon valid submission.
- **Application Confirmation & Receipt:**
  - Displays a complete formal acknowledgement slip with watermark and verification stamp.
  - **Print Receipt Button:** Formatted with `@media print` for clean paper or PDF printing.
  - **Download Receipt Button:** Downloads a clean `.txt` summary of the submitted details.
- **Application Status Tracker:**
  - Allows applicants to enter their Application ID to view current progress across 4 stages: Submitted ➔ HR Screening ➔ Technical Round ➔ Offer / Final.
- **Demo HR Admin Portal:**
  - Shows total application count, review count, and shortlisted candidates.
  - Interactive table displaying all stored applications from `localStorage`.
  - Admin actions: View Receipt, Toggle Status (Under Review / Shortlisted / Rejected), Delete Record, and "Load Sample Data" for easy evaluation.

---

## 🚀 How to Run the Website

1. Navigate to the project folder:
   ```
   c:\Users\ASUS\OneDrive\Desktop\IP\LAB\Q2_JOB_APPLICATION\
   ```
2. Double-click **`index.html`** or right-click and choose **Open with > Chrome / Edge / Firefox**.
3. No web server, Node.js, npm, or installation is needed!

---

## 🧪 Quick Evaluation & Testing Checklist

| Test Item | Steps | Expected Result |
| :--- | :--- | :--- |
| **Direct Execution** | Double-click `index.html` | Opens instantly with full styling, icons, and fonts |
| **Apply from Job Card** | Click "Apply For This Position" on "AI/ML Engineer" | Scrolls to form, selects "AI/ML Engineer", sets "Artificial Intelligence" dept |
| **Name Validation** | Type "Jo" or numbers | Red border with error: min 3 characters, alphabets only |
| **Email Validation** | Type "invalidemail" | Red border with error: valid email format required |
| **Mobile Validation** | Type "12345" or "5555555555" | Error: 10 digits starting with 6, 7, 8, or 9 required |
| **Resume Validation** | Upload a file or drag & drop | Shows filename, size, valid badge; blocks non-pdf/doc files |
| **Form Reset** | Click "Cancel & Reset Form" | Prompts confirmation modal; clears form & draft if confirmed |
| **Successful Submission** | Fill all required fields and click "Submit Application" | Confetti burst, generates unique ID (CH-2026-XXXXX), opens Receipt modal |
| **Print / Download** | Click "Download Receipt" or "Print Receipt" | Downloads `.txt` file or opens browser print dialog |
| **Application Tracking** | Enter the generated ID in "Track Application" | Shows applicant status and 4-step progress timeline |
| **Admin Database** | Check the Admin section at the bottom | View all submitted applications, change status, or load sample records |
