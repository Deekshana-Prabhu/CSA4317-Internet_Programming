package com.mediconnect.consumer;

import com.mediconnect.model.Appointment;
import com.mediconnect.model.LaboratoryReport;
import com.mediconnect.model.Patient;
import com.mediconnect.service.HealthcareInformationService;
import com.mediconnect.service.HealthcareServiceException;
import jakarta.xml.ws.Service;
import java.net.URL;
import java.util.List;
import javax.xml.namespace.QName;

/**
 * Healthcare SOAP Web Service Consumer Client
 * Demonstrates how external healthcare systems (Doctor App, Lab App, Pharmacy Portal)
 * consume the centralized MediConnect web service using standard JAX-WS client proxies.
 */
public class HealthcareServiceConsumer {

    private static final String WSDL_URL_STR = "http://localhost:8080/ws/healthcare?wsdl";
    private static final String TARGET_NAMESPACE = "http://service.mediconnect.com/";
    private static final String SERVICE_NAME = "HealthcareInformationService";
    private static final String PORT_NAME = "HealthcareInformationServicePort";

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("   MediConnect – External Client Application SOAP Consumer Demo       ");
        System.out.println("======================================================================");

        try {
            System.out.println("[1] Connecting to WSDL Endpoint: " + WSDL_URL_STR);
            URL wsdlUrl = new URL(WSDL_URL_STR);

            QName serviceQName = new QName(TARGET_NAMESPACE, SERVICE_NAME);
            QName portQName = new QName(TARGET_NAMESPACE, PORT_NAME);

            // Create client service stub from WSDL
            Service service = Service.create(wsdlUrl, serviceQName);
            HealthcareInformationService client = service.getPort(portQName, HealthcareInformationService.class);

            System.out.println("[✓] Successfully established SOAP client proxy.\n");

            // Test 1: Doctor Application retrieves Patient Record
            System.out.println("----------------------------------------------------------------------");
            System.out.println("  Scenario 1: Doctor Application queries Patient 'PAT-1001'");
            System.out.println("----------------------------------------------------------------------");
            Patient patient = client.getPatientById("PAT-1001");
            System.out.println("  Patient ID:   " + patient.getPatientId());
            System.out.println("  Name:         " + patient.getPatientName());
            System.out.println("  Age/Gender:   " + patient.getAge() + " / " + patient.getGender());
            System.out.println("  Blood Group:  " + patient.getBloodGroup());
            System.out.println("  Department:   " + patient.getDepartment());
            System.out.println("  Physician:    " + patient.getDoctorName());
            System.out.println("  Contact:      " + patient.getMobile() + " | " + patient.getEmail());

            // Test 2: Laboratory Application queries Diagnostic Reports
            System.out.println("\n----------------------------------------------------------------------");
            System.out.println("  Scenario 2: Lab Application checks Diagnostic History for 'PAT-1001'");
            System.out.println("----------------------------------------------------------------------");
            List<LaboratoryReport> reports = client.getLaboratoryReports("PAT-1001");
            System.out.println("  Total Reports Found: " + reports.size());
            for (LaboratoryReport rep : reports) {
                System.out.printf("  [%s] %s | Date: %s | Result: %s | Status: %s\n",
                    rep.getReportId(), rep.getTestName(), rep.getTestDate(), 
                    rep.getTestResult(), rep.getReportStatus());
            }

            // Test 3: Patient Portal queries Upcoming Appointments
            System.out.println("\n----------------------------------------------------------------------");
            System.out.println("  Scenario 3: Patient Portal checks Appointments for 'PAT-1001'");
            System.out.println("----------------------------------------------------------------------");
            List<Appointment> appointments = client.getAppointments("PAT-1001");
            System.out.println("  Total Appointments: " + appointments.size());
            for (Appointment appt : appointments) {
                System.out.printf("  [%s] With %s on %s at %s | Status: %s\n",
                    appt.getAppointmentId(), appt.getDoctorName(), 
                    appt.getAppointmentDate(), appt.getAppointmentTime(), 
                    appt.getAppointmentStatus());
            }

            // Test 4: Hospital Admin queries Directory of All Patients
            System.out.println("\n----------------------------------------------------------------------");
            System.out.println("  Scenario 4: Hospital Directory - Retrieve All Patients");
            System.out.println("----------------------------------------------------------------------");
            List<Patient> allPatients = client.getAllPatients();
            System.out.println("  Total Registered Patients in DB: " + allPatients.size());
            for (Patient p : allPatients) {
                System.out.printf("  - %s: %s (%d yrs, %s) -> Dept: %s, Doctor: %s\n",
                    p.getPatientId(), p.getPatientName(), p.getAge(), p.getGender(), 
                    p.getDepartment(), p.getDoctorName());
            }

            // Test 5: Error Handling & SOAP Fault Verification
            System.out.println("\n----------------------------------------------------------------------");
            System.out.println("  Scenario 5: Testing SOAP Fault Handling with Invalid ID 'PAT-9999'");
            System.out.println("----------------------------------------------------------------------");
            try {
                client.getPatientById("PAT-9999");
            } catch (HealthcareServiceException fault) {
                System.out.println("  [✓] Expected SOAP Fault caught successfully!");
                System.out.println("  Fault String:  " + fault.getMessage());
                if (fault.getFaultInfo() != null) {
                    System.out.println("  Error Code:    " + fault.getFaultInfo().getErrorCode());
                    System.out.println("  Error Details: " + fault.getFaultInfo().getDetails());
                    System.out.println("  Timestamp:     " + fault.getFaultInfo().getTimestamp());
                }
            }

            System.out.println("\n======================================================================");
            System.out.println("   [✓] All 5 SOAP Client Operations Verified Successfully!             ");
            System.out.println("======================================================================");

        } catch (Exception e) {
            System.err.println("[X] SOAP Client Execution Error: " + e.getMessage());
            System.err.println("    Ensure HealthcareServicePublisher is currently running at http://localhost:8080/ws/healthcare");
        }
    }
}
