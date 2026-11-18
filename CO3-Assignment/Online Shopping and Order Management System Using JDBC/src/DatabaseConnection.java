import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * DatabaseConnection - Standalone Utility Class (Default Package)
 * Provided for direct project root compilation and quick classroom reference.
 */
public class DatabaseConnection {

    private static final String DB_HOST = "localhost";
    private static final String DB_PORT = "3306";
    private static final String DB_NAME = "shopping_db";
    
    private static final String JDBC_URL = "jdbc:mysql://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME 
            + "?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC";
            
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "root";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            try {
                Class.forName("com.mysql.jdbc.Driver");
            } catch (ClassNotFoundException ex) {
                System.err.println("MySQL Driver not found in classpath!");
            }
        }
    }

    public static Connection getConnection() throws SQLException {
        try {
            return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASSWORD);
        } catch (SQLException e) {
            // Fallback for blank password
            try {
                return DriverManager.getConnection(JDBC_URL, DB_USER, "");
            } catch (SQLException ex) {
                throw e;
            }
        }
    }

    public static void closeResources(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) try { rs.close(); } catch (SQLException e) {}
        if (stmt != null) try { stmt.close(); } catch (SQLException e) {}
        if (conn != null) try { conn.close(); } catch (SQLException e) {}
    }
}
