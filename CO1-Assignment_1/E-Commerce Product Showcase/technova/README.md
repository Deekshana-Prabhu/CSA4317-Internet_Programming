# TECHNOVA – Electronics Store
### Complete, Modern, Visually Attractive & Fully Functional E-Commerce Product Showcase Website

**TECHNOVA** is a modern electronics retail showcase website developed with semantic **HTML5**, advanced **CSS3**, and modular vanilla **JavaScript**. Designed to meet professional e-commerce standards and all academic requirements for an Internet Programming college project.

---

## 🌟 Key Features & Functional Modules

1. **Modern Brand Identity & Theme**:
   - Palette: Dark Navy Blue (`#0a192f`, `#0f172a`), Electric Blue (`#00d2ff`, `#2563eb`), Neon Cyan (`#00f5d4`), and Clean Light Slate (`#f8fafc`).
   - Clean card-based layout, high-density specifications, responsive typography (Poppins and Inter).
   - High-resolution real product photography with zero broken images (supported by instant vector SVG fallback assets).

2. **Sticky Navigation Bar**:
   - Sticky header with glassmorphism blur and dynamic box shadow on scroll.
   - Navigation links: **Home**, **Products**, **Categories**, **Offers**, **Compare Products**, **Customer Enquiry**, and **Contact**.
   - Real-time product search bar with instant filter linking.
   - Interactive shopping cart button with live count badge and pulse animation.
   - "Explore Products" call-to-action button.
   - Responsive mobile hamburger menu with smooth transitions.

3. **Hero Section & Animated Counters**:
   - Catchy heading: *"Upgrade Your World with Smarter Technology"*.
   - Subtitle: *"Discover the Latest Electronics at Unbeatable Prices."*
   - Interactive "Explore Products" and "View Offers" buttons.
   - 3D floating electronic gadgets banner with glassmorphism badges and keyframe float animation.
   - Promotional badge: *"New Arrivals – Up to 30% OFF"* with glowing pulse effect.
   - Animated statistics counters using `IntersectionObserver`:
     - **100+** Products
     - **20+** Top Brands
     - **500+** Happy Customers
     - **24/7** Customer Support

4. **Product Categories (HTML5 Lists & Filter Engine)**:
   - Built using semantic HTML5 lists (`<ul class="categories-list">` with `<li>` wrapping category cards).
   - 8 major categories:
     - 📱 Smartphones
     - 💻 Laptops
     - 🎧 Headphones
     - ⌚ Smart Watches
     - 📱 Tablets
     - 📷 Cameras
     - 🔊 Speakers
     - 🎮 Gaming Accessories
   - Clicking any category triggers dynamic product filtering and smoothly scrolls to the products section.

5. **Featured Products Catalog (14 Flagship Devices)**:
   - 14 realistic products with prices in Indian Rupees (₹), original MRP, discount percentages, star ratings, and detailed specs:
     1. **Apple iPhone 16** (₹79,999)
     2. **Samsung Galaxy S25** (₹84,999)
     3. **OnePlus 13** (₹64,999)
     4. **MacBook Air M4** (₹1,14,900)
     5. **HP Pavilion 15 Laptop** (₹68,500)
     6. **Dell Inspiron 15 Laptop** (₹62,990)
     7. **Sony WH-1000XM5 Headphones** (₹29,990)
     8. **Apple AirPods Pro (2nd Gen)** (₹22,900)
     9. **Samsung Galaxy Watch 7** (₹27,999)
     10. **Apple iPad Air (M2)** (₹59,900)
     11. **Canon EOS R50 Mirrorless Camera** (₹58,990)
     12. **JBL Charge 5 Bluetooth Speaker** (₹14,999)
     13. **Razer BlackWidow V4 Gaming Keyboard** (₹12,499)
     14. **Logitech G502 X PLUS Gaming Mouse** (₹11,995)
   - Every product card features:
     - Real product image with SVG fallback
     - Brand and category tags
     - Current price in ₹ and strikethrough original price
     - Discount pill (`% OFF`) and savings amount
     - Star ratings with review count
     - Short specification preview
     - **View Details** button (opens rich modal with hardware specs table)
     - **Add to Cart** button with toast notifications
     - **Send Product Enquiry** button (pre-selects the product in the enquiry form)

