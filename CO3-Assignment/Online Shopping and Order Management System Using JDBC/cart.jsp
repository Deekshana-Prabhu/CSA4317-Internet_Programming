<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Cart, com.shopzone.model.CartItem, com.shopzone.model.Product" %>
<%
    Customer customer = (Customer) session.getAttribute("customer");
    Cart cart = (Cart) session.getAttribute("cart");
    int cartCount = (cart != null) ? cart.getTotalItemCount() : 0;

    String cartSuccess = (String) session.getAttribute("cartSuccess");
    if (cartSuccess != null) session.removeAttribute("cartSuccess");

    String cartError = (String) session.getAttribute("cartError");
    if (cartError != null) session.removeAttribute("cartError");

    String cartWarning = (String) session.getAttribute("cartWarning");
    if (cartWarning != null) session.removeAttribute("cartWarning");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - SHOPZONE</title>
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
            <a href="cart.jsp" class="nav-item active">
                <span class="nav-icon">🛒</span>
                <span>Shopping Cart</span>
                <span class="nav-badge"><%= cartCount %></span>
            </a>
            <a href="my-orders" class="nav-item">
                <span class="nav-icon">📦</span>
                <span>My Orders</span>
            </a>

            <span class="nav-section-title">Categories</span>
            <a href="products?category=Electronics" class="nav-item">
                <span class="nav-icon">⚡</span>
                <span>Electronics</span>
            </a>
            <a href="products?category=Fashion" class="nav-item">
                <span class="nav-icon">👗</span>
                <span>Fashion</span>
            </a>
            <a href="products?category=Home+Appliances" class="nav-item">
                <span class="nav-icon">🏠</span>
                <span>Home Appliances</span>
            </a>
            <a href="products?category=Books" class="nav-item">
                <span class="nav-icon">📚</span>
                <span>Books</span>
            </a>
            <a href="products?category=Accessories" class="nav-item">
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
                <a href="cart.jsp" class="header-cart-btn" style="border-color: var(--lavender);">
                    <span class="header-cart-icon">🛒</span>
                    <span>Cart</span>
                    <span class="header-cart-count"><%= cartCount %></span>
                </a>
            </div>
        </header>

        <div class="content-canvas">

            <!-- Alerts -->
            <% if (cartSuccess != null) { %>
                <div class="alert alert-success">✅ <%= cartSuccess %></div>
            <% } %>
            <% if (cartWarning != null) { %>
                <div class="alert alert-warning">⚠️ <%= cartWarning %></div>
            <% } %>
            <% if (cartError != null) { %>
                <div class="alert alert-error">❌ <%= cartError %></div>
            <% } %>

            <div class="section-header">
                <div class="section-title-wrap">
                    <h2>Your Shopping Cart</h2>
                    <p><%= cart != null && !cart.isEmpty() ? cart.getTotalItemCount() + " items currently in your order queue" : "Review and manage your selected items" %></p>
                </div>
                <% if (cart != null && !cart.isEmpty()) { %>
                    <form action="cart-action" method="POST" onsubmit="return confirm('Are you sure you want to empty your entire shopping cart?');">
                        <input type="hidden" name="action" value="clear">
                        <button type="submit" class="btn btn-secondary btn-sm" style="color: var(--danger);">
                            🗑️ Clear Cart
                        </button>
                    </form>
                <% } %>
            </div>

            <% if (cart == null || cart.isEmpty()) { %>
                <!-- Empty Cart State -->
                <div class="empty-state">
                    <div class="empty-state-icon">🛒</div>
                    <h3>Your Cart is Currently Empty</h3>
                    <p>Looks like you haven't added anything to your cart yet. Explore our top collections and add products you love!</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <a href="products" class="btn btn-primary btn-lg">Browse All Products →</a>
                        <a href="index.jsp" class="btn btn-secondary btn-lg">Back to Home</a>
                    </div>
                </div>
            <% } else { %>
                <!-- Cart Items Table and Order Summary Grid -->
                <div class="cart-layout">
                    
                    <!-- Table Card -->
                    <div class="cart-card">
                        <div class="cart-card-header">
                            <h3>Items In Cart (<%= cart.getTotalItemCount() %>)</h3>
                            <a href="products" class="btn btn-outline btn-sm">+ Add More Items</a>
                        </div>
                        <div class="cart-table-wrapper">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <% for (CartItem item : cart.getItems()) { 
                                        Product p = item.getProduct();
                                    %>
                                        <tr>
                                            <!-- Product Info -->
                                            <td>
                                                <div class="cart-item-info">
                                                    <div class="cart-item-thumb">
                                                        <img src="<%= p.getImage() %>" alt="<%= p.getProductName() %>">
                                                    </div>
                                                    <div>
                                                        <div class="cart-item-title"><%= p.getProductName() %></div>
                                                        <div class="cart-item-sub">
                                                            ID: #<%= p.getProductId() %> • Category: <%= p.getCategory() %>
                                                        </div>
                                                        <div style="font-size: 11px; color: <%= p.getStock() < 5 ? "var(--warning)" : "var(--success)" %>; font-weight: 600; margin-top: 2px;">
                                                            Max Available: <%= p.getStock() %>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <!-- Unit Price -->
                                            <td style="font-weight: 700; color: var(--text-main);">
                                                <%= p.getFormattedPrice() %>
                                            </td>

                                            <!-- Quantity Stepper -->
                                            <td>
                                                <form id="form_<%= p.getProductId() %>" action="cart-action" method="POST" class="cart-qty-form">
                                                    <input type="hidden" name="action" value="update">
                                                    <input type="hidden" name="productId" value="<%= p.getProductId() %>">
                                                    
                                                    <!-- Decrease button -->
                                                    <button type="button" class="qty-btn" 
                                                            onclick="changeCartQuantity('<%= p.getProductId() %>', -1, <%= p.getStock() %>)"
                                                            <%= item.getQuantity() <= 1 ? "disabled" : "" %>>−</button>
                                                    
                                                    <!-- Quantity input with stock limit -->
                                                    <input type="number" id="qty_<%= p.getProductId() %>" name="quantity" 
                                                           value="<%= item.getQuantity() %>" min="1" max="<%= p.getStock() %>" 
                                                           class="qty-display" 
                                                           onchange="this.form.submit()">
                                                    
                                                    <!-- Increase button -->
                                                    <button type="button" class="qty-btn" 
                                                            onclick="changeCartQuantity('<%= p.getProductId() %>', 1, <%= p.getStock() %>)"
                                                            <%= item.getQuantity() >= p.getStock() ? "disabled" : "" %>>+</button>
                                                </form>
                                            </td>

                                            <!-- Subtotal -->
                                            <td style="font-weight: 800; color: var(--primary-blue-hover); font-size: 15px;">
                                                <%= item.getFormattedSubtotal() %>
                                            </td>

                                            <!-- Remove action -->
                                            <td>
                                                <form action="cart-action" method="POST">
                                                    <input type="hidden" name="action" value="remove">
                                                    <input type="hidden" name="productId" value="<%= p.getProductId() %>">
                                                    <button type="submit" class="btn btn-danger btn-sm" title="Remove this item from cart">
                                                        🗑️
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    <% } %>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Order Summary Card -->
                    <div class="summary-card">
                        <h3 class="summary-title">Order Summary</h3>

                        <div class="summary-row">
                            <span>Subtotal (<%= cart.getTotalItemCount() %> items)</span>
                            <span style="font-weight: 700; color: var(--text-main);"><%= cart.getFormattedTotalAmount() %></span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping & Delivery</span>
                            <span style="font-weight: 700; color: var(--success);">FREE</span>
                        </div>
                        <div class="summary-row">
                            <span>Applicable Taxes (GST)</span>
                            <span style="font-weight: 600; color: var(--text-muted);">Included</span>
                        </div>

                        <div class="summary-row total-row">
                            <span>Grand Total</span>
                            <span class="price"><%= cart.getFormattedTotalAmount() %></span>
                        </div>

                        <a href="checkout.jsp" class="btn btn-primary btn-checkout">
                            Proceed to Checkout →
                        </a>

                        <div style="margin-top: 18px; padding: 12px; background: var(--bg-page); border-radius: var(--radius-md); font-size: 11px; color: var(--text-muted); text-align: center;">
                            🛡️ 100% Purchase Protection & Secure Payment Guaranteed.
                        </div>
                    </div>

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
