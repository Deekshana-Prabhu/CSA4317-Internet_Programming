package com.college.admission;

import java.io.Serializable;

/**
 * Student Model / JavaBean Class
 * Represents an applicant's admission and academic registration details.
 */
public class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    private String studentName;
    private String registerNumber;
    private String email;
    private String mobile;
    private String dob;
    private String gender;
    private String address;
    private String state;
    private String department;
    private double marks10;
    private double marks12;
    private String preferredDepartment;

    // Default Constructor
    public Student() {
    }

    // Parameterized Constructor
    public Student(String studentName, String registerNumber, String email, String mobile, 
                   String dob, String gender, String address, String state, 
                   String department, double marks10, double marks12, String preferredDepartment) {
        this.studentName = studentName;
        this.registerNumber = registerNumber;
        this.email = email;
        this.mobile = mobile;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.state = state;
        this.department = department;
        this.marks10 = marks10;
        this.marks12 = marks12;
        this.preferredDepartment = preferredDepartment;
    }

    // Getters and Setters
    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public double getMarks10() {
        return marks10;
    }

    public void setMarks10(double marks10) {
        this.marks10 = marks10;
    }

    public double getMarks12() {
        return marks12;
    }

    public void setMarks12(double marks12) {
        this.marks12 = marks12;
    }

    public String getPreferredDepartment() {
        return preferredDepartment;
    }

    public void setPreferredDepartment(String preferredDepartment) {
        this.preferredDepartment = preferredDepartment;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentName='" + studentName + '\'' +
                ", registerNumber='" + registerNumber + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", marks10=" + marks10 +
                ", marks12=" + marks12 +
                '}';
    }
}
