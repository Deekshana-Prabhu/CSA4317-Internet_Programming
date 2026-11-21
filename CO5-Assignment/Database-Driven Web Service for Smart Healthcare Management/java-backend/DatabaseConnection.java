package com.mediconnect.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Reusable JDBC Database Connection Utility
 * Manages database driver registration, configuration loading,
 * and secure connection establishment to the centralized MySQL instance.
 *
 * Security note: Passwords and connection secrets are loaded dynamically from 
 * external properties or system environment variables to prevent hardcoded credentials.
 */
public class DatabaseConnection {

    private static final Logger LOGGER = Logger.getLogger(DatabaseConnection.class.getName());
    private static final Properties properties = new Properties();

    private static String dbUrl;
    private static String dbUser;
    private static String dbPassword;
    private static String dbDriver;

    static {
        loadConfiguration();
    }

    /**
     * Loads database configuration from classpath properties or environment variables.
     */
    private static synchronized void loadConfiguration() {
        try (InputStream input = DatabaseConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                properties.load(input);
                LOGGER.info("Successfully loaded database configuration from db.properties");
            } else {
                LOGGER.warning("db.properties not found on classpath. Falling back to environment variables or defaults.");
            }
        } catch (Exception ex) {
            LOGGER.log(Level.WARNING, "Failed reading db.properties. Utilizing environment fallback.", ex);
        }

        // Environment variables take precedence over properties files for cloud/container deployment
        dbDriver = System.getenv().getOrDefault("DB_DRIVER", 
                   properties.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));
        dbUrl = System.getenv().getOrDefault("DB_URL", 
                properties.getProperty("db.url", "jdbc:mysql://localhost:3306/medic_connect_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"));
        dbUser = System.getenv().getOrDefault("DB_USER", 
                 properties.getProperty("db.user", "root"));
        dbPassword = System.getenv().getOrDefault("DB_PASSWORD", 
                     properties.getProperty("db.password", ""));

        // Register JDBC Driver
        try {
            Class.forName(dbDriver);
            LOGGER.info("MySQL JDBC Driver registered: " + dbDriver);
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found in classpath: " + dbDriver, e);
        }
    }

    /**
     * Establishes and returns a new JDBC Connection to MySQL medic_connect_db.
     *
     * @return active java.sql.Connection
     * @throws SQLException when connection cannot be established
     */
    public static Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(dbUrl, dbUser, dbPassword);
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Database connection error to: " + dbUrl, ex);
            throw new SQLException("Failed to connect to MediConnect MySQL database: " + ex.getMessage(), ex);
        }
    }

    /**
     * Helper to verify database connectivity status.
     *
     * @return true if connection succeeds and is valid; false otherwise
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed() && conn.isValid(3);
        } catch (Exception e) {
            LOGGER.log(Level.FINE, "Database connection check failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Safely closes an AutoCloseable resource (Connection, Statement, ResultSet).
     *
     * @param closeable resource to close
     */
    public static void closeQuietly(AutoCloseable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (Exception ignored) {
                // Ignore silent close
            }
        }
    }
}
