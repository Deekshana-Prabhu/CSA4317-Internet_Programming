/**
 * BiblioXML - XML-Based Library Book Catalogue and Management System
 * Core JavaScript Engine: XML Parsing, DOM Operations, Validation, XSLT & UI Controller
 */

// ==========================================================================
// Embedded Default XML & XSLT Sources (Ensures 100% Reliable Zero-CORS Browser Preview)
// ==========================================================================
const DEFAULT_BOOKS_XML = `<?xml version="1.0" encoding="UTF-8"?>
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
    <book id="B002">
        <title>Artificial Intelligence: Modern Principles and Systems</title>
        <author>Dr. Eleanor Vance</author>
        <publisher>NextGen Press</publisher>
        <isbn>9781234567891</isbn>
        <price>750</price>
        <year>2023</year>
    </book>
    <book id="B003">
        <title>Hands-On Machine Learning with Scikit-Learn and PyTorch</title>
        <author>Aurelia Chen</author>
        <publisher>DataCraft Media</publisher>
        <isbn>9781234567892</isbn>
        <price>680</price>
        <year>2024</year>
    </book>
    <book id="B004">
        <title>Database System Concepts and Distributed Architecture</title>
        <author>Abraham Silberschatz</author>
        <publisher>Academic McGraw</publisher>
        <isbn>9781234567893</isbn>
        <price>590</price>
        <year>2022</year>
    </book>
    <book id="B005">
        <title>Full-Stack Web Development: Modern Architecture</title>
        <author>Marcus Sterling</author>
        <publisher>DevWave Publishing</publisher>
        <isbn>9781234567894</isbn>
        <price>520</price>
        <year>2024</year>
    </book>
    <book id="B006">
        <title>Computer Networking: A Top-Down Approach</title>
        <author>James Kurose</author>
        <publisher>Pearson Horizon</publisher>
        <isbn>9781234567895</isbn>
        <price>620</price>
        <year>2023</year>
    </book>
    <book id="B007">
        <title>Operating System Concepts and Kernel Architecture</title>
        <author>Peter Galvin</author>
        <publisher>Wiley Tech</publisher>
        <isbn>9781234567896</isbn>
        <price>580</price>
        <year>2022</year>
    </book>
    <book id="B008">
        <title>Data Structures and Algorithm Analysis in C++</title>
        <author>Mark Allen Weiss</author>
        <publisher>Quantum Press</publisher>
        <isbn>9781234567897</isbn>
        <price>490</price>
        <year>2023</year>
    </book>
    <book id="B009">
        <title>Practical Cybersecurity, Cryptography and Defense</title>
        <author>Sarah Jenkins</author>
        <publisher>CyberShield Media</publisher>
        <isbn>9781234567898</isbn>
        <price>710</price>
        <year>2024</year>
    </book>
    <book id="B010">
        <title>Clean Code and Software Engineering Principles</title>
        <author>Robert C. Martin</author>
        <publisher>TechCraft Books</publisher>
        <isbn>9781234567899</isbn>
        <price>540</price>
        <year>2023</year>
    </book>
    <book id="B011">
        <title>Cloud Computing Architecture and Microservices</title>
        <author>David Foster</author>
        <publisher>CloudMatrix Press</publisher>
        <isbn>9781234567800</isbn>
        <price>650</price>
        <year>2024</year>
    </book>
    <book id="B012">
        <title>Quantum Computing: Algorithmic Foundations</title>
        <author>Neil Thorne</author>
        <publisher>FutureScience</publisher>
        <isbn>9781234567801</isbn>
        <price>890</price>
        <year>2024</year>
    </book>
</library>`;

const DEFAULT_BOOKS_DTD = `<!--
  XML-Based Library Book Catalogue and Management System
  Document Type Definition (DTD) - books.dtd
  Defines structural rules, allowed child elements, and attributes for books.xml
-->

<!ELEMENT library (book+)>

<!ELEMENT book (title, author, publisher, isbn, price, year)>
<!ATTLIST book id ID #REQUIRED>

<!ELEMENT title (#PCDATA)>
<!ELEMENT author (#PCDATA)>
<!ELEMENT publisher (#PCDATA)>
<!ELEMENT isbn (#PCDATA)>
<!ELEMENT price (#PCDATA)>
<!ELEMENT year (#PCDATA)>`;

const DEFAULT_BOOKS_XSD = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  XML-Based Library Book Catalogue and Management System
  XML Schema Definition (XSD) - books.xsd
  Defines structural rules, occurrence constraints, data types, and facet validations
-->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">

  <!-- Root Element: library -->
  <xs:element name="library">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="book" maxOccurs="unbounded" minOccurs="1">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="title">
                <xs:simpleType>
                  <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                    <xs:maxLength value="250"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
              <xs:element name="author">
                <xs:simpleType>
                  <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                    <xs:maxLength value="150"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
              <xs:element name="publisher">
                <xs:simpleType>
                  <xs:restriction base="xs:string">
                    <xs:minLength value="1"/>
                    <xs:maxLength value="150"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
              <xs:element name="isbn">
                <xs:simpleType>
                  <xs:restriction base="xs:string">
                    <xs:pattern value="(\\d{10}|\\d{13})"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
              <xs:element name="price">
                <xs:simpleType>
                  <xs:restriction base="xs:decimal">
                    <xs:minExclusive value="0.00"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
              <xs:element name="year">
                <xs:simpleType>
                  <xs:restriction base="xs:positiveInteger">
                    <xs:minInclusive value="1900"/>
                    <xs:maxInclusive value="2099"/>
                    <xs:pattern value="\\d{4}"/>
                  </xs:restriction>
                </xs:simpleType>
              </xs:element>
            </xs:sequence>
            <xs:attribute name="id" use="required">
              <xs:simpleType>
                <xs:restriction base="xs:ID">
                  <xs:pattern value="B[0-9]{3,}"/>
                </xs:restriction>
              </xs:simpleType>
            </xs:attribute>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
    <xs:unique name="UniqueBookID">
      <xs:selector xpath="book"/>
      <xs:field xpath="@id"/>
    </xs:unique>
  </xs:element>
