package com.unimedconnect.video;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

@XmlRootElement(name = "videoSession", namespace = "http://unimedconnect.com/video")
@XmlAccessorType(XmlAccessType.FIELD)
public class VideoSession implements Serializable {
    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String sessionId;

    @XmlElement(required = true)
    private String title;

    @XmlElement
    private String type; // 'CLASSROOM', 'TELEHEALTH'

    @XmlElement
    private String hostId;

    @XmlElement
    private String hostName;

    @XmlElement
    private int participantCount;

    @XmlElement
    private String status; // 'ACTIVE', 'ENDED'

    public VideoSession() {}

    public VideoSession(String sessionId, String title, String type, String hostId, String hostName, int participantCount, String status) {
        this.sessionId = sessionId;
        this.title = title;
        this.type = type;
        this.hostId = hostId;
        this.hostName = hostName;
        this.participantCount = participantCount;
        this.status = status;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getHostId() { return hostId; }
    public void setHostId(String hostId) { this.hostId = hostId; }

    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }

    public int getParticipantCount() { return participantCount; }
    public void setParticipantCount(int participantCount) { this.participantCount = participantCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
