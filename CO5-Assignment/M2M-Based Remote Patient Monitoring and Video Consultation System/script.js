/**
 * RemoteCare – M2M Remote Patient Monitoring & Video Consultation System
 * Client-Side Application Core Engine
 * All Rights Reserved - Demo Simulation Platform
 */

// =============================================================================
// 1. Initial State & Seed Data Generation
// =============================================================================

const STORAGE_KEY = 'remotecare_state_v1';

const INITIAL_PATIENTS = [
  {
    id: 'P1001',
    name: 'James Peterson',
    age: 58,
    gender: 'Male',
    location: 'Residence (Home Monitor)',
    doctor: 'Dr. Sarah Jenkins',
    condition: 'Post-CABG Recovery & Arrhythmia',
    monitoringStatus: 'attention', // 'normal' | 'attention' | 'critical'
    deviceStatus: 'connected',
    deviceId: 'WB004',
    vitals: {
      heartRate: 88,
      systolic: 132,
      diastolic: 84,
      glucose: 110,
      spO2: 96,
      temp: 36.8
    },
    lastUpdated: 'Just now',
    history: [
      { date: '2026-11-15', heartRate: 74, bp: '120/80', glucose: 104, spO2: 98, temp: 36.6, note: 'Routine morning checkup' },
      { date: '2026-11-16', heartRate: 76, bp: '122/82', glucose: 108, spO2: 97, temp: 36.7, note: 'Mild post-exercise elevation' },
      { date: '2026-11-17', heartRate: 80, bp: '126/82', glucose: 106, spO2: 97, temp: 36.7, note: 'Stable telemetry report' },
      { date: '2026-11-18', heartRate: 72, bp: '118/78', glucose: 102, spO2: 99, temp: 36.6, note: 'Vitals optimal' },
      { date: '2026-11-19', heartRate: 84, bp: '130/84', glucose: 112, spO2: 96, temp: 36.8, note: 'Medication titration' },
      { date: '2026-11-20', heartRate: 88, bp: '132/84', glucose: 110, spO2: 96, temp: 36.8, note: 'Minor tachycardia episode' }
    ],
    consultations: [
      { date: '2026-11-10', doctor: 'Dr. Sarah Jenkins', notes: 'Patient recovering well. Adjusted beta-blocker dosage.' }
    ]
  },
  {
    id: 'P1002',
    name: 'Eleanor Vance',
    age: 64,
    gender: 'Female',
    location: 'Home Ward B-12',
    doctor: 'Dr. Sarah Jenkins',
    condition: 'Chronic Hypertension & T2D',
    monitoringStatus: 'normal',
    deviceStatus: 'connected',
    deviceId: 'BP002',
    vitals: {
      heartRate: 72,
      systolic: 122,
      diastolic: 80,
      glucose: 118,
      spO2: 98,
      temp: 36.7
    },
    lastUpdated: '1 min ago',
    history: [
      { date: '2026-11-15', heartRate: 70, bp: '124/82', glucose: 120, spO2: 98, temp: 36.7, note: 'Stable BP' },
      { date: '2026-11-17', heartRate: 74, bp: '122/80', glucose: 116, spO2: 98, temp: 36.7, note: 'Fasting glucose compliant' },
      { date: '2026-11-19', heartRate: 72, bp: '120/78', glucose: 114, spO2: 99, temp: 36.6, note: 'Dietary intake reviewed' }
    ],
    consultations: [
      { date: '2026-11-04', doctor: 'Dr. Sarah Jenkins', notes: 'Blood pressure well-controlled with ACE inhibitors.' }
    ]
  },
  {
    id: 'P1003',
    name: 'Marcus Chen',
    age: 49,
    gender: 'Male',
    location: 'Cardiac Step-Down Ward',
    doctor: 'Dr. Sarah Jenkins',
    condition: 'Heart Failure Stage B (NYHA II)',
    monitoringStatus: 'critical',
    deviceStatus: 'connected',
    deviceId: 'HR001',
    vitals: {
      heartRate: 106,
      systolic: 142,
      diastolic: 92,
      glucose: 124,
      spO2: 93,
      temp: 37.1
    },
    lastUpdated: 'Just now',
    history: [
      { date: '2026-11-16', heartRate: 88, bp: '130/84', glucose: 118, spO2: 95, temp: 36.9, note: 'Elevated heart rate' },
      { date: '2026-11-18', heartRate: 94, bp: '136/88', glucose: 122, spO2: 94, temp: 37.0, note: 'Shortness of breath noted' },
      { date: '2026-11-20', heartRate: 106, bp: '142/92', glucose: 124, spO2: 93, temp: 37.1, note: 'Tachycardia and mild desaturation' }
    ],
    consultations: [
      { date: '2026-11-18', doctor: 'Dr. Sarah Jenkins', notes: 'Scheduled urgent telehealth consultation for telemetry review.' }
    ]
  },
  {
    id: 'P1004',
    name: 'Sophia Patel',
    age: 38,
    gender: 'Female',
    location: 'Outpatient Tele-Rehab',
    doctor: 'Dr. Sarah Jenkins',
    condition: 'Type 1 Diabetes Mellitus',
    monitoringStatus: 'normal',
    deviceStatus: 'connected',
    deviceId: 'GM003',
    vitals: {
      heartRate: 70,
      systolic: 116,
      diastolic: 76,
      glucose: 104,
      spO2: 99,
      temp: 36.5
    },
    lastUpdated: '2 mins ago',
    history: [
      { date: '2026-11-15', heartRate: 68, bp: '115/75', glucose: 98, spO2: 99, temp: 36.5, note: 'Optimal glycemic control' },
      { date: '2026-11-18', heartRate: 72, bp: '118/78', glucose: 106, spO2: 99, temp: 36.6, note: 'Continuous CGM sync' }
    ],
    consultations: []
  },
  {
    id: 'P1005',
    name: 'Robert Davis',
    age: 72,
    gender: 'Male',
    location: 'Senior Care Unit 4',
    doctor: 'Dr. Sarah Jenkins',
    condition: 'COPD with Nocturnal Hypoxemia',
    monitoringStatus: 'attention',
    deviceStatus: 'connected',
    deviceId: 'PO005',
    vitals: {
      heartRate: 82,
      systolic: 128,
      diastolic: 82,
      glucose: 114,
      spO2: 93,
      temp: 36.8
    },
    lastUpdated: '1 min ago',
    history: [
      { date: '2026-11-16', heartRate: 78, bp: '124/80', glucose: 110, spO2: 95, temp: 36.7, note: 'Oxygen therapy adjusted' },
      { date: '2026-11-19', heartRate: 84, bp: '128/82', glucose: 115, spO2: 93, temp: 36.8, note: 'SpO2 drops below 94% threshold' }
    ],
    consultations: []
  }
];

const INITIAL_DEVICES = [
  {
    id: 'HR001',
    name: 'Smart Heart Rate Sensor',
    model: 'CardioBeat Pro M2M-X',
    patientId: 'P1003',
    type: 'Heart Rate',
    reading: 106,
    unit: 'BPM',
    status: 'connected',
    battery: 91,
    signal: -54,
    protocol: 'BLE 5.2 / Gateway MQTT',
    lastComm: '1 sec ago'
  },
  {
    id: 'BP002',
    name: 'Digital Blood Pressure Monitor',
    model: 'SphygmoLink Edge-400',
    patientId: 'P1002',
    type: 'Blood Pressure',
    reading: '122/80',
    unit: 'mmHg',
    status: 'connected',
    battery: 84,
    signal: -62,
    protocol: 'Wi-Fi 802.11ax / CoAP',
    lastComm: '3 sec ago'
  },
  {
    id: 'GM003',
    name: 'Smart Glucose Monitor',
    model: 'GlucoSense M2M Continuous',
    patientId: 'P1004',
    type: 'Blood Glucose',
    reading: 104,
    unit: 'mg/dL',
    status: 'connected',
    battery: 78,
    signal: -58,
    protocol: 'Zigbee 3.0 / Gateway REST',
    lastComm: '2 sec ago'
  },
  {
    id: 'WB004',
    name: 'Wearable Health Band',
    model: 'VitaPulse BioBand 3',
    patientId: 'P1001',
    type: 'Wearable Multi-Sensor',
    reading: 'HR: 88, SpO2: 96%',
    unit: 'Hybrid',
    status: 'connected',
    battery: 95,
    signal: -49,
    protocol: 'BLE 5.2 GATT / MQTT v5.0',
    lastComm: '1 sec ago'
  },
  {
    id: 'PO005',
    name: 'Smart Pulse Oximeter',
    model: 'OxiMesh PulsePro',
    patientId: 'P1005',
    type: 'Pulse Oximetry',
    reading: 93,
    unit: '%',
    status: 'connected',
    battery: 88,
    signal: -65,
    protocol: 'BLE 5.0 / Gateway CoAP',
    lastComm: '2 sec ago'
  }
];

const INITIAL_ALERTS = [
  {
    id: 'ALT-901',
    patientId: 'P1003',
    patientName: 'Marcus Chen',
    deviceId: 'HR001',
    deviceName: 'Smart Heart Rate Sensor',
    type: 'Tachycardia Alert',
    reading: '106 BPM',
    severity: 'critical',
    status: 'active',
    timestamp: '2026-11-21 10:24',
    message: 'Continuous heart rate exceeds configured demonstration threshold (100 BPM).'
  },
  {
    id: 'ALT-902',
    patientId: 'P1005',
    patientName: 'Robert Davis',
    deviceId: 'PO005',
    deviceName: 'Smart Pulse Oximeter',
    type: 'Low SpO2 Desaturation',
    reading: '93 %',
    severity: 'warning',
    status: 'active',
    timestamp: '2026-11-21 10:18',
    message: 'Oxygen saturation dipped below target threshold (94%). Clinical review advised.'
  },
  {
    id: 'ALT-903',
    patientId: 'P1001',
    patientName: 'James Peterson',
    deviceId: 'WB004',
    deviceName: 'Wearable Health Band',
    type: 'Elevated Post-Activity HR',
    reading: '88 BPM',
    severity: 'info',
    status: 'reviewed',
    timestamp: '2026-11-21 09:40',
    message: 'Wearable band logged heart rate elevation following reported walking session.'
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-401',
    patientId: 'P1001',
    patientName: 'James Peterson',
    doctor: 'Dr. Sarah Jenkins',
    date: '2026-11-21',
    time: '10:30',
    type: 'Urgent Vital Anomaly Follow-up',
    reason: 'Review post-walking heart rate spike and check telemetry graphs.',
    status: 'scheduled'
  },
  {
    id: 'APT-402',
    patientId: 'P1003',
    patientName: 'Marcus Chen',
    doctor: 'Dr. Sarah Jenkins',
    date: '2026-11-21',
    time: '14:00',
    type: 'Urgent Vital Anomaly Follow-up',
    reason: 'Investigate sustained tachycardia (106 BPM) and dyspnea symptoms.',
    status: 'scheduled'
  },
  {
    id: 'APT-403',
    patientId: 'P1002',
    patientName: 'Eleanor Vance',
    doctor: 'Dr. Sarah Jenkins',
    date: '2026-11-22',
    time: '11:15',
    type: 'Routine Biometric Review',
    reason: 'Monthly blood pressure and glycemic stability check.',
    status: 'scheduled'
  }
];

