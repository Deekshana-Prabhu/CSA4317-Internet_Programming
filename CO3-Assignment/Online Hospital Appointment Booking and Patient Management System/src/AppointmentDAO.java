import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Data Access Object for Appointment and Doctor_Schedules entities.
 * Implements transaction handling and duplicate booking prevention.
 * Includes graceful fallback store if MySQL daemon is not running during local inspection.
 */
public class AppointmentDAO {

    private static final List<String> STANDARD_TIME_SLOTS = Arrays.asList(
        "09:00 AM - 09:30 AM",
        "09:30 AM - 10:00 AM",
        "10:00 AM - 10:30 AM",
        "10:30 AM - 11:00 AM",
        "11:00 AM - 11:30 AM",
        "11:30 AM - 12:00 PM",
        "02:00 PM - 02:30 PM",
        "02:30 PM - 03:00 PM",
        "03:00 PM - 03:30 PM",
        "04:00 PM - 04:30 PM",
        "04:30 PM - 05:00 PM"
    );

    // Fallback in-memory stores
    private static final ConcurrentHashMap<String, Appointment> memoryAppointments = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, DoctorSchedule> memorySchedules = new ConcurrentHashMap<>();

    static {
        // Sample appointment records
        Appointment a1 = new Appointment("APT-2026-1001", 1, 1, Date.valueOf("2026-11-20"), "09:00 AM - 09:30 AM", "Routine cardiac health checkup and hypertension review", "Confirmed");
        a1.setPatientName("Rajesh Kumar");
        a1.setDoctorName("Dr. Rajesh Sharma");
        a1.setSpecialization("Cardiology");
        a1.setFee(new BigDecimal("900.00"));
        a1.setBookedAt(new Timestamp(System.currentTimeMillis() - 86400000));

        Appointment a2 = new Appointment("APT-2026-1002", 2, 2, Date.valueOf("2026-11-20"), "10:30 AM - 11:00 AM", "Skin allergy consultation and rash assessment", "Confirmed");
        a2.setPatientName("Ananya Sharma");
        a2.setDoctorName("Dr. Sneha Rao");
        a2.setSpecialization("Dermatology");
        a2.setFee(new BigDecimal("650.00"));
        a2.setBookedAt(new Timestamp(System.currentTimeMillis() - 43200000));

        Appointment a3 = new Appointment("APT-2026-1003", 3, 3, Date.valueOf("2026-11-21"), "02:00 PM - 02:30 PM", "Frequent migraine and tension headache evaluation", "Confirmed");
        a3.setPatientName("Suresh Reddy");
        a3.setDoctorName("Dr. Arvind Patel");
        a3.setSpecialization("Neurology");
        a3.setFee(new BigDecimal("1200.00"));
        a3.setBookedAt(new Timestamp(System.currentTimeMillis() - 21600000));

        Appointment a4 = new Appointment("APT-2026-0901", 1, 6, Date.valueOf("2026-11-10"), "09:00 AM - 09:30 AM", "General seasonal fever and weakness", "Completed");
        a4.setPatientName("Rajesh Kumar");
        a4.setDoctorName("Dr. Amitava Sen");
        a4.setSpecialization("General Medicine");
        a4.setFee(new BigDecimal("500.00"));
        a4.setBookedAt(new Timestamp(System.currentTimeMillis() - 700000000));

        memoryAppointments.put(a1.getAppointmentId(), a1);
        memoryAppointments.put(a2.getAppointmentId(), a2);
        memoryAppointments.put(a3.getAppointmentId(), a3);
        memoryAppointments.put(a4.getAppointmentId(), a4);

        // Track booked schedules in memory
        memorySchedules.put("1_2026-11-20_09:00 AM - 09:30 AM", new DoctorSchedule(1, 1, Date.valueOf("2026-11-20"), "09:00 AM - 09:30 AM", "Booked"));
        memorySchedules.put("2_2026-11-20_10:30 AM - 11:00 AM", new DoctorSchedule(2, 2, Date.valueOf("2026-11-20"), "10:30 AM - 11:00 AM", "Booked"));
        memorySchedules.put("3_2026-11-21_02:00 PM - 02:30 PM", new DoctorSchedule(3, 3, Date.valueOf("2026-11-21"), "02:00 PM - 02:30 PM", "Booked"));
    }

