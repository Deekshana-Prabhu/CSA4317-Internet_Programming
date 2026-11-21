package com.unimedconnect.student;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import java.util.List;

@WebService(targetNamespace = "http://unimedconnect.com/student")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface StudentService {

    @WebMethod(operationName = "getStudentById")
    @WebResult(name = "student")
    Student getStudentById(@WebParam(name = "studentId") String studentId) throws Exception;

    @WebMethod(operationName = "getAllStudents")
    @WebResult(name = "students")
    List<Student> getAllStudents();

    @WebMethod(operationName = "getAttendance")
    @WebResult(name = "attendanceRecords")
    List<AttendanceRecord> getAttendance(@WebParam(name = "studentId") String studentId);

    @WebMethod(operationName = "getResults")
    @WebResult(name = "academicResults")
    List<AcademicResult> getResults(@WebParam(name = "studentId") String studentId);
}
