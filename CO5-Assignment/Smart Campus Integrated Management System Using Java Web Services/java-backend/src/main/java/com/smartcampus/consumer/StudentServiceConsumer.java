package com.smartcampus.consumer;

import java.net.URI;
import java.net.URL;
import java.util.List;
import javax.xml.namespace.QName;
import jakarta.xml.ws.Service;

import com.smartcampus.model.Student;
import com.smartcampus.service.StudentInformationService;
import com.smartcampus.exception.StudentNotFoundException;

/**
 * Java Web Service Consumer representing a Departmental Client
 * (e.g., Attendance Management, Library, or Fee Application).
 * 
 * Demonstrates:
 * 1. Discovering and binding to the WSDL endpoint.
 * 2. Creating a dynamic JAX-WS service proxy.
 * 3. Consuming getStudentById() to verify student enrollment.
 * 4. Handling SOAP Faults gracefully.
 */
public class StudentServiceConsumer {

    private static final String WSDL_LOCATION = "http://localhost:8888/ws/student?wsdl";
    private static final String TARGET_NAMESPACE = "http://service.smartcampus.com/";
    private static final String SERVICE_NAME = "StudentInformationService";

    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("   SMART CAMPUS - JAVA WEB SERVICE CONSUMER CLIENT");
        System.out.println("   Simulating Attendance & Fee Department Integration");
        System.out.println("==================================================================");

        try {
            System.out.println("[CONSUMER] 1. Connecting to Service WSDL at: " + WSDL_LOCATION);
            URL wsdlUrl = URI.create(WSDL_LOCATION).toURL();
            QName serviceQName = new QName(TARGET_NAMESPACE, SERVICE_NAME);

            System.out.println("[CONSUMER] 2. Creating JAX-WS Service instance from WSDL...");
            Service service = Service.create(wsdlUrl, serviceQName);

            System.out.println("[CONSUMER] 3. Obtaining Service Endpoint Interface (SEI) proxy...");
            StudentInformationService studentService = service.getPort(StudentInformationService.class);

            System.out.println("[CONSUMER] 4. Successfully bound to StudentInformationService Port!");
            System.out.println("------------------------------------------------------------------");

            // Scenario A: Valid Student Lookup (Attendance Application scenario)
            String targetStudentId = "STU-1001";
            System.out.println("\n--- SCENARIO A: Fetching Student Details for Attendance Logger ---");
            System.out.println("[REQUEST] Invoking getStudentById('" + targetStudentId + "')...");
            
            Student student = studentService.getStudentById(targetStudentId);
            System.out.println("[RESPONSE] Received Student Details:");
            System.out.println("  • ID:          " + student.getStudentId());
            System.out.println("  • Name:        " + student.getStudentName());
            System.out.println("  • Department:  " + student.getDepartment());
            System.out.println("  • Year:        " + student.getYear());
            System.out.println("  • Email:       " + student.getEmail());
            System.out.println("  • Status:      " + student.getAdmissionStatus());
            System.out.println("  • CGPA:        " + student.getCgpa());
            System.out.println(">> Attendance Department: Student verified! Class attendance marked: 89.2%");

            // Scenario B: Querying All Students (Academic Office scenario)
            System.out.println("\n--- SCENARIO B: Querying All Enrolled Students ---");
            List<Student> allStudents = studentService.getAllStudents();
            System.out.println("[RESPONSE] Total Enrolled Students Retrieved via SOAP: " + allStudents.size());
            for (Student s : allStudents) {
                System.out.printf("  [%s] %-18s | %-24s | %s\n", 
                    s.getStudentId(), s.getStudentName(), s.getDepartment(), s.getYear());
            }

            // Scenario C: Fault Handling with Non-Existent Student ID
            String invalidStudentId = "STU-9999";
            System.out.println("\n--- SCENARIO C: Error Handling with Non-Existent ID (" + invalidStudentId + ") ---");
            try {
                System.out.println("[REQUEST] Invoking getStudentById('" + invalidStudentId + "')...");
                studentService.getStudentById(invalidStudentId);
            } catch (StudentNotFoundException fault) {
                System.err.println("[SOAP FAULT CAUGHT] Service returned expected SOAP Fault:");
                System.err.println("  • Fault Message: " + fault.getMessage());
                System.err.println("  • Fault Details: " + fault.getFaultInfo());
                System.out.println(">> Consumer Application handled fault cleanly without crashing!");
            }

            System.out.println("\n==================================================================");
            System.out.println("[SUCCESS] Departmental Service Consumer demonstration complete!");
            System.out.println("==================================================================");

        } catch (Exception e) {
            System.err.println("[CONSUMER ERROR] Could not connect to Web Service: " + e.getMessage());
            System.err.println("Ensure StudentServicePublisher is running before executing consumer.");
        }
    }
}
