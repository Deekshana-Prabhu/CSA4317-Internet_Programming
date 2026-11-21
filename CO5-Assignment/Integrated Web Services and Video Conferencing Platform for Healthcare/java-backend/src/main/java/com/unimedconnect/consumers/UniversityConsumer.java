package com.unimedconnect.consumers;

import com.unimedconnect.student.Student;
import com.unimedconnect.student.StudentService;
import jakarta.xml.ws.Service;
import javax.xml.namespace.QName;
import java.net.URL;

/**
 * UniversityConsumer demonstrates how a Java university portal application consumes
 * the published SOAP StudentService using standard JAX-WS dynamic client dispatch.
 */
public class UniversityConsumer {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println(" UniMed Connect - University Application Consumer");
        System.out.println("=================================================");

        try {
            URL wsdlUrl = new URL("http://localhost:8081/ws/student?wsdl");
            QName qname = new QName("http://unimedconnect.com/student", "StudentService");

            Service service = Service.create(wsdlUrl, qname);
            StudentService studentPort = service.getPort(StudentService.class);

            System.out.println("[Consumer] Connected to StudentService WSDL endpoint.");
            System.out.println("[Consumer] Executing SOAP call: getStudentById('STU1001')...\n");

            Student student = studentPort.getStudentById("STU1001");

            System.out.println(">>> SOAP Response Received Successfully <<<");
            System.out.println("Student ID:   " + student.getStudentId());
            System.out.println("Name:         " + student.getName());
            System.out.println("Department:   " + student.getDepartment());
            System.out.println("Year:         " + student.getYearOfStudy());
            System.out.println("Email:        " + student.getEmail());
            System.out.println("Attendance:   " + student.getAttendanceRate() + "%");
            System.out.println("CGPA:         " + student.getCgpa());
            System.out.println("Courses:      " + student.getEnrolledCoursesCount());

        } catch (Exception e) {
            System.err.println("[Consumer Error] " + e.getMessage());
            System.out.println("Ensure ServicePublisher is running on http://localhost:8081");
        }
    }
}
