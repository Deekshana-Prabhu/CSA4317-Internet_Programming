import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Utility class to manage JDBC Database Connections for MySQL hospital_db.
 */
public class DatabaseConnection {

    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/hospital_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            try {
                Class.forName("com.mysql.jdbc.Driver");
            } catch (ClassNotFoundException ex) {
                System.err.println("[DatabaseConnection] MySQL JDBC Driver not found: " + ex.getMessage());
            }
        }
    }

    /**
     * Obtains a new database connection to MySQL.
     * Respects environment variables DB_URL, DB_USER, DB_PASS or System properties.
     */
    public static Connection getConnection() throws SQLException {
        String envUrl = System.getenv("DB_URL");
        String url = (envUrl != null && !envUrl.trim().isEmpty()) 
                     ? envUrl 
                     : System.getProperty("DB_URL", DEFAULT_URL);

        String envUser = System.getenv("DB_USER");
        String user = (envUser != null && !envUser.trim().isEmpty()) 
                      ? envUser 
                      : System.getProperty("DB_USER", DEFAULT_USER);

        String envPass = System.getenv("DB_PASS");
        String pass = (envPass != null) 
                      ? envPass 
                      : System.getProperty("DB_PASS", DEFAULT_PASSWORD);

        return DriverManager.getConnection(url, user, pass);
    }

    /**
     * Checks whether the MySQL database is currently reachable.
     */
    public static boolean isDatabaseAvailable() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Safely closes a Connection.
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
     * Safely closes Statement and ResultSet.
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
     * Safely closes Connection, Statement and ResultSet together.
     */
    public static void closeAll(Connection conn, Statement stmt, ResultSet rs) {
        closeResources(stmt, rs);
        closeConnection(conn);
    }
}
