# RemoteCare – M2M-Based Remote Patient Monitoring and Video Consultation System

> **Connected Care. Anywhere. Anytime.**

RemoteCare is a comprehensive, modern, responsive healthcare web application demonstrating Machine-to-Machine (M2M) communication between medical biosensors, wearable telemetry bands, edge communication gateways, central healthcare servers, and clinical physician workstations.

---

## 🌟 Key Features & Functional Modules

### 1. Healthcare Design & Responsive User Interface
- **Modern Medical Light Theme**: Built with clean white backgrounds, soft ocean blue (`#0284c7`), medical teal (`#0d9488`), and digital purple (`#7c3aed`) accents.
- **Left Sidebar Navigation**: Comprehensive menu grouped into Clinical Telemetry, M2M Architecture, Telehealth & History, and Governance.
- **Responsive Layout**: Designed for seamless operation across desktop workstations, tablets, and mobile devices.

### 2. Role-Based Access Control (RBAC)
- **Doctor Role (Dr. Sarah Jenkins)**:
  - Monitor all assigned patient cohorts.
  - Review real-time vital streams and historical trends.
  - Receive automated threshold alerts and adjust alarm limits.
  - Conduct WebRTC video consultations with live telemetry overlays and clinical notes.
  - Export patient monitoring reports as CSV.
