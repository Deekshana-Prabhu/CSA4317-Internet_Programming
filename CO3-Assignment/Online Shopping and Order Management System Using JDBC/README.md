# SHOPZONE - Online Shopping and Order Management System Using JDBC

A modern, attractive, and complete e-commerce web application developed using **Java Servlets**, **JSP (JavaServer Pages)**, **JDBC (Java Database Connectivity)**, and **MySQL**.

---

## 🌟 Key Features & Specifications

### 1. UI Design & Modern Theme
- **Color Scheme**: Clean light blue (`#3B82F6`), pure white (`#FFFFFF`), and soft lavender accents (`#8B5CF6`, `#EDE9FE`, `#F5F3FF`).
- **Sidebar Navigation**: Sleek, sticky **vertical sidebar navigation** instead of traditional top bars, with smooth mobile collapsible drawer.
- **Product Presentation**: Modern rounded product cards (`16px border-radius`), crystal-clear vector SVG illustrations, dynamic inventory badges, and smooth hover micro-interactions.
- **Responsive Layout**: Designed for desktops, tablets, and smartphones without dark themes or overly complex dashboard clutter.

### 2. Full-Stack E-Commerce Architecture
- **Home Page (`index.jsp`)**: Hero welcome banner, category quick tiles, real-time featured products directly queried from MySQL, quick cart counter, and promotional highlights.
- **Customer Registration (`register.jsp` & `RegisterServlet.java`)**:
  - Automatically generates unique Customer IDs (e.g. `CUST1001`, `CUST1002`).
  - Strict validations: Non-empty fields, valid email format regex, 10-digit mobile number, and password match.
  - Prevents duplicate email registration.
- **Customer Authentication (`login.jsp` & `LoginServlet.java`)**:
  - Authenticates against hashed/stored passwords using JDBC `PreparedStatement`.
  - Manages HTTP session lifecycle and logout action.
  - Pre-populated test customer credentials ready for one-click evaluation.
- **Product Catalog & Search (`products.jsp` & `ProductServlet.java`)**:
  - Categorized catalog: **Electronics**, **Fashion**, **Home Appliances**, **Books**, and **Accessories**.
  - Dynamic filtering by category and live keyword search via HTTP `GET` request.
  - Includes sample products: Wireless Headphones (₹1,500), Smart Watch (₹2,500), Laptop (₹45,000), Backpack (₹999), Bluetooth Speaker (₹1,200), Running Shoes (₹1,800), Smartphone (₹15,000), Keyboard (₹850), and more.
- **Shopping Cart (`cart.jsp` & `CartServlet.java`)**:
  - Add to cart, increase/decrease item quantities with `+` and `−` steppers.
  - Real-time subtotal and grand total calculations.
  - **Stock Limit Enforcement**: Prevents ordering quantities greater than available inventory.
  - Empty cart state with "Continue Shopping" CTA.
- **Checkout & Order Placement (`checkout.jsp` & `OrderServlet.java`)**:
  - Collects recipient details (pre-filled for logged-in customers), delivery address, mobile, and payment method (**Cash on Delivery**, **UPI**, **Credit/Debit Card**).
  - Submits via HTTP `POST` to `OrderServlet`.
  - **Database Transactions (`conn.setAutoCommit(false)`)**:
    - Atomic insertion into `orders` and `order_items` tables.
    - Automatic inventory deduction in `products` (`stock = stock - quantity`).
    - Automatic rollback if stock is insufficient or on any error.
  - Generates unique Order IDs (e.g. `ORD-20261118-4921`).
- **Order Summary & Purchase History (`order-success.jsp`, `my-orders.jsp`, `PurchaseHistoryServlet.java`)**:
  - Professional order summary displaying Order ID, Customer Name, Products, Quantities, Unit Prices, Total Amount, Payment Method, Order Date, and Confirmed Status.
  - Dedicated "My Orders" purchase history page retrieving all previous purchases from MySQL.
  - One-click print invoice receipt capability.

---

## 🗄️ Database Design (`shopping_db`)

The project uses a normalized MySQL relational database schema with foreign keys and cascading constraints:

### 1. `customers` Table
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `customer_id` | VARCHAR(20) | PRIMARY KEY | Unique ID (e.g. CUST1001) |
| `customer_name` | VARCHAR(100) | NOT NULL | Customer Full Name |
| `email` | VARCHAR(100) | UNIQUE | Customer Email (Login ID) |
| `mobile` | VARCHAR(15) | NOT NULL | 10-Digit Mobile Number |
| `password` | VARCHAR(100) | NOT NULL | Account Password |
| `address` | TEXT | NOT NULL | Complete Delivery Address |
| `created_at` | TIMESTAMP | DEFAULT | Registration Timestamp |

