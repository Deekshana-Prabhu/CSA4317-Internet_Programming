package com.smartcampus.service;

import java.util.List;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.jws.soap.SOAPBinding.Style;
import jakarta.jws.soap.SOAPBinding.Use;

import com.smartcampus.model.Student;
import com.smartcampus.exception.StudentNotFoundException;

/**
 * Service Endpoint Interface (SEI) for Student Information Service.
 * Defines standard operations exposed to university departmental applications
 * (Admission, Attendance, Examination, Library, Fee Management).
 */
@WebService(
    name = "StudentInformationService",
    targetNamespace = "http://service.smartcampus.com/"
)
@SOAPBinding(style = Style.DOCUMENT, use = Use.LITERAL)
public interface StudentInformationService {

    /**
     * Retrieves detailed student record by unique Student ID.
     * Used by Attendance, Exam, Library, and Fee departments.
     *
     * @param studentId The unique identification number of the student (e.g., STU-1001)
     * @return Student model containing full demographic and academic details
     * @throws StudentNotFoundException if studentId does not exist in registry
     */
    @WebMethod(operationName = "getStudentById")
    @WebResult(name = "student")
    Student getStudentById(
        @WebParam(name = "studentId") String studentId
    ) throws StudentNotFoundException;

    /**
     * Retrieves all enrolled students across all departments.
     *
     * @return List of all Student records
     */
    @WebMethod(operationName = "getAllStudents")
    @WebResult(name = "studentList")
    List<Student> getAllStudents();

    /**
     * Registers a new student into the centralized campus database.
     * Invoked primarily by the Admission Management Application upon fee clearance.
     *
     * @param student The new Student record to be persisted
     * @return true if successfully added, false otherwise
     */
    @WebMethod(operationName = "addStudent")
    @WebResult(name = "success")
    boolean addStudent(
        @WebParam(name = "student") Student student
    );

    /**
     * Retrieves all students belonging to a specific department.
     *
     * @param department Department name (e.g., Computer Science, Mechanical)
     * @return List of matching Student records
     */
    @WebMethod(operationName = "getStudentsByDepartment")
    @WebResult(name = "departmentStudents")
    List<Student> getStudentsByDepartment(
        @WebParam(name = "department") String department
    );
}
