/**
 * RemoteCare M2M Healthcare - MQTT Ingestion Handler
 * Ingests, validates, and dispatches M2M biosensor payloads
 */

const mqtt = require('mqtt');
const db = require('./database');

function initMqttHandler(io) {
  const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org:1883';
  console.log(`[MQTT] Connecting to M2M Broker: ${brokerUrl}...`);

  let client = null;
  try {
    client = mqtt.connect(brokerUrl, {
      clientId: 'RemoteCare_Healthcare_Ingestion_Server_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 5000
    });

    client.on('connect', () => {
      console.log('[MQTT] Successfully connected to M2M broker.');
      client.subscribe('remotecare/+/+/vitals', (err) => {
        if (!err) {
          console.log('[MQTT] Subscribed to topic: remotecare/+/+/vitals');
        }
      });
      client.subscribe('remotecare/alerts/#');
    });

    client.on('message', (topic, message) => {
      handleIncomingPacket(topic, message, io);
    });

    client.on('error', (err) => {
      console.warn('[MQTT Warning] Broker connection issue:', err.message);
    });

  } catch (e) {
    console.warn('[MQTT] Broker initialization failed, fallback mode active:', e.message);
  }

  return {
    publishReading: (deviceId, patientId, data) => {
      if (client && client.connected) {
        const topic = `remotecare/${patientId}/${deviceId}/vitals`;
        client.publish(topic, JSON.stringify(data), { qos: 1 });
      }
    }
  };
}

function handleIncomingPacket(topic, rawMessage, io) {
  try {
    const payload = JSON.parse(rawMessage.toString());

    // Schema Validation
    if (!payload.device_id || !payload.patient_id || payload.reading === undefined) {
      console.warn('[MQTT Validation Error] Dropped malformed packet:', payload);
      return;
    }

    // Persist into database
    db.insertReading(payload, (err, readingId) => {
      if (err) {
        console.error('[DB Error] Failed to persist reading:', err);
      } else {
        console.log(`[M2M Ingested] ${payload.device_id} -> Pt ${payload.patient_id} [${payload.sensor_type}: ${payload.reading} ${payload.unit}]`);
      }
    });

    // Real-time broadcast to connected clients via Socket.IO
    if (io) {
      io.emit('telemetry:update', payload);

      // Check clinical alert criteria
      checkAlertThresholds(payload, io);
    }

  } catch (err) {
    console.error('[MQTT Error] Failed to parse message JSON:', err.message);
  }
}

function checkAlertThresholds(payload, io) {
  const val = typeof payload.reading === 'number' ? payload.reading : parseFloat(payload.reading);
  let alertObj = null;

  if (payload.sensor_type === 'Heart Rate' && val > 100) {
    alertObj = {
      id: 'ALT-' + Math.floor(Math.random() * 90000 + 10000),
      patient_id: payload.patient_id,
      device_id: payload.device_id,
      alert_type: 'Tachycardia Event',
      reading_value: `${val} ${payload.unit || 'BPM'}`,
      severity: 'critical',
      message: `Heart rate (${val} BPM) exceeded safety threshold.`
    };
  } else if (payload.sensor_type === 'Pulse Oximeter' && val < 94) {
    alertObj = {
      id: 'ALT-' + Math.floor(Math.random() * 90000 + 10000),
      patient_id: payload.patient_id,
      device_id: payload.device_id,
      alert_type: 'Low SpO2 Desaturation',
      reading_value: `${val}%`,
      severity: 'warning',
      message: `Oxygen saturation dropped to ${val}%.`
    };
  }

  if (alertObj) {
    db.insertAlert(alertObj, () => {
      console.log('[Alert Engine] Dispatched alert:', alertObj.alert_type);
      io.emit('alert:new', alertObj);
    });
  }
}

module.exports = initMqttHandler;
