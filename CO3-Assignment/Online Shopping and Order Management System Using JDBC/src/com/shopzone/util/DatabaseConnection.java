package com.shopzone.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * DatabaseConnection Utility Class
 * Manages JDBC connection lifecycle to MySQL database 'shopping_db'.
 * Uses modern MySQL Connector/J driver with fallback to legacy driver.
 */
public class DatabaseConnection {

    // Database Configuration Parameters
    // Modify USER and PASSWORD according to your local MySQL configuration
    private static final String DB_HOST = "localhost";
    private static final String DB_PORT = "3306";
    private static final String DB_NAME = "shopping_db";
    
    // Connection URL with timezone and SSL parameters for maximum compatibility
    private static final String JDBC_URL = "jdbc:mysql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME 
            + "?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC";
            
    private static final String DB_USER = System.getProperty("db.user", "root");
    private static final String DB_PASSWORD = System.getProperty("db.password", "root");

    // Static initializer to load the MySQL JDBC driver once
    static {
        try {
            // Modern Connector/J 8.x/9.x class
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            try {
                // Fallback to legacy MySQL Connector/J 5.x class
                Class.forName("com.mysql.jdbc.Driver");
            } catch (ClassNotFoundException ex) {
                System.err.println("DatabaseConnection ERROR: MySQL JDBC Driver not found in classpath!");
                ex.printStackTrace();
            }
        }
    }

    /**
     * Establishes and returns a fresh JDBC Connection.
     * @return Connection object to 'shopping_db'
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASSWORD);
        } catch (SQLException e) {
            // If default password 'root' fails, try empty password '' commonly used in XAMPP / local setups
            if ("root".equals(DB_PASSWORD)) {
                try {
                    return DriverManager.getConnection(JDBC_URL, DB_USER, "");
                } catch (SQLException fallbackException) {
                    System.err.println("DatabaseConnection ERROR: Failed to connect to MySQL database.");
                    System.err.println("URL: " + JDBC_URL);
                    System.err.println("User: " + DB_USER);
                    throw e; // throw original exception
                }
            }
            throw e;
        }
    }

    /**
     * Helper method to safely close JDBC resources to avoid connection leaks.
     */
    public static void closeResources(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
