package com.unimedconnect.student;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "attendanceRecord", namespace = "http://unimedconnect.com/student")
@XmlAccessorType(XmlAccessType.FIELD)
public class AttendanceRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String studentId;

    @XmlElement
    private String courseCode;

    @XmlElement
    private String date;

    @XmlElement
    private String status;

    public AttendanceRecord() {}

    public AttendanceRecord(String studentId, String courseCode, String date, String status) {
        this.studentId = studentId;
        this.courseCode = courseCode;
        this.date = date;
        this.status = status;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
