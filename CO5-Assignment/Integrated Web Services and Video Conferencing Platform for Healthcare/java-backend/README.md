# UniMed Connect - Java SOAP Web Services Backend

This module provides the enterprise-grade Java SOAP Web Services layer for the **UniMed Connect** platform, built using Java 17, Jakarta XML Web Services (JAX-WS), and JDBC.

---

## 🏛️ Architecture Overview

The backend exposes four core document/literal SOAP web services:

1. **StudentService** (`http://localhost:8081/ws/student?wsdl`)
   - `getStudentById(studentId)`
   - `getAllStudents()`
   - `getAttendance(studentId)`
   - `getResults(studentId)`

2. **HealthcareService** (`http://localhost:8081/ws/healthcare?wsdl`)
   - `getPatientById(patientId)`
   - `getDoctorDetails(doctorId)`
   - `getAppointments(patientId)`
   - `bookAppointment(patientId, doctorId, date, timeSlot, reason)`

3. **ClassroomService** (`http://localhost:8081/ws/classroom?wsdl`)
   - `getCourseDetails(courseCode)`
   - `getClassSchedule(courseCode)`
   - `getEnrolledStudents(courseCode)`

4. **VideoSessionService** (`http://localhost:8081/ws/video?wsdl`)
   - `createSession(title, type, hostId, hostName)`
   - `joinSession(sessionId, userId)`
   - `endSession(sessionId)`
   - `getSessionStatus(sessionId)`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Java 17** or higher (`java -version`)
- **Apache Maven 3.8+** (`mvn -version`)

### 2. Build the Project
```bash
cd java-backend
mvn clean compile
```

### 3. Start the SOAP Service Publisher
Run the standalone publisher using Maven:
```bash
mvn exec:java -Dexec.mainClass="com.unimedconnect.publisher.ServicePublisher"
```
Or package and run the JAR:
```bash
mvn clean package
java -cp target/unimedconnect-soap-backend-1.0.0.jar com.unimedconnect.publisher.ServicePublisher
```

The publisher initializes an embedded SQLite database (`unimedconnect.db`) with sample records and publishes all four endpoints on port `8081`.

---

## 🧪 Testing with cURL / HTTP POST

### Testing `StudentService.getStudentById`:
```bash
curl -X POST http://localhost:8081/ws/student \
  -H "Content-Type: text/xml;charset=UTF-8" \
  -H "SOAPAction: \"\"" \
  -d '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stu="http://unimedconnect.com/student">
  <soap:Body>
    <stu:getStudentById>
      <studentId>STU1001</studentId>
    </stu:getStudentById>
  </soap:Body>
</soap:Envelope>'
```

### Testing `HealthcareService.getPatientById`:
```bash
curl -X POST http://localhost:8081/ws/healthcare \
  -H "Content-Type: text/xml;charset=UTF-8" \
  -H "SOAPAction: \"\"" \
  -d '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hc="http://unimedconnect.com/healthcare">
  <soap:Body>
    <hc:getPatientById>
      <patientId>PAT4001</patientId>
    </hc:getPatientById>
  </soap:Body>
</soap:Envelope>'
```

---

## 💻 Running the Java Service Consumers

In a separate terminal, test the standalone Java clients:

### Run University Consumer:
```bash
mvn exec:java -Dexec.mainClass="com.unimedconnect.consumers.UniversityConsumer"
```

### Run Healthcare Consumer:
```bash
mvn exec:java -Dexec.mainClass="com.unimedconnect.consumers.HealthcareConsumer"
```

---

## 🗄️ Database Integration

- Defaults to SQLite (`unimedconnect.db`), seeded automatically from `database.sql`.
- To switch to MySQL, update the JDBC connection string in `src/main/resources/unimedconnect.properties` and import `database.sql` into MySQL Server.
