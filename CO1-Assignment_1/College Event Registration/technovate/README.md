# TECHNOVATE 2026 - National Technical & Cultural Symposium Portal
**Symposium Dates: 26–28 December 2026**  
**Institution:** Apex Institute of Technology • Department of Computer Science & Engineering  
**Technology Stack:** HTML5, CSS3, JavaScript, PHP, MySQL (PDO)

---

## 🌟 Key Updates & Enhancements

### 1. Updated Symposium Dates (26–28 December 2026)
- **Day 1**: 26 December 2026
- **Day 2**: 27 December 2026
- **Day 3**: 28 December 2026
- Displayed consistently across the Hero section, Countdown Timer, Event Cards, Schedule Table, Registration Form, Confirmation, Digital Pass, and Footer as **26–28 December 2026**.
- In the registration form, participation date selection is strictly constrained between `2026-12-26` and `2026-12-28`.

### 2. Fixed & Calibrated Countdown Timer
- Fixed countdown targeting **26 December 2026 at 9:00 AM IST (UTC+05:30)**.
- Uses `setInterval()` to update accurately every second without page reloads.
- Accurately displays Days, Hours, Minutes, and Seconds without negative numbers.
- When countdown completes, it cleanly displays **"EVENT IS LIVE!"**.
- Works reliably on desktop, tablet, and mobile with zero JavaScript errors.

### 3. Added 10 Non-Technical Events ("BEYOND TECHNOLOGY")
In addition to the 6 existing technical events, a dedicated section titled **BEYOND TECHNOLOGY – NON-TECHNICAL EVENTS** has been added with 10 high-energy cultural and lifestyle competitions:
1. **Photography Challenge** (Creative Media • Solo • ₹10,000 Prize • 26 Dec 2026)
2. **Treasure Hunt** (Adventure & Logic • Team 2–4 • ₹15,000 Prize • 27 Dec 2026)
3. **Quiz & Trivia** (Pop Culture & Trivia • Team 2 • ₹10,000 Prize • 26 Dec 2026)
4. **Ad-Zap Competition** (Marketing & Humor • Team 3–5 • ₹12,000 Prize • 27 Dec 2026)
5. **Dance Battle** (Performing Arts • Solo/Crew 1–6 • ₹20,000 Prize • 28 Dec 2026)
6. **Singing Competition** (Music & Vocals • Solo/Duo • ₹12,000 Prize • 27 Dec 2026)
7. **Short Film Making** (Cinema & Screening • Team 2–5 • ₹18,000 Prize • 28 Dec 2026)
8. **Meme Creation** (Digital Humor • Solo • ₹8,000 Prize • 26 Dec 2026)
9. **Fashion Walk** (Cyber Couture Lifestyle • Team 6–10 • ₹25,000 Prize • 28 Dec 2026)
10. **Minute to Win It** (Dexterity Fun & Games • Solo • ₹10,000 Prize • 27 Dec 2026)

Each card features an individual vector SVG icon, category badge, engaging description, cash prize, venue, date, and a 1-click *"Select Event"* button that checks the checkbox in the form and scrolls down.

### 4. Improved Registration Form
- Grouped into two visual subsections:
  - **Technical Events** (6 checkboxes)
  - **Non-Technical Events** (10 checkboxes)
- Multiple event selection enabled across both categories.
- Mandatory field validations: Name, Register Number, Email (regex), Mobile (strictly 10 digits), College Name, Department, Year of Study, Gender, Participation Date (26, 27, or 28 Dec 2026), and Terms checkbox.
- Live client-side visual feedback (`is-valid` / `is-invalid`) and server-side PHP validation.

### 5. Fixed & Scoped Print Event Pass
- **Issue Resolved**: Previously `window.print()` printed the entire website.
- **Solution**: Scoped `@media print` CSS rule that hides all headers, navbars, hero visual, event cards, schedule tables, registration forms, footers, buttons, and modal backdrops (`body * { visibility: hidden; }`).
- **Prints ONLY the Digital Entry Pass**:
  - White background (`#ffffff`) for crisp printer ink efficiency.
  - Double navy blue and purple border (`border: 3px solid #0f172a; outline: 2px solid #8b5cf6`).
  - Professional header with logo, symposium title, and `AUTHORIZED ENTRY PASS` badge.
  - Prominent persistent Registration ID banner: **`TEC2026-0001`**, **`TEC2026-0002`**...
  - Neat two-column student information layout.
  - List of registered events and scheduled date.
  - Verified QR code graphic and official convenor signature stamp.
  - Fits on a single A4 printed page.

