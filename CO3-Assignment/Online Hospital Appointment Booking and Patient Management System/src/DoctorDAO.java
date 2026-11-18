import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Data Access Object for Doctor entity.
 * Uses JDBC with PreparedStatement and ResultSet.
 * Includes graceful fallback store if MySQL daemon is not running during local inspection.
 */
public class DoctorDAO {

    private static final ConcurrentHashMap<Integer, Doctor> memoryStore = new ConcurrentHashMap<>();
    private static final AtomicInteger idGenerator = new AtomicInteger(20);

    static {
        // Multi-speciality hospital sample doctors
        Doctor d1 = new Doctor(1, "Dr. Rajesh Sharma", "Cardiology", "MBBS, MD, DM (Cardiology)", "15 Years", new BigDecimal("900.00"), "Monday - Saturday");
        Doctor d2 = new Doctor(2, "Dr. Sneha Rao", "Dermatology", "MBBS, MD (Dermatology, Venereology & Leprosy)", "9 Years", new BigDecimal("650.00"), "Monday - Friday");
        Doctor d3 = new Doctor(3, "Dr. Arvind Patel", "Neurology", "MBBS, MD (Med), DM (Neurology)", "18 Years", new BigDecimal("1200.00"), "Tuesday - Saturday");
        Doctor d4 = new Doctor(4, "Dr. Vikram Malhotra", "Orthopaedics", "MBBS, MS (Orthopaedics), M.Ch", "14 Years", new BigDecimal("800.00"), "Monday - Friday");
        Doctor d5 = new Doctor(5, "Dr. Priya Menon", "Paediatrics", "MBBS, MD (Paediatrics), DCH", "11 Years", new BigDecimal("700.00"), "Monday - Saturday");
        Doctor d6 = new Doctor(6, "Dr. Amitava Sen", "General Medicine", "MBBS, MD (Internal Medicine)", "16 Years", new BigDecimal("500.00"), "All Days (Mon - Sun)");

        memoryStore.put(d1.getDoctorId(), d1);
        memoryStore.put(d2.getDoctorId(), d2);
        memoryStore.put(d3.getDoctorId(), d3);
        memoryStore.put(d4.getDoctorId(), d4);
        memoryStore.put(d5.getDoctorId(), d5);
        memoryStore.put(d6.getDoctorId(), d6);
    }