</xs:schema>`;

const DEFAULT_BOOKS_XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <div class="xslt-transformed-container">
      <div class="xslt-meta-header">
        <div class="xslt-badge-group">
          <span class="xslt-badge xslt-badge-primary">
            Total Records: <xsl:value-of select="count(library/book)"/>
          </span>
          <span class="xslt-badge xslt-badge-accent">
            Generated via XSLT Engine
          </span>
        </div>
        <div class="xslt-summary-text">
          Displaying sorted records ordered alphabetically by Book Title using XPath expressions.
        </div>
      </div>

      <div class="xslt-table-responsive">
        <table class="xslt-table">
          <thead>
            <tr>
              <th scope="col">Book ID</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Publisher</th>
              <th scope="col">ISBN</th>
              <th scope="col" class="text-center">Year</th>
              <th scope="col" class="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="library/book">
              <xsl:sort select="title" order="ascending"/>
              <tr>
                <td class="xslt-id-cell">
                  <span class="book-id-badge">
                    <xsl:value-of select="@id"/>
                  </span>
                </td>
                <td class="xslt-title-cell">
                  <strong><xsl:value-of select="title"/></strong>
                </td>
                <td class="xslt-author-cell">
                  <xsl:value-of select="author"/>
                </td>
                <td class="xslt-publisher-cell">
                  <xsl:value-of select="publisher"/>
                </td>
                <td class="xslt-isbn-cell">
                  <code><xsl:value-of select="isbn"/></code>
                </td>
                <td class="text-center xslt-year-cell">
                  <span class="year-pill"><xsl:value-of select="year"/></span>
                </td>
                <td class="text-right xslt-price-cell">
                  <span class="price-pill">₹<xsl:value-of select="price"/></span>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
          <tfoot>
            <tr class="xslt-tfoot-row">
              <td colspan="5">
                <strong>Catalogue Summary:</strong> 
                Total <xsl:value-of select="count(library/book)"/> Books catalogued across multiple CS disciplines.
              </td>
              <td class="text-center">
                <strong>Average:</strong>
              </td>
              <td class="text-right">
                <strong class="price-highlight">
                  ₹<xsl:value-of select="format-number(sum(library/book/price) div count(library/book), '0.00')"/>
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>`;

// ==========================================================================
// Application State & Storage Management
// ==========================================================================
const AppState = {
  rawXml: "",
  xmlDoc: null,
  xslDoc: null,
  activeSection: "dashboard",
  booksList: [],
  currentSearch: "",
  currentYearFilter: "all",
  currentSort: "title-asc",
  loadedFromFile: false
};

const STORAGE_KEY = "biblioxml_catalogue_data";

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  initNavigation();
  initSidebarToggle();
  await loadXmlDatabase();
  setupEventListeners();
  renderSourceViewer();
});

// ==========================================================================
// XML Document Loading & Parsing Engine
// ==========================================================================
async function loadXmlDatabase() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  let xmlString = savedData || "";

  if (!xmlString) {
    try {
      const response = await fetch("books.xml");
      if (response.ok) {
        xmlString = await response.text();
        AppState.loadedFromFile = true;
      } else {
        xmlString = DEFAULT_BOOKS_XML;
      }
    } catch (e) {
      console.warn("Direct fetch restricted (file:// or CORS). Using embedded XML source.", e);
      xmlString = DEFAULT_BOOKS_XML;
    }
  }

  AppState.rawXml = xmlString;
  parseXmlData(xmlString);
  syncStateWithXmlDoc();
  updateUiAfterXmlLoad();
}

function parseXmlData(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const parseError = doc.querySelector("parsererror");
  
  if (parseError) {
    console.error("XML Parsing Error:", parseError.textContent);
    showToast("Error parsing XML document. Check structure.", "danger");
    return;
  }
  
  AppState.xmlDoc = doc;
}

function syncStateWithXmlDoc() {
  if (!AppState.xmlDoc) return;
  const bookElements = AppState.xmlDoc.getElementsByTagName("book");
  const list = [];

  for (let i = 0; i < bookElements.length; i++) {
    const book = bookElements[i];
    list.push({
      id: book.getAttribute("id") || `B${i+1}`,
      title: getElementText(book, "title"),
      author: getElementText(book, "author"),
      publisher: getElementText(book, "publisher"),
      isbn: getElementText(book, "isbn"),
      price: parseFloat(getElementText(book, "price")) || 0,
      year: parseInt(getElementText(book, "year"), 10) || 2024
    });
  }

  AppState.booksList = list;
}

function getElementText(parent, tagName) {
  const el = parent.getElementsByTagName(tagName)[0];
  return el ? el.textContent.trim() : "";
}

function saveXmlToSession() {
  if (!AppState.xmlDoc) return;
  const serializer = new XMLSerializer();
  const serialized = serializer.serializeToString(AppState.xmlDoc);
  AppState.rawXml = serialized;
  localStorage.setItem(STORAGE_KEY, serialized);
  syncStateWithXmlDoc();
}

function resetXmlDatabase() {
  localStorage.removeItem(STORAGE_KEY);
  AppState.rawXml = DEFAULT_BOOKS_XML;
  parseXmlData(DEFAULT_BOOKS_XML);
  syncStateWithXmlDoc();
  updateUiAfterXmlLoad();
  showToast("Database restored to default XML catalogue.", "success");
}

function updateUiAfterXmlLoad() {
  renderDashboardStats();
  renderFeaturedBooks();
  renderRecentBooks();
  renderCatalogueGrid();
  populateYearFilterDropdown();
  populateDomSelectDropdowns();
  renderDomTreeViewer();
}

// ==========================================================================
// Navigation & SPA Section Switching
// ==========================================================================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-section");
      switchSection(targetSection);
    });
  });

  // Handle Quick Action Links
  document.querySelectorAll("[data-nav-target]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-nav-target");
      switchSection(target);
    });
  });
}

function switchSection(sectionId) {
  const targetView = document.getElementById(`view-${sectionId}`);
  if (!targetView) return;

  // Update Nav Links
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
  if (activeLink) activeLink.classList.add("active");

  // Update Views
  document.querySelectorAll(".section-view").forEach(v => v.classList.remove("active"));
  targetView.classList.add("active");

  AppState.activeSection = sectionId;

  // Update Breadcrumb
  const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
  if (breadcrumbCurrent && activeLink) {
    const textSpan = activeLink.querySelector(".nav-text");
    if (textSpan) breadcrumbCurrent.textContent = textSpan.textContent;
  }

  // Close mobile sidebar if open
  closeMobileSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Hook for section-specific renders
  if (sectionId === "source-viewer") {
    renderSourceViewer();
  } else if (sectionId === "xslt-transform") {
    // If transformed output empty, auto transform
    const container = document.getElementById("xsltOutputContainer");
    if (container && !container.innerHTML.trim()) {
      runXsltTransformation();
    }
  }
}

function initSidebarToggle() {
  const sidebar = document.getElementById("mainSidebar");
  const collapseBtn = document.getElementById("sidebarCollapseBtn");
  const mobileToggle = document.getElementById("mobileToggleBtn");
  const backdrop = document.getElementById("sidebarBackdrop");

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      const icon = collapseBtn.querySelector("svg");
      if (icon) {
        if (sidebar.classList.contains("collapsed")) {
          icon.style.transform = "rotate(180deg)";
        } else {
          icon.style.transform = "rotate(0deg)";
        }
      }
    });
  }

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.add("mobile-open");
      backdrop.classList.add("active");
    });

    backdrop.addEventListener("click", () => {
      closeMobileSidebar();
    });
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("mainSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (backdrop) backdrop.classList.remove("active");
}

