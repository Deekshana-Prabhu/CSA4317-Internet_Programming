# WEBPROTOCOL – HTTP Communication & Data Analytics

**Tagline:** Understand. Connect. Analyze.

An interactive, responsive educational website built using **HTML5, CSS3, and Vanilla JavaScript** that explains HTTP communication and demonstrates data warehousing and OLAP operations.

---

## 📂 Project Structure

```text
WEBPROTOCOL/
│
├── index.html       # Semantic structure and all educational content
├── style.css        # Responsive styling (light blue & white with blue & purple accents)
├── script.js        # Navigation, clipboard copy, and dynamic OLAP calculations
├── data.js          # Sample retail sales dataset for data warehouse & OLAP
└── README.md        # Project overview and run instructions
```

---

## 🚀 How to Run the Website

1. No server, Node.js, npm, or installation is required.
2. Directly open `index.html` by double-clicking it or right-clicking and selecting **Open with Google Chrome / Microsoft Edge / Firefox**.
3. The website runs completely offline without any external dependencies or network requirements.

---

## 📘 Key Topics Covered

### 1. HTTP Communication
* **HTTP Request Message:** Request Line (`GET /products HTTP/1.1`), Request Headers (`Host`, `User-Agent`, `Content-Type`), Blank Line (`\r\n`), and Message Body (`POST /login` example).
* **HTTP Response Message:** Status Line (`HTTP/1.1 200 OK`), Response Headers (`Content-Type`, `Content-Length`, `Server`), Blank Line, and Response Body.
* **HTTP Request Methods:** Interactive explanation of `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
* **HTTP Status Codes:** Cards for `200`, `201`, `301`, `400`, `401`, `403`, `404`, `500`, `502`, and `503`.
* **Working Copy Buttons:** Quick 1-click clipboard copy with visual confirmation.

### 2. Retail Sales Data Warehouse
* **Snowflake Schema:** Visual schema diagram showing the central `FACT_SALES` table connected to normalized dimension tables (`DIM_DATE`, `DIM_PRODUCT`, `DIM_CUSTOMER`, `DIM_REGION`).
* **ETL Pipeline:** Three connected stages:
  1. **EXTRACT:** Ingest sales records from billing systems, customer CRM data, and product catalogs.
  2. **TRANSFORM:** Deduplicate records, handle nulls, standardize dates, categorize age groups, and calculate `Total_Revenue = Quantity * Unit_Price`.
  3. **LOAD:** Insert cleaned records into dimension tables and store transactions into `FACT_SALES`.
* **OLAP Operations:**
  * **ROLL-UP:** Aggregates transactional records to analyze total revenue across **North, South, East, and West** regions, complete with dynamic bar charts and summary tables.
  * **DICE:** Dynamically filters sales across customer **Age Groups** (`Below 20`, `20–30`, `31–45`, `Above 45`) and **Product Categories** (`Electronics`, `Clothing`, `Furniture`, `Groceries`) with interactive dropdown selectors.
* **Business Insights:** Practical, actionable points for Marketing, Inventory, Regional Analysis, and Demographic Targeting.

---

## 💻 Technologies Used
* **HTML5:** Semantic markup and clean structure.
* **CSS3:** Custom properties (CSS variables), Flexbox, CSS Grid, and responsive media queries.
* **Vanilla JavaScript (ES6+):** Dynamic DOM manipulation, event listeners, and array aggregation (`filter`, `reduce`, `map`).