### 2. `products` Table
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `product_id` | VARCHAR(20) | PRIMARY KEY | Product ID (e.g. P101) |
| `product_name` | VARCHAR(150) | NOT NULL | Product Title |
| `category` | VARCHAR(50) | NOT NULL | Category Name |
| `description` | TEXT | NULL | Item Description |
| `price` | DECIMAL(10,2) | NOT NULL | Unit Price in ₹ |
| `stock` | INT | NOT NULL | Available Inventory Count |
| `image` | VARCHAR(255) | NOT NULL | Relative Image File Path |

### 3. `orders` Table
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `order_id` | VARCHAR(30) | PRIMARY KEY | Order ID (e.g. ORD-20261118-1001) |
| `customer_id` | VARCHAR(20) | FOREIGN KEY | Links to `customers(customer_id)` |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Total Order Value in ₹ |
| `payment_method` | VARCHAR(50) | NOT NULL | COD / UPI / Card |
| `order_date` | DATETIME | DEFAULT | Order Placement Timestamp |
| `order_status` | VARCHAR(30) | DEFAULT | Status (e.g. Confirmed) |

### 4. `order_items` Table
| Column Name | Data Type | Key | Description |
| :--- | :--- | :--- | :--- |
| `order_item_id` | INT | AUTO_INCREMENT PK | Line Item ID |
| `order_id` | VARCHAR(30) | FOREIGN KEY | Links to `orders(order_id)` |
| `product_id` | VARCHAR(20) | FOREIGN KEY | Links to `products(product_id)` |
| `quantity` | INT | NOT NULL | Quantity Ordered |
| `price` | DECIMAL(10,2) | NOT NULL | Unit Price at time of order |

---

## 📁 Project Directory Structure

```
Online Shopping and Order Management System Using JDBC/
├── index.jsp                           # Home page with hero banner & featured products
├── register.jsp                        # Customer registration form
├── login.jsp                           # Customer login form & demo credentials
├── products.jsp                        # Product catalogue with category filter & search
├── cart.jsp                            # Interactive shopping cart with quantity steppers
├── checkout.jsp                        # Checkout & payment method selection
├── order-success.jsp                   # Order confirmation receipt & summary
├── my-orders.jsp                       # Customer purchase history view
├── css/
│   └── style.css                       # Modern light blue & lavender theme styles
├── js/
│   └── script.js                       # Mobile drawer, form validations, & cart stepper
├── images/
│   ├── logo.svg                        # SHOPZONE brand vector logo
│   └── products/                       # High-resolution vector product illustrations
│       ├── headphones.svg
│       ├── smartwatch.svg
│       ├── laptop.svg
│       ├── backpack.svg
│       ├── speaker.svg
│       ├── shoes.svg
│       ├── smartphone.svg
│       ├── keyboard.svg
│       ├── microwave.svg
│       ├── coffeemaker.svg
│       ├── book_java.svg
│       ├── book_code.svg
│       ├── wallet.svg
│       └── shirt.svg
├── src/
│   ├── DatabaseConnection.java         # Root JDBC connection wrapper
│   ├── RegisterServlet.java            # Root Registration servlet wrapper
│   ├── LoginServlet.java               # Root Login servlet wrapper
│   ├── ProductServlet.java             # Root Product retrieval servlet wrapper
│   ├── OrderServlet.java               # Root Order placement servlet wrapper
│   ├── PurchaseHistoryServlet.java     # Root Order history servlet wrapper
│   └── com/shopzone/
│       ├── model/                      # Java Model Beans
│       │   ├── Customer.java
│       │   ├── Product.java
│       │   ├── CartItem.java
│       │   ├── Cart.java
│       │   ├── Order.java
│       │   └── OrderItem.java
│       ├── util/
│       │   └── DatabaseConnection.java # Database connection factory
│       ├── dao/
│       │   ├── CustomerDAO.java        # Customer JDBC operations
│       │   ├── ProductDAO.java         # Product JDBC operations
│       │   └── OrderDAO.java           # Order placement & transaction logic
│       └── servlet/
│           ├── RegisterServlet.java    # POST /register
│           ├── LoginServlet.java       # POST /login, GET /logout
│           ├── ProductServlet.java     # GET /products
│           ├── CartServlet.java        # POST & GET /cart-action
│           ├── OrderServlet.java       # POST /order
│           └── PurchaseHistoryServlet.java # GET /my-orders
├── WEB-INF/
│   ├── web.xml                         # Deployment descriptor (servlets & mappings)
│   ├── classes/                        # Compiled Java .class files
│   └── lib/                            # MySQL Connector/J driver & dependencies
├── database/
│   └── shopping_db.sql                 # MySQL schema, tables, & seed data
├── pom.xml                             # Maven project descriptor
├── build.bat                           # One-click Windows build script
└── README.md                           # Documentation & execution guide
```