    /**
     * Retrieves all doctors ordered by ID.
     */
    public List<Doctor> getAllDoctors() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Doctor> list = new ArrayList<>();
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT doctor_id, name, specialization, qualification, experience, fee, available_days FROM Doctors ORDER BY doctor_id ASC";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                Doctor d = new Doctor();
                d.setDoctorId(rs.getInt("doctor_id"));
                d.setName(rs.getString("name"));
                d.setSpecialization(rs.getString("specialization"));
                d.setQualification(rs.getString("qualification"));
                d.setExperience(rs.getString("experience"));
                d.setFee(rs.getBigDecimal("fee"));
                d.setAvailableDays(rs.getString("available_days"));
                d.setAvailableTimeSlots("09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM");
                list.add(d);
            }
            return list;
        } catch (SQLException e) {
            System.err.println("[DoctorDAO.getAllDoctors] Falling back to memory: " + e.getMessage());
            List<Doctor> memList = new ArrayList<>(memoryStore.values());
            Collections.sort(memList, (a, b) -> Integer.compare(a.getDoctorId(), b.getDoctorId()));
            return memList;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Retrieves a doctor by their doctor_id.
     */
    public Doctor getDoctorById(int doctorId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT doctor_id, name, specialization, qualification, experience, fee, available_days FROM Doctors WHERE doctor_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, doctorId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                Doctor d = new Doctor();
                d.setDoctorId(rs.getInt("doctor_id"));
                d.setName(rs.getString("name"));
                d.setSpecialization(rs.getString("specialization"));
                d.setQualification(rs.getString("qualification"));
                d.setExperience(rs.getString("experience"));
                d.setFee(rs.getBigDecimal("fee"));
                d.setAvailableDays(rs.getString("available_days"));
                d.setAvailableTimeSlots("09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM");
                return d;
            }
            return null;
        } catch (SQLException e) {
            System.err.println("[DoctorDAO.getDoctorById] Falling back to memory: " + e.getMessage());
            return memoryStore.get(doctorId);
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Retrieves doctors filtered by specialization.
     */
    public List<Doctor> getDoctorsBySpecialization(String spec) {
        if (spec == null || spec.trim().isEmpty() || spec.equalsIgnoreCase("All")) {
            return getAllDoctors();
        }
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Doctor> list = new ArrayList<>();
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT doctor_id, name, specialization, qualification, experience, fee, available_days FROM Doctors WHERE LOWER(specialization) = LOWER(?) ORDER BY doctor_id ASC";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, spec.trim());
            rs = stmt.executeQuery();
            while (rs.next()) {
                Doctor d = new Doctor();
                d.setDoctorId(rs.getInt("doctor_id"));
                d.setName(rs.getString("name"));
                d.setSpecialization(rs.getString("specialization"));
                d.setQualification(rs.getString("qualification"));
                d.setExperience(rs.getString("experience"));
                d.setFee(rs.getBigDecimal("fee"));
                d.setAvailableDays(rs.getString("available_days"));
                d.setAvailableTimeSlots("09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM");
                list.add(d);
            }
            return list;
        } catch (SQLException e) {
            System.err.println("[DoctorDAO.getDoctorsBySpecialization] Falling back to memory: " + e.getMessage());
            for (Doctor d : memoryStore.values()) {
                if (d.getSpecialization().equalsIgnoreCase(spec.trim())) {
                    list.add(d);
                }
            }
            return list;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Adds a new doctor into the database.
     */
    public boolean addDoctor(Doctor doctor) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "INSERT INTO Doctors (name, specialization, qualification, experience, fee, available_days) VALUES (?, ?, ?, ?, ?, ?)";
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, doctor.getName());
            stmt.setString(2, doctor.getSpecialization());
            stmt.setString(3, doctor.getQualification());
            stmt.setString(4, doctor.getExperience());
            stmt.setBigDecimal(5, doctor.getFee());
            stmt.setString(6, doctor.getAvailableDays());

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    doctor.setDoctorId(rs.getInt(1));
                }
                memoryStore.put(doctor.getDoctorId(), doctor);
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("[DoctorDAO.addDoctor] Falling back to memory: " + e.getMessage());
            doctor.setDoctorId(idGenerator.incrementAndGet());
            memoryStore.put(doctor.getDoctorId(), doctor);
            return true;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Updates existing doctor information.
     */
    public boolean updateDoctor(Doctor doctor) {
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "UPDATE Doctors SET name = ?, specialization = ?, qualification = ?, experience = ?, fee = ?, available_days = ? WHERE doctor_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, doctor.getName());
            stmt.setString(2, doctor.getSpecialization());
            stmt.setString(3, doctor.getQualification());
            stmt.setString(4, doctor.getExperience());
            stmt.setBigDecimal(5, doctor.getFee());
            stmt.setString(6, doctor.getAvailableDays());
            stmt.setInt(7, doctor.getDoctorId());

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                memoryStore.put(doctor.getDoctorId(), doctor);
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("[DoctorDAO.updateDoctor] Falling back to memory: " + e.getMessage());
            memoryStore.put(doctor.getDoctorId(), doctor);
            return true;
        } finally {
            DatabaseConnection.closeResources(stmt, null);
            DatabaseConnection.closeConnection(conn);
        }
    }

    /**
     * Deletes a doctor record by ID.
     */
    public boolean deleteDoctor(int doctorId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "DELETE FROM Doctors WHERE doctor_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, doctorId);
            int rows = stmt.executeUpdate();
            memoryStore.remove(doctorId);
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("[DoctorDAO.deleteDoctor] Falling back to memory: " + e.getMessage());
            memoryStore.remove(doctorId);
            return true;
        } finally {
            DatabaseConnection.closeResources(stmt, null);
            DatabaseConnection.closeConnection(conn);
        }
    }

    /**
     * Returns a list of distinct specializations available in the hospital.
     */
    public List<String> getAllSpecializations() {
        Set<String> set = new LinkedHashSet<>();
        // Standard hospital core specializations
        set.add("Cardiology");
        set.add("Dermatology");
        set.add("Neurology");
        set.add("Orthopaedics");
        set.add("Paediatrics");
        set.add("General Medicine");

        for (Doctor d : getAllDoctors()) {
            if (d.getSpecialization() != null && !d.getSpecialization().trim().isEmpty()) {
                set.add(d.getSpecialization().trim());
            }
        }
        return new ArrayList<>(set);
    }

    /**
     * Returns total doctor count.
     */
    public int getTotalDoctorsCount() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT COUNT(*) FROM Doctors";
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
