# XML-Based Hospital Patient Information and Medical Report Management System

A complete, interactive, and modern hospital patient information and medical diagnostic report management system developed using **XML, XSD, PHP, XML DOM, XSLT, HTML5, CSS3, and JavaScript**.

This project provides dual-mode execution:
1. **Instant Antigravity Browser Preview (`index.html`):** Immediately interactive and previewable directly in Antigravity's browser preview or any modern web browser without requiring XAMPP, Apache, MySQL, PHP server, or any installation.
2. **Full XAMPP Backend Mode (`index.php`):** Production-grade PHP backend implementation inside `index.php` utilizing PHP `DOMDocument`, `schemaValidate('patients.xsd')`, programmatic DOM manipulation, and `XSLTProcessor::transformToXML()` with `patients.xsl`.

---

## ⚡ Quick Start: How to Preview & Run

### 1. Preview Immediately in Antigravity Browser Preview (No Setup Required!)

To view and interact with the complete system right now:
1. In the Antigravity file explorer, click on **`index.html`**.
2. Click the **Browser Preview** button in Antigravity (or open `index.html` directly in your browser).
3. The application loads immediately in **Browser Preview Mode**:
   - Live dashboard metrics and statistics calculate instantly from the clinical XML data.
   - Patient cards, table views, and searches work in real time.
   - You can add new patients, run DOM operations, simulate XSD schema validation scenarios, generate official medical reports, and execute XSLT transformations—all running client-side in browser memory!

> [!NOTE]
> No installation of XAMPP, PHP, Apache, or MySQL is required to preview, test, and use the full frontend interface.

---

### 2. Running with XAMPP Later (PHP Backend Mode)

When you are ready to execute the genuine PHP backend and write XML changes directly to disk:

#### Step 1: Install and Launch XAMPP
- Download and install [XAMPP](https://www.apachefriends.org/) (PHP 7.4, 8.0, 8.1, or 8.2+).
- Open the **XAMPP Control Panel**.

#### Step 2: Enable Required PHP Extensions (`php_dom` & `php_xsl`)
PHP requires both the DOM and XSL extensions to parse schemas and execute XSLT transformations:
1. In XAMPP Control Panel, click **Config** next to Apache and select **PHP (php.ini)**.
2. Search for the following lines:
   ```ini
   extension=dom
   extension=xsl
   ```
3. If they have a semicolon (`;`) at the start, remove the semicolon to enable them:
   ```ini
   extension=dom
   extension=xsl
   ```
4. Save `php.ini` and **Restart Apache** in XAMPP Control Panel.

#### Step 3: Copy Project to `htdocs`
- Copy the entire project folder to XAMPP's web directory:
  ```
  C:\xampp\htdocs\Hospital_XML\
  ```
- Ensure file permissions allow Apache to read and write to `patients.xml` (for DOM modification operations).

#### Step 4: Open in Your Browser
Navigate to:
```
http://localhost/Hospital_XML/index.php
```
The status pill in the top-right header will illuminate:
`🔵 XAMPP PHP Backend Active (PHP 8.x)`

---

## 📁 Project Structure

```
Hospital_XML/
│
├── index.html      # Immediate browser preview entry point for Antigravity (Zero-Setup)
├── index.php       # Complete application interface, PHP XML DOM parsing, XSD validation, DOM operations, XSLT
├── style.css       # Complete responsive healthcare design system, cards, sidebar, print media rules
├── script.js       # Client-side XML DOM engine, sidebar navigation, patient search, XSD validator, XSLT engine
├── patients.xml    # Clinical XML database with 12 comprehensive patient records across 8 departments
├── patients.xsd    # W3C XML Schema Definition with data validation rules and unique ID constraint
├── patients.xsl    # XSLT 1.0 transformation stylesheet generating official HTML medical reports
└── README.md       # Project setup, execution instructions, and architectural documentation
```

---

## 🏥 Core Modules & Functional Specifications

### 1. Hospital Dashboard
- **Dynamic Metrics:** Total Patients, Total Attending Doctors, Clinical Departments, and Active Medical Reports calculated live from XML DOM data.
- **Recent Registrations:** Real-time table of recent patients with direct links to view full details.
- **Department Breakdown:** Visual progress indicators showing patient distribution across *Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, General Medicine, ENT, and Ophthalmology*.
- **Quick Actions:** Instant buttons to Add Patient, Search Records, and Run XSD Validation.

### 2. Patient Records Interface
- **Dual Display Modes:** Switch between interactive **Card Grid View** and compact **Table View**.
- **Multi-Filter System:** Live keyword search (Patient ID, Name, Doctor, Diagnosis), Department filter dropdown, and Blood Group filter dropdown.
- **Detailed Modal:** Click "Full Details" on any card to view complete demographic history, attached diagnostic tests, and the serialized XML node subtree.

### 3. Add New Patient (XML DOM Insertion)
- **Clinical Intake Form:** Validates mandatory fields, restricts age between 0 and 125, enforces valid blood types and departments.
- **Unique ID Prevention:** Prevents duplicate Patient IDs before insertion.
- **Dynamic Medical Tests:** Add or remove multiple diagnostic tests (Name, Result reading, Status).
- **XML DOM Construction:** In browser mode, uses `activeXmlDoc.createElement()`, `setAttribute()`, and `appendChild()`. In PHP mode, posts to backend endpoint where `DOMDocument::save('patients.xml')` writes permanently to disk.

### 4. Search Patient
- Multi-criteria search engine matching Patient ID, full name, clinical diagnosis, or assigned department.
- Displays full diagnostic breakdown and one-click access to generate an official medical report.

### 5. Medical Reports
- **Official Hospital Letterhead:** Features Aura Metropolitan Hospital header, ISO 9001:2015 certification stamp, reference number, and date.
- **Physician & Patient Demographics:** Clean two-column clinical layout.
- **Diagnostic Findings Table:** Comprehensive table with test names, readings, and color-coded status badges (Normal, High, Low, Critical).
- **Print & Download:** Built-in "Print Medical Report" (`window.print()` with custom `@media print` CSS rules hiding UI controls) and "Download HTML Report".

### 6. XML Schema (XSD) Validation
- **Educational Information Panel:** Explains well-formed XML syntax rules versus valid schema constraints, and how XML parsers detect structural errors.
- **7 Preset Validation Scenarios:**
  1. *Valid patients.xml Document* (Passes all checks).
  2. *Missing Required Element* (Missing `<diagnosis>`).
  3. *Invalid Age Value* (Age = 250 violates `xs:maxInclusive="125"`).
  4. *Invalid Gender Value* ("Alien" violates `xs:enumeration`).
  5. *Invalid Blood Group* ("X+" violates blood phenotype enumeration).
  6. *Missing Patient ID* (Violates `use="required"`).
  7. *Duplicate Patient ID* (Two "P001" nodes violate `xs:unique`).
- **Interactive XML Editor:** Allows typing or pasting any custom XML snippet and running live validation against `patients.xsd`.
- **PHP Implementation:** Backend validates using `DOMDocument::schemaValidate()` and extracts libxml errors.

### 7. XML DOM Operations
- **Operation 1 (Retrieve):** Searches DOM tree by Patient ID (`getElementsByTagName('patient')`), displays child nodes, and outputs the raw serialized XML node.
- **Operation 2 (Modify):** Updates patient name, age, doctor, department, or diagnosis directly in the DOM tree, displaying before-and-after XML diff.
- **Operation 3 (Add):** Programmatically constructs a `<patient>` element with sub-elements and appends it to `<hospital>`.
- **Operation 4 (Medical Tests):** Retrieves existing tests, appends a new `<test>` element via `appendChild()`, or deletes a test node via `removeChild()`.
- **Live Tree Visualizer:** Serializes the entire in-memory XML DOM hierarchy in real-time.

### 8. XSLT Transformation
- **Transformation Pipeline:** `patients.xml` + `patients.xsl` &rarr; Styled HTML Medical Report.
- **XPath Templates:** Uses `<xsl:template match="/">`, `<xsl:for-each select="hospital/patient">`, `<xsl:value-of select="...">`, and `<xsl:choose>` conditional logic for status badges.
- **Dual Execution:** Executed via native browser `window.XSLTProcessor` in preview mode, and via PHP `XSLTProcessor::transformToXML()` when hosted on XAMPP.

### 9. XML Source Viewer
- View raw code for `patients.xml`, `patients.xsd`, and `patients.xsl`.
- Features copy to clipboard with visual feedback and file download buttons.

---

## 🔒 Fictional Data Notice

All patient records, medical readings, physician names, and diagnostic histories contained in `patients.xml` and this repository are **entirely fictional demonstration data**. No real patient information is used.

---

## 🛠️ Technology Stack

| Layer | Technology | Usage |
|---|---|---|
| **Data Storage** | XML 1.0 (W3C) | Primary clinical database (`patients.xml`) |
| **Schema Validation** | XSD 1.0 (XML Schema) | Structural definition, types, and uniqueness (`patients.xsd`) |
| **Transformation** | XSLT 1.0 | XML to styled HTML transformation (`patients.xsl`) |
| **Backend Processing** | PHP 7.4 - 8.2+ | `DOMDocument`, `schemaValidate()`, `XSLTProcessor` in `index.php` |
| **DOM Manipulation** | XML DOM (PHP & JS) | `createElement()`, `appendChild()`, `getElementsByTagName()` |
| **Presentation** | HTML5 & CSS3 | Responsive healthcare UI, left sidebar, print stylesheet |
| **Client Engine** | JavaScript (ES6+) | `DOMParser`, `XMLSerializer`, event handlers, live metrics |

---

## 📦 GitHub Submission Checklist

- [x] Complete frontend available via `index.html` for instant preview
- [x] Genuine PHP backend preserved inside `index.php` for XAMPP execution
- [x] 12 realistic sample patient records across 8 medical departments
- [x] W3C valid XML Schema (`patients.xsd`) with `xs:unique` identity constraint
- [x] Functional XSLT stylesheet (`patients.xsl`) with clean XPath expressions
- [x] Tested search, filter, add patient, modify patient, XSD validation, DOM ops, and print report
- [x] Fictional data only (HIPAA/privacy compliant)