- **Patient Role (James Peterson - #P1001)**:
  - View personal health monitoring dossier and assigned devices.
  - Inspect personal real-time vitals stream.
  - Join scheduled telehealth sessions.
  - Manage personal telehealth data consent toggles.

### 3. Overview Dashboard
- High-level KPI summary cards (Total Registered Patients, Active Connected Devices, Patients Requiring Attention, Consultations Scheduled).
- Live active patient vitals table with color-coded status pills.
- Dynamic health vitals trend line chart (Chart.js) supporting multi-metric selection.
- Recent alerts feed and upcoming consultation schedule.

### 4. Patient Monitoring Management
- Searchable directory of patient records with filters for health status (Normal, Needs Attention, Critical) and device connection state.
- Card view and table view toggling.
- Detailed Patient Vitals Monitor modal showing historical charts, past clinical notes, and quick video consultation shortcuts.
- Working Add, Edit, and Remove patient modal workflows persisted in `localStorage`.

### 5. Connected Medical Devices (M2M Hub)
Interactive device hub featuring 5 real-world medical biosensors:
1. **Smart Heart Rate Sensor (HR001)**: BPM measurement, BLE 5.2 link.
2. **Digital Blood Pressure Monitor (BP002)**: Systolic/Diastolic mmHg, Wi-Fi 802.11ax/CoAP.
3. **Smart Glucose Monitor (GM003)**: mg/dL continuous glycemic measurement, Zigbee/REST.
4. **Wearable Health Band (WB004)**: Multi-sensor photoplethysmography (HR + SpO2 + activity).
5. **Smart Pulse Oximeter (PO005)**: Blood oxygen saturation percentage (SpO2) and pulse.
- Working controls: Connect/Disconnect toggle, restart simulation, battery level, signal strength (RSSI), and protocol inspection.
- Disconnected devices cease updating and raise visible warnings.

### 6. Live Health Readings
- Real-time telemetry number cards with pulsating wave animation indicators for Heart Rate, Blood Pressure, Blood Glucose, SpO2, and Body Temperature.
- Streaming multi-series line chart updating in real time.
- Simulation triggers ("Simulate Tachycardia", "Simulate SpO2 Drop") to test instant threshold detection and alert dispatching.

### 7. M2M Communication Architecture
Interactive 7-stage architectural data flow pipeline:
$$\text{Medical Sensors} \longrightarrow \text{Wearables} \longrightarrow \text{Edge Gateway} \longrightarrow \text{Network} \longrightarrow \text{M2M Server} \longrightarrow \text{Database} \longrightarrow \text{Doctor Application}$$
- Interactive **"Simulate Data Transmission"** button with progressive step-by-step glowing highlights.
- Live transmission event stream terminal logging packet headers, protocols, and latency.

### 8. User-Defined M2M Protocols
- Comparative analysis of MQTT, CoAP, HTTP/HTTPS, and BLE health profiles.
- Protocol Message Studio allowing users to select sensor, enter sample reading, choose transport, generate structured JSON packets with CRC32 checksums, and receive server acknowledgements (ACK 200 OK / MQTT PUBACK).

### 9. Alerts & Notifications Management
- Configurable threshold evaluation engine (Max/Min HR, Max BP, Min SpO2, Max Glucose).
- Filtering by severity (Critical, Requires Review, Info) and status (Active, Under Review, Resolved).
- Interactive "Mark as Reviewed", "Resolve Alert", and "Clear Resolved" actions.
- Real-time notification badge counts updating dynamically in sidebar and header.

### 10. Video Consultation Studio (Telehealth)
- WebRTC camera and microphone preview using browser media APIs (with simulated participant fallback).
- Picture-in-picture (PiP) local stream and remote participant stage.
- Active call duration timer, microphone toggle, camera toggle, speaker mute, and end call controls.
- Interactive side panel tabs:
  - Live consultation chat with automated peer response simulation.
  - Clinical notes notepad saving directly to patient records.
  - Embedded real-time mini-vitals monitor.

### 11. Network Status & Reliability Lab
- Real-time gauges: Simulated Bandwidth, Latency, Packet Loss Rate, Signal Strength (RSSI).
- Preset conditions: 5G/Fiber (Excellent), 4G LTE (Good), 3G Mobile (Moderate), Congested Edge (Poor), and Unstable.
- **Edge Buffering Lab**:
  - "Simulate Network Outage": Simulates severed transport where sensor readings are buffered locally at Edge-GW-01.
  - "Restore & Flush Buffer": Reconnects network and flushes buffered telemetry queue in FIFO order with zero data loss.

### 12. Reports, Analytics & Data Export
- Aggregated health informatics: Total transmissions, delivery success rate, alert distribution doughnut chart, and daily volume bar chart.
- **CSV Data Export**: Generates and downloads a real `.csv` file containing patient vitals and monitoring metrics.
- **Print Layout**: Dedicated `@media print` stylesheet for clinical report generation.

### 13. Privacy, Security & Governance
- Overview of HIPAA & GDPR compliance concepts: AES-256-GCM edge encryption, TLS 1.3 transport security, mutual X.509 device certificates, and role-based access control.
- Patient Consent Manager with interactive toggles for Telemetry Monitoring, Encrypted Cloud Storage, and Video Consultations.
- Immutable security audit log tracking user sessions, device authentications, and role changes.

---

## 📁 File Structure

```
RemoteCare/
│
├── index.html          # Main HTML5 application markup & layout
├── style.css           # Healthcare design system (light theme, animations, print rules)
├── script.js           # Core client application logic, M2M simulation, state engine
│
├── assets/
│   └── images/         # Static graphic assets
│
├── backend/            # Optional Node.js backend
│   ├── package.json    # Backend dependencies (Express, Socket.IO, MQTT, SQLite3)
│   ├── server.js       # Main server, REST API endpoints, static server
│   ├── mqtt-handler.js # M2M MQTT telemetry consumer & threshold alert engine
│   ├── signaling.js    # Multi-user WebRTC P2P signaling service
│   ├── database.js     # SQLite3 database schema & persistence queries
│   └── README.md       # Backend setup and API documentation
│
└── README.md           # Project documentation and user manual
```

---

## ⚡ How to Run

### Method 1: Instant Browser Preview (Zero Installation)
Simply open `index.html` directly in any modern web browser or start a lightweight local web server. No databases, PHP, or compilers are required. All records and simulation states persist in browser `localStorage`.

### Method 2: Optional Node.js Backend & WebRTC Signaling
To run the full backend server with MQTT ingestion and multi-user WebRTC signaling:
```bash
cd backend
npm install
npm start
```
Open `http://localhost:5000` in your browser.
