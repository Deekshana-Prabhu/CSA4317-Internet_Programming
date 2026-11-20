# VELOCITY – SMART BIKE SHOWROOM
> **Tagline:** Ride Your Dream. Own Your Journey.

A complete, professional, and interactive multi-brand motorcycle showroom website built with pure vanilla HTML5, CSS3, JavaScript, and persistent client-side storage (`localStorage`).

---

## 🚀 How to Run the Website

**Zero Dependencies • No Node.js / npm Required • Pure Client-Side**

1. Simply double-click **`index.html`** in your file manager to open it directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).
2. To test the classical HTML frameset implementation specifically required by academic lab evaluations, open **`frameset.html`** or click the **"Switch to HTML &lt;frameset&gt; Version"** banner link inside `index.html`.

---

## 📂 Project Architecture (Total 8 Core Files + README)

```text
Q1_BIKESHOWROOM/
├── index.html       # Primary Modern Three-Frame Showroom Web Application
├── frameset.html    # Academic HTML 4.01 <frameset> Specification (Rows & Cols)
├── header.html      # Traditional Top Frame (Logo, Velocity branding, Tagline)
├── brands.html      # Traditional Left Frame (Brand hyperlinks targeting mainFrame)
├── content.html     # Traditional Right Frame (Bike models, specs, and booking)
├── database.js      # Persistent Database Layer with 36 bike models & full CRUD
├── styles.css       # Premium showroom stylesheet (Charcoal, Red, Orange, Print CSS)
├── script.js        # Controller (Search, Filters, Compare, Booking, Receipts, Admin)
└── README.md        # Documentation and Lab Evaluation Guide
```

---

## 🌟 Key Features & Requirements Matrix

### 1. Design & Appearance
- **Color Palette:** Deep Black (`#0d0f12`), Charcoal Grey (`#14171d`, `#1c2128`), Crisp White (`#ffffff`), Flame Red (`#e63946`), and Electric Orange (`#ff6b35`).
- **Typography:** Google Fonts *Outfit* (bold automotive headings) and *Plus Jakarta Sans* (refined UI elements).
- **Responsive Layout:** Adaptive desktop three-frame split, tablet layout, and mobile drawer menu.

### 2. Required Three-Frame Layout
- **Top Frame:** Showroom logo, VELOCITY name, and the tagline *"Ride Your Dream. Own Your Journey."*, with quick action badges.
- **Left Frame:** Vertical navigation featuring all **9 requested motorcycle brands** with count badges. Clicking any brand dynamically updates the right frame.
- **Right Frame:** Main content displaying selected bike brands, model cards, technical specs, and interactive modals.
- **Two Implementations Provided:**
  - Modern, responsive single-page CSS/JS 3-frame layout (`index.html`).
  - Traditional HTML `<frameset rows="95,*">` and `<frameset cols="270,*">` document (`frameset.html`).

### 3. All 9 Brands with 4 Models Each (36 Models Total)
1. **Royal Enfield:** Classic 350, Hunter 350, Continental GT 650, Himalayan 450
2. **Yamaha:** YZF R15 V4, MT-15 V2, FZ-S FI V4, Aerox 155
3. **KTM:** 390 Duke (Gen 3), RC 390 GP, 250 Duke, 390 Adventure SW
4. **TVS:** Apache RR 310, Apache RTR 200 4V, Ronin 225, Raider 125
5. **Bajaj:** Pulsar NS400Z, Dominar 400, Pulsar RS200, Avenger Cruise 220
6. **Honda:** CB350 H'ness, CB300R, CBR 650R (Inline-4), Hornet 2.0
7. **Suzuki:** Hayabusa GSX1300R, V-Strom SX 250, Gixxer SF 250, Access 125
8. **Kawasaki:** Ninja ZX-10R, Ninja 400, Z900 Supernaked, Versys 650
9. **BMW Motorrad:** S 1000 RR M Package, G 310 R, G 310 GS, R 1250 GS Adventure

Each bike displays:
- High-resolution motorcycle photography
- Model name and brand badge
- Indicative price in Indian Rupees (`₹`)
- Engine capacity (cc)
- Certified mileage (kmpl)
- Maximum power & torque
- Transmission & Fuel type
- Available color swatches
- Comprehensive overview description

### 4. Smart Bike Search & Advanced Filters
- **Instant Search:** Type any model or brand keyword (e.g. `Ninja`, `Duke`, `Classic`).
- **Price Range Filter:** Under ₹1.5L, ₹1.5L–₹3L, ₹3L–₹6L, Superbikes above ₹6L.
- **Engine Capacity Filter:** 125–160cc, 160–350cc, 350–500cc, 500cc+.
- **Mileage Filter:** 50+ kmpl, 35+ kmpl, 25+ kmpl.
- **Sorting:** Low-to-High price, High-to-Low price, Highest Mileage, Alphabetical (A-Z).