const INITIAL_SECURITY_AUDIT = [
  { time: '2026-11-21 10:28:40', user: 'Dr. Sarah Jenkins', action: 'SESSION_AUTHENTICATED', resource: 'AuthService', context: 'RBAC: Role=Doctor', status: 'SUCCESS' },
  { time: '2026-11-21 10:27:15', user: 'Edge-GW-01', action: 'INGEST_TELEMETRY', resource: 'HR001 / P1003', context: 'MQTT v5.0 Mutual TLS', status: 'SUCCESS' },
  { time: '2026-11-21 10:25:02', user: 'AlertEngine', action: 'DISPATCH_NOTIFICATION', resource: 'ALT-901', context: 'Threshold Breach Engine', status: 'SUCCESS' },
  { time: '2026-11-21 10:20:10', user: 'Edge-GW-01', action: 'CERTIFICATE_VALIDATED', resource: 'WB004', context: 'X.509 Hardware Keystore', status: 'SUCCESS' }
];

// =============================================================================
// 2. Application State Object
// =============================================================================

let appState = {
  currentUser: {
    id: 'DOC-01',
    name: 'Dr. Sarah Jenkins',
    role: 'doctor', // 'doctor' | 'patient'
    email: 'sarah.jenkins@remotecare.health',
    avatar: 'SJ'
  },
  patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
  devices: JSON.parse(JSON.stringify(INITIAL_DEVICES)),
  alerts: JSON.parse(JSON.stringify(INITIAL_ALERTS)),
  appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
  securityAudit: JSON.parse(JSON.stringify(INITIAL_SECURITY_AUDIT)),
  thresholds: {
    maxHR: 100,
    minHR: 55,
    maxBP: 135,
    minSpO2: 94,
    maxGlucose: 140
  },
  network: {
    preset: 'excellent',
    bandwidth: 94.5,
    latency: 14,
    packetLoss: 0.0,
    signal: -58,
    status: 'online', // 'online' | 'offline'
    buffer: []
  },
  telemetryStreamLog: [],
  telemetryHistoryChartData: {
    labels: ['10:20', '10:22', '10:24', '10:26', '10:28', '10:30'],
    heartRate: [74, 76, 75, 78, 80, 78],
    spO2: [98, 98, 97, 98, 97, 98],
    glucose: [102, 104, 105, 104, 106, 104],
    systolic: [120, 122, 120, 124, 122, 120]
  },
  settings: {
    interval: 2000,
    audioAlerts: true
  }
};

// Load saved state from localStorage if available
function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      appState.patients = parsed.patients || appState.patients;
      appState.devices = parsed.devices || appState.devices;
      appState.alerts = parsed.alerts || appState.alerts;
      appState.appointments = parsed.appointments || appState.appointments;
      appState.thresholds = parsed.thresholds || appState.thresholds;
      if (parsed.currentUser) appState.currentUser = parsed.currentUser;
      if (parsed.securityAudit) appState.securityAudit = parsed.securityAudit;
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using initial defaults:', err);
  }
}

