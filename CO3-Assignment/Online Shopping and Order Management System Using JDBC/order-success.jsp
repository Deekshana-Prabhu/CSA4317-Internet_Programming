<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Order, com.shopzone.model.OrderItem, com.shopzone.model.Cart, com.shopzone.dao.OrderDAO" %>
<%
    Customer customer = (Customer) session.getAttribute("customer");
    Cart cart = (Cart) session.getAttribute("cart");
    int cartCount = (cart != null) ? cart.getTotalItemCount() : 0;

    // Retrieve last placed order from session or request
    Order order = (Order) session.getAttribute("lastOrder");
    String orderIdParam = request.getParameter("orderId");

    if (order == null && orderIdParam != null && !orderIdParam.trim().isEmpty()) {
        OrderDAO dao = new OrderDAO();
        order = dao.getOrderById(orderIdParam.trim());
    }

    // Clean up one-time flash messages
    String orderSuccessMsg = (String) session.getAttribute("orderSuccess");
    if (orderSuccessMsg != null) session.removeAttribute("orderSuccess");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - SHOPZONE</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', var(--font-family); }
        @media print {
            .app-sidebar, .top-header, .app-footer, .no-print { display: none !important; }
            .app-main { margin-left: 0 !important; }
            .content-canvas { padding: 0 !important; }
        }
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
        <header class="top-header no-print">
            <button class="mobile-menu-toggle" aria-label="Toggle Sidebar Menu">☰</button>
            <div style="font-size: 18px; font-weight: 800; color: var(--text-main);">
                Order Summary & Receipt
            </div>
            <div class="header-actions">
                <a href="products" class="btn btn-primary btn-sm">Continue Shopping →</a>
            </div>
        </header>

        <div class="content-canvas">
            <% if (order != null) { %>
                <div class="success-container">
                    
                    <!-- Order Success Banner -->
                    <div class="success-header-card">
                        <div class="success-icon-badge">✓</div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Thank you for shopping with SHOPZONE. Your order has been placed and saved to our database.</p>
                        <div>
                            <span class="order-id-highlight">Order ID: <%= order.getOrderId() %></span>
                        </div>
                    </div>

                    <!-- Detailed Order Summary Card -->
                    <div class="cart-card" style="margin-bottom: 24px;">
                        <div class="cart-card-header">
                            <h3>Order Details & Customer Information</h3>
                            <span class="status-badge confirmed">● <%= order.getOrderStatus() %></span>
                        </div>
                        
                        <div style="padding: 22px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: var(--bg-page); border-bottom: 1px solid var(--border-color);">
                            <div>
                                <span style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; display: block;">Customer Name</span>
                                <strong style="font-size: 14px; color: var(--text-main);"><%= order.getCustomerName() %></strong>
                                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">ID: <%= order.getCustomerId() %></div>
                            </div>
                            <div>
                                <span style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; display: block;">Contact & Mobile</span>
                                <strong style="font-size: 14px; color: var(--text-main);"><%= order.getMobile() %></strong>
                            </div>
                            <div>
                                <span style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; display: block;">Payment Method</span>
                                <strong style="font-size: 14px; color: var(--lavender-hover);"><%= order.getPaymentMethod() %></strong>
                            </div>
                            <div>
                                <span style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; display: block;">Order Date</span>
                                <strong style="font-size: 14px; color: var(--text-main);"><%= order.getFormattedDate() %></strong>
                            </div>
                            <div style="grid-column: 1 / -1;">
                                <span style="font-size: 11px; text-transform: uppercase; color: var(--text-light); font-weight: 700; display: block;">Delivery Address</span>
                                <span style="font-size: 13px; color: var(--text-main);"><%= order.getDeliveryAddress() %></span>
                            </div>
                        </div>

                        <!-- Purchased Items Table -->
                        <div class="cart-table-wrapper">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Product ID</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <% if (order.getItems() != null && !order.getItems().isEmpty()) { 
                                        for (OrderItem item : order.getItems()) { %>
                                            <tr>
                                                <td>
                                                    <div style="display: flex; align-items: center; gap: 10px;">
                                                        <% if (item.getProductImage() != null) { %>
                                                            <img src="<%= item.getProductImage() %>" alt="" style="width: 36px; height: 36px; object-fit: contain; border-radius: 6px; background: var(--bg-page); padding: 2px;">
                                                        <% } %>
                                                        <span style="font-weight: 700; color: var(--text-main);"><%= item.getProductName() %></span>
                                                    </div>
                                                </td>
                                                <td><span class="product-id-pill">#<%= item.getProductId() %></span></td>
                                                <td><%= item.getFormattedPrice() %></td>
                                                <td style="font-weight: 700;"><%= item.getQuantity() %></td>
                                                <td style="font-weight: 800; color: var(--primary-blue-hover);"><%= item.getFormattedSubtotal() %></td>
                                            </tr>
                                        <% } 
                                    } else { %>
                                        <tr>
                                            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
                                                Item details recorded in order #<%= order.getOrderId() %>
                                            </td>
                                        </tr>
                                    <% } %>
                                </tbody>
                            </table>
                        </div>

                        <!-- Total Row Footer -->
                        <div style="padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; background: var(--bg-page); border-top: 1px solid var(--border-color);">
                            <span style="font-size: 16px; font-weight: 800; color: var(--text-main);">Grand Total Paid:</span>
                            <span style="font-size: 22px; font-weight: 800; color: var(--primary-blue-hover);"><%= order.getFormattedTotalAmount() %></span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="no-print" style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
                        <a href="my-orders" class="btn btn-primary btn-lg">📦 View My Orders</a>
                        <button onclick="window.print()" class="btn btn-secondary btn-lg">🖨️ Print Order Receipt</button>
                        <a href="products" class="btn btn-lavender btn-lg">Continue Shopping →</a>
                    </div>

                </div>
            <% } else { %>
                <!-- Fallback when no recent order is in session -->
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No Active Order Found</h3>
                    <p>It appears no recent order is currently cached in this browser session. You can view your complete past purchases on the My Orders page.</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <a href="my-orders" class="btn btn-primary">Go to My Orders</a>
                        <a href="products" class="btn btn-secondary">Browse Products</a>
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
