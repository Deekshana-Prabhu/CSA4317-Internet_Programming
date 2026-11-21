package com.unimedconnect.healthcare;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "patient", namespace = "http://unimedconnect.com/healthcare")
@XmlAccessorType(XmlAccessType.FIELD)
public class Patient implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String patientId;

    @XmlElement(required = true)
    private String name;

    @XmlElement
    private int age;

    @XmlElement
    private String gender;

    @XmlElement
    private String department;

    @XmlElement
    private String assignedDoctorId;

    @XmlElement
    private String contactPhone;

    @XmlElement
    private String medicalCondition;

    @XmlElement
    private String consultationStatus;

    @XmlElement
    private String lastVisitDate;

    public Patient() {}

    public Patient(String patientId, String name, int age, String gender, String department,
                   String assignedDoctorId, String contactPhone, String medicalCondition,
                   String consultationStatus, String lastVisitDate) {
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.department = department;
        this.assignedDoctorId = assignedDoctorId;
        this.contactPhone = contactPhone;
        this.medicalCondition = medicalCondition;
        this.consultationStatus = consultationStatus;
        this.lastVisitDate = lastVisitDate;
    }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAssignedDoctorId() { return assignedDoctorId; }
    public void setAssignedDoctorId(String assignedDoctorId) { this.assignedDoctorId = assignedDoctorId; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getMedicalCondition() { return medicalCondition; }
    public void setMedicalCondition(String medicalCondition) { this.medicalCondition = medicalCondition; }

    public String getConsultationStatus() { return consultationStatus; }
    public void setConsultationStatus(String consultationStatus) { this.consultationStatus = consultationStatus; }

    public String getLastVisitDate() { return lastVisitDate; }
    public void setLastVisitDate(String lastVisitDate) { this.lastVisitDate = lastVisitDate; }
}
