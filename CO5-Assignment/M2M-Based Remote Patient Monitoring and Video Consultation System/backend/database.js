/**
 * RemoteCare M2M Healthcare - Database Service
 * Uses SQLite3 (persisted to remotecare.db or in-memory)
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, 'remotecare.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('[DB Error] Failed to connect to SQLite:', err.message);
  } else {
    console.log('[DB] Connected to SQLite database at:', DB_PATH);
    initSchema();
  }
});

function initSchema() {
  db.serialize(() => {
    // 1. Patients Table
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        location TEXT,
        doctor TEXT,
        condition TEXT,
        monitoring_status TEXT DEFAULT 'normal',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Devices Table
    db.run(`
      CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        model TEXT,
        patient_id TEXT,
        sensor_type TEXT,
        protocol TEXT,
        status TEXT DEFAULT 'connected',
        battery INTEGER DEFAULT 100,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
      )
    `);

    // 3. Telemetry Time-Series Table
    db.run(`
      CREATE TABLE IF NOT EXISTS telemetry_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        sensor_type TEXT NOT NULL,
        reading_value TEXT NOT NULL,
        unit TEXT NOT NULL,
        protocol TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(id),
        FOREIGN KEY (patient_id) REFERENCES patients(id)
      )
    `);

    // 4. Alerts Table
    db.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        alert_type TEXT NOT NULL,
        reading_value TEXT,
        severity TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default patients if table is empty
    db.get('SELECT COUNT(*) as count FROM patients', (err, row) => {
      if (!err && row && row.count === 0) {
        seedInitialData();
      }
    });
  });
}

function seedInitialData() {
  console.log('[DB] Seeding initial demonstration records...');
  const stmtPt = db.prepare(`
    INSERT INTO patients (id, name, age, gender, location, doctor, condition, monitoring_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmtPt.run('P1001', 'James Peterson', 58, 'Male', 'Home Care', 'Dr. Sarah Jenkins', 'Post-CABG Recovery', 'attention');
  stmtPt.run('P1002', 'Eleanor Vance', 64, 'Female', 'Ward B-12', 'Dr. Sarah Jenkins', 'Chronic Hypertension', 'normal');
  stmtPt.run('P1003', 'Marcus Chen', 49, 'Male', 'Cardiac Step-Down', 'Dr. Sarah Jenkins', 'Heart Failure Stage B', 'critical');
  stmtPt.run('P1004', 'Sophia Patel', 38, 'Female', 'Outpatient Tele-Rehab', 'Dr. Sarah Jenkins', 'Type 1 Diabetes', 'normal');
  stmtPt.run('P1005', 'Robert Davis', 72, 'Male', 'Senior Unit 4', 'Dr. Sarah Jenkins', 'COPD with Hypoxemia', 'attention');
  stmtPt.finalize();

  const stmtDev = db.prepare(`
    INSERT INTO devices (id, name, model, patient_id, sensor_type, protocol, status, battery)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmtDev.run('HR001', 'Smart Heart Rate Sensor', 'CardioBeat Pro', 'P1003', 'Heart Rate', 'MQTT v5.0', 'connected', 91);
  stmtDev.run('BP002', 'Digital Blood Pressure Monitor', 'SphygmoLink Edge', 'P1002', 'Blood Pressure', 'CoAP', 'connected', 84);
  stmtDev.run('GM003', 'Smart Glucose Monitor', 'GlucoSense M2M', 'P1004', 'Blood Glucose', 'HTTP REST', 'connected', 78);
  stmtDev.run('WB004', 'Wearable Health Band', 'VitaPulse BioBand 3', 'P1001', 'Wearable Multi-Sensor', 'BLE / MQTT', 'connected', 95);
  stmtDev.run('PO005', 'Smart Pulse Oximeter', 'OxiMesh PulsePro', 'P1005', 'Pulse Oximetry', 'CoAP', 'connected', 88);
  stmtDev.finalize();

  console.log('[DB] Initial seeding completed.');
}

// Data Helper Functions
module.exports = {
  db,
  getAllPatients: (callback) => {
    db.all('SELECT * FROM patients ORDER BY id ASC', callback);
  },
  getPatientById: (id, callback) => {
    db.get('SELECT * FROM patients WHERE id = ?', [id], callback);
  },
  getAllDevices: (callback) => {
    db.all('SELECT * FROM devices ORDER BY id ASC', callback);
  },
  insertReading: (reading, callback) => {
    const query = `
      INSERT INTO telemetry_readings (device_id, patient_id, sensor_type, reading_value, unit, protocol)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [
      reading.device_id,
      reading.patient_id,
      reading.sensor_type,
      reading.reading.toString(),
      reading.unit,
      reading.protocol || 'MQTT'
    ], function(err) {
      if (callback) callback(err, this ? this.lastID : null);
    });
  },
  getRecentReadings: (patientId, limit = 20, callback) => {
    db.all(
      'SELECT * FROM telemetry_readings WHERE patient_id = ? ORDER BY created_at DESC LIMIT ?',
      [patientId, limit],
      callback
    );
  },
  insertAlert: (alert, callback) => {
    const query = `
      INSERT INTO alerts (id, patient_id, device_id, alert_type, reading_value, severity, status, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [
      alert.id,
      alert.patient_id,
      alert.device_id,
      alert.alert_type,
      alert.reading_value,
      alert.severity,
      alert.status || 'active',
      alert.message
    ], callback);
  },
  getAllAlerts: (callback) => {
    db.all('SELECT * FROM alerts ORDER BY created_at DESC', callback);
  }
};
