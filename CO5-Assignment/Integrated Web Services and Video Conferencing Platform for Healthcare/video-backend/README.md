# UniMed Connect - WebRTC Video Signaling Backend

This module provides the real-time WebSocket signaling backend for peer-to-peer WebRTC video conferencing between students, teachers, patients, and doctors.

---

## 🎯 Features

- **Socket.IO Real-Time Signaling**:
  - Room management (`join-room`, `leave-room`)
  - SDP Offer & Answer exchange
  - Interactive ICE Candidates relay
  - Automatic disconnection handling and peer notification
- **REST Telemetry Endpoints**:
  - `GET /health`: Service health and active room count
  - `GET /api/rooms`: List of all currently active video rooms
  - `GET /api/rooms/:roomId`: Details and participants in a specific room

---

## 🚀 Running the Signaling Server

### 1. Prerequisites
- **Node.js 18+** installed

### 2. Install Dependencies
```bash
cd video-backend
npm install
```

### 3. Start the Server
```bash
npm start
```
The server will run on `http://localhost:5000`.

---

## 🌐 WebRTC Architectural Flow

```
[Peer A (Doctor / Teacher)]            [Signaling Server (Port 5000)]            [Peer B (Patient / Student)]
            |                                       |                                         |
            |-------- join-room(roomId) ----------->|                                         |
            |                                       |<-------- join-room(roomId) -------------|
            |                                       |                                         |
            |<------- user-connected (Peer B) ------|                                         |
            |                                       |                                         |
            |--- offer (SDP) ---------------------->|                                         |
            |                                       |--- offer (SDP) ------------------------>|
            |                                       |                                         |
            |                                       |<-- answer (SDP) ------------------------|
            |<-- answer (SDP) ----------------------|                                         |
            |                                       |                                         |
            |<==== ICE Candidates Exchange (Relayed via Socket.IO) ==========================>|
            |                                                                                 |
            +================== Direct P2P WebRTC Media Stream ===============================+
```

> **Note on Browser Preview**: The main UniMed Connect web application includes a built-in media preview using browser webcam APIs and simulated media streams, enabling complete local testing and demonstration without requiring this signaling server to be running.