6. **Product Search & Multi-Filter Engine**:
   - Real-time search by product name, brand, or feature keyword.
   - Category filter pills with active state indicators.
   - Brand dropdown filter (Apple, Samsung, OnePlus, HP, Dell, Sony, Canon, JBL, Razer, Logitech).
   - Sorting options: Price (Low to High, High to Low), Customer Rating, Biggest Discount, and Featured.
   - Empty state message with a one-click "Reset All Filters" button.

7. **Product Specifications Matrix (HTML5 Table)**:
   - Clean comparison table built with semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>`.
   - Columns: Product Name, Brand, Processor, RAM, Storage, Display, Battery, and Price.
   - Styled with CSS zebra striping (`tbody tr:nth-child(even)`), hover highlights, and responsive horizontal scrolling (`.table-responsive`).

8. **Special Offers & Countdown Timer**:
   - Highlight promotional banner featuring CSS3 `border-image` with multi-stop linear gradient.
   - Real-time countdown timer ticking down dynamically (Hours, Minutes, Seconds).
   - Promotional offer cards for Mega Audio Fest and Student Discounts with working navigation buttons.

9. **Fully Functional Shopping Cart (`localStorage`)**:
   - Slide-over cart drawer with backdrop overlay.
   - Quantity controls: Increment (`+`), Decrement (`-`), and Remove item.
   - Automatic calculations for Subtotal, Total Savings, Free Delivery, and Estimated Grand Total.
   - Persists state across browser reloads using `localStorage`.
   - Dynamic cart badge count in the header navbar.
   - Empty cart illustration and button to browse electronics.
   - **Convert to Order Enquiry** button to export cart items into the enquiry form!

10. **Customer Enquiry Form with Dedicated Receipt Confirmation**:
    - HTML5 inputs: `text`, `email`, `tel` (pattern for 10-digit mobile number), `number`, and `select`.
    - Dropdown dynamically populated with store catalog items.
    - Required field validation and real-time feedback.
    - Generates unique Enquiry IDs: `TECH-ENQ-2026-XXXXX`.
    - **Confirmation Receipt Modal**: Displays **ONLY** the submitted customer details and unique enquiry ID (no full-page reloads).
    - Built-in **Print Receipt** feature and storage in `localStorage`.

11. **Contact & Comprehensive Footer**:
    - Store address in Bangalore Cyber City, support emails, toll-free number, and business hours.
    - Social media icon buttons, quick links, category navigation, and project copyright.

---

## 🎨 CSS3 Concepts Implemented

| CSS3 Feature | Implementation Location in `css/style.css` | Description |
| :--- | :--- | :--- |
| **Border Images** | `.promotional-highlight-banner` | `border-image: linear-gradient(45deg, #00d2ff, #00f5d4, #2563eb, #ec4899) 1;` |
| **Background Gradients** | `#hero`, `#offers`, `.btn-primary`, `.enquiry-sidebar` | Multi-stop `linear-gradient()` and `radial-gradient()` tech mesh patterns |
| **Box Shadows** | `.product-card`, `.site-header.nav-scrolled`, `.cart-btn`, `.btn-primary` | Multi-layered elevations and electric blue glowing shadows (`0 0 25px rgba(...)`) |
| **Text Effects** | `.hero-title`, `.gradient-text`, `.product-title` | `text-shadow`, `-webkit-background-clip: text`, and `text-overflow: ellipsis` |
| **Transitions** | `.product-card`, `.nav-link`, `.btn`, `.cart-drawer-panel` | Smooth `cubic-bezier(0.4, 0, 0.2, 1)` timing on hover and transform states |
| **Transformations** | `.product-card:hover`, `.product-image`, `.category-img-box` | `scale(1.08)`, `translateY(-8px)`, `rotate(4deg)` 3D transformations |
| **Keyframe Animations** | `@keyframes floatGadget`, `@keyframes pulseGlow` | Smooth continuous floating devices and pulsing promotional badges |

---

## 📚 CSS Cascading & Inheritance Demonstration

The stylesheet `css/style.css` contains dedicated academic comments explaining:
- **Global Inheritance**: Base typography (`font-family`, `font-size`, `line-height`, `color`) defined in `body` inherits naturally down to child elements (`h1`-`h6`, `p`, `span`, `li`, `td`).
- **Specificity Hierarchy**:
  1. Element selector: `h1`
  2. Class selector: `.section-title`
  3. ID selector: `#hero h1` (overrides general heading styles with specific electric blue text glow)
- **Cascade Overrides**: Component classes override generic base rules cleanly without needing `!important`.

---

## 📁 Project Directory Structure

```
technova/
├── index.html              # Main HTML5 application file
├── css/
│   └── style.css           # Master CSS3 stylesheet with all animations & rules
├── js/
│   └── script.js           # Complete vanilla JS engine (Cart, Filter, Enquiry, Modals)
├── assets/
│   └── images/             # Real SVG & vector device graphics
│       ├── technova-logo.svg
│       ├── hero-gadgets.svg
│       ├── cat-smartphones.svg
│       ├── cat-laptops.svg
│       ├── cat-headphones.svg
│       ├── cat-watches.svg
│       ├── cat-tablets.svg
│       ├── cat-cameras.svg
│       ├── cat-speakers.svg
│       ├── cat-gaming.svg
│       ├── iphone-16.svg
│       ├── galaxy-s25.svg
│       ├── oneplus-13.svg
│       ├── macbook-air-m4.svg
│       ├── hp-pavilion.svg
│       ├── dell-inspiron.svg
│       ├── sony-wh1000xm5.svg
│       ├── airpods-pro.svg
│       ├── galaxy-watch7.svg
│       ├── ipad-air.svg
│       ├── canon-eos-r50.svg
│       ├── jbl-charge5.svg
│       ├── razer-keyboard.svg
│       ├── logitech-mouse.svg
│       ├── offer-banner-1.svg
│       └── offer-banner-2.svg
└── README.md               # Project documentation and setup guide
```

---

## 🚀 How to Run the Website

### Option 1: Running with WAMP (Windows)
1. Copy the entire `technova` folder to your WAMP `www` directory:
   ```
   C:\wamp64\www\technova
   ```
2. Start the WAMP server (ensure the WAMP icon turns green).
3. Open any browser (Google Chrome, Microsoft Edge, Mozilla Firefox) and navigate to:
   ```
   http://localhost/technova/
   ```

### Option 2: Running with LAMP (Linux / Ubuntu)
1. Copy the `technova` directory to your Apache web root:
   ```bash
   sudo cp -r technova /var/www/html/technova
   ```
2. Set proper directory permissions:
   ```bash
   sudo chmod -R 755 /var/www/html/technova
   ```
3. Open your browser and navigate to:
   ```
   http://localhost/technova/
   ```

### Option 3: Direct Browser Launch / Local Server
- Simply double-click `technova/index.html` or open it directly in any modern web browser.
- Alternatively, you can use Python or Node.js built-in HTTP server:
  ```bash
  # Inside the technova folder:
  npx serve .
  # or
  python -m http.server 8000
  ```

---

## 🧪 Testing Checklist

- [x] All 7 sticky navigation links smooth-scroll to their respective sections.
- [x] Live search filters products instantly by name, brand, or feature keyword.
- [x] All 8 category cards and filter pills accurately filter the product catalog.
- [x] Sort by price (low to high & high to low), rating, and discount works.
- [x] Add to Cart adds items, calculates quantities, updates total in ₹, and persists on page refresh.
- [x] Cart drawer opens, allows increment/decrement/remove, and checkout converts items to enquiry.
- [x] Product Specifications table features 8 columns with zebra striping and responsive horizontal scrolling.
- [x] Customer Enquiry form validates required fields, email format, and 10-digit phone number.
- [x] Enquiry generates unique reference ID `TECH-ENQ-2026-XXXXX` and displays **ONLY** submitted details in the receipt modal.
- [x] Print button allows printing the customer enquiry receipt.
- [x] CSS3 `border-image`, text shadows, keyframe animations, and 3D transforms render cleanly.
- [x] Responsive layout functions seamlessly on Desktop, Tablet, and Mobile screens.
