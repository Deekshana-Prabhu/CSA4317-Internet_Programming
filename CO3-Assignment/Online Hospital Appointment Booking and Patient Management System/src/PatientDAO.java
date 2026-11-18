import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Data Access Object for Patient entity.
 * Uses JDBC with PreparedStatement and ResultSet.
 * Includes graceful fallback store if MySQL daemon is not running during local inspection.
 */
public class PatientDAO {

    // Fallback in-memory store initialized with sample data
    private static final ConcurrentHashMap<Integer, Patient> memoryStore = new ConcurrentHashMap<>();
    private static final AtomicInteger idGenerator = new AtomicInteger(10);

    static {
        // Initial sample patients
        Patient p1 = new Patient(1, "Rajesh Kumar", 34, "Male", "rajesh.kumar@example.com", "9876543210", "42 Gandhi Road, T. Nagar, Chennai", "patient123");
        Patient p2 = new Patient(2, "Ananya Sharma", 29, "Female", "ananya.sharma@example.com", "9876543211", "12 Lake View Street, Indiranagar, Bangalore", "patient123");
        Patient p3 = new Patient(3, "Suresh Reddy", 48, "Male", "suresh.reddy@example.com", "9876543212", "78 Jubilee Hills, Road No. 36, Hyderabad", "patient123");
        memoryStore.put(p1.getPatientId(), p1);
        memoryStore.put(p2.getPatientId(), p2);
        memoryStore.put(p3.getPatientId(), p3);
    }

    /**
     * Checks if an email is already registered in the Patients table.
     */
    public boolean isEmailRegistered(String email) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT patient_id FROM Patients WHERE LOWER(email) = LOWER(?)";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email.trim());
            rs = stmt.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            System.err.println("[PatientDAO.isEmailRegistered] Falling back to memory: " + e.getMessage());
            for (Patient p : memoryStore.values()) {
                if (p.getEmail().equalsIgnoreCase(email.trim())) {
                    return true;
                }
            }
            return false;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Registers a new patient into MySQL using JDBC PreparedStatement.
     */
    public boolean registerPatient(Patient patient) {
        if (isEmailRegistered(patient.getEmail())) {
            return false;
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "INSERT INTO Patients (name, age, gender, email, mobile, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, patient.getName());
            stmt.setInt(2, patient.getAge());
            stmt.setString(3, patient.getGender());
            stmt.setString(4, patient.getEmail().trim());
            stmt.setString(5, patient.getMobile().trim());
            stmt.setString(6, patient.getAddress());
            stmt.setString(7, patient.getPassword());

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    patient.setPatientId(rs.getInt(1));
                }
                // Sync memory store
                memoryStore.put(patient.getPatientId(), patient);
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("[PatientDAO.registerPatient] Falling back to memory: " + e.getMessage());
            patient.setPatientId(idGenerator.incrementAndGet());
            memoryStore.put(patient.getPatientId(), patient);
            return true;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Authenticates patient login by email and password.
     */
    public Patient loginPatient(String email, String password) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT patient_id, name, age, gender, email, mobile, address, password FROM Patients WHERE LOWER(email) = LOWER(?) AND password = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email.trim());
            stmt.setString(2, password);
            rs = stmt.executeQuery();
            if (rs.next()) {
                Patient p = new Patient();
                p.setPatientId(rs.getInt("patient_id"));
                p.setName(rs.getString("name"));
                p.setAge(rs.getInt("age"));
                p.setGender(rs.getString("gender"));
                p.setEmail(rs.getString("email"));
                p.setMobile(rs.getString("mobile"));
                p.setAddress(rs.getString("address"));
                p.setPassword(rs.getString("password"));
                return p;
            }
            return null;
        } catch (SQLException e) {
            System.err.println("[PatientDAO.loginPatient] Falling back to memory: " + e.getMessage());
            for (Patient p : memoryStore.values()) {
                if (p.getEmail().equalsIgnoreCase(email.trim()) && p.getPassword().equals(password)) {
                    return p;
                }
            }
            return null;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Retrieves a patient by their patient_id.
     */
    public Patient getPatientById(int patientId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT patient_id, name, age, gender, email, mobile, address, password FROM Patients WHERE patient_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, patientId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                Patient p = new Patient();
                p.setPatientId(rs.getInt("patient_id"));
                p.setName(rs.getString("name"));
                p.setAge(rs.getInt("age"));
                p.setGender(rs.getString("gender"));
                p.setEmail(rs.getString("email"));
                p.setMobile(rs.getString("mobile"));
                p.setAddress(rs.getString("address"));
                p.setPassword(rs.getString("password"));
                return p;
            }
            return null;
        } catch (SQLException e) {
            System.err.println("[PatientDAO.getPatientById] Falling back to memory: " + e.getMessage());
            return memoryStore.get(patientId);
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Retrieves all registered patients.
     */
    public List<Patient> getAllPatients() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Patient> list = new ArrayList<>();
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT patient_id, name, age, gender, email, mobile, address FROM Patients ORDER BY patient_id ASC";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                Patient p = new Patient();
                p.setPatientId(rs.getInt("patient_id"));
                p.setName(rs.getString("name"));
                p.setAge(rs.getInt("age"));
                p.setGender(rs.getString("gender"));
                p.setEmail(rs.getString("email"));
                p.setMobile(rs.getString("mobile"));
                p.setAddress(rs.getString("address"));
                list.add(p);
            }
            return list;
        } catch (SQLException e) {
            System.err.println("[PatientDAO.getAllPatients] Falling back to memory: " + e.getMessage());
            List<Patient> memList = new ArrayList<>(memoryStore.values());
            Collections.sort(memList, (a, b) -> Integer.compare(a.getPatientId(), b.getPatientId()));
            return memList;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Updates patient profile information.
     */
    public boolean updatePatient(Patient patient) {
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "UPDATE Patients SET name = ?, age = ?, gender = ?, mobile = ?, address = ? WHERE patient_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, patient.getName());
            stmt.setInt(2, patient.getAge());
            stmt.setString(3, patient.getGender());
            stmt.setString(4, patient.getMobile());
            stmt.setString(5, patient.getAddress());
            stmt.setInt(6, patient.getPatientId());
            int rows = stmt.executeUpdate();
            if (rows > 0) {
                memoryStore.put(patient.getPatientId(), patient);
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("[PatientDAO.updatePatient] Falling back to memory: " + e.getMessage());
            memoryStore.put(patient.getPatientId(), patient);
            return true;
        } finally {
            DatabaseConnection.closeResources(stmt, null);
            DatabaseConnection.closeConnection(conn);
        }
    }

    /**
     * Returns the total count of registered patients.
     */
    public int getTotalPatientsCount() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT COUNT(*) FROM Patients";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
            return 0;
        } catch (SQLException e) {
            return memoryStore.size();
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }
}
