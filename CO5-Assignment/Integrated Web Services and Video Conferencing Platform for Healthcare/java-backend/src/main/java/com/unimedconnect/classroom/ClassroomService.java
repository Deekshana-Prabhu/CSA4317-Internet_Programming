package com.unimedconnect.classroom;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import java.util.List;

@WebService(targetNamespace = "http://unimedconnect.com/classroom")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface ClassroomService {

    @WebMethod(operationName = "getCourseDetails")
    @WebResult(name = "course")
    Course getCourseDetails(@WebParam(name = "courseCode") String courseCode) throws Exception;

    @WebMethod(operationName = "getClassSchedule")
    @WebResult(name = "sessions")
    List<ClassSession> getClassSchedule(@WebParam(name = "courseCode") String courseCode);

    @WebMethod(operationName = "getEnrolledStudents")
    @WebResult(name = "studentIds")
    List<String> getEnrolledStudents(@WebParam(name = "courseCode") String courseCode);
}
