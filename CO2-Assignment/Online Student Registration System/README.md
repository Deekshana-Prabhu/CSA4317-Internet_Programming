# APEX - Online Student Registration System

A complete, modern, responsive Online Student Registration System for **APEX** built using **HTML5, CSS3, Vanilla JavaScript, Node.js, Express, and ExcelJS**.

---

## 🌟 Key Features

1. **Branding & Header**:
   - Prominent **APEX** college identity with subtitle *"Online Student Registration Portal"*.
   - Academic badges, accreditation tags, and active status indicators.

2. **Full Registration Form**:
   - Full Name, Email, 10-Digit Mobile, Date of Birth with live Age calculation, Gender radio selection, Engineering Department dropdown (AIML, CSE, ECE, EEE, IT, Mechanical, Civil), Year of Study, Residential Address, Password & Confirm Password with live strength meter and criteria checklist, and official Declaration.

3. **Client-Side Validation & Security**:
   - JavaScript Regular Expressions (RegExp) with `.test()` methods.
   - Live age badge: Enforces minimum admission age ($\ge 16$ years) and prevents future dates using JavaScript `Date` and `Math` methods.
   - Dynamic password validation: Minimum 8 characters, uppercase, lowercase, numeric digit, and special character.
   - Password mismatch detection and show/hide visibility toggles.
   - Strict privacy: Passwords are encrypted/never stored in Excel.

4. **Server-Side Excel Database (`ExcelJS`)**:
   - Express server (`server.js`) with `POST /api/register` endpoint.
   - Automatically stores all student submissions into `private_data/APEX_Student_Registrations.xlsx`.
   - Formatted Excel sheet with custom deep blue header styling, auto-column widths, and zebra striping.
   - Appends each new registration without deleting or overwriting previously registered students.
   - Automatic duplicate checking by student email and registration number.

5. **Strict Security & Privacy**:
   - The `private_data` directory is strictly blocked from browser access (returns `403 Forbidden`).
   - Excel file, spreadsheets, and student records are never displayed on the student-facing webpage.

6. **Registration Acknowledgement & Printing**:
   - Generates unique registration ID (`APEX-2026-DEPT-XXXX`).
   - Displays **Registration Successful!** only after backend confirms the record was saved to Excel.
   - **Print My Registration** button: Custom CSS `@media print` rules format an A4-friendly official registration acknowledgement slip and hides forms, buttons, and navigation elements.
   - **Register Another Student** button: Clears form and resets state for new entries.

---

## 📁 Project Directory Structure

```text
Online Student Registration System/
├── index.html           # Main student registration portal webpage
├── style.css            # Responsive light-themed styling & @media print rules
├── script.js            # Frontend JavaScript (validation, DOM manipulation, fetch)
├── server.js            # Node.js + Express backend with ExcelJS integration
├── package.json         # Project configuration and dependencies
├── test.js              # Automated system and Excel database verification test suite
├── README.md            # Documentation and setup instructions
└── private_data/        # Protected server-side storage (blocked from browser)
    └── APEX_Student_Registrations.xlsx
```

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (Node Package Manager)

### Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```
*(On Windows PowerShell, you can also run `npm.cmd install`)*

### Step 2: Start the Local Server
```bash
npm start
```
*(Or run `node server.js`)*

The server will start on port `3000`:
```text
=======================================================
  APEX Online Student Registration Server is Running  
  Portal URL: http://localhost:3000                 
  Excel Storage: ...\private_data\APEX_Student_Registrations.xlsx                   
=======================================================
```

### Step 3: Open the Web Portal
Open your web browser and navigate to:
```text
http://localhost:3000
```

---

## 🧪 Running the Verification Test Suite

You can run the end-to-end automated test suite anytime using:
```bash
npm test
```
*(Or run `node test.js`)*

This tests:
- Server health (`/api/health`)
- Student registration submissions
- Excel file row appending and preservation of previous records
- Duplicate registration rejection (HTTP 409)
- Protection of the `private_data` folder (HTTP 403)
- Verification that passwords are never stored in Excel cells
