package com.shopzone.servlet;

import com.shopzone.dao.OrderDAO;
import com.shopzone.model.Customer;
import com.shopzone.model.Order;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

/**
 * PurchaseHistoryServlet - Retrieves customer order history
 * Fetches previous orders and line items from MySQL database
 * for the authenticated customer and forwards to my-orders.jsp.
 */
@WebServlet(name = "PurchaseHistoryServlet", urlPatterns = {"/my-orders", "/PurchaseHistoryServlet"})
public class PurchaseHistoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private OrderDAO orderDAO;

    @Override
    public void init() throws ServletException {
        orderDAO = new OrderDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Customer customer = (Customer) session.getAttribute("customer");

        if (customer == null) {
            session.setAttribute("redirectAfterLogin", "my-orders");
            session.setAttribute("errorMessage", "Please log in to view your purchase history.");
            response.sendRedirect("login.jsp");
            return;
        }

        String customerId = customer.getCustomerId();
        List<Order> orderList = orderDAO.getOrdersByCustomer(customerId);

        request.setAttribute("orderList", orderList);
        request.setAttribute("orderCount", orderList.size());

        request.getRequestDispatcher("my-orders.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}
