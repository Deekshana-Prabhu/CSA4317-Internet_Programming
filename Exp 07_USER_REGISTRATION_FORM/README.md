# RegisterHub – Smart User Registration Portal

**RegisterHub** is a modern, responsive, and fully featured user registration portal built purely with **HTML5, CSS3, and vanilla JavaScript**. It delivers instant client-side validation, multi-rule password entropy scoring, live form completion progress tracking, and client-side demo record management via browser `localStorage` — completely standalone without any server or build tools.

---

## 🌟 Key Features

### 1. Home Section (`#home`)
- **Hero Overview:** Dynamic introduction highlighting real-time validation, security metrics, and zero-dependency architecture.
- **Action CTAs:** "Register Now" button with smooth scroll to form, and "View Registered Users" button.
- **Feature Cards:** Three colored cards detailing *Secure Instant Validation*, *Multi-Tier Password Analyzer*, and *Intuitive UX & Local Records*.
- **Workflow Illustration:** A 4-stage pipeline visualizing how input data is processed, verified, summarized, and saved locally.

### 2. User Registration Form (`#register`)
- **Form Completion Progress Bar:** Real-time percentage indicator (`0%` to `100%`) tracking completion across all 10 required items.
- **Required Fields:**
  - **Full Name:** Letters, spaces, hyphens, min 3 chars (`/^[a-zA-Z\s'-]{3,60}$/`).
  - **Email Address:** Full RFC format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`).
  - **Phone Number:** 10 to 14 numeric digits with non-numeric stripping.
  - **Date of Birth:** Must be in the past; age validation ensures users are between 13 and 120 years old.
  - **Gender:** Accessible `<select>` dropdown (Male, Female, Non-Binary, Prefer not to say).
  - **Country:** Curated dropdown containing major global countries.
  - **Address:** Minimum 5 characters street/city/postal address.
  - **Preferred Contact Method:** Radio tile options for Email, Phone Call, SMS, and WhatsApp.
  - **Password:** Minimum 8 characters with required uppercase, lowercase, number, and special character.
  - **Confirm Password:** Real-time equality matching with live "Matches" / "Mismatch" badge.
  - **Message:** Live character counter showing current count and enforcing between 10 and 250 characters.
  - **Terms & Conditions:** Mandatory consent checkbox with alert feedback.
  - **Newsletter:** Optional opt-in checkbox.

### 3. Password Security Suite
- **Visibility Toggle:** Eye button switching between password mask and plaintext with SVG icon swap.
- **Multi-Segment Strength Meter:** Real-time entropy scoring (Weak, Medium, Strong) with color-coded progress bars.
- **Interactive Criteria Checklist:** Dynamic live feedback for:
  - Minimum 8 characters
  - Uppercase letter (`A-Z`)
  - Lowercase letter (`a-z`)
  - Number & Special Symbol (`0-9`, `@`, `#`, `$`, etc.)

### 4. Registration Summary & Receipt (`#summary`)
- **Official Receipt Card:** Displays generated unique registration ID (e.g., `#RH-2026-XXXXXX`) and submitted user profile.
- **Print Functionality:** Integrated `window.print()` with a specialized `@media print` stylesheet that removes web chrome and prints a crisp, official document.
- **Download Summary (.txt):** Instant client-side download of a formatted ASCII text receipt.
- **Register Another Option:** Clears current input states and resets form focus for the next user.

### 5. Registered Users Registry (`#records`)
- **Browser LocalStorage Demonstration:** Data is stored locally in `localStorage.registerhub_users`.
- **Live Search Filtering:** Real-time search filter matching names, emails, countries, or IDs.
- **Record Deletion:** Delete individual records or clear the entire registry.
- **Sample Data Loader:** "Load Sample Data" button pre-populates two realistic demo registrations for immediate evaluation.
- **Demo Disclaimer:** Clear notification explaining that data is browser-scoped and not sent to an external server.

### 6. Academic & Engineering About Section (`#about`)
- In-depth explanation of the purpose of client-side validation and the importance of accurate data collection.
- Comprehensive comparison table contrasting **Client-Side Validation** (UX, instant speed) against **Server-Side Validation** (authoritative security, database constraint enforcement).

---

## 📁 File Structure

The project strictly consists of exactly **4 files**:

```text
Exp 07_USER_REGISTRATION_FORM/
├── index.html     # Semantic HTML5 layout, sidebar, form, modals & sections
├── style.css      # Modern responsive light theme, design tokens, print CSS
├── script.js      # Client-side validation engine, password meter & localStorage
└── README.md      # Comprehensive documentation and project guide
```

---

## 🚀 How to Run

1. **No server, npm, or installation required.**
2. Simply double-click **`index.html`** or open it with any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera).
3. The application will immediately run fully featured.

---

## 🛠️ Technologies Used

- **HTML5:** Semantic markup (`<aside>`, `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`), custom data attributes, ARIA live regions for accessibility.
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, transitions, keyframe animations, `@media print` rules, mobile drawer transform animations.
- **Vanilla JavaScript (ES6+):** DOM manipulation, `IntersectionObserver` for navigation highlighting, Regular Expression validation, `localStorage` API, dynamic Blob generation for receipt download.
