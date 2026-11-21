# MediConnect – Database-Driven Smart Healthcare Management System Using Java Web Services

> **Tagline:** "Connected Care. Smarter Healthcare."  
> **Architecture:** Multi-Tier Healthcare Distributed System (SOAP 1.1 / JAX-WS, MySQL 8.0, JDBC PreparedStatement, Modern Web UI)

---

## 🏥 Executive Overview

**MediConnect** is an enterprise-grade centralized healthcare management platform designed to unify disparate hospital operations. It seamlessly connects doctors, diagnostic laboratories, inpatient wards, outpatient clinics, and pharmacies through **SOAP-based Java Web Services** powered by a centralized relational **MySQL database** (`medic_connect_db`).

The platform incorporates **TWO distinct implementation modes**:

1. **Browser Preview Mode (Zero-Configuration Instant Demonstration):**
   * Built with responsive modern HTML5, clean CSS3, and JavaScript utilizing browser `localStorage`.
   * Displays all 13 interactive healthcare management modules directly inside any web browser without needing Java or MySQL servers installed.
   * Features a live interactive **SOAP Message Explorer**, **WSDL Contract Viewer**, **Live SOAP Service Testing Console**, and **Interactive SQL Query Simulator**.

2. **Actual Java Backend Mode (Enterprise Production Execution):**
   * Built with standard Jakarta XML Web Services (**JAX-WS RI 4.0** / Java 17+ compatible) and **MySQL Connector/J**.
   * Implements secure database communication via **JDBC `PreparedStatement`** (protecting against SQL injection attacks).
   * Fully publishes an embedded HTTP SOAP endpoint at `http://localhost:8080/ws/healthcare` with matching contract `HealthcareInformationService.wsdl`.
   * Includes a standalone Java consumer client demonstrating external application interoperability.

---

## 📂 Project Structure

```text
MediConnect/
│
├── index.html                           # Single-Page Application with 13 functional sections
├── style.css                            # Medical theme styles (Sky Blue, Teal & Soft Purple accents)
├── script.js                            # Interactive client engine, SOAP simulator & data store
├── README.md                            # Complete technical documentation & execution guide
│
└── java-backend/                        # Standalone Java SOAP Web Service & MySQL Backend
    ├── pom.xml                          # Maven build configuration with JAX-WS RI & MySQL driver
    ├── database.sql                     # Complete MySQL database creation script with 12+ seed records
    ├── db.properties.example            # Template for JDBC connection & credentials configuration
    ├── HealthcareInformationService.wsdl# Formal WSDL 1.1 Document/Literal contract
    │
    ├── Patient.java                     # Patient entity model with JAXB annotations
    ├── Doctor.java                      # Doctor entity model with JAXB annotations
    ├── Appointment.java                 # Clinical appointment entity model
    ├── LaboratoryReport.java            # Diagnostic pathology report entity model
    ├── PharmacyItem.java                # Hospital formulary inventory entity model
    ├── DatabaseConnection.java          # Reusable thread-safe JDBC connection manager
    ├── HealthcareInformationService.java# JAX-WS Service Endpoint Interface (SEI)
    ├── HealthcareInformationServiceImpl.java # Service Implementation Bean (SIB) with JDBC queries
    ├── HealthcareServicePublisher.java  # Standalone HTTP server publishing SOAP endpoint
    ├── HealthcareServiceConsumer.java   # External client consuming SOAP operations via WSDL
    │
    └── src/main/java/com/mediconnect/   # Standard Maven package directory structure
        ├── model/                       # Patient, Doctor, Appointment, LaboratoryReport, PharmacyItem, HealthcareFault
        ├── util/                        # DatabaseConnection
        ├── service/                     # HealthcareInformationService, HealthcareInformationServiceImpl, HealthcareServiceException
        ├── publisher/                   # HealthcareServicePublisher
        └── consumer/                    # HealthcareServiceConsumer
```

---

## 🏛️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                        TIER 1: HEALTHCARE CONSUMERS                               |
|   +---------------+   +------------------+   +-----------------+   +------------+ |
|   |  Doctor App   |   |  Laboratory App  |   |  Patient Portal |   |  Pharmacy  | |
|   +-------+-------+   +--------+---------+   +--------+--------+   +-----+------+ |
+-----------|--------------------|----------------------|------------------|--------+
            |                    |                      |                  |
            +--------------------+----------+-----------+------------------+
                                            |
                                            v (SOAP 1.1 over HTTP POST)
