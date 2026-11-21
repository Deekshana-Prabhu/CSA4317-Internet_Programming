package com.unimedconnect.healthcare;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import java.util.List;

@WebService(targetNamespace = "http://unimedconnect.com/healthcare")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface HealthcareService {

    @WebMethod(operationName = "getPatientById")
    @WebResult(name = "patient")
    Patient getPatientById(@WebParam(name = "patientId") String patientId) throws Exception;

    @WebMethod(operationName = "getDoctorDetails")
    @WebResult(name = "doctor")
    Doctor getDoctorDetails(@WebParam(name = "doctorId") String doctorId) throws Exception;

    @WebMethod(operationName = "getAppointments")
    @WebResult(name = "appointments")
    List<Appointment> getAppointments(@WebParam(name = "patientId") String patientId);

    @WebMethod(operationName = "bookAppointment")
    @WebResult(name = "confirmation")
    Appointment bookAppointment(
        @WebParam(name = "patientId") String patientId,
        @WebParam(name = "doctorId") String doctorId,
        @WebParam(name = "appointmentDate") String appointmentDate,
        @WebParam(name = "timeSlot") String timeSlot,
        @WebParam(name = "reason") String reason
    ) throws Exception;
}
