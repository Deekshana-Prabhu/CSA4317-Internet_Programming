package DB;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * DatabaseConnection provides standard JDBC connection management
 * for the Employee Attendance and Leave Management System.
 */
public class DatabaseConnection {

    // Database connection parameters
    private static final String URL = "jdbc:mysql://localhost:3306/employee_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // Default root password for local MySQL / XAMPP

    static {
        try {
            // Load MySQL 8+ JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            try {
                // Fallback for older MySQL connector versions if applicable
                Class.forName("com.mysql.jdbc.Driver");
            } catch (ClassNotFoundException ex) {
                System.err.println("[DatabaseConnection] MySQL JDBC Driver not found: " + ex.getMessage());
            }
        }
    }

    /**
     * Obtains a new database Connection.
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        // Allow overriding via environment or system properties if configured
        String dbUrl = System.getProperty("DB_URL", System.getenv("DB_URL") != null ? System.getenv("DB_URL") : URL);
        String dbUser = System.getProperty("DB_USER", System.getenv("DB_USER") != null ? System.getenv("DB_USER") : USER);
        String dbPass = System.getProperty("DB_PASS", System.getenv("DB_PASS") != null ? System.getenv("DB_PASS") : PASSWORD);

        return DriverManager.getConnection(dbUrl, dbUser, dbPass);
    }

    /**
     * Closes the Connection safely without throwing unhandled exceptions.
     * @param conn the Connection to close
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("[DatabaseConnection] Error closing connection: " + e.getMessage());
            }
        }
    }

    /**
     * Closes Statement/PreparedStatement and ResultSet resources safely.
     * @param stmt Statement or PreparedStatement
     * @param rs ResultSet
     */
    public static void closeResources(Statement stmt, ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                System.err.println("[DatabaseConnection] Error closing ResultSet: " + e.getMessage());
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                System.err.println("[DatabaseConnection] Error closing Statement: " + e.getMessage());
            }
        }
    }

    /**
     * Closes Connection, Statement/PreparedStatement and ResultSet resources safely.
     */
    public static void closeAll(Connection conn, Statement stmt, ResultSet rs) {
        closeResources(stmt, rs);
        closeConnection(conn);
    }
}
