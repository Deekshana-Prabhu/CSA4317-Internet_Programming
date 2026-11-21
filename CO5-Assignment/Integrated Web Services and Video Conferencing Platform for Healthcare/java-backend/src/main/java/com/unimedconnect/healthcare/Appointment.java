package com.unimedconnect.healthcare;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "appointment", namespace = "http://unimedconnect.com/healthcare")
@XmlAccessorType(XmlAccessType.FIELD)
public class Appointment implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String appointmentId;

    @XmlElement(required = true)
    private String patientId;

    @XmlElement(required = true)
    private String doctorId;

    @XmlElement(required = true)
    private String appointmentDate;

    @XmlElement(required = true)
    private String timeSlot;

    @XmlElement
    private String reasonForVisit;

    @XmlElement
    private String status;

    public Appointment() {}

    public Appointment(String appointmentId, String patientId, String doctorId,
                       String appointmentDate, String timeSlot, String reasonForVisit, String status) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.reasonForVisit = reasonForVisit;
        this.status = status;
    }

    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getReasonForVisit() { return reasonForVisit; }
    public void setReasonForVisit(String reasonForVisit) { this.reasonForVisit = reasonForVisit; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
