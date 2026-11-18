package com.shopzone.dao;

import com.shopzone.model.Product;
import com.shopzone.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * ProductDAO - Data Access Object for products table
 * Handles fetching, category filtering, search, and stock updates using JDBC.
 */
public class ProductDAO {

    /**
     * Map ResultSet row to Product object
     */
    private Product mapRow(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setProductId(rs.getString("product_id"));
        p.setProductName(rs.getString("product_name"));
        p.setCategory(rs.getString("category"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getDouble("price"));
        p.setStock(rs.getInt("stock"));
        p.setImage(rs.getString("image"));
        return p;
    }

    /**
     * Retrieves all products from the database.
     */
    public List<Product> getAllProducts() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products ORDER BY category, product_name ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Retrieves featured products for home page.
     */
    public List<Product> getFeaturedProducts(int limit) {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products ORDER BY price DESC LIMIT ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Retrieves products filtered by category.
     */
    public List<Product> getProductsByCategory(String category) {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products WHERE LOWER(category) = LOWER(?) ORDER BY product_name ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, category.trim());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Searches products by keyword (in name or description) and optional category filter.
     */
    public List<Product> searchProducts(String keyword, String category) {
        List<Product> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM products WHERE 1=1 ");

        boolean hasKeyword = (keyword != null && !keyword.trim().isEmpty());
        boolean hasCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All"));

        if (hasKeyword) {
            sql.append(" AND (LOWER(product_name) LIKE ? OR LOWER(description) LIKE ?) ");
        }
        if (hasCategory) {
            sql.append(" AND LOWER(category) = LOWER(?) ");
        }
        sql.append(" ORDER BY product_name ASC");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            if (hasKeyword) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                ps.setString(paramIndex++, pattern);
                ps.setString(paramIndex++, pattern);
            }
            if (hasCategory) {
                ps.setString(paramIndex++, category.trim());
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * Retrieves a single product by its ID.
     */
    public Product getProductById(String productId) {
        String sql = "SELECT * FROM products WHERE product_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, productId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Updates product stock within an active transaction.
     */
    public boolean deductStock(Connection conn, String productId, int quantity) throws SQLException {
        String sql = "UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?";

        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setString(2, productId);
            ps.setInt(3, quantity);

            int affected = ps.executeUpdate();
            return affected > 0;
        }
    }
}
