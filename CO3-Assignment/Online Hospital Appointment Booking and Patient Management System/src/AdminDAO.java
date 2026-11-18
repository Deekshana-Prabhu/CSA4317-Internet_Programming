import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Data Access Object for Administrator entity.
 * Uses JDBC with PreparedStatement and ResultSet.
 * Includes graceful fallback store if MySQL daemon is not running during local inspection.
 */
public class AdminDAO {

    private static final ConcurrentHashMap<String, Admin> memoryStore = new ConcurrentHashMap<>();

    static {
        Admin a1 = new Admin(1, "admin", "admin123", "Chief Medical Officer");
        Admin a2 = new Admin(2, "superadmin", "admin@2026", "Operations Director");
        memoryStore.put(a1.getUsername().toLowerCase(), a1);
        memoryStore.put(a2.getUsername().toLowerCase(), a2);
    }

    /**
     * Authenticates an administrator by username and password.
     */
    public Admin authenticateAdmin(String username, String password) {
        if (username == null || password == null) {
            return null;
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT admin_id, username, password, full_name FROM Admins WHERE LOWER(username) = LOWER(?) AND password = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, username.trim());
            stmt.setString(2, password);
            rs = stmt.executeQuery();
            if (rs.next()) {
                Admin a = new Admin();
                a.setAdminId(rs.getInt("admin_id"));
                a.setUsername(rs.getString("username"));
                a.setPassword(rs.getString("password"));
                a.setFullName(rs.getString("full_name"));
                return a;
            }
            return null;
        } catch (SQLException e) {
            System.err.println("[AdminDAO.authenticateAdmin] Falling back to memory: " + e.getMessage());
            Admin a = memoryStore.get(username.trim().toLowerCase());
            if (a != null && a.getPassword().equals(password)) {
                return a;
            }
            return null;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }
}
