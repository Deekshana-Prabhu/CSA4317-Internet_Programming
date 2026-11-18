package com.college.admission;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Thread-Safe In-Memory Data Store for Registered Students.
 * Maintains student admission records across HTTP requests throughout server uptime.
 */
public class StudentDataStore {
    private static StudentDataStore instance;
    private final List<Student> students;

    // Private constructor implementing Singleton pattern
    private StudentDataStore() {
        students = Collections.synchronizedList(new ArrayList<>());
        loadInitialSampleData();
    }

    /**
     * Returns the singleton instance of StudentDataStore
     */
    public static synchronized StudentDataStore getInstance() {
        if (instance == null) {
            instance = new StudentDataStore();
        }
        return instance;
    }

    /**
     * Seeds initial engineering applicant records for immediate testing & demonstration
     */
    private void loadInitialSampleData() {
        students.add(new Student(
            "Aarav Patel",
            "REG2026101",
            "aarav.patel@gmail.com",
            "9840123456",
            "2006-03-12",
            "Male",
            "14/B, Sunrise Avenue, OMR, Chennai",
            "Tamil Nadu",
            "AI & ML",
            91.5,
            94.0,
            "CSE"
        ));

        students.add(new Student(
            "Priya Sundaram",
            "REG2026102",
            "priya.sundaram@outlook.com",
            "9789012345",
            "2006-07-25",
            "Female",
            "52, Green Garden Residency, Bangalore",
            "Karnataka",
            "CSE",
            94.2,
            96.8,
            "IT"
        ));

        students.add(new Student(
            "Karthik Varma",
            "REG2026103",
            "karthik.varma@yahoo.com",
            "9823456789",
            "2005-11-08",
            "Male",
            "8/12, Lake View Colony, Hyderabad",
            "Telangana",
            "ECE",
            87.0,
            89.5,
            "AI & ML"
        ));
    }

    /**
     * Checks if a register number is already registered in the system (case-insensitive)
     */
    public boolean isDuplicate(String registerNumber) {
        if (registerNumber == null) return false;
        synchronized (students) {
            for (Student s : students) {
                if (s.getRegisterNumber() != null && s.getRegisterNumber().equalsIgnoreCase(registerNumber.trim())) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Adds a new student record after validating uniqueness of the register number
     * @return true if added successfully, false if duplicate register number exists
     */
    public boolean addStudent(Student student) {
        if (student == null || student.getRegisterNumber() == null) {
            return false;
        }
        synchronized (students) {
            if (isDuplicate(student.getRegisterNumber())) {
                return false;
            }
            students.add(student);
            return true;
        }
    }

    /**
     * Returns a copy of all registered student records
     */
    public List<Student> getAllStudents() {
        synchronized (students) {
            return new ArrayList<>(students);
        }
    }

    /**
     * Searches registered students by Register Number or Student Name (case-insensitive)
     */
    public List<Student> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        String lowerQuery = query.trim().toLowerCase();
        List<Student> results = new ArrayList<>();
        synchronized (students) {
            for (Student s : students) {
                boolean matchesName = s.getStudentName() != null && s.getStudentName().toLowerCase().contains(lowerQuery);
                boolean matchesReg = s.getRegisterNumber() != null && s.getRegisterNumber().toLowerCase().contains(lowerQuery);
                if (matchesName || matchesReg) {
                    results.add(s);
                }
            }
        }
        return results;
    }

    /**
     * Deletes a student record by Register Number
     * @return true if student found and deleted, false otherwise
     */
    public boolean deleteStudent(String registerNumber) {
        if (registerNumber == null) return false;
        synchronized (students) {
            for (int i = 0; i < students.size(); i++) {
                if (students.get(i).getRegisterNumber().equalsIgnoreCase(registerNumber.trim())) {
                    students.remove(i);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Finds a student by Register Number
     */
    public Student getStudentByRegNo(String registerNumber) {
        if (registerNumber == null) return null;
        synchronized (students) {
            for (Student s : students) {
                if (s.getRegisterNumber().equalsIgnoreCase(registerNumber.trim())) {
                    return s;
                }
            }
        }
        return null;
    }
}
