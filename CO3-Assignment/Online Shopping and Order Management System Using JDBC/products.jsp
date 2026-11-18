<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Cart, com.shopzone.model.Product, com.shopzone.dao.ProductDAO, java.util.List" %>
<%
    Customer customer = (Customer) session.getAttribute("customer");
    Cart cart = (Cart) session.getAttribute("cart");
    int cartCount = (cart != null) ? cart.getTotalItemCount() : 0;

    // Retrieve products from request (set by ProductServlet)
    @SuppressWarnings("unchecked")
    List<Product> products = (List<Product>) request.getAttribute("productList");
    String selectedCategory = (String) request.getAttribute("selectedCategory");
    String searchKeyword = (String) request.getAttribute("searchKeyword");

    // Fallback: If accessed directly via products.jsp instead of ProductServlet, fetch from DAO
    if (products == null) {
        ProductDAO dao = new ProductDAO();
        String catParam = request.getParameter("category");
        String searchParam = request.getParameter("search");

        if (searchParam != null && !searchParam.trim().isEmpty()) {
            products = dao.searchProducts(searchParam.trim(), catParam);
            searchKeyword = searchParam.trim();
        } else if (catParam != null && !catParam.trim().isEmpty() && !catParam.equalsIgnoreCase("All")) {
            products = dao.getProductsByCategory(catParam.trim());
            selectedCategory = catParam.trim();
        } else {
            products = dao.getAllProducts();
            selectedCategory = "All";
        }
    }

    if (selectedCategory == null) selectedCategory = "All";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products Catalogue - SHOPZONE</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', var(--font-family); }
        .filter-pill-bar {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 8px;
            margin-bottom: 24px;
        }
        .filter-pill {
            padding: 8px 16px;
            border-radius: var(--radius-full);
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            font-size: 13px;
            font-weight: 600;
            color: var(--text-muted);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all var(--transition-normal);
            white-space: nowrap;
        }
        .filter-pill:hover {
            border-color: var(--lavender);
            color: var(--lavender-hover);
        }
        .filter-pill.active {
            background: var(--accent-gradient);
            color: #FFFFFF;
            border-color: transparent;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }
    </style>
</head>
<body>

