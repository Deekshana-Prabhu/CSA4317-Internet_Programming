<?php
/**
 * XML-Based Library Book Catalogue and Management System
 * Backend PHP Implementation - index.php
 * 
 * Responsibilities:
 * 1. Server-side XML DOM Parsing & Operations (DOMDocument, DOMXPath, getElementsByTagName, createElement, appendChild, save)
 * 2. Real XML DTD Validation ($dom->validate())
 * 3. Real W3C XML Schema Validation ($dom->schemaValidate('books.xsd'))
 * 4. Real Server-Side XSLT Transformation (XSLTProcessor)
 * 5. Serves complete modern application interface for XAMPP / Apache execution
 */

// Enable internal error handling for libxml to capture detailed DTD & XSD messages
libxml_use_internal_errors(true);

$xmlFilePath = __DIR__ . '/books.xml';
$dtdFilePath = __DIR__ . '/books.dtd';
$xsdFilePath = __DIR__ . '/books.xsd';
$xslFilePath = __DIR__ . '/books.xsl';

// ============================================================================
// API Endpoint Handler for Server-Side PHP DOM & XSLT Operations
// ============================================================================
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

if (!empty($action)) {
    header('Content-Type: application/json; charset=utf-8');

    // Action 1: Real PHP XML DOM Retrieval
    if ($action === 'php_dom_list') {
        if (!file_exists($xmlFilePath)) {
            echo json_encode(['success' => false, 'error' => 'books.xml file not found on server']);
            exit;
        }

        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->load($xmlFilePath);

        $books = $dom->getElementsByTagName('book');
        $result = [];

        foreach ($books as $book) {
            $result[] = [
                'id' => $book->getAttribute('id'),
                'title' => $book->getElementsByTagName('title')->item(0)->nodeValue,
                'author' => $book->getElementsByTagName('author')->item(0)->nodeValue,
                'publisher' => $book->getElementsByTagName('publisher')->item(0)->nodeValue,
                'isbn' => $book->getElementsByTagName('isbn')->item(0)->nodeValue,
                'price' => floatval($book->getElementsByTagName('price')->item(0)->nodeValue),
                'year' => intval($book->getElementsByTagName('year')->item(0)->nodeValue)
            ];
        }

        echo json_encode(['success' => true, 'count' => count($result), 'data' => $result]);
        exit;
    }

    // Action 2: Real PHP XML DOM Node Insertion & File Persistence
    if ($action === 'php_dom_add' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = strtoupper(trim($_POST['id'] ?? ''));
        $title = trim($_POST['title'] ?? '');
        $author = trim($_POST['author'] ?? '');
        $publisher = trim($_POST['publisher'] ?? '');
        $isbn = trim($_POST['isbn'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $year = intval($_POST['year'] ?? 0);

        if (empty($id) || empty($title) || empty($author) || empty($publisher) || empty($isbn) || $price <= 0 || $year < 1900) {
            echo json_encode(['success' => false, 'error' => 'Validation failed: Mandatory fields are missing or invalid']);
            exit;
        }

        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->load($xmlFilePath);

        // Check for duplicate ID
        $xpath = new DOMXPath($dom);
        $existing = $xpath->query("//book[@id='$id']");
        if ($existing->length > 0) {
            echo json_encode(['success' => false, 'error' => "Duplicate Book ID '$id' already exists in books.xml"]);
            exit;
        }

        // XML DOM Node Creation
        $bookElem = $dom->createElement('book');
        $bookElem->setAttribute('id', $id);

        $bookElem->appendChild($dom->createElement('title', htmlspecialchars($title)));
        $bookElem->appendChild($dom->createElement('author', htmlspecialchars($author)));
        $bookElem->appendChild($dom->createElement('publisher', htmlspecialchars($publisher)));
        $bookElem->appendChild($dom->createElement('isbn', htmlspecialchars($isbn)));
        $bookElem->appendChild($dom->createElement('price', number_format($price, 2, '.', '')));
        $bookElem->appendChild($dom->createElement('year', strval($year)));

        $dom->documentElement->appendChild($bookElem);

        // Actual disk save operation
        $saved = @$dom->save($xmlFilePath);

        if ($saved !== false) {
            echo json_encode(['success' => true, 'message' => "Book '$id' successfully written to books.xml on server."]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Permission denied: Could not write to books.xml']);
        }
        exit;
    }

    // Action 3: Real PHP XML DOM Modification
    if ($action === 'php_dom_modify' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = strtoupper(trim($_POST['id'] ?? ''));
        $title = trim($_POST['title'] ?? '');
        $author = trim($_POST['author'] ?? '');
        $publisher = trim($_POST['publisher'] ?? '');
        $price = floatval($_POST['price'] ?? 0);

        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->load($xmlFilePath);

        $xpath = new DOMXPath($dom);
        $nodes = $xpath->query("//book[@id='$id']");

        if ($nodes->length === 0) {
            echo json_encode(['success' => false, 'error' => "Book ID '$id' not found in DOM."]);
            exit;
        }

        $bookNode = $nodes->item(0);
        $bookNode->getElementsByTagName('title')->item(0)->nodeValue = htmlspecialchars($title);
        $bookNode->getElementsByTagName('author')->item(0)->nodeValue = htmlspecialchars($author);
        $bookNode->getElementsByTagName('publisher')->item(0)->nodeValue = htmlspecialchars($publisher);
        $bookNode->getElementsByTagName('price')->item(0)->nodeValue = number_format($price, 2, '.', '');

        $dom->save($xmlFilePath);
        echo json_encode(['success' => true, 'message' => "Book '$id' updated via PHP DOM."]);
        exit;
    }

    // Action 4: Real PHP DTD Validation
    if ($action === 'php_dtd_validate') {
        libxml_clear_errors();
        $dom = new DOMDocument();
        $dom->load($xmlFilePath);

        $isValid = @$dom->validate();
        $errors = [];

        if (!$isValid) {
            foreach (libxml_get_errors() as $err) {
                $errors[] = trim($err->message);
            }
        }

        echo json_encode([
            'success' => $isValid,
            'validator' => 'PHP DOMDocument->validate() (books.dtd)',
            'errors' => $errors,
            'message' => $isValid ? 'Valid XML according to books.dtd' : 'DTD Validation violations detected'
        ]);
        exit;
    }

    // Action 5: Real PHP W3C XML Schema Validation
    if ($action === 'php_xsd_validate') {
        libxml_clear_errors();
        $dom = new DOMDocument();
        $dom->load($xmlFilePath);

        $isValid = @$dom->schemaValidate($xsdFilePath);
        $errors = [];

        if (!$isValid) {
            foreach (libxml_get_errors() as $err) {
                $errors[] = trim($err->message);
            }
        }

        echo json_encode([
            'success' => $isValid,
            'validator' => 'PHP DOMDocument->schemaValidate(books.xsd)',
            'errors' => $errors,
            'message' => $isValid ? 'Valid XML according to books.xsd' : 'XSD Schema validation violations detected'
        ]);
        exit;
    }

    // Action 6: Real PHP XSLT Transformation
    if ($action === 'php_xslt') {
        header('Content-Type: text/html; charset=utf-8');

        if (!class_exists('XSLTProcessor')) {
            echo "<div class='notice-box warning'>PHP XSLTProcessor extension is not enabled in php.ini.</div>";
            exit;
        }

        $xml = new DOMDocument();
        $xml->load($xmlFilePath);

        $xsl = new DOMDocument();
        $xsl->load($xslFilePath);

        $proc = new XSLTProcessor();
        $proc->importStylesheet($xsl);

        echo $proc->transformToXML($xml);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiblioXML - XML Library Book Catalogue & Management System (PHP Server Mode)</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="app-container">
    
    <!-- Left Sidebar Navigation -->
    <aside class="sidebar" id="mainSidebar">
      <div class="sidebar-brand">
        <a href="#" class="brand-wrapper" onclick="switchSection('dashboard'); return false;">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <path d="M9 7h6"/>
              <path d="M9 11h6"/>
            </svg>
          </div>
          <div class="brand-text">
            <div class="brand-title">
              BiblioXML <span class="brand-badge">PHP Active</span>
            </div>
            <div class="brand-subtitle">Library Management</div>
          </div>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Core Management</div>
        <a class="nav-link active" data-section="dashboard">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="9" rx="1.5"></rect>
            <rect x="14" y="3" width="7" height="5" rx="1.5"></rect>
            <rect x="14" y="12" width="7" height="9" rx="1.5"></rect>
            <rect x="3" y="16" width="7" height="5" rx="1.5"></rect>
          </svg>
          <span class="nav-text">Dashboard</span>
        </a>
        <a class="nav-link" data-section="catalogue">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span class="nav-text">Book Catalogue</span>
          <span class="nav-badge" id="navBadgeBooks">12</span>
        </a>
        <a class="nav-link" data-section="search">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="nav-text">Search Books</span>
        </a>
        <a class="nav-link" data-section="add-book">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span class="nav-text">Add New Book</span>
        </a>

        <div class="nav-section-title" style="margin-top: 0.75rem;">XML Technologies</div>
        <a class="nav-link" data-section="validation">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
          <span class="nav-text">XML Validation</span>
        </a>
        <a class="nav-link" data-section="dom-operations">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
          <span class="nav-text">DOM Operations</span>
        </a>
        <a class="nav-link" data-section="xslt-transform">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span class="nav-text">XSLT Transformation</span>
        </a>
        <a class="nav-link" data-section="source-viewer">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span class="nav-text">XML Source Viewer</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" id="sidebarCollapseBtn" title="Toggle Sidebar Width">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="11 19 4 12 11 5"></polyline>
            <polyline points="18 19 11 12 18 5"></polyline>
          </svg>
          <span class="collapse-text">Collapse Menu</span>
        </button>
      </div>
    </aside>

    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-toggle-btn" id="mobileToggleBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="breadcrumb-container">
            <span class="breadcrumb-root">Library</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current" id="breadcrumbCurrent">Dashboard</span>
          </div>
        </div>

        <div class="header-right">
          <div class="status-badge" style="background: var(--primary-subtle); color: var(--primary);">
            <span class="status-dot" style="background-color: var(--primary);"></span>
            <span>PHP <?php echo phpversion(); ?> Server Mode</span>
          </div>
          <button class="header-btn" onclick="resetXmlDatabase()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span>Reset DB</span>
          </button>
          <button class="header-btn" onclick="viewXmlSource()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>View XML</span>
          </button>
        </div>
      </header>

      <main class="content-body">
        <!-- Section 1: Dashboard -->
        <section class="section-view active" id="view-dashboard">
          <div class="welcome-banner">
            <div class="banner-content">
              <div class="banner-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                PHP DOMDocument + XSLTProcessor Engine
              </div>
              <h1 class="banner-title">Welcome to BiblioXML Library Suite</h1>
              <p class="banner-text">
                Complete XML Management System running under PHP <?php echo phpversion(); ?>. Equipped with server-side XML persistence, DTD verification, W3C Schema validation, and XSLT stylesheet compilation.
              </p>
              <div class="banner-actions">
                <button class="btn-banner-primary" data-nav-target="catalogue">Browse Catalogue</button>
                <button class="btn-banner-secondary" data-nav-target="dom-operations">DOM Workbench</button>
                <button class="btn-banner-secondary" data-nav-target="xslt-transform">XSLT Table</button>
              </div>
            </div>
            <div class="banner-art">
              <div class="banner-icon-bubble">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrapper purple">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <div class="stat-info">
                <div class="stat-value" id="statTotalBooks">12</div>
                <div class="stat-label">Total XML Books</div>
                <div class="stat-badge">Loaded from books.xml</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon-wrapper blue">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              </div>
              <div class="stat-info">
                <div class="stat-value" id="statTotalAuthors">12</div>
                <div class="stat-label">Unique Authors</div>
                <div class="stat-badge">Dynamic XPath aggregation</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon-wrapper green">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <div class="stat-info">
                <div class="stat-value" id="statTotalPublishers">11</div>
                <div class="stat-label">Publishing Houses</div>
                <div class="stat-badge">Verified across records</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon-wrapper amber">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div class="stat-info">
                <div class="stat-value" id="statAvgPrice">₹624.17</div>
                <div class="stat-label">Average Price</div>
                <div class="stat-badge">Computed via DOM numeric nodes</div>
              </div>
            </div>
          </div>

          <div class="dashboard-quick-search">
            <svg class="quick-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="dashQuickSearch" class="quick-search-input" placeholder="Quick Search XML Books by Title, Author or Book ID (Press Enter)...">
          </div>

          <div class="dashboard-grid">
            <div style="display: flex; flex-direction: column; gap: 1.75rem;">
              <div class="panel-card">
                <div class="panel-header">
                  <div class="panel-title">Featured Books</div>
                  <span class="panel-action" data-nav-target="catalogue">View All &rarr;</span>
                </div>
                <div class="featured-books-row" id="dashboardFeaturedGrid"></div>
              </div>
              <div class="panel-card">
                <div class="panel-header">
                  <div class="panel-title">Recently Added Records</div>
                  <span class="panel-action" data-nav-target="add-book">+ Add New Record</span>
                </div>
                <div class="featured-books-row" id="dashboardRecentTable"></div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div class="panel-card">
                <div class="panel-header"><div class="panel-title">Quick Actions</div></div>
                <div class="quick-actions-list">
                  <a class="quick-action-item" data-nav-target="catalogue">
                    <div class="action-icon-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path></svg></div>
                    <span>Explore Book Catalogue</span>
                  </a>
                  <a class="quick-action-item" data-nav-target="add-book">
                    <div class="action-icon-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line></svg></div>
                    <span>Add New Book (DOM Insertion)</span>
                  </a>
                  <a class="quick-action-item" data-nav-target="validation">
                    <div class="action-icon-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                    <span>Validate DTD & XSD Rules</span>
                  </a>
                  <a class="quick-action-item" data-nav-target="xslt-transform">
                    <div class="action-icon-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>
                    <span>Execute XSLT Transformation</span>
                  </a>
                </div>
              </div>
              <div class="notice-box info">
                <div class="notice-title">PHP Server Active</div>
                <div>Server-side persistence and API handlers (<code>?action=php_dom_list</code>, <code>php_dom_add</code>, <code>php_dtd_validate</code>, <code>php_xsd_validate</code>, <code>php_xslt</code>) are active.</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Book Catalogue -->
        <section class="section-view" id="view-catalogue">
          <div class="section-header">
            <div>
              <h2 class="section-title">XML Book Catalogue</h2>
              <p class="section-desc">Interactive catalogue populated directly from the parsed XML document nodes in books.xml.</p>
            </div>
            <button class="btn-primary" data-nav-target="add-book">+ Add New Book</button>
          </div>
          <div class="catalogue-toolbar">
            <div class="toolbar-search">
              <svg class="quick-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="catalogueSearchInput" class="toolbar-input" placeholder="Search by title, author, or Book ID...">
            </div>
            <div class="toolbar-filters">
              <select id="catalogueYearFilter" class="select-control"><option value="all">All Years</option></select>
              <select id="catalogueSortSelect" class="select-control">
                <option value="title-asc">Sort: Title (A &rarr; Z)</option>
                <option value="title-desc">Sort: Title (Z &rarr; A)</option>
                <option value="price-low">Sort: Price (Low &rarr; High)</option>
                <option value="price-high">Sort: Price (High &rarr; Low)</option>
                <option value="year-desc">Sort: Newest First</option>
              </select>
              <button class="btn-reset-filters" onclick="resetCatalogueFilters()">Reset</button>
            </div>
          </div>
          <div class="catalogue-count-bar"><div id="catalogueCountDisplay">Loading catalogue records...</div></div>
          <div class="books-grid" id="booksGridContainer"></div>
        </section>

        <!-- Section 3: Search -->
        <section class="section-view" id="view-search">
          <div class="section-header">
            <div>
              <h2 class="section-title">Search Book Catalogue</h2>
              <p class="section-desc">Query books by title, author name, or unique Book ID.</p>
            </div>
          </div>
          <div class="panel-card" style="margin-bottom: 2rem;">
            <div style="max-width: 650px; margin: 1rem auto; text-align: center;">
              <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;">Find Any Book in the XML Repository</h3>
              <div style="position: relative;">
                <input type="text" id="dedicatedSearchInput" class="toolbar-input" style="padding: 1rem 1rem 1rem 3rem; font-size: 1rem;" placeholder="Search by Book ID, Title, or Author..." oninput="AppState.currentSearch = this.value; renderCatalogueGrid();">
                <svg style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--primary);" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 4: Add Book -->
        <section class="section-view" id="view-add-book">
          <div class="section-header">
            <div>
              <h2 class="section-title">Add New Book Record</h2>
              <p class="section-desc">Create a new book element conforming to books.dtd and books.xsd.</p>
            </div>
          </div>
          <div class="form-layout-wrapper">
            <div class="form-card">
              <form id="addBookForm" novalidate>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label" for="inputBookId">Book ID <span class="required-star">*</span></label>
                    <input type="text" id="inputBookId" class="form-input" placeholder="e.g. B013" required>
                    <div class="form-helper">Must start with 'B' followed by digits (e.g. B013).</div>
                    <div class="field-error-msg" id="inputBookIdError"></div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="inputYear">Publication Year <span class="required-star">*</span></label>
                    <input type="number" id="inputYear" class="form-input" placeholder="e.g. 2024" min="1900" max="2099" required>
                    <div class="field-error-msg" id="inputYearError"></div>
                  </div>
                  <div class="form-group form-group-full">
                    <label class="form-label" for="inputTitle">Book Title <span class="required-star">*</span></label>
                    <input type="text" id="inputTitle" class="form-input" placeholder="e.g. Distributed Cloud Computing Architecture" required>
                    <div class="field-error-msg" id="inputTitleError"></div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="inputAuthor">Author Name <span class="required-star">*</span></label>
                    <input type="text" id="inputAuthor" class="form-input" placeholder="e.g. Dr. Robert Vance" required>
                    <div class="field-error-msg" id="inputAuthorError"></div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="inputPublisher">Publisher <span class="required-star">*</span></label>
                    <input type="text" id="inputPublisher" class="form-input" placeholder="e.g. Silicon Media Press" required>
                    <div class="field-error-msg" id="inputPublisherError"></div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="inputIsbn">ISBN Code <span class="required-star">*</span></label>
                    <input type="text" id="inputIsbn" class="form-input" placeholder="e.g. 9781234567812" required>
                    <div class="field-error-msg" id="inputIsbnError"></div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="inputPrice">Price (₹) <span class="required-star">*</span></label>
                    <input type="number" id="inputPrice" class="form-input" placeholder="e.g. 599.00" step="0.01" min="1" required>
                    <div class="field-error-msg" id="inputPriceError"></div>
                  </div>
                  <div class="form-actions">
                    <button type="reset" class="btn-secondary">Reset Form</button>
                    <button type="submit" class="btn-primary">Insert into XML DOM</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="form-notice-card">
              <div class="notice-box info">
                <div class="notice-title">DOM Insertion Mode</div>
                <div>Adds node to XML DOM using createElement() & appendChild(). Under PHP server mode, this persists directly to books.xml via DOMDocument->save().</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 5: Validation -->
        <section class="section-view" id="view-validation">
          <div class="section-header">
            <div>
              <h2 class="section-title">XML Validation Engine (DTD & XSD)</h2>
              <p class="section-desc">Validate XML structure and constraints using books.dtd and books.xsd.</p>
            </div>
          </div>
          <div class="test-cases-section">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Interactive Validation Testbed</h3>
            <div class="test-cases-grid">
              <div class="test-case-card">
                <div class="test-case-top"><div class="test-case-title">1. Standard Catalogue</div><span class="test-case-tag tag-pass">PASS</span></div>
                <div class="test-case-desc">Validates current catalogue against DTD & XSD rules.</div>
                <button class="btn-run-test" onclick="runPresetValidationTest('valid')">Run Validation &rarr;</button>
              </div>
              <div class="test-case-card">
                <div class="test-case-top"><div class="test-case-title">2. Missing &lt;author&gt; Tag</div><span class="test-case-tag tag-fail">FAIL</span></div>
                <div class="test-case-desc">Tests DTD missing mandatory child element error.</div>
                <button class="btn-run-test" onclick="runPresetValidationTest('missing-author')">Test DTD &rarr;</button>
              </div>
              <div class="test-case-card">
                <div class="test-case-top"><div class="test-case-title">3. Missing ID Attribute</div><span class="test-case-tag tag-fail">FAIL</span></div>
                <div class="test-case-desc">Tests DTD missing #REQUIRED id attribute.</div>
                <button class="btn-run-test" onclick="runPresetValidationTest('missing-id')">Test DTD &rarr;</button>
              </div>
              <div class="test-case-card">
                <div class="test-case-top"><div class="test-case-title">4. Duplicate Book ID</div><span class="test-case-tag tag-fail">FAIL</span></div>
                <div class="test-case-desc">Tests DTD & XSD duplicate ID error.</div>
                <button class="btn-run-test" onclick="runPresetValidationTest('duplicate-id')">Test DTD &rarr;</button>
              </div>
              <div class="test-case-card">
                <div class="test-case-top"><div class="test-case-title">5. Negative Price (XSD)</div><span class="test-case-tag tag-fail">FAIL</span></div>
                <div class="test-case-desc">Tests XSD facet minExclusive="0.00".</div>
                <button class="btn-run-test" onclick="runPresetValidationTest('invalid-price-xsd')">Test XSD &rarr;</button>
              </div>
              <div class="test-case-card">
                <div class="test-case-top"><div class="test-case-title">6. Invalid Year Range (XSD)</div><span class="test-case-tag tag-fail">FAIL</span></div>
                <div class="test-case-desc">Tests XSD facet minInclusive="1900".</div>
                <button class="btn-run-test" onclick="runPresetValidationTest('invalid-year-xsd')">Test XSD &rarr;</button>
              </div>
            </div>
          </div>
          <div class="validator-interactive-panel">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Custom XML Validator Sandbox</h3>
            <textarea id="customXmlValidatorInput" style="width: 100%; height: 160px; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); font-family: var(--font-mono); font-size: 0.85rem; background: var(--bg-subtle); outline: none;"></textarea>
            <div class="validator-actions-bar">
              <button class="btn-primary" onclick="runCustomDtdValidation()">Validate against books.dtd</button>
              <button class="btn-secondary" onclick="runCustomXsdValidation()">Validate against books.xsd</button>
              <button class="btn-card-action" onclick="document.getElementById('customXmlValidatorInput').value = AppState.rawXml || DEFAULT_BOOKS_XML;">Load Current Catalogue</button>
            </div>
            <div id="validationResultBox" class="validation-output-box"></div>
          </div>

          <!-- Comparison Table -->
          <div class="comparison-section">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.35rem;">Comparative Analysis: DTD vs. XML Schema (XSD)</h3>
            <div class="comparison-table-wrapper">
              <table class="comparison-table">
                <thead>
                  <tr><th>Feature</th><th>DTD</th><th>XSD</th><th>Advantage</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Syntax</strong></td><td>Non-XML Declarative</td><td>Standard XML</td><td><span class="status-badge">XSD: Native tools</span></td></tr>
                  <tr><td><strong>Data Types</strong></td><td>Character data (#PCDATA) only</td><td>44+ built-in types + facets</td><td><span class="status-badge">XSD: Type safety</span></td></tr>
                  <tr><td><strong>Occurrences</strong></td><td>Basic (?, *, +)</td><td>Exact minOccurs / maxOccurs</td><td><span class="status-badge">XSD: Cardinalities</span></td></tr>
                  <tr><td><strong>Namespaces</strong></td><td>No native support</td><td>Full native support</td><td><span class="status-badge">XSD: Namespaces</span></td></tr>
                  <tr><td><strong>Extensibility</strong></td><td>Rigid</td><td>Inheritance & restriction</td><td><span class="status-badge">XSD: Extensible</span></td></tr>
                  <tr><td><strong>Ease of Use</strong></td><td>Simple & compact</td><td>More verbose</td><td><span class="status-badge">DTD: Simplicity</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Section 6: DOM Operations -->
        <section class="section-view" id="view-dom-operations">
          <div class="section-header">
            <div>
              <h2 class="section-title">XML DOM Operations Studio</h2>
              <p class="section-desc">Interactive workbench demonstrating Retrieve, Traverse, Search, and Mutate methods.</p>
            </div>
          </div>
          <div class="dom-workbench-tabs">
            <button class="dom-tab-btn active" data-dom-tab="retrieve" onclick="switchDomTab('retrieve')">1. Retrieve & Inspect</button>
            <button class="dom-tab-btn" data-dom-tab="modify" onclick="switchDomTab('modify')">2. Modify Elements</button>
            <button class="dom-tab-btn" data-dom-tab="search" onclick="switchDomTab('search')">3. Search by ID</button>
          </div>
          <div class="dom-tab-panel active" id="domPanel-retrieve">
            <div class="dom-operation-card">
              <select id="domRetrieveSelect" class="select-control" style="width: 100%; max-width: 450px;" onchange="handleDomRetrieveChange(this.value)"><option value="">-- Choose Book --</option></select>
              <div id="domRetrieveOutput" style="margin-top: 1rem;"></div>
            </div>
          </div>
          <div class="dom-tab-panel" id="domPanel-modify">
            <div class="dom-operation-card">
              <select id="domModifySelect" class="select-control" style="width: 100%; max-width: 450px;" onchange="handleDomModifySelectChange(this.value)"><option value="">-- Choose Book --</option></select>
              <div id="domModifyFormContainer" style="display: none; margin-top: 1rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                  <div class="form-group form-group-full"><label class="form-label">Title</label><input type="text" id="domModTitle" class="form-input"></div>
                  <div class="form-group"><label class="form-label">Author</label><input type="text" id="domModAuthor" class="form-input"></div>
                  <div class="form-group"><label class="form-label">Publisher</label><input type="text" id="domModPublisher" class="form-input"></div>
                  <div class="form-group"><label class="form-label">Price</label><input type="number" id="domModPrice" class="form-input" step="0.01"></div>
                </div>
                <button class="btn-primary" onclick="executeDomUpdate()">Commit DOM Updates</button>
              </div>
            </div>
          </div>
          <div class="dom-tab-panel" id="domPanel-search">
            <div class="dom-operation-card">
              <div style="display: flex; gap: 0.85rem; max-width: 450px; margin-bottom: 1rem;">
                <input type="text" id="domSearchIdInput" class="form-input" placeholder="Enter Book ID (e.g. B001)...">
                <button class="btn-primary" onclick="executeDomSearch()">Search DOM</button>
              </div>
              <div id="domSearchResultBox"></div>
            </div>
          </div>
          <div class="panel-card" style="margin-top: 2rem;">
            <div class="panel-header"><div class="panel-title">Live XML DOM Hierarchy Tree</div></div>
            <div class="dom-tree-viewer" id="domVisualTreeViewer"></div>
          </div>
        </section>

        <!-- Section 7: XSLT -->
        <section class="section-view" id="view-xslt-transform">
          <div class="section-header">
            <div>
              <h2 class="section-title">XSLT Transformation (XML &rarr; HTML Table)</h2>
              <p class="section-desc">Transforms books.xml into styled table via books.xsl.</p>
            </div>
          </div>
          <div class="xslt-control-card">
            <div class="xslt-btn-group">
              <button class="btn-primary" onclick="runXsltTransformation()">Transform XML with XSLT</button>
              <button class="btn-secondary" onclick="viewXsltSource()">View books.xsl</button>
              <button class="btn-secondary" onclick="viewXmlSource()">View books.xml</button>
            </div>
          </div>
          <div class="xslt-output-container">
            <div id="xsltOutputContainer"></div>
          </div>
        </section>

        <!-- Section 8: Source Viewer -->
        <section class="section-view" id="view-source-viewer">
          <div class="section-header">
            <div>
              <h2 class="section-title">XML Source Viewer</h2>
              <p class="section-desc">Syntax-highlighted source code inspector.</p>
            </div>
          </div>
          <div class="source-viewer-card">
            <div class="source-tabs-header">
              <div class="source-nav">
                <button class="source-tab-btn active" data-file="books.xml" onclick="switchSourceTab('books.xml')">books.xml</button>
                <button class="source-tab-btn" data-file="books.dtd" onclick="switchSourceTab('books.dtd')">books.dtd</button>
                <button class="source-tab-btn" data-file="books.xsd" onclick="switchSourceTab('books.xsd')">books.xsd</button>
                <button class="source-tab-btn" data-file="books.xsl" onclick="switchSourceTab('books.xsl')">books.xsl</button>
                <button class="source-tab-btn" data-file="index.php" onclick="switchSourceTab('index.php')">index.php</button>
              </div>
              <div class="source-tools">
                <button class="btn-source-tool" onclick="copyCurrentSourceCode()">Copy</button>
                <button class="btn-source-tool" onclick="downloadCurrentSourceFile()">Download</button>
              </div>
            </div>
            <pre class="source-code-display" id="sourceCodeDisplay"><code>Loading source...</code></pre>
          </div>
        </section>

      </main>
    </div>
  </div>

  <div class="modal-overlay" id="bookDetailModal">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">XML Book Record Details</div>
        <button class="modal-close-btn" onclick="closeBookModal()">&times;</button>
      </div>
      <div class="modal-body" id="modalBodyContent"></div>
    </div>
  </div>

  <div class="toast-container" id="toastContainer"></div>
  <script src="script.js"></script>
</body>
</html>