function saveStateToStorage() {
  try {
    const toSave = {
      patients: appState.patients,
      devices: appState.devices,
      alerts: appState.alerts,
      appointments: appState.appointments,
      thresholds: appState.thresholds,
      currentUser: appState.currentUser,
      securityAudit: appState.securityAudit
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('Could not write to localStorage:', err);
  }
}

// =============================================================================
// 3. UI Navigation & Page View Controller
// =============================================================================

function navigateToPage(pageId) {
  // Update nav link active state
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Hide all pages, show target
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(pageId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update Breadcrumb & Header Title
  const titleMap = {
    'overview': { title: 'Overview Dashboard', breadcrumb: 'Clinical Telemetry' },
    'patients': { title: 'Patient Monitoring', breadcrumb: 'Clinical Telemetry' },
    'devices': { title: 'Connected Medical Devices', breadcrumb: 'IoT Sensor Management' },
    'live-telemetry': { title: 'Live Health Readings', breadcrumb: 'Real-Time Biometrics' },
    'architecture': { title: 'M2M Communication Architecture', breadcrumb: 'M2M Pipeline' },
    'protocols': { title: 'User-Defined M2M Protocols', breadcrumb: 'Protocol Studio' },
    'network': { title: 'Network Status & Reliability', breadcrumb: 'M2M Reliability' },
    'alerts': { title: 'Alerts & Clinical Notifications', breadcrumb: 'Clinical Safety' },
    'consultation': { title: 'Video Consultation Studio', breadcrumb: 'Telehealth WebRTC' },
    'appointments': { title: 'Scheduled Consultations', breadcrumb: 'Telehealth Schedule' },
    'history': { title: 'Patient Health History', breadcrumb: 'Time-Series Records' },
    'reports': { title: 'Reports & Clinical Analytics', breadcrumb: 'Health Informatics' },
    'security': { title: 'Privacy & Security Architecture', breadcrumb: 'HIPAA & GDPR' },
    'settings': { title: 'System Demonstration Settings', breadcrumb: 'Configuration' }
  };

  const info = titleMap[pageId] || { title: 'RemoteCare Platform', breadcrumb: 'Dashboard' };
  document.getElementById('currentPageTitle').textContent = info.title;
  document.getElementById('currentBreadcrumb').textContent = info.breadcrumb;

  // On page entry triggers
  if (pageId === 'overview') {
    renderOverview();
  } else if (pageId === 'patients') {
    renderPatients();
  } else if (pageId === 'devices') {
    renderDevices();
  } else if (pageId === 'live-telemetry') {
    renderLiveTelemetry();
  } else if (pageId === 'alerts') {
    renderAlerts();
  } else if (pageId === 'appointments') {
    renderAppointments();
  } else if (pageId === 'history') {
    renderHistory();
  } else if (pageId === 'reports') {
    renderReports();
  } else if (pageId === 'security') {
    renderSecurity();
  } else if (pageId === 'consultation') {
    setupVideoConsultationOnEnter();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================================================
// 4. Role Switching & User Management
// =============================================================================

function setUserRole(role) {
  if (role === 'doctor') {
    appState.currentUser = {
      id: 'DOC-01',
      name: 'Dr. Sarah Jenkins',
      role: 'doctor',
      email: 'sarah.jenkins@remotecare.health',
      avatar: 'SJ'
    };
    document.getElementById('btnRoleDoctor').classList.add('active');
    document.getElementById('btnRolePatient').classList.remove('active');
  } else {
    appState.currentUser = {
      id: 'P1001',
      name: 'James Peterson',
      role: 'patient',
      email: 'james.peterson@patient.remotecare.health',
      avatar: 'JP'
    };
    document.getElementById('btnRolePatient').classList.add('active');
    document.getElementById('btnRoleDoctor').classList.remove('active');
  }

  // Update profile card in sidebar
  document.getElementById('sidebarUserName').textContent = appState.currentUser.name;
  document.getElementById('sidebarUserAvatar').textContent = appState.currentUser.avatar;
  const badge = document.getElementById('sidebarUserRoleBadge');
  if (appState.currentUser.role === 'doctor') {
    badge.textContent = 'Doctor Role';
    badge.className = 'user-role-badge';
  } else {
    badge.textContent = 'Patient Role';
    badge.className = 'user-role-badge patient-role';
  }

  // Log to audit
  appState.securityAudit.unshift({
    time: getFormattedCurrentTime(),
    user: appState.currentUser.name,
    action: 'ROLE_SWITCHED',
    resource: 'AccessControl',
    context: `Switched context to ${appState.currentUser.role.toUpperCase()}`,
    status: 'SUCCESS'
  });

  saveStateToStorage();
  updateRoleBasedVisibility();
  navigateToPage('overview');
}

function updateRoleBasedVisibility() {
  const isDoc = appState.currentUser.role === 'doctor';
  const patientNavItem = document.getElementById('navItemPatients');
  if (patientNavItem) {
    patientNavItem.querySelector('span').textContent = isDoc ? 'Patient Monitoring' : 'My Health Profile';
  }
}

// =============================================================================
// 5. Dynamic Rendering: Overview Dashboard
// =============================================================================

let overviewTrendsChartInstance = null;

function renderOverview() {
  // KPI Metrics
  const totalPts = appState.patients.length;
  const activeDevs = appState.devices.filter(d => d.status === 'connected').length;
  const attentionPts = appState.patients.filter(p => p.monitoringStatus !== 'normal').length;
  const scheduledCalls = appState.appointments.filter(a => a.status === 'scheduled').length;

  document.getElementById('kpiTotalPatients').textContent = totalPts;
  document.getElementById('kpiActiveDevices').textContent = `${activeDevs} / ${appState.devices.length}`;
  document.getElementById('kpiAttentionPatients').textContent = attentionPts;
  document.getElementById('kpiScheduledCalls').textContent = scheduledCalls;

  // Active Patient Live Table
  const tbody = document.getElementById('overviewPatientTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    const displayedPatients = appState.currentUser.role === 'patient' 
      ? appState.patients.filter(p => p.id === appState.currentUser.id)
      : appState.patients;

    displayedPatients.forEach(p => {
      const tr = document.createElement('tr');
      
      const hrClass = p.vitals.heartRate > 100 ? 'abnormal' : (p.vitals.heartRate > 85 ? 'warning' : '');
      const bpClass = p.vitals.systolic > 135 ? 'abnormal' : (p.vitals.systolic > 125 ? 'warning' : '');
      const spO2Class = p.vitals.spO2 < 94 ? 'abnormal' : (p.vitals.spO2 < 96 ? 'warning' : '');

      const devBadge = p.deviceStatus === 'connected' 
        ? '<span class="badge badge-normal"><i data-lucide="check" style="width:11px;height:11px;"></i> Connected</span>'
        : '<span class="badge badge-disconnected"><i data-lucide="wifi-off" style="width:11px;height:11px;"></i> Disconnected</span>';

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${p.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.condition}</div>
        </td>
        <td><span class="badge badge-primary">${p.id}</span></td>
        <td><span class="vital-value-pill ${hrClass}">${p.vitals.heartRate} <span style="font-size:0.68rem; font-weight:normal;">BPM</span></span></td>
        <td><span class="vital-value-pill ${bpClass}">${p.vitals.systolic}/${p.vitals.diastolic} <span style="font-size:0.68rem; font-weight:normal;">mmHg</span></span></td>
        <td><span class="vital-value-pill">${p.vitals.glucose} <span style="font-size:0.68rem; font-weight:normal;">mg/dL</span></span></td>
        <td><span class="vital-value-pill ${spO2Class}">${p.vitals.spO2}%</span></td>
        <td>${devBadge}</td>
        <td><span style="font-size: 0.75rem; color: var(--text-light);">${p.lastUpdated}</span></td>
        <td>
          <button class="btn btn-outline btn-sm btn-open-patient-modal" data-id="${p.id}">
            <i data-lucide="eye" style="width: 12px; height: 12px;"></i> View
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Populate Trend Patient Dropdown
  const trendSelect = document.getElementById('overviewTrendPatientSelect');
  if (trendSelect) {
    trendSelect.innerHTML = '';
    appState.patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.id})`;
      trendSelect.appendChild(opt);
    });
  }

  // Render Recent Alerts list
  const alertsList = document.getElementById('overviewAlertsList');
  if (alertsList) {
    alertsList.innerHTML = '';
    const activeAlerts = appState.alerts.slice(0, 3);
    if (activeAlerts.length === 0) {
      alertsList.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem;">No active alerts at this time. All vitals are within normal range.</div>';
    } else {
      activeAlerts.forEach(a => {
        const item = document.createElement('div');
        item.className = `alert-mini-item ${a.severity}`;
        item.innerHTML = `
          <div class="alert-mini-icon">
            <i data-lucide="${a.severity === 'critical' ? 'alert-triangle' : 'alert-circle'}" style="width: 16px; height: 16px; color: ${a.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'};"></i>
          </div>
          <div class="alert-mini-content">
            <div class="alert-mini-title">
              <span>${a.type}</span>
              <span class="alert-mini-time">${a.timestamp}</span>
            </div>
            <div class="alert-mini-desc">${a.patientName} (${a.reading}): ${a.message}</div>
          </div>
        `;
        alertsList.appendChild(item);
      });
    }
  }

  // Render Upcoming Consultations
  const consultList = document.getElementById('overviewConsultationsList');
  if (consultList) {
    consultList.innerHTML = '';
    const upcoming = appState.appointments.filter(a => a.status === 'scheduled').slice(0, 2);
    if (upcoming.length === 0) {
      consultList.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem;">No scheduled consultations.</div>';
    } else {
      upcoming.forEach(a => {
        const item = document.createElement('div');
        item.className = 'consultation-mini-item';
        item.innerHTML = `
          <div class="consultation-mini-user">
            <div class="patient-avatar-sm">${a.patientName.split(' ').map(n=>n[0]).join('')}</div>
            <div>
              <div style="font-size: 0.825rem; font-weight: 700;">${a.patientName}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${a.date} at ${a.time} • ${a.type}</div>
            </div>
          </div>
          <button class="btn btn-outline-primary btn-sm btn-join-call-quick" data-id="${a.id}">
            <i data-lucide="video" style="width: 12px; height: 12px;"></i> Join
          </button>
        `;
        consultList.appendChild(item);
      });
    }
  }

  // Initialize/Update Trend Chart
  initOverviewTrendChart();
  refreshLucideIcons();
}

function initOverviewTrendChart() {
  const ctx = document.getElementById('overviewTrendsChart');
  if (!ctx) return;

  if (overviewTrendsChartInstance) {
    overviewTrendsChartInstance.destroy();
  }

  const selectedPtId = document.getElementById('overviewTrendPatientSelect')?.value || 'P1001';
  const selectedMetric = document.getElementById('overviewTrendMetricSelect')?.value || 'heartRate';
  const pt = appState.patients.find(p => p.id === selectedPtId) || appState.patients[0];

  let chartLabels = [];
  let chartValues = [];
  let labelName = 'Heart Rate (BPM)';
  let borderColor = '#ef4444';
  let bgColor = 'rgba(239, 68, 68, 0.1)';

  if (pt && pt.history && pt.history.length > 0) {
    chartLabels = pt.history.map(h => h.date);
    if (selectedMetric === 'heartRate') {
      chartValues = pt.history.map(h => h.heartRate);
      labelName = 'Heart Rate (BPM)';
      borderColor = '#ef4444';
      bgColor = 'rgba(239, 68, 68, 0.1)';
    } else if (selectedMetric === 'spO2') {
      chartValues = pt.history.map(h => h.spO2);
      labelName = 'Oxygen Saturation (%)';
      borderColor = '#7c3aed';
      bgColor = 'rgba(124, 58, 237, 0.1)';
    } else if (selectedMetric === 'glucose') {
      chartValues = pt.history.map(h => h.glucose);
      labelName = 'Blood Glucose (mg/dL)';
      borderColor = '#0d9488';
      bgColor = 'rgba(13, 148, 136, 0.1)';
    } else {
      chartValues = pt.history.map(h => parseInt(h.bp.split('/')[0]));
      labelName = 'Systolic BP (mmHg)';
      borderColor = '#0284c7';
      bgColor = 'rgba(2, 132, 199, 0.1)';
    }
  }

  overviewTrendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [{
        label: labelName,
        data: chartValues,
        borderColor: borderColor,
        backgroundColor: bgColor,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: borderColor,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#94a3b8' }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#94a3b8' }
        }
      }
    }
  });
}

// =============================================================================
// 6. Dynamic Rendering: Patient Monitoring Page
// =============================================================================

let isPatientTableView = false;

function renderPatients() {
  const container = document.getElementById('patientCardsContainer');
  const tableContainer = document.getElementById('patientTableContainer');
  const fullTableBody = document.getElementById('patientFullTableBody');

  const searchTerm = (document.getElementById('patientSearchInput')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('patientStatusFilter')?.value || 'all';
  const deviceFilter = document.getElementById('patientDeviceFilter')?.value || 'all';

  let filtered = appState.patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm) ||
                          p.id.toLowerCase().includes(searchTerm) ||
                          p.condition.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.monitoringStatus === statusFilter;
    const matchesDevice = deviceFilter === 'all' || p.deviceStatus === deviceFilter;
    return matchesSearch && matchesStatus && matchesDevice;
  });

  if (appState.currentUser.role === 'patient') {
    filtered = filtered.filter(p => p.id === appState.currentUser.id);
  }

  // Render Cards
  if (container) {
    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No matching patients found.</div>';
    } else {
      filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-profile-card';

        let statusBadge = '<span class="badge badge-normal">Normal</span>';
        if (p.monitoringStatus === 'attention') statusBadge = '<span class="badge badge-attention">Needs Review</span>';
        if (p.monitoringStatus === 'critical') statusBadge = '<span class="badge badge-critical">Critical</span>';

        const deviceBadge = p.deviceStatus === 'connected'
          ? '<span class="badge badge-normal"><i data-lucide="wifi" style="width:10px;height:10px;"></i> Online</span>'
          : '<span class="badge badge-disconnected"><i data-lucide="wifi-off" style="width:10px;height:10px;"></i> Offline</span>';

        card.innerHTML = `
          <div class="patient-card-top">
            <div class="patient-card-identity">
              <div class="patient-card-avatar">${p.name.split(' ').map(n=>n[0]).join('')}</div>
              <div class="patient-card-meta">
                <h4>${p.name}</h4>
                <p>${p.id} • ${p.age} yrs • ${p.gender}</p>
              </div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <strong>Condition:</strong> ${p.condition}
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <span>Device: <strong>${p.deviceId}</strong></span>
            <span>${deviceBadge}</span>
          </div>

          <div class="patient-vitals-quad">
            <div class="vital-quad-cell">
              <span class="vital-quad-label">Heart Rate</span>
              <span class="vital-quad-val" style="color: #ef4444;">${p.vitals.heartRate} <small style="font-size:0.65rem;">BPM</small></span>
            </div>
            <div class="vital-quad-cell">
              <span class="vital-quad-label">Blood Pressure</span>
              <span class="vital-quad-val" style="color: #0284c7;">${p.vitals.systolic}/${p.vitals.diastolic}</span>
            </div>
            <div class="vital-quad-cell">
              <span class="vital-quad-label">Blood Glucose</span>
              <span class="vital-quad-val" style="color: #0d9488;">${p.vitals.glucose} <small style="font-size:0.65rem;">mg/dL</small></span>
            </div>
            <div class="vital-quad-cell">
              <span class="vital-quad-label">SpO2</span>
              <span class="vital-quad-val" style="color: #7c3aed;">${p.vitals.spO2}%</span>
            </div>
          </div>

          <div class="patient-card-actions">
            <button class="btn btn-outline btn-sm btn-open-patient-modal" data-id="${p.id}">
              <i data-lucide="activity"></i> Monitor
            </button>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-outline btn-sm btn-edit-patient" data-id="${p.id}" title="Edit Information">
                <i data-lucide="edit-3"></i>
              </button>
              <button class="btn btn-outline btn-sm btn-delete-patient" data-id="${p.id}" title="Delete Patient" style="color: var(--danger);">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }
  }

  // Render Full Table
  if (fullTableBody) {
    fullTableBody.innerHTML = '';
    filtered.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight: 700;">${p.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.id} • ${p.location}</div>
        </td>
        <td>${p.age} / ${p.gender}</td>
        <td>${p.doctor}</td>
        <td><span class="badge badge-${p.monitoringStatus}">${p.monitoringStatus.toUpperCase()}</span></td>
        <td><span class="badge badge-${p.deviceStatus}">${p.deviceId} (${p.deviceStatus})</span></td>
        <td><strong>${p.vitals.heartRate}</strong> BPM</td>
        <td><strong>${p.vitals.systolic}/${p.vitals.diastolic}</strong> mmHg</td>
        <td><strong>${p.vitals.glucose}</strong> mg/dL</td>
        <td><strong>${p.vitals.spO2}</strong>%</td>
        <td>
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn btn-outline btn-sm btn-open-patient-modal" data-id="${p.id}"><i data-lucide="eye"></i></button>
            <button class="btn btn-outline btn-sm btn-edit-patient" data-id="${p.id}"><i data-lucide="edit"></i></button>
            <button class="btn btn-outline btn-sm btn-delete-patient" data-id="${p.id}" style="color: var(--danger);"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      `;
      fullTableBody.appendChild(tr);
    });
  }

  refreshLucideIcons();
}

function openPatientDetailModal(patientId) {
  const p = appState.patients.find(pt => pt.id === patientId);
  if (!p) return;

  const modal = document.getElementById('patientDetailModal');
  const modalTitle = document.getElementById('patientDetailModalTitle');
  const modalBody = document.getElementById('patientDetailModalBody');
  const btnStartCall = document.getElementById('btnModalStartVideoConsultation');

  modalTitle.textContent = `${p.name} – Clinical Monitoring Dossier (${p.id})`;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
      <div style="padding: 1rem; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">Patient Information</h4>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <div><strong>Age / Gender:</strong> ${p.age} years / ${p.gender}</div>
          <div><strong>Location:</strong> ${p.location}</div>
          <div><strong>Attending Doctor:</strong> ${p.doctor}</div>
          <div><strong>Primary Condition:</strong> ${p.condition}</div>
          <div><strong>Assigned Device:</strong> ${p.deviceId} (${p.deviceStatus})</div>
        </div>
      </div>

      <div style="padding: 1rem; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--secondary);">Current Real-Time Vitals</h4>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <div><strong>Heart Rate:</strong> <span style="color: #ef4444; font-weight: 700;">${p.vitals.heartRate} BPM</span></div>
          <div><strong>Blood Pressure:</strong> <span style="color: #0284c7; font-weight: 700;">${p.vitals.systolic}/${p.vitals.diastolic} mmHg</span></div>
          <div><strong>Blood Glucose:</strong> <span style="color: #0d9488; font-weight: 700;">${p.vitals.glucose} mg/dL</span></div>
          <div><strong>Oxygen Saturation:</strong> <span style="color: #7c3aed; font-weight: 700;">${p.vitals.spO2}%</span></div>
          <div><strong>Body Temperature:</strong> <span style="color: #f59e0b; font-weight: 700;">${p.vitals.temp}°C</span></div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Clinical Consultation Notes</h4>
      <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.78rem;">
        ${p.consultations && p.consultations.length > 0
          ? p.consultations.map(c => `<div><strong>${c.date} (${c.doctor}):</strong> ${c.notes}</div>`).join('')
          : '<span style="color: var(--text-muted);">No past consultation notes recorded.</span>'}
      </div>
    </div>

    <div>
      <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Recent Telemetry History</h4>
      <div class="table-responsive">
        <table class="healthcare-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heart Rate</th>
              <th>Blood Pressure</th>
              <th>Glucose</th>
              <th>SpO2</th>
              <th>Clinical Note</th>
            </tr>
          </thead>
          <tbody>
            ${(p.history || []).map(h => `
              <tr>
                <td>${h.date}</td>
                <td>${h.heartRate} BPM</td>
                <td>${h.bp}</td>
                <td>${h.glucose} mg/dL</td>
                <td>${h.spO2}%</td>
                <td>${h.note}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  btnStartCall.onclick = () => {
    modal.classList.remove('active');
    setupVideoCallForPatient(p.id);
  };

  modal.classList.add('active');
  refreshLucideIcons();
}

function openAddPatientModal() {
  document.getElementById('patientFormMode').value = 'add';
  document.getElementById('patientFormId').value = '';
  document.getElementById('patientFormModalTitle').textContent = 'Add New Fictional Patient';
  document.getElementById('patientForm').reset();
  document.getElementById('patientFormModal').classList.add('active');
}

function openEditPatientModal(patientId) {
  const p = appState.patients.find(pt => pt.id === patientId);
  if (!p) return;

  document.getElementById('patientFormMode').value = 'edit';
  document.getElementById('patientFormId').value = p.id;
  document.getElementById('patientFormModalTitle').textContent = `Edit Patient: ${p.name} (${p.id})`;

  document.getElementById('patientFormName').value = p.name;
  document.getElementById('patientFormAge').value = p.age;
  document.getElementById('patientFormGender').value = p.gender;
  document.getElementById('patientFormLocation').value = p.location;
  document.getElementById('patientFormDoctor').value = p.doctor;
  document.getElementById('patientFormCondition').value = p.condition;

  document.getElementById('patientFormModal').classList.add('active');
}

function savePatientForm() {
  const mode = document.getElementById('patientFormMode').value;
  const name = document.getElementById('patientFormName').value.trim();
  const age = parseInt(document.getElementById('patientFormAge').value, 10);
  const gender = document.getElementById('patientFormGender').value;
  const location = document.getElementById('patientFormLocation').value.trim();
  const doctor = document.getElementById('patientFormDoctor').value.trim();
  const condition = document.getElementById('patientFormCondition').value.trim();
  const device = document.getElementById('patientFormDevice').value;

  if (!name || isNaN(age) || !location || !condition) {
    alert('Please fill out all required fields.');
    return;
  }

  if (mode === 'add') {
    const newId = 'P' + (1000 + appState.patients.length + 1);
    const newPatient = {
      id: newId,
      name: name,
      age: age,
      gender: gender,
      location: location,
      doctor: doctor || 'Dr. Sarah Jenkins',
      condition: condition,
      monitoringStatus: 'normal',
      deviceStatus: 'connected',
      deviceId: device.includes('HR001') ? 'HR001' : (device.includes('BP002') ? 'BP002' : 'WB004'),
      vitals: {
        heartRate: 72,
        systolic: 120,
        diastolic: 80,
        glucose: 100,
        spO2: 98,
        temp: 36.6
      },
      lastUpdated: 'Just now',
      history: [
        { date: getFormattedCurrentDate(), heartRate: 72, bp: '120/80', glucose: 100, spO2: 98, temp: 36.6, note: 'Initial registration' }
      ],
      consultations: []
    };
    appState.patients.push(newPatient);
  } else {
    const pId = document.getElementById('patientFormId').value;
    const p = appState.patients.find(pt => pt.id === pId);
    if (p) {
      p.name = name;
      p.age = age;
      p.gender = gender;
      p.location = location;
      p.doctor = doctor;
      p.condition = condition;
    }
  }

  saveStateToStorage();
  document.getElementById('patientFormModal').classList.remove('active');
  renderPatients();
  renderOverview();
}

let deleteTargetId = null;

function promptDeletePatient(patientId) {
  const p = appState.patients.find(pt => pt.id === patientId);
  if (!p) return;
  deleteTargetId = patientId;
  document.getElementById('deleteTargetPatientName').textContent = `${p.name} (${p.id})`;
  document.getElementById('deleteModal').classList.add('active');
}

function confirmDeletePatient() {
  if (!deleteTargetId) return;
  appState.patients = appState.patients.filter(p => p.id !== deleteTargetId);
  saveStateToStorage();
  document.getElementById('deleteModal').classList.remove('active');
  deleteTargetId = null;
  renderPatients();
  renderOverview();
}

// =============================================================================
// 7. Dynamic Rendering: Connected Medical Devices
// =============================================================================

function renderDevices() {
  const container = document.getElementById('devicesGridContainer');
  if (!container) return;

  const onlineCount = appState.devices.filter(d => d.status === 'connected').length;
  document.getElementById('deviceOnlineRatio').textContent = `${onlineCount} of ${appState.devices.length} Online`;

  container.innerHTML = '';
  appState.devices.forEach(dev => {
    const isConn = dev.status === 'connected';
    const card = document.createElement('div');
    card.className = `device-card ${isConn ? '' : 'disconnected'}`;

    // Find connected patient name
    const pt = appState.patients.find(p => p.id === dev.patientId);
    const ptName = pt ? pt.name : 'Unassigned';

    let icon = 'activity';
    let colorClass = '';
    if (dev.type === 'Heart Rate') { icon = 'heart'; }
    else if (dev.type === 'Blood Pressure') { icon = 'activity'; colorClass = 'teal'; }
    else if (dev.type === 'Blood Glucose') { icon = 'droplet'; colorClass = 'teal'; }
    else if (dev.type === 'Wearable Multi-Sensor') { icon = 'watch'; colorClass = 'purple'; }
    else if (dev.type === 'Pulse Oximetry') { icon = 'wind'; colorClass = 'purple'; }

    card.innerHTML = `
      <div class="device-card-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="device-visual-pill ${colorClass} ${isConn ? '' : 'disconnected'}">
            <i data-lucide="${icon}"></i>
          </div>
          <div class="device-title-area">
            <h4>${dev.name}</h4>
            <p>${dev.id} • ${dev.model}</p>
          </div>
        </div>
        <span class="badge ${isConn ? 'badge-normal' : 'badge-disconnected'}">
          ${isConn ? '<i data-lucide="check" style="width:11px;height:11px;"></i> Connected' : '<i data-lucide="x" style="width:11px;height:11px;"></i> Disconnected'}
        </span>
      </div>

      <div class="device-telemetry-box">
        <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Latest Ingested Telemetry</div>
        <div class="device-reading-val" style="color: ${isConn ? 'var(--text-main)' : 'var(--text-light)'};">
          ${isConn ? dev.reading : 'OFFLINE'}
          ${isConn && dev.unit !== 'Hybrid' ? `<span class="device-reading-unit">${dev.unit}</span>` : ''}
        </div>
        <div class="device-reading-sub">Connected to Patient: <strong>${ptName} (${dev.patientId})</strong></div>
      </div>

      <div class="device-specs-list">
        <div class="device-spec-item">
          <i data-lucide="battery" style="width: 14px; height: 14px; color: ${dev.battery > 30 ? 'var(--success)' : 'var(--danger)'};"></i>
          <span>Battery: <strong>${dev.battery}%</strong></span>
        </div>
        <div class="device-spec-item">
          <i data-lucide="signal" style="width: 14px; height: 14px;"></i>
          <span>Signal: <strong>${dev.signal} dBm</strong></span>
        </div>
        <div class="device-spec-item" style="grid-column: span 2;">
          <i data-lucide="network" style="width: 14px; height: 14px;"></i>
          <span>Protocol: <strong>${dev.protocol}</strong></span>
        </div>
        <div class="device-spec-item" style="grid-column: span 2;">
          <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
          <span>Last Comm: <strong>${dev.lastComm}</strong></span>
        </div>
      </div>

      <div class="device-controls-footer">
        <button class="btn btn-outline btn-sm btn-device-history" data-id="${dev.id}">
          <i data-lucide="history"></i> History
        </button>
        <button class="btn btn-sm ${isConn ? 'btn-danger' : 'btn-primary'} btn-toggle-device-conn" data-id="${dev.id}">
          <i data-lucide="${isConn ? 'power-off' : 'power'}"></i> ${isConn ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  refreshLucideIcons();
}

function toggleDeviceConnection(deviceId) {
  const dev = appState.devices.find(d => d.id === deviceId);
  if (!dev) return;

  if (dev.status === 'connected') {
    dev.status = 'disconnected';
    // Update connected patient's deviceStatus
    const pt = appState.patients.find(p => p.id === dev.patientId);
    if (pt) pt.deviceStatus = 'disconnected';

    // Generate disconnection alert
    appState.alerts.unshift({
      id: 'ALT-' + (900 + appState.alerts.length + 1),
      patientId: dev.patientId,
      patientName: pt ? pt.name : 'Unknown',
      deviceId: dev.id,
      deviceName: dev.name,
      type: 'Device Disconnected',
      reading: 'COMM_OFFLINE',
      severity: 'warning',
      status: 'active',
      timestamp: getFormattedCurrentTime(),
      message: `${dev.name} (${dev.id}) disconnected. Telemetry feed interrupted.`
    });
  } else {
    dev.status = 'connected';
    const pt = appState.patients.find(p => p.id === dev.patientId);
    if (pt) pt.deviceStatus = 'connected';
  }

  saveStateToStorage();
  renderDevices();
  renderOverview();
  updateAlertBadges();
}

// =============================================================================
// 8. Dynamic Rendering: Live Health Readings
// =============================================================================

let liveContinuousChartInstance = null;

function renderLiveTelemetry() {
  const ptSelect = document.getElementById('livePatientSelect');
  if (ptSelect && ptSelect.children.length === 0) {
    ptSelect.innerHTML = '';
    appState.patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.id})`;
      ptSelect.appendChild(opt);
    });
  }

  updateLiveNumbersDisplay();
  initLiveContinuousChart();
}

function updateLiveNumbersDisplay() {
  const ptId = document.getElementById('livePatientSelect')?.value || 'P1001';
  const pt = appState.patients.find(p => p.id === ptId) || appState.patients[0];
  if (!pt) return;

  const hrEl = document.getElementById('liveValHR');
  const bpEl = document.getElementById('liveValBP');
  const glucEl = document.getElementById('liveValGlucose');
  const spO2El = document.getElementById('liveValSpO2');
  const tempEl = document.getElementById('liveValTemp');

  if (hrEl) hrEl.textContent = pt.vitals.heartRate;
  if (bpEl) bpEl.textContent = `${pt.vitals.systolic}/${pt.vitals.diastolic}`;
  if (glucEl) glucEl.textContent = pt.vitals.glucose;
  if (spO2El) spO2El.textContent = pt.vitals.spO2;
  if (tempEl) tempEl.textContent = pt.vitals.temp;

  // Mini vitals in video consultation
  const vMiniHR = document.getElementById('videoMiniHR');
  const vMiniBP = document.getElementById('videoMiniBP');
  const vMiniSpO2 = document.getElementById('videoMiniSpO2');
  const vMiniGluc = document.getElementById('videoMiniGlucose');
  if (vMiniHR) vMiniHR.textContent = `${pt.vitals.heartRate} BPM`;
  if (vMiniBP) vMiniBP.textContent = `${pt.vitals.systolic}/${pt.vitals.diastolic} mmHg`;
  if (vMiniSpO2) vMiniSpO2.textContent = `${pt.vitals.spO2}%`;
  if (vMiniGluc) vMiniGluc.textContent = `${pt.vitals.glucose} mg/dL`;

  // Status Badges
  const hrBadge = document.getElementById('badgeLiveHR');
  if (hrBadge) {
    if (pt.vitals.heartRate > 100) {
      hrBadge.textContent = 'High (Tachycardia)';
      hrBadge.className = 'badge badge-critical';
    } else if (pt.vitals.heartRate < 60) {
      hrBadge.textContent = 'Low (Bradycardia)';
      hrBadge.className = 'badge badge-attention';
    } else {
      hrBadge.textContent = 'Normal';
      hrBadge.className = 'badge badge-normal';
    }
  }

  const spO2Badge = document.getElementById('badgeLiveSpO2');
  if (spO2Badge) {
    if (pt.vitals.spO2 < 94) {
      spO2Badge.textContent = 'Low Oxygen';
      spO2Badge.className = 'badge badge-critical';
    } else {
      spO2Badge.textContent = 'Optimal';
      spO2Badge.className = 'badge badge-normal';
    }
  }

  const timeEl = document.getElementById('liveLastUpdatedTime');
  if (timeEl) timeEl.textContent = getFormattedCurrentTime();
}

function initLiveContinuousChart() {
  const ctx = document.getElementById('liveContinuousChart');
  if (!ctx) return;

  if (liveContinuousChartInstance) {
    liveContinuousChartInstance.destroy();
  }

  liveContinuousChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appState.telemetryHistoryChartData.labels,
      datasets: [
        {
          label: 'Heart Rate (BPM)',
          data: appState.telemetryHistoryChartData.heartRate,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.35,
          yAxisID: 'y'
        },
        {
          label: 'Oxygen Saturation SpO2 (%)',
          data: appState.telemetryHistoryChartData.spO2,
          borderColor: '#7c3aed',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.35,
          yAxisID: 'y'
        },
        {
          label: 'Blood Glucose (mg/dL)',
          data: appState.telemetryHistoryChartData.glucose,
          borderColor: '#0d9488',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.35,
          yAxisID: 'y'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } } }
      }
    }
  });
}

