package com.mediconnect.service;

import com.mediconnect.model.HealthcareFault;
import jakarta.xml.ws.WebFault;

/**
 * Healthcare Service Custom WebFault Exception
 * When thrown in a web method, JAX-WS serializes this into a compliant SOAP 1.1 / 1.2 Fault.
 */
@WebFault(name = "HealthcareFault", targetNamespace = "http://service.mediconnect.com/")
public class HealthcareServiceException extends Exception {

    private static final long serialVersionUID = 1L;
    private final HealthcareFault faultInfo;

    public HealthcareServiceException(String message, HealthcareFault faultInfo) {
        super(message);
        this.faultInfo = faultInfo;
    }

    public HealthcareServiceException(String message, HealthcareFault faultInfo, Throwable cause) {
        super(message, cause);
        this.faultInfo = faultInfo;
    }

    public HealthcareFault getFaultInfo() {
        return faultInfo;
    }
}