+-----------------------------------------------------------------------------------+
|               TIER 2: SOAP-BASED JAVA WEB SERVICE LAYER (PROVIDER)                |
|   - JAX-WS HTTP Endpoint: http://localhost:8080/ws/healthcare                     |
|   - WSDL Contract: HealthcareInformationService.wsdl                              |
|   - Operations: getPatientById, getLaboratoryReports, getAppointments, ...       |
|   - Service Implementation Bean: HealthcareInformationServiceImpl                |
+-------------------------------------------+---------------------------------------+
                                            |
                                            v (JDBC API / com.mysql.cj.jdbc.Driver)
+-----------------------------------------------------------------------------------+
|               TIER 3: JDBC DATABASE CONNECTIVITY LAYER                            |
|   - DatabaseConnection.java (Secure credential loading & Connection Pool)         |
|   - Parameterized java.sql.PreparedStatement (SQL Injection Prevention)           |
|   - java.sql.ResultSet to Model POJO Transformation                              |
+-------------------------------------------+---------------------------------------+
                                            |
                                            v (TCP Port 3306)
+-----------------------------------------------------------------------------------+
|               TIER 4: CENTRALIZED MYSQL DATABASE (medic_connect_db)               |
|   +------------+  +-----------+  +--------------+  +--------------------+  +----+ |
|   |  patients  |  |  doctors  |  | appointments |  | laboratory_reports |  | ...| |
|   +------------+  +-----------+  +--------------+  +--------------------+  +----+ |
+-----------------------------------------------------------------------------------+
```

---

## 📋 Implemented SOAP Web Service Operations

| Operation Name | Input Parameter | Return Type | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **`getPatientById`** | `String patientId` | `Patient` | Retrieves complete patient demographic details, emergency contact, attending doctor, and clinical department. |
| **`getLaboratoryReports`** | `String patientId` | `List<LaboratoryReport>` | Returns all diagnostic pathology observations, laboratory names, reference intervals, and analytical statuses for the patient. |
| **`getAppointments`** | `String patientId` | `List<Appointment>` | Returns all scheduled clinical doctor appointments, appointment status (Confirmed, Pending, etc.), and clinical notes. |
| **`getAllPatients`** | *None (void)* | `List<Patient>` | Returns the complete hospital patient directory for administrative synchronization. |

---

## 🗄️ MySQL Database Schema (`medic_connect_db`)

The database script `java-backend/database.sql` initializes the following tables:

1. **`doctors`**: Physician registry (`doctor_id` PK, `doctor_name`, `specialization`, `department`, `availability`, `contact_email`, `contact_phone`, `room_no`).
2. **`patients`**: Centralized patient master record (`patient_id` PK, `patient_name`, `age`, `gender`, `blood_group`, `mobile`, `email`, `address`, `doctor_id` FK, `department`).
3. **`appointments`**: Clinical consultation scheduling (`appointment_id` PK, `patient_id` FK, `doctor_id` FK, `appointment_date`, `appointment_time`, `appointment_status`, `notes`).
4. **`laboratory_reports`**: Diagnostic tests and pathology (`report_id` PK, `patient_id` FK, `test_name`, `test_date`, `laboratory_name`, `test_result`, `reference_range`, `report_status`).
5. **`pharmacy`**: Hospital medication formulary (`medicine_id` PK, `medicine_name`, `category`, `available_stock`, `prescription_status`, `unit_price`, `manufacturer`, `expiry_date`).

---

## ✉️ SOAP Message Structure Breakdown

SOAP (Simple Object Access Protocol) utilizes four core XML elements:

1. **`<soapenv:Envelope>`**: The mandatory root element that envelops the entire XML document, defining XML namespaces and protocol versions.
2. **`<soapenv:Header>`**: An optional element containing metadata such as WS-Security authentication tokens and routing headers.
3. **`<soapenv:Body>`**: The mandatory element containing the actual payload—either the web method request parameters or the web service response.
4. **`<soapenv:Fault>`**: A standardized error-reporting element generated inside the Body when an operation fails (e.g., when an invalid Patient ID is queried).

### Example SOAP Request (`getPatientById`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getPatientById>
            <patientId>PAT-1001</patientId>
        </ser:getPatientById>
    </soapenv:Body>
</soapenv:Envelope>
```

