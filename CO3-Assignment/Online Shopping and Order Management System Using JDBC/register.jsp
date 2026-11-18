<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Cart, com.shopzone.dao.CustomerDAO" %>
<%
    Customer customer = (Customer) session.getAttribute("customer");
    // If customer is already logged in, redirect to home
    if (customer != null) {
        response.sendRedirect("index.jsp");
        return;
    }

    Cart cart = (Cart) session.getAttribute("cart");
    int cartCount = (cart != null) ? cart.getTotalItemCount() : 0;

    String errorMessage = (String) request.getAttribute("errorMessage");
    String previewId = (String) request.getAttribute("previewCustomerId");
    if (previewId == null) {
        CustomerDAO dao = new CustomerDAO();
        previewId = dao.generateCustomerId();
    }

    String valName = (String) request.getAttribute("val_name");
    String valEmail = (String) request.getAttribute("val_email");
    String valMobile = (String) request.getAttribute("val_mobile");
    String valAddress = (String) request.getAttribute("val_address");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Registration - SHOPZONE</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', var(--font-family); }
    </style>
</head>
<body>

<div class="app-wrapper">
    <div class="sidebar-overlay"></div>

    <!-- Vertical Sidebar Navigation -->
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
            <a href="products" class="nav-item">
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

            <span class="nav-section-title">Authentication</span>
            <a href="login.jsp" class="nav-item">
                <span class="nav-icon">🔑</span>
                <span>Customer Login</span>
            </a>
            <a href="register.jsp" class="nav-item active">
                <span class="nav-icon">📝</span>
                <span>Register Account</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <div class="auth-button-group">
                <a href="login.jsp" class="btn btn-secondary btn-sm">Login</a>
                <a href="register.jsp" class="btn btn-primary btn-sm">Register</a>
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="app-main">
        <header class="top-header">
            <button class="mobile-menu-toggle" aria-label="Toggle Sidebar Menu">☰</button>
            <form action="products" method="GET" class="header-search-form">
                <select name="category" class="search-category-select">
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Books">Books</option>
                    <option value="Accessories">Accessories</option>
                </select>
                <input type="text" name="search" class="search-input" placeholder="Search products...">
                <button type="submit" class="search-submit-btn">🔍</button>
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
            <div class="form-card">
                <div class="form-header">
                    <div style="font-size: 40px; margin-bottom: 8px;">✨</div>
                    <h2>Create Customer Account</h2>
                    <p>Join SHOPZONE today for fast ordering, order tracking, and exclusive discounts.</p>
                </div>

                <!-- Server Error Alert -->
                <% if (errorMessage != null) { %>
                    <div class="alert alert-error">
                        <span>⚠️ <%= errorMessage %></span>
                    </div>
                <% } %>

                <!-- Registration Form submitting to RegisterServlet via POST -->
                <form id="registerForm" action="register" method="POST">
                    
                    <!-- Customer ID (Auto-Generated) -->
                    <div class="form-group">
                        <label>Customer ID (Auto-Generated by System)</label>
                        <input type="text" class="form-control" value="<%= previewId %>" readonly style="font-weight: 700; color: var(--lavender-hover); background: var(--lavender-light);">
                        <div class="form-hint">Unique identifier assigned upon registration.</div>
                    </div>

                    <!-- Customer Full Name -->
                    <div class="form-group">
                        <label for="customerName">Full Name *</label>
                        <input type="text" id="customerName" name="customerName" class="form-control" 
                               placeholder="e.g. Rahul Sharma" 
                               value="<%= valName != null ? valName : "" %>" required>
                    </div>

                    <!-- Email Address -->
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" class="form-control" 
                               placeholder="e.g. rahul@example.com" 
                               value="<%= valEmail != null ? valEmail : "" %>" required>
                        <div class="form-hint">Used for login and order status notifications. Must be unique.</div>
                    </div>

                    <!-- Mobile Number -->
                    <div class="form-group">
                        <label for="mobile">Mobile Number *</label>
                        <input type="tel" id="mobile" name="mobile" class="form-control" 
                               placeholder="10-digit mobile number (e.g. 9876543210)" 
                               value="<%= valMobile != null ? valMobile : "" %>" maxlength="10" required>
                    </div>

                    <!-- Passwords Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                        <div class="form-group">
                            <label for="password">Password *</label>
                            <input type="password" id="password" name="password" class="form-control" 
                                   placeholder="Min 6 characters" minlength="6" required>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password *</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" 
                                   placeholder="Re-enter password" minlength="6" required>
                        </div>
                    </div>

                    <!-- Delivery Address -->
                    <div class="form-group">
                        <label for="address">Complete Delivery Address *</label>
                        <textarea id="address" name="address" class="form-control" rows="3" 
                                  placeholder="House/Flat No., Building name, Street, City, State, PIN Code" required><%= valAddress != null ? valAddress : "" %></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px;">
                        Create My Account →
                    </button>

                    <div style="text-align: center; margin-top: 20px; font-size: 13px; color: var(--text-muted);">
                        Already have an account? <a href="login.jsp" style="font-weight: 700; color: var(--lavender-hover);">Log in here</a>
                    </div>
                </form>
            </div>

            <footer class="app-footer">
                <div><strong>SHOPZONE</strong> - Online Shopping and Order Management System Using JDBC</div>
                <div class="footer-links">
                    <a href="index.jsp">Home</a>
                    <a href="products">Products</a>
                    <a href="cart.jsp">Cart</a>
                </div>
            </footer>
        </div>
    </main>
</div>

<script src="js/script.js"></script>
</body>
</html>