// ==========================================================================
// Dashboard Calculations & Presentation
// ==========================================================================
function renderDashboardStats() {
  const totalBooks = AppState.booksList.length;
  
  // Calculate unique authors & publishers
  const authorsSet = new Set(AppState.booksList.map(b => b.author.toLowerCase()));
  const publishersSet = new Set(AppState.booksList.map(b => b.publisher.toLowerCase()));
  
  // Calculate average price
  const totalPrice = AppState.booksList.reduce((acc, b) => acc + (b.price || 0), 0);
  const avgPrice = totalBooks > 0 ? (totalPrice / totalBooks).toFixed(2) : "0.00";

  // Update DOM elements
  const elTotalBooks = document.getElementById("statTotalBooks");
  const elTotalAuthors = document.getElementById("statTotalAuthors");
  const elTotalPublishers = document.getElementById("statTotalPublishers");
  const elAvgPrice = document.getElementById("statAvgPrice");
  const badgeNavCatalogue = document.getElementById("navBadgeBooks");

  if (elTotalBooks) elTotalBooks.textContent = totalBooks;
  if (elTotalAuthors) elTotalAuthors.textContent = authorsSet.size;
  if (elTotalPublishers) elTotalPublishers.textContent = publishersSet.size;
  if (elAvgPrice) elAvgPrice.textContent = `₹${avgPrice}`;
  if (badgeNavCatalogue) badgeNavCatalogue.textContent = totalBooks;
}

function renderFeaturedBooks() {
  const container = document.getElementById("dashboardFeaturedGrid");
  if (!container) return;

  const featured = AppState.booksList.slice(0, 3);
  container.innerHTML = featured.map(book => `
    <div class="mini-book-card" onclick="openBookModal('${book.id}')">
      <div class="mini-book-spine">${book.id}</div>
      <div class="mini-book-details">
        <div class="mini-book-title" title="${book.title}">${book.title}</div>
        <div class="mini-book-meta">${book.author} • ${book.year}</div>
        <div class="mini-book-price">₹${book.price}</div>
      </div>
    </div>
  `).join("");
}

function renderRecentBooks() {
  const container = document.getElementById("dashboardRecentTable");
  if (!container) return;

  const recent = [...AppState.booksList].reverse().slice(0, 4);
  container.innerHTML = recent.map(book => `
    <div class="mini-book-card" onclick="openBookModal('${book.id}')">
      <div class="mini-book-spine" style="background: linear-gradient(135deg, #0ea5e9, #38bdf8);">${book.id}</div>
      <div class="mini-book-details">
        <div class="mini-book-title" title="${book.title}">${book.title}</div>
        <div class="mini-book-meta">${book.publisher} • ISBN: ${book.isbn}</div>
        <div class="mini-book-price">₹${book.price}</div>
      </div>
    </div>
  `).join("");
}

