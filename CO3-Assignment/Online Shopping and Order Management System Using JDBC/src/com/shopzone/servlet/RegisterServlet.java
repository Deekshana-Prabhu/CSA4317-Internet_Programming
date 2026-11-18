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
 * RegisterServlet - Handles customer registration
 * Validates inputs, prevents duplicate email, automatically generates Customer ID,
 * and persists the customer to the MySQL database.
 */
@WebServlet(name = "RegisterServlet", urlPatterns = {"/register", "/RegisterServlet"})
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private CustomerDAO customerDAO;

    @Override
    public void init() throws ServletException {
        customerDAO = new CustomerDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Pre-generate the next customer ID for preview on registration form
        String nextCustomerId = customerDAO.generateCustomerId();
        request.setAttribute("previewCustomerId", nextCustomerId);
        request.getRequestDispatcher("register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String customerName = request.getParameter("customerName");
        String email = request.getParameter("email");
        String mobile = request.getParameter("mobile");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String address = request.getParameter("address");

        // Preserve entered form values in case of validation failure
        request.setAttribute("val_name", customerName);
        request.setAttribute("val_email", email);
        request.setAttribute("val_mobile", mobile);
        request.setAttribute("val_address", address);

        // Validation 1: Required fields check
        if (customerName == null || customerName.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            mobile == null || mobile.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            confirmPassword == null || confirmPassword.trim().isEmpty() ||
            address == null || address.trim().isEmpty()) {

            request.setAttribute("errorMessage", "All fields are required. Please fill in all details.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        customerName = customerName.trim();
        email = email.trim().toLowerCase();
        mobile = mobile.trim();
        address = address.trim();

        // Validation 2: Email format validation
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        if (!email.matches(emailRegex)) {
            request.setAttribute("errorMessage", "Please provide a valid email address (e.g. user@example.com).");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        // Validation 3: Mobile number validation (10 digits)
        String mobileRegex = "^[0-9]{10}$";
        if (!mobile.matches(mobileRegex)) {
            request.setAttribute("errorMessage", "Please provide a valid 10-digit mobile number.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        // Validation 4: Password confirmation check
        if (!password.equals(confirmPassword)) {
            request.setAttribute("errorMessage", "Passwords do not match. Please try again.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        if (password.length() < 6) {
            request.setAttribute("errorMessage", "Password must be at least 6 characters long.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        // Validation 5: Prevent duplicate email registration
        if (customerDAO.isEmailRegistered(email)) {
            request.setAttribute("errorMessage", "An account with email '" + email + "' is already registered. Please log in.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        // Generate automatic Customer ID
        String customerId = customerDAO.generateCustomerId();

        Customer newCustomer = new Customer(customerId, customerName, email, mobile, password, address);

        try {
            boolean success = customerDAO.registerCustomer(newCustomer);
            if (success) {
                HttpSession session = request.getSession();
                session.setAttribute("successMessage", "Registration successful! Your Customer ID is: " 
                        + customerId + ". You can now log in.");
                response.sendRedirect("login.jsp");
            } else {
                request.setAttribute("errorMessage", "Registration failed due to a server error. Please try again.");
                request.getRequestDispatcher("register.jsp").forward(request, response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("errorMessage", "Database error: " + e.getMessage());
            request.getRequestDispatcher("register.jsp").forward(request, response);
        }
    }
}