// =============================================================================
// 9. M2M Architecture Transmission Simulation
// =============================================================================

let isM2mSimRunning = false;

function simulateM2mPipeline() {
  if (isM2mSimRunning) return;
  isM2mSimRunning = true;

  const btn = document.getElementById('btnSimulateM2mPipeline');
  if (btn) btn.disabled = true;

  const statusText = document.getElementById('m2mPipelineStatusText');
  const protoBadge = document.getElementById('m2mPipelineProtocolBadge');

  const stages = [
    { num: 1, text: 'Stage 1: Smart Biosensor (HR001) captures analog cardiac electrical potential.' },
    { num: 2, text: 'Stage 2: Wearable microcontroller samples, filters, and packages raw bio-data into frame.' },
    { num: 3, text: 'Stage 3: Edge-GW-01 ingests BLE frame and wraps into encrypted MQTT v5.0 JSON packet.' },
    { num: 4, text: 'Stage 4: Communication network (5G/Cellular) routes packet with TLS 1.3 payload encryption.' },
    { num: 5, text: 'Stage 5: M2M Healthcare Server receives packet, checks CRC32 parity, and issues PUBACK.' },
    { num: 6, text: 'Stage 6: Time-Series Database writes reading to persistent patient telemetry table.' },
    { num: 7, text: 'Stage 7: Doctor Dashboard & Patient App update live telemetry graph instantly via WebSocket.' }
  ];

  let currentStage = 0;

  function runStage() {
    if (currentStage > 0) {
      const prevNode = document.getElementById(`stageNode${currentStage}`);
      if (prevNode) {
        prevNode.classList.remove('active-stage');
        prevNode.classList.add('completed-stage');
      }
    }

    if (currentStage < stages.length) {
      const s = stages[currentStage];
      const currentNode = document.getElementById(`stageNode${s.num}`);
      const connector = document.getElementById(`stageConn${s.num}`);

      if (currentNode) currentNode.classList.add('active-stage');
      if (connector) connector.classList.add('flowing');

      if (statusText) statusText.textContent = s.text;

      currentStage++;
      setTimeout(runStage, 600);
    } else {
      // Completed all stages
      if (statusText) statusText.textContent = 'Transmission Complete: 100% Data Integrity Verified (QoS 1 Delivery Confirmed).';
      if (protoBadge) protoBadge.textContent = 'Status: ACK Received (200 OK)';

      // Append entry to live transmission log terminal
      appendTransmissionLog('HR001', 'P1001', 'Heart Rate', '79 BPM', 'MQTT v5.0', 'DELIVERED (ACK 200)');

      setTimeout(() => {
        // Reset node visual classes
        for (let i = 1; i <= 7; i++) {
          const n = document.getElementById(`stageNode${i}`);
          const c = document.getElementById(`stageConn${i}`);
          if (n) { n.classList.remove('active-stage', 'completed-stage'); }
          if (c) { c.classList.remove('flowing'); }
        }
        isM2mSimRunning = false;
        if (btn) btn.disabled = false;
      }, 2500);
    }
  }

  runStage();
}

