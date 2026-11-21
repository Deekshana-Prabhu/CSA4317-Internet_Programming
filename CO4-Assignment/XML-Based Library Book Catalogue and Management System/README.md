# XML-Based Library Book Catalogue and Management System (BiblioXML)

An interactive, responsive, and modern **Library Book Catalogue and Management System** engineered using **XML, DTD, XML Schema (XSD), XML DOM, XSLT, HTML5, CSS3, JavaScript, and PHP**.

---

## 🌟 Project Highlights

- **Dual-Mode Execution**:
  1. **Instant Browser Preview**: Open `index.html` directly in any web browser without needing XAMPP, Apache, Node.js, or an external database.
  2. **Full Server-Side PHP Execution**: Deploy `index.php` into your XAMPP `htdocs` directory to experience server-side PHP `DOMDocument`, `DOMXPath`, `libxml` DTD/XSD validation, and `XSLTProcessor` file persistence.
- **Modern Theme**: Light blue, crisp white, and soft purple academic theme (`#4F46E5`, `#6366F1`, `#0EA5E9`, `#EEF2FF`) with smooth animations and subtle shadows.
- **Fixed Left Sidebar Navigation**: Responsive collapsible sidebar with active indicators, icon scaling, and mobile hamburger drawer.
- **Dynamic XML Catalogue**: 12 curated computer science book records covering Programming, AI, Machine Learning, Database Systems, Web Development, Networks, Operating Systems, Data Structures, Cybersecurity, Software Engineering, Cloud Computing, and Quantum Computing.
- **Interactive XML DOM Studio**: Retrieve nodes, live visual DOM hierarchy tree, search by ID, and mutate element values.
- **Dual Validation Testbed**: Interactive DTD (`books.dtd`) and W3C Schema (`books.xsd`) validation engine with preset rule violation scenarios and custom XML sandbox.
- **Professional XSLT Transformation**: Real-time transformation of XML catalogue into a styled HTML table with XPath sorting, aggregation, and currency formatting.
- **XML Source Viewer**: Syntax-highlighted viewer with one-click clipboard copy and file downloads.

---

## 📁 Project File Structure

```text
XML_Library/
│
├── index.html        # Direct browser preview (zero config, works in all browsers & Antigravity)
├── index.php         # Main PHP website & server-side DOM/XSLT/validation processing
├── style.css         # Modern light blue & soft purple stylesheet
├── script.js         # Browser XML engine, DOM operations, validation, XSLT & UI controller
├── books.xml         # XML database containing 12 realistic book records
├── books.dtd         # Document Type Definition (DTD) structural rules
├── books.xsd         # W3C XML Schema (XSD) datatype and occurrence facets
├── books.xsl         # XSL Transformation stylesheet generating responsive HTML table
└── README.md         # Comprehensive documentation and execution guide
```

---

## 🚀 How to Run the Project

### Option A: Direct Browser Preview (No XAMPP Required)
1. Double-click or open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Brave, Safari).
2. Or in **Google Antigravity**, use the browser preview on `index.html`.
3. All XML parsing, DOM operations, search, filters, validation tests, and XSLT transformations run client-side using JavaScript `DOMParser`, `XMLSerializer`, and browser DOM APIs.

### Option B: Full PHP / XAMPP Server Execution
1. Copy the entire project folder to your XAMPP `htdocs` directory:
   ```text
   C:\xampp\htdocs\XML_Library\
   ```
2. Start the **Apache** module from the XAMPP Control Panel.
3. Open your browser and navigate to:
   ```text
   http://localhost/XML_Library/index.php
   ```
4. In PHP mode, `index.php` provides active backend endpoints:
   - `?action=php_dom_list`: Server-side XML DOM parsing via `DOMDocument`.
   - `?action=php_dom_add`: Adds new book elements and persists them to disk (`$dom->save('books.xml')`).
   - `?action=php_dtd_validate`: Real DTD validation via `$dom->validate()`.
   - `?action=php_xsd_validate`: Real XML Schema validation via `$dom->schemaValidate('books.xsd')`.
   - `?action=php_xslt`: Compiles `books.xsl` over `books.xml` using `XSLTProcessor`.

---

## 🧩 XML Technical Specifications

### 1. XML Document (`books.xml`)
- Contains 12 books spanning major Computer Science disciplines.
- Adheres to the structure:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE library SYSTEM "books.dtd">
  <library xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="books.xsd">
      <book id="B001">
          <title>Introduction to Python Programming</title>
          <author>John Smith</author>
          <publisher>Tech Publications</publisher>
          <isbn>9781234567890</isbn>
          <price>450</price>
          <year>2024</year>
      </book>
  </library>
  ```

### 2. Document Type Definition (`books.dtd`)
- Defines root element: `<!ELEMENT library (book+)>`
- Defines child sequence: `<!ELEMENT book (title, author, publisher, isbn, price, year)>`
- Defines required ID attribute: `<!ATTLIST book id ID #REQUIRED>`
- Defines leaf text elements: `<!ELEMENT title (#PCDATA)>`, `author`, `publisher`, `isbn`, `price`, `year`.