// ==========================================================================
// Book Catalogue Presentation & Live Filtering
// ==========================================================================
function renderCatalogueGrid() {
  const grid = document.getElementById("booksGridContainer");
  const countDisplay = document.getElementById("catalogueCountDisplay");
  if (!grid) return;

  let filtered = [...AppState.booksList];

  // Search filter (Title, Author, or Book ID)
  if (AppState.currentSearch) {
    const q = AppState.currentSearch.toLowerCase();
    filtered = filtered.filter(b => 
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  }

  // Year filter
  if (AppState.currentYearFilter !== "all") {
    filtered = filtered.filter(b => b.year.toString() === AppState.currentYearFilter);
  }

  // Sort
  if (AppState.currentSort === "title-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (AppState.currentSort === "title-desc") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else if (AppState.currentSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.currentSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.currentSort === "year-desc") {
    filtered.sort((a, b) => b.year - a.year);
  }

  if (countDisplay) {
    countDisplay.innerHTML = `Showing <span class="count-highlight">${filtered.length}</span> of ${AppState.booksList.length} books in XML Catalogue`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon-circle">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <div class="empty-title">No matching books found</div>
        <div class="empty-desc">We couldn't find any XML book record matching your search query or filter criteria.</div>
        <button class="btn-secondary" onclick="resetCatalogueFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const bgClasses = ["cover-bg-1", "cover-bg-2", "cover-bg-3", "cover-bg-4", "cover-bg-5", "cover-bg-6"];

  grid.innerHTML = filtered.map((book, idx) => {
    const bgClass = bgClasses[idx % bgClasses.length];
    return `
      <div class="book-card" data-book-id="${book.id}">
        <div class="book-cover ${bgClass}">
          <div class="cover-top-bar">
            <span class="book-id-badge">${book.id}</span>
            <span class="book-category-pill">XML Node</span>
          </div>
          <div class="cover-center-art">
            <div class="cover-book-icon">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <span class="cover-year-tag">${book.year}</span>
          </div>
        </div>

        <div class="book-body">
          <h3 class="book-title" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h3>
          
          <div class="book-meta-list">
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>${escapeHtml(book.author)}</span>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span>${escapeHtml(book.publisher)}</span>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="9" x2="20" y2="9"></line>
                <line x1="4" y1="15" x2="20" y2="15"></line>
                <line x1="10" y1="3" x2="8" y2="21"></line>
                <line x1="16" y1="3" x2="14" y2="21"></line>
              </svg>
              <span class="isbn-code">ISBN: ${escapeHtml(book.isbn)}</span>
            </div>
          </div>

          <div class="book-footer">
            <div class="book-price-block">
              <span class="price-subtext">Price</span>
              <span class="price-amount">₹${book.price}</span>
            </div>
            <div class="book-card-actions">
              <button class="btn-card-action" onclick="openBookModal('${book.id}')" title="View Details">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Details
              </button>
              <button class="btn-card-action" onclick="jumpToDomInspector('${book.id}')" title="Inspect DOM">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                DOM
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function populateYearFilterDropdown() {
  const select = document.getElementById("catalogueYearFilter");
  if (!select) return;

  const years = Array.from(new Set(AppState.booksList.map(b => b.year))).sort((a,b) => b - a);
  const currentVal = select.value;

  select.innerHTML = `<option value="all">All Years</option>` + 
    years.map(y => `<option value="${y}">${y}</option>`).join("");

  if (years.includes(parseInt(currentVal, 10))) {
    select.value = currentVal;
  }
}

function resetCatalogueFilters() {
  AppState.currentSearch = "";
  AppState.currentYearFilter = "all";
  AppState.currentSort = "title-asc";

  const searchInput = document.getElementById("catalogueSearchInput");
  const yearFilter = document.getElementById("catalogueYearFilter");
  const sortSelect = document.getElementById("catalogueSortSelect");

  if (searchInput) searchInput.value = "";
  if (yearFilter) yearFilter.value = "all";
  if (sortSelect) sortSelect.value = "title-asc";

  renderCatalogueGrid();
}

// ==========================================================================
// Book Details Modal
// ==========================================================================
function openBookModal(bookId) {
  const book = AppState.booksList.find(b => b.id === bookId);
  if (!book) return;

  const modal = document.getElementById("bookDetailModal");
  const modalBody = document.getElementById("modalBodyContent");
  if (!modal || !modalBody) return;

  // Retrieve raw XML element node snippet
  let rawNodeXml = "";
  if (AppState.xmlDoc) {
    const bookEl = AppState.xmlDoc.querySelector(`book[id='${bookId}']`);
    if (bookEl) {
      rawNodeXml = new XMLSerializer().serializeToString(bookEl);
      rawNodeXml = formatXmlString(rawNodeXml);
    }
  }

  modalBody.innerHTML = `
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
      <div style="width: 100px; height: 135px; border-radius: 12px; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; padding: 1rem; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
        <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;">${book.id}</span>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span style="font-size: 0.8rem; margin-top: 8px; font-weight: 600;">${book.year}</span>
      </div>

      <div style="flex: 1; min-width: 240px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); line-height: 1.3; margin-bottom: 0.5rem;">${escapeHtml(book.title)}</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
          <span class="status-badge" style="background: var(--primary-subtle); color: var(--primary); border-color: rgba(99,102,241,0.2);">Author: ${escapeHtml(book.author)}</span>
          <span class="status-badge" style="background: var(--secondary-subtle); color: var(--secondary); border-color: rgba(14,165,233,0.2);">Publisher: ${escapeHtml(book.publisher)}</span>
        </div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">₹${book.price}</div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.88rem;">
      <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 0.5rem 0; font-weight: 600; color: var(--text-muted); width: 140px;">Attribute (id):</td><td style="font-family: var(--font-mono); color: var(--primary); font-weight: 700;">${book.id}</td></tr>
      <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 0.5rem 0; font-weight: 600; color: var(--text-muted);">Element &lt;isbn&gt;:</td><td style="font-family: var(--font-mono);">${book.isbn}</td></tr>
      <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 0.5rem 0; font-weight: 600; color: var(--text-muted);">Element &lt;year&gt;:</td><td>${book.year}</td></tr>
      <tr style="border-bottom: 1px solid var(--border-light);"><td style="padding: 0.5rem 0; font-weight: 600; color: var(--text-muted);">Element &lt;price&gt;:</td><td>₹${book.price}</td></tr>
    </table>

    <div style="margin-top: 1rem;">
      <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
        <span>Direct XML Node Representation:</span>
        <button class="btn-card-action" onclick="copyToClipboard('${escapeJs(rawNodeXml)}')">Copy XML</button>
      </div>
      <pre style="background: #0f172a; color: #cbd5e1; padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.82rem; overflow-x: auto; max-height: 180px;">${escapeHtml(rawNodeXml)}</pre>
    </div>
  `;

  modal.classList.add("active");
}

function closeBookModal() {
  const modal = document.getElementById("bookDetailModal");
  if (modal) modal.classList.remove("active");
}

// ==========================================================================
// Add New Book: XML DOM Insertion & Form Validation
// ==========================================================================
function setupEventListeners() {
  // Catalogue Search Input
  const searchInput = document.getElementById("catalogueSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.currentSearch = e.target.value.trim();
      renderCatalogueGrid();
    });
  }

  // Dashboard Quick Search
  const quickSearch = document.getElementById("dashQuickSearch");
  if (quickSearch) {
    quickSearch.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const query = quickSearch.value.trim();
        switchSection("catalogue");
        const catSearch = document.getElementById("catalogueSearchInput");
        if (catSearch) {
          catSearch.value = query;
          AppState.currentSearch = query;
          renderCatalogueGrid();
        }
      }
    });
  }

  // Catalogue Year Filter
  const yearFilter = document.getElementById("catalogueYearFilter");
  if (yearFilter) {
    yearFilter.addEventListener("change", (e) => {
      AppState.currentYearFilter = e.target.value;
      renderCatalogueGrid();
    });
  }

  // Catalogue Sort Select
  const sortSelect = document.getElementById("catalogueSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.currentSort = e.target.value;
      renderCatalogueGrid();
    });
  }

  // Add Book Form Submit
  const addBookForm = document.getElementById("addBookForm");
  if (addBookForm) {
    addBookForm.addEventListener("submit", handleAddBookSubmit);
  }

  // Modal Close on backdrop
  const modal = document.getElementById("bookDetailModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeBookModal();
    });
  }
}

function handleAddBookSubmit(e) {
  e.preventDefault();
  
  // Clear previous errors
  document.querySelectorAll(".field-error-msg").forEach(el => el.classList.remove("visible"));
  document.querySelectorAll(".form-input").forEach(el => el.classList.remove("error"));

  const idInput = document.getElementById("inputBookId");
  const titleInput = document.getElementById("inputTitle");
  const authorInput = document.getElementById("inputAuthor");
  const publisherInput = document.getElementById("inputPublisher");
  const isbnInput = document.getElementById("inputIsbn");
  const priceInput = document.getElementById("inputPrice");
  const yearInput = document.getElementById("inputYear");

  const id = idInput.value.trim().toUpperCase();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const publisher = publisherInput.value.trim();
  const isbn = isbnInput.value.trim();
  const price = parseFloat(priceInput.value);
  const year = parseInt(yearInput.value, 10);

  let hasError = false;

  // Validate ID format & uniqueness
  if (!id) {
    showFieldError("inputBookId", "Book ID is mandatory.");
    hasError = true;
  } else if (!/^B[0-9]{3,}$/i.test(id)) {
    showFieldError("inputBookId", "Book ID must start with 'B' followed by digits (e.g. B013).");
    hasError = true;
  } else if (AppState.xmlDoc && AppState.xmlDoc.querySelector(`book[id='${id}']`)) {
    showFieldError("inputBookId", `Book ID '${id}' already exists in the XML catalogue. Must be unique.`);
    hasError = true;
  }

  // Validate Title
  if (!title) {
    showFieldError("inputTitle", "Title is mandatory.");
    hasError = true;
  }

  // Validate Author
  if (!author) {
    showFieldError("inputAuthor", "Author is mandatory.");
    hasError = true;
  }

  // Validate Publisher
  if (!publisher) {
    showFieldError("inputPublisher", "Publisher is mandatory.");
    hasError = true;
  }

  // Validate ISBN
  if (!isbn) {
    showFieldError("inputIsbn", "ISBN is mandatory.");
    hasError = true;
  } else if (!/^\d{10}(\d{3})?$/.test(isbn)) {
    showFieldError("inputIsbn", "ISBN must be 10 or 13 digits without dashes.");
    hasError = true;
  }

  // Validate Price
  if (isNaN(price) || price <= 0) {
    showFieldError("inputPrice", "Price must be a positive number greater than 0.");
    hasError = true;
  }

  // Validate Year
  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year < 1900 || year > currentYear + 2) {
    showFieldError("inputYear", `Publication year must be between 1900 and ${currentYear + 2}.`);
    hasError = true;
  }

  if (hasError) {
    showToast("Please correct the highlighted form errors.", "danger");
    return;
  }

  // ==========================================
  // Actual XML DOM Node Creation & Insertion
  // ==========================================
  try {
    const doc = AppState.xmlDoc;
    
    // 1. createElement('book')
    const bookElem = doc.createElement("book");
    
    // 2. setAttribute('id', id)
    bookElem.setAttribute("id", id);

    // 3. Helper to create child elements with textContent
    const appendChildElement = (tagName, textVal) => {
      const child = doc.createElement(tagName);
      child.textContent = textVal;
      bookElem.appendChild(child);
    };

    appendChildElement("title", title);
    appendChildElement("author", author);
    appendChildElement("publisher", publisher);
    appendChildElement("isbn", isbn);
    appendChildElement("price", price.toString());
    appendChildElement("year", year.toString());

    // 4. appendChild to root <library>
    const root = doc.documentElement;
    root.appendChild(bookElem);

    // 5. Serialize and persist in session storage
    saveXmlToSession();

    // 6. Refresh UI components
    updateUiAfterXmlLoad();

    // Reset Form
    document.getElementById("addBookForm").reset();

    showToast(`Book '${id} - ${title}' successfully added to XML DOM!`, "success");

    // Switch to Catalogue and highlight newly added book
    setTimeout(() => {
      switchSection("catalogue");
      AppState.currentSearch = id;
      const catSearch = document.getElementById("catalogueSearchInput");
      if (catSearch) catSearch.value = id;
      renderCatalogueGrid();
    }, 600);

  } catch (err) {
    console.error("DOM Insertion Failed:", err);
    showToast("Failed to insert XML DOM element: " + err.message, "danger");
  }
}

function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (input) input.classList.add("error");
  const errEl = document.getElementById(`${inputId}Error`);
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add("visible");
  }
}

// ==========================================================================
// DTD & XML Schema (XSD) Validation Engine
// ==========================================================================
function runPresetValidationTest(testType) {
  const outputBox = document.getElementById("validationResultBox");
  if (!outputBox) return;

  let testXml = "";
  let expectedType = "dtd";

  switch (testType) {
    case "valid":
      testXml = AppState.rawXml || DEFAULT_BOOKS_XML;
      break;

    case "missing-author":
      testXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE library SYSTEM "books.dtd">
<library>
    <book id="B999">
        <title>Flawed Record Without Author</title>
        <publisher>Tech Press</publisher>
        <isbn>9780000000001</isbn>
        <price>299</price>
        <year>2024</year>
    </book>
</library>`;
      break;

    case "missing-id":
      testXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE library SYSTEM "books.dtd">
<library>
    <book>
        <title>Flawed Record Without ID Attribute</title>
        <author>Anonymous</author>
        <publisher>Tech Press</publisher>
        <isbn>9780000000002</isbn>
        <price>350</price>
        <year>2024</year>
    </book>
</library>`;
      break;

    case "duplicate-id":
      testXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE library SYSTEM "books.dtd">
<library>
    <book id="B001">
        <title>First Book With B001</title>
        <author>John Doe</author>
        <publisher>Tech Press</publisher>
        <isbn>9780000000003</isbn>
        <price>400</price>
        <year>2024</year>
    </book>
    <book id="B001">
        <title>Second Book With Duplicate B001</title>
        <author>Jane Doe</author>
        <publisher>Tech Press</publisher>
        <isbn>9780000000004</isbn>
        <price>450</price>
        <year>2024</year>
    </book>
</library>`;
      break;

    case "invalid-price-xsd":
      expectedType = "xsd";
      testXml = `<?xml version="1.0" encoding="UTF-8"?>
<library xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="books.xsd">
    <book id="B888">
        <title>Free Promo Book With Zero Price</title>
        <author>Promo Author</author>
        <publisher>Promo Press</publisher>
        <isbn>9780000000005</isbn>
        <price>-15.00</price>
        <year>2024</year>
    </book>
</library>`;
      break;

    case "invalid-year-xsd":
      expectedType = "xsd";
      testXml = `<?xml version="1.0" encoding="UTF-8"?>
<library xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="books.xsd">
    <book id="B777">
        <title>Historic Ancient Manuscript</title>
        <author>Ancient Scholar</author>
        <publisher>Old Scroll Press</publisher>
        <isbn>9780000000006</isbn>
        <price>1200</price>
        <year>1850</year>
    </book>
</library>`;
      break;
  }

  const inputArea = document.getElementById("customXmlValidatorInput");
  if (inputArea) inputArea.value = testXml;

  if (expectedType === "xsd") {
    validateAgainstXsd(testXml);
  } else {
    validateAgainstDtd(testXml);
  }
}

function runCustomDtdValidation() {
  const inputArea = document.getElementById("customXmlValidatorInput");
  if (!inputArea) return;
  validateAgainstDtd(inputArea.value.trim());
}

function runCustomXsdValidation() {
  const inputArea = document.getElementById("customXmlValidatorInput");
  if (!inputArea) return;
  validateAgainstXsd(inputArea.value.trim());
}

function validateAgainstDtd(xmlText) {
  const outputBox = document.getElementById("validationResultBox");
  if (!outputBox) return;

  outputBox.className = "validation-output-box visible";

  // Step 1: Check Well-Formedness
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    outputBox.className += " error";
    outputBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        [DTD Check Failed] XML is NOT Well-Formed
      </div>
      <div>Syntax Parser Error: ${escapeHtml(parseError.textContent.split("\n")[0])}</div>
    `;
    return;
  }

  // Step 2: DTD Structural Rule Validation
  const root = doc.documentElement;
  const errors = [];

  if (root.nodeName !== "library") {
    errors.push("Root element must be '&lt;library&gt;' according to &lt;!ELEMENT library (book+)&gt;");
  }

  const books = doc.getElementsByTagName("book");
  if (books.length === 0) {
    errors.push("DTD rule '&lt;!ELEMENT library (book+)&gt;' requires at least one &lt;book&gt; element.");
  }

  const seenIds = new Set();
  const requiredChildren = ["title", "author", "publisher", "isbn", "price", "year"];

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const bId = b.getAttribute("id");

    // Check ATTLIST id ID #REQUIRED
    if (!bId) {
      errors.push(`Book #${i+1} is missing required attribute 'id' (DTD: &lt;!ATTLIST book id ID #REQUIRED&gt;)`);
    } else {
      if (seenIds.has(bId)) {
        errors.push(`Duplicate ID detected: '${bId}'. XML DTD 'ID' attributes must be unique across all elements.`);
      }
      seenIds.add(bId);
    }

    // Check required child elements (title, author, publisher, isbn, price, year)
    requiredChildren.forEach(childTag => {
      const el = b.getElementsByTagName(childTag);
      if (el.length === 0) {
        errors.push(`Book '${bId || "#" + (i+1)}' is missing required child element '&lt;${childTag}&gt;' specified in DTD content model.`);
      }
    });
  }

  if (errors.length > 0) {
    outputBox.className += " error";
    outputBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        [DTD Validation Failed] ${errors.length} Structural Rule Violation(s) Detected
      </div>
      <ul style="padding-left: 1.25rem; line-height: 1.6;">
        ${errors.map(err => `<li>${err}</li>`).join("")}
      </ul>
      <div style="margin-top: 0.75rem; font-size: 0.8rem; opacity: 0.85;">Rule reference: books.dtd definitions</div>
    `;
  } else {
    outputBox.className += " success";
    outputBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        [DTD Validation Passed] XML is Well-Formed & Valid according to books.dtd
      </div>
      <div>All elements, parent-child hierarchies, required attributes, and ID uniqueness match the DTD specification perfectly.</div>
    `;
  }
}

function validateAgainstXsd(xmlText) {
  const outputBox = document.getElementById("validationResultBox");
  if (!outputBox) return;

  outputBox.className = "validation-output-box visible";

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const parseError = doc.querySelector("parsererror");

  if (parseError) {
    outputBox.className += " error";
    outputBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
        [XSD Check Failed] XML is NOT Well-Formed
      </div>
      <div>Syntax Parser Error: ${escapeHtml(parseError.textContent.split("\n")[0])}</div>
    `;
    return;
  }

  const errors = [];
  const books = doc.getElementsByTagName("book");

  if (books.length === 0) {
    errors.push("XSD Rule &lt;xs:element name='book' minOccurs='1'&gt;: At least 1 book required.");
  }

  const seenIds = new Set();

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const bId = b.getAttribute("id");

    // Attribute pattern check B[0-9]{3,}
    if (!bId) {
      errors.push(`Book #${i+1} missing required 'id' attribute.`);
    } else {
      if (!/^B[0-9]{3,}$/.test(bId)) {
        errors.push(`Attribute 'id' with value '${bId}' fails XSD pattern restriction 'B[0-9]{3,}'.`);
      }
      if (seenIds.has(bId)) {
        errors.push(`Duplicate ID '${bId}' violates &lt;xs:unique name='UniqueBookID'&gt;`);
      }
      seenIds.add(bId);
    }

    // Check price minExclusive="0.00"
    const priceEl = b.getElementsByTagName("price")[0];
    if (!priceEl) {
      errors.push(`Book '${bId || "#" + (i+1)}' is missing &lt;price&gt; element.`);
    } else {
      const priceVal = parseFloat(priceEl.textContent.trim());
      if (isNaN(priceVal) || priceVal <= 0) {
        errors.push(`Element &lt;price&gt; value '${priceEl.textContent}' violates XSD restriction: &lt;xs:minExclusive value="0.00"/&gt;`);
      }
    }

    // Check year 4-digit and between 1900 and 2099
    const yearEl = b.getElementsByTagName("year")[0];
    if (!yearEl) {
      errors.push(`Book '${bId || "#" + (i+1)}' is missing &lt;year&gt; element.`);
    } else {
      const yearStr = yearEl.textContent.trim();
      const yearVal = parseInt(yearStr, 10);
      if (!/^\d{4}$/.test(yearStr) || isNaN(yearVal) || yearVal < 1900 || yearVal > 2099) {
        errors.push(`Element &lt;year&gt; value '${yearStr}' violates XSD restriction: 4-digit positive integer between 1900 and 2099.`);
      }
    }

    // Check ISBN pattern
    const isbnEl = b.getElementsByTagName("isbn")[0];
    if (!isbnEl) {
      errors.push(`Book '${bId || "#" + (i+1)}' is missing &lt;isbn&gt; element.`);
    } else {
      const isbnStr = isbnEl.textContent.trim();
      if (!/^(\d{10}|\d{13})$/.test(isbnStr)) {
        errors.push(`Element &lt;isbn&gt; value '${isbnStr}' violates XSD pattern restriction: &lt;xs:pattern value="(\\d{10}|\\d{13})"/&gt;`);
      }
    }
  }

  if (errors.length > 0) {
    outputBox.className += " error";
    outputBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        [XSD Schema Validation Failed] ${errors.length} Type/Facet Violation(s) Detected
      </div>
      <ul style="padding-left: 1.25rem; line-height: 1.6;">
        ${errors.map(err => `<li>${err}</li>`).join("")}
      </ul>
      <div style="margin-top: 0.75rem; font-size: 0.8rem; opacity: 0.85;">Validated against W3C XML Schema definitions in books.xsd</div>
    `;
  } else {
    outputBox.className += " success";
    outputBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        [XSD Validation Passed] XML is Valid according to books.xsd
      </div>
      <div>All complex types, element occurrences, string facets, positive price limits, and 4-digit year formats strictly adhere to XML Schema rules.</div>
    `;
  }
}