---

## 🚀 Setup & Execution Guide

### Step 1: Set Up MySQL Database
1. Open MySQL Command Line Client, MySQL Workbench, or phpMyAdmin.
2. Run the provided SQL script:
   ```sql
   SOURCE database/shopping_db.sql;
   ```
   *Or copy-paste the contents of `database/shopping_db.sql` into your SQL query tab and click **Execute**.*
3. Verify that the tables (`customers`, `products`, `orders`, `order_items`) have been created with initial seed data.

### Step 2: Configure Database Credentials (if needed)
Open `src/com/shopzone/util/DatabaseConnection.java`:
```java
private static final String DB_USER = "root";     // Your MySQL username
private static final String DB_PASSWORD = "root"; // Your MySQL password (or "" if blank)
```
*(The utility automatically tries an empty password `""` if `"root"` fails, which works out-of-the-box with XAMPP/WAMP).*

### Step 3: Run in Eclipse IDE (Recommended)
1. Launch **Eclipse IDE for Enterprise Java and Web Developers**.
2. Click **File** -> **Open Projects from File System...** -> select this project folder.
3. Right-click the project -> **Properties** -> **Targeted Runtimes** -> check **Apache Tomcat v9.0** (or Tomcat 8.5/10).
4. Right-click `WEB-INF/lib/` -> ensure `mysql-connector-j-8.x.jar` is present in `WEB-INF/lib/` or in Tomcat's `lib/` folder.
5. Right-click `index.jsp` -> **Run As** -> **Run on Server**.
6. Access the web app in your browser:
   ```
   http://localhost:8080/ShopZone/
   ```

### Step 4: Run in IntelliJ IDEA
1. Open IntelliJ IDEA -> **Open** -> select this directory.
2. If opened as a Maven project, IntelliJ will automatically resolve dependencies from `pom.xml`.
3. Go to **Run** -> **Edit Configurations...** -> click **+** -> **Tomcat Server** -> **Local**.
4. In the **Deployment** tab, click **+** -> **Artifact** -> choose `ShopZone:war exploded`.
5. Click **Run** or **Debug**.

### Step 5: Direct Apache Tomcat Deployment
1. If compiling manually, run `build.bat` (or compile with `javac -d WEB-INF/classes ...`).
2. Copy the entire project folder into your Tomcat `webapps/` directory:
   ```
   <Tomcat_Home>/webapps/ShopZone
   ```
3. Copy `mysql-connector-j-8.x.jar` into `<Tomcat_Home>/lib/`.
4. Start Tomcat via `<Tomcat_Home>/bin/startup.bat`.
5. Open your browser and navigate to:
   ```
   http://localhost:8080/ShopZone/
   ```

---

## 🧪 Testing & Verification Checklist

| Test Scenario | Action | Expected Result |
| :--- | :--- | :--- |
| **1. Product Retrieval** | Open `index.jsp` or click "Browse Products" | Products display with images, prices in ₹, stock counts, and categories from MySQL. |
| **2. Product Search** | Search for "headphones" or filter by "Electronics" | Displays matching items using `ProductServlet` via HTTP GET. |
| **3. Registration** | Register with a new name, email, and 10-digit mobile | System auto-generates Customer ID, saves to MySQL, and redirects to login with success alert. |
| **4. Duplicate Check** | Attempt to register with the same email | Validation error displayed: "An account with this email is already registered." |
| **5. Login** | Log in with `rahul@example.com` / `password123` | Session initialized, customer name and Customer ID displayed in sidebar footer. |
| **6. Cart Operations** | Add Laptop & Headphones, change quantity with `+` and `−` | Subtotal and grand total update automatically; stock limit prevents exceeding available quantity. |
| **7. Order Placement** | Proceed to checkout, select COD/UPI/Card, click "Place Order" | Order inserted into MySQL `orders` & `order_items`, stock deducted in `products`, redirected to `order-success.jsp`. |
| **8. Purchase History** | Click "My Orders" in the vertical sidebar | Displays previous orders with item names, quantities, dates, and order statuses. |
