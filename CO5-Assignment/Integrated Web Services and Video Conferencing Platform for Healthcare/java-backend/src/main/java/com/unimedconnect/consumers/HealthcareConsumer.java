package com.unimedconnect.consumers;

import com.unimedconnect.healthcare.HealthcareService;
import com.unimedconnect.healthcare.Patient;
import jakarta.xml.ws.Service;
import javax.xml.namespace.QName;
import java.net.URL;

/**
 * HealthcareConsumer demonstrates how an external hospital EHR system consumes
 * the published SOAP HealthcareService to fetch patient data and book appointments.
 */
public class HealthcareConsumer {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println(" UniMed Connect - Healthcare Application Consumer");
        System.out.println("=================================================");

        try {
            URL wsdlUrl = new URL("http://localhost:8081/ws/healthcare?wsdl");
            QName qname = new QName("http://unimedconnect.com/healthcare", "HealthcareService");

            Service service = Service.create(wsdlUrl, qname);
            HealthcareService healthcarePort = service.getPort(HealthcareService.class);

            System.out.println("[Consumer] Connected to HealthcareService WSDL endpoint.");
            System.out.println("[Consumer] Executing SOAP call: getPatientById('PAT4001')...\n");

            Patient patient = healthcarePort.getPatientById("PAT4001");

            System.out.println(">>> SOAP Response Received Successfully <<<");
            System.out.println("Patient ID:   " + patient.getPatientId());
            System.out.println("Name:         " + patient.getName());
            System.out.println("Age/Gender:   " + patient.getAge() + " / " + patient.getGender());
            System.out.println("Department:   " + patient.getDepartment());
            System.out.println("Assigned Dr:  " + patient.getAssignedDoctorId());
            System.out.println("Condition:    " + patient.getMedicalCondition());
            System.out.println("Status:       " + patient.getConsultationStatus());
            System.out.println("Last Visit:   " + patient.getLastVisitDate());

        } catch (Exception e) {
            System.err.println("[Consumer Error] " + e.getMessage());
            System.out.println("Ensure ServicePublisher is running on http://localhost:8081");
        }
    }
}