### 6. Registration Success Modal
- Displays upon successful registration:
  - Animated glowing checkmark badge.
  - Success message: *"Congratulations! Your registration is confirmed."*
  - Student's name, unique Registration ID, selected events, and participation date.
  - **PRINT EVENT PASS** button (prints only the pass).
  - **REGISTER ANOTHER STUDENT** button (dismisses modal, completely clears all form fields and checkboxes, and scrolls to a clean form ready for the next student).

### 7. Persistent Registration IDs (TEC2026-0001...)
- Persistent sequential ID generation in PHP & MySQL (`TEC2026-0001`, `TEC2026-0002`...).
- Uniqueness enforced at database level (`reg_id VARCHAR(30) UNIQUE NOT NULL`).
- Never generates a new ID when re-printing or querying the pass.
- Redundant fallback JSON persistence in `data/registrations.json` if MySQL is not yet configured.

---

## 📂 Project Directory Structure

```text
technovate/
├── index.php             # Main portal (PHP session handling, semantic HTML5, internal CSS)
├── index.html            # Static HTML5 version for instant local browser viewing
├── style.css             # External stylesheet (Tokens, glassmorphism, @media print)
├── script.js             # Client JS engine (Countdown, canvas, validation, modal, print)
├── register.php          # PHP backend (Validation, ID sequence, JSON/Session response)
├── db_connect.php        # PDO MySQL connection & persistent ID generation
├── database.sql          # MySQL database schema (technovate_db, registrations table)
├── README.md             # Documentation and execution manual
└── images/               # 20 vector SVG assets
    ├── logo.svg
    ├── favicon.svg
    ├── hero-tech.svg
    ├── paper-presentation.svg
    ├── coding.svg
    ├── web-dev.svg
    ├── robotics.svg
    ├── quiz.svg
    ├── project-expo.svg
    ├── photography.svg
    ├── treasure-hunt.svg
    ├── quiz-trivia.svg
    ├── adzap.svg
    ├── dance-battle.svg
    ├── singing.svg
    ├── short-film.svg
    ├── meme.svg
    ├── fashion-walk.svg
    ├── minute-to-win.svg
    └── qr-sample.svg
```

---

## 🚀 Execution Guide

### Option 1: Running on WAMP / XAMPP Server
1. Copy the `technovate/` folder to your server's root:
   - **WAMP**: `C:\wamp64\www\technovate`
   - **XAMPP**: `C:\xampp\htdocs\technovate`
2. Start the server (Apache and optionally MySQL).
3. *(Optional)* Import `database.sql` via phpMyAdmin at `http://localhost/phpmyadmin`.
4. Open your browser and navigate to:
   ```text
   http://localhost/technovate/
   ```

### Option 2: Running with PHP Built-in Server
1. Open PowerShell or Terminal.
2. Navigate into `technovate`:
   ```powershell
   cd "C:\Users\ASUS\Downloads\College Event Registration\technovate"
   ```
3. Start the server:
   ```powershell
   php -S localhost:8000
   ```
4. Visit `http://localhost:8000/` in your browser.

### Option 3: Instant Browser Preview (No server needed)
Open `index.html` directly in Google Chrome, Microsoft Edge, or Mozilla Firefox. The client-side engine will handle all interactions, animations, countdown, multiple event registration, entry pass generation, and single-page printing.

---

## 🧪 Testing Checklist

- [x] **Symposium Dates**: Displays **26–28 December 2026** across all hero, cards, schedule, form, pass, and footer.
- [x] **Countdown Timer**: Accurately targets 26 December 2026 at 9:00 AM IST (UTC+05:30), updates every second, and shows "EVENT IS LIVE!" when reached.
- [x] **Registration Date**: Restricts input to `2026-12-26`, `2026-12-27`, or `2026-12-28`.
- [x] **Technical Events**: All 6 original technical competitions preserved.
- [x] **Non-Technical Events**: All 10 non-technical competitions added under "BEYOND TECHNOLOGY".
- [x] **Multiple Event Selection**: Form allows selecting any combination of technical & non-technical events.
- [x] **Persistent Registration IDs**: Formatted as `TEC2026-0001`, `TEC2026-0002`...
- [x] **Print Pass Only**: Clicking *"PRINT EVENT PASS"* opens print dialog showing **ONLY** the digital pass on a single page.
- [x] **Register Another Student**: Clicking *"REGISTER ANOTHER STUDENT"* resets all form inputs, unchecks all checkboxes, and returns to a clean registration form.
- [x] **Zero Errors**: Fully validated markup, CSS, and clean JavaScript syntax.
