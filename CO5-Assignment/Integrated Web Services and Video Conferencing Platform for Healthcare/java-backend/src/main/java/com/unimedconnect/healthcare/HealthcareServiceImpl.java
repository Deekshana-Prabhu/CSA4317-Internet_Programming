package com.unimedconnect.healthcare;

import com.unimedconnect.database.DatabaseManager;
import jakarta.jws.WebService;
import jakarta.xml.ws.soap.SOAPFaultException;
import jakarta.xml.soap.SOAPFactory;
import jakarta.xml.soap.SOAPFault;
import javax.xml.namespace.QName;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@WebService(
    endpointInterface = "com.unimedconnect.healthcare.HealthcareService",
    serviceName = "HealthcareService",
    portName = "HealthcareServicePort",
    targetNamespace = "http://unimedconnect.com/healthcare"
)
public class HealthcareServiceImpl implements HealthcareService {

    @Override
    public Patient getPatientById(String patientId) throws Exception {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw createSoapFault("Client", "patientId cannot be null or empty.");
        }

        String sql = "SELECT patient_id, name, age, gender, department, assigned_doctor_id, contact_phone, medical_condition, consultation_status, last_visit_date FROM patients WHERE patient_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, patientId.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Patient(
                        rs.getString("patient_id"),
                        rs.getString("name"),
                        rs.getInt("age"),
                        rs.getString("gender"),
                        rs.getString("department"),
                        rs.getString("assigned_doctor_id"),
                        rs.getString("contact_phone"),
                        rs.getString("medical_condition"),
                        rs.getString("consultation_status"),
                        rs.getString("last_visit_date")
                    );
                } else {
                    throw createSoapFault("Client", "Patient with ID '" + patientId + "' not found.");
                }
            }
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    @Override
    public Doctor getDoctorDetails(String doctorId) throws Exception {
        if (doctorId == null || doctorId.trim().isEmpty()) {
            throw createSoapFault("Client", "doctorId cannot be null or empty.");
        }

        String sql = "SELECT doctor_id, name, specialization, department, email, consultation_fee, availability_status, rating FROM doctors WHERE doctor_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, doctorId.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Doctor(
                        rs.getString("doctor_id"),
                        rs.getString("name"),
                        rs.getString("specialization"),
                        rs.getString("department"),
                        rs.getString("email"),
                        rs.getDouble("consultation_fee"),
                        rs.getString("availability_status"),
                        rs.getDouble("rating")
                    );
                } else {
                    throw createSoapFault("Client", "Doctor with ID '" + doctorId + "' not found.");
                }
            }
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    @Override
    public List<Appointment> getAppointments(String patientId) {
        List<Appointment> list = new ArrayList<>();
        String sql = "SELECT appointment_id, patient_id, doctor_id, appointment_date, time_slot, reason_for_visit, status FROM appointments WHERE patient_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, patientId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new Appointment(
                        rs.getString("appointment_id"),
                        rs.getString("patient_id"),
                        rs.getString("doctor_id"),
                        rs.getString("appointment_date"),
                        rs.getString("time_slot"),
                        rs.getString("reason_for_visit"),
                        rs.getString("status")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[HealthcareService] getAppointments error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public Appointment bookAppointment(String patientId, String doctorId, String appointmentDate, String timeSlot, String reason) throws Exception {
        if (patientId == null || doctorId == null || appointmentDate == null || timeSlot == null) {
            throw createSoapFault("Client", "Required booking parameters missing.");
        }

        String appointmentId = "APT-" + System.currentTimeMillis() % 100000;
        String sql = "INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, time_slot, reason_for_visit, status) VALUES (?, ?, ?, ?, ?, ?, 'SCHEDULED')";

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, appointmentId);
            ps.setString(2, patientId);
            ps.setString(3, doctorId);
            ps.setString(4, appointmentDate);
            ps.setString(5, timeSlot);
            ps.setString(6, reason != null ? reason : "Consultation");
            ps.executeUpdate();

            return new Appointment(appointmentId, patientId, doctorId, appointmentDate, timeSlot, reason, "SCHEDULED");
        } catch (SQLException e) {
            throw createSoapFault("Server", "Failed to insert appointment: " + e.getMessage());
        }
    }

    private SOAPFaultException createSoapFault(String faultCode, String faultString) {
        try {
            SOAPFactory sf = SOAPFactory.newInstance();
            SOAPFault fault = sf.createFault(faultString, new QName("http://schemas.xmlsoap.org/soap/envelope/", faultCode));
            return new SOAPFaultException(fault);
        } catch (Exception e) {
            throw new RuntimeException(faultString, e);
        }
    }
}
