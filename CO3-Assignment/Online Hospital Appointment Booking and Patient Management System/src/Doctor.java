import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Model class representing a Doctor.
 */
public class Doctor implements Serializable {
    private static final long serialVersionUID = 1L;

    private int doctorId;
    private String name;
    private String specialization;
    private String qualification;
    private String experience;
    private BigDecimal fee;
    private String availableDays;
    private String availableTimeSlots; // default standard slots

    public Doctor() {
        this.availableTimeSlots = "09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM";
    }

    public Doctor(int doctorId, String name, String specialization, String qualification, 
                  String experience, BigDecimal fee, String availableDays) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.fee = fee;
        this.availableDays = availableDays;
        this.availableTimeSlots = "09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM";
    }

    public Doctor(String name, String specialization, String qualification, 
                  String experience, BigDecimal fee, String availableDays) {
        this.name = name;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.fee = fee;
        this.availableDays = availableDays;
        this.availableTimeSlots = "09:00 AM - 01:00 PM, 04:00 PM - 07:00 PM";
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public BigDecimal getFee() {
        return fee;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getAvailableTimeSlots() {
        return availableTimeSlots;
    }

    public void setAvailableTimeSlots(String availableTimeSlots) {
        this.availableTimeSlots = availableTimeSlots;
    }
}