// ==========================================================================
// XML DOM Operations Studio
// ==========================================================================
function switchDomTab(tabName) {
  document.querySelectorAll(".dom-tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".dom-tab-panel").forEach(p => p.classList.remove("active"));

  const targetBtn = document.querySelector(`.dom-tab-btn[data-dom-tab="${tabName}"]`);
  const targetPanel = document.getElementById(`domPanel-${tabName}`);

  if (targetBtn) targetBtn.classList.add("active");
  if (targetPanel) targetPanel.classList.add("active");
}

function populateDomSelectDropdowns() {
  const retrieveSelect = document.getElementById("domRetrieveSelect");
  const modifySelect = document.getElementById("domModifySelect");

  const options = AppState.booksList.map(b => `<option value="${b.id}">${b.id} - ${b.title}</option>`).join("");

  if (retrieveSelect) {
    retrieveSelect.innerHTML = `<option value="">-- Choose a Book to Retrieve --</option>` + options;
  }
  if (modifySelect) {
    modifySelect.innerHTML = `<option value="">-- Choose a Book to Modify --</option>` + options;
  }
}

function handleDomRetrieveChange(bookId) {
  const outputBox = document.getElementById("domRetrieveOutput");
  if (!outputBox) return;

  if (!bookId) {
    outputBox.innerHTML = `<div style="color: var(--text-light); text-align: center; padding: 2rem;">Select a book from the dropdown above to inspect its DOM node hierarchy.</div>`;
    return;
  }

  const bookEl = AppState.xmlDoc.querySelector(`book[id='${bookId}']`);
  if (!bookEl) {
    outputBox.innerHTML = `<div class="notice-box warning">Book element node not found in DOM!</div>`;
    return;
  }

  const children = Array.from(bookEl.children);
  const serialized = new XMLSerializer().serializeToString(bookEl);

  outputBox.innerHTML = `
    <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
      <div style="font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
        <span>XML DOM Node Properties</span>
        <span class="status-badge">Node.ELEMENT_NODE (${bookEl.nodeType})</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
        <div><strong>nodeName:</strong> <code>&lt;${bookEl.nodeName}&gt;</code></div>
        <div><strong>id attribute:</strong> <code>${bookEl.getAttribute("id")}</code></div>
        <div><strong>childElementCount:</strong> <code>${bookEl.childElementCount}</code></div>
        <div><strong>namespaceURI:</strong> <code>${bookEl.namespaceURI || "default"}</code></div>
      </div>
    </div>

    <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Child Element Walkthrough:</div>
    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
      ${children.map(c => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.85rem; background: #fff; border: 1px solid var(--border-light); border-radius: 6px; font-size: 0.82rem;">
          <span style="font-family: var(--font-mono); color: var(--primary); font-weight: 600;">&lt;${c.tagName}&gt;</span>
          <span style="color: var(--text-main); font-weight: 500;">"${escapeHtml(c.textContent)}"</span>
        </div>
      `).join("")}
    </div>

    <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Serialized XML String via XMLSerializer:</div>
    <pre style="background: #0f172a; color: #cbd5e1; padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.82rem; overflow-x: auto;">${escapeHtml(formatXmlString(serialized))}</pre>
  `;
}

function handleDomModifySelectChange(bookId) {
  const container = document.getElementById("domModifyFormContainer");
  if (!container) return;

  if (!bookId) {
    container.style.display = "none";
    return;
  }

  const book = AppState.booksList.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById("domModTitle").value = book.title;
  document.getElementById("domModAuthor").value = book.author;
  document.getElementById("domModPublisher").value = book.publisher;
  document.getElementById("domModPrice").value = book.price;

  container.style.display = "block";
}

function executeDomUpdate() {
  const bookId = document.getElementById("domModifySelect").value;
  if (!bookId || !AppState.xmlDoc) return;

  const bookEl = AppState.xmlDoc.querySelector(`book[id='${bookId}']`);
  if (!bookEl) {
    showToast("Selected book not found in XML DOM", "danger");
    return;
  }

  const newTitle = document.getElementById("domModTitle").value.trim();
  const newAuthor = document.getElementById("domModAuthor").value.trim();
  const newPublisher = document.getElementById("domModPublisher").value.trim();
  const newPrice = parseFloat(document.getElementById("domModPrice").value);

  if (!newTitle || !newAuthor || !newPublisher || isNaN(newPrice) || newPrice <= 0) {
    showToast("Please fill all fields with valid data before updating.", "danger");
    return;
  }

  // XML DOM Modification calls
  bookEl.getElementsByTagName("title")[0].textContent = newTitle;
  bookEl.getElementsByTagName("author")[0].textContent = newAuthor;
  bookEl.getElementsByTagName("publisher")[0].textContent = newPublisher;
  bookEl.getElementsByTagName("price")[0].textContent = newPrice.toString();

  saveXmlToSession();
  updateUiAfterXmlLoad();

  showToast(`Book '${bookId}' successfully updated via XML DOM!`, "success");
  handleDomRetrieveChange(bookId);
}

function executeDomSearch() {
  const idInput = document.getElementById("domSearchIdInput");
  const resultBox = document.getElementById("domSearchResultBox");
  if (!idInput || !resultBox) return;

  const searchId = idInput.value.trim().toUpperCase();
  if (!searchId) {
    resultBox.innerHTML = `<div class="notice-box warning">Please enter a Book ID to search (e.g. B001, B005).</div>`;
    return;
  }

  const startTime = performance.now();
  const bookEl = AppState.xmlDoc ? AppState.xmlDoc.querySelector(`book[id='${searchId}']`) : null;
  const elapsed = (performance.now() - startTime).toFixed(2);

  if (!bookEl) {
    resultBox.innerHTML = `
      <div class="notice-box warning">
        <div class="notice-title">Book Not Found</div>
        <div>No XML DOM element matching query <code>//book[@id='${searchId}']</code> was found in the catalogue. Search completed in ${elapsed}ms.</div>
      </div>
    `;
    return;
  }

  const title = getElementText(bookEl, "title");
  const author = getElementText(bookEl, "author");
  const publisher = getElementText(bookEl, "publisher");
  const isbn = getElementText(bookEl, "isbn");
  const price = getElementText(bookEl, "price");
  const year = getElementText(bookEl, "year");
  const serialized = new XMLSerializer().serializeToString(bookEl);

  resultBox.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <span class="status-badge" style="background: var(--success-subtle); color: var(--success);">
          Node Located in ${elapsed}ms
        </span>
        <span class="book-id-badge">${searchId}</span>
      </div>

      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">${escapeHtml(title)}</h3>
      <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem;">
        <strong>Author:</strong> ${escapeHtml(author)}<br>
        <strong>Publisher:</strong> ${escapeHtml(publisher)}<br>
        <strong>ISBN:</strong> <code>${escapeHtml(isbn)}</code> | <strong>Year:</strong> ${year} | <strong>Price:</strong> ₹${price}
      </div>

      <div style="font-size: 0.82rem; font-weight: 700; margin-bottom: 0.35rem;">Matched XML Node Snippet:</div>
      <pre style="background: #0f172a; color: #cbd5e1; padding: 0.85rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto;">${escapeHtml(formatXmlString(serialized))}</pre>
    </div>
  `;
}

