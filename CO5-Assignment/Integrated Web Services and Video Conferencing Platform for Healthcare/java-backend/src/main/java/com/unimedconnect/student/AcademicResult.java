package com.unimedconnect.student;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "academicResult", namespace = "http://unimedconnect.com/student")
@XmlAccessorType(XmlAccessType.FIELD)
public class AcademicResult implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String studentId;

    @XmlElement
    private String courseCode;

    @XmlElement
    private String semester;

    @XmlElement
    private String grade;

    @XmlElement
    private double marksObtained;

    public AcademicResult() {}

    public AcademicResult(String studentId, String courseCode, String semester, String grade, double marksObtained) {
        this.studentId = studentId;
        this.courseCode = courseCode;
        this.semester = semester;
        this.grade = grade;
        this.marksObtained = marksObtained;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(double marksObtained) { this.marksObtained = marksObtained; }
}
