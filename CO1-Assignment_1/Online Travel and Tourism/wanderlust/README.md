# WANDERLUST – Explore the World
### Online Travel & Tourism Portal

A modern, visually stunning, and fully functional **Online Travel and Tourism Website** developed for a premier travel agency. Built with pure semantic **HTML5**, modern **CSS3**, and modular **JavaScript**, featuring real-time booking calculations, client-side validation, localStorage persistence, dedicated single-page print vouchers, and an interactive HTTP Client-Server communication guide.

---

## 🌟 Table of Contents
1. [Project Overview & Theme](#project-overview--theme)
2. [Folder Structure](#folder-structure)
3. [Key Features & Implemented Requirements](#key-features--implemented-requirements)
4. [CSS3 Styling & Advanced Techniques](#css3-styling--advanced-techniques)
5. [Interactive Functionality & Logic](#interactive-functionality--logic)
6. [HTTP Client-Server Communication Guide](#http-client-server-communication-guide)
7. [How to Run and Test](#how-to-run-and-test)

---

## 🎨 Project Overview & Theme

- **Website Name**: WANDERLUST – Explore the World
- **Target Audience**: Domestic & International Holiday Travellers, Families, Couples, and Adventure Seekers
- **Color Palette**:
  - **Ocean Deep / Primary**: `#0c2461` / `#0a3d62` (Deep corporate ocean blue)
  - **Sky Blue / Accent**: `#00a8ff` / `#48dbfb` (Vibrant tropical sky)
  - **Sand Beige / Background**: `#fdfbf7` / `#f7f1e5` (Warm golden shore)
  - **Tropical Green**: `#10ac84` / `#1dd1a1` (Lush palms and islands)
  - **Sunset Coral / Gold**: `#ff6b6b` / `#ffd166` (Urgency badges & stars)
- **Typography**: Google Fonts `Outfit` (Headings) and `Plus Jakarta Sans` (Body)

---

## 📁 Folder Structure

```
wanderlust/
├── index.html                  # Main Semantic HTML5 Travel Portal
├── css/
│   └── style.css               # Comprehensive Modern CSS3 Stylesheet
├── js/
│   └── script.js               # Interactive Controller, Validation & Calculations
├── assets/
│   └── images/                 # Local Vector SVGs & Fallback Graphics
│       ├── logo.svg            # Agency Vector Compass Logo
│       ├── hero-bg.svg         # Hero Background Graphic
│       ├── ooty.svg            # Ooty Fallback SVG
│       ├── kodaikanal.svg      # Kodaikanal Fallback SVG
│       ├── goa.svg             # Goa Fallback SVG
│       ├── manali.svg          # Manali Fallback SVG
│       ├── kerala.svg          # Kerala Fallback SVG
│       ├── jaipur.svg          # Jaipur Fallback SVG
│       ├── bali.svg            # Bali Fallback SVG
│       ├── maldives.svg        # Maldives Fallback SVG
│       ├── hotel-*.svg         # Hotel Fallback SVGs (6 files)
│       ├── pkg-*.svg           # Package Fallback SVGs (6 files)
│       └── offer-*.svg         # Special Offers SVGs (5 files)
└── README.md                   # Comprehensive Project Documentation
```

---

## 🚀 Key Features & Implemented Requirements

### 1. Sticky Navigation Bar
- Fixed top navigation with glassmorphism blur and shadow on scroll.
- Working anchor links: `Home`, `Destinations`, `Hotels`, `Travel Packages`, `Compare`, `Attractions`, `Special Offers`, `How It Works`, `Book Now`, and `Contact`.
- Brand logo with a stylized rotating compass icon.
- Destination quick search trigger and prominent **"Plan Your Trip"** CTA button.
- Mobile responsive hamburger menu drawer.

### 2. Full-Screen Hero Section
- High-impact hero background image with deep ocean gradient overlays.
- Headings: *"Discover the World, One Journey at a Time"* with text shadows.
- Floating travel elements: animated airplane with flight path, rotating compass, clouds, and tropical island badges.
- Destination search bar (`Where to?`, `Travel Date`, `Tour Type`, `Search Trips`).
- Animated Statistics Counters:
  - **50+** Destinations
  - **100+** Travel Packages
  - **200+** Verified Hotels
  - **5,000+** Happy Travellers

### 3. Tourist Destinations Gallery
- Visual gallery featuring **8 destinations**:
  1. **Ooty** (Hill Station, Tamil Nadu)
  2. **Kodaikanal** (Hill Station, Tamil Nadu)
  3. **Goa** (Beach Paradise, Western Coast)
  4. **Manali** (Alpine Snow & Valleys, Himachal Pradesh)
  5. **Kerala** (God's Own Country, Backwaters)
  6. **Jaipur** (The Pink City, Rajasthan)
  7. **Bali** (Island of the Gods, Indonesia)
  8. **Maldives** (Tropical Atolls & Overwater Villas)
- Each card contains image, location badge, name, short description, best time to visit, starting price, and an **"Explore Destination"** button that opens a detailed modal with highlights and direct booking integration.
- Instant search filter and category buttons (`All`, `Hill Stations`, `Beaches`, `Heritage`, `International`).

### 4. Hotel Information Section
- Dedicated hotel cards featuring 6 luxury hotels:
  1. *Savoy Heritage Palace* (Ooty)
  2. *The Leela Beach Resort* (Goa)
  3. *Solang Valley Retreat* (Manali)
  4. *Kumarakom Lagoon Villas* (Kerala)
  5. *Rambagh Royal Palace* (Jaipur)
  6. *Ayana Ocean Cliff Resort* (Bali)
- Displays star ratings, location, per-night rates in Indian Rupees (₹), short descriptions, and facility badges (Free Wi-Fi, Swimming Pool, Restaurant, Air Conditioning, Parking, Room Service).
- **"View Hotel"** button updates the booking form hotel tier automatically.

### 5. Travel Packages Section
- 6 all-inclusive itineraries:
  - *Ooty Weekend Escape* (3D/2N) – ₹14,999/p
  - *Kerala Backwater Experience* (5D/4N) – ₹22,500/p
  - *Goa Beach Holiday* (4D/3N) – ₹16,800/p
  - *Manali Adventure Trip* (6D/5N) – ₹24,999/p
  - *Jaipur Heritage Tour* (4D/3N) – ₹18,200/p
  - *Bali Tropical Vacation* (7D/6N) – ₹48,500/p
- Cards display duration, included features, stay logistics, vehicle logistics, and a **"Book Package"** button that pre-selects the package in the booking planner.
- Interactive budget filter dropdown.

### 6. Travel Package Comparison Table
- Semantic HTML5 `<table>` with `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>`.
- Columns: *Package Name*, *Destination*, *Duration*, *Accommodation*, *Transportation*, *Activities Included*, and *Price / Person*.
- Styled with alternating zebra row striping, sticky header, hover highlights, and a horizontal scrolling wrapper for mobile devices.

### 7. Tourist Attractions & Agency Facilities
- **Ordered List (`<ol>`)**: Destination-specific attractions ranked by popularity with dynamic tabs (Ooty, Goa, Kerala, Manali, Jaipur, Bali).
- **Unordered List (`<ul>`)**: Categorized attraction types (Beaches, Hill Stations, Waterfalls, Historical Monuments, Adventure Activities, Wildlife Sanctuaries, Religious Places).
- **Agency Facilities**: Visual feature cards for Hotel Booking, Transportation, Tour Guide, Sightseeing, Food Arrangements, and 24/7 Travel Assistance.

### 8. Special Offers Section
- Promotional deals with discount badges and promo codes:
  - **Summer Holiday Offers** (30% OFF – Code: `SUMMER30`)
  - **Family Vacation Packages** (15% OFF – Code: `FAMILYFUN`)
  - **Honeymoon Romance** (20% OFF – Code: `HONEYMOON`)
  - **Adventure Travel Blast** (20% OFF – Code: `ADVENTURE20`)
  - **Early Booking Discounts** (Flat ₹5,000 OFF – Code: `EARLYBIRD`)
- One-click copy code button and **"Claim Offer & Book"** buttons that auto-apply the discount.

### 9. Travel Booking Form & Dynamic Cost Calculator
- HTML5 Form Controls:
  - Full Name (`type="text"`, required)
  - Email Address (`type="email"`, required)
  - Phone Number (`type="tel"`, required)
  - Destination & Package (`<select>`, required)
  - Travel Start & End Dates (`type="date"`, validation: end date > start date)
  - Number of Adults & Children (`type="number"`, children 50% fare)
  - Hotel Preference (`Standard` / `Deluxe` / `Luxury`)
  - Transportation Preference (`Bus` / `Train` / `Flight` / `Private Cab`)
  - Promo code input with instant "Apply" button
  - Special requirements (`<textarea>`)
  - Terms and Conditions checkbox
- **Dynamic Real-Time Pricing Sidebar**:
  - Live cost breakdown automatically updates whenever travellers, hotel tier, transport mode, or promo codes change.
- **Client-Side Form Validation**:
  - Validates all fields, displays clear inline error messages, and ensures date ranges and minimum traveller conditions are met.

### 10. Booking Confirmation Slip & Single-Page Print
- Generates a unique Booking ID (e.g., `WND-2026-89421`).
- Displays a dedicated booking confirmation slip containing **ONLY**:
  1. Travel agency name & logo
  2. Booking ID & Issue date
  3. Customer name
  4. Contact details (email & phone)
  5. Destination
  6. Selected package
  7. Travel dates & duration
  8. Number of travellers
  9. Hotel preference
  10. Transportation preference
  11. Total estimated amount
  12. Booking status
- **Print Confirmation Button**:
  - Uses CSS `@media print` to **strictly hide** the navigation bar, hero section, destinations, packages, comparison table, attractions, offers, booking form, and footer.
  - Prints **ONLY the single-page voucher** cleanly without blank extra pages.

### 11. LocalStorage Persistence
- On submission, booking data is automatically persisted to `localStorage`.
- When refreshing or reopening the page, a notice informs the user of their saved booking ID and provides a one-click button to reload their confirmation voucher.

---

## 🎨 CSS3 Styling & Advanced Techniques

1. **Background Images & Gradients**:
   - High-resolution hero background image layered with multi-stop linear gradients (`rgba(12, 36, 97, 0.78)` to `rgba(16, 172, 132, 0.45)`).
2. **CSS3 `border-image`**:
   - Explicitly demonstrated on `.promo-banner-card` and `.special-offer-card.featured-offer`:
     ```css
     border: 6px solid transparent;
     border-image: linear-gradient(135deg, var(--color-sky-primary), var(--color-tropical-green), var(--color-sunset-gold), var(--color-sunset-coral)) 30 stretch;
     ```
3. **Text Shadows**:
   - Multi-layered drop shadows on hero titles and section headers:
     ```css
     text-shadow: 0 4px 18px rgba(0, 0, 0, 0.65), 0 2px 4px rgba(10, 61, 98, 0.5);
     ```
4. **Hover & Transform Effects**:
   - Card lift on hover: `transform: translateY(-10px) scale(1.01);`
   - Smooth image zoom on cards: `transform: scale(1.12); transition: 0.7s;`
   - Button interactive micro-interactions: elevation, glowing shadows, and icon slides.
5. **Keyframe Animations**:
   - `@keyframes floatAirplane` (subtle translate and tilt for airplane icon)
   - `@keyframes compassSpin` (slow 360° needle rotation)
   - `@keyframes pulseBadge` (glowing scale pulse for promotional badges)
   - `@keyframes sendRequest` & `@keyframes sendResponse` (packet animation in HTTP diagram)
6. **Strict Print Media Query (`@media print`)**:
   - Strict `visibility: hidden` and `display: none !important` applied to all non-voucher elements.
   - Formatted specifically for A4 portrait printing without awkward page breaks.

---

## 🌐 HTTP Client-Server Communication Guide

The website includes a dedicated section titled **"How Online Travel Booking Works"** explaining the end-to-end HTTP architecture:

```
[ User Web Browser ]  -- (1) GET /index.html -->  [ Web / App Server ]
[ Client Device    ]  <-- (4) HTTP 200 OK ------  [ Node.js / Apache  ]
       │                                                 │
       ▼                                                 ▼
[ Submits Booking  ]  -- (6) POST /api/book --->  [ Server Queries DB ]
[ Form Data Payload]  <-- (8) HTTP 201 Voucher -  [ Locks Inventory  ]
```

### The 8 Concrete Steps Explained:
1. **User Opens Website**: Client browser resolves domain via DNS and opens a TCP/IP socket connection.
2. **Browser Sends HTTP Request**: Browser issues an `HTTP GET /index.html` request.
3. **Server Processes Request**: Web server reads request headers and locates static assets (HTML, CSS, JS).
4. **Server Sends HTTP Response**: Server sends `HTTP 200 OK` header along with the resource payload.
5. **Browser Displays Website**: Browser rendering engine constructs DOM/CSSOM trees and paints the page.
6. **User Fills Booking Form**: User inputs travel details and clicks submit, creating an `HTTP POST /api/book` payload.
7. **Server Processes Booking**: Server validates data, updates database records, and locks room inventory.
8. **Server Returns Confirmation**: Server responds with `HTTP 201 Created` returning the confirmed booking voucher.

*Interactive Feature*: An on-screen simulation button steps through all 8 stages with real-time status animation.

---

## 💻 How to Run and Test

1. **Option 1: Direct File Opening**:
   - Navigate to the `wanderlust` folder.
   - Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

2. **Option 2: Local HTTP Server**:
   - Using Node.js:
     ```bash
     npx serve wanderlust
     ```
   - Using Python:
     ```bash
     python -m http.server 8000
     ```
   - Open `http://localhost:8000/wanderlust/` in your browser.

3. **Testing Key Functionality**:
   - **Search & Filters**: Type "Goa" or "Ooty" in the search box; toggle "Hill Stations" or "Beaches".
   - **Direct Booking Integration**: Click "Book Package" on any card to see it pre-populate in the booking form.
   - **Price Calculation**: Change adults, children, hotel tier (Standard/Deluxe/Luxury), or transport mode to see the estimated amount recalculate in real-time.
   - **Validation**: Try submitting an empty form to observe HTML5 + JS custom error highlights.
   - **Confirmation & Print**: Fill in valid details, click "Submit Booking", and click "Print Booking Confirmation" to preview the clean, single-page printout.
   - **LocalStorage**: Refresh the page; notice the saved booking notification banner that lets you reopen your confirmation voucher anytime.

---
© 2026 WANDERLUST Travel Agency. All Rights Reserved.
