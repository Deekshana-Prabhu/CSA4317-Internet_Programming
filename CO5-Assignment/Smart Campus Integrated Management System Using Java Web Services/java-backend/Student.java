package com.smartcampus.model;

import java.io.Serializable;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;

/**
 * Model class representing a Student entity in the Smart Campus system.
 * Annotated with JAXB annotations for XML serialization/deserialization
 * over SOAP Web Services.
 */
@XmlRootElement(name = "student", namespace = "http://service.smartcampus.com/")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "student", propOrder = {
    "studentId",
    "studentName",
    "department",
    "year",
    "email",
    "mobileNumber",
    "admissionStatus",
    "cgpa"
})
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String studentId;

    @XmlElement(required = true)
    private String studentName;

    @XmlElement(required = true)
    private String department;

    @XmlElement(required = true)
    private String year;

    @XmlElement(required = true)
    private String email;

    @XmlElement(required = true)
    private String mobileNumber;

    @XmlElement(required = true)
    private String admissionStatus;

    @XmlElement
    private double cgpa;

    // Default no-argument constructor required for JAXB
    public Student() {
    }

    // Parameterized constructor for easy instantiation
    public Student(String studentId, String studentName, String department, 
                   String year, String email, String mobileNumber, 
                   String admissionStatus, double cgpa) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.department = department;
        this.year = year;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.admissionStatus = admissionStatus;
        this.cgpa = cgpa;
    }

    // Getters and Setters
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getAdmissionStatus() {
        return admissionStatus;
    }

    public void setAdmissionStatus(String admissionStatus) {
        this.admissionStatus = admissionStatus;
    }

    public double getCgpa() {
        return cgpa;
    }

    public void setCgpa(double cgpa) {
        this.cgpa = cgpa;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", studentName='" + studentName + '\'' +
                ", department='" + department + '\'' +
                ", year='" + year + '\'' +
                ", email='" + email + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", admissionStatus='" + admissionStatus + '\'' +
                ", cgpa=" + cgpa +
                '}';
    }
}
