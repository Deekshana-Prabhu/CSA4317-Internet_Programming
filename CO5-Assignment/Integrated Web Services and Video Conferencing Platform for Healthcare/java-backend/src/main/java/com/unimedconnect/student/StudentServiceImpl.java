package com.unimedconnect.student;

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

@WebService(
    endpointInterface = "com.unimedconnect.student.StudentService",
    serviceName = "StudentService",
    portName = "StudentServicePort",
    targetNamespace = "http://unimedconnect.com/student"
)
public class StudentServiceImpl implements StudentService {

    @Override
    public Student getStudentById(String studentId) throws Exception {
        if (studentId == null || studentId.trim().isEmpty()) {
            throw createSoapFault("Client", "studentId cannot be null or empty.");
        }

        String sql = "SELECT student_id, name, department, year_of_study, email, attendance_rate, cgpa, enrolled_courses_count FROM students WHERE student_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, studentId.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Student(
                        rs.getString("student_id"),
                        rs.getString("name"),
                        rs.getString("department"),
                        rs.getInt("year_of_study"),
                        rs.getString("email"),
                        rs.getDouble("attendance_rate"),
                        rs.getDouble("cgpa"),
                        rs.getInt("enrolled_courses_count")
                    );
                } else {
                    throw createSoapFault("Client", "Student with ID '" + studentId + "' not found.");
                }
            }
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    @Override
    public List<Student> getAllStudents() {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT student_id, name, department, year_of_study, email, attendance_rate, cgpa, enrolled_courses_count FROM students";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Student(
                    rs.getString("student_id"),
                    rs.getString("name"),
                    rs.getString("department"),
                    rs.getInt("year_of_study"),
                    rs.getString("email"),
                    rs.getDouble("attendance_rate"),
                    rs.getDouble("cgpa"),
                    rs.getInt("enrolled_courses_count")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[StudentService] getAllStudents error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public List<AttendanceRecord> getAttendance(String studentId) {
        List<AttendanceRecord> list = new ArrayList<>();
        String sql = "SELECT student_id, course_code, date, status FROM attendance WHERE student_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new AttendanceRecord(
                        rs.getString("student_id"),
                        rs.getString("course_code"),
                        rs.getString("date"),
                        rs.getString("status")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudentService] getAttendance error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public List<AcademicResult> getResults(String studentId) {
        List<AcademicResult> list = new ArrayList<>();
        String sql = "SELECT student_id, course_code, semester, grade, marks_obtained FROM results WHERE student_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new AcademicResult(
                        rs.getString("student_id"),
                        rs.getString("course_code"),
                        rs.getString("semester"),
                        rs.getString("grade"),
                        rs.getDouble("marks_obtained")
                    ));
                }
            }
        } catch (SQLException e) {
            System.err.println("[StudentService] getResults error: " + e.getMessage());
        }
        return list;
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
