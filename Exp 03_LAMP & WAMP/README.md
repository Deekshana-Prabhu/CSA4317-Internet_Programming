# LAMP vs WAMP - Web Development Environment

An interactive, modern, and comprehensive educational website and laboratory guide exploring the two foundational web server solution stacks: **LAMP** (Linux, Apache, MySQL, PHP) and **WAMP** (Windows, Apache, MySQL, PHP).

---

## Quick Start (Zero Setup Required)

This website is built with vanilla **HTML5**, **CSS3**, and **JavaScript**. It runs immediately without any build step, Node.js, npm, backend daemon, or local web server.

### How to Run:
1. Navigate to the project directory:
   ```
   c:\Users\ASUS\OneDrive\Desktop\IP\LAB\Exp 03_LAMP & WAMP\
   ```
2. Double-click **`index.html`** or right-click and open it with any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Brave, Opera).
3. The complete application will launch with full offline capabilities, responsive styling, and all interactive features active.

---

## File Structure

The project strictly contains exactly these four files:

```
Exp 03_LAMP & WAMP/
|-- index.html   # Main website structure, semantic sections, and inline SVG icons
|-- style.css    # Complete modern stylesheet (light theme, gradients, responsive layout)
|-- script.js    # All interactivity (sidebar ScrollSpy, simulators, stepper, quiz, clipboard)
\-- README.md    # Documentation, architectural guide, and usage instructions
```

---

## Design & Visual Aesthetic

- **Theme & Color Palette:** Modern light theme with deep royal blue (`#2563eb`), vibrant purple (`#7c3aed`), crisp white surfaces (`#ffffff`), slate borders, and colorful accents (emerald green for success, amber for warnings, rose for errors).
- **Navigation:** Persistent, sticky **Left Sidebar** with live ScrollSpy active-section highlighting, reading progress tracker, and a responsive off-canvas mobile drawer.
- **Icons & Graphics:** 100% self-contained inline SVG vector graphics for instantaneous rendering with zero external CDN dependencies and guaranteed offline reliability.
- **Micro-Interactions:** Subtle card elevations, gradient glowing borders, animated data packet flow lines, interactive status indicators, and smooth scrolling.

---

## Curriculum & Section Guide

1. **Home / Overview:**
   - Introduction to web development stacks.
   - Dual hero illustration cards comparing LAMP (Production Titan) and WAMP (Dev Friendly).
   - Core metrics: market adoption, open-source pedigree, and software licensing.

2. **LAMP Stack Deep Dive:**
   - **Linux:** POSIX process isolation, security privileges (`www-data`), and package management.
   - **Apache:** Multi-Processing Modules (`event`/`worker`), `.htaccess` overrides, and VirtualHosts.
   - **MySQL:** Relational database management, ACID compliance, InnoDB engine, and default Port 3306.
   - **PHP:** Server-side scripting, Zend Engine compilation, and PDO database abstraction.
   - Clickable component cards with comprehensive technical specification modals.

3. **WAMP Stack Deep Dive:**
   - **Windows:** Client GUI environment, NTFS case-insensitive filesystem, and Windows Service Manager.
   - **Apache for Windows:** Win64 compiled binary running under `mpm_winnt`.
   - **MySQL & MariaDB:** Bundled dual database engines and web-based phpMyAdmin.
   - **PHP for Windows:** Thread-Safe (TS) multi-version runtime with 1-click tray switcher.
   - **Interactive WampServer Tray Indicator Simulator:** Click to toggle Green (Online), Orange (Port 80 Conflict), and Red (Offline) states with explanatory details.

4. **Architecture & Data Flow:**
   - Visual 4-tier architecture canvas: Client Browser <-> Apache Web Server <-> PHP Preprocessor <-> MySQL Database.
   - Switchable blueprints between LAMP (Linux POSIX) and WAMP (Windows multi-thread).
   - **Interactive Request Flow Tracer:** Visual animated packets step through all 6 request-response phases with real-time status updates.

5. **Head-to-Head Comparison:**
   - Comprehensive comparison matrix across 8 critical dimensions: Operating System, Setup, Performance, Production Readiness, Case Sensitivity, Security, Admin Interface, and Licensing.
   - Interactive category filter buttons: *All Dimensions*, *Performance & Core*, *Developer Experience*, and *Production Readiness*.
   - Architectural verdict callout summarizing trade-offs.

