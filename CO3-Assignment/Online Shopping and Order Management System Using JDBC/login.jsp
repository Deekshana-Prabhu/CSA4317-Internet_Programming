<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Cart" %>
<%
    Customer customer = (Customer) session.getAttribute("customer");
    if (customer != null) {
        response.sendRedirect("index.jsp");
        return;
    }

    Cart cart = (Cart) session.getAttribute("cart");
    int cartCount = (cart != null) ? cart.getTotalItemCount() : 0;

    String successMessage = (String) session.getAttribute("successMessage");
    if (successMessage != null) {
        session.removeAttribute("successMessage");
    }

    String errorMessage = (String) request.getAttribute("errorMessage");
    String enteredEmail = (String) request.getAttribute("enteredEmail");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Login - SHOPZONE</title>
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
            <a href="login.jsp" class="nav-item active">
                <span class="nav-icon">🔑</span>
                <span>Customer Login</span>
            </a>
            <a href="register.jsp" class="nav-item">
                <span class="nav-icon">📝</span>
                <span>Register Account</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <div class="auth-button-group">
                <a href="login.jsp" class="btn btn-primary btn-sm">Login</a>
                <a href="register.jsp" class="btn btn-secondary btn-sm">Register</a>
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
            <div class="form-card" style="max-width: 480px;">
                <div class="form-header">
                    <div style="font-size: 40px; margin-bottom: 8px;">🔑</div>
                    <h2>Welcome to SHOPZONE</h2>
                    <p>Enter your credentials to access your account, orders and cart.</p>
                </div>

                <!-- Flash Messages -->
                <% if (successMessage != null) { %>
                    <div class="alert alert-success">
                        <span>✅ <%= successMessage %></span>
                    </div>
                <% } %>

                <% if (errorMessage != null) { %>
                    <div class="alert alert-error">
                        <span>⚠️ <%= errorMessage %></span>
                    </div>
                <% } %>

                <!-- Login Form submitting to LoginServlet via POST -->
                <form action="login" method="POST">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" class="form-control" 
                               placeholder="your.email@example.com" 
                               value="<%= enteredEmail != null ? enteredEmail : "rahul@example.com" %>" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="form-control" 
                               placeholder="Enter your password" value="password123" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px;">
                        Log In to SHOPZONE →
                    </button>

                    <!-- Demo Credentials Helper Box -->
                    <div style="margin-top: 24px; padding: 14px; background: var(--lavender-light); border: 1px dashed var(--lavender-border); border-radius: var(--radius-md); font-size: 12px; color: var(--text-muted);">
                        <strong style="color: var(--lavender-hover); display: block; margin-bottom: 4px;">💡 Demo Customer Account (Ready to Test):</strong>
                        <div><strong>Email:</strong> rahul@example.com</div>
                        <div><strong>Password:</strong> password123</div>
                    </div>

                    <div style="text-align: center; margin-top: 20px; font-size: 13px; color: var(--text-muted);">
                        Don't have an account yet? <a href="register.jsp" style="font-weight: 700; color: var(--lavender-hover);">Create one now</a>
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
