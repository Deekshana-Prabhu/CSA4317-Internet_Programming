package com.mediconnect.service;

import com.mediconnect.model.Appointment;
import com.mediconnect.model.HealthcareFault;
import com.mediconnect.model.LaboratoryReport;
import com.mediconnect.model.Patient;
import com.mediconnect.util.DatabaseConnection;
import jakarta.jws.WebService;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Service Implementation Bean (SIB): HealthcareInformationServiceImpl
 * Executes SQL queries over JDBC PreparedStatement against MySQL medic_connect_db
 * and maps relational database tuples into JAX-WS annotated models for SOAP responses.
 */
@WebService(
    endpointInterface = "com.mediconnect.service.HealthcareInformationService",
    portName = "HealthcareInformationServicePort",
    serviceName = "HealthcareInformationService",
    targetNamespace = "http://service.mediconnect.com/"
)
public class HealthcareInformationServiceImpl implements HealthcareInformationService {

    private static final Logger LOGGER = Logger.getLogger(HealthcareInformationServiceImpl.class.getName());

    // Parameterized SQL Statements using PreparedStatements for SQL injection prevention
    private static final String SQL_GET_PATIENT_BY_ID = 
        "SELECT p.patient_id, p.patient_name, p.age, p.gender, p.blood_group, " +
        "       p.mobile, p.email, p.address, COALESCE(d.doctor_name, 'Unassigned') AS doctor_name, p.department " +
        "FROM patients p " +
        "LEFT JOIN doctors d ON p.doctor_id = d.doctor_id " +
        "WHERE p.patient_id = ?";

    private static final String SQL_GET_LAB_REPORTS_BY_PATIENT = 
        "SELECT report_id, patient_id, test_name, test_date, laboratory_name, " +
        "       test_result, reference_range, report_status " +
        "FROM laboratory_reports " +
        "WHERE patient_id = ? " +
        "ORDER BY test_date DESC";

    private static final String SQL_GET_APPOINTMENTS_BY_PATIENT = 
        "SELECT a.appointment_id, a.patient_id, d.doctor_name, a.appointment_date, " +
        "       a.appointment_time, a.appointment_status, a.notes " +
        "FROM appointments a " +
        "JOIN doctors d ON a.doctor_id = d.doctor_id " +
        "WHERE a.patient_id = ? " +
        "ORDER BY a.appointment_date DESC";

    private static final String SQL_GET_ALL_PATIENTS = 
        "SELECT p.patient_id, p.patient_name, p.age, p.gender, p.blood_group, " +
        "       p.mobile, p.email, p.address, COALESCE(d.doctor_name, 'Unassigned') AS doctor_name, p.department " +
        "FROM patients p " +
        "LEFT JOIN doctors d ON p.doctor_id = d.doctor_id " +
        "ORDER BY p.patient_id ASC";

    /**
     * Operation 1: getPatientById(String patientId)
     */
    @Override
    public Patient getPatientById(String patientId) throws HealthcareServiceException {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new HealthcareServiceException(
                "Invalid Argument: Patient ID cannot be null or empty.",
                new HealthcareFault("ERR-INVALID-ID", "Patient ID is mandatory.", "Provide an ID such as PAT-1001")
            );
        }

