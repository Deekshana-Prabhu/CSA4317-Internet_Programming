<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Cart, com.shopzone.model.CartItem, com.shopzone.model.Product" %>
<%
    Cart cart = (Cart) session.getAttribute("cart");
    // If cart is empty, redirect to cart page
    if (cart == null || cart.isEmpty()) {
        session.setAttribute("cartError", "Your cart is empty. Please add items before checking out.");
        response.sendRedirect("cart.jsp");
        return;
    }

    Customer customer = (Customer) session.getAttribute("customer");
    int cartCount = cart.getTotalItemCount();

    String orderError = (String) session.getAttribute("orderError");
    if (orderError != null) session.removeAttribute("orderError");

    // Prepopulate fields from customer session if available
    String custId = (customer != null) ? customer.getCustomerId() : "";
    String custName = (customer != null) ? customer.getCustomerName() : "";
    String custMobile = (customer != null) ? customer.getMobile() : "";
    String custAddress = (customer != null) ? customer.getAddress() : "";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout & Order Placement - SHOPZONE</title>
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

            <span class="nav-section-title">Checkout Progress</span>
            <div style="padding: 10px 14px; font-size: 13px; color: var(--text-muted);">
                <div style="color: var(--success); font-weight: 700; margin-bottom: 6px;">✓ 1. Shopping Cart</div>
                <div style="color: var(--primary-blue-hover); font-weight: 800; margin-bottom: 6px;">● 2. Delivery & Payment</div>
                <div style="color: var(--text-light); font-weight: 600;">○ 3. Order Confirmation</div>
            </div>
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
            <div style="font-size: 18px; font-weight: 800; color: var(--text-main);">
                Secure Checkout & Order Placement
            </div>
            <div class="header-actions">
                <a href="cart.jsp" class="btn btn-secondary btn-sm">← Back to Cart</a>
            </div>
        </header>

        <div class="content-canvas">
            
            <% if (orderError != null) { %>
                <div class="alert alert-error">⚠️ <%= orderError %></div>
            <% } %>

            <% if (customer == null) { %>
                <div class="alert alert-warning">
                    <span>💡 <strong>Tip:</strong> For an optimal experience, <a href="login.jsp" style="font-weight: 700; text-decoration: underline;">Login</a> or <a href="register.jsp" style="font-weight: 700; text-decoration: underline;">Register</a> to automatically link this order to your account history. Alternatively, provide your details below.</span>
                </div>
            <% } %>

            <div class="cart-layout">
                
                <!-- Left: Order Placement Form -->
                <div class="form-card" style="margin: 0; max-width: 100%;">
                    <div style="margin-bottom: 22px;">
                        <h2 style="font-size: 22px; font-weight: 800; color: var(--text-main);">Shipping & Delivery Details</h2>
                        <p style="font-size: 13px; color: var(--text-muted);">Please confirm the recipient name, phone, and delivery address for this shipment.</p>
                    </div>

                    <!-- Order Form Submitting to OrderServlet via POST -->
                    <form id="checkoutForm" action="order" method="POST">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <!-- Customer ID -->
                            <div class="form-group">
                                <label for="customerId">Customer ID *</label>
                                <input type="text" id="customerId" name="customerId" class="form-control" 
                                       value="<%= !custId.isEmpty() ? custId : "CUST1001" %>" 
                                       <%= customer != null ? "readonly" : "" %> 
                                       style="<%= customer != null ? "background: var(--lavender-light); font-weight: 700; color: var(--lavender-hover);" : "" %>" required>
                                <div class="form-hint">Must match a registered customer account.</div>
                            </div>

                            <!-- Customer Full Name -->
                            <div class="form-group">
                                <label for="customerName">Customer Name *</label>
                                <input type="text" id="customerName" name="customerName" class="form-control" 
                                       placeholder="Recipient Name" 
                                       value="<%= custName %>" required>
                            </div>
                        </div>

                        <!-- Mobile Number -->
                        <div class="form-group">
                            <label for="mobile">Mobile Number (For Delivery Updates) *</label>
                            <input type="tel" id="mobile" name="mobile" class="form-control" 
                                   placeholder="10-digit mobile number" 
                                   value="<%= custMobile %>" maxlength="10" required>
                        </div>

                        <!-- Delivery Address -->
                        <div class="form-group">
                            <label for="deliveryAddress">Complete Delivery Address *</label>
                            <textarea id="deliveryAddress" name="deliveryAddress" class="form-control" rows="3" 
                                      placeholder="Flat/House number, Apartment/Building, Street, City, State, PIN code" required><%= custAddress %></textarea>
                        </div>

                        <!-- Payment Method Section -->
                        <div class="form-group" style="margin-top: 26px;">
                            <label style="font-size: 15px; font-weight: 800; margin-bottom: 10px;">Select Payment Method *</label>
                            
                            <div class="payment-methods-grid">
                                <!-- Cash on Delivery -->
                                <div class="payment-option-card selected">
                                    <input type="radio" name="paymentMethod" value="Cash on Delivery" checked>
                                    <span class="payment-option-icon">💵</span>
                                    <span class="payment-option-title">Cash on Delivery</span>
                                    <span style="font-size: 11px; color: var(--text-muted);">Pay upon delivery</span>
                                </div>

                                <!-- UPI -->
                                <div class="payment-option-card">
                                    <input type="radio" name="paymentMethod" value="UPI">
                                    <span class="payment-option-icon">⚡</span>
                                    <span class="payment-option-title">UPI Instant</span>
                                    <span style="font-size: 11px; color: var(--text-muted);">GPay, PhonePe, Paytm</span>
                                </div>

                                <!-- Credit / Debit Card -->
                                <div class="payment-option-card">
                                    <input type="radio" name="paymentMethod" value="Credit/Debit Card">
                                    <span class="payment-option-icon">💳</span>
                                    <span class="payment-option-title">Credit / Debit Card</span>
                                    <span style="font-size: 11px; color: var(--text-muted);">Visa, MasterCard, RuPay</span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 20px;">
                            Place Order (<%= cart.getFormattedTotalAmount() %>) →
                        </button>
                    </form>
                </div>

                <!-- Right: Selected Products & Order Summary -->
                <div class="summary-card">
                    <h3 class="summary-title">Selected Products (<%= cart.getTotalItemCount() %>)</h3>

                    <div style="display: flex; flex-direction: column; gap: 14px; max-height: 280px; overflow-y: auto; padding-right: 6px; margin-bottom: 20px;">
                        <% for (CartItem item : cart.getItems()) { 
                            Product p = item.getProduct();
                        %>
                            <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                                <div style="width: 44px; height: 44px; background: var(--hero-gradient); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; padding: 4px;">
                                    <img src="<%= p.getImage() %>" alt="<%= p.getProductName() %>" style="max-height: 36px; object-fit: contain;">
                                </div>
                                <div style="flex: 1; min-width: 0;">
                                    <div style="font-size: 13px; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        <%= p.getProductName() %>
                                    </div>
                                    <div style="font-size: 11px; color: var(--text-muted);">
                                        Qty: <%= item.getQuantity() %> × <%= p.getFormattedPrice() %>
                                    </div>
                                </div>
                                <div style="font-size: 13px; font-weight: 800; color: var(--text-main);">
                                    <%= item.getFormattedSubtotal() %>
                                </div>
                            </div>
                        <% } %>
                    </div>

                    <div class="summary-row">
                        <span>Items Subtotal</span>
                        <span style="font-weight: 700; color: var(--text-main);"><%= cart.getFormattedTotalAmount() %></span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery Charges</span>
                        <span style="font-weight: 700; color: var(--success);">FREE</span>
                    </div>

                    <div class="summary-row total-row">
                        <span>Payable Amount</span>
                        <span class="price"><%= cart.getFormattedTotalAmount() %></span>
                    </div>

                    <div style="margin-top: 20px; font-size: 12px; color: var(--text-muted); background: var(--bg-page); padding: 12px; border-radius: var(--radius-md);">
                        📦 Your order will be processed and inventory reserved immediately upon clicking <strong>Place Order</strong>.
                    </div>
                </div>

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
