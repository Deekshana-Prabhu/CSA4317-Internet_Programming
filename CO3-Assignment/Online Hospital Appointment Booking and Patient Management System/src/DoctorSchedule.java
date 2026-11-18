import java.io.Serializable;
import java.sql.Date;

/**
 * Model class representing a Doctor's appointment schedule slot.
 */
public class DoctorSchedule implements Serializable {
    private static final long serialVersionUID = 1L;

    private int scheduleId;
    private int doctorId;
    private String doctorName;
    private Date availableDate;
    private String timeSlot;
    private String availabilityStatus; // 'Available', 'Booked', 'Unavailable'

    public DoctorSchedule() {
    }

    public DoctorSchedule(int scheduleId, int doctorId, Date availableDate, String timeSlot, String availabilityStatus) {
        this.scheduleId = scheduleId;
        this.doctorId = doctorId;
        this.availableDate = availableDate;
        this.timeSlot = timeSlot;
        this.availabilityStatus = availabilityStatus;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Date getAvailableDate() {
        return availableDate;
    }

    public void setAvailableDate(Date availableDate) {
        this.availableDate = availableDate;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
}