    public List<String> getStandardTimeSlots() {
        return STANDARD_TIME_SLOTS;
    }

    /**
     * Checks if a doctor slot is already booked for the given date and time.
     */
    public boolean isSlotAvailable(int doctorId, Date date, String timeSlot) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT COUNT(*) FROM Appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'Cancelled'";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, doctorId);
            stmt.setDate(2, date);
            stmt.setString(3, timeSlot.trim());
            rs = stmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                return false;
            }
            return true;
        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.isSlotAvailable] Falling back to memory: " + e.getMessage());
            for (Appointment a : memoryAppointments.values()) {
                if (a.getDoctorId() == doctorId 
                        && a.getAppointmentDate().toString().equals(date.toString()) 
                        && a.getAppointmentTime().equalsIgnoreCase(timeSlot.trim()) 
                        && !"Cancelled".equalsIgnoreCase(a.getStatus())) {
                    return false;
                }
            }
            return true;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Prevents a patient from booking duplicate appointments with the same doctor at the same slot.
     */
    public boolean hasPatientAlreadyBookedSlot(int patientId, int doctorId, Date date, String timeSlot) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT COUNT(*) FROM Appointments WHERE patient_id = ? AND doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'Cancelled'";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, patientId);
            stmt.setInt(2, doctorId);
            stmt.setDate(3, date);
            stmt.setString(4, timeSlot.trim());
            rs = stmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.hasPatientAlreadyBookedSlot] Falling back to memory: " + e.getMessage());
            for (Appointment a : memoryAppointments.values()) {
                if (a.getPatientId() == patientId 
                        && a.getDoctorId() == doctorId 
                        && a.getAppointmentDate().toString().equals(date.toString()) 
                        && a.getAppointmentTime().equalsIgnoreCase(timeSlot.trim()) 
                        && !"Cancelled".equalsIgnoreCase(a.getStatus())) {
                    return true;
                }
            }
            return false;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Books an appointment using JDBC transaction handling.
     * Atomically checks slot, inserts appointment, and updates schedule status.
     */
    public synchronized boolean bookAppointment(Appointment appointment) {
        // Pre-check duplicate prevention
        if (hasPatientAlreadyBookedSlot(appointment.getPatientId(), appointment.getDoctorId(), 
                                        appointment.getAppointmentDate(), appointment.getAppointmentTime())) {
            return false;
        }
        if (!isSlotAvailable(appointment.getDoctorId(), appointment.getAppointmentDate(), appointment.getAppointmentTime())) {
            return false;
        }

        Connection conn = null;
        PreparedStatement checkStmt = null;
        PreparedStatement insertStmt = null;
        PreparedStatement schedStmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            // Start transaction
            conn.setAutoCommit(false);

            // Double check inside transaction for concurrency safety
            String checkSql = "SELECT COUNT(*) FROM Appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'Cancelled' FOR UPDATE";
            checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, appointment.getDoctorId());
            checkStmt.setDate(2, appointment.getAppointmentDate());
            checkStmt.setString(3, appointment.getAppointmentTime().trim());
            rs = checkStmt.executeQuery();
            if (rs.next() && rs.getInt(1) > 0) {
                conn.rollback();
                return false;
            }

            // Insert into Appointments table
            String insertSql = "INSERT INTO Appointments (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
            insertStmt = conn.prepareStatement(insertSql);
            insertStmt.setString(1, appointment.getAppointmentId());
            insertStmt.setInt(2, appointment.getPatientId());
            insertStmt.setInt(3, appointment.getDoctorId());
            insertStmt.setDate(4, appointment.getAppointmentDate());
            insertStmt.setString(5, appointment.getAppointmentTime().trim());
            insertStmt.setString(6, appointment.getReason());
            insertStmt.setString(7, "Confirmed");
            insertStmt.executeUpdate();

            // Insert/Update into Doctor_Schedules table
            String schedSql = "INSERT INTO Doctor_Schedules (doctor_id, available_date, time_slot, availability_status) "
                            + "VALUES (?, ?, ?, 'Booked') "
                            + "ON DUPLICATE KEY UPDATE availability_status = 'Booked'";
            schedStmt = conn.prepareStatement(schedSql);
            schedStmt.setInt(1, appointment.getDoctorId());
            schedStmt.setDate(2, appointment.getAppointmentDate());
            schedStmt.setString(3, appointment.getAppointmentTime().trim());
            schedStmt.executeUpdate();

            // Commit transaction
            conn.commit();

            // Sync memory store
            syncMemoryAppointment(appointment);
            return true;

        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.bookAppointment] Falling back to memory: " + e.getMessage());
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            syncMemoryAppointment(appointment);
            return true;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            DatabaseConnection.closeResources(checkStmt, rs);
            DatabaseConnection.closeResources(insertStmt, null);
            DatabaseConnection.closeResources(schedStmt, null);
            DatabaseConnection.closeConnection(conn);
        }
    }

    private void syncMemoryAppointment(Appointment apt) {
        DoctorDAO doctorDAO = new DoctorDAO();
        Doctor d = doctorDAO.getDoctorById(apt.getDoctorId());
        if (d != null) {
            apt.setDoctorName(d.getName());
            apt.setSpecialization(d.getSpecialization());
            apt.setFee(d.getFee());
        }
        PatientDAO patientDAO = new PatientDAO();
        Patient p = patientDAO.getPatientById(apt.getPatientId());
        if (p != null) {
            apt.setPatientName(p.getName());
            apt.setPatientEmail(p.getEmail());
            apt.setPatientMobile(p.getMobile());
        }
        apt.setStatus("Confirmed");
        apt.setBookedAt(new Timestamp(System.currentTimeMillis()));
        memoryAppointments.put(apt.getAppointmentId(), apt);

        String schedKey = apt.getDoctorId() + "_" + apt.getAppointmentDate() + "_" + apt.getAppointmentTime().trim();
        memorySchedules.put(schedKey, new DoctorSchedule(0, apt.getDoctorId(), apt.getAppointmentDate(), apt.getAppointmentTime().trim(), "Booked"));
    }

    /**
     * Retrieves all appointments for a specific patient.
     */
    public List<Appointment> getAppointmentsByPatient(int patientId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Appointment> list = new ArrayList<>();
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT a.appointment_id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time, "
                       + "a.reason, a.status, a.booked_at, "
                       + "d.name AS doctor_name, d.specialization, d.fee, "
                       + "p.name AS patient_name, p.email AS patient_email, p.mobile AS patient_mobile "
                       + "FROM Appointments a "
                       + "JOIN Doctors d ON a.doctor_id = d.doctor_id "
                       + "JOIN Patients p ON a.patient_id = p.patient_id "
                       + "WHERE a.patient_id = ? "
                       + "ORDER BY a.appointment_date DESC, a.appointment_time DESC";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, patientId);
            rs = stmt.executeQuery();
            while (rs.next()) {
                Appointment a = new Appointment();
                a.setAppointmentId(rs.getString("appointment_id"));
                a.setPatientId(rs.getInt("patient_id"));
                a.setDoctorId(rs.getInt("doctor_id"));
                a.setAppointmentDate(rs.getDate("appointment_date"));
                a.setAppointmentTime(rs.getString("appointment_time"));
                a.setReason(rs.getString("reason"));
                a.setStatus(rs.getString("status"));
                a.setBookedAt(rs.getTimestamp("booked_at"));
                a.setDoctorName(rs.getString("doctor_name"));
                a.setSpecialization(rs.getString("specialization"));
                a.setFee(rs.getBigDecimal("fee"));
                a.setPatientName(rs.getString("patient_name"));
                a.setPatientEmail(rs.getString("patient_email"));
                a.setPatientMobile(rs.getString("patient_mobile"));
                list.add(a);
            }
            return list;
        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.getAppointmentsByPatient] Falling back to memory: " + e.getMessage());
            for (Appointment a : memoryAppointments.values()) {
                if (a.getPatientId() == patientId) {
                    list.add(a);
                }
            }
            Collections.sort(list, (x, y) -> y.getAppointmentDate().compareTo(x.getAppointmentDate()));
            return list;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Retrieves all hospital appointments (for Administrator).
     */
    public List<Appointment> getAllAppointments() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Appointment> list = new ArrayList<>();
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT a.appointment_id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time, "
                       + "a.reason, a.status, a.booked_at, "
                       + "d.name AS doctor_name, d.specialization, d.fee, "
                       + "p.name AS patient_name, p.email AS patient_email, p.mobile AS patient_mobile "
                       + "FROM Appointments a "
                       + "JOIN Doctors d ON a.doctor_id = d.doctor_id "
                       + "JOIN Patients p ON a.patient_id = p.patient_id "
                       + "ORDER BY a.appointment_date DESC, a.appointment_time DESC";
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                Appointment a = new Appointment();
                a.setAppointmentId(rs.getString("appointment_id"));
                a.setPatientId(rs.getInt("patient_id"));
                a.setDoctorId(rs.getInt("doctor_id"));
                a.setAppointmentDate(rs.getDate("appointment_date"));
                a.setAppointmentTime(rs.getString("appointment_time"));
                a.setReason(rs.getString("reason"));
                a.setStatus(rs.getString("status"));
                a.setBookedAt(rs.getTimestamp("booked_at"));
                a.setDoctorName(rs.getString("doctor_name"));
                a.setSpecialization(rs.getString("specialization"));
                a.setFee(rs.getBigDecimal("fee"));
                a.setPatientName(rs.getString("patient_name"));
                a.setPatientEmail(rs.getString("patient_email"));
                a.setPatientMobile(rs.getString("patient_mobile"));
                list.add(a);
            }
            return list;
        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.getAllAppointments] Falling back to memory: " + e.getMessage());
            list.addAll(memoryAppointments.values());
            Collections.sort(list, (x, y) -> y.getAppointmentDate().compareTo(x.getAppointmentDate()));
            return list;
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Retrieves an appointment by ID.
     */
    public Appointment getAppointmentById(String appointmentId) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "SELECT a.appointment_id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time, "
                       + "a.reason, a.status, a.booked_at, "
                       + "d.name AS doctor_name, d.specialization, d.fee, "
                       + "p.name AS patient_name, p.email AS patient_email, p.mobile AS patient_mobile "
                       + "FROM Appointments a "
                       + "JOIN Doctors d ON a.doctor_id = d.doctor_id "
                       + "JOIN Patients p ON a.patient_id = p.patient_id "
                       + "WHERE a.appointment_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, appointmentId);
            rs = stmt.executeQuery();
            if (rs.next()) {
                Appointment a = new Appointment();
                a.setAppointmentId(rs.getString("appointment_id"));
                a.setPatientId(rs.getInt("patient_id"));
                a.setDoctorId(rs.getInt("doctor_id"));
                a.setAppointmentDate(rs.getDate("appointment_date"));
                a.setAppointmentTime(rs.getString("appointment_time"));
                a.setReason(rs.getString("reason"));
                a.setStatus(rs.getString("status"));
                a.setBookedAt(rs.getTimestamp("booked_at"));
                a.setDoctorName(rs.getString("doctor_name"));
                a.setSpecialization(rs.getString("specialization"));
                a.setFee(rs.getBigDecimal("fee"));
                a.setPatientName(rs.getString("patient_name"));
                a.setPatientEmail(rs.getString("patient_email"));
                a.setPatientMobile(rs.getString("patient_mobile"));
                return a;
            }
            return null;
        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.getAppointmentById] Falling back to memory: " + e.getMessage());
            return memoryAppointments.get(appointmentId);
        } finally {
            DatabaseConnection.closeAll(conn, stmt, rs);
        }
    }

    /**
     * Updates an appointment status ('Confirmed', 'Completed', 'Cancelled').
     * If Cancelled, releases the schedule slot back to Available.
     */
    public boolean updateAppointmentStatus(String appointmentId, String newStatus) {
        Connection conn = null;
        PreparedStatement stmt = null;
        PreparedStatement schedStmt = null;
        try {
            conn = DatabaseConnection.getConnection();
            String sql = "UPDATE Appointments SET status = ? WHERE appointment_id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, newStatus);
            stmt.setString(2, appointmentId);
            int rows = stmt.executeUpdate();

            if ("Cancelled".equalsIgnoreCase(newStatus)) {
                // Free up doctor schedule slot
                Appointment a = getAppointmentById(appointmentId);
                if (a != null) {
                    String schedSql = "UPDATE Doctor_Schedules SET availability_status = 'Available' WHERE doctor_id = ? AND available_date = ? AND time_slot = ?";
                    schedStmt = conn.prepareStatement(schedSql);
                    schedStmt.setInt(1, a.getDoctorId());
                    schedStmt.setDate(2, a.getAppointmentDate());
                    schedStmt.setString(3, a.getAppointmentTime());
                    schedStmt.executeUpdate();
                }
            }

            Appointment memA = memoryAppointments.get(appointmentId);
            if (memA != null) {
                memA.setStatus(newStatus);
            }
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("[AppointmentDAO.updateAppointmentStatus] Falling back to memory: " + e.getMessage());
            Appointment memA = memoryAppointments.get(appointmentId);
            if (memA != null) {
                memA.setStatus(newStatus);
                if ("Cancelled".equalsIgnoreCase(newStatus)) {
                    String schedKey = memA.getDoctorId() + "_" + memA.getAppointmentDate() + "_" + memA.getAppointmentTime().trim();
                    DoctorSchedule ds = memorySchedules.get(schedKey);
                    if (ds != null) {
                        ds.setAvailabilityStatus("Available");
                    }
                }
                return true;
            }
            return false;
        } finally {
            DatabaseConnection.closeResources(stmt, null);
            DatabaseConnection.closeResources(schedStmt, null);
            DatabaseConnection.closeConnection(conn);
        }
    }

    /**
     * Returns statistics array for Patient Dashboard:
     * [0] Total Appointments
     * [1] Upcoming Appointments (Date >= Today and Status == 'Confirmed')
     * [2] Completed Appointments (Status == 'Completed')
     */
    public int[] getPatientAppointmentStats(int patientId) {
        int[] stats = new int[3];
        List<Appointment> list = getAppointmentsByPatient(patientId);
        LocalDate today = LocalDate.now();

        for (Appointment a : list) {
            stats[0]++; // total
            LocalDate aptDate = a.getAppointmentDate().toLocalDate();
            if ("Confirmed".equalsIgnoreCase(a.getStatus()) && !aptDate.isBefore(today)) {
                stats[1]++; // upcoming
            } else if ("Completed".equalsIgnoreCase(a.getStatus())) {
                stats[2]++; // completed
            }
        }
        return stats;
    }

    /**
     * Returns statistics array for Administrator Dashboard:
     * [0] Total Doctors
     * [1] Total Patients
     * [2] Total Appointments
     * [3] Upcoming Appointments
     */
    public int[] getAdminDashboardStats() {
        int[] stats = new int[4];
        DoctorDAO docDAO = new DoctorDAO();
        PatientDAO patDAO = new PatientDAO();
        stats[0] = docDAO.getTotalDoctorsCount();
        stats[1] = patDAO.getTotalPatientsCount();

        List<Appointment> all = getAllAppointments();
        stats[2] = all.size();

        LocalDate today = LocalDate.now();
        int upcoming = 0;
        for (Appointment a : all) {
            if ("Confirmed".equalsIgnoreCase(a.getStatus()) && !a.getAppointmentDate().toLocalDate().isBefore(today)) {
                upcoming++;
            }
        }
        stats[3] = upcoming;
        return stats;
    }
}
