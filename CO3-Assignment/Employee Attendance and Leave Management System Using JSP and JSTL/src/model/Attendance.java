package model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;

public class Attendance implements Serializable {
    private static final long serialVersionUID = 1L;

    private int attendanceId;
    private String employeeId;
    private String employeeName;
    private Date attendanceDate;
    private Time checkIn;
    private Time checkOut;
    private String status; // "Present" or "Absent"

    public Attendance() {}

    public Attendance(int attendanceId, String employeeId, String employeeName, Date attendanceDate, Time checkIn, Time checkOut, String status) {
        this.attendanceId = attendanceId;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.attendanceDate = attendanceDate;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
    }

    public int getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(int attendanceId) {
        this.attendanceId = attendanceId;
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

    public Date getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(Date attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public Time getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(Time checkIn) {
        this.checkIn = checkIn;
    }

    public Time getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(Time checkOut) {
        this.checkOut = checkOut;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Friendly formatted getters for clean display
    public String getFormattedCheckIn() {
        return checkIn != null ? checkIn.toString() : "-- : --";
    }

    public String getFormattedCheckOut() {
        return checkOut != null ? checkOut.toString() : "-- : --";
    }
}
