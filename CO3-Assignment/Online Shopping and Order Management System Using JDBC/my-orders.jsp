<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.shopzone.model.Customer, com.shopzone.model.Order, com.shopzone.model.OrderItem, com.shopzone.model.Cart, com.shopzone.dao.OrderDAO, java.util.List" %>
<%
    Customer customer = (Customer) session.getAttribute("customer");
    Cart cart = (Cart) session.getAttribute("cart");
    int cartCount = (cart != null) ? cart.getTotalItemCount() : 0;

    @SuppressWarnings("unchecked")
    List<Order> orderList = (List<Order>) request.getAttribute("orderList");

    // Fallback: If accessed directly via my-orders.jsp without servlet forward
    if (orderList == null && customer != null) {
        OrderDAO dao = new OrderDAO();
        orderList = dao.getOrdersByCustomer(customer.getCustomerId());
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Orders & Purchase History - SHOPZONE</title>
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
            <a href="my-orders" class="nav-item active">
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
                <a href="cart.jsp" class="header-cart-btn">
                    <span class="header-cart-icon">🛒</span>
                    <span>Cart</span>
                    <span class="header-cart-count"><%= cartCount %></span>
                </a>
            </div>
        </header>

        <div class="content-canvas">
            
            <% if (customer == null) { %>
                <!-- Login Required Warning -->
                <div class="empty-state">
                    <div class="empty-state-icon">🔒</div>
                    <h3>Please Log In to View Your Orders</h3>
                    <p>You need to sign in with your customer account to view your past purchases and track your shipments.</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <a href="login.jsp" class="btn btn-primary btn-lg">Log In Now →</a>
                        <a href="register.jsp" class="btn btn-secondary btn-lg">Register Account</a>
                    </div>
                </div>
            <% } else { %>
                <div class="section-header">
                    <div class="section-title-wrap">
                        <h2>Purchase History for <%= customer.getCustomerName() %></h2>
                        <p>Customer ID: <strong><%= customer.getCustomerId() %></strong> • <%= orderList != null ? orderList.size() : 0 %> total order(s) retrieved from database</p>
                    </div>
                    <a href="products" class="btn btn-primary btn-sm">+ Buy More Products</a>
                </div>

                <% if (orderList == null || orderList.isEmpty()) { %>
                    <!-- No Past Orders -->
                    <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <h3>No Previous Orders Found</h3>
                        <p>You haven't placed any orders with SHOPZONE yet. Start exploring our catalogue today!</p>
                        <a href="products" class="btn btn-primary">Browse Catalogue</a>
                    </div>
                <% } else { %>
                    <!-- Order History Cards -->
                    <% for (Order o : orderList) { 
                        String statusClass = "confirmed";
                        if ("Shipped".equalsIgnoreCase(o.getOrderStatus())) {
                            statusClass = "shipped";
                        } else if ("Delivered".equalsIgnoreCase(o.getOrderStatus())) {
                            statusClass = "delivered";
                        }
                    %>
                        <div class="order-history-card">
                            <div class="order-history-header">
                                <div class="order-meta-group">
                                    <div class="order-meta-item">
                                        <span class="label">Order ID</span>
                                        <span class="val" style="color: var(--lavender-hover); font-family: monospace;"><%= o.getOrderId() %></span>
                                    </div>
                                    <div class="order-meta-item">
                                        <span class="label">Date Placed</span>
                                        <span class="val"><%= o.getFormattedDate() %></span>
                                    </div>
                                    <div class="order-meta-item">
                                        <span class="label">Payment Method</span>
                                        <span class="val"><%= o.getPaymentMethod() %></span>
                                    </div>
                                    <div class="order-meta-item">
                                        <span class="label">Total Amount</span>
                                        <span class="val" style="color: var(--primary-blue-hover); font-size: 15px;"><%= o.getFormattedTotalAmount() %></span>
                                    </div>
                                </div>
                                <div>
                                    <span class="status-badge <%= statusClass %>">● <%= o.getOrderStatus() %></span>
                                </div>
                            </div>

                            <!-- Items Table for this Order -->
                            <div class="cart-table-wrapper">
                                <table class="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Product Purchased</th>
                                            <th>Product ID</th>
                                            <th>Unit Price</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <% if (o.getItems() != null && !o.getItems().isEmpty()) { 
                                            for (OrderItem item : o.getItems()) { %>
                                                <tr>
                                                    <td>
                                                        <div style="display: flex; align-items: center; gap: 12px;">
                                                            <% if (item.getProductImage() != null) { %>
                                                                <div style="width: 40px; height: 40px; background: var(--hero-gradient); border-radius: 6px; padding: 4px; display: flex; align-items: center; justify-content: center;">
                                                                    <img src="<%= item.getProductImage() %>" alt="" style="max-height: 32px; object-fit: contain;">
                                                                </div>
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
                                                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 14px;">
                                                    Items summary recorded in order #<%= o.getOrderId() %>
                                                </td>
                                            </tr>
                                        <% } %>
                                    </tbody>
                                </table>
                            </div>

                            <div style="padding: 12px 22px; background: var(--bg-page); font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                                <span>📍 Delivery To: <strong><%= o.getCustomerName() %></strong> (<%= o.getMobile() %>) - <%= o.getDeliveryAddress() %></span>
                                <a href="order-success.jsp?orderId=<%= o.getOrderId() %>" class="btn btn-secondary btn-sm">View Receipt / Invoice</a>
                            </div>
                        </div>
                    <% } %>
                <% } %>
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
