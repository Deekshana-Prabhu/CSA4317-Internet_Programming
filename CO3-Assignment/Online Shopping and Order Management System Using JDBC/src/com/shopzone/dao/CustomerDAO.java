package com.shopzone.dao;

import com.shopzone.model.Customer;
import com.shopzone.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * CustomerDAO - Data Access Object for customer table
 * Handles customer registration, authentication, and ID generation via JDBC PreparedStatement.
 */
public class CustomerDAO {

    /**
     * Generates a new unique Customer ID (e.g. CUST1004).
     */
    public String generateCustomerId() {
        String newId = "CUST1001";
        String sql = "SELECT customer_id FROM customers ORDER BY customer_id DESC LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                String lastId = rs.getString("customer_id"); // e.g. CUST1003
                if (lastId != null && lastId.startsWith("CUST")) {
                    try {
                        int num = Integer.parseInt(lastId.substring(4));
                        newId = "CUST" + (num + 1);
                    } catch (NumberFormatException e) {
                        newId = "CUST" + (System.currentTimeMillis() % 100000);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            newId = "CUST" + (System.currentTimeMillis() % 100000);
        }
        return newId;
    }

    /**
     * Checks if an email is already registered to prevent duplicates.
     */
    public boolean isEmailRegistered(String email) {
        String sql = "SELECT customer_id FROM customers WHERE LOWER(email) = LOWER(?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email.trim());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Registers a new customer in MySQL.
     * @return true if successful, false otherwise
     */
    public boolean registerCustomer(Customer customer) throws SQLException {
        String sql = "INSERT INTO customers (customer_id, customer_name, email, mobile, password, address) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, customer.getCustomerId());
            ps.setString(2, customer.getCustomerName());
            ps.setString(3, customer.getEmail().trim().toLowerCase());
            ps.setString(4, customer.getMobile());
            ps.setString(5, customer.getPassword());
            ps.setString(6, customer.getAddress());

            int rows = ps.executeUpdate();
            return rows > 0;
        }
    }

    /**
     * Authenticates customer credentials.
     * @return Customer object if credentials are valid, null otherwise
     */
    public Customer loginCustomer(String email, String password) {
        String sql = "SELECT customer_id, customer_name, email, mobile, address "
                   + "FROM customers WHERE LOWER(email) = LOWER(?) AND password = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email.trim());
            ps.setString(2, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Customer customer = new Customer();
                    customer.setCustomerId(rs.getString("customer_id"));
                    customer.setCustomerName(rs.getString("customer_name"));
                    customer.setEmail(rs.getString("email"));
                    customer.setMobile(rs.getString("mobile"));
                    customer.setAddress(rs.getString("address"));
                    return customer;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Retrieves customer details by ID.
     */
    public Customer getCustomerById(String customerId) {
        String sql = "SELECT customer_id, customer_name, email, mobile, address FROM customers WHERE customer_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Customer customer = new Customer();
                    customer.setCustomerId(rs.getString("customer_id"));
                    customer.setCustomerName(rs.getString("customer_name"));
                    customer.setEmail(rs.getString("email"));
                    customer.setMobile(rs.getString("mobile"));
                    customer.setAddress(rs.getString("address"));
                    return customer;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
