package com.mediconnect.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Doctor Entity Model
 * Represents a medical practitioner associated with a clinical department.
 */
@XmlRootElement(name = "doctor", namespace = "http://service.mediconnect.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class Doctor implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String doctorId;

    @XmlElement(required = true)
    private String doctorName;

    @XmlElement(required = true)
    private String specialization;

    @XmlElement(required = true)
    private String department;

    @XmlElement(required = true)
    private String availability;

    @XmlElement
    private String contactEmail;

    @XmlElement
    private String contactPhone;

    @XmlElement
    private String roomNo;

    public Doctor() {
    }

    public Doctor(String doctorId, String doctorName, String specialization, 
                  String department, String availability, String contactEmail, 
                  String contactPhone, String roomNo) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.department = department;
        this.availability = availability;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.roomNo = roomNo;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getRoomNo() {
        return roomNo;
    }

    public void setRoomNo(String roomNo) {
        this.roomNo = roomNo;
    }
}
