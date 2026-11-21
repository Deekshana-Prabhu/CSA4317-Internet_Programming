package com.mediconnect.service;

import com.mediconnect.model.Appointment;
import com.mediconnect.model.LaboratoryReport;
import com.mediconnect.model.Patient;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import java.util.List;

/**
 * Service Endpoint Interface (SEI): HealthcareInformationService
 * Defines the contract for MediConnect SOAP Web Services.
 *
 * Exposes core clinical operations:
 * - Patient record retrieval
 * - Diagnostic lab test findings
 * - Physician consultation appointments
 * - Comprehensive patient directory
 */
@WebService(
    name = "HealthcareInformationService",
    targetNamespace = "http://service.mediconnect.com/"
)
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface HealthcareInformationService {

    /**
     * Retrieves complete clinical demographic details for a specific patient.
     *
     * @param patientId The unique patient identifier (e.g. PAT-1001)
     * @return Complete Patient details
     * @throws HealthcareServiceException when the patientId is invalid or not found
     */
    @WebMethod(operationName = "getPatientById")
    @WebResult(name = "patient")
    Patient getPatientById(
        @WebParam(name = "patientId") String patientId
    ) throws HealthcareServiceException;

    /**
     * Retrieves all laboratory diagnostic test reports associated with a patient.
     *
     * @param patientId The unique patient identifier (e.g. PAT-1001)
     * @return List of LaboratoryReport records
     * @throws HealthcareServiceException when patient record lookup fails
     */
    @WebMethod(operationName = "getLaboratoryReports")
    @WebResult(name = "laboratoryReport")
    List<LaboratoryReport> getLaboratoryReports(
        @WebParam(name = "patientId") String patientId
    ) throws HealthcareServiceException;

    /**
     * Retrieves all clinical appointments booked for a patient.
     *
     * @param patientId The unique patient identifier (e.g. PAT-1001)
     * @return List of Appointment records
     * @throws HealthcareServiceException when lookup fails
     */
    @WebMethod(operationName = "getAppointments")
    @WebResult(name = "appointment")
    List<Appointment> getAppointments(
        @WebParam(name = "patientId") String patientId
    ) throws HealthcareServiceException;

    /**
     * Retrieves all registered patients currently in the centralized database.
     *
     * @return List of all Patient records
     * @throws HealthcareServiceException if a database connectivity error occurs
     */
    @WebMethod(operationName = "getAllPatients")
    @WebResult(name = "patient")
    List<Patient> getAllPatients() throws HealthcareServiceException;
}
