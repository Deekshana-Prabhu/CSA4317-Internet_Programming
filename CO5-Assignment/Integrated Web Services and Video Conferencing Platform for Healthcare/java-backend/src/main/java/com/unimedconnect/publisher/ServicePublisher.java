package com.unimedconnect.publisher;

import com.unimedconnect.classroom.ClassroomServiceImpl;
import com.unimedconnect.healthcare.HealthcareServiceImpl;
import com.unimedconnect.student.StudentServiceImpl;
import com.unimedconnect.video.VideoSessionServiceImpl;
import jakarta.xml.ws.Endpoint;

/**
 * ServicePublisher publishes all UniMed Connect SOAP Web Services.
 * Runs standalone using built-in JAX-WS HTTP server on port 8081.
 */
public class ServicePublisher {

    public static final String STUDENT_URL = "http://localhost:8081/ws/student";
    public static final String HEALTHCARE_URL = "http://localhost:8081/ws/healthcare";
    public static final String CLASSROOM_URL = "http://localhost:8081/ws/classroom";
    public static final String VIDEO_URL = "http://localhost:8081/ws/video";

    public static void main(String[] args) {
        System.out.println("===============================================================");
        System.out.println(" UniMed Connect - JAX-WS SOAP Web Services Publisher");
        System.out.println("===============================================================");
        System.out.println("Initializing endpoints on http://localhost:8081 ...\n");

        try {
            // 1. Publish Student Information Service
            Endpoint epStudent = Endpoint.publish(STUDENT_URL, new StudentServiceImpl());
            System.out.println("[READY] Student Service published:");
            System.out.println("        Service URL: " + STUDENT_URL);
            System.out.println("        WSDL URL:    " + STUDENT_URL + "?wsdl\n");

            // 2. Publish Healthcare Service
            Endpoint epHealthcare = Endpoint.publish(HEALTHCARE_URL, new HealthcareServiceImpl());
            System.out.println("[READY] Healthcare Service published:");
            System.out.println("        Service URL: " + HEALTHCARE_URL);
            System.out.println("        WSDL URL:    " + HEALTHCARE_URL + "?wsdl\n");

            // 3. Publish Classroom Service
            Endpoint epClassroom = Endpoint.publish(CLASSROOM_URL, new ClassroomServiceImpl());
            System.out.println("[READY] Classroom Service published:");
            System.out.println("        Service URL: " + CLASSROOM_URL);
            System.out.println("        WSDL URL:    " + CLASSROOM_URL + "?wsdl\n");

            // 4. Publish Video Session Service
            Endpoint epVideo = Endpoint.publish(VIDEO_URL, new VideoSessionServiceImpl());
            System.out.println("[READY] Video Session Service published:");
            System.out.println("        Service URL: " + VIDEO_URL);
            System.out.println("        WSDL URL:    " + VIDEO_URL + "?wsdl\n");

            System.out.println("===============================================================");
            System.out.println("All 4 SOAP Services are published and listening for requests.");
            System.out.println("You can test them using SoapUI, curl, or the UniMed Web UI.");
            System.out.println("Press Ctrl+C to terminate the publisher.");
            System.out.println("===============================================================");

        } catch (Exception e) {
            System.err.println("[ERROR] Failed to publish services: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