function appendTransmissionLog(devId, ptId, type, val, protocol, status) {
  const terminal = document.getElementById('transmissionLogTerminal');
  if (!terminal) return;

  const now = getFormattedCurrentTime();
  const div = document.createElement('div');
  div.className = 'log-line';
  div.innerHTML = `
    <span class="log-time">[${now}]</span>
    <span class="log-dev">${devId}</span>
    <span class="log-pt">&lt;${ptId}&gt;</span>
    <span class="log-data">${type}: ${val}</span>
    <span style="color: #94a3b8;">${protocol}</span>
    <span class="log-status">${status}</span>
  `;
  terminal.prepend(div);

  // Keep max 40 entries
  while (terminal.children.length > 40) {
    terminal.removeChild(terminal.lastChild);
  }
}

// =============================================================================
// 10. User-Defined Protocol Studio
// =============================================================================

function setupProtocolStudio() {
  const ptSelect = document.getElementById('protoPatientId');
  if (ptSelect && ptSelect.children.length === 0) {
    ptSelect.innerHTML = '';
    appState.patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.id})`;
      ptSelect.appendChild(opt);
    });
  }

  const sensorSelect = document.getElementById('protoSelectSensor');
  if (sensorSelect) {
    sensorSelect.onchange = () => {
      const selected = sensorSelect.options[sensorSelect.selectedIndex];
      document.getElementById('protoDeviceId').value = selected.getAttribute('data-dev');
      document.getElementById('protoUnitValue').value = selected.getAttribute('data-unit');
      document.getElementById('protoReadingValue').value = selected.getAttribute('data-val');
      generateProtocolJson();
    };
  }

  const btnGen = document.getElementById('btnGenerateProtoMessage');
  if (btnGen) btnGen.onclick = generateProtocolJson;

  const btnSend = document.getElementById('btnSendProtoMessage');
  if (btnSend) btnSend.onclick = sendProtocolJson;
}

function generateProtocolJson() {
  const protocol = document.getElementById('protoSelectProtocol').value;
  const devId = document.getElementById('protoDeviceId').value.trim();
  const ptId = document.getElementById('protoPatientId').value;
  const sensorType = document.getElementById('protoSelectSensor').value;
  const reading = document.getElementById('protoReadingValue').value.trim();
  const unit = document.getElementById('protoUnitValue').value.trim();
  const msgType = document.getElementById('protoMessageType').value;
  const status = document.getElementById('protoDeviceStatus').value;

  const packet = {
    protocol_version: 'M2M-v2.1',
    transport: protocol,
    device_id: devId || 'HR001',
    patient_id: ptId || 'P1001',
    sensor_type: sensorType,
    reading: isNaN(reading) ? reading : Number(reading),
    unit: unit,
    timestamp: new Date().toISOString(),
    message_type: msgType,
    status: status,
    crc32_checksum: '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase()
  };

  const viewer = document.getElementById('protoCodeViewer');
  if (viewer) {
    viewer.textContent = JSON.stringify(packet, null, 2);
  }

  document.getElementById('protoPayloadChecksum').textContent = `Checksum: ${packet.crc32_checksum}`;
  return packet;
}

function sendProtocolJson() {
  const packet = generateProtocolJson();
  const ackPanel = document.getElementById('protoAckContent');
  const ackBadge = document.getElementById('protoAckStatusBadge');

  if (ackBadge) {
    ackBadge.textContent = 'Transmitting...';
    ackBadge.className = 'badge badge-attention';
  }

  setTimeout(() => {
    if (ackBadge) {
      ackBadge.textContent = 'ACK Received (200 OK)';
      ackBadge.className = 'badge badge-normal';
    }

    if (ackPanel) {
      ackPanel.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.65rem; color: var(--success-text); margin-bottom: 0.5rem;">
          <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>
          <strong>Packet Authenticated &amp; Stored Successfully</strong>
        </div>
        <div style="font-family: monospace; font-size: 0.78rem; color: var(--text-main); background: #ffffff; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
{
  "ack_status": "SUCCESS",
  "http_code": 200,
  "mqtt_topic": "remotecare/${packet.patient_id}/${packet.device_id}/vitals",
  "qos_level": 1,
  "server_rtt_ms": 16,
  "ingestion_timestamp": "${new Date().toISOString()}",
  "db_commit": "COMMITTED_TIME_SERIES_RECORD"
}
        </div>
      `;
      refreshLucideIcons();
    }

    appendTransmissionLog(packet.device_id, packet.patient_id, packet.sensor_type, `${packet.reading} ${packet.unit}`, packet.transport, 'ACK 200 OK');
  }, 400);
}

// =============================================================================
// 11. Alerts & Notifications Management
// =============================================================================