        LOGGER.info("Executing SOAP operation getPatientById for ID: " + patientId);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(SQL_GET_PATIENT_BY_ID)) {

            stmt.setString(1, patientId.trim());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToPatient(rs);
                } else {
                    LOGGER.warning("Patient not found in database for ID: " + patientId);
                    throw new HealthcareServiceException(
                        "Patient Not Found: No healthcare record exists for ID " + patientId,
                        new HealthcareFault("ERR-RECORD-NOT-FOUND", 
                                            "Patient with ID '" + patientId + "' does not exist in medic_connect_db.", 
                                            "Verify patient identification number in registry.")
                    );
                }
            }
        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "JDBC Error during getPatientById query execution", ex);
            throw new HealthcareServiceException(
                "Database Error: Unable to query patient records.",
                new HealthcareFault("ERR-DB-FAILURE", "MySQL JDBC Error: " + ex.getMessage(), "Check database connectivity.")
            );
        }
    }

    /**
     * Operation 2: getLaboratoryReports(String patientId)
     */
    @Override
    public List<LaboratoryReport> getLaboratoryReports(String patientId) throws HealthcareServiceException {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new HealthcareServiceException(
                "Invalid Argument: Patient ID cannot be null or empty.",
                new HealthcareFault("ERR-INVALID-ID", "Patient ID is mandatory for lab reports.", "Provide a valid patient ID.")
            );
        }

        LOGGER.info("Executing SOAP operation getLaboratoryReports for ID: " + patientId);
        List<LaboratoryReport> reports = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(SQL_GET_LAB_REPORTS_BY_PATIENT)) {

            stmt.setString(1, patientId.trim());

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    LaboratoryReport report = new LaboratoryReport(
                        rs.getString("report_id"),
                        rs.getString("patient_id"),
                        rs.getString("test_name"),
                        rs.getString("test_date"),
                        rs.getString("laboratory_name"),
                        rs.getString("test_result"),
                        rs.getString("reference_range"),
                        rs.getString("report_status")
                    );
                    reports.add(report);
                }
            }

            LOGGER.info("Retrieved " + reports.size() + " laboratory reports for patient " + patientId);
            return reports;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "JDBC Error in getLaboratoryReports", ex);
            throw new HealthcareServiceException(
                "Database Error: Failed to retrieve diagnostic reports.",
                new HealthcareFault("ERR-DB-FAILURE", "MySQL JDBC Error: " + ex.getMessage(), "Check database connectivity.")
            );
        }
    }

    /**
     * Operation 3: getAppointments(String patientId)
     */
    @Override
    public List<Appointment> getAppointments(String patientId) throws HealthcareServiceException {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new HealthcareServiceException(
                "Invalid Argument: Patient ID cannot be null or empty.",
                new HealthcareFault("ERR-INVALID-ID", "Patient ID is mandatory for appointments.", "Provide a valid patient ID.")
            );
        }

        LOGGER.info("Executing SOAP operation getAppointments for ID: " + patientId);
        List<Appointment> appointments = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(SQL_GET_APPOINTMENTS_BY_PATIENT)) {

            stmt.setString(1, patientId.trim());

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Appointment appt = new Appointment(
                        rs.getString("appointment_id"),
                        rs.getString("patient_id"),
                        rs.getString("doctor_name"),
                        rs.getString("appointment_date"),
                        rs.getString("appointment_time"),
                        rs.getString("appointment_status"),
                        rs.getString("notes")
                    );
                    appointments.add(appt);
                }
            }

            LOGGER.info("Retrieved " + appointments.size() + " appointments for patient " + patientId);
            return appointments;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "JDBC Error in getAppointments", ex);
            throw new HealthcareServiceException(
                "Database Error: Failed to retrieve patient appointments.",
                new HealthcareFault("ERR-DB-FAILURE", "MySQL JDBC Error: " + ex.getMessage(), "Check database connectivity.")
            );
        }
    }

    /**
     * Operation 4: getAllPatients()
     */
    @Override
    public List<Patient> getAllPatients() throws HealthcareServiceException {
        LOGGER.info("Executing SOAP operation getAllPatients");
        List<Patient> patientList = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(SQL_GET_ALL_PATIENTS);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                patientList.add(mapRowToPatient(rs));
            }

            LOGGER.info("Retrieved " + patientList.size() + " total patients from database.");
            return patientList;

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "JDBC Error in getAllPatients", ex);
            throw new HealthcareServiceException(
                "Database Error: Failed to retrieve patient directory.",
                new HealthcareFault("ERR-DB-FAILURE", "MySQL JDBC Error: " + ex.getMessage(), "Check database connectivity.")
            );
        }
    }

    /**
     * Helper method to map a ResultSet row to a Patient domain model.
     */
    private Patient mapRowToPatient(ResultSet rs) throws SQLException {
        return new Patient(
            rs.getString("patient_id"),
            rs.getString("patient_name"),
            rs.getInt("age"),
            rs.getString("gender"),
            rs.getString("blood_group"),
            rs.getString("mobile"),
            rs.getString("email"),
            rs.getString("address"),
            rs.getString("doctor_name"),
            rs.getString("department")
        );
    }
}
