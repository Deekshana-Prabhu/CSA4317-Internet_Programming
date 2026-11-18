package model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

public class LeaveApplication implements Serializable {
    private static final long serialVersionUID = 1L;

    private int leaveId;
    private String employeeId;
    private String employeeName;
    private String leaveType;
    private Date fromDate;
    private Date toDate;
    private int numberOfDays;
    private String reason;
    private String status; // "Pending", "Approved", "Rejected"
    private Timestamp appliedAt;

    public LeaveApplication() {}

    public LeaveApplication(int leaveId, String employeeId, String employeeName, String leaveType,
                            Date fromDate, Date toDate, int numberOfDays, String reason,
                            String status, Timestamp appliedAt) {
        this.leaveId = leaveId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.numberOfDays = numberOfDays;
        this.reason = reason;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    public int getLeaveId() {
        return leaveId;
    }

    public void setLeaveId(int leaveId) {
        this.leaveId = leaveId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }

    public int getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(int numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(Timestamp appliedAt) {
        this.appliedAt = appliedAt;
    }
}