function renderAlerts() {
  const container = document.getElementById('alertsFullList');
  if (!container) return;

  const searchTerm = (document.getElementById('alertSearchInput')?.value || '').toLowerCase();
  const sevFilter = document.getElementById('alertSeverityFilter')?.value || 'all';
  const statFilter = document.getElementById('alertStatusFilter')?.value || 'all';

  const filtered = appState.alerts.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(searchTerm) ||
                          a.type.toLowerCase().includes(searchTerm) ||
                          a.deviceId.toLowerCase().includes(searchTerm);
    const matchesSev = sevFilter === 'all' || a.severity === sevFilter;
    const matchesStat = statFilter === 'all' || a.status === statFilter;
    return matchesSearch && matchesSev && matchesStat;
  });

  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<div class="card" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">No alerts matching your criteria.</div>';
    return;
  }

  filtered.forEach(a => {
    const card = document.createElement('div');
    card.className = `card`;
    card.style.borderLeft = `4px solid ${a.severity === 'critical' ? 'var(--danger)' : (a.severity === 'warning' ? 'var(--warning)' : 'var(--primary)')}`;

    let sevBadge = `<span class="badge badge-normal">${a.severity.toUpperCase()}</span>`;
    if (a.severity === 'critical') sevBadge = `<span class="badge badge-critical"><i data-lucide="alert-triangle" style="width:11px;height:11px;"></i> CRITICAL REVIEW</span>`;
    if (a.severity === 'warning') sevBadge = `<span class="badge badge-attention"><i data-lucide="alert-circle" style="width:11px;height:11px;"></i> REQUIRES REVIEW</span>`;

    let statusPill = `<span class="badge badge-disconnected">${a.status.toUpperCase()}</span>`;
    if (a.status === 'active') statusPill = `<span class="badge badge-critical">ACTIVE</span>`;
    if (a.status === 'reviewed') statusPill = `<span class="badge badge-attention">UNDER REVIEW</span>`;
    if (a.status === 'resolved') statusPill = `<span class="badge badge-normal">RESOLVED</span>`;

    card.innerHTML = `
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem;">
            ${sevBadge}
            ${statusPill}
            <span style="font-size: 0.72rem; color: var(--text-light);">${a.timestamp}</span>
          </div>
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main);">${a.type} – ${a.patientName} (${a.patientId})</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">${a.message}</p>
          <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.35rem;">
            Device: <strong>${a.deviceName} (${a.deviceId})</strong> • Reading: <strong style="color: var(--text-main);">${a.reading}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${a.status !== 'resolved' ? `
            <button class="btn btn-outline btn-sm btn-mark-alert-reviewed" data-id="${a.id}">Mark Reviewed</button>
            <button class="btn btn-secondary btn-sm btn-resolve-alert" data-id="${a.id}">Resolve Alert</button>
          ` : '<span style="font-size: 0.75rem; color: var(--success-text); font-weight: 600;">Resolved</span>'}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  updateAlertBadges();
  refreshLucideIcons();
}

function updateAlertBadges() {
  const activeCount = appState.alerts.filter(a => a.status === 'active').length;
  const sbBadge = document.getElementById('sidebarAlertBadge');
  const hBadge = document.getElementById('headerAlertBadge');

  if (sbBadge) {
    sbBadge.textContent = activeCount;
    sbBadge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  }
  if (hBadge) {
    hBadge.textContent = activeCount;
    hBadge.style.display = activeCount > 0 ? 'flex' : 'none';
  }
}

function resolveAlert(alertId) {
  const a = appState.alerts.find(al => al.id === alertId);
  if (a) {
    a.status = 'resolved';
    saveStateToStorage();
    renderAlerts();
    renderOverview();
  }
}

function markAlertReviewed(alertId) {
  const a = appState.alerts.find(al => al.id === alertId);
  if (a) {
    a.status = 'reviewed';
    saveStateToStorage();
    renderAlerts();
    renderOverview();
  }
}

function clearResolvedAlerts() {
  appState.alerts = appState.alerts.filter(a => a.status !== 'resolved');
  saveStateToStorage();
  renderAlerts();
  renderOverview();
}

// =============================================================================
// 12. Video Consultation Studio (Local WebRTC & Demonstration Mode)
// =============================================================================

let localMediaStream = null;
let isMicMuted = false;
let isCamOff = false;
let callDurationSeconds = 252; // start at 04:12 for demo realism
let callTimerInterval = null;

function setupVideoConsultationOnEnter() {
  startCallTimer();
  requestLocalCameraPreview();

  // Set remote participant name based on role
  const remName = document.getElementById('remoteParticipantName');
  const remMeta = document.getElementById('remoteParticipantMeta');
  const remAvatar = document.getElementById('remoteParticipantAvatar');

  if (appState.currentUser.role === 'doctor') {
    if (remName) remName.textContent = 'James Peterson (Patient)';
    if (remMeta) remMeta.textContent = 'Patient Connected via WebRTC • Biometrics Synced';
    if (remAvatar) remAvatar.textContent = 'JP';
  } else {
    if (remName) remName.textContent = 'Dr. Sarah Jenkins (Cardiologist)';
    if (remMeta) remMeta.textContent = 'Attending Physician Connected via WebRTC Room';
    if (remAvatar) remAvatar.textContent = 'SJ';
  }

  // Bind video side panel tabs
  document.querySelectorAll('.side-tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.side-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.side-tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    };
  });
}

function setupVideoCallForPatient(patientId) {
  const p = appState.patients.find(pt => pt.id === patientId);
  if (p) {
    const remName = document.getElementById('remoteParticipantName');
    const remAvatar = document.getElementById('remoteParticipantAvatar');
    if (remName) remName.textContent = `${p.name} (Patient)`;
    if (remAvatar) remAvatar.textContent = p.name.split(' ').map(n=>n[0]).join('');
  }
  navigateToPage('consultation');
}

function startCallTimer() {
  if (callTimerInterval) clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callDurationSeconds++;
    const mins = Math.floor(callDurationSeconds / 60).toString().padStart(2, '0');
    const secs = (callDurationSeconds % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById('videoCallTimer');
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

async function requestLocalCameraPreview() {
  const videoEl = document.getElementById('localVideoElement');
  const fallbackEl = document.getElementById('localVideoFallback');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (videoEl) videoEl.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'flex';
    return;
  }

  try {
    localMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoEl) {
      videoEl.srcObject = localMediaStream;
      videoEl.style.display = 'block';
    }
    if (fallbackEl) fallbackEl.style.display = 'none';
  } catch (err) {
    console.warn('Camera/mic access unavailable, activating simulated preview stream:', err);
    if (videoEl) videoEl.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'flex';
  }
}

function toggleMicrophone() {
  isMicMuted = !isMicMuted;
  if (localMediaStream) {
    localMediaStream.getAudioTracks().forEach(t => t.enabled = !isMicMuted);
  }
  const btn = document.getElementById('btnToggleMic');
  if (btn) {
    btn.classList.toggle('active-off', isMicMuted);
    btn.innerHTML = `<i data-lucide="${isMicMuted ? 'mic-off' : 'mic'}"></i>`;
    refreshLucideIcons();
  }
}

function toggleCamera() {
  isCamOff = !isCamOff;
  if (localMediaStream) {
    localMediaStream.getVideoTracks().forEach(t => t.enabled = !isCamOff);
  }
  const btn = document.getElementById('btnToggleCamera');
  if (btn) {
    btn.classList.toggle('active-off', isCamOff);
    btn.innerHTML = `<i data-lucide="${isCamOff ? 'video-off' : 'video'}"></i>`;
    refreshLucideIcons();
  }
}

function endConsultationCall() {
  if (confirm('End current video consultation session?')) {
    if (localMediaStream) {
      localMediaStream.getTracks().forEach(t => t.stop());
      localMediaStream = null;
    }
    if (callTimerInterval) clearInterval(callTimerInterval);
    alert('Consultation call ended. Clinical summary saved to session history.');
    navigateToPage('overview');
  }
}

function sendConsultationChat() {
  const input = document.getElementById('consultationChatInput');
  const msg = (input?.value || '').trim();
  if (!msg) return;

  const scroll = document.getElementById('consultationChatScroll');
  if (!scroll) return;

  const isDoc = appState.currentUser.role === 'doctor';
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${isDoc ? 'doctor' : 'patient'}`;
  bubble.innerHTML = `
    <strong>${appState.currentUser.name}:</strong> ${escapeHtml(msg)}
    <span class="chat-time-tag">${getFormattedCurrentTime()}</span>
  `;
  scroll.appendChild(bubble);
  input.value = '';
  scroll.scrollTop = scroll.scrollHeight;

  // Simulate automated clinical response after 1.5s
  setTimeout(() => {
    const autoBubble = document.createElement('div');
    autoBubble.className = `chat-bubble ${isDoc ? 'patient' : 'doctor'}`;
    const autoReply = isDoc 
      ? 'Thank you Doctor Jenkins, I am sitting down and breathing regularly now.'
      : 'Understood. Let us review your blood pressure trends and medication schedule.';
    autoBubble.innerHTML = `
      <strong>${isDoc ? 'James Peterson' : 'Dr. Sarah Jenkins'}:</strong> ${autoReply}
      <span class="chat-time-tag">${getFormattedCurrentTime()}</span>
    `;
    scroll.appendChild(autoBubble);
    scroll.scrollTop = scroll.scrollHeight;
  }, 1500);
}

function saveConsultationNotes() {
  const txt = document.getElementById('consultationNotesTextarea')?.value.trim();
  if (!txt) {
    alert('Please enter clinical notes before saving.');
    return;
  }
  // Append note to active patient record
  const pt = appState.patients[0];
  pt.consultations.unshift({
    date: getFormattedCurrentDate(),
    doctor: appState.currentUser.name,
    notes: txt
  });
  saveStateToStorage();
  alert('Clinical consultation notes successfully saved to patient medical record.');
}

// =============================================================================
// 13. Appointments Management
// =============================================================================

function renderAppointments() {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  appState.appointments.forEach(apt => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge badge-primary">${apt.id}</span></td>
      <td><strong>${apt.patientName}</strong> (${apt.patientId})</td>
      <td>${apt.doctor}</td>
      <td><strong>${apt.date}</strong> at ${apt.time}</td>
      <td>${apt.reason}</td>
      <td><span class="badge ${apt.status === 'scheduled' ? 'badge-normal' : 'badge-disconnected'}">${apt.status.toUpperCase()}</span></td>
      <td>
        <div style="display: flex; gap: 0.35rem;">
          <button class="btn btn-primary btn-sm btn-join-call-quick" data-id="${apt.id}">
            <i data-lucide="video"></i> Join
          </button>
          <button class="btn btn-outline btn-sm btn-cancel-appointment" data-id="${apt.id}" style="color: var(--danger);">
            Cancel
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  refreshLucideIcons();
}

function openScheduleModal() {
  const ptSelect = document.getElementById('schedPatientSelect');
  if (ptSelect) {
    ptSelect.innerHTML = '';
    appState.patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.id})`;
      ptSelect.appendChild(opt);
    });
  }

  // Default date to tomorrow
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  document.getElementById('schedDateInput').value = tom.toISOString().split('T')[0];

  document.getElementById('scheduleModal').classList.add('active');
}

function confirmScheduleAppointment() {
  const ptId = document.getElementById('schedPatientSelect').value;
  const pt = appState.patients.find(p => p.id === ptId);
  const doctor = document.getElementById('schedDoctorInput').value.trim();
  const date = document.getElementById('schedDateInput').value;
  const time = document.getElementById('schedTimeInput').value;
  const type = document.getElementById('schedTypeSelect').value;
  const reason = document.getElementById('schedReasonInput').value.trim();

  if (!date || !time) {
    alert('Please choose date and time slot.');
    return;
  }

  const newApt = {
    id: 'APT-' + (400 + appState.appointments.length + 1),
    patientId: ptId,
    patientName: pt ? pt.name : 'Unknown Patient',
    doctor: doctor || 'Dr. Sarah Jenkins',
    date: date,
    time: time,
    type: type,
    reason: reason || 'Routine biometric telehealth follow-up.',
    status: 'scheduled'
  };

  appState.appointments.push(newApt);
  saveStateToStorage();
  document.getElementById('scheduleModal').classList.remove('active');
  renderAppointments();
  renderOverview();
}

// =============================================================================
// 14. Patient History Explorer
// =============================================================================

let patientHistoryChartInstance = null;

function renderHistory() {
  const ptSelect = document.getElementById('historyPatientSelect');
  if (ptSelect && ptSelect.children.length === 0) {
    ptSelect.innerHTML = '';
    appState.patients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.id})`;
      ptSelect.appendChild(opt);
    });
  }

  const selectedPtId = ptSelect?.value || 'P1001';
  const pt = appState.patients.find(p => p.id === selectedPtId) || appState.patients[0];

  // Update history table
  const tbody = document.getElementById('historyTableBody');
  if (tbody && pt) {
    tbody.innerHTML = '';
    (pt.history || []).forEach(h => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${h.date}</strong> 08:30 AM</td>
        <td><span class="badge badge-normal">Daily Vitals Sync</span></td>
        <td>HR: ${h.heartRate} BPM, BP: ${h.bp}, Glucose: ${h.glucose} mg/dL, SpO2: ${h.spO2}%</td>
        <td>Dr. Sarah Jenkins</td>
        <td>${h.note}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  initHistoryChart(pt);
}

function initHistoryChart(pt) {
  const ctx = document.getElementById('patientHistoryChart');
  if (!ctx || !pt) return;

  if (patientHistoryChartInstance) {
    patientHistoryChartInstance.destroy();
  }

  const param = document.getElementById('historyParamSelect')?.value || 'heartRate';
  const labels = (pt.history || []).map(h => h.date);
  let dataset = [];
  let labelName = 'Heart Rate (BPM)';
  let color = '#ef4444';

  if (param === 'heartRate') {
    dataset = (pt.history || []).map(h => h.heartRate);
    labelName = 'Heart Rate (BPM)';
    color = '#ef4444';
  } else if (param === 'spO2') {
    dataset = (pt.history || []).map(h => h.spO2);
    labelName = 'Oxygen Saturation SpO2 (%)';
    color = '#7c3aed';
  } else if (param === 'glucose') {
    dataset = (pt.history || []).map(h => h.glucose);
    labelName = 'Blood Glucose (mg/dL)';
    color = '#0d9488';
  } else if (param === 'temperature') {
    dataset = (pt.history || []).map(h => h.temp);
    labelName = 'Body Temperature (°C)';
    color = '#f59e0b';
  } else {
    dataset = (pt.history || []).map(h => parseInt(h.bp.split('/')[0]));
    labelName = 'Systolic BP (mmHg)';
    color = '#0284c7';
  }

  patientHistoryChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: labelName,
        data: dataset,
        borderColor: color,
        backgroundColor: color + '15',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#f1f5f9' } }
      }
    }
  });
}

