package com.mediconnect.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Appointment Entity Model
 * Represents a scheduled clinical consultation between a patient and a physician.
 */
@XmlRootElement(name = "appointment", namespace = "http://service.mediconnect.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class Appointment implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String appointmentId;

    @XmlElement(required = true)
    private String patientId;

    @XmlElement(required = true)
    private String doctorName;

    @XmlElement(required = true)
    private String appointmentDate;

    @XmlElement(required = true)
    private String appointmentTime;

    @XmlElement(required = true)
    private String appointmentStatus;

    @XmlElement
    private String notes;

    public Appointment() {
    }

    public Appointment(String appointmentId, String patientId, String doctorName, 
                       String appointmentDate, String appointmentTime, 
                       String appointmentStatus, String notes) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorName = doctorName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.appointmentStatus = appointmentStatus;
        this.notes = notes;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(String appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
