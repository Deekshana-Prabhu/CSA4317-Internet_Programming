# Apex Multispeciality Hospital - Online Appointment Booking System

A modern, responsive, and robust **Hospital Appointment Booking System** built using pure **HTML5, CSS3, and Vanilla JavaScript** with a **Node.js & Express** backend.

---

## 🌟 Key Highlights & Architecture

- **Clean Healthcare Aesthetic**: Designed with a pure white background, professional medical blue (`#0284c7`, `#0369a1`) and teal (`#0d9488`, `#14b8a6`) color accents, rounded cards, and medical iconography. **No dark theme** is used.
- **Strictly Vanilla Frontend**: Built with zero frontend frameworks (no React, Angular, or Vue).
- **Dual AJAX Communication Paradigm**:
  1. **Fetch API**: Used for retrieving available doctor time slots asynchronously (`GET /api/slots`).
  2. **XMLHttpRequest (XHR)**: Used for submitting appointment details (`POST /api/appointments`) with `JSON.stringify()`, `JSON.parse()`, `readyState`, and callback function handlers.
- **Date Validation**: Employs the JavaScript `Date` object to strictly prevent past date selections both in the UI datepicker (`min` attribute) and prior to form submission.
- **Regular Expression Validation**: Client-side and server-side RegEx validation for Name (letters/spaces, min 3 chars), Email, and Phone number (exactly 10 digits).
- **Concurrency & Duplicate Booking Prevention**: The backend verifies slot availability before persisting appointments. Booked slots immediately become unavailable for subsequent bookings.
- **Dynamic DOM Manipulation Confirmation & Printing**:
  - Dynamically builds an attractive official confirmation card containing Appointment ID, Patient details, Doctor, Specialization, Date, Time Slot, and Confirmed status.
  - Dedicated `@media print` styling isolates only the official confirmation card when clicking **"Print Appointment Slip"**.

---

## 📁 Project Structure

```
Hospital Appointment Booking System/
├── index.html           # Semantic HTML5 layout (Header, Hero, Doctors, Form, Confirmation, Footer)
├── style.css            # Responsive CSS3 styling, color tokens, slot pills, and @media print
├── script.js            # Vanilla JavaScript with detailed beginner-friendly concept explanations
├── server.js            # Express server (REST API endpoints: GET /api/slots, POST /api/appointments)
├── doctors.json         # Master database of 6+ specialized medical doctors and default slots
├── appointments.json    # Persistent JSON storage for confirmed patient bookings
├── package.json         # Node.js project manifest & scripts
├── test-suite.js        # Automated verification test suite (36 assertions covering all requirements)
└── README.md            # Comprehensive project documentation
```

---

## 🚀 How to Run the Application

### 1. Prerequisites
Ensure you have **Node.js** (v18+) installed on your machine.

### 2. Start the Server
Run the following command in the project root:

```bash
npm start
```
or directly:
```bash
node server.js
```

The server will start on port `3000`:
```
🏥 Apex Multispeciality Hospital Server is running!
🔗 Local Address: http://localhost:3000
```

### 3. Open in Your Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Running the Automated Test Suite

To verify all requirements, API endpoints, validations, slot exclusions, and file integrity:

```bash
npm test
```
or:
```bash
node test-suite.js
```

Output:
```
================================================================
🧪 RUNNING APEX MULTISPECIALITY HOSPITAL TEST SUITE
================================================================
...
📊 TEST RESULTS: 36 / 36 TESTS PASSED
🎉 ALL TESTS PASSED SUCCESSFULLY!
```

---

## 🩺 Doctors & Specializations Included

1. **Dr. Sarah Jenkins** - Cardiology (`MD, DM, FACC` - 14 Years Exp) - Fee: $120
2. **Dr. Rajesh Kumar** - Neurology (`MD, DM, FAAN` - 16 Years Exp) - Fee: $150
3. **Dr. Emily Chen** - Dermatology (`MD Dermatology` - 10 Years Exp) - Fee: $90
4. **Dr. Marcus Vance** - Pediatrics (`MD, DCH, FAAP` - 12 Years Exp) - Fee: $85
5. **Dr. Elena Rostova** - Orthopedics (`MS, MCh Orthopedics` - 15 Years Exp) - Fee: $130
6. **Dr. David Miller** - General Medicine (`MD Internal Medicine, FACP` - 18 Years Exp) - Fee: $75

---

## 🛡️ Validation & Constraints Implemented

| Field | Rule / Regular Expression | UI Feedback |
|---|---|---|
| **Patient Full Name** | `/^[A-Za-z\s]{3,}$/` (Letters & spaces only, min 3 chars) | Inline error message & colored border |
| **Email Address** | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | Inline error message & colored border |
| **Mobile Number** | `/^\d{10}$/` (Exactly 10 numeric digits) | Inline error message & numeric filter |
| **Age** | Integer between `1` and `120` | Inline error message & colored border |
| **Gender** | Radio button (`Male`, `Female`, `Other`) | Radio pill selection & error check |
| **Doctor Selection** | Valid selection from dropdown or doctor card | Auto-synced with doctor cards |
| **Appointment Date** | JavaScript `Date` object: $\ge$ Today's midnight | Native `min` attribute + JS check |
| **Time Slot** | Dynamic slot selection via Fetch API | Slot pill button & conflict prevention |

---

## 📄 License & Attribution
Developed for Apex Multispeciality Hospital. All rights reserved.
