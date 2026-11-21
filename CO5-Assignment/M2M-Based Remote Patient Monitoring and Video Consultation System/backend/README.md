# RemoteCare – Backend Ingestion & WebRTC Signaling Service

This directory contains the optional Node.js backend implementation for the **RemoteCare** M2M-based remote patient monitoring and telehealth consultation platform.

---

## 🌟 Key Architecture & Capabilities

1. **REST API (Express.js)**:
   - `/api/patients`: Retrieval and CRUD for patient cohorts.
   - `/api/devices`: Status, battery levels, and telemetry metadata for M2M medical devices.
   - `/api/telemetry`: High-throughput HTTP ingestion endpoint for edge gateways.
   - `/api/readings/:patientId`: Historical time-series telemetry querying.
   - `/api/alerts`: Real-time threshold breach notifications.

2. **M2M Ingestion & MQTT Message Handler (`mqtt-handler.js`)**:
   - Subscribes to `remotecare/+/+/vitals` and processes real-time sensor streams.
   - Validates incoming JSON schemas and calculates CRC parity.
   - Triggers automated threshold alerts (e.g., Tachycardia events > 100 BPM, Hypoxemia < 94%).
   - Dispatches live telemetry events via Socket.IO.

3. **Multi-User WebRTC P2P Signaling Server (`signaling.js`)**:
   - Supports room creation and peer discovery via consultation room IDs (`#RC-7821`).
   - Exchanges WebRTC SDP offers and answers.
   - Relays network ICE candidates between doctor and patient browsers.
   - Synchronizes consultation chat and call disconnections.

4. **Persistence Layer (`database.js`)**:
   - SQLite3 database storing patients, registered devices, alerts, and time-series telemetry.

---

## 🚀 How to Run the Backend

### 1. Prerequisites
- Node.js (v16.x or higher)
- npm or pnpm

### 2. Installation
Navigate to this directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Start the Server
```bash
npm start
```
The server will boot on `http://localhost:5000` and automatically serve the complete frontend as well.

### 4. Configuration (Optional `.env`)
You can create a `.env` file in the `backend/` directory with custom configurations:
```env
PORT=5000
DB_PATH=./remotecare.db
MQTT_BROKER_URL=mqtt://test.mosquitto.org:1883
```
