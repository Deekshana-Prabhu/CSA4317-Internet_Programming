package com.shopzone.servlet;

import com.shopzone.dao.CustomerDAO;
import com.shopzone.model.Customer;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * LoginServlet - Handles customer login and logout
 * Validates customer credentials against the MySQL database,
 * manages the user session, and handles logout action.
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/login", "/logout", "/LoginServlet"})
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private CustomerDAO customerDAO;

    @Override
    public void init() throws ServletException {
        customerDAO = new CustomerDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");

        // Handle Logout Action
        if ("logout".equalsIgnoreCase(action)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.removeAttribute("customer");
                session.removeAttribute("customerId");
                session.removeAttribute("customerName");
                // keep cart or let user continue shopping
                session.setAttribute("successMessage", "You have been logged out successfully.");
            }
            response.sendRedirect("login.jsp");
            return;
        }

        // Forward to login page
        request.getRequestDispatcher("login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please enter both email address and password.");
            request.getRequestDispatcher("login.jsp").forward(request, response);
            return;
        }

        email = email.trim();
        Customer customer = customerDAO.loginCustomer(email, password);

        if (customer != null) {
            // Login Successful
            HttpSession session = request.getSession();
            session.setAttribute("customer", customer);
            session.setAttribute("customerId", customer.getCustomerId());
            session.setAttribute("customerName", customer.getCustomerName());
            session.setAttribute("customerEmail", customer.getEmail());

            // Redirect to target or products page
            String redirectUrl = (String) session.getAttribute("redirectAfterLogin");
            if (redirectUrl != null && !redirectUrl.isEmpty()) {
                session.removeAttribute("redirectAfterLogin");
                response.sendRedirect(redirectUrl);
            } else {
                response.sendRedirect("products.jsp");
            }
        } else {
            // Login Failed
            request.setAttribute("errorMessage", "Invalid email address or password. Please verify your credentials.");
            request.setAttribute("enteredEmail", email);
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
    }
}