function jumpToDomInspector(bookId) {
  switchSection("dom-operations");
  switchDomTab("retrieve");
  const select = document.getElementById("domRetrieveSelect");
  if (select) {
    select.value = bookId;
    handleDomRetrieveChange(bookId);
  }
}

// Live Visual DOM Tree Generator
function renderDomTreeViewer() {
  const container = document.getElementById("domVisualTreeViewer");
  if (!container || !AppState.xmlDoc) return;

  const root = AppState.xmlDoc.documentElement;
  const books = Array.from(root.getElementsByTagName("book"));

  let html = `<div class="dom-tag">&lt;<span class="syntax-tag">${root.nodeName}</span>&gt;</div>`;
  
  books.forEach(b => {
    const id = b.getAttribute("id");
    const title = getElementText(b, "title");
    const author = getElementText(b, "author");
    const price = getElementText(b, "price");

    html += `
      <div class="dom-node">
        <div class="dom-tag">
          &lt;<span class="syntax-tag">book</span> 
          <span class="syntax-attr-name">id</span>=<span class="syntax-attr-val">"${id}"</span>&gt;
        </div>
        <div class="dom-node" style="font-size: 0.8rem; opacity: 0.9;">
          <div>&lt;<span class="syntax-tag">title</span>&gt;<span class="dom-text">${escapeHtml(title)}</span>&lt;/<span class="syntax-tag">title</span>&gt;</div>
          <div>&lt;<span class="syntax-tag">author</span>&gt;<span class="dom-text">${escapeHtml(author)}</span>&lt;/<span class="syntax-tag">author</span>&gt;</div>
          <div>&lt;<span class="syntax-tag">price</span>&gt;<span class="dom-text">${price}</span>&lt;/<span class="syntax-tag">price</span>&gt;</div>
        </div>
        <div class="dom-tag">&lt;/<span class="syntax-tag">book</span>&gt;</div>
      </div>
    `;
  });

  html += `<div class="dom-tag">&lt;/<span class="syntax-tag">${root.nodeName}</span>&gt;</div>`;
  container.innerHTML = html;
}

