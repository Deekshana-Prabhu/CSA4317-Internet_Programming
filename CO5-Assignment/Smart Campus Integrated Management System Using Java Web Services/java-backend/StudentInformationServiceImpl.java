package com.smartcampus.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import jakarta.jws.WebService;

import com.smartcampus.model.Student;
import com.smartcampus.exception.StudentNotFoundException;

/**
 * Service Implementation Bean (SIB) for Student Information Service.
 * Implements the contract defined by StudentInformationService interface.
 * Maintains an in-memory concurrent repository of university student records.
 */
@WebService(
    endpointInterface = "com.smartcampus.service.StudentInformationService",
    serviceName = "StudentInformationService",
    portName = "StudentInformationServicePort",
    targetNamespace = "http://service.smartcampus.com/"
)
public class StudentInformationServiceImpl implements StudentInformationService {

    // Thread-safe in-memory student database
    private static final Map<String, Student> studentRepository = new ConcurrentHashMap<>();

    // Static initializer with 10+ realistic fictional university student records
    static {
        initializeSampleStudents();
    }

    private static void initializeSampleStudents() {
        addInitialStudent(new Student(
            "STU-1001", "Aarav Sharma", "Computer Science", 
            "3rd Year", "aarav.sharma@campus.edu", "+1 (555) 234-5678", 
            "Enrolled", 3.85
        ));

        addInitialStudent(new Student(
            "STU-1002", "Sophia Chen", "Biotechnology", 
            "2nd Year", "sophia.chen@campus.edu", "+1 (555) 345-6789", 
            "Enrolled", 3.92
        ));

        addInitialStudent(new Student(
            "STU-1003", "Liam Johnson", "Mechanical Engineering", 
            "4th Year", "liam.johnson@campus.edu", "+1 (555) 456-7890", 
            "Enrolled", 3.48
        ));

        addInitialStudent(new Student(
            "STU-1004", "Priya Patel", "Information Technology", 
            "3rd Year", "priya.patel@campus.edu", "+1 (555) 567-8901", 
            "Enrolled", 3.75
        ));

        addInitialStudent(new Student(
            "STU-1005", "Marcus Miller", "Electronics & Comm.", 
            "1st Year", "marcus.miller@campus.edu", "+1 (555) 678-9012", 
            "Enrolled", 3.60
        ));

        addInitialStudent(new Student(
            "STU-1006", "Aisha Al-Mansoor", "Civil Engineering", 
            "2nd Year", "aisha.mansoor@campus.edu", "+1 (555) 789-0123", 
            "Enrolled", 3.80
        ));

        addInitialStudent(new Student(
            "STU-1007", "Elena Rostova", "Computer Science", 
            "4th Year", "elena.rostova@campus.edu", "+1 (555) 890-1234", 
            "Enrolled", 3.95
        ));

        addInitialStudent(new Student(
            "STU-1008", "David Kim", "Electrical Engineering", 
            "3rd Year", "david.kim@campus.edu", "+1 (555) 901-2345", 
            "Enrolled", 3.52
        ));

        addInitialStudent(new Student(
            "STU-1009", "Fatima Zahra", "Biotechnology", 
            "1st Year", "fatima.zahra@campus.edu", "+1 (555) 012-3456", 
            "Enrolled", 3.88
        ));

        addInitialStudent(new Student(
            "STU-1010", "Lucas Silva", "Mechanical Engineering", 
            "2nd Year", "lucas.silva@campus.edu", "+1 (555) 123-4567", 
            "Enrolled", 3.35
        ));
    }

    private static void addInitialStudent(Student student) {
        studentRepository.put(student.getStudentId().toUpperCase(), student);
    }

    @Override
    public Student getStudentById(String studentId) throws StudentNotFoundException {
        System.out.println("[StudentInformationService] Received SOAP request getStudentById for: " + studentId);

        if (studentId == null || studentId.trim().isEmpty()) {
            throw new StudentNotFoundException("Student ID cannot be null or empty.");
        }

        String normalizedId = studentId.trim().toUpperCase();
        Student student = studentRepository.get(normalizedId);

        if (student == null) {
            String errorMsg = "No student record found with Student ID: " + studentId;
            System.err.println("[StudentInformationService] Fault triggered: " + errorMsg);
            throw new StudentNotFoundException(errorMsg, "ERROR_STUDENT_NOT_FOUND");
        }

        System.out.println("[StudentInformationService] Successfully retrieved: " + student.getStudentName());
        return student;
    }

    @Override
    public List<Student> getAllStudents() {
        System.out.println("[StudentInformationService] Received SOAP request getAllStudents. Total: " + studentRepository.size());
        return new ArrayList<>(studentRepository.values());
    }

    @Override
    public boolean addStudent(Student student) {
        if (student == null || student.getStudentId() == null || student.getStudentId().trim().isEmpty()) {
            System.err.println("[StudentInformationService] Cannot add null or un-identified student.");
            return false;
        }

        String normalizedId = student.getStudentId().trim().toUpperCase();
        studentRepository.put(normalizedId, student);
        System.out.println("[StudentInformationService] Registered new student: " + student.getStudentName() + " (" + normalizedId + ")");
        return true;
    }

    @Override
    public List<Student> getStudentsByDepartment(String department) {
        System.out.println("[StudentInformationService] Filtering students by department: " + department);
        if (department == null || department.trim().isEmpty()) {
            return getAllStudents();
        }

        return studentRepository.values().stream()
                .filter(s -> s.getDepartment() != null && s.getDepartment().equalsIgnoreCase(department.trim()))
                .collect(Collectors.toList());
    }
}
