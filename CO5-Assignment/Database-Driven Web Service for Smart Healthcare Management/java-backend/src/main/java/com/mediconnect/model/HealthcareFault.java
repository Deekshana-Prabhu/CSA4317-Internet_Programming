package com.mediconnect.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Healthcare Fault Detail Bean
 * Encapsulates error codes, clinical context, and diagnostic timestamps
 * embedded inside SOAP Fault <detail> elements.
 */
@XmlRootElement(name = "HealthcareFault", namespace = "http://service.mediconnect.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class HealthcareFault implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String errorCode;

    @XmlElement(required = true)
    private String errorMessage;

    @XmlElement
    private String details;

    @XmlElement
    private String timestamp;

    public HealthcareFault() {
        this.timestamp = LocalDateTime.now().toString();
    }

    public HealthcareFault(String errorCode, String errorMessage, String details) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.details = details;
        this.timestamp = LocalDateTime.now().toString();
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