### 5. Multi-Bike Side-by-Side Comparison
- Compare up to **3 motorcycles simultaneously**.
- Floating bottom drawer shows selected machines.
- Comprehensive matrix compares Price, Engine cc, Mileage, Max Power, Torque, Fuel Tank Capacity, Kerb Weight, Top Speed, Brakes, and direct booking CTA.

### 6. Bike Booking & Simulated Payment Gateway
- **Demo Booking Workflow:** Enter Name, 10-digit Indian Mobile, Email, Color, and Target Delivery Date.
- **Simulated Payment Options:**
  - **UPI:** Simulated QR Code and VPA validation (`user@upi`).
  - **Card:** Card number, Expiry, CVV validation.
  - **Cash:** Pay advance token at Showroom Cashier Desk.
- Clear **"Academic Demo Payment"** warning badge.
- Automatically generates a unique Booking ID (e.g., `VEL-BK-2026-XXXX`).

### 7. Digital Booking Receipt
- Generated immediately upon booking completion or accessible from **My Bookings**.
- Contains:
  - Official VELOCITY Showroom letterhead & logo
  - Receipt Number & Unique Booking ID
  - Customer contact details
  - Motorcycle specifications & selected color
  - Ex-Showroom indicative price
  - Advance token deposit paid (₹ 5,000)
  - Estimated balance payable at registration
  - Payment reference transaction ID
  - Watermark and authorized digital signature seal
- **Print & Download:** Built-in `window.print()` formatting (with `@media print` clean layout) and client-side PDF download via `html2pdf.js`.

### 8. Test Ride Booking
- Complimentary test ride booking with date picker, morning/afternoon/evening time slots, and driving license acknowledgement.
- Generates `VEL-TR-2026-XXXX` appointment ID.

### 9. Persistent Database (`database.js`)
- Stores bikes inventory, customer bookings, test rides, wishlist favorites, verified reviews, and showroom inquiries in browser `localStorage`.
- All data survives page refreshes and browser restarts.
- Includes an **Admin "Reset DB"** button to restore sample records anytime.

### 10. Admin Console
- Login with demo credentials:
  - **Username:** `admin`
  - **Password:** `velocity`
  - *(or click the **"One-Click Demo"** shortcut button)*
- **KPI Metrics:** Total bikes, Total bookings, Active bookings, Test rides scheduled, Simulated token pool.
- **Inventory Management:** Add new bike, edit existing bike details, delete bike, toggle in-stock/out-of-stock availability.
- **Bookings Registry:** Change booking status (`Pending Verification` → `Confirmed` → `Delivered` → `Cancelled`).

---

## 🧪 Quick Test Checklist for Evaluators

| Feature | How to Test | Expected Result |
| :--- | :--- | :--- |
| **Open Application** | Double-click `index.html` | Opens modern showroom with Hero banner, 3-frame layout, and search bar |
| **Traditional Frameset** | Click "Classic Frameset" or open `frameset.html` | Authentic HTML `<frameset>` loads top, left, and right frames |
| **Brand Filtering** | Click "Yamaha" or "KTM" on the left frame | Right frame displays all 4 models of selected brand with specs |
| **Smart Search** | Type "Ninja" in search box | Instantly filters and displays Kawasaki Ninja models |
| **Compare Bikes** | Click "+ Add to Compare" on 2 or 3 bikes | Floating drawer appears at bottom; click "Compare" for side-by-side table |
| **Book Motorcycle** | Click "Book Now" on any card, enter name & phone | Demo payment modal opens; completes booking and displays Digital Receipt |
| **Download / Print** | Click "Download PDF" or "Print Receipt" | Generates clean letterhead receipt without website background clutter |
| **Test Ride** | Click "Test Ride" button on any bike | Schedules appointment with date/slot selection |
| **Favourites** | Click heart icon on bike cards | Increments Favourites badge counter; persists in "Favourites" tab |
| **Admin Panel** | Click "Admin" nav link -> click "One-Click Demo" | Opens Admin console to Add/Edit/Delete bikes or update booking status |
| **Data Persistence** | Refresh the browser page (`F5`) | All bookings, favorites, and newly added bikes remain intact |

---

*Developed for Academic Lab Evaluation • VELOCITY Smart Bike Showroom v1.0*
