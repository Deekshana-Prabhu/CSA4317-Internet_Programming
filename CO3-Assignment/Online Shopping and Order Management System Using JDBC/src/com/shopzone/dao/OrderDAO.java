package com.shopzone.dao;

import com.shopzone.model.Cart;
import com.shopzone.model.CartItem;
import com.shopzone.model.Order;
import com.shopzone.model.OrderItem;
import com.shopzone.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * OrderDAO - Data Access Object for orders and order_items tables
 * Handles transactional order placement, stock deduction, and purchase history retrieval.
 */
public class OrderDAO {

    /**
     * Generates a unique readable Order ID (e.g. ORD-20261118-4921)
     */
    public String generateOrderId() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String datePart = sdf.format(new Date());
        int randomPart = (int) (Math.random() * 9000) + 1000;
        return "ORD-" + datePart + "-" + randomPart;
    }

    /**
     * Places a customer order using a secure database transaction.
     * Inserts into orders, order_items, and decrements stock in products.
     * Rolls back on any failure or insufficient stock.
     * 
     * @param order Order metadata (customer, payment method, address)
     * @param cart Active cart with items
     * @return generated order_id if successful, null if failed
     * @throws Exception with error message if stock insufficient or database error
     */
    public String placeOrder(Order order, Cart cart) throws Exception {
        if (cart == null || cart.isEmpty()) {
            throw new IllegalArgumentException("Cannot place order with an empty shopping cart!");
        }

        Connection conn = null;
        PreparedStatement psOrder = null;
        PreparedStatement psItem = null;
        PreparedStatement psStockCheck = null;
        PreparedStatement psStockUpdate = null;

        String orderId = generateOrderId();
        order.setOrderId(orderId);

        try {
            conn = DatabaseConnection.getConnection();
            // Start Transaction
            conn.setAutoCommit(false);

            // Step 1: Check available stock for each item before placing
            String checkStockSql = "SELECT stock, product_name FROM products WHERE product_id = ? FOR UPDATE";
            psStockCheck = conn.prepareStatement(checkStockSql);

            for (CartItem item : cart.getItems()) {
                psStockCheck.setString(1, item.getProduct().getProductId());
                try (ResultSet rs = psStockCheck.executeQuery()) {
                    if (rs.next()) {
                        int currentStock = rs.getInt("stock");
                        String pName = rs.getString("product_name");
                        if (currentStock < item.getQuantity()) {
                            throw new Exception("Insufficient stock for '" + pName + "'. Available: " 
                                    + currentStock + ", Requested: " + item.getQuantity());
                        }
                    } else {
                        throw new Exception("Product '" + item.getProduct().getProductId() + "' not found in catalog!");
                    }
                }
            }

            // Step 2: Insert into orders table
            String insertOrderSql = "INSERT INTO orders (order_id, customer_id, total_amount, payment_method, order_date, order_status) "
                                  + "VALUES (?, ?, ?, ?, ?, ?)";
            psOrder = conn.prepareStatement(insertOrderSql);
            psOrder.setString(1, orderId);
            psOrder.setString(2, order.getCustomerId());
            psOrder.setDouble(3, cart.getTotalAmount());
            psOrder.setString(4, order.getPaymentMethod());
            Timestamp now = new Timestamp(System.currentTimeMillis());
            psOrder.setTimestamp(5, now);
            psOrder.setString(6, "Confirmed");
            psOrder.executeUpdate();

            // Step 3: Insert into order_items table and deduct stock
            String insertItemSql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
            psItem = conn.prepareStatement(insertItemSql);

            String updateStockSql = "UPDATE products SET stock = stock - ? WHERE product_id = ?";
            psStockUpdate = conn.prepareStatement(updateStockSql);

            for (CartItem item : cart.getItems()) {
                // Insert order item
                psItem.setString(1, orderId);
                psItem.setString(2, item.getProduct().getProductId());
                psItem.setInt(3, item.getQuantity());
                psItem.setDouble(4, item.getProduct().getPrice());
                psItem.addBatch();

                // Deduct stock
                psStockUpdate.setInt(1, item.getQuantity());
                psStockUpdate.setString(2, item.getProduct().getProductId());
                psStockUpdate.addBatch();
            }

            psItem.executeBatch();
            psStockUpdate.executeBatch();

            // Commit Transaction
            conn.commit();
            order.setOrderDate(now);
            order.setOrderStatus("Confirmed");
            order.setTotalAmount(cart.getTotalAmount());

            return orderId;

        } catch (Exception e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            throw e;
        } finally {
            if (psStockCheck != null) try { psStockCheck.close(); } catch (SQLException e) {}
            if (psOrder != null) try { psOrder.close(); } catch (SQLException e) {}
            if (psItem != null) try { psItem.close(); } catch (SQLException e) {}
            if (psStockUpdate != null) try { psStockUpdate.close(); } catch (SQLException e) {}
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * Retrieves all orders placed by a specific customer with item details.
     */
    public List<Order> getOrdersByCustomer(String customerId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT o.order_id, o.customer_id, o.total_amount, o.payment_method, o.order_date, o.order_status, "
                   + "c.customer_name, c.mobile, c.address "
                   + "FROM orders o "
                   + "JOIN customers c ON o.customer_id = c.customer_id "
                   + "WHERE o.customer_id = ? "
                   + "ORDER BY o.order_date DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Order order = new Order();
                    order.setOrderId(rs.getString("order_id"));
                    order.setCustomerId(rs.getString("customer_id"));
                    order.setCustomerName(rs.getString("customer_name"));
                    order.setMobile(rs.getString("mobile"));
                    order.setDeliveryAddress(rs.getString("address"));
                    order.setTotalAmount(rs.getDouble("total_amount"));
                    order.setPaymentMethod(rs.getString("payment_method"));
                    order.setOrderDate(rs.getTimestamp("order_date"));
                    order.setOrderStatus(rs.getString("order_status"));

                    // Fetch items for this order
                    order.setItems(getOrderItems(conn, order.getOrderId()));
                    orders.add(order);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    /**
     * Retrieves a single order with its items by Order ID.
     */
    public Order getOrderById(String orderId) {
        String sql = "SELECT o.order_id, o.customer_id, o.total_amount, o.payment_method, o.order_date, o.order_status, "
                   + "c.customer_name, c.mobile, c.address "
                   + "FROM orders o "
                   + "JOIN customers c ON o.customer_id = c.customer_id "
                   + "WHERE o.order_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Order order = new Order();
                    order.setOrderId(rs.getString("order_id"));
                    order.setCustomerId(rs.getString("customer_id"));
                    order.setCustomerName(rs.getString("customer_name"));
                    order.setMobile(rs.getString("mobile"));
                    order.setDeliveryAddress(rs.getString("address"));
                    order.setTotalAmount(rs.getDouble("total_amount"));
                    order.setPaymentMethod(rs.getString("payment_method"));
                    order.setOrderDate(rs.getTimestamp("order_date"));
                    order.setOrderStatus(rs.getString("order_status"));

                    order.setItems(getOrderItems(conn, orderId));
                    return order;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Helper to retrieve items for an order, joining with products table.
     */
    private List<OrderItem> getOrderItems(Connection conn, String orderId) throws SQLException {
        List<OrderItem> items = new ArrayList<>();
        String sql = "SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity, oi.price, "
                   + "p.product_name, p.image "
                   + "FROM order_items oi "
                   + "JOIN products p ON oi.product_id = p.product_id "
                   + "WHERE oi.order_id = ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrderItem item = new OrderItem();
                    item.setOrderItemId(rs.getInt("order_item_id"));
                    item.setOrderId(rs.getString("order_id"));
                    item.setProductId(rs.getString("product_id"));
                    item.setProductName(rs.getString("product_name"));
                    item.setProductImage(rs.getString("image"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setPrice(rs.getDouble("price"));
                    items.add(item);
                }
            }
        }
        return items;
    }
}