// =============================================================================
// 15. Network Reliability & Outage Simulation Lab
// =============================================================================

function setNetworkPreset(preset) {
  appState.network.preset = preset;
  const presets = {
    'excellent': { bw: 94.5, lat: 14, loss: 0.0, rssi: -58, name: 'Excellent (5G / Fiber)' },
    'good': { bw: 42.0, lat: 35, loss: 0.2, rssi: -72, name: 'Good (4G LTE)' },
    'moderate': { bw: 12.5, lat: 85, loss: 1.5, rssi: -84, name: 'Moderate (3G Mobile)' },
    'poor': { bw: 2.1, lat: 210, loss: 6.8, rssi: -96, name: 'Poor (Congested Edge)' },
    'unstable': { bw: 0.8, lat: 480, loss: 18.5, rssi: -108, name: 'Unstable (Intermittent)' }
  };

  const p = presets[preset] || presets.excellent;
  appState.network.bandwidth = p.bw;
  appState.network.latency = p.lat;
  appState.network.packetLoss = p.loss;
  appState.network.signal = p.rssi;

  document.getElementById('netBandwidthVal').innerHTML = `${p.bw} <span style="font-size: 0.85rem; font-weight: 500;">Mbps</span>`;
  document.getElementById('netLatencyVal').innerHTML = `${p.lat} <span style="font-size: 0.85rem; font-weight: 500;">ms</span>`;
  document.getElementById('netPacketLossVal').innerHTML = `${p.loss} <span style="font-size: 0.85rem; font-weight: 500;">%</span>`;
  document.getElementById('netSignalVal').innerHTML = `${p.rssi} <span style="font-size: 0.85rem; font-weight: 500;">dBm</span>`;

  document.getElementById('ribbonNetworkPreset').textContent = p.name;
  document.getElementById('ribbonLatency').textContent = `${p.lat}ms`;

  document.querySelectorAll('.preset-chip').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-preset') === preset);
  });
}

function simulateNetworkOutage() {
  appState.network.status = 'offline';
  document.getElementById('btnSimulateOutage').disabled = true;
  document.getElementById('btnRestoreNetwork').disabled = false;

  const headerPill = document.getElementById('headerM2mStatus');
  const headerText = document.getElementById('headerM2mText');
  if (headerPill) headerPill.className = 'm2m-health-pill down';
  if (headerText) headerText.textContent = 'M2M Ingestion: OFFLINE (Buffering)';

  document.getElementById('ribbonStatusText').textContent = 'TRANSPORT DOWN (Edge Offline Buffering Active)';
  alert('Simulated Network Outage Triggered. Ingestion transport is severed. All sensor telemetry will be buffered at Edge-GW-01 in local non-volatile FIFO RAM.');
}

function restoreNetworkAndFlushBuffer() {
  appState.network.status = 'online';
  document.getElementById('btnSimulateOutage').disabled = false;
  document.getElementById('btnRestoreNetwork').disabled = true;

  const headerPill = document.getElementById('headerM2mStatus');
  const headerText = document.getElementById('headerM2mText');
  if (headerPill) headerPill.className = 'm2m-health-pill';
  if (headerText) headerText.textContent = 'M2M Ingestion: Online';

  document.getElementById('ribbonStatusText').textContent = 'Operational (Edge-GW-01 Active)';

  const count = appState.network.buffer.length;
  // Flush buffer
  appState.network.buffer.forEach(pkt => {
    appendTransmissionLog(pkt.deviceId, pkt.patientId, pkt.type, pkt.val, 'RETRY (FIFO Flush)', 'DELIVERED (ACK 200)');
  });
  appState.network.buffer = [];

  const queueViewer = document.getElementById('bufferQueueViewer');
  const countBadge = document.getElementById('bufferCountBadge');
  if (countBadge) countBadge.textContent = '0 Buffered Items';
  if (queueViewer) {
    queueViewer.innerHTML = `<div style="color: var(--success-text); font-size: 0.78rem; text-align: center; margin: auto;">Network restored. ${count} buffered telemetry packets successfully flushed in FIFO order with zero data loss.</div>`;
  }
}

// =============================================================================
// 16. Reports & Analytics
// =============================================================================

let reportSeverityChartInstance = null;
let reportVolumeChartInstance = null;

function renderReports() {
  const ctxSev = document.getElementById('reportAlertSeverityChart');
  const ctxVol = document.getElementById('reportVolumeChart');

  if (reportSeverityChartInstance) reportSeverityChartInstance.destroy();
  if (reportVolumeChartInstance) reportVolumeChartInstance.destroy();

  if (ctxSev) {
    reportSeverityChartInstance = new Chart(ctxSev, {
      type: 'doughnut',
      data: {
        labels: ['Critical Review', 'Requires Review (Warning)', 'System Informational'],
        datasets: [{
          data: [
            appState.alerts.filter(a => a.severity === 'critical').length,
            appState.alerts.filter(a => a.severity === 'warning').length,
            appState.alerts.filter(a => a.severity === 'info').length
          ],
          backgroundColor: ['#ef4444', '#f59e0b', '#0284c7'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 10 } } }
        }
      }
    });
  }

  if (ctxVol) {
    reportVolumeChartInstance = new Chart(ctxVol, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Ingested Telemetry Packets',
          data: [2140, 2380, 2520, 2410, 2690, 2210, 2340],
          backgroundColor: '#0d9488',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f1f5f9' } }
        }
      }
    });
  }
}