<div class="app-wrapper">
    <div class="sidebar-overlay"></div>

    <!-- 1. VERTICAL SIDEBAR NAVIGATION -->
    <aside class="app-sidebar">
        <div class="sidebar-header">
            <a href="index.jsp" class="brand-link">
                <div class="brand-icon-box">🛍️</div>
                <div class="brand-info">
                    <span class="brand-name">SHOP<span>ZONE</span></span>
                    <span class="brand-tagline">Everything You Need</span>
                </div>
            </a>
        </div>

        <nav class="sidebar-nav">
            <span class="nav-section-title">Menu</span>
            <a href="index.jsp" class="nav-item">
                <span class="nav-icon">🏠</span>
                <span>Home</span>
            </a>
            <a href="products" class="nav-item active">
                <span class="nav-icon">✨</span>
                <span>Browse Products</span>
            </a>
            <a href="cart.jsp" class="nav-item">
                <span class="nav-icon">🛒</span>
                <span>Shopping Cart</span>
                <span class="nav-badge"><%= cartCount %></span>
            </a>
            <a href="my-orders" class="nav-item">
                <span class="nav-icon">📦</span>
                <span>My Orders</span>
            </a>

            <span class="nav-section-title">Filter by Category</span>
            <a href="products?category=Electronics" class="nav-item <%= "Electronics".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                <span class="nav-icon">⚡</span>
                <span>Electronics</span>
            </a>
            <a href="products?category=Fashion" class="nav-item <%= "Fashion".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                <span class="nav-icon">👗</span>
                <span>Fashion</span>
            </a>
            <a href="products?category=Home+Appliances" class="nav-item <%= "Home Appliances".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                <span class="nav-icon">🏠</span>
                <span>Home Appliances</span>
            </a>
            <a href="products?category=Books" class="nav-item <%= "Books".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                <span class="nav-icon">📚</span>
                <span>Books</span>
            </a>
            <a href="products?category=Accessories" class="nav-item <%= "Accessories".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                <span class="nav-icon">🎒</span>
                <span>Accessories</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <% if (customer != null) { %>
                <div class="customer-card">
                    <div class="customer-avatar">
                        <%= customer.getCustomerName().substring(0, 1).toUpperCase() %>
                    </div>
                    <div class="customer-meta">
                        <div class="name"><%= customer.getCustomerName() %></div>
                        <span class="id-badge"><%= customer.getCustomerId() %></span>
                    </div>
                    <a href="logout" class="btn-logout" title="Log Out">🚪</a>
                </div>
            <% } else { %>
                <div class="auth-button-group">
                    <a href="login.jsp" class="btn btn-secondary btn-sm">Login</a>
                    <a href="register.jsp" class="btn btn-primary btn-sm">Register</a>
                </div>
            <% } %>
        </div>
    </aside>

    <!-- 2. MAIN CONTENT AREA -->
    <main class="app-main">
        <header class="top-header">
            <button class="mobile-menu-toggle" aria-label="Toggle Sidebar Menu">☰</button>

            <!-- Product Search Form (Submits to ProductServlet using GET) -->
            <form action="products" method="GET" class="header-search-form">
                <select name="category" class="search-category-select">
                    <option value="All" <%= "All".equalsIgnoreCase(selectedCategory) ? "selected" : "" %>>All Categories</option>
                    <option value="Electronics" <%= "Electronics".equalsIgnoreCase(selectedCategory) ? "selected" : "" %>>Electronics</option>
                    <option value="Fashion" <%= "Fashion".equalsIgnoreCase(selectedCategory) ? "selected" : "" %>>Fashion</option>
                    <option value="Home Appliances" <%= "Home Appliances".equalsIgnoreCase(selectedCategory) ? "selected" : "" %>>Home Appliances</option>
                    <option value="Books" <%= "Books".equalsIgnoreCase(selectedCategory) ? "selected" : "" %>>Books</option>
                    <option value="Accessories" <%= "Accessories".equalsIgnoreCase(selectedCategory) ? "selected" : "" %>>Accessories</option>
                </select>
                <input type="text" name="search" class="search-input" 
                       placeholder="Search products by title, description..." 
                       value="<%= searchKeyword != null ? searchKeyword : "" %>">
                <button type="submit" class="search-submit-btn" title="Search">🔍</button>
            </form>

            <div class="header-actions">
                <a href="cart.jsp" class="header-cart-btn">
                    <span class="header-cart-icon">🛒</span>
                    <span>Cart</span>
                    <span class="header-cart-count"><%= cartCount %></span>
                </a>
            </div>
        </header>

        <div class="content-canvas">

            <!-- Flash Message Alerts -->
            <% 
                String cartSuccess = (String) session.getAttribute("cartSuccess");
                String cartError = (String) session.getAttribute("cartError");
                if (cartSuccess != null) { 
                    session.removeAttribute("cartSuccess");
            %>
                <div class="alert alert-success">✅ <%= cartSuccess %></div>
            <% } %>
            <% if (cartError != null) { 
                    session.removeAttribute("cartError");
            %>
                <div class="alert alert-error">⚠️ <%= cartError %></div>
            <% } %>

            <!-- Catalog Header -->
            <div class="section-header">
                <div class="section-title-wrap">
                    <h2>
                        <% if (searchKeyword != null && !searchKeyword.isEmpty()) { %>
                            Search Results for "<%= searchKeyword %>"
                        <% } else if (selectedCategory != null && !selectedCategory.equalsIgnoreCase("All")) { %>
                            <%= selectedCategory %> Collection
                        <% } else { %>
                            Complete Product Catalogue
                        <% } %>
                    </h2>
                    <p>Showing <%= products != null ? products.size() : 0 %> verified product(s) available in inventory</p>
                </div>
                
                <% if ((searchKeyword != null && !searchKeyword.isEmpty()) || (selectedCategory != null && !selectedCategory.equalsIgnoreCase("All"))) { %>
                    <a href="products" class="btn btn-secondary btn-sm">Clear Filters ✕</a>
                <% } %>
            </div>

            <!-- Category Filter Pills Bar -->
            <div class="filter-pill-bar">
                <a href="products?category=All" class="filter-pill <%= "All".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                    All Products
                </a>
                <a href="products?category=Electronics" class="filter-pill <%= "Electronics".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                    ⚡ Electronics
                </a>
                <a href="products?category=Fashion" class="filter-pill <%= "Fashion".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                    👗 Fashion
                </a>
                <a href="products?category=Home+Appliances" class="filter-pill <%= "Home Appliances".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                    🏠 Home Appliances
                </a>
                <a href="products?category=Books" class="filter-pill <%= "Books".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                    📚 Books
                </a>
                <a href="products?category=Accessories" class="filter-pill <%= "Accessories".equalsIgnoreCase(selectedCategory) ? "active" : "" %>">
                    🎒 Accessories
                </a>
            </div>

            <!-- Product Cards Grid -->
            <% if (products != null && !products.isEmpty()) { %>
                <div class="product-grid">
                    <% for (Product p : products) { %>
                        <div class="product-card">
                            <!-- Product Image & Badge -->
                            <div class="product-image-container">
                                <img src="<%= p.getImage() %>" alt="<%= p.getProductName() %>" loading="lazy">
                                <div class="product-badge-group">
                                    <span class="badge-category"><%= p.getCategory() %></span>
                                    <% if (p.getStock() > 10) { %>
                                        <span class="badge-stock in-stock"><%= p.getStock() %> in stock</span>
                                    <% } else if (p.getStock() > 0) { %>
                                        <span class="badge-stock low-stock">Only <%= p.getStock() %> left!</span>
                                    <% } else { %>
                                        <span class="badge-stock out-of-stock">Out of stock</span>
                                    <% } %>
                                </div>
                            </div>

                            <!-- Product Details Body -->
                            <div class="product-body">
                                <div class="product-header-line">
                                    <span class="product-id-pill">ID: #<%= p.getProductId() %></span>
                                </div>
                                <h3 class="product-title"><%= p.getProductName() %></h3>
                                <p class="product-desc"><%= p.getDescription() %></p>
                                
                                <div class="product-footer">
                                    <div class="product-price-box">
                                        <span class="product-price-label">Price</span>
                                        <span class="product-price"><%= p.getFormattedPrice() %></span>
                                    </div>
                                    
                                    <% if (p.isInStock()) { %>
                                        <form action="cart-action" method="POST" class="product-card-form">
                                            <input type="hidden" name="action" value="add">
                                            <input type="hidden" name="productId" value="<%= p.getProductId() %>">
                                            <input type="hidden" name="redirect" value="products">
                                            
                                            <!-- Quantity selector with available stock as maximum -->
                                            <input type="number" name="quantity" value="1" min="1" max="<%= p.getStock() %>" 
                                                   class="product-qty-input" title="Quantity">
                                            
                                            <button type="submit" class="btn btn-primary btn-sm" title="Add to Shopping Cart">
                                                🛒 Add
                                            </button>
                                        </form>
                                    <% } else { %>
                                        <button class="btn btn-secondary btn-sm disabled" disabled>Sold Out</button>
                                    <% } %>
                                </div>
                            </div>
                        </div>
                    <% } %>
                </div>
            <% } else { %>
                <!-- Empty Search / Filter State -->
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No Products Found</h3>
                    <p>We couldn't find any products matching your query. Try clearing filters or searching with different keywords.</p>
                    <a href="products" class="btn btn-primary">Browse All Products</a>
                </div>
            <% } %>

            <footer class="app-footer">
                <div><strong>SHOPZONE</strong> - Online Shopping and Order Management System Using JDBC</div>
                <div class="footer-links">
                    <a href="index.jsp">Home</a>
                    <a href="products">Products</a>
                    <a href="cart.jsp">Cart</a>
                    <a href="my-orders">My Orders</a>
                </div>
            </footer>
        </div>
    </main>
</div>

<script src="js/script.js"></script>
</body>
</html>
