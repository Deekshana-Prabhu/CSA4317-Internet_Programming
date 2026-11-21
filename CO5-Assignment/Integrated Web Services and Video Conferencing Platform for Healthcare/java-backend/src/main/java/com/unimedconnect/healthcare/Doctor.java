package com.unimedconnect.healthcare;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "doctor", namespace = "http://unimedconnect.com/healthcare")
@XmlAccessorType(XmlAccessType.FIELD)
public class Doctor implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String doctorId;

    @XmlElement(required = true)
    private String name;

    @XmlElement
    private String specialization;

    @XmlElement
    private String department;

    @XmlElement
    private String email;

    @XmlElement
    private double consultationFee;

    @XmlElement
    private String availabilityStatus;

    @XmlElement
    private double rating;

    public Doctor() {}

    public Doctor(String doctorId, String name, String specialization, String department,
                  String email, double consultationFee, String availabilityStatus, double rating) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialization = specialization;
        this.department = department;
        this.email = email;
        this.consultationFee = consultationFee;
        this.availabilityStatus = availabilityStatus;
        this.rating = rating;
    }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
}
