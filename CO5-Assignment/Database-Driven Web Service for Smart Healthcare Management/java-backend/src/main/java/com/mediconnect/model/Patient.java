package com.mediconnect.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Patient Entity Model
 * Represents a registered patient record in the MediConnect system.
 * Annotated with JAXB annotations for seamless SOAP XML serialization.
 */
@XmlRootElement(name = "patient", namespace = "http://service.mediconnect.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String patientId;

    @XmlElement(required = true)
    private String patientName;

    @XmlElement(required = true)
    private int age;

    @XmlElement(required = true)
    private String gender;

    @XmlElement(required = true)
    private String bloodGroup;

    @XmlElement(required = true)
    private String mobile;

    @XmlElement
    private String email;

    @XmlElement
    private String address;

    @XmlElement
    private String doctorName;

    @XmlElement(required = true)
    private String department;

    // Default No-Arg Constructor (Required by JAXB)
    public Patient() {
    }

    // Full Parameterized Constructor
    public Patient(String patientId, String patientName, int age, String gender, 
                   String bloodGroup, String mobile, String email, String address, 
                   String doctorName, String department) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.mobile = mobile;
        this.email = email;
        this.address = address;
        this.doctorName = doctorName;
        this.department = department;
    }

    // Getters and Setters
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public String toString() {
        return "Patient{" +
                "patientId='" + patientId + '\'' +
                ", patientName='" + patientName + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", mobile='" + mobile + '\'' +
                ", email='" + email + '\'' +
                ", doctorName='" + doctorName + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}
