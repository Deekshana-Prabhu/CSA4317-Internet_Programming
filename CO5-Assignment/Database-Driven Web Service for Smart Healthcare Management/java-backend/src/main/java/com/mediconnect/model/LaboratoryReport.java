package com.mediconnect.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Laboratory Report Entity Model
 * Represents diagnostic lab test findings, reference ranges, and analytical status.
 */
@XmlRootElement(name = "laboratoryReport", namespace = "http://service.mediconnect.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class LaboratoryReport implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String reportId;

    @XmlElement(required = true)
    private String patientId;

    @XmlElement(required = true)
    private String testName;

    @XmlElement(required = true)
    private String testDate;

    @XmlElement(required = true)
    private String laboratoryName;

    @XmlElement(required = true)
    private String testResult;

    @XmlElement
    private String referenceRange;

    @XmlElement(required = true)
    private String reportStatus;

    public LaboratoryReport() {
    }

    public LaboratoryReport(String reportId, String patientId, String testName, 
                            String testDate, String laboratoryName, String testResult, 
                            String referenceRange, String reportStatus) {
        this.reportId = reportId;
        this.patientId = patientId;
        this.testName = testName;
        this.testDate = testDate;
        this.laboratoryName = laboratoryName;
        this.testResult = testResult;
        this.referenceRange = referenceRange;
        this.reportStatus = reportStatus;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getTestDate() {
        return testDate;
    }

    public void setTestDate(String testDate) {
        this.testDate = testDate;
    }

    public String getLaboratoryName() {
        return laboratoryName;
    }

    public void setLaboratoryName(String laboratoryName) {
        this.laboratoryName = laboratoryName;
    }

    public String getTestResult() {
        return testResult;
    }

    public void setTestResult(String testResult) {
        this.testResult = testResult;
    }

    public String getReferenceRange() {
        return referenceRange;
    }

    public void setReferenceRange(String referenceRange) {
        this.referenceRange = referenceRange;
    }

    public String getReportStatus() {
        return reportStatus;
    }

    public void setReportStatus(String reportStatus) {
        this.reportStatus = reportStatus;
    }
}
