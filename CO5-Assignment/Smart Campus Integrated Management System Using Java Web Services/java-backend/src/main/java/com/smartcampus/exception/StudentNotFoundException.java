package com.smartcampus.exception;

import jakarta.xml.ws.WebFault;

/**
 * Custom SOAP Fault exception thrown when a requested Student record is not found.
 * Mapped to a SOAP Fault detail element via @WebFault annotation.
 */
@WebFault(name = "StudentNotFoundFault", targetNamespace = "http://service.smartcampus.com/")
public class StudentNotFoundException extends Exception {

    private static final long serialVersionUID = 1L;
    private String faultDetails;

    public StudentNotFoundException(String message) {
        super(message);
        this.faultDetails = message;
    }

    public StudentNotFoundException(String message, String faultDetails) {
        super(message);
        this.faultDetails = faultDetails;
    }

    public StudentNotFoundException(String message, Throwable cause) {
        super(message, cause);
        this.faultDetails = message;
    }

    public String getFaultInfo() {
        return faultDetails;
    }
}