### 3. XML Schema Definition (`books.xsd`)
- Validates data types and facets:
  - `title`, `author`, `publisher`: `xs:string` with `minLength=1`.
  - `isbn`: `xs:string` with regex pattern `(\d{10}|\d{13})`.
  - `price`: `xs:decimal` with `minExclusive="0.00"`.
  - `year`: `xs:positiveInteger` with `minInclusive="1900"` and `maxInclusive="2099"`.
  - `id`: `xs:ID` attribute matching `B[0-9]{3,}`.
  - Cardinality: `<xs:element name="book" maxOccurs="unbounded" minOccurs="1">`.

---

## ⚖️ DTD vs. XML Schema (XSD) Comparison

| Feature | DTD (Document Type Definition) | XML Schema (XSD) | Why it Matters |
| :--- | :--- | :--- | :--- |
| **Syntax** | Non-XML Declarative EBNF syntax | Standard XML syntax (`<xs:schema>`) | XSD can be manipulated by standard XML parsers and tools. |
| **Data Types** | Character data (`#PCDATA`) only | 44+ built-in types + custom facets | XSD allows exact numeric, date, and pattern validation. |
| **Occurrences** | Basic quantifiers (`?`, `*`, `+`) | Precise `minOccurs` & `maxOccurs` | XSD enforces exact business logic cardinalities. |
| **Namespaces** | No native support | Native multi-namespace support | Essential for enterprise schemas and modular schemas. |
| **Extensibility** | Rigid; non-extensible | Extensible via `extension` & `restriction` | Supports object-oriented schema inheritance. |
| **Complexity** | Lightweight and easy to read | More verbose | DTD is great for lightweight markup; XSD is the enterprise standard. |

---

## 💻 XML DOM Implementation Reference

### Client-Side JavaScript (`script.js`)
```javascript
// 1. Parsing XML
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(rawXmlString, "text/xml");

// 2. Element Retrieval
const book = xmlDoc.querySelector("book[id='B001']");
const title = book.getElementsByTagName("title")[0].textContent;

// 3. Modifying Elements
book.getElementsByTagName("price")[0].textContent = "499.00";

// 4. Adding New Element
const newBook = xmlDoc.createElement("book");
newBook.setAttribute("id", "B013");
const newTitle = xmlDoc.createElement("title");
newTitle.textContent = "New Book";
newBook.appendChild(newTitle);
xmlDoc.documentElement.appendChild(newBook);

// 5. Serialization
const serializer = new XMLSerializer();
const updatedXml = serializer.serializeToString(xmlDoc);
```

### Server-Side PHP (`index.php`)
```php
// 1. Loading XML
$dom = new DOMDocument();
$dom->load('books.xml');

// 2. Querying Elements via XPath
$xpath = new DOMXPath($dom);
$books = $xpath->query("//book[@id='B001']");

// 3. Mutating Elements
$books->item(0)->getElementsByTagName('price')->item(0)->nodeValue = "499.00";

// 4. Creating & Appending Elements
$newBook = $dom->createElement('book');
$newBook->setAttribute('id', 'B013');
$title = $dom->createElement('title', 'New Book');
$newBook->appendChild($title);
$dom->documentElement->appendChild($newBook);

// 5. Persisting to Disk
$dom->save('books.xml');
```

---

## 🎨 XSLT Transformation (`books.xsl`)

The XSLT transformation pipeline sorts book records alphabetically by title, formats currency badges, displays total books via `count(library/book)`, and computes the average price using:
```xml
<xsl:value-of select="format-number(sum(library/book/price) div count(library/book), '0.00')"/>
```

In PHP, the transformation is executed as:
```php
$proc = new XSLTProcessor();
$proc->importStylesheet($xsl);
echo $proc->transformToXML($xml);
```

---

## 🛡️ Validation Testbed Scenarios

The system includes pre-configured interactive tests:
1. **Pass Scenario**: Standard `books.xml` verified against both DTD and XSD.
2. **Missing `<author>`**: Triggers DTD sequence mismatch.
3. **Missing `id` Attribute**: Triggers DTD `#REQUIRED` attribute check.
4. **Duplicate Book ID**: Triggers DTD/XSD unique ID collision detection.
5. **Negative Price**: Triggers XSD `minExclusive="0.00"` facet violation.
6. **Invalid Publication Year**: Triggers XSD `minInclusive="1900"` facet violation.
7. **Custom XML Sandbox**: Test any arbitrary XML snippet live.

---

## 📦 GitHub Submission Checklist

- [x] `index.html` (Instant zero-config browser preview)
- [x] `index.php` (Server-side PHP XML DOM & XSLT processing)
- [x] `style.css` (Clean light blue & soft purple theme)
- [x] `script.js` (Complete client-side XML DOM & validation engine)
- [x] `books.xml` (12 sample books spanning required CS domains)
- [x] `books.dtd` (Document Type Definition)
- [x] `books.xsd` (W3C XML Schema Definition)
- [x] `books.xsl` (XSL Transformation stylesheet)
- [x] `README.md` (Detailed documentation and usage guide)
- [x] Total files kept minimal (9 files, well under the 50 file limit)
- [x] Responsive design with collapsible sidebar and mobile hamburger menu
- [x] No external database or XAMPP required for immediate evaluation

---

## 👨‍💻 Academic Information
- **Course**: Web Technologies / Internet Programming (IP)
- **Assignment**: Assignment 4 - XML-Based Library Book Catalogue and Management System
- **Technologies**: XML 1.0, DTD, XML Schema (XSD), XML DOM, XSLT 1.0, HTML5, CSS3, JavaScript (ES6+), PHP 8.x
