package com.unimedconnect.classroom;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "course", namespace = "http://unimedconnect.com/classroom")
@XmlAccessorType(XmlAccessType.FIELD)
public class Course implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String courseCode;

    @XmlElement(required = true)
    private String courseName;

    @XmlElement
    private String department;

    @XmlElement
    private int credits;

    @XmlElement
    private String instructorName;

    @XmlElement
    private String schedule;

    public Course() {}

    public Course(String courseCode, String courseName, String department, int credits, String instructorName, String schedule) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.department = department;
        this.credits = credits;
        this.instructorName = instructorName;
        this.schedule = schedule;
    }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }
}
