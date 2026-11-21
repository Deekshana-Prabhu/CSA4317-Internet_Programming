# ShopEase – Integrated E-Commerce Product and Order Management System

> **Tagline:** *"Discover. Shop. Enjoy."*  
> **Course / Assignment:** Internet Programming Lab – 10-Mark Full-Stack Project  
> **Theme:** Clean White Background with Lavender (`#8b5cf6`), Soft Purple (`#6366f1`), and Light Blue (`#0284c7`) Accents.

---

## 🌟 1. Project Overview & Architecture

**ShopEase** is a comprehensive, production-grade e-commerce web application engineered with a clean **Dual-Layer Architecture** to provide both immediate preview capabilities and full backend compliance:

1. **Browser Preview Mode (Zero-Installation Layer):**
   - Built with pure HTML5, CSS3, and JavaScript.
   - Uses browser `localStorage` and `cookies` to simulate sessions, customer registration/login, product catalog, cart persistence, checkout, and order history.
   - Demonstrates client-side XML DOM parsing, node modification, and XML Schema (XSD) validation without requiring a server or database.
   - Runs out-of-the-box directly in any modern browser or Antigravity browser preview.

2. **Actual PHP + MySQL + XML Backend Layer (XAMPP Mode):**
   - Main entry point: `index.php`.
   - Database: MySQL database `shopease_db` with 5 relational tables (`customers`, `products`, `cart`, `orders`, `order_items`).
   - Secure customer authentication with `password_hash()` (BCRYPT) and `password_verify()`.
   - Prepared statements via PDO to prevent SQL injection.
   - Database transactions (`beginTransaction()`, `commit()`, `rollBack()`) for atomic order processing and automatic inventory deduction.
   - PHP File Handling (`fopen()`, `fwrite()`, `fclose()`, `file_exists()`) generating text receipts inside the `orders/` directory.
   - PHP DOMDocument with `schemaValidate()` for server-side XSD schema validation.
   - PHP `XSLTProcessor` transforming `orders.xml` with `orders.xsl` into an official tax invoice.

---

## 📁 2. Project File Structure

```text
ShopEase/
├── index.html          # Standalone Browser Preview Mode entry point
├── index.php           # Main website and PHP backend controller
├── config.php          # Database configuration, PDO connection & session setup
├── database.sql        # MySQL database schema (shopease_db) & sample records
├── style.css           # Complete responsive stylesheet (sidebar, cards, modals, toast)
├── script.js           # Client-side preview logic, XML DOM engine, and event handlers
├── products.xml        # Well-formed XML product catalogue (16 items across 5 categories)
├── orders.xml          # Well-formed XML order repository with sample orders
├── products.xsd        # XML Schema Definition validating products.xml
├── orders.xsd          # XML Schema Definition validating orders.xml
├── orders.xsl          # XSLT stylesheet transforming XML order into HTML tax invoice
├── orders/             # Directory for generated order confirmation text reports
│   └── ORD-2026-1001.txt # Sample generated order report
└── README.md           # Complete documentation and execution guide
```

---

## 🚀 3. How to Run and Test

### Layer A: Instant Browser Preview (No XAMPP Required)
1. Open the project folder in Antigravity or your favorite code editor.
2. Open `index.html` directly in your web browser, or launch a simple local static server using:
   ```bash
   npx serve .
   # OR
   node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let f=path.join(__dirname,req.url==='/'?'index.html':req.url);fs.readFile(f,(err,data)=>{if(err){res.writeHead(404);res.end('Not Found');}else{res.writeHead(200);res.end(data);}});}).listen(8080,()=>console.log('http://localhost:8080'));"
   ```
3. Test all interactive features:
   - Browse **Home**, **Shop Products**, and **Categories**.
   - Add items to the **Shopping Cart**, increment/decrement quantities, observe live subtotal/total calculations.
   - Test **Customer Registration** and **Login** with regex validation.
   - Proceed through **Checkout** with Demo payment methods (COD, UPI demo, Card demo).
   - View, print, and download the **Official Tax Invoice**.
   - Download the generated **Order Confirmation Report (.txt)**.
   - Go to **XML Data Management** to search XML by Product/Order ID, append new nodes, and validate XML against XSD schemas!

### Layer B: Actual PHP + MySQL Execution (Using XAMPP)
1. Install and launch **XAMPP**.
2. Start the **Apache** and **MySQL** modules from the XAMPP Control Panel.
3. Open `phpMyAdmin` at `http://localhost/phpmyadmin/`.
4. Import `database.sql` into phpMyAdmin (it creates database `shopease_db` and all 5 tables with sample data).
5. Copy the project folder into your XAMPP web root:
   - `C:\xampp\htdocs\shopease\`
6. Open your browser and navigate to:
   - `http://localhost/shopease/index.php`
7. The PHP backend will connect to MySQL, manage sessions, process orders with database transactions, write confirmation reports into `orders/`, and perform server-side XML/XSLT transformations.

---

## 📋 4. Feature Implementation Summary

| Requirement | Implementation Details |
| :--- | :--- |
| **Design & UI** | Clean white background with lavender (`#8b5cf6`), soft purple (`#6366f1`), light blue (`#0284c7`), rounded cards, left sidebar navigation, top header, toast alerts. |
| **Product Catalogue** | 16 realistic products across 5 categories: *Electronics*, *Fashion*, *Home Appliances*, *Accessories*, *Beauty and Personal Care*. |
| **Search & Filters** | Search by product name, SKU / Product ID, or category; price sorting (Low to High, High to Low); availability filter. |
| **Shopping Cart** | Add to cart, quantity change (`+`/`-`), delete item, stock check (prevents order > stock), automatic delivery fee and total calculation. |
| **Authentication** | Registration & Login with regex checks (Email: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, Indian Mobile: `^[6-9]\d{9}$`). `password_hash()` in PHP. |
| **Checkout & Orders** | Demo payment simulators (COD, UPI, Card), unique Order ID generation (`ORD-2026-XXXX`), stock deduction, order history. |
| **Cookies** | Remembers customer name and preferred product category, surfaces personalized welcome greeting. |
| **File Handling** | Writes order receipt file in `orders/ORD-XXXX.txt` using `fopen()`, `fwrite()`, `fclose()`. Client-side download blob in preview mode. |
| **MySQL Database** | 5 tables: `customers`, `products`, `cart`, `orders`, `order_items`. Prepared statements and transactions. |
| **XML & XSD** | `products.xml` & `orders.xml` validated against `products.xsd` & `orders.xsd`. Interactive validation tool with error reporting. |
| **XML DOM Operations** | Search XML by Product ID / Order ID, append new `<product>` node to DOM tree, serialize XML. |
| **XSLT Invoice** | `orders.xsl` transforms XML order into a professional, printable HTML tax invoice with Print and Download options. |

---

## 👤 Sample Login Credentials (Demo Customer)

- **Email:** `rahul.sharma@example.com`
- **Password:** `password123`
- *(Or register any new customer account with an Indian mobile number and valid email address)*