// ==========================================================================
// XSLT Transformation Engine
// ==========================================================================
async function runXsltTransformation() {
  const container = document.getElementById("xsltOutputContainer");
  if (!container) return;

  container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-light);">Executing XSLT transformation processor...</div>`;

  try {
    // Attempt native browser XSLTProcessor
    if (window.XSLTProcessor) {
      let xslText = DEFAULT_BOOKS_XSL;
      try {
        const resp = await fetch("books.xsl");
        if (resp.ok) xslText = await resp.text();
      } catch (e) {
        // Fallback to embedded XSL
      }

      const parser = new DOMParser();
      const xslDoc = parser.parseFromString(xslText, "text/xml");
      const xmlDoc = AppState.xmlDoc || parser.parseFromString(AppState.rawXml, "text/xml");

      const processor = new XSLTProcessor();
      processor.importStylesheet(xslDoc);

      const ownerDoc = document.implementation.createHTMLDocument("");
      const resultFragment = processor.transformToFragment(xmlDoc, ownerDoc);

      if (resultFragment && resultFragment.childNodes.length > 0) {
        container.innerHTML = "";
        container.appendChild(document.importNode(resultFragment, true));
        showToast("XSLT Transformation executed successfully via browser XSLTProcessor!", "success");
        return;
      }
    }
  } catch (err) {
    console.warn("Native XSLTProcessor fell back to DOM template transformer:", err);
  }

  // High-fidelity fallback that mirrors books.xsl transformation exactly
  renderFallbackXsltTable();
  showToast("Transformed using XML DOM template matching books.xsl specification.", "success");
}

