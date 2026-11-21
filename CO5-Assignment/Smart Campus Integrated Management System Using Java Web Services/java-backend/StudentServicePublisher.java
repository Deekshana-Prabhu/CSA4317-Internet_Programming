package com.smartcampus.publisher;

import jakarta.xml.ws.Endpoint;
import com.smartcampus.service.StudentInformationServiceImpl;

/**
 * Standalone publisher for the StudentInformationService SOAP Web Service.
 * Uses the lightweight embedded HTTP server provided by JAX-WS / Metro runtime.
 * 
 * Once executed, this class exposes:
 * 1. Service Endpoint: http://localhost:8888/ws/student
 * 2. WSDL Document:   http://localhost:8888/ws/student?wsdl
 */
public class StudentServicePublisher {

    public static final String SERVICE_URL = "http://localhost:8888/ws/student";

    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("   SMART CAMPUS - JAVA SOAP WEB SERVICES PUBLISHER");
        System.out.println("   Integrated Management System (JAX-WS / Jakarta XML WS)");
        System.out.println("==================================================================");
        System.out.println("[INFO] Instantiating StudentInformationServiceImpl...");

        StudentInformationServiceImpl serviceImplementation = new StudentInformationServiceImpl();

        System.out.println("[INFO] Publishing Web Service to endpoint: " + SERVICE_URL);
        Endpoint endpoint = Endpoint.publish(SERVICE_URL, serviceImplementation);

        if (endpoint.isPublished()) {
            System.out.println("[SUCCESS] StudentInformationService is LIVE and ready for requests!");
            System.out.println("------------------------------------------------------------------");
            System.out.println(">> Service Endpoint:  " + SERVICE_URL);
            System.out.println(">> WSDL Definition:   " + SERVICE_URL + "?wsdl");
            System.out.println(">> Registered In:     Smart Campus Central Service Registry");
            System.out.println(">> Supported Operations: getStudentById, getAllStudents, addStudent, getStudentsByDepartment");
            System.out.println("------------------------------------------------------------------");
            System.out.println("[INFO] Connected Department Consumers:");
            System.out.println("       - Admission Application");
            System.out.println("       - Attendance Application");
            System.out.println("       - Examination Application");
            System.out.println("       - Library Management Application");
            System.out.println("       - Fee Management Application");
            System.out.println("------------------------------------------------------------------");
            System.out.println("Press Ctrl+C to terminate the web service publisher.");
        } else {
            System.err.println("[ERROR] Failed to publish StudentInformationService.");
        }

        // Register clean shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n[INFO] Stopping StudentInformationService endpoint...");
            endpoint.stop();
            System.out.println("[INFO] Web Service terminated cleanly.");
        }));
    }
}
