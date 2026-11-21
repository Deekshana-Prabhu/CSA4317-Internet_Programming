package com.unimedconnect.student;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "student", namespace = "http://unimedconnect.com/student")
@XmlAccessorType(XmlAccessType.FIELD)
public class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String studentId;

    @XmlElement(required = true)
    private String name;

    @XmlElement(required = true)
    private String department;

    @XmlElement
    private int yearOfStudy;

    @XmlElement
    private String email;

    @XmlElement
    private double attendanceRate;

    @XmlElement
    private double cgpa;

    @XmlElement
    private int enrolledCoursesCount;

    public Student() {}

    public Student(String studentId, String name, String department, int yearOfStudy,
                   String email, double attendanceRate, double cgpa, int enrolledCoursesCount) {
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
        this.email = email;
        this.attendanceRate = attendanceRate;
        this.cgpa = cgpa;
        this.enrolledCoursesCount = enrolledCoursesCount;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public double getAttendanceRate() { return attendanceRate; }
    public void setAttendanceRate(double attendanceRate) { this.attendanceRate = attendanceRate; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }

    public int getEnrolledCoursesCount() { return enrolledCoursesCount; }
    public void setEnrolledCoursesCount(int count) { this.enrolledCoursesCount = count; }
}
