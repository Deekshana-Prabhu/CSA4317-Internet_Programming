# UniMed Connect – Integrated Web Services and Video Conferencing Platform for Healthcare and E-Learning

> **Tagline**: *One Platform. Connected Learning. Connected Care.*

UniMed Connect is a modern, responsive web application that unites university academic services, healthcare systems, database-driven applications, and multimedia communication through Java SOAP Web Services and WebRTC.

---

## 🌟 Key Capabilities & Features

1. **Role-Based Demo Management**:
   - Immediate one-click testing as **Student**, **Teacher**, **Doctor**, **Patient**, or **Administrator**.
   - Zero-backend browser mode powered by simulated services and persistent `localStorage`.

2. **Student Information Services**:
   - Student academic directory, attendance percentage visualization, GPA results, course enrollment, and search filters.
   - Interactive profile modal with grade details and direct simulated SOAP call triggers.

3. **Healthcare Services**:
   - Electronic Health Record (EHR) directory with medical departments, condition monitoring, patient profiles, and medical vitals.
   - Doctor directory with specialties, consultation fees, and appointment scheduling.

4. **Online Classroom Studio**:
   - Live collaborative classroom with simulated lecture canvas stream, real-time timer, student participant list, and an interactive chat box with simulated responses.
   - Teacher mode for scheduling and conducting sessions.

5. **Doctor Telehealth Consultation**:
   - Dual-tile consultation view: Doctor specialist stream and Patient stream (with real webcam preview support via `navigator.mediaDevices.getUserMedia` and smooth avatar fallback).
   - Real-time call controls (Mute, Camera toggle, End call), live consultation chat, and EHR clinical notes editor.

6. **Interactive System Architecture**:
   - Clear architectural diagram demonstrating communication between Student App, Healthcare App, Java SOAP Web Services, WSDL Service Directory, Relational Databases (JDBC), and Multimedia Video Servers.
   - Clickable nodes with a live Component Inspector and automated Data Flow Tracing.

7. **Java Web Service Center & Dynamic Registry**:
   - Service cards for `StudentService`, `HealthcareService`, `ClassroomService`, and `VideoSessionService`.
   - Dynamic service publishing demo into the local registry.

8. **WSDL Document Explorer**:
   - Inspects WSDL elements: `<definitions>`, `<types>`, `<message>`, `<portType>`, `<binding>`, `<service>`, and `<port>`.
   - Visual operation explorer generating live sample SOAP Request and Response XML.
   - Syntax-highlighted XML viewer with one-click copy.

9. **SOAP Request and Response Tester**:
   - Interactive SOAP client with editable XML envelopes, parameter builders, real-time delay simulation, HTTP status badges, and transaction history logging.

10. **UniMed Communication Protocol (UCP v1.0)**:
    - User-defined 12-field protocol schema harmonizing data exchange between academic and clinical systems.
    - Protocol message builder, strict JSON validator, and acknowledgement (ACK) delivery receipt.

11. **Video Streaming & Buffer Optimizer**:
    - Real-time dynamic playback buffer gauge (0 - 100%) that fills and drains based on network conditions.
    - Network simulator presets (Excellent, Good, Moderate, Poor, Unstable) with bandwidth, latency, and packet loss sliders.
    - Adaptive Bitrate (ABR) engine switching between 1080p, 720p, 480p, 360p, and 240p.
    - Comparison between WITH OPTIMIZATION and WITHOUT OPTIMIZATION.

12. **Bandwidth Prioritizer & Traffic Allocator**:
    - Simulates simultaneous online classroom and critical telehealth consultations.
    - Guaranteed Quality of Service (QoS) for medical consultations over standard traffic.

13. **Network Performance Monitor**:
    - Live Chart.js telemetry charts for latency and packet loss.
    - Network failure simulation with buffer alarms and instant recovery controls.

14. **Reports & Analytics**:
    - KPI summaries, invocation charts, and downloadable CSV transaction exports.

---

## 📁 Project File Structure

```
UniMedConnect/
├── index.html                      # Main responsive single-page web application
├── style.css                       # Modern stylesheet with university/hospital branding
├── script.js                       # Frontend state, SOAP engine simulation, WebRTC logic
├── assets/                         # Static images and icons
│   └── images/
│
├── java-backend/                   # Production Java SOAP Backend (JAX-WS & JDBC)
│   ├── pom.xml                     # Maven project configuration
│   ├── database.sql                # Complete relational schema and seed records
│   ├── README.md                   # Backend deployment instructions
│   └── src/main/java/com/unimedconnect/
│       ├── database/               # SQLite & MySQL DatabaseManager
│       ├── student/                # StudentService SEI & Impl
│       ├── healthcare/             # HealthcareService SEI & Impl
│       ├── classroom/              # ClassroomService SEI & Impl
│       ├── video/                  # VideoSessionService SEI & Impl
│       ├── publisher/              # Standalone ServicePublisher (Endpoint.publish)
│       └── consumers/              # Standalone Java SOAP client consumers
│
├── video-backend/                  # Real-Time WebRTC Video Signaling Backend
│   ├── package.json                # Express & Socket.IO dependencies
│   ├── server.js                   # WebSocket signaling server (Port 5000)
│   └── README.md                   # Video server instructions
│
└── README.md                       # Platform documentation
```

---

## 🚀 How to Run the Platform

### 1. Browser Preview (Zero Setup)
The application is pre-configured to run directly in any modern browser without requiring servers:
- Simply open `index.html` in your browser (or in the Antigravity browser preview).
- All student records, patient records, SOAP requests, WSDL exploration, UCP messaging, video streaming, and buffer optimizations work immediately out of the box using client-side simulation and `localStorage`.

### 2. Running the Java SOAP Backend (Optional)
If you wish to run the real Java JAX-WS SOAP server:
```bash
cd java-backend
mvn clean compile
mvn exec:java -Dexec.mainClass="com.unimedconnect.publisher.ServicePublisher"
```
The server publishes all four endpoints on port `8081`:
- `StudentService`: `http://localhost:8081/ws/student?wsdl`
- `HealthcareService`: `http://localhost:8081/ws/healthcare?wsdl`
- `ClassroomService`: `http://localhost:8081/ws/classroom?wsdl`
- `VideoSessionService`: `http://localhost:8081/ws/video?wsdl`

Test the Java consumers in a separate terminal:
```bash
mvn exec:java -Dexec.mainClass="com.unimedconnect.consumers.UniversityConsumer"
mvn exec:java -Dexec.mainClass="com.unimedconnect.consumers.HealthcareConsumer"
```

### 3. Running the WebRTC Video Signaling Server (Optional)
To run the Node.js signaling server for real two-device peer-to-peer video conferencing:
```bash
cd video-backend
npm install
npm start
```
The server will run on `http://localhost:5000`.

---

## 🛡️ Educational Compliance
- Built with standard web technologies (HTML5, CSS3, JavaScript, Chart.js, Lucide icons).
- Contains strictly fictional sample data for all student and medical records.
- Clearly distinguishes browser preview simulation from live JAX-WS backend execution.