function exportPatientMonitoringCsv() {
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Patient ID,Patient Name,Age,Gender,Assigned Doctor,Monitoring Status,Device ID,Heart Rate (BPM),Blood Pressure (mmHg),Blood Glucose (mg/dL),SpO2 (%),Temperature (C),Last Transmitted\n';

  appState.patients.forEach(p => {
    const row = [
      p.id,
      `"${p.name}"`,
      p.age,
      p.gender,
      `"${p.doctor}"`,
      p.monitoringStatus,
      p.deviceId,
      p.vitals.heartRate,
      `"${p.vitals.systolic}/${p.vitals.diastolic}"`,
      p.vitals.glucose,
      p.vitals.spO2,
      p.vitals.temp,
      `"${p.lastUpdated}"`
    ].join(',');
    csvContent += row + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `RemoteCare_Patient_Telemetry_Report_${getFormattedCurrentDate()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =============================================================================
// 17. Privacy & Security
// =============================================================================

function renderSecurity() {
  const tbody = document.getElementById('securityAuditTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  appState.securityAudit.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="font-family: monospace; font-size: 0.75rem;">${log.time}</span></td>
      <td><strong>${log.user}</strong></td>
      <td><span class="badge badge-normal">${log.action}</span></td>
      <td>${log.resource}</td>
      <td><span style="color: var(--text-muted); font-size: 0.72rem;">${log.context}</span></td>
      <td><span class="badge badge-normal">${log.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// =============================================================================
// 18. Continuous Real-Time Simulation Clock
// =============================================================================

function startSimulationHeartbeat() {
  setInterval(() => {
    // 1. Clock ribbon update
    const clockEl = document.getElementById('ribbonClock');
    if (clockEl) clockEl.textContent = getFormattedCurrentTime();

    // 2. Telemetry random walk for active connected patients
    appState.patients.forEach(pt => {
      if (pt.deviceStatus === 'connected') {
        // Natural biological drift
        const hrDrift = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        pt.vitals.heartRate = Math.max(50, Math.min(140, pt.vitals.heartRate + hrDrift));

        const spO2Drift = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        pt.vitals.spO2 = Math.max(90, Math.min(100, pt.vitals.spO2 + spO2Drift));

        const glucDrift = Math.floor(Math.random() * 3) - 1;
        pt.vitals.glucose = Math.max(70, Math.min(190, pt.vitals.glucose + glucDrift));

        pt.lastUpdated = 'Just now';

        // Check if buffer needed (if network offline)
        if (appState.network.status === 'offline') {
          appState.network.buffer.push({
            patientId: pt.id,
            deviceId: pt.deviceId,
            type: 'Heart Rate',
            val: `${pt.vitals.heartRate} BPM`,
            time: getFormattedCurrentTime()
          });

          const queueViewer = document.getElementById('bufferQueueViewer');
          const countBadge = document.getElementById('bufferCountBadge');
          if (countBadge) countBadge.textContent = `${appState.network.buffer.length} Buffered Items`;
          if (queueViewer) {
            queueViewer.innerHTML = appState.network.buffer.slice(-4).map(b => `
              <div style="font-size: 0.75rem; padding: 4px 8px; background: #ffffff; border-radius: 4px; border: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                <span>${b.deviceId} &lt;${b.patientId}&gt; ${b.type}: ${b.val}</span>
                <span style="color: var(--text-light);">${b.time}</span>
              </div>
            `).join('');
          }
        }
      }
    });

    // 3. Update device card readings
    appState.devices.forEach(dev => {
      if (dev.status === 'connected') {
        const pt = appState.patients.find(p => p.id === dev.patientId);
        if (pt) {
          if (dev.type === 'Heart Rate') dev.reading = pt.vitals.heartRate;
          else if (dev.type === 'Blood Glucose') dev.reading = pt.vitals.glucose;
          else if (dev.type === 'Pulse Oximetry') dev.reading = pt.vitals.spO2;
          else if (dev.type === 'Blood Pressure') dev.reading = `${pt.vitals.systolic}/${pt.vitals.diastolic}`;
        }
      }
    });

    // 4. Update live view numbers if active
    const activeView = document.querySelector('.page-view.active');
    if (activeView && activeView.id === 'live-telemetry') {
      updateLiveNumbersDisplay();

      // Push real-time point to chart
      if (liveContinuousChartInstance && appState.patients[0]) {
        const now = getFormattedCurrentTime().substring(0, 5);
        const pt = appState.patients[0];
        const data = liveContinuousChartInstance.data;

        data.labels.push(now);
        data.datasets[0].data.push(pt.vitals.heartRate);
        data.datasets[1].data.push(pt.vitals.spO2);
        data.datasets[2].data.push(pt.vitals.glucose);

        if (data.labels.length > 12) {
          data.labels.shift();
          data.datasets[0].data.shift();
          data.datasets[1].data.shift();
          data.datasets[2].data.shift();
        }
        liveContinuousChartInstance.update('none');
      }
    }
  }, appState.settings.interval);
}

// =============================================================================
// 19. Event Listeners & Initialization
// =============================================================================

function initializeEventListeners() {
  // Sidebar navigation clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.getAttribute('data-page');
      if (page) navigateToPage(page);
    });
  });

  // Sidebar toggle / collapse
  const sidebarBtn = document.getElementById('sidebarCollapseBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('appSidebar');

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Header quick buttons
  document.getElementById('headerAlertBtn')?.addEventListener('click', () => navigateToPage('alerts'));
  document.getElementById('headerVideoShortcutBtn')?.addEventListener('click', () => navigateToPage('consultation'));

  // Role Switcher buttons
  document.getElementById('btnRoleDoctor')?.addEventListener('click', () => setUserRole('doctor'));
  document.getElementById('btnRolePatient')?.addEventListener('click', () => setUserRole('patient'));

  // Logout / Switch User Overlay
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    document.getElementById('loginOverlay').classList.add('active');
  });

  document.getElementById('btnQuickLoginDoctor')?.addEventListener('click', () => {
    setUserRole('doctor');
    document.getElementById('loginOverlay').classList.remove('active');
  });

  document.getElementById('btnQuickLoginPatient')?.addEventListener('click', () => {
    setUserRole('patient');
    document.getElementById('loginOverlay').classList.remove('active');
  });

  document.getElementById('manualLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.toLowerCase();
    if (email.includes('patient')) {
      setUserRole('patient');
    } else {
      setUserRole('doctor');
    }
    document.getElementById('loginOverlay').classList.remove('active');
  });

  document.getElementById('btnTogglePassword')?.addEventListener('click', () => {
    const pw = document.getElementById('loginPassword');
    const btn = document.getElementById('btnTogglePassword');
    if (pw.type === 'password') {
      pw.type = 'text';
      btn.textContent = 'Hide';
    } else {
      pw.type = 'password';
      btn.textContent = 'Show';
    }
  });

  // Overview quick actions
  document.getElementById('btnOverviewGoDevices')?.addEventListener('click', () => navigateToPage('devices'));
  document.getElementById('btnOverviewSimulatePacket')?.addEventListener('click', () => navigateToPage('architecture'));
  document.getElementById('btnViewAllPatients')?.addEventListener('click', () => navigateToPage('patients'));
  document.getElementById('btnOverviewViewAlerts')?.addEventListener('click', () => navigateToPage('alerts'));
  document.getElementById('btnOverviewBookCall')?.addEventListener('click', openScheduleModal);

  // Overview trend chart selectors
  document.getElementById('overviewTrendPatientSelect')?.addEventListener('change', initOverviewTrendChart);
  document.getElementById('overviewTrendMetricSelect')?.addEventListener('change', initOverviewTrendChart);

  // Patient Monitoring toolbar
  document.getElementById('patientSearchInput')?.addEventListener('input', renderPatients);
  document.getElementById('patientStatusFilter')?.addEventListener('change', renderPatients);
  document.getElementById('patientDeviceFilter')?.addEventListener('change', renderPatients);

  document.getElementById('btnTogglePatientView')?.addEventListener('click', () => {
    isPatientTableView = !isPatientTableView;
    document.getElementById('patientCardsContainer').style.display = isPatientTableView ? 'none' : 'grid';
    document.getElementById('patientTableContainer').style.display = isPatientTableView ? 'block' : 'none';
    document.getElementById('viewToggleLabel').textContent = isPatientTableView ? 'Cards View' : 'Table View';
  });

  document.getElementById('btnOpenAddPatientModal')?.addEventListener('click', openAddPatientModal);
  document.getElementById('btnSavePatientForm')?.addEventListener('click', savePatientForm);
  document.getElementById('btnConfirmDeletePatient')?.addEventListener('click', confirmDeletePatient);

  // Dynamic patient card actions via delegation
  document.addEventListener('click', (e) => {
    const btnMonitor = e.target.closest('.btn-open-patient-modal');
    if (btnMonitor) {
      const id = btnMonitor.getAttribute('data-id');
      openPatientDetailModal(id);
      return;
    }

    const btnEdit = e.target.closest('.btn-edit-patient');
    if (btnEdit) {
      const id = btnEdit.getAttribute('data-id');
      openEditPatientModal(id);
      return;
    }

    const btnDel = e.target.closest('.btn-delete-patient');
    if (btnDel) {
      const id = btnDel.getAttribute('data-id');
      promptDeletePatient(id);
      return;
    }

    const btnDeviceConn = e.target.closest('.btn-toggle-device-conn');
    if (btnDeviceConn) {
      const id = btnDeviceConn.getAttribute('data-id');
      toggleDeviceConnection(id);
      return;
    }

    const btnJoinQuick = e.target.closest('.btn-join-call-quick');
    if (btnJoinQuick) {
      navigateToPage('consultation');
      return;
    }

    const btnResolveAlt = e.target.closest('.btn-resolve-alert');
    if (btnResolveAlt) {
      const id = btnResolveAlt.getAttribute('data-id');
      resolveAlert(id);
      return;
    }

    const btnReviewAlt = e.target.closest('.btn-mark-alert-reviewed');
    if (btnReviewAlt) {
      const id = btnReviewAlt.getAttribute('data-id');
      markAlertReviewed(id);
      return;
    }

    const btnCancelApt = e.target.closest('.btn-cancel-appointment');
    if (btnCancelApt) {
      const id = btnCancelApt.getAttribute('data-id');
      appState.appointments = appState.appointments.filter(a => a.id !== id);
      saveStateToStorage();
      renderAppointments();
      return;
    }
  });

  // Modal close triggers
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const m = document.getElementById(modalId);
      if (m) m.classList.remove('active');
    });
  });

  // Live Telemetry actions
  document.getElementById('livePatientSelect')?.addEventListener('change', updateLiveNumbersDisplay);
  document.getElementById('btnSimulateTachycardia')?.addEventListener('click', () => {
    const pt = appState.patients[0];
    pt.vitals.heartRate = 124;
    updateLiveNumbersDisplay();
    // Add alert
    appState.alerts.unshift({
      id: 'ALT-' + (900 + appState.alerts.length + 1),
      patientId: pt.id,
      patientName: pt.name,
      deviceId: pt.deviceId,
      deviceName: 'Smart Heart Rate Sensor',
      type: 'Acute Tachycardia Event',
      reading: '124 BPM',
      severity: 'critical',
      status: 'active',
      timestamp: getFormattedCurrentTime(),
      message: 'Demonstration heart rate surge exceeding safety threshold (100 BPM).'
    });
    saveStateToStorage();
    updateAlertBadges();
  });

  document.getElementById('btnSimulateSpO2Drop')?.addEventListener('click', () => {
    const pt = appState.patients[0];
    pt.vitals.spO2 = 89;
    updateLiveNumbersDisplay();
    appState.alerts.unshift({
      id: 'ALT-' + (900 + appState.alerts.length + 1),
      patientId: pt.id,
      patientName: pt.name,
      deviceId: pt.deviceId,
      deviceName: 'Pulse Oximeter',
      type: 'Hypoxemia Desaturation',
      reading: '89 %',
      severity: 'critical',
      status: 'active',
      timestamp: getFormattedCurrentTime(),
      message: 'Critical oxygen desaturation below threshold (94%). Clinical assessment recommended.'
    });
    saveStateToStorage();
    updateAlertBadges();
  });

  // M2M Architecture Simulator
  document.getElementById('btnSimulateM2mPipeline')?.addEventListener('click', simulateM2mPipeline);
  document.getElementById('btnClearTransmissionLog')?.addEventListener('click', () => {
    const term = document.getElementById('transmissionLogTerminal');
    if (term) term.innerHTML = '';
  });

  // Devices page actions
  document.getElementById('btnRestartAllDevices')?.addEventListener('click', () => {
    appState.devices.forEach(d => {
      d.status = 'connected';
      d.battery = 95;
    });
    appState.patients.forEach(p => p.deviceStatus = 'connected');
    saveStateToStorage();
    renderDevices();
    renderOverview();
    alert('All 5 medical devices re-initialized and transmitting.');
  });

  // Video Consultation controls
  document.getElementById('btnToggleMic')?.addEventListener('click', toggleMicrophone);
  document.getElementById('btnToggleCamera')?.addEventListener('click', toggleCamera);
  document.getElementById('btnToggleSpeaker')?.addEventListener('click', () => {
    alert('Speaker audio toggled.');
  });
  document.getElementById('btnShareScreen')?.addEventListener('click', () => {
    alert('Screen sharing activated: Patient health telemetry chart shared to conference stage.');
  });
  document.getElementById('btnEndConsultation')?.addEventListener('click', endConsultationCall);
  document.getElementById('btnSendConsultationChat')?.addEventListener('click', sendConsultationChat);
  document.getElementById('consultationChatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendConsultationChat();
  });
  document.getElementById('btnSaveConsultationNotes')?.addEventListener('click', saveConsultationNotes);

  // Appointments
  document.getElementById('btnOpenScheduleModal')?.addEventListener('click', openScheduleModal);
  document.getElementById('btnConfirmSchedule')?.addEventListener('click', confirmScheduleAppointment);

  // History Explorer
  document.getElementById('historyPatientSelect')?.addEventListener('change', renderHistory);
  document.getElementById('historyParamSelect')?.addEventListener('change', renderHistory);
  document.getElementById('btnExportPatientHistoryCsv')?.addEventListener('click', exportPatientMonitoringCsv);

  // Network Presets
  document.querySelectorAll('.preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-preset');
      setNetworkPreset(p);
    });
  });

  document.getElementById('btnSimulateOutage')?.addEventListener('click', simulateNetworkOutage);
  document.getElementById('btnRestoreNetwork')?.addEventListener('click', restoreNetworkAndFlushBuffer);

  // Alerts Actions
  document.getElementById('alertSearchInput')?.addEventListener('input', renderAlerts);
  document.getElementById('alertSeverityFilter')?.addEventListener('change', renderAlerts);
  document.getElementById('alertStatusFilter')?.addEventListener('change', renderAlerts);
  document.getElementById('btnClearResolvedAlerts')?.addEventListener('click', clearResolvedAlerts);

  document.getElementById('btnOpenThresholdConfig')?.addEventListener('click', () => {
    document.getElementById('threshMaxHR').value = appState.thresholds.maxHR;
    document.getElementById('threshMinHR').value = appState.thresholds.minHR;
    document.getElementById('threshMaxBP').value = appState.thresholds.maxBP;
    document.getElementById('threshMinSpO2').value = appState.thresholds.minSpO2;
    document.getElementById('threshMaxGlucose').value = appState.thresholds.maxGlucose;
    document.getElementById('thresholdModal').classList.add('active');
  });

  document.getElementById('btnSaveThresholds')?.addEventListener('click', () => {
    appState.thresholds.maxHR = Number(document.getElementById('threshMaxHR').value);
    appState.thresholds.minHR = Number(document.getElementById('threshMinHR').value);
    appState.thresholds.maxBP = Number(document.getElementById('threshMaxBP').value);
    appState.thresholds.minSpO2 = Number(document.getElementById('threshMinSpO2').value);
    appState.thresholds.maxGlucose = Number(document.getElementById('threshMaxGlucose').value);
    saveStateToStorage();
    document.getElementById('thresholdModal').classList.remove('active');
    alert('Demonstration thresholds updated successfully.');
  });

  // Reports Actions
  document.getElementById('btnPrintReport')?.addEventListener('click', () => window.print());
  document.getElementById('btnExportFullCsv')?.addEventListener('click', exportPatientMonitoringCsv);

  // Settings: Reset Demo Data
  document.getElementById('btnResetDemoData')?.addEventListener('click', () => {
    if (confirm('Reset all demonstration data and restore default records?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  // Global search input
  document.getElementById('globalSearchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim().toLowerCase();
      if (q) {
        navigateToPage('patients');
        const pSearch = document.getElementById('patientSearchInput');
        if (pSearch) {
          pSearch.value = q;
          renderPatients();
        }
      }
    }
  });
}

// =============================================================================
// 20. Utility Helpers
// =============================================================================

function refreshLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function getFormattedCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

function getFormattedCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// =============================================================================
// Application Entry Point
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  initializeEventListeners();
  setupProtocolStudio();

  // Populate initial stream log terminal
  appendTransmissionLog('HR001', 'P1003', 'Heart Rate', '106 BPM', 'MQTT v5.0', 'DELIVERED (ACK 200)');
  appendTransmissionLog('BP002', 'P1002', 'Blood Pressure', '122/80 mmHg', 'CoAP Confirmable', 'DELIVERED (2.05 Content)');
  appendTransmissionLog('GM003', 'P1004', 'Blood Glucose', '104 mg/dL', 'RESTful HTTP', 'DELIVERED (200 OK)');

  // Initial renders
  renderOverview();
  updateAlertBadges();
  startSimulationHeartbeat();
  refreshLucideIcons();

  console.log('RemoteCare M2M Healthcare System initialized successfully.');
});
