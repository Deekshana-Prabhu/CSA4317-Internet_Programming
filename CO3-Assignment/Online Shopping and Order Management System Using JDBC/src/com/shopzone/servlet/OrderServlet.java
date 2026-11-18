package com.shopzone.servlet;

import com.shopzone.dao.OrderDAO;
import com.shopzone.model.Cart;
import com.shopzone.model.Customer;
import com.shopzone.model.Order;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * OrderServlet - Processes customer checkout and order placement.
 * Uses POST method to receive order submissions, updates MySQL orders and order_items tables,
 * deducts inventory stock, and directs to the order confirmation page.
 */
@WebServlet(name = "OrderServlet", urlPatterns = {"/order", "/OrderServlet"})
public class OrderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private OrderDAO orderDAO;

    @Override
    public void init() throws ServletException {
        orderDAO = new OrderDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Redirect GET attempts to checkout page
        response.sendRedirect("checkout.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession();
        Cart cart = (Cart) session.getAttribute("cart");

        // Validate Cart is not empty
        if (cart == null || cart.isEmpty()) {
            session.setAttribute("orderError", "Your shopping cart is empty! Please add items before placing an order.");
            response.sendRedirect("cart.jsp");
            return;
        }

        // Check if customer is logged in
        Customer customer = (Customer) session.getAttribute("customer");
        String customerId = request.getParameter("customerId");
        String customerName = request.getParameter("customerName");
        String deliveryAddress = request.getParameter("deliveryAddress");
        String mobile = request.getParameter("mobile");
        String paymentMethod = request.getParameter("paymentMethod");

        if (customer != null) {
            if (customerId == null || customerId.trim().isEmpty()) {
                customerId = customer.getCustomerId();
            }
            if (customerName == null || customerName.trim().isEmpty()) {
                customerName = customer.getCustomerName();
            }
        }

        // Validate required order fields
        if (customerId == null || customerId.trim().isEmpty() ||
            customerName == null || customerName.trim().isEmpty() ||
            deliveryAddress == null || deliveryAddress.trim().isEmpty() ||
            mobile == null || mobile.trim().isEmpty() ||
            paymentMethod == null || paymentMethod.trim().isEmpty()) {

            session.setAttribute("orderError", "All checkout fields are required. Please fill in your delivery details.");
            response.sendRedirect("checkout.jsp");
            return;
        }

        // Validate mobile format
        if (!mobile.trim().matches("^[0-9]{10}$")) {
            session.setAttribute("orderError", "Please provide a valid 10-digit mobile number.");
            response.sendRedirect("checkout.jsp");
            return;
        }

        // Prepare Order Bean
        Order order = new Order();
        order.setCustomerId(customerId.trim());
        order.setCustomerName(customerName.trim());
        order.setDeliveryAddress(deliveryAddress.trim());
        order.setMobile(mobile.trim());
        order.setPaymentMethod(paymentMethod.trim());
        order.setTotalAmount(cart.getTotalAmount());

        try {
            // Process Transactional Order Placement & Stock Update in MySQL
            String placedOrderId = orderDAO.placeOrder(order, cart);

            // Fetch complete order details including items for confirmation
            Order fullOrder = orderDAO.getOrderById(placedOrderId);

            // Store placed order in session for order-success.jsp
            session.setAttribute("lastOrder", fullOrder);

            // Clear the shopping cart
            cart.clear();

            // Set confirmation message
            session.setAttribute("orderSuccess", "Order #" + placedOrderId + " placed successfully!");

            // Redirect to Order Summary / Confirmation page
            response.sendRedirect("order-success.jsp");

        } catch (Exception e) {
            e.printStackTrace();
            session.setAttribute("orderError", "Failed to place order: " + e.getMessage());
            response.sendRedirect("checkout.jsp");
        }
    }
}
