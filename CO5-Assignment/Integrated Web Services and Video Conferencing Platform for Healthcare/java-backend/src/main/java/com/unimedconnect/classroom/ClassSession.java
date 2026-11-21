package com.unimedconnect.classroom;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "classSession", namespace = "http://unimedconnect.com/classroom")
@XmlAccessorType(XmlAccessType.FIELD)
public class ClassSession implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement
    private String sessionId;

    @XmlElement
    private String courseCode;

    @XmlElement
    private String topic;

    @XmlElement
    private String time;

    @XmlElement
    private String status;

    public ClassSession() {}

    public ClassSession(String sessionId, String courseCode, String topic, String time, String status) {
        this.sessionId = sessionId;
        this.courseCode = courseCode;
        this.topic = topic;
        this.time = time;
        this.status = status;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
