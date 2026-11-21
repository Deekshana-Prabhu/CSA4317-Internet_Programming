# Smart Campus – Integrated Management System Using Java Web Services
> **"One Campus. One Connected System."**

A centralized, enterprise-grade university management platform that connects departmental applications (Student Admission, Attendance, Examination, Library, and Fee Management) through standard **Java SOAP Web Services (JAX-WS / Jakarta XML Web Services)**.

---

## 🌟 Key Highlights

1. **Instant Interactive Browser Preview:**
   - Designed for live demonstration in the Antigravity preview without needing a local Java runtime installed.
   - Includes real-time simulated SOAP client, live WSDL viewer, departmental simulators, dynamic charts, student CRUD, and web services architecture visualizer.
2. **Production-Ready Java Backend:**
   - Complete Jakarta XML Web Services (JAX-WS 4.x) implementation compatible with modern Java (17, 21+).
   - Service Endpoint Interface (SEI) & Service Implementation Bean (SIB).
   - Embedded standalone publisher using `Endpoint.publish()`.
   - Dynamic departmental client consumer using `Service.create()`.
   - Comprehensive WSDL 1.1 specification document.

---

## 🏗️ System Architecture

The Smart Campus architecture is built upon the **Service-Oriented Architecture (SOA)** triangle:

```
                  +-----------------------------------+
                  |      CENTRAL SERVICE REGISTRY     |
                  | (Directory of Campus Web Services)|
                  +-----------------+-----------------+
                                    ^
                 1. Publish WSDL    |   2. Find / Discover Service
                                    |
+-----------------------------------+-----------------------------------+
| SERVICE PROVIDER                  |               SERVICE CONSUMERS   |
| StudentInformationService         |               (Department Apps)   |
| (JAX-WS SIB on port 8888)         |                                   |
|                                   |  • Admission Management App       |
| Endpoints:                        |  • Attendance Management App      |
| • http://localhost:8888/ws/student|  • Examination Records App        |
| • ?wsdl                           |  • Library Management App         |
|                                   |  • Fee Management App             |
|                                   |                                   |
|               3. SOAP 1.1 / HTTP Request / Response (Bind & Invoke)   |
|               <====================================================>  |
+-----------------------------------------------------------------------+
```

### Components:
1. **Service Provider (`StudentInformationServiceImpl`):**
   - Owns and protects authoritative student identity records.
   - Publishes endpoint using standard Jakarta Web Services.
2. **Service Registry:**
   - Catalogs available services, endpoints, operations, and WSDL contracts.
3. **Service Consumers (`StudentServiceConsumer`):**
   - Departmental applications that bind to the provider using the published WSDL to look up student profiles, prevent duplicate data entry, and sync academic records.

---

## 📂 Project Directory Structure

```
SmartCampus/
├── index.html                   # Interactive Single-Page Application (Antigravity Browser Preview)
├── style.css                    # Modern UI styles (White bg, blue, purple, teal accents)
├── script.js                    # SPA router, data store, SOAP simulator, Chart.js logic
├── README.md                    # Project documentation & run guide
└── java-backend/                # Actual Java Web Services Source Code
    ├── pom.xml                  # Maven configuration (Jakarta XML WS 4.x / Java 17+)
    ├── StudentInformationService.wsdl # Standard WSDL 1.1 definition
    └── src/
        └── main/
            ├── java/com/smartcampus/
            │   ├── model/
            │   │   └── Student.java                     # JAXB XML Model Entity
            │   ├── exception/
            │   │   └── StudentNotFoundException.java     # @WebFault SOAP Exception
            │   ├── service/
            │   │   ├── StudentInformationService.java     # Service Endpoint Interface (SEI)
            │   │   └── StudentInformationServiceImpl.java # Service Implementation Bean (SIB)
            │   ├── publisher/
            │   │   └── StudentServicePublisher.java      # Standalone Endpoint Publisher
            │   └── consumer/
            │       └── StudentServiceConsumer.java       # Departmental SOAP Consumer
            └── resources/
                └── StudentInformationService.wsdl        # Packaged WSDL document
```

---

## 🚀 Running the Project

### Option 1: Live Browser Preview (Instant)
Simply open `index.html` directly in the browser or Antigravity browser preview.
- Navigate all 13 sections via the left sidebar.
- Test SOAP requests (`getStudentById`, `getAllStudents`, SOAP faults).
- Inspect the live WSDL with element-by-element explanations.
- Add and edit student records.
- Run inter-departmental integration simulations.

### Option 2: Running the Real Java Backend

#### Prerequisites:
- Java JDK 17 or higher
- Apache Maven 3.8+

#### 1. Compile the Java Project:
```bash
cd java-backend
mvn clean compile
```

#### 2. Start the SOAP Service Publisher:
```bash
mvn exec:java@run-publisher
```
Console output:
```
[SUCCESS] StudentInformationService is LIVE and ready for requests!
>> Service Endpoint:  http://localhost:8888/ws/student
>> WSDL Definition:   http://localhost:8888/ws/student?wsdl
```

#### 3. Test with a Browser or cURL:
Access the WSDL in any browser:
```
http://localhost:8888/ws/student?wsdl
```
Or execute a sample SOAP request via `curl`:
```bash
curl -X POST http://localhost:8888/ws/student \
  -H "Content-Type: text/xml; charset=utf-8" \
  -H "SOAPAction: \"http://service.smartcampus.com/getStudentById\"" \
  -d "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.smartcampus.com/\"><soapenv:Body><ser:getStudentById><studentId>STU-1001</studentId></ser:getStudentById></soapenv:Body></soapenv:Envelope>"
```

#### 4. Run the Java Service Consumer:
Open a second terminal window:
```bash
cd java-backend
mvn exec:java@run-consumer
```
Output:
```
[CONSUMER] Connected to Service WSDL at: http://localhost:8888/ws/student?wsdl
[RESPONSE] Received Student Details: Aarav Sharma | Computer Science | 3rd Year
[SUCCESS] Attendance Department: Student verified! Class attendance marked: 89.2%
```

---

## 🛡️ Advantages of Java Web Services in Universities

- **Heterogeneous Interoperability:** Enables legacy departmental databases (C++, .NET, PHP) to query central Java university services via standard XML/SOAP.
- **Centralized Data Integrity:** Changes to student contact info, department transfers, or graduation status propagate instantaneously campus-wide.
- **Decoupled Architecture:** Each department manages its own business logic independently while agreeing on a standardized WSDL contract.
- **Enterprise Security & Reliability:** Easily extendable with WS-Security, WS-Addressing, and TLS/HTTPS transport encryption.
