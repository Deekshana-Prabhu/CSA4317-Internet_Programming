import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Model class representing a Patient.
 */
public class Patient implements Serializable {
    private static final long serialVersionUID = 1L;

    private int patientId;
    private String name;
    private int age;
    private String gender;
    private String email;
    private String mobile;
    private String address;
    private String password;
    private Timestamp createdAt;

    public Patient() {
    }

    public Patient(int patientId, String name, int age, String gender, String email, String mobile, String address, String password) {
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.mobile = mobile;
        this.address = address;
        this.password = password;
    }

    public Patient(String name, int age, String gender, String email, String mobile, String address, String password) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.mobile = mobile;
        this.address = address;
        this.password = password;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
