package com.unimedconnect.classroom;

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
import java.util.Arrays;
import java.util.List;

@WebService(
    endpointInterface = "com.unimedconnect.classroom.ClassroomService",
    serviceName = "ClassroomService",
    portName = "ClassroomServicePort",
    targetNamespace = "http://unimedconnect.com/classroom"
)
public class ClassroomServiceImpl implements ClassroomService {

    @Override
    public Course getCourseDetails(String courseCode) throws Exception {
        if (courseCode == null || courseCode.trim().isEmpty()) {
            throw createSoapFault("Client", "courseCode cannot be null or empty.");
        }

        String sql = "SELECT course_code, course_name, department, credits, instructor_name, schedule FROM courses WHERE course_code = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, courseCode.trim().toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Course(
                        rs.getString("course_code"),
                        rs.getString("course_name"),
                        rs.getString("department"),
                        rs.getInt("credits"),
                        rs.getString("instructor_name"),
                        rs.getString("schedule")
                    );
                } else {
                    throw createSoapFault("Client", "Course with code '" + courseCode + "' not found.");
                }
            }
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    @Override
    public List<ClassSession> getClassSchedule(String courseCode) {
        List<ClassSession> list = new ArrayList<>();
        // Seeded schedule logic
        list.add(new ClassSession("SES-405-1", courseCode != null ? courseCode : "CS405", "Distributed Architecture & SOAP Handlers", "10:00 AM - 11:30 AM", "LIVE_TODAY"));
        list.add(new ClassSession("SES-405-2", courseCode != null ? courseCode : "CS405", "WSDL Specification & XML Schemas", "02:00 PM - 03:30 PM", "SCHEDULED"));
        list.add(new ClassSession("SES-405-3", courseCode != null ? courseCode : "CS405", "WebRTC Video Conferencing Protocol", "11:00 AM - 12:30 PM", "UPCOMING"));
        return list;
    }

    @Override
    public List<String> getEnrolledStudents(String courseCode) {
        return Arrays.asList("STU1001", "STU1002", "STU1003", "STU1005");
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