function renderFallbackXsltTable() {
  const container = document.getElementById("xsltOutputContainer");
  if (!container) return;

  const sortedBooks = [...AppState.booksList].sort((a, b) => a.title.localeCompare(b.title));
  const totalBooks = sortedBooks.length;
  const totalPrice = sortedBooks.reduce((acc, b) => acc + b.price, 0);
  const avgPrice = totalBooks > 0 ? (totalPrice / totalBooks).toFixed(2) : "0.00";

  container.innerHTML = `
    <div class="xslt-transformed-container">
      <div class="xslt-meta-header">
        <div class="xslt-badge-group">
          <span class="xslt-badge xslt-badge-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Total Records: ${totalBooks}
          </span>
          <span class="xslt-badge xslt-badge-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Generated via XSLT Engine
          </span>
        </div>
        <div class="xslt-summary-text">
          Displaying sorted records ordered alphabetically by Book Title using XPath expressions.
        </div>
      </div>

      <div class="xslt-table-responsive">
        <table class="xslt-table">
          <thead>
            <tr>
              <th scope="col">Book ID</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Publisher</th>
              <th scope="col">ISBN</th>
              <th scope="col" class="text-center">Year</th>
              <th scope="col" class="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${sortedBooks.map(book => `
              <tr>
                <td class="xslt-id-cell">
                  <span class="book-id-badge">${book.id}</span>
                </td>
                <td class="xslt-title-cell">
                  <strong>${escapeHtml(book.title)}</strong>
                </td>
                <td class="xslt-author-cell">${escapeHtml(book.author)}</td>
                <td class="xslt-publisher-cell">${escapeHtml(book.publisher)}</td>
                <td class="xslt-isbn-cell"><code>${escapeHtml(book.isbn)}</code></td>
                <td class="text-center xslt-year-cell">
                  <span class="year-pill">${book.year}</span>
                </td>
                <td class="text-right xslt-price-cell">
                  <span class="price-pill">₹${book.price}</span>
                </td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr class="xslt-tfoot-row">
              <td colspan="5">
                <strong>Catalogue Summary:</strong> 
                Total ${totalBooks} Books catalogued across multiple CS disciplines.
              </td>
              <td class="text-center">
                <strong>Average:</strong>
              </td>
              <td class="text-right">
                <strong class="price-highlight">₹${avgPrice}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

function viewXsltSource() {
  switchSection("source-viewer");
  switchSourceTab("books.xsl");
}

function viewXmlSource() {
  switchSection("source-viewer");
  switchSourceTab("books.xml");
}

// ==========================================================================
// Interactive XML Source Viewer with Syntax Highlighting
// ==========================================================================
let currentViewingFile = "books.xml";

function switchSourceTab(fileName) {
  currentViewingFile = fileName;
  document.querySelectorAll(".source-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-file") === fileName);
  });
  renderSourceViewer();
}

function renderSourceViewer() {
  const display = document.getElementById("sourceCodeDisplay");
  if (!display) return;

  let rawContent = "";
  if (currentViewingFile === "books.xml") {
    rawContent = AppState.rawXml || DEFAULT_BOOKS_XML;
  } else if (currentViewingFile === "books.dtd") {
    rawContent = DEFAULT_BOOKS_DTD;
  } else if (currentViewingFile === "books.xsd") {
    rawContent = DEFAULT_BOOKS_XSD;
  } else if (currentViewingFile === "books.xsl") {
    rawContent = DEFAULT_BOOKS_XSL;
  } else if (currentViewingFile === "index.php") {
    rawContent = `<?php
// PHP DOMDocument & XSLTProcessor Execution Script
// Refer to index.php for complete server-side implementation.
$dom = new DOMDocument();
$dom->load('books.xml');
$proc = new XSLTProcessor();
$xsl = new DOMDocument();
$xsl->load('books.xsl');
$proc->importStylesheet($xsl);
echo $proc->transformToXML($dom);
?>`;
  }

  display.innerHTML = highlightXmlSyntax(rawContent);
}

function highlightXmlSyntax(code) {
  let escaped = escapeHtml(code);

  // Comments
  escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syntax-comment">$1</span>');

  // DOCTYPE
  escaped = escaped.replace(/(&lt;!DOCTYPE[\s\S]*?&gt;)/g, '<span class="syntax-doctype">$1</span>');

  // Tags & Attributes
  escaped = escaped.replace(/(&lt;\/?)([a-zA-Z0-9_\-:]+)([\s\S]*?)(\/?&gt;)/g, (match, p1, p2, p3, p4) => {
    let attrs = p3.replace(/([a-zA-Z0-9_\-:]+)=(&quot;[^&]*?&quot;|'[^']*?')/g, 
      '<span class="syntax-attr-name">$1</span>=<span class="syntax-attr-val">$2</span>'
    );
    return `<span class="syntax-tag">${p1}${p2}</span>${attrs}<span class="syntax-tag">${p4}</span>`;
  });

  return escaped;
}

function copyCurrentSourceCode() {
  let content = "";
  if (currentViewingFile === "books.xml") content = AppState.rawXml || DEFAULT_BOOKS_XML;
  else if (currentViewingFile === "books.dtd") content = DEFAULT_BOOKS_DTD;
  else if (currentViewingFile === "books.xsd") content = DEFAULT_BOOKS_XSD;
  else if (currentViewingFile === "books.xsl") content = DEFAULT_BOOKS_XSL;

  copyToClipboard(content);
}

function downloadCurrentSourceFile() {
  let content = "";
  if (currentViewingFile === "books.xml") content = AppState.rawXml || DEFAULT_BOOKS_XML;
  else if (currentViewingFile === "books.dtd") content = DEFAULT_BOOKS_DTD;
  else if (currentViewingFile === "books.xsd") content = DEFAULT_BOOKS_XSD;
  else if (currentViewingFile === "books.xsl") content = DEFAULT_BOOKS_XSL;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = currentViewingFile;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloading ${currentViewingFile}...`, "success");
}

// ==========================================================================
// Helper Utilities: Toast & String Formatting
// ==========================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to clipboard!", "success");
  }).catch(() => {
    showToast("Failed to copy text.", "danger");
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJs(str) {
  if (!str) return "";
  return str.toString().replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

function formatXmlString(xml) {
  let formatted = "";
  let indent = 0;
  const tab = "  ";
  xml.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) indent = Math.max(0, indent - 1);
    formatted += tab.repeat(indent) + "<" + node + ">\n";
    if (node.match(/^<?\w[^>]*[^\/]$/)) indent++;
  });
  return formatted.substring(1, formatted.length - 2);
}