### Example SOAP Response (`getPatientByIdResponse`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <ser:getPatientByIdResponse>
            <patient>
                <patientId>PAT-1001</patientId>
                <patientName>Arthur Pendelton</patientName>
                <age>58</age>
                <gender>Male</gender>
                <bloodGroup>O+</bloodGroup>
                <mobile>+1 (555) 019-2831</mobile>
                <email>arthur.p@example.com</email>
                <address>742 Evergreen Terrace, Springfield</address>
                <doctorName>Dr. Sarah Mitchell</doctorName>
                <department>Cardiology</department>
            </patient>
        </ser:getPatientByIdResponse>
    </soapenv:Body>
</soapenv:Envelope>
```

### Example SOAP Fault Response (Invalid Patient ID `PAT-9999`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>soapenv:Client</faultcode>
            <faultstring>Patient Not Found: No healthcare record exists for ID PAT-9999</faultstring>
            <detail>
                <ser:HealthcareFault>
                    <errorCode>ERR-RECORD-NOT-FOUND</errorCode>
                    <errorMessage>Patient with ID 'PAT-9999' does not exist in medic_connect_db.</errorMessage>
                    <details>Verify patient identification number in registry.</details>
                    <timestamp>2026-11-21T10:45:00.124</timestamp>
                </ser:HealthcareFault>
            </detail>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>
```

---

## 🚀 Execution Instructions

### 1. Running Browser Preview Mode (Immediate Demonstration)

No server installation required. Simply open `index.html` in any modern web browser or start a lightweight local web server:

```powershell
# Using Node.js built-in server or npx http-server
npx http-server . -p 3000 -c-1
```
Then navigate to `http://localhost:3000` to interact with:
* Dashboard analytics & Chart.js visualizations
* Patient Records management with modal forms
* Appointment booking & status transitions
* Diagnostic Laboratory pathology reports & printable slips
* Interactive SOAP Message Explorer & WSDL contract viewer
* Live Service Testing Console with real-time XML serialization
* Database Inspector & SQL query runner

---

### 2. Running Actual Java Backend Mode (Later Execution)

#### Prerequisites:
* **Java Development Kit (JDK 17 or higher)**
* **Apache Maven 3.8+**
* **MySQL Community Server 8.0+**

#### Step 1: Initialize MySQL Database
Open MySQL Workbench or your terminal command line:
```bash
mysql -u root -p < java-backend/database.sql
```

#### Step 2: Configure Database Credentials
Create `db.properties` from the example template:
```bash
cp java-backend/db.properties.example java-backend/src/main/resources/db.properties
```
Edit `db.properties` to specify your MySQL user and password:
```properties
db.url=jdbc:mysql://localhost:3306/medic_connect_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
db.driver=com.mysql.cj.jdbc.Driver
db.user=root
db.password=YourActualPasswordHere
```

#### Step 3: Build & Compile the Java Project
Navigate to the `java-backend` folder:
```bash
cd java-backend
mvn clean compile
```

#### Step 4: Publish the SOAP Web Service
Start the embedded JAX-WS HTTP Publisher:
```bash
mvn exec:java@publisher
```
You will see output verifying:
```text
[✓] MySQL Database connectivity verified successfully.
[*] Publishing SOAP Service Endpoint at: http://0.0.0.0:8080/ws/healthcare
[✓] SOAP Web Service published and listening successfully!
  • Service Endpoint:   http://localhost:8080/ws/healthcare
  • WSDL Contract URL:  http://localhost:8080/ws/healthcare?wsdl
```

#### Step 5: Execute the SOAP Client Consumer
In a separate terminal, run the demonstration consumer client:
```bash
mvn exec:java@consumer
```
The client will connect to `http://localhost:8080/ws/healthcare?wsdl`, invoke all 4 operations, print formatted patient demographics, laboratory reports, and demonstrate proper catching of SOAP Faults when testing `PAT-9999`!

---

## 🔒 Security Best Practices Implemented

* **Parameterized Queries (`PreparedStatement`):** All SQL executions bind variables with `?` parameters, completely eliminating SQL injection vectors.
* **Externalized Secrets:** Database passwords and endpoints are loaded from `db.properties` or system environment variables rather than hardcoded in source files.
* **Referential Integrity:** Foreign keys with `ON DELETE CASCADE` or `ON DELETE SET NULL` protect against orphaned appointments and lost diagnostic records.
* **Structured SOAP Faults:** Detailed exception beans with timestamps and error codes provide standard WS-I compliant diagnostics without exposing internal stack traces.

---

## 📄 License & Attribution
MediConnect Smart Healthcare Management System – Developed with Google DeepMind Antigravity.
All demonstration clinical and patient records are fictional and intended solely for educational demonstration purposes.
