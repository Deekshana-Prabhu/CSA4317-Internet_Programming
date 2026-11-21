/**
 * RemoteCare M2M Healthcare - Primary Node.js Server
 * Integrates Express REST API, SQLite Persistence, MQTT Ingestion & WebRTC Signaling
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const db = require('./database');
const initMqttHandler = require('./mqtt-handler');
const initSignaling = require('./signaling');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from parent directory
app.use(express.static(path.resolve(__dirname, '..')));

// =============================================================================
// REST API Endpoints
// =============================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'RemoteCare M2M Healthcare Ingestion Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Patients API
app.get('/api/patients', (req, res) => {
  db.getAllPatients((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ patients: rows });
  });
});

app.get('/api/patients/:id', (req, res) => {
  db.getPatientById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Patient not found' });
    res.json({ patient: row });
  });
});

// Devices API
app.get('/api/devices', (req, res) => {
  db.getAllDevices((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ devices: rows });
  });
});

// Telemetry Ingestion API (HTTP REST endpoint for M2M Gateways)
app.post('/api/telemetry', (req, res) => {
  const { device_id, patient_id, sensor_type, reading, unit, protocol } = req.body;

  if (!device_id || !patient_id || reading === undefined) {
    return res.status(400).json({
      error: 'Invalid M2M packet schema. Missing device_id, patient_id, or reading.'
    });
  }

  const packet = {
    device_id,
    patient_id,
    sensor_type: sensor_type || 'Biometric Sensor',
    reading,
    unit: unit || 'Standard',
    protocol: protocol || 'HTTP/HTTPS REST'
  };

  db.insertReading(packet, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });

    // Emit live to WebSocket clients
    io.emit('telemetry:update', packet);

    res.status(201).json({
      ack: 'SUCCESS_201_CREATED',
      reading_id: id,
      server_timestamp: new Date().toISOString()
    });
  });
});

// Fetch Recent Telemetry Readings for Patient
app.get('/api/readings/:patientId', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25;
  db.getRecentReadings(req.params.patientId, limit, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ readings: rows });
  });
});

// Alerts API
app.get('/api/alerts', (req, res) => {
  db.getAllAlerts((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ alerts: rows });
  });
});

// =============================================================================
// Initialize Subsystems
// =============================================================================

// 1. MQTT Telemetry Ingestion Handler
initMqttHandler(io);

// 2. WebRTC P2P Signaling Service
initSignaling(io);

// Start HTTP Server
server.listen(PORT, () => {
  console.log('=================================================================');
  console.log(` RemoteCare Healthcare Server running on http://localhost:${PORT}`);
  console.log(` WebRTC Signaling & Socket.IO active`);
  console.log(` SQLite Database initialized`);
  console.log('=================================================================');
});
