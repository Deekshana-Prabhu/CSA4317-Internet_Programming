# RegisterHub – Modern Commercial Registration Portal

A fast, attractive, and responsive commercial registration portal built with HTML5 standards, real-time client-side validation, password entropy analysis, dynamic form progress tracking, and persistent member directory storage.

---

## 🚀 Key Highlights & Commercial Features

- **Commercial Portal UI**: Clean, light theme with soft blue (`#2563eb`), purple (`#7c3aed`), and white surface cards. Zero academic/numbered labels ("1.", "1.2.", "Experiment 6", etc.).
- **Minimal, Professional Left Sidebar**: Clean navigation links with icons:
  - **Home**
  - **Registration** (Primary focus)
  - **Registered Users** (With live count badge)
  - **Features**
  - **About**
- **Registration Form (Primary Focus)**:
  - Form completion progress bar (0% to 100%)
  - Dynamic password strength meter (Weak / Medium / Strong)
  - Show/hide password visibility toggle
  - Native HTML5 validation (`required`, `pattern`, `min`, `max`, `type`) with real-time feedback
  - 11 comprehensive fields: Full Name, Email, Phone, Password, DOB, Age, Gender, Website URL, Accent Color, Satisfaction Rating, and Message
  - Smooth asynchronous submission (`event.preventDefault()`) with receipt generation and reset functionality
- **Persistent Member Directory**:
  - Automatically records newly registered members into browser memory using HTML5 `localStorage`
  - Real-time search filter by member name or email
  - Member cards with generated initials avatars, contact badges, and delete capabilities
  - Clear all records option

---

## 🗂️ File Structure

The project consists strictly of **exactly 4 files**:

```
Exp 06_UPGRADING_A_LEGACY_WEB_APPLICATION/
│
├── index.html     # Main application structure & semantic layout
├── style.css      # SaaS design system, light theme, responsive grid & animations
├── script.js      # Form validation, password meter, progress & directory storage
└── README.md      # Project overview and documentation
```

---

## 💻 How to Run

1. Open `index.html` directly in any web browser (Chrome, Firefox, Edge, Safari).
2. Runs 100% offline via `file:///` with no server, `npm`, or external dependencies required.
