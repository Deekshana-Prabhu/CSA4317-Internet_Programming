package com.mediconnect.publisher;

import com.mediconnect.service.HealthcareInformationServiceImpl;
import com.mediconnect.util.DatabaseConnection;
import jakarta.xml.ws.Endpoint;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Healthcare SOAP Web Service Publisher
 * Starts the lightweight embedded HTTP server and publishes the JAX-WS SOAP endpoint.
 *
 * Once published, client applications can access:
 * - SOAP Service Endpoint: http://localhost:8080/ws/healthcare
 * - Auto-Generated WSDL:  http://localhost:8080/ws/healthcare?wsdl
 */
public class HealthcareServicePublisher {

    private static final Logger LOGGER = Logger.getLogger(HealthcareServicePublisher.class.getName());

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("   MediConnect – SOAP-Based Java Healthcare Web Service Publisher     ");
        System.out.println("   Connected Care. Smarter Healthcare.                                ");
        System.out.println("======================================================================");

        // 1. Verify Database Connectivity
        System.out.println("[*] Checking MySQL Database connection (medic_connect_db)...");
        boolean dbConnected = DatabaseConnection.testConnection();
        if (dbConnected) {
            System.out.println("[✓] MySQL Database connectivity verified successfully.");
        } else {
            System.out.println("[!] Warning: Could not verify MySQL connection. Please check db.properties / MySQL service.");
            System.out.println("    The service will still publish, but database operations may throw SOAP Faults.");
        }

        // 2. Configure Service Publishing URL
        String host = "http://0.0.0.0";
        String port = "8080";
        String path = "/ws/healthcare";

        try (InputStream in = HealthcareServicePublisher.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in != null) {
                Properties props = new Properties();
                props.load(in);
                host = props.getProperty("soap.service.host", "http://0.0.0.0");
                port = props.getProperty("soap.service.port", "8080");
                path = props.getProperty("soap.service.path", "/ws/healthcare");
            }
        } catch (Exception ignored) {
        }

        String publishUrl = host + ":" + port + path;
        String wsdlUrl = "http://localhost:" + port + path + "?wsdl";

        System.out.println("\n[*] Publishing SOAP Service Endpoint at: " + publishUrl);

        try {
            // 3. Create Service Implementation and Publish Endpoint
            HealthcareInformationServiceImpl serviceImpl = new HealthcareInformationServiceImpl();
            Endpoint endpoint = Endpoint.publish(publishUrl, serviceImpl);

            System.out.println("[✓] SOAP Web Service published and listening successfully!");
            System.out.println("----------------------------------------------------------------------");
            System.out.println("  • Service Endpoint:   http://localhost:" + port + path);
            System.out.println("  • WSDL Contract URL:  " + wsdlUrl);
            System.out.println("  • Binding Style:      SOAP 1.1 Document/Literal");
            System.out.println("  • Published Methods:");
            System.out.println("      1. getPatientById(String patientId)");
            System.out.println("      2. getLaboratoryReports(String patientId)");
            System.out.println("      3. getAppointments(String patientId)");
            System.out.println("      4. getAllPatients()");
            System.out.println("----------------------------------------------------------------------");
            System.out.println("[*] Service is running. Press CTRL+C to terminate the publisher.");

            // Keep the publisher thread alive
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("\n[*] Stopping MediConnect SOAP Web Service...");
                endpoint.stop();
                System.out.println("[✓] Service endpoint stopped cleanly.");
            }));

        } catch (Exception e) {
            System.err.println("[X] Fatal error while publishing SOAP Web Service: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