6. **Linux Installation Guide (LAMP):**
   - Step-by-step interactive stepper for Ubuntu 22.04 / 24.04 LTS:
     1. Package repository updates (`sudo apt update && sudo apt upgrade -y`)
     2. Apache installation & UFW firewall configuration (`sudo ufw allow in "Apache Full"`)
     3. MySQL installation & `mysql_secure_installation` lockdown
     4. PHP runtime and extension installation (`libapache2-mod-php`, `php-mysql`)
     5. Diagnostic test file (`info.php`), permissions (`chown www-data:www-data`), and verification
   - Styled dark developer terminals with instant copy-to-clipboard buttons and toast feedback.

7. **Windows Installation Guide (WAMP):**
   - 6-step visual walkthrough for WampServer:
     1. Visual C++ Redistributable prerequisites (2008 to 2022)
     2. Official installer download (64-bit)
     3. Installation path selection (`C:\wamp64\`)
     4. System tray launch and status icon transitions (Red -> Orange -> Green)
     5. Accessing `http://localhost`
     6. Database management via `http://localhost/phpmyadmin`
   - Troubleshooting alert explaining how to resolve Port 80 conflicts (changing to Port 8080).

8. **The Role of Apache:**
   - Deep dive into HTTP request ingestion, static asset delivery vs dynamic PHP execution, and response synthesis.
   - **Interactive Request Lifecycle Simulator:** Test static file delivery (`.css`) vs dynamic script query (`.php` + MySQL) with a real-time terminal log viewer.

9. **Practical Examples & Directory Hierarchy:**
   - Tabbed source code explorer:
     - `info.php`: System diagnostic verification
     - `db_connect.php`: Secure MySQL connection using PHP Data Objects (PDO)
     - `users.php`: Parameterized SQL queries and dynamic HTML table generation with live preview simulator
     - Directory Hierarchy: Side-by-side comparison of `/var/www/html/` vs `C:\wamp64\www\`, path separators (`/` vs `\`), and log locations.

10. **Advantages & Limitations:**
    - High-contrast visual assessment cards highlighting the production reliability of LAMP vs the local convenience of WAMP, alongside their respective limitations.

11. **Conclusion & Decision Guide:**
    - Strategic decision matrix: When to choose LAMP vs when to choose WAMP.
    - Industry standard best-practice workflow: *"Develop on WAMP, Deploy on LAMP"*.

12. **Mastery Quiz:**
    - 10-question multiple-choice challenge testing stack concepts, ports, file paths, and troubleshooting.
    - Instant correct/incorrect visual feedback with detailed educational explanations.
    - Live score counter, progress bar, final score breakdown, performance badges, and a retake option.

---

## Technical Specifications

- **Markup:** Semantic HTML5 (`<header>`, `<aside>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Styling:** Pure CSS3 utilizing CSS Custom Properties (variables), CSS Flexbox, CSS Grid, media queries, keyframe animations, and backdrop filters.
- **Scripting:** Pure ES6+ vanilla JavaScript (no jQuery, React, or build utilities).
- **Offline Reliability:** No external fonts or CDN icons required. All assets are self-contained.
- **Cross-Browser Compatibility:** Verified in Chrome, Firefox, Edge, and Safari on desktop and mobile viewports.

---

## Educational Takeaway Summary

| Dimension | LAMP (Linux) | WAMP (Windows) |
| :--- | :--- | :--- |
| **Primary Role** | High-concurrency production hosting | Rapid local prototyping and learning |
| **Installation** | CLI package manager (`apt install ...`) | 1-Click GUI executable installer |
| **Filesystem** | Case-sensitive (`ext4`) | Case-insensitive (`NTFS`) |
| **Administration** | Bash terminal, SSH, `systemctl` | Windows System Tray icon menu |
| **OS Cost** | 100% Free & Open Source | Windows OS licensing required |
| **Best Practice** | **Target Production Server** | **Local Development Environment** |

---

*Authored for Web Engineering & Server Administration Laboratories (2026).*
