/**
 * UniMed Connect - Integrated Web Services & Multimedia Platform
 * JavaScript Application Logic & Simulated Java SOAP / WebRTC Engine
 */

// ========================================================
// 1. Initial State & Seed Data Management (localStorage)
// ========================================================

const STORAGE_KEYS = {
  STUDENTS: 'unimed_students',
  PATIENTS: 'unimed_patients',
  DOCTORS: 'unimed_doctors',
  COURSES: 'unimed_courses',
  APPOINTMENTS: 'unimed_appointments',
  TRANSACTIONS: 'unimed_transactions',
  UCP_LOGS: 'unimed_ucp_logs',
  SERVICES: 'unimed_services',
  USER: 'unimed_current_user'
};

const DEFAULT_USERS = {
  student: {
    id: 'STU1001',
    name: 'Sarah Chen',
    role: 'Student',
    department: 'Computer Science',
    email: 'sarah.chen@university.edu',
    avatar: 'SC'
  },
  teacher: {
    id: 'FAC2004',
    name: 'Prof. Marcus Vance',
    role: 'Teacher',
    department: 'Telemedicine & CS',
    email: 'm.vance@university.edu',
    avatar: 'MV'
  },
  doctor: {
    id: 'DOC3001',
    name: 'Dr. Elena Rostova',
    role: 'Doctor',
    department: 'Cardiovascular Medicine',
    email: 'e.rostova@hospital.unimed.org',
    avatar: 'ER'
  },
  patient: {
    id: 'PAT4001',
    name: 'James Wilson',
    role: 'Patient',
    department: 'Cardiology Patient',
    email: 'james.wilson@demo.com',
    avatar: 'JW'
  },
  admin: {
    id: 'ADM9001',
    name: 'System Administrator',
    role: 'Administrator',
    department: 'IT & Infrastructure',
    email: 'admin@unimedconnect.org',
    avatar: 'SA'
  }
};

const INITIAL_DATA = {
  students: [
    { studentId: 'STU1001', name: 'Sarah Chen', department: 'Computer Science', yearOfStudy: 3, email: 'sarah.chen@university.edu', attendanceRate: 94.5, cgpa: 3.88, enrolledCoursesCount: 5, courses: ['CS405', 'HI301', 'CS310'], grades: [{ code: 'CS405', name: 'Distributed Web Services', grade: 'A', marks: 93 }, { code: 'HI301', name: 'EHR Standards', grade: 'A-', marks: 89 }] },
    { studentId: 'STU1002', name: 'Liam O\'Connor', department: 'Health Informatics', yearOfStudy: 2, email: 'liam.oc@university.edu', attendanceRate: 88.2, cgpa: 3.65, enrolledCoursesCount: 4, courses: ['HI301', 'HI202'], grades: [{ code: 'HI301', name: 'EHR Standards', grade: 'B+', marks: 84 }] },
    { studentId: 'STU1003', name: 'Amina Yusuf', department: 'Biomedical Engineering', yearOfStudy: 4, email: 'amina.yusuf@university.edu', attendanceRate: 96.0, cgpa: 3.92, enrolledCoursesCount: 6, courses: ['BME410', 'CS405'], grades: [{ code: 'BME410', name: 'Medical Imaging', grade: 'A+', marks: 97 }] },
    { studentId: 'STU1004', name: 'Carlos Rivera', department: 'Nursing & Health Sciences', yearOfStudy: 1, email: 'carlos.r@university.edu', attendanceRate: 82.75, cgpa: 3.40, enrolledCoursesCount: 4, courses: ['NUR204'], grades: [{ code: 'NUR204', name: 'Clinical Patient Care', grade: 'B', marks: 82 }] },
    { studentId: 'STU1005', name: 'Mei-Ling Zhou', department: 'Computer Science', yearOfStudy: 2, email: 'ml.zhou@university.edu', attendanceRate: 91.0, cgpa: 3.75, enrolledCoursesCount: 5, courses: ['CS405', 'CS310'], grades: [{ code: 'CS405', name: 'Distributed Web Services', grade: 'A-', marks: 88 }] }
  ],
  doctors: [
    { doctorId: 'DOC3001', name: 'Dr. Elena Rostova', specialization: 'Cardiovascular Medicine & Telehealth', department: 'Cardiology', email: 'e.rostova@hospital.unimed.org', fee: 75.0, status: 'AVAILABLE', rating: 4.95, experience: '14 Years' },
    { doctorId: 'DOC3002', name: 'Dr. Jonathan Vance', specialization: 'Clinical Neurology & Tele-Stroke', department: 'Neurology', email: 'j.vance@hospital.unimed.org', fee: 90.0, status: 'AVAILABLE', rating: 4.88, experience: '18 Years' },
    { doctorId: 'DOC3003', name: 'Dr. Sophia Patel', specialization: 'General Pediatrics & Adolescent Care', department: 'Pediatrics', email: 's.patel@hospital.unimed.org', fee: 65.0, status: 'IN_CONSULTATION', rating: 4.92, experience: '11 Years' },
    { doctorId: 'DOC3004', name: 'Dr. Tariq Al-Mansoor', specialization: 'Internal Medicine & Chronic Disease', department: 'General Medicine', email: 't.almansoor@hospital.unimed.org', fee: 70.0, status: 'AVAILABLE', rating: 4.85, experience: '16 Years' }
  ],
  patients: [
    { patientId: 'PAT4001', name: 'James Wilson', age: 48, gender: 'Male', department: 'Cardiology', doctorId: 'DOC3001', doctorName: 'Dr. Elena Rostova', phone: '+1 (555) 234-8901', condition: 'Stage 1 Hypertension & Arrhythmia', status: 'ACTIVE', lastVisit: '2026-11-10', vitals: { bp: '132/84', hr: '74 bpm', spo2: '98%', temp: '98.4 F' }, notes: 'Patient reports improved tolerance with ACE inhibitors. Continuing bi-weekly telehealth ECG monitoring.' },
    { patientId: 'PAT4002', name: 'Eleanor Vance', age: 62, gender: 'Female', department: 'Neurology', doctorId: 'DOC3002', doctorName: 'Dr. Jonathan Vance', phone: '+1 (555) 876-1122', condition: 'Mild Cognitive Impairment Review', status: 'ACTIVE', lastVisit: '2026-11-05', vitals: { bp: '124/78', hr: '68 bpm', spo2: '99%', temp: '98.6 F' }, notes: 'Stable memory metrics. Regular telehealth cognitive exercises assigned.' },
    { patientId: 'PAT4003', name: 'Noah Campbell', age: 9, gender: 'Male', department: 'Pediatrics', doctorId: 'DOC3003', doctorName: 'Dr. Sophia Patel', phone: '+1 (555) 432-9087', condition: 'Pediatric Asthma Management', status: 'ACTIVE', lastVisit: '2026-10-28', vitals: { bp: '106/70', hr: '88 bpm', spo2: '97%', temp: '98.7 F' }, notes: 'Inhaler dosage adjusted for seasonal changes. Next check-in scheduled via video.' },
    { patientId: 'PAT4004', name: 'Fatima Zahra', age: 34, gender: 'Female', department: 'General Medicine', doctorId: 'DOC3004', doctorName: 'Dr. Tariq Al-Mansoor', phone: '+1 (555) 901-2244', condition: 'Type 2 Diabetes Routine Care', status: 'PENDING', lastVisit: '2026-11-18', vitals: { bp: '120/80', hr: '72 bpm', spo2: '98%', temp: '98.5 F' }, notes: 'Fasting glucose logs reviewed. Dietary compliance good.' }
  ],
  courses: [
    { code: 'CS405', name: 'Distributed Systems & Web Services', department: 'Computer Science', credits: 4, instructor: 'Prof. Marcus Vance', schedule: 'Mon/Wed 10:00 - 11:30 AM', students: 28, enrolled: true },
    { code: 'HI301', name: 'Electronic Health Records & Standards', department: 'Health Informatics', credits: 3, instructor: 'Dr. Aris Thorne', schedule: 'Tue/Thu 02:00 - 03:30 PM', students: 22, enrolled: true },
    { code: 'BME410', name: 'Medical Imaging Systems & Telehealth', department: 'Biomedical Engineering', credits: 4, instructor: 'Prof. Clara Higgins', schedule: 'Mon/Fri 09:00 - 10:30 AM', students: 19, enrolled: false },
    { code: 'NUR204', name: 'Clinical Patient Care & Documentation', department: 'Nursing & Health Sciences', credits: 3, instructor: 'Dr. Elena Rostova', schedule: 'Wed/Fri 01:00 - 02:30 PM', students: 25, enrolled: false }
  ],
  appointments: [
    { id: 'APT-8801', patientId: 'PAT4001', patientName: 'James Wilson', doctorId: 'DOC3001', doctorName: 'Dr. Elena Rostova', department: 'Cardiology', date: '2026-11-22', time: '10:00 AM', reason: 'Bi-weekly Telehealth Blood Pressure Evaluation', status: 'UPCOMING' },
    { id: 'APT-8802', patientId: 'PAT4002', patientName: 'Eleanor Vance', doctorId: 'DOC3002', doctorName: 'Dr. Jonathan Vance', department: 'Neurology', date: '2026-11-22', time: '11:30 AM', reason: 'Neurological motor assessment and scan review', status: 'UPCOMING' },
    { id: 'APT-8803', patientId: 'PAT4003', patientName: 'Noah Campbell', doctorId: 'DOC3003', doctorName: 'Dr. Sophia Patel', department: 'Pediatrics', date: '2026-11-23', time: '02:00 PM', reason: 'Follow-up on inhaler dosage and spirometry', status: 'UPCOMING' },
    { id: 'APT-8790', patientId: 'PAT4004', patientName: 'Fatima Zahra', doctorId: 'DOC3004', doctorName: 'Dr. Tariq Al-Mansoor', department: 'General Medicine', date: '2026-11-18', time: '09:00 AM', reason: 'Blood glucose monitoring and nutritional guidance', status: 'COMPLETED' },
    { id: 'APT-8785', patientId: 'PAT4001', patientName: 'James Wilson', doctorId: 'DOC3001', doctorName: 'Dr. Elena Rostova', department: 'Cardiology', date: '2026-11-04', time: '03:00 PM', reason: 'Post-medication adjustment checkup', status: 'COMPLETED' }
  ],
  services: [
    { id: 'SVC-STU', name: 'Student Information Service', provider: 'com.unimedconnect.student.StudentService', endpoint: 'http://localhost:8081/ws/student', targetNamespace: 'http://unimedconnect.com/student', operations: ['getStudentById', 'getAllStudents', 'getAttendance', 'getResults'], status: 'ACTIVE', latency: '68 ms', lastTested: 'Just now' },
    { id: 'SVC-HLT', name: 'Healthcare Service', provider: 'com.unimedconnect.healthcare.HealthcareService', endpoint: 'http://localhost:8081/ws/healthcare', targetNamespace: 'http://unimedconnect.com/healthcare', operations: ['getPatientById', 'getDoctorDetails', 'getAppointments', 'bookAppointment'], status: 'ACTIVE', latency: '82 ms', lastTested: 'Just now' },
    { id: 'SVC-CLS', name: 'Classroom Service', provider: 'com.unimedconnect.classroom.ClassroomService', endpoint: 'http://localhost:8081/ws/classroom', targetNamespace: 'http://unimedconnect.com/classroom', operations: ['getCourseDetails', 'getClassSchedule', 'getEnrolledStudents'], status: 'ACTIVE', latency: '54 ms', lastTested: 'Just now' },
    { id: 'SVC-VID', name: 'Video Session Service', provider: 'com.unimedconnect.video.VideoSessionService', endpoint: 'http://localhost:8081/ws/video', targetNamespace: 'http://unimedconnect.com/video', operations: ['createSession', 'joinSession', 'endSession', 'getSessionStatus'], status: 'ACTIVE', latency: '42 ms', lastTested: 'Just now' }
  ],
  transactions: [
    { id: 'TXN-9011', service: 'StudentService', operation: 'getStudentById', consumer: 'UniversityPortal', status: 200, time: 84, timestamp: '14:32:10' },
    { id: 'TXN-9012', service: 'HealthcareService', operation: 'getPatientById', consumer: 'HospitalEHR', status: 200, time: 112, timestamp: '14:35:45' },
    { id: 'TXN-9013', service: 'ClassroomService', operation: 'getCourseDetails', consumer: 'ElearningApp', status: 200, time: 76, timestamp: '14:40:02' },
    { id: 'TXN-9014', service: 'VideoSessionService', operation: 'getSessionStatus', consumer: 'VideoGateway', status: 200, time: 45, timestamp: '14:42:19' }
  ],
  ucpLogs: [
    { id: 'MSG1001', sender: 'UniversityApp', receiver: 'StudentService', serviceType: 'ACADEMIC', operation: 'getStudentById', priority: 'NORMAL', status: 'ACK_RECEIVED', timestamp: '2026-11-21T14:30:00' },
    { id: 'MSG1002', sender: 'HospitalEHR', receiver: 'HealthcareService', serviceType: 'HEALTHCARE', operation: 'getPatientById', priority: 'HIGH', status: 'ACK_RECEIVED', timestamp: '2026-11-21T14:32:15' }
  ]
};

// State Store Helper
const Store = {
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Storage read failed', e);
      return null;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  },
  init() {
    if (!this.get(STORAGE_KEYS.STUDENTS)) this.set(STORAGE_KEYS.STUDENTS, INITIAL_DATA.students);
    if (!this.get(STORAGE_KEYS.DOCTORS)) this.set(STORAGE_KEYS.DOCTORS, INITIAL_DATA.doctors);
    if (!this.get(STORAGE_KEYS.PATIENTS)) this.set(STORAGE_KEYS.PATIENTS, INITIAL_DATA.patients);
    if (!this.get(STORAGE_KEYS.COURSES)) this.set(STORAGE_KEYS.COURSES, INITIAL_DATA.courses);
    if (!this.get(STORAGE_KEYS.APPOINTMENTS)) this.set(STORAGE_KEYS.APPOINTMENTS, INITIAL_DATA.appointments);
    if (!this.get(STORAGE_KEYS.SERVICES)) this.set(STORAGE_KEYS.SERVICES, INITIAL_DATA.services);
    if (!this.get(STORAGE_KEYS.TRANSACTIONS)) this.set(STORAGE_KEYS.TRANSACTIONS, INITIAL_DATA.transactions);
    if (!this.get(STORAGE_KEYS.UCP_LOGS)) this.set(STORAGE_KEYS.UCP_LOGS, INITIAL_DATA.ucpLogs);
    if (!this.get(STORAGE_KEYS.USER)) this.set(STORAGE_KEYS.USER, DEFAULT_USERS.admin);
  },
  resetAll() {
    localStorage.clear();
    this.init();
    showToast('All sample data has been reset to defaults.', 'success');
    setTimeout(() => window.location.reload(), 600);
  }
};

// ========================================================
// 2. Global UI Utilities & Toast Notifications
// ========================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'warning') iconName = 'alert-triangle';
  if (type === 'error') iconName = 'alert-circle';

  toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Navigation & Page Switching
function navigateTo(pageId) {
  // Update nav item active states
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Hide all views, display active view
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update header titles
  const titles = {
    'overview': { title: 'Platform Overview', subtitle: 'Integrated Academic & Healthcare Activity Dashboard' },
    'student-services': { title: 'Student Information Services', subtitle: 'Academic records, enrollment, attendance and performance' },
    'healthcare-services': { title: 'Healthcare Services', subtitle: 'Patient records, clinical departments and doctor directory' },
    'online-classroom': { title: 'Online Classroom Studio', subtitle: 'Live collaborative e-learning with simulated streaming & chat' },
    'doctor-consultation': { title: 'Doctor Telehealth Consultation', subtitle: 'Secure video consultations with real-time camera preview & clinical notes' },
    'appointments': { title: 'Consultation Appointments', subtitle: 'Schedule and manage patient doctor appointments' },
    'video-conferencing': { title: 'Video Conferencing Center', subtitle: 'Multi-room WebRTC conference sessions and signaling monitor' },
    'system-architecture': { title: 'Integrated System Architecture', subtitle: 'Interactive diagram of web services, WSDL, registry, and multimedia tiers' },
    'web-service-center': { title: 'Java Web Service Center', subtitle: 'Service registry, endpoints, operations, and dynamic publishing' },
    'wsdl-explorer': { title: 'WSDL Document Explorer', subtitle: 'Inspect definitions, types, messages, portTypes, and bindings with sample SOAP' },
    'soap-tester': { title: 'API / SOAP Request & Response Tester', subtitle: 'Interactive client to execute simulated SOAP operations with live XML output' },
    'communication-protocol': { title: 'UniMed Communication Protocol (UCP)', subtitle: 'Application-level messaging standard with 12-field schema and validation' },
    'streaming-optimizer': { title: 'Video Streaming & Buffer Optimizer', subtitle: 'Adaptive bitrate (ABR) simulation and dynamic buffer health management' },
    'traffic-allocator': { title: 'Bandwidth & Traffic Prioritization', subtitle: 'Concurrent online classroom and critical telehealth bandwidth allocation' },
    'network-monitor': { title: 'Network Performance Monitor', subtitle: 'Live latency, packet loss, jitter telemetry, and network failure simulation' },
    'reports': { title: 'Analytics & Compliance Reports', subtitle: 'System metrics, SOAP success rates, and downloadable CSV exports' },
    'settings': { title: 'Settings & Role Manager', subtitle: 'Manage demo roles, simulation parameters, and persistence' }
  };

  const info = titles[pageId] || { title: 'UniMed Connect', subtitle: 'One Platform. Connected Learning. Connected Care.' };
  document.getElementById('header-page-title').textContent = info.title;
  document.getElementById('header-page-subtitle').textContent = info.subtitle;

  // Trigger page-specific re-renders
  if (pageId === 'overview') renderDashboard();
  if (pageId === 'student-services') renderStudentList();
  if (pageId === 'healthcare-services') renderHealthcarePage();
  if (pageId === 'appointments') renderAppointmentsList();
  if (pageId === 'web-service-center') renderWebServiceCenter();
  if (pageId === 'soap-tester') setupSoapTester();
  if (pageId === 'wsdl-explorer') renderWsdlExplorer();
  if (pageId === 'communication-protocol') renderUcpLogs();
  if (pageId === 'streaming-optimizer') startBufferSimulation();
  if (pageId === 'traffic-allocator') updateBandwidthAllocation();
  if (pageId === 'network-monitor') initNetworkMonitor();
  if (pageId === 'reports') renderReports();

  if (window.lucide) lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Current User & Role Management
let currentUser = DEFAULT_USERS.admin;

function setCurrentRole(roleKey) {
  if (DEFAULT_USERS[roleKey]) {
    currentUser = DEFAULT_USERS[roleKey];
    Store.set(STORAGE_KEYS.USER, currentUser);
    updateUserDisplay();
    showToast(`Switched active role to ${currentUser.role} (${currentUser.name})`, 'info');
  }
}

function updateUserDisplay() {
  document.getElementById('sidebar-user-name').textContent = currentUser.name;
  document.getElementById('sidebar-user-role').textContent = currentUser.role;
  document.getElementById('sidebar-user-avatar').textContent = currentUser.avatar;
  document.getElementById('header-role-badge').textContent = currentUser.role;
  document.getElementById('header-role-badge').className = `badge badge-${getRoleBadgeColor(currentUser.role)}`;

  // Role selector dropdown value
  const selectElem = document.getElementById('role-selector-header');
  if (selectElem) {
    const key = Object.keys(DEFAULT_USERS).find(k => DEFAULT_USERS[k].role.toLowerCase() === currentUser.role.toLowerCase());
    if (key) selectElem.value = key;
  }
}

function getRoleBadgeColor(role) {
  switch (role.toLowerCase()) {
    case 'student': return 'blue';
    case 'teacher': return 'violet';
    case 'doctor': return 'teal';
    case 'patient': return 'amber';
    default: return 'green';
  }
}

// ========================================================
// 3. Dashboard (Overview) Implementation
// ========================================================

let chartActivityInstance = null;
let chartStreamsInstance = null;

function renderDashboard() {
  const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  const services = Store.get(STORAGE_KEYS.SERVICES) || [];
  const appointments = Store.get(STORAGE_KEYS.APPOINTMENTS) || [];

  // Update Summary KPI Cards
  document.getElementById('kpi-students-count').textContent = (1420 + students.length - 5).toLocaleString();
  document.getElementById('kpi-patients-count').textContent = (865 + patients.length - 4).toLocaleString();
  document.getElementById('kpi-services-count').textContent = `${services.length}/${services.length} Online`;
  document.getElementById('kpi-appointments-count').textContent = appointments.filter(a => a.status === 'UPCOMING').length;

  // Render Upcoming Classes Widget
  const classesList = document.getElementById('dashboard-upcoming-classes');
  if (classesList) {
    const courses = Store.get(STORAGE_KEYS.COURSES) || [];
    classesList.innerHTML = courses.slice(0, 3).map(c => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
          <div style="font-size: 0.74rem; color: var(--text-secondary);">${c.code} &bull; ${c.instructor}</div>
        </td>
        <td><span class="badge badge-blue">${c.schedule}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="joinClassroom('${c.code}')">
            <i data-lucide="video"></i> Join Class
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render Upcoming Doctor Appointments Widget
  const aptsList = document.getElementById('dashboard-upcoming-apts');
  if (aptsList) {
    const upcoming = appointments.filter(a => a.status === 'UPCOMING').slice(0, 3);
    aptsList.innerHTML = upcoming.map(a => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${a.patientName}</div>
          <div style="font-size: 0.74rem; color: var(--text-secondary);">${a.reason}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${a.doctorName}</div>
          <div style="font-size: 0.74rem; color: var(--teal-accent);">${a.department}</div>
        </td>
        <td><span class="badge badge-teal">${a.date} &bull; ${a.time}</span></td>
        <td>
          <button class="btn btn-sm btn-teal" onclick="startConsultation('${a.id}')">
            <i data-lucide="phone-call"></i> Connect
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render Live Service Status Pills
  const servicePills = document.getElementById('dashboard-service-status-list');
  if (servicePills) {
    servicePills.innerHTML = services.map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-light);">
        <div>
          <div style="font-weight: 600; font-size: 0.85rem;">${s.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${s.operations.length} Operations &bull; ${s.endpoint}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; color: var(--text-secondary);">${s.latency}</span>
          <span class="badge badge-green">Healthy</span>
        </div>
      </div>
    `).join('');
  }

  // Render Recent Transactions
  const txTable = document.getElementById('dashboard-recent-transactions');
  if (txTable) {
    const txs = Store.get(STORAGE_KEYS.TRANSACTIONS) || [];
    txTable.innerHTML = txs.slice(0, 5).map(t => `
      <tr>
        <td><code>${t.id}</code></td>
        <td><strong>${t.service}</strong></td>
        <td><code>${t.operation}</code></td>
        <td><span class="badge badge-green">200 OK</span></td>
        <td>${t.time} ms</td>
        <td><span style="color: var(--text-muted); font-size: 0.75rem;">${t.timestamp}</span></td>
      </tr>
    `).join('');
  }

  // Initialize or update Charts
  initDashboardCharts();
  if (window.lucide) lucide.createIcons();
}

function initDashboardCharts() {
  const ctxActivity = document.getElementById('chart-activity-trends');
  if (ctxActivity && window.Chart) {
    if (chartActivityInstance) chartActivityInstance.destroy();
    chartActivityInstance = new Chart(ctxActivity, {
      type: 'line',
      data: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        datasets: [
          {
            label: 'University Academic Calls',
            data: [320, 850, 640, 1120, 980, 510, 240],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2
          },
          {
            label: 'Healthcare SOAP Calls',
            data: [190, 420, 580, 710, 680, 490, 310],
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const ctxStreams = document.getElementById('chart-stream-usage');
  if (ctxStreams && window.Chart) {
    if (chartStreamsInstance) chartStreamsInstance.destroy();
    chartStreamsInstance = new Chart(ctxStreams, {
      type: 'doughnut',
      data: {
        labels: ['Classrooms (HD 720p)', 'Telehealth Video (1080p)', 'Screen Sharing', 'Background SOAP Sync'],
        datasets: [{
          data: [52, 28, 12, 8],
          backgroundColor: ['#2563eb', '#0d9488', '#7c3aed', '#94a3b8'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '68%'
      }
    });
  }
}

// ========================================================
// 4. Student Information Services
// ========================================================

function renderStudentList() {
  const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
  const searchInput = document.getElementById('student-search-input');
  const deptFilter = document.getElementById('student-dept-filter');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const dept = deptFilter ? deptFilter.value : 'ALL';

  const filtered = students.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
    const matchDept = (dept === 'ALL' || s.department === dept);
    return matchQuery && matchDept;
  });

  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">No student records found matching filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><strong><code>${s.studentId}</code></strong></td>
      <td>
        <div style="font-weight: 600; color: var(--text-primary);">${s.name}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted);">${s.email}</div>
      </td>
      <td><span class="badge badge-blue">${s.department}</span></td>
      <td>Year ${s.yearOfStudy}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="progress-container" style="width: 80px;">
            <div class="progress-bar ${s.attendanceRate >= 90 ? 'green' : s.attendanceRate >= 80 ? 'teal' : 'amber'}" style="width: ${s.attendanceRate}%;"></div>
          </div>
          <span style="font-size: 0.78rem; font-weight: 600;">${s.attendanceRate}%</span>
        </div>
      </td>
      <td><span class="badge badge-violet">CGPA ${s.cgpa}</span></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-sm btn-secondary" onclick="viewStudentProfile('${s.studentId}')">
            <i data-lucide="user"></i> Profile
          </button>
          <button class="btn btn-sm btn-secondary" onclick="openSoapTesterFor('StudentService', 'getStudentById', '${s.studentId}')">
            <i data-lucide="code"></i> SOAP
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function viewStudentProfile(studentId) {
  const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
  const student = students.find(s => s.studentId === studentId);
  if (!student) return;

  document.getElementById('modal-student-name').textContent = student.name;
  document.getElementById('modal-student-id').textContent = student.studentId;
  document.getElementById('modal-student-dept').textContent = student.department;
  document.getElementById('modal-student-year').textContent = `Year ${student.yearOfStudy}`;
  document.getElementById('modal-student-email').textContent = student.email;
  document.getElementById('modal-student-cgpa').textContent = student.cgpa;
  document.getElementById('modal-student-attendance').textContent = `${student.attendanceRate}%`;

  // Render enrolled grades table
  const gradesTable = document.getElementById('modal-student-grades-table');
  if (gradesTable) {
    gradesTable.innerHTML = (student.grades || []).map(g => `
      <tr>
        <td><strong>${g.code}</strong></td>
        <td>${g.name}</td>
        <td><span class="badge badge-green">${g.grade}</span></td>
        <td>${g.marks}/100</td>
      </tr>
    `).join('') || `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No recorded grades.</td></tr>`;
  }

  // Open modal
  const modal = document.getElementById('modal-student-profile');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function saveNewStudent(event) {
  event.preventDefault();
  const id = document.getElementById('new-stu-id').value.trim();
  const name = document.getElementById('new-stu-name').value.trim();
  const dept = document.getElementById('new-stu-dept').value;
  const year = parseInt(document.getElementById('new-stu-year').value);
  const email = document.getElementById('new-stu-email').value.trim();
  const att = parseFloat(document.getElementById('new-stu-attendance').value) || 85.0;
  const cgpa = parseFloat(document.getElementById('new-stu-cgpa').value) || 3.50;

  if (!id || !name || !email) {
    showToast('Please fill all required student fields.', 'warning');
    return;
  }

  const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
  if (students.some(s => s.studentId === id)) {
    showToast(`Student ID ${id} already exists!`, 'error');
    return;
  }

  const newStudent = {
    studentId: id,
    name,
    department: dept,
    yearOfStudy: year,
    email,
    attendanceRate: att,
    cgpa: cgpa,
    enrolledCoursesCount: 4,
    courses: ['CS405', 'HI301'],
    grades: [{ code: 'CS405', name: 'Distributed Systems', grade: 'A', marks: 90 }]
  };

  students.push(newStudent);
  Store.set(STORAGE_KEYS.STUDENTS, students);
  closeModal('modal-add-student');
  renderStudentList();
  showToast(`Student ${name} (${id}) created and saved to demo database.`, 'success');
}

// ========================================================
// 5. Healthcare Services & Patient Directory
// ========================================================

function renderHealthcarePage() {
  renderPatientsList();
  renderDoctorsDirectory();
}

function renderPatientsList() {
  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  const searchInput = document.getElementById('patient-search-input');
  const deptFilter = document.getElementById('patient-dept-filter');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const dept = deptFilter ? deptFilter.value : 'ALL';

  const filtered = patients.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(query) || p.patientId.toLowerCase().includes(query);
    const matchDept = (dept === 'ALL' || p.department === dept);
    return matchQuery && matchDept;
  });

  const tbody = document.getElementById('patients-table-body');
  if (!tbody) return;

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td><strong><code>${p.patientId}</code></strong></td>
      <td>
        <div style="font-weight: 600; color: var(--text-primary);">${p.name}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted);">${p.age} yrs &bull; ${p.gender}</div>
      </td>
      <td><span class="badge badge-teal">${p.department}</span></td>
      <td>${p.doctorName || 'Unassigned'}</td>
      <td><span style="font-size: 0.8rem; color: var(--text-secondary);">${p.condition}</span></td>
      <td><span class="badge ${p.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}">${p.status}</span></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-sm btn-secondary" onclick="viewPatientProfile('${p.patientId}')">
            <i data-lucide="file-text"></i> Records
          </button>
          <button class="btn btn-sm btn-teal" onclick="openBookModalForPatient('${p.patientId}')">
            <i data-lucide="calendar"></i> Book
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function renderDoctorsDirectory() {
  const doctors = Store.get(STORAGE_KEYS.DOCTORS) || [];
  const container = document.getElementById('doctors-cards-grid');
  if (!container) return;

  container.innerHTML = doctors.map(d => `
    <div class="content-card" style="margin-bottom: 0;">
      <div class="content-card-body">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
          <div class="user-avatar" style="width: 48px; height: 48px; font-size: 1.1rem; background: linear-gradient(135deg, #0d9488, #2563eb);">
            ${d.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
          </div>
          <div>
            <h4 style="font-size: 0.96rem; font-weight: 700; color: var(--text-primary);">${d.name}</h4>
            <div style="font-size: 0.76rem; color: var(--teal-accent); font-weight: 600;">${d.specialization}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 12px; color: var(--text-secondary);">
          <span>Experience: <strong>${d.experience}</strong></span>
          <span>Fee: <strong>$${d.fee.toFixed(2)}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="badge ${d.status === 'AVAILABLE' ? 'badge-green' : 'badge-amber'}">${d.status}</span>
          <button class="btn btn-sm btn-teal" onclick="openBookModalForDoctor('${d.doctorId}')">
            Schedule Consult
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function viewPatientProfile(patientId) {
  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  const patient = patients.find(p => p.patientId === patientId);
  if (!patient) return;

  document.getElementById('modal-patient-name').textContent = patient.name;
  document.getElementById('modal-patient-id').textContent = patient.patientId;
  document.getElementById('modal-patient-age-gender').textContent = `${patient.age} yrs &bull; ${patient.gender}`;
  document.getElementById('modal-patient-dept').textContent = patient.department;
  document.getElementById('modal-patient-doctor').textContent = patient.doctorName;
  document.getElementById('modal-patient-condition').textContent = patient.condition;
  document.getElementById('modal-patient-notes').textContent = patient.notes || 'No recent notes logged.';

  if (patient.vitals) {
    document.getElementById('vital-bp').textContent = patient.vitals.bp;
    document.getElementById('vital-hr').textContent = patient.vitals.hr;
    document.getElementById('vital-spo2').textContent = patient.vitals.spo2;
    document.getElementById('vital-temp').textContent = patient.vitals.temp;
  }

  const modal = document.getElementById('modal-patient-profile');
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function saveNewPatient(event) {
  event.preventDefault();
  const id = document.getElementById('new-pat-id').value.trim();
  const name = document.getElementById('new-pat-name').value.trim();
  const age = parseInt(document.getElementById('new-pat-age').value);
  const gender = document.getElementById('new-pat-gender').value;
  const dept = document.getElementById('new-pat-dept').value;
  const condition = document.getElementById('new-pat-condition').value.trim();

  if (!id || !name) {
    showToast('Please fill all required patient details.', 'warning');
    return;
  }

  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  if (patients.some(p => p.patientId === id)) {
    showToast(`Patient ID ${id} already exists!`, 'error');
    return;
  }

  const doctors = Store.get(STORAGE_KEYS.DOCTORS) || [];
  const doc = doctors.find(d => d.department === dept) || doctors[0];

  const newPatient = {
    patientId: id,
    name,
    age,
    gender,
    department: dept,
    doctorId: doc.doctorId,
    doctorName: doc.name,
    phone: '+1 (555) 000-1122',
    condition: condition || 'Routine Clinical Review',
    status: 'ACTIVE',
    lastVisit: new Date().toISOString().split('T')[0],
    vitals: { bp: '120/80', hr: '72 bpm', spo2: '99%', temp: '98.6 F' },
    notes: 'New patient intake completed.'
  };

  patients.push(newPatient);
  Store.set(STORAGE_KEYS.PATIENTS, patients);
  closeModal('modal-add-patient');
  renderPatientsList();
  showToast(`Patient record ${name} (${id}) registered.`, 'success');
}

// ========================================================
// 6. Online Classroom Studio & Teacher Mode
// ========================================================

let classroomTimerInterval = null;
let classroomSeconds = 872; // starting offset for realistic class session
let classroomInSession = true;

function joinClassroom(courseCode) {
  navigateTo('online-classroom');
  const courses = Store.get(STORAGE_KEYS.COURSES) || [];
  const course = courses.find(c => c.code === courseCode) || courses[0];

  document.getElementById('classroom-title-display').textContent = `${course.code}: ${course.name}`;
  document.getElementById('classroom-instructor-display').textContent = `Instructor: ${course.instructor}`;
  startClassroomSimulation();
  showToast(`Joined online lecture: ${course.code}`, 'success');
}

function startClassroomSimulation() {
  if (classroomTimerInterval) clearInterval(classroomTimerInterval);
  classroomTimerInterval = setInterval(() => {
    if (!classroomInSession) return;
    classroomSeconds++;
    const m = Math.floor(classroomSeconds / 60);
    const s = classroomSeconds % 60;
    const timerElem = document.getElementById('classroom-timer');
    if (timerElem) {
      timerElem.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }, 1000);

  // Draw animated lecture canvas slide
  drawLectureCanvas();
}

function drawLectureCanvas() {
  const canvas = document.getElementById('classroom-canvas-stream');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let frame = 0;

  function renderSlide() {
    if (!canvas.isConnected) return;
    frame++;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 20px -apple-system, sans-serif';
    ctx.fillText('CS405: Distributed Systems & Web Services', 24, 38);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Module 4: Java SOAP Architecture & JAX-WS Handlers', 24, 100);

    // Diagram Box 1: Client Application
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 140, 160, 90);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(40, 140, 160, 90);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Service Consumer', 55, 175);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#bfdbfe';
    ctx.fillText('SOAP Request XML', 55, 200);

    // Arrow 1
    ctx.beginPath();
    ctx.moveTo(200, 185);
    ctx.lineTo(280, 185);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Diagram Box 2: SOAP Service Endpoint
    ctx.strokeRect(280, 140, 180, 90);
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(280, 140, 180, 90);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('JAX-WS Endpoint', 295, 175);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('WSDL Contract Validated', 295, 200);

    // Animated packet dot
    const dotX = 200 + ((frame * 2) % 80);
    ctx.beginPath();
    ctx.arc(dotX, 185, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Instructor video overlay in bottom-right corner
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(canvas.width - 180, canvas.height - 130, 160, 110);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width - 180, canvas.height - 130, 160, 110);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Prof. Marcus Vance', canvas.width - 170, canvas.height - 105);

    // Animated audio wave
    ctx.fillStyle = '#10b981';
    for (let i = 0; i < 8; i++) {
      const h = Math.sin((frame + i * 15) * 0.1) * 12 + 16;
      ctx.fillRect(canvas.width - 165 + i * 18, canvas.height - 40 - h, 10, h);
    }

    requestAnimationFrame(renderSlide);
  }
  renderSlide();
}

function sendClassroomChat() {
  const input = document.getElementById('classroom-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const chatContainer = document.getElementById('classroom-chat-messages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble outgoing';
  bubble.innerHTML = `
    <span class="sender-name">You (${currentUser.name})</span>
    <span>${text}</span>
    <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;
  chatContainer.appendChild(bubble);
  input.value = '';
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Automated intelligent simulated reply from classmate / teacher
  setTimeout(() => {
    const replies = [
      { name: 'Liam O\'Connor', text: 'Good question! In JAX-WS, Document/Literal wrapped style is used to wrap parameters inside the operation element.' },
      { name: 'Prof. Marcus Vance', text: 'Exactly right, Sarah. The WSDL defines the contract and the Java classes are mapped directly via JAXB annotations.' },
      { name: 'Mei-Ling Zhou', text: 'Also notice how the SOAP header can carry security tokens like in our UCP protocol specification!' }
    ];
    const picked = replies[Math.floor(Math.random() * replies.length)];
    const replyBubble = document.createElement('div');
    replyBubble.className = 'chat-bubble incoming';
    replyBubble.innerHTML = `
      <span class="sender-name">${picked.name}</span>
      <span>${picked.text}</span>
      <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    chatContainer.appendChild(replyBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 1200);
}

function toggleClassroomSession() {
  classroomInSession = !classroomInSession;
  const btn = document.getElementById('btn-classroom-leave');
  if (classroomInSession) {
    btn.innerHTML = `<i data-lucide="log-out"></i> Leave Class`;
    btn.className = 'btn btn-sm btn-danger';
    showToast('Re-joined online class session.', 'info');
  } else {
    btn.innerHTML = `<i data-lucide="play"></i> Re-Join`;
    btn.className = 'btn btn-sm btn-primary';
    showToast('Left class session.', 'warning');
  }
  if (window.lucide) lucide.createIcons();
}

// ========================================================
// 7. Doctor Consultation & Appointments
// ========================================================

let userMediaStream = null;
let isAudioMuted = false;
let isVideoPaused = false;

function renderAppointmentsList() {
  const appointments = Store.get(STORAGE_KEYS.APPOINTMENTS) || [];
  const tbody = document.getElementById('appointments-table-body');
  if (!tbody) return;

  tbody.innerHTML = appointments.map(a => `
    <tr>
      <td><strong><code>${a.id}</code></strong></td>
      <td>
        <div style="font-weight: 600;">${a.patientName}</div>
        <div style="font-size: 0.74rem; color: var(--text-muted);">${a.reason}</div>
      </td>
      <td>
        <div style="font-weight: 600;">${a.doctorName}</div>
        <div style="font-size: 0.74rem; color: var(--teal-accent);">${a.department}</div>
      </td>
      <td><span class="badge badge-teal">${a.date} &bull; ${a.time}</span></td>
      <td>
        <span class="badge ${a.status === 'UPCOMING' ? 'badge-blue' : a.status === 'COMPLETED' ? 'badge-green' : 'badge-red'}">
          ${a.status}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${a.status === 'UPCOMING' ? `
            <button class="btn btn-sm btn-teal" onclick="startConsultation('${a.id}')">
              <i data-lucide="video"></i> Start Call
            </button>
            <button class="btn btn-sm btn-secondary" onclick="cancelAppointment('${a.id}')">
              Cancel
            </button>
          ` : `
            <span style="font-size: 0.76rem; color: var(--text-muted);">Session Closed</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function openBookModalForPatient(patientId) {
  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  const patient = patients.find(p => p.patientId === patientId);
  const selectPat = document.getElementById('book-apt-patient');
  if (selectPat && patient) selectPat.value = patient.patientId;
  const modal = document.getElementById('modal-book-appointment');
  if (modal) modal.classList.add('active');
}

function openBookModalForDoctor(doctorId) {
  const selectDoc = document.getElementById('book-apt-doctor');
  if (selectDoc) selectDoc.value = doctorId;
  const modal = document.getElementById('modal-book-appointment');
  if (modal) modal.classList.add('active');
}

function saveBookAppointment(event) {
  event.preventDefault();
  const patientId = document.getElementById('book-apt-patient').value;
  const doctorId = document.getElementById('book-apt-doctor').value;
  const date = document.getElementById('book-apt-date').value;
  const time = document.getElementById('book-apt-time').value;
  const reason = document.getElementById('book-apt-reason').value.trim() || 'Telehealth Routine Evaluation';

  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  const doctors = Store.get(STORAGE_KEYS.DOCTORS) || [];
  const appointments = Store.get(STORAGE_KEYS.APPOINTMENTS) || [];

  const patient = patients.find(p => p.patientId === patientId) || { name: 'Demo Patient' };
  const doctor = doctors.find(d => d.doctorId === doctorId) || { name: 'Dr. Elena Rostova', department: 'Cardiology' };

  const newId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newApt = {
    id: newId,
    patientId,
    patientName: patient.name,
    doctorId,
    doctorName: doctor.name,
    department: doctor.department,
    date,
    time,
    reason,
    status: 'UPCOMING'
  };

  appointments.unshift(newApt);
  Store.set(STORAGE_KEYS.APPOINTMENTS, appointments);

  // Also simulate SOAP transaction recording
  recordSoapTransaction('HealthcareService', 'bookAppointment', 200, 92);

  closeModal('modal-book-appointment');
  renderAppointmentsList();
  showToast(`Appointment ${newId} confirmed with ${doctor.name} for ${date} at ${time}.`, 'success');
}

function cancelAppointment(aptId) {
  const appointments = Store.get(STORAGE_KEYS.APPOINTMENTS) || [];
  const apt = appointments.find(a => a.id === aptId);
  if (apt) {
    apt.status = 'CANCELLED';
    Store.set(STORAGE_KEYS.APPOINTMENTS, appointments);
    renderAppointmentsList();
    showToast(`Appointment ${aptId} has been cancelled.`, 'warning');
  }
}

function startConsultation(aptId) {
  navigateTo('doctor-consultation');
  const appointments = Store.get(STORAGE_KEYS.APPOINTMENTS) || [];
  const apt = appointments.find(a => a.id === aptId);
  if (apt) {
    document.getElementById('consult-patient-name').textContent = apt.patientName;
    document.getElementById('consult-doctor-name').textContent = apt.doctorName;
    document.getElementById('consult-reason').textContent = apt.reason;
  }
  initConsultationVideo();
  showToast('Connecting to encrypted telehealth video room...', 'info');
}

async function initConsultationVideo() {
  const patientVideo = document.getElementById('consult-patient-video');
  const doctorCanvas = document.getElementById('consult-doctor-canvas');

  // Attempt real webcam preview for patient video tile
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (patientVideo) {
        patientVideo.srcObject = userMediaStream;
        patientVideo.play().catch(() => {});
      }
      showToast('Camera & Microphone connected successfully.', 'success');
    } else {
      fallbackPatientVideo();
    }
  } catch (err) {
    console.warn('Camera permission unavailable or denied. Using high-fidelity video fallback.', err);
    fallbackPatientVideo();
  }

  // Draw simulated Doctor specialist stream on doctor canvas
  if (doctorCanvas) {
    drawDoctorCanvas(doctorCanvas);
  }
}

function fallbackPatientVideo() {
  const patientVideo = document.getElementById('consult-patient-video');
  const fallbackBox = document.getElementById('patient-fallback-avatar');
  if (patientVideo) patientVideo.style.display = 'none';
  if (fallbackBox) fallbackBox.style.display = 'flex';
}

function drawDoctorCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let frame = 0;
  function loop() {
    if (!canvas.isConnected) return;
    frame++;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Doctor clinic background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Doctor avatar silhouette & medical scrubs
    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 20, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2 + 110, 110, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stethoscope graphic
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 + 40, 35, 0, Math.PI);
    ctx.stroke();

    // Live audio pulse badge
    const pulse = Math.abs(Math.sin(frame * 0.05)) * 10;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(30, 30, 8 + pulse * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Dr. Elena Rostova (Cardiology)', 48, 35);

    // ECG telemetry line in bottom corner
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < 150; x++) {
      let y = Math.sin((x + frame * 3) * 0.1) * 6;
      if (x % 35 > 15 && x % 35 < 20) y -= 24; // QRS spike
      ctx.lineTo(canvas.width - 170 + x, canvas.height - 40 + y);
    }
    ctx.stroke();

    requestAnimationFrame(loop);
  }
  loop();
}

function toggleAudio() {
  isAudioMuted = !isAudioMuted;
  const btn = document.getElementById('btn-ctrl-mic');
  if (btn) {
    if (isAudioMuted) {
      btn.classList.add('active-red');
      btn.innerHTML = '<i data-lucide="mic-off"></i>';
      showToast('Microphone muted', 'warning');
    } else {
      btn.classList.remove('active-red');
      btn.innerHTML = '<i data-lucide="mic"></i>';
      showToast('Microphone unmuted', 'info');
    }
  }
  if (userMediaStream) {
    userMediaStream.getAudioTracks().forEach(t => t.enabled = !isAudioMuted);
  }
  if (window.lucide) lucide.createIcons();
}

function toggleVideo() {
  isVideoPaused = !isVideoPaused;
  const btn = document.getElementById('btn-ctrl-camera');
  if (btn) {
    if (isVideoPaused) {
      btn.classList.add('active-red');
      btn.innerHTML = '<i data-lucide="video-off"></i>';
      showToast('Camera video stopped', 'warning');
    } else {
      btn.classList.remove('active-red');
      btn.innerHTML = '<i data-lucide="video"></i>';
      showToast('Camera video resumed', 'info');
    }
  }
  if (userMediaStream) {
    userMediaStream.getVideoTracks().forEach(t => t.enabled = !isVideoPaused);
  }
  if (window.lucide) lucide.createIcons();
}

function endConsultation() {
  if (userMediaStream) {
    userMediaStream.getTracks().forEach(t => t.stop());
    userMediaStream = null;
  }
  showToast('Consultation session ended and archived.', 'info');
  navigateTo('appointments');
}

function sendConsultChat() {
  const input = document.getElementById('consult-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const chatContainer = document.getElementById('consult-chat-messages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble outgoing';
  bubble.innerHTML = `
    <span class="sender-name">You</span>
    <span>${text}</span>
    <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;
  chatContainer.appendChild(bubble);
  input.value = '';
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Doctor simulated response
  setTimeout(() => {
    const docBubble = document.createElement('div');
    docBubble.className = 'chat-bubble incoming';
    docBubble.innerHTML = `
      <span class="sender-name">Dr. Elena Rostova</span>
      <span>Thank you for updating me. I have recorded this in your clinical notes. Your BP readings remain well within target.</span>
      <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    chatContainer.appendChild(docBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 1400);
}

function saveClinicalNotes() {
  const notesText = document.getElementById('consult-clinical-notes').value.trim();
  if (!notesText) {
    showToast('Please enter clinical notes before saving.', 'warning');
    return;
  }
  showToast('Clinical notes encrypted and saved to EHR database via HealthcareService.', 'success');
  recordSoapTransaction('HealthcareService', 'updateClinicalNotes', 200, 115);
}

// ========================================================
// 8. Interactive System Architecture Inspector
// ========================================================

const ARCHITECTURE_NODES = {
  'student-app': {
    title: 'Student Application Client',
    category: 'University Tier',
    responsibility: 'Provides student interface for viewing grades, attendance, course schedules, and joining online classroom lectures.',
    receives: 'User UI inputs, session tokens, formatted SOAP XML responses.',
    sends: 'SOAP Request XML to StudentService (e.g. getStudentById, getResults).',
    protocols: 'HTTP 1.1 / HTTPS, SOAP 1.1 / 1.2, JSON / UCP',
    connected: ['university-ws', 'classroom-svc']
  },
  'healthcare-app': {
    title: 'Healthcare Application Client (EHR)',
    category: 'Healthcare Tier',
    responsibility: 'Provides doctor & patient interface for electronic health records, appointment bookings, and video consultation initiation.',
    receives: 'Patient vitals, doctor schedules, consultation confirmations.',
    sends: 'SOAP Request XML to HealthcareService (e.g. getPatientById, bookAppointment).',
    protocols: 'HTTP / HTTPS, SOAP 1.1, HL7 / FHIR mapped via SOAP, UCP',
    connected: ['healthcare-ws', 'telehealth-svc']
  },
  'university-ws': {
    title: 'University Web Service Layer',
    category: 'Web Service Tier',
    responsibility: 'Java JAX-WS Web Service implementing StudentService. Handles XML unmarshalling, business logic validation, and database queries.',
    receives: 'SOAP envelopes containing studentId or courseCode parameters.',
    sends: 'Document/Literal SOAP response envelopes containing student entity XML.',
    protocols: 'SOAP 1.1/1.2, JAX-WS, WSDL 1.1, XML Schema (XSD)',
    connected: ['student-app', 'wsdl-registry', 'database-layer']
  },
  'healthcare-ws': {
    title: 'Healthcare Web Service Layer',
    category: 'Web Service Tier',
    responsibility: 'Java JAX-WS Web Service implementing HealthcareService. Validates clinical requests and creates appointments.',
    receives: 'Patient lookup queries and appointment booking requests.',
    sends: 'Patient medical summaries and booking confirmations.',
    protocols: 'SOAP 1.1, JAXB Marshaller, JDBC Driver',
    connected: ['healthcare-app', 'wsdl-registry', 'database-layer']
  },
  'wsdl-registry': {
    title: 'WSDL Service Registry & Directory',
    category: 'Middleware Registry Tier',
    responsibility: 'Maintains catalog of published service endpoints, contract definitions (WSDL), portTypes, and binding specifications.',
    receives: 'Service registration metadata from Java ServicePublisher.',
    sends: 'WSDL contract documents to service consumers during discovery.',
    protocols: 'UDDI / REST Registry, WSDL 1.1 / 2.0',
    connected: ['university-ws', 'healthcare-ws']
  },
  'database-layer': {
    title: 'Database Access Layer (JDBC)',
    category: 'Data Tier',
    responsibility: 'Manages relational persistence across University Database (students, courses, attendance) and Healthcare Database (patients, doctors, appointments).',
    receives: 'Parameterized SQL queries from Java Web Service implementations.',
    sends: 'Relational ResultSets to JAXB entity mappers.',
    protocols: 'JDBC 4.3, SQLite / MySQL Connector',
    connected: ['university-ws', 'healthcare-ws']
  },
  'video-signaling': {
    title: 'Video Conferencing Server',
    category: 'Multimedia Communication Tier',
    responsibility: 'Node.js & Socket.IO WebRTC signaling server. Coordinates SDP Offer/Answer exchanges and relays ICE candidates.',
    receives: 'WebRTC join-room events, SDP descriptors, ICE candidate strings.',
    sends: 'Relayed signaling payloads to remote peers.',
    protocols: 'WebSockets, WebRTC, SDP, ICE/STUN/TURN',
    connected: ['classroom-svc', 'telehealth-svc', 'buffer-optimizer']
  },
  'buffer-optimizer': {
    title: 'Streaming & Buffer Optimizer',
    category: 'Multimedia Communication Tier',
    responsibility: 'Monitors real-time jitter, packet loss, and buffer health. Dynamically switches bitrate (ABR) between 1080p, 720p, 480p, 360p, and 240p.',
    receives: 'Network telemetry packets, RTCP Receiver Reports.',
    sends: 'Adaptive bitrate adjustments and buffer depletion alerts.',
    protocols: 'RTP / RTCP, Adaptive Bitrate Algorithm (ABR)',
    connected: ['video-signaling']
  }
};

function selectArchNode(nodeKey) {
  const node = ARCHITECTURE_NODES[nodeKey];
  if (!node) return;

  // Highlight selected node
  document.querySelectorAll('.arch-node').forEach(el => el.classList.remove('active-selected'));
  const activeEl = document.getElementById(`arch-node-${nodeKey}`);
  if (activeEl) activeEl.classList.add('active-selected');

  // Update inspector panel
  document.getElementById('arch-inspector-title').textContent = node.title;
  document.getElementById('arch-inspector-category').textContent = node.category;
  document.getElementById('arch-inspector-resp').textContent = node.responsibility;
  document.getElementById('arch-inspector-receives').textContent = node.receives;
  document.getElementById('arch-inspector-sends').textContent = node.sends;
  document.getElementById('arch-inspector-protocols').textContent = node.protocols;

  // Connected nodes list
  const connList = document.getElementById('arch-inspector-connected');
  if (connList) {
    connList.innerHTML = node.connected.map(c => `
      <span class="badge badge-blue" style="cursor: pointer;" onclick="selectArchNode('${c}')">
        ${ARCHITECTURE_NODES[c] ? ARCHITECTURE_NODES[c].title : c}
      </span>
    `).join(' ');
  }
}

function traceFlow(flowType) {
  let message = '';
  if (flowType === 'academic') {
    message = 'Tracing Academic Flow: Student App -> HTTP POST (SOAP Request) -> JAX-WS StudentService -> JDBC Query -> SQLite Database -> SOAP Response -> Rendered Grade Card.';
  } else if (flowType === 'healthcare') {
    message = 'Tracing Healthcare Flow: Healthcare App -> SOAP Envelope (bookAppointment) -> HealthcareService -> Database Insert -> Confirmation Response -> Saved to EHR.';
  } else if (flowType === 'multimedia') {
    message = 'Tracing Multimedia Flow: Classroom / Doctor -> Socket.IO Signaling -> SDP Handshake -> P2P WebRTC Media Stream -> Adaptive Buffer Optimizer.';
  }
  showToast(message, 'info');
}

// ========================================================
// 9. Java Web Service Center & Dynamic Publishing
// ========================================================

function renderWebServiceCenter() {
  const services = Store.get(STORAGE_KEYS.SERVICES) || [];
  const container = document.getElementById('web-services-cards-grid');
  if (!container) return;

  container.innerHTML = services.map(s => `
    <div class="content-card" style="margin-bottom: 0;">
      <div class="content-card-header">
        <h3 style="font-size: 0.96rem;">
          <i data-lucide="server"></i> ${s.name}
        </h3>
        <span class="badge badge-green">${s.status}</span>
      </div>
      <div class="content-card-body">
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
          Provider: <code>${s.provider}</code>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 12px;">
          Endpoint: <code>${s.endpoint}</code>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
            Available Operations (${s.operations.length})
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${s.operations.map(op => `<span class="badge badge-blue" style="font-family: monospace;">${op}</span>`).join('')}
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary" onclick="openWsdlForService('${s.id}')">
            <i data-lucide="file-code"></i> View WSDL
          </button>
          <button class="btn btn-sm btn-primary" onclick="openSoapTesterForService('${s.name}')">
            <i data-lucide="play-circle"></i> Test SOAP
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function publishCustomService(event) {
  event.preventDefault();
  const name = document.getElementById('pub-service-name').value.trim();
  const provider = document.getElementById('pub-provider-class').value.trim();
  const endpoint = document.getElementById('pub-endpoint-url').value.trim();
  const opsStr = document.getElementById('pub-operations-list').value.trim();

  if (!name || !endpoint || !opsStr) {
    showToast('Please fill all service publishing parameters.', 'warning');
    return;
  }

  const ops = opsStr.split(',').map(o => o.trim()).filter(Boolean);
  const services = Store.get(STORAGE_KEYS.SERVICES) || [];

  const newService = {
    id: `SVC-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
    name,
    provider: provider || `com.unimedconnect.custom.${name}`,
    endpoint,
    targetNamespace: `http://unimedconnect.com/${name.toLowerCase()}`,
    operations: ops,
    status: 'ACTIVE',
    latency: '45 ms',
    lastTested: 'Just now'
  };

  services.push(newService);
  Store.set(STORAGE_KEYS.SERVICES, services);
  closeModal('modal-publish-service');
  renderWebServiceCenter();
  showToast(`Service '${name}' successfully published to UniMed Service Registry!`, 'success');
}

// ========================================================
// 10. WSDL Explorer
// ========================================================

const WSDL_TEMPLATES = {
  'SVC-STU': {
    name: 'StudentService',
    targetNamespace: 'http://unimedconnect.com/student',
    operations: [
      { name: 'getStudentById', input: 'studentId (string)', output: 'student (StudentType)', sampleReq: '<getStudentById xmlns="http://unimedconnect.com/student"><studentId>STU1001</studentId></getStudentById>', sampleRes: '<getStudentByIdResponse xmlns="http://unimedconnect.com/student"><student><studentId>STU1001</studentId><name>Sarah Chen</name><department>Computer Science</department><cgpa>3.88</cgpa></student></getStudentByIdResponse>' },
      { name: 'getAllStudents', input: 'void', output: 'students (StudentType[])', sampleReq: '<getAllStudents xmlns="http://unimedconnect.com/student"/>', sampleRes: '<getAllStudentsResponse xmlns="http://unimedconnect.com/student"><students>...</students></getAllStudentsResponse>' },
      { name: 'getAttendance', input: 'studentId (string)', output: 'attendanceRecords (AttendanceRecordType[])', sampleReq: '<getAttendance xmlns="http://unimedconnect.com/student"><studentId>STU1001</studentId></getAttendance>', sampleRes: '<getAttendanceResponse xmlns="http://unimedconnect.com/student"><attendanceRecords><record><date>2026-11-20</date><status>PRESENT</status></record></attendanceRecords></getAttendanceResponse>' }
    ],
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://unimedconnect.com/student"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             name="StudentService"
             targetNamespace="http://unimedconnect.com/student">

  <!-- 1. TYPES SECTION (XML Schema Definition) -->
  <types>
    <xsd:schema targetNamespace="http://unimedconnect.com/student">
      <xsd:complexType name="Student">
        <xsd:sequence>
          <xsd:element name="studentId" type="xsd:string"/>
          <xsd:element name="name" type="xsd:string"/>
          <xsd:element name="department" type="xsd:string"/>
          <xsd:element name="yearOfStudy" type="xsd:int"/>
          <xsd:element name="email" type="xsd:string"/>
          <xsd:element name="attendanceRate" type="xsd:double"/>
          <xsd:element name="cgpa" type="xsd:double"/>
        </xsd:sequence>
      </xsd:complexType>
      <xsd:element name="getStudentById">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="studentId" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="getStudentByIdResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="student" type="tns:Student"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>

  <!-- 2. MESSAGES SECTION -->
  <message name="getStudentByIdRequest">
    <part name="parameters" element="tns:getStudentById"/>
  </message>
  <message name="getStudentByIdResponse">
    <part name="parameters" element="tns:getStudentByIdResponse"/>
  </message>

  <!-- 3. PORT TYPE (Abstract Interface) -->
  <portType name="StudentServicePortType">
    <operation name="getStudentById">
      <input message="tns:getStudentByIdRequest"/>
      <output message="tns:getStudentByIdResponse"/>
    </operation>
  </portType>

  <!-- 4. BINDING SECTION (SOAP 1.1 Document/Literal over HTTP) -->
  <binding name="StudentServiceSoapBinding" type="tns:StudentServicePortType">
    <soap:binding transport="http://schemas.xmlsoap.org/soap/http" style="document"/>
    <operation name="getStudentById">
      <soap:operation soapAction="http://unimedconnect.com/student/getStudentById"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
  </binding>

  <!-- 5. SERVICE & PORT (Concrete Address Endpoint) -->
  <service name="StudentService">
    <port name="StudentServicePort" binding="tns:StudentServiceSoapBinding">
      <soap:address location="http://localhost:8081/ws/student"/>
    </port>
  </service>
</definitions>`
  },
  'SVC-HLT': {
    name: 'HealthcareService',
    targetNamespace: 'http://unimedconnect.com/healthcare',
    operations: [
      { name: 'getPatientById', input: 'patientId (string)', output: 'patient (PatientType)', sampleReq: '<getPatientById xmlns="http://unimedconnect.com/healthcare"><patientId>PAT4001</patientId></getPatientById>', sampleRes: '<getPatientByIdResponse xmlns="http://unimedconnect.com/healthcare"><patient><patientId>PAT4001</patientId><name>James Wilson</name><condition>Hypertension</condition></patient></getPatientByIdResponse>' },
      { name: 'bookAppointment', input: 'patientId, doctorId, date, timeSlot', output: 'confirmation (AppointmentType)', sampleReq: '<bookAppointment xmlns="http://unimedconnect.com/healthcare"><patientId>PAT4001</patientId><doctorId>DOC3001</doctorId><date>2026-11-22</date><timeSlot>10:00 AM</timeSlot></bookAppointment>', sampleRes: '<bookAppointmentResponse xmlns="http://unimedconnect.com/healthcare"><appointmentId>APT-8801</appointmentId><status>CONFIRMED</status></bookAppointmentResponse>' }
    ],
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://unimedconnect.com/healthcare"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             name="HealthcareService"
             targetNamespace="http://unimedconnect.com/healthcare">

  <types>
    <xsd:schema targetNamespace="http://unimedconnect.com/healthcare">
      <xsd:complexType name="Patient">
        <xsd:sequence>
          <xsd:element name="patientId" type="xsd:string"/>
          <xsd:element name="name" type="xsd:string"/>
          <xsd:element name="age" type="xsd:int"/>
          <xsd:element name="department" type="xsd:string"/>
          <xsd:element name="medicalCondition" type="xsd:string"/>
        </xsd:sequence>
      </xsd:complexType>
      <xsd:element name="getPatientById">
        <xsd:complexType>
          <xsd:sequence><xsd:element name="patientId" type="xsd:string"/></xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="getPatientByIdResponse">
        <xsd:complexType>
          <xsd:sequence><xsd:element name="patient" type="tns:Patient"/></xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>

  <message name="getPatientByIdRequest"><part name="parameters" element="tns:getPatientById"/></message>
  <message name="getPatientByIdResponse"><part name="parameters" element="tns:getPatientByIdResponse"/></message>

  <portType name="HealthcareServicePortType">
    <operation name="getPatientById">
      <input message="tns:getPatientByIdRequest"/>
      <output message="tns:getPatientByIdResponse"/>
    </operation>
  </portType>

  <binding name="HealthcareServiceSoapBinding" type="tns:HealthcareServicePortType">
    <soap:binding transport="http://schemas.xmlsoap.org/soap/http" style="document"/>
    <operation name="getPatientById">
      <soap:operation soapAction="http://unimedconnect.com/healthcare/getPatientById"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
  </binding>

  <service name="HealthcareService">
    <port name="HealthcareServicePort" binding="tns:HealthcareServiceSoapBinding">
      <soap:address location="http://localhost:8081/ws/healthcare"/>
    </port>
  </service>
</definitions>`
  }
};

let currentSelectedWsdl = 'SVC-STU';

function renderWsdlExplorer() {
  const service = WSDL_TEMPLATES[currentSelectedWsdl] || WSDL_TEMPLATES['SVC-STU'];

  document.getElementById('wsdl-service-name-title').textContent = service.name;
  document.getElementById('wsdl-target-namespace').textContent = service.targetNamespace;
  document.getElementById('wsdl-raw-code').textContent = service.rawXml;

  // Render operations list
  const opsContainer = document.getElementById('wsdl-operations-list');
  if (opsContainer) {
    opsContainer.innerHTML = service.operations.map((op, idx) => `
      <div class="content-card" style="margin-bottom: 12px; cursor: pointer; border: 1px solid ${idx === 0 ? 'var(--primary-blue)' : 'var(--border-color)'};" onclick="inspectWsdlOp(${idx})">
        <div class="content-card-body" style="padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: var(--primary-blue); font-family: monospace;">${op.name}</strong>
            <span class="badge badge-blue">SOAP Operation</span>
          </div>
          <div style="font-size: 0.76rem; color: var(--text-secondary);">
            Input: <code>${op.input}</code> &bull; Output: <code>${op.output}</code>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Show first operation by default
  inspectWsdlOp(0);
}

function openWsdlForService(serviceId) {
  currentSelectedWsdl = serviceId;
  const select = document.getElementById('wsdl-service-selector');
  if (select) select.value = serviceId;
  navigateTo('wsdl-explorer');
}

function onWsdlServiceChange() {
  const select = document.getElementById('wsdl-service-selector');
  if (select) {
    currentSelectedWsdl = select.value;
    renderWsdlExplorer();
  }
}

function inspectWsdlOp(idx) {
  const service = WSDL_TEMPLATES[currentSelectedWsdl] || WSDL_TEMPLATES['SVC-STU'];
  const op = service.operations[idx] || service.operations[0];
  if (!op) return;

  document.getElementById('wsdl-op-name-display').textContent = op.name;
  document.getElementById('wsdl-op-sample-req').textContent = op.sampleReq;
  document.getElementById('wsdl-op-sample-res').textContent = op.sampleRes;
}

function copyWsdlXml() {
  const code = document.getElementById('wsdl-raw-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    showToast('WSDL XML copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy. Please select and copy manually.', 'warning');
  });
}

// ========================================================
// 11. API / SOAP Request & Response Tester
// ========================================================

const SOAP_OPERATIONS_META = {
  'StudentService': {
    'getStudentById': {
      params: [{ name: 'studentId', default: 'STU1001', label: 'Student ID' }],
      generateRequest: (p) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:stu="http://unimedconnect.com/student">
  <soap:Body>
    <stu:getStudentById>
      <studentId>${p.studentId || 'STU1001'}</studentId>
    </stu:getStudentById>
  </soap:Body>
</soap:Envelope>`,
      execute: (p) => {
        const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
        const student = students.find(s => s.studentId === (p.studentId || '').trim());
        if (!student) {
          return { status: 500, isFault: true, xml: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>Student with ID '${p.studentId}' not found in database.</faultstring>
      <detail><errorType>EntityNotFoundException</errorType></detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>` };
        }
        return { status: 200, isFault: false, xml: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:stu="http://unimedconnect.com/student">
  <soap:Body>
    <stu:getStudentByIdResponse>
      <student>
        <studentId>${student.studentId}</studentId>
        <name>${student.name}</name>
        <department>${student.department}</department>
        <yearOfStudy>${student.yearOfStudy}</yearOfStudy>
        <email>${student.email}</email>
        <attendanceRate>${student.attendanceRate}</attendanceRate>
        <cgpa>${student.cgpa}</cgpa>
        <enrolledCoursesCount>${student.enrolledCoursesCount || 4}</enrolledCoursesCount>
      </student>
    </stu:getStudentByIdResponse>
  </soap:Body>
</soap:Envelope>` };
      }
    },
    'getAllStudents': {
      params: [],
      generateRequest: () => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:stu="http://unimedconnect.com/student">
  <soap:Body>
    <stu:getAllStudents/>
  </soap:Body>
</soap:Envelope>`,
      execute: () => {
        const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
        return { status: 200, isFault: false, xml: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stu="http://unimedconnect.com/student">
  <soap:Body>
    <stu:getAllStudentsResponse>
      <totalCount>${students.length}</totalCount>
      ${students.map(s => `<student><studentId>${s.studentId}</studentId><name>${s.name}</name><cgpa>${s.cgpa}</cgpa></student>`).join('\n      ')}
    </stu:getAllStudentsResponse>
  </soap:Body>
</soap:Envelope>` };
      }
    }
  },
  'HealthcareService': {
    'getPatientById': {
      params: [{ name: 'patientId', default: 'PAT4001', label: 'Patient ID' }],
      generateRequest: (p) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:hc="http://unimedconnect.com/healthcare">
  <soap:Body>
    <hc:getPatientById>
      <patientId>${p.patientId || 'PAT4001'}</patientId>
    </hc:getPatientById>
  </soap:Body>
</soap:Envelope>`,
      execute: (p) => {
        const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
        const pat = patients.find(pt => pt.patientId === (p.patientId || '').trim());
        if (!pat) {
          return { status: 500, isFault: true, xml: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Client</faultcode>
      <faultstring>Patient ID '${p.patientId}' does not exist in EHR records.</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>` };
        }
        return { status: 200, isFault: false, xml: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:hc="http://unimedconnect.com/healthcare">
  <soap:Body>
    <hc:getPatientByIdResponse>
      <patient>
        <patientId>${pat.patientId}</patientId>
        <name>${pat.name}</name>
        <age>${pat.age}</age>
        <gender>${pat.gender}</gender>
        <department>${pat.department}</department>
        <medicalCondition>${pat.condition}</medicalCondition>
        <assignedDoctorId>${pat.doctorId}</assignedDoctorId>
        <consultationStatus>${pat.status}</consultationStatus>
      </patient>
    </hc:getPatientByIdResponse>
  </soap:Body>
</soap:Envelope>` };
      }
    },
    'bookAppointment': {
      params: [
        { name: 'patientId', default: 'PAT4001', label: 'Patient ID' },
        { name: 'doctorId', default: 'DOC3001', label: 'Doctor ID' },
        { name: 'date', default: '2026-11-25', label: 'Date' },
        { name: 'timeSlot', default: '10:30 AM', label: 'Time Slot' }
      ],
      generateRequest: (p) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:hc="http://unimedconnect.com/healthcare">
  <soap:Body>
    <hc:bookAppointment>
      <patientId>${p.patientId || 'PAT4001'}</patientId>
      <doctorId>${p.doctorId || 'DOC3001'}</doctorId>
      <appointmentDate>${p.date || '2026-11-25'}</appointmentDate>
      <timeSlot>${p.timeSlot || '10:30 AM'}</timeSlot>
    </hc:bookAppointment>
  </soap:Body>
</soap:Envelope>`,
      execute: (p) => {
        const aptId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
        return { status: 200, isFault: false, xml: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hc="http://unimedconnect.com/healthcare">
  <soap:Body>
    <hc:bookAppointmentResponse>
      <appointmentId>${aptId}</appointmentId>
      <status>SCHEDULED</status>
      <timestamp>${new Date().toISOString()}</timestamp>
    </hc:bookAppointmentResponse>
  </soap:Body>
</soap:Envelope>` };
      }
    }
  },
  'ClassroomService': {
    'getCourseDetails': {
      params: [{ name: 'courseCode', default: 'CS405', label: 'Course Code' }],
      generateRequest: (p) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:cls="http://unimedconnect.com/classroom">
  <soap:Body>
    <cls:getCourseDetails>
      <courseCode>${p.courseCode || 'CS405'}</courseCode>
    </cls:getCourseDetails>
  </soap:Body>
</soap:Envelope>`,
      execute: (p) => {
        const courses = Store.get(STORAGE_KEYS.COURSES) || [];
        const course = courses.find(c => c.code === (p.courseCode || '').toUpperCase().trim());
        if (!course) {
          return { status: 500, isFault: true, xml: `<soap:Fault><faultstring>Course '${p.courseCode}' not found.</faultstring></soap:Fault>` };
        }
        return { status: 200, isFault: false, xml: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cls="http://unimedconnect.com/classroom">
  <soap:Body>
    <cls:getCourseDetailsResponse>
      <course>
        <courseCode>${course.code}</courseCode>
        <courseName>${course.name}</courseName>
        <credits>${course.credits}</credits>
        <instructorName>${course.instructor}</instructorName>
        <schedule>${course.schedule}</schedule>
      </course>
    </cls:getCourseDetailsResponse>
  </soap:Body>
</soap:Envelope>` };
      }
    }
  }
};

let currentTesterService = 'StudentService';
let currentTesterOp = 'getStudentById';

function setupSoapTester() {
  const serviceSelect = document.getElementById('tester-service-select');
  const opSelect = document.getElementById('tester-operation-select');
  if (!serviceSelect || !opSelect) return;

  serviceSelect.value = currentTesterService;
  populateTesterOperations();
  renderTesterParams();
  updateTesterXmlEditor();
  renderSoapHistory();
}

function onTesterServiceChange() {
  const serviceSelect = document.getElementById('tester-service-select');
  if (!serviceSelect) return;
  currentTesterService = serviceSelect.value;
  populateTesterOperations();
  renderTesterParams();
  updateTesterXmlEditor();
}

function populateTesterOperations() {
  const opSelect = document.getElementById('tester-operation-select');
  if (!opSelect) return;
  const ops = Object.keys(SOAP_OPERATIONS_META[currentTesterService] || {});
  opSelect.innerHTML = ops.map(op => `<option value="${op}">${op}</option>`).join('');
  currentTesterOp = ops[0] || '';
}

function onTesterOpChange() {
  const opSelect = document.getElementById('tester-operation-select');
  if (!opSelect) return;
  currentTesterOp = opSelect.value;
  renderTesterParams();
  updateTesterXmlEditor();
}

function renderTesterParams() {
  const container = document.getElementById('tester-params-container');
  if (!container) return;
  const meta = (SOAP_OPERATIONS_META[currentTesterService] || {})[currentTesterOp];
  if (!meta || meta.params.length === 0) {
    container.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">No input parameters required for this operation.</span>`;
    return;
  }

  container.innerHTML = meta.params.map(p => `
    <div class="form-group" style="margin-bottom: 8px;">
      <label class="form-label">${p.label}</label>
      <input type="text" class="form-input" id="param-${p.name}" value="${p.default}" oninput="updateTesterXmlEditor()">
    </div>
  `).join('');
}

function getTesterParamsValues() {
  const meta = (SOAP_OPERATIONS_META[currentTesterService] || {})[currentTesterOp];
  const vals = {};
  if (meta) {
    meta.params.forEach(p => {
      const el = document.getElementById(`param-${p.name}`);
      vals[p.name] = el ? el.value : p.default;
    });
  }
  return vals;
}

function updateTesterXmlEditor() {
  const meta = (SOAP_OPERATIONS_META[currentTesterService] || {})[currentTesterOp];
  const editor = document.getElementById('tester-request-xml');
  if (meta && editor) {
    const params = getTesterParamsValues();
    editor.value = meta.generateRequest(params);
  }
}

function executeSoapRequest() {
  const meta = (SOAP_OPERATIONS_META[currentTesterService] || {})[currentTesterOp];
  if (!meta) return;

  const btn = document.getElementById('btn-send-soap');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader"></i> Transmitting...`;
  }

  const startTime = performance.now();
  const params = getTesterParamsValues();

  setTimeout(() => {
    const result = meta.execute(params);
    const latency = Math.round(performance.now() - startTime + Math.floor(Math.random() * 50 + 60));

    // Update Response Panel
    document.getElementById('tester-res-status').textContent = result.status === 200 ? '200 OK' : '500 SOAP Fault';
    document.getElementById('tester-res-status').className = `badge ${result.status === 200 ? 'badge-green' : 'badge-red'}`;
    document.getElementById('tester-res-time').textContent = `${latency} ms`;
    document.getElementById('tester-response-xml').textContent = result.xml;

    // Log transaction
    recordSoapTransaction(currentTesterService, currentTesterOp, result.status, latency);
    renderSoapHistory();

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="send"></i> Send SOAP Request`;
    }
    if (window.lucide) lucide.createIcons();
    showToast(`SOAP Response received: ${result.status} (${latency}ms)`, result.status === 200 ? 'success' : 'error');
  }, 350);
}

function recordSoapTransaction(service, operation, status, latency) {
  const txs = Store.get(STORAGE_KEYS.TRANSACTIONS) || [];
  const newTx = {
    id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    service,
    operation,
    consumer: currentUser.role || 'WebClient',
    status,
    time: latency,
    timestamp: new Date().toLocaleTimeString()
  };
  txs.unshift(newTx);
  if (txs.length > 25) txs.pop();
  Store.set(STORAGE_KEYS.TRANSACTIONS, txs);
}

function renderSoapHistory() {
  const txs = Store.get(STORAGE_KEYS.TRANSACTIONS) || [];
  const tbody = document.getElementById('soap-history-table');
  if (!tbody) return;

  tbody.innerHTML = txs.map(t => `
    <tr>
      <td><code>${t.id}</code></td>
      <td><strong>${t.service}</strong></td>
      <td><code>${t.operation}</code></td>
      <td><span class="badge ${t.status === 200 ? 'badge-green' : 'badge-red'}">${t.status}</span></td>
      <td>${t.time} ms</td>
      <td><span style="font-size: 0.74rem; color: var(--text-muted);">${t.timestamp}</span></td>
    </tr>
  `).join('');
}

function openSoapTesterFor(serviceName, opName, paramVal) {
  currentTesterService = serviceName;
  currentTesterOp = opName;
  navigateTo('soap-tester');
  setupSoapTester();
  if (paramVal) {
    const input = document.querySelector('#tester-params-container input');
    if (input) {
      input.value = paramVal;
      updateTesterXmlEditor();
    }
  }
}

function openSoapTesterForService(serviceName) {
  currentTesterService = serviceName;
  navigateTo('soap-tester');
  setupSoapTester();
}

// ========================================================
// 12. User-Defined Communication Protocol (UCP)
// ========================================================

function generateUcpMessage() {
  const sender = document.getElementById('ucp-sender').value;
  const receiver = document.getElementById('ucp-receiver').value;
  const serviceType = document.getElementById('ucp-service-type').value;
  const operation = document.getElementById('ucp-operation').value.trim() || 'queryData';
  const priority = document.getElementById('ucp-priority').value;
  const payloadStr = document.getElementById('ucp-payload').value.trim();

  let payload = {};
  try {
    payload = JSON.parse(payloadStr);
  } catch (e) {
    payload = { data: payloadStr };
  }

  const ucpMessage = {
    protocol: 'UCP',
    version: '1.0',
    message_id: `MSG${Math.floor(1000 + Math.random() * 9000)}`,
    sender,
    receiver,
    service_type: serviceType,
    operation,
    content_type: 'application/soap+xml',
    timestamp: new Date().toISOString(),
    priority,
    payload,
    auth_reference: `TOKEN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    acknowledgement: 'REQUIRED'
  };

  document.getElementById('ucp-generated-json').value = JSON.stringify(ucpMessage, null, 2);
  document.getElementById('ucp-validation-status').innerHTML = `<span class="badge badge-blue">Generated - Ready for Validation</span>`;
}

function validateUcpMessage() {
  const text = document.getElementById('ucp-generated-json').value;
  const statusElem = document.getElementById('ucp-validation-status');
  if (!text.trim()) {
    statusElem.innerHTML = `<span class="badge badge-red">Error: No message to validate</span>`;
    return false;
  }

  try {
    const msg = JSON.parse(text);
    const requiredFields = [
      'protocol', 'version', 'message_id', 'sender', 'receiver',
      'service_type', 'operation', 'content_type', 'timestamp',
      'priority', 'payload', 'auth_reference', 'acknowledgement'
    ];

    const missing = requiredFields.filter(f => msg[f] === undefined);
    if (missing.length > 0) {
      statusElem.innerHTML = `<span class="badge badge-red">Schema Validation Failed: Missing fields [${missing.join(', ')}]</span>`;
      showToast(`UCP Validation Error: Missing [${missing.join(', ')}]`, 'error');
      return false;
    }

    if (msg.protocol !== 'UCP' || msg.version !== '1.0') {
      statusElem.innerHTML = `<span class="badge badge-red">Version Mismatch: Protocol must be UCP v1.0</span>`;
      return false;
    }

    statusElem.innerHTML = `<span class="badge badge-green"><i data-lucide="check"></i> 12/12 Fields Validated - Conforms to UCP Specification</span>`;
    if (window.lucide) lucide.createIcons();
    showToast('UCP message strictly validated against 12-field schema.', 'success');
    return true;
  } catch (e) {
    statusElem.innerHTML = `<span class="badge badge-red">JSON Parse Syntax Error: ${e.message}</span>`;
    return false;
  }
}

function transmitUcpMessage() {
  if (!validateUcpMessage()) return;
  const msg = JSON.parse(document.getElementById('ucp-generated-json').value);

  const logs = Store.get(STORAGE_KEYS.UCP_LOGS) || [];
  const logEntry = {
    id: msg.message_id,
    sender: msg.sender,
    receiver: msg.receiver,
    serviceType: msg.service_type,
    operation: msg.operation,
    priority: msg.priority,
    status: 'ACK_RECEIVED',
    timestamp: new Date().toISOString()
  };

  logs.unshift(logEntry);
  Store.set(STORAGE_KEYS.UCP_LOGS, logs);
  renderUcpLogs();

  // Show ACK modal or feedback
  const ack = {
    protocol: 'UCP',
    version: '1.0',
    ack_to_message_id: msg.message_id,
    receiver_status: '200_SUCCESS',
    delivery_timestamp: new Date().toISOString(),
    payload_hash: 'SHA256:4f8e...9a21',
    delivery_guarantee: 'EXACTLY_ONCE'
  };

  document.getElementById('ucp-ack-output').textContent = JSON.stringify(ack, null, 2);
  showToast(`UCP Message ${msg.message_id} delivered. Positive Acknowledgement received.`, 'success');
}

function renderUcpLogs() {
  const logs = Store.get(STORAGE_KEYS.UCP_LOGS) || [];
  const tbody = document.getElementById('ucp-logs-table');
  if (!tbody) return;

  tbody.innerHTML = logs.map(l => `
    <tr>
      <td><code>${l.id}</code></td>
      <td>${l.sender}</td>
      <td><strong>${l.receiver}</strong></td>
      <td><span class="badge badge-blue">${l.serviceType}</span></td>
      <td><code>${l.operation}</code></td>
      <td><span class="badge ${l.priority === 'HIGH' || l.priority === 'CRITICAL' ? 'badge-amber' : 'badge-gray'}">${l.priority}</span></td>
      <td><span class="badge badge-green">${l.status}</span></td>
      <td><span style="font-size: 0.74rem; color: var(--text-muted);">${l.timestamp.split('T')[1]?.substring(0,8) || l.timestamp}</span></td>
    </tr>
  `).join('');
}

// ========================================================
// 13. Video Streaming Optimizer & Adaptive Bitrate (ABR)
// ========================================================

let bufferInterval = null;
let currentBufferLevel = 85; // percentage (0 - 100)
let currentNetworkPreset = 'good';
let isOptimizationEnabled = true;

const NETWORK_PRESETS = {
  excellent: { bw: 100, latency: 15, loss: 0.0, jitter: 2 },
  good: { bw: 35, latency: 38, loss: 0.5, jitter: 6 },
  moderate: { bw: 12, latency: 85, loss: 2.0, jitter: 14 },
  poor: { bw: 3, latency: 210, loss: 7.5, jitter: 35 },
  unstable: { bw: 1.5, latency: 420, loss: 16.0, jitter: 80 }
};

function setNetworkPreset(presetKey) {
  currentNetworkPreset = presetKey;
  const p = NETWORK_PRESETS[presetKey];
  if (!p) return;

  document.querySelectorAll('.btn-preset').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-preset') === presetKey);
  });

  document.getElementById('sim-bw-slider').value = p.bw;
  document.getElementById('sim-bw-display').textContent = `${p.bw} Mbps`;
  document.getElementById('sim-latency-slider').value = p.latency;
  document.getElementById('sim-latency-display').textContent = `${p.latency} ms`;
  document.getElementById('sim-loss-slider').value = p.loss;
  document.getElementById('sim-loss-display').textContent = `${p.loss}%`;

  updateStreamSimulation();
  showToast(`Network profile switched to '${presetKey.toUpperCase()}'`, 'info');
}

function onSliderChange(type) {
  const bw = document.getElementById('sim-bw-slider').value;
  const lat = document.getElementById('sim-latency-slider').value;
  const loss = document.getElementById('sim-loss-slider').value;

  document.getElementById('sim-bw-display').textContent = `${bw} Mbps`;
  document.getElementById('sim-latency-display').textContent = `${lat} ms`;
  document.getElementById('sim-loss-display').textContent = `${loss}%`;

  updateStreamSimulation();
}

function toggleOptimizationMode() {
  isOptimizationEnabled = !isOptimizationEnabled;
  const btn = document.getElementById('btn-toggle-optimizer');
  if (btn) {
    if (isOptimizationEnabled) {
      btn.textContent = 'Mode: WITH OPTIMIZATION (Active)';
      btn.className = 'btn btn-sm btn-teal';
      showToast('Adaptive Bitrate (ABR) & Buffer Optimization enabled.', 'success');
    } else {
      btn.textContent = 'Mode: WITHOUT OPTIMIZATION (Disabled)';
      btn.className = 'btn btn-sm btn-danger';
      showToast('Optimization disabled! Fixed high bitrate may trigger rebuffering.', 'warning');
    }
  }
}

function updateStreamSimulation() {
  const bw = parseFloat(document.getElementById('sim-bw-slider').value);
  const loss = parseFloat(document.getElementById('sim-loss-slider').value);

  let qualityTier = '1080p Full HD';
  let bitrateKbps = 4500;
  let drainRate = 0;

  if (isOptimizationEnabled) {
    // Dynamic ABR Algorithm
    if (bw >= 30 && loss < 2) {
      qualityTier = '1080p Full HD (60fps)';
      bitrateKbps = 4800;
      drainRate = 0;
    } else if (bw >= 15 && loss < 4) {
      qualityTier = '720p HD';
      bitrateKbps = 2400;
      drainRate = 0;
    } else if (bw >= 6 && loss < 8) {
      qualityTier = '480p Standard';
      bitrateKbps = 1200;
      drainRate = 1;
    } else if (bw >= 2) {
      qualityTier = '360p Low Latency';
      bitrateKbps = 650;
      drainRate = 2;
    } else {
      qualityTier = '240p Emergency Audio-Priority';
      bitrateKbps = 280;
      drainRate = 3;
    }
  } else {
    // Fixed 1080p - Severe drain if network is poor
    qualityTier = '1080p Fixed (No ABR)';
    bitrateKbps = 5000;
    if (bw < 15 || loss > 5) {
      drainRate = 15;
    }
  }

  document.getElementById('stream-quality-badge').textContent = qualityTier;
  document.getElementById('stream-bitrate-display').textContent = `${bitrateKbps} kbps`;
}

function startBufferSimulation() {
  if (bufferInterval) clearInterval(bufferInterval);
  bufferInterval = setInterval(() => {
    const bw = parseFloat(document.getElementById('sim-bw-slider')?.value || 35);
    const loss = parseFloat(document.getElementById('sim-loss-slider')?.value || 0.5);

    if (isOptimizationEnabled) {
      // Dynamic healthy balance
      if (currentBufferLevel < 90) currentBufferLevel += 3;
      if (loss > 5) currentBufferLevel -= 2;
    } else {
      // Without optimization: easily drains on low bandwidth
      if (bw < 15 || loss > 5) {
        currentBufferLevel -= 6;
      } else if (currentBufferLevel < 95) {
        currentBufferLevel += 2;
      }
    }

    currentBufferLevel = Math.max(0, Math.min(100, currentBufferLevel));
    updateBufferDisplay(currentBufferLevel);
  }, 1000);
}

function updateBufferDisplay(level) {
  const fill = document.getElementById('buffer-meter-fill');
  const text = document.getElementById('buffer-level-percent');
  const alertBox = document.getElementById('buffer-warning-alert');
  if (!fill || !text) return;

  fill.style.width = `${level}%`;
  text.textContent = `${Math.round(level)}%`;

  if (level > 60) {
    fill.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
    if (alertBox) alertBox.style.display = 'none';
  } else if (level > 25) {
    fill.style.background = 'linear-gradient(90deg, #f59e0b, #eab308)';
    if (alertBox) alertBox.style.display = 'none';
  } else {
    fill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `<strong>Rebuffering Alert:</strong> Buffer critically low (${Math.round(level)}%). Audio stream prioritized while frames buffer.`;
    }
  }
}

// ========================================================
// 14. Simultaneous Traffic & Bandwidth Allocation
// ========================================================

function updateBandwidthAllocation() {
  const totalBw = parseFloat(document.getElementById('alloc-total-bw')?.value || 50);
  const classCount = parseInt(document.getElementById('alloc-class-students')?.value || 25);
  const docCount = parseInt(document.getElementById('alloc-telehealth-count')?.value || 2);

  document.getElementById('alloc-total-display').textContent = `${totalBw} Mbps`;
  document.getElementById('alloc-class-display').textContent = `${classCount} Participants`;
  document.getElementById('alloc-doc-display').textContent = `${docCount} Doctor Consultations`;

  // Guaranteed QoS: 6 Mbps per doctor consultation (high priority)
  const healthAlloc = Math.min(totalBw * 0.5, docCount * 5.5);
  // Classroom gets remainder
  const remaining = Math.max(0, totalBw - healthAlloc);
  const classAlloc = remaining * 0.85;
  const bgAlloc = remaining * 0.15;

  document.getElementById('alloc-val-healthcare').textContent = `${healthAlloc.toFixed(1)} Mbps`;
  document.getElementById('alloc-val-classroom').textContent = `${classAlloc.toFixed(1)} Mbps`;
  document.getElementById('alloc-val-background').textContent = `${bgAlloc.toFixed(1)} Mbps`;

  // Update visual distribution bar
  const pctHealth = (healthAlloc / totalBw) * 100;
  const pctClass = (classAlloc / totalBw) * 100;
  const pctBg = (bgAlloc / totalBw) * 100;

  document.getElementById('bar-alloc-healthcare').style.width = `${pctHealth}%`;
  document.getElementById('bar-alloc-classroom').style.width = `${pctClass}%`;
  document.getElementById('bar-alloc-background').style.width = `${pctBg}%`;

  // Congestion alert check
  const congestionAlert = document.getElementById('alloc-congestion-alert');
  if (congestionAlert) {
    if (totalBw < 15 && (classCount > 20 || docCount > 3)) {
      congestionAlert.style.display = 'block';
      congestionAlert.innerHTML = `<strong>Bandwidth Warning:</strong> Available pipe (${totalBw} Mbps) is saturated. Background service throttled to safeguard clinical video call quality.`;
    } else {
      congestionAlert.style.display = 'none';
    }
  }
}

// ========================================================
// 15. Network Monitor & Simulated Failure
// ========================================================

let netChartInstance = null;
let netTelemetryInterval = null;
let isNetworkDegraded = false;

function initNetworkMonitor() {
  const ctx = document.getElementById('chart-network-telemetry');
  if (!ctx || !window.Chart) return;

  if (netChartInstance) netChartInstance.destroy();
  netChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['-30s', '-25s', '-20s', '-15s', '-10s', '-5s', 'Now'],
      datasets: [
        {
          label: 'Latency (ms)',
          data: [22, 24, 21, 25, 23, 24, 22],
          borderColor: '#2563eb',
          tension: 0.3,
          borderWidth: 2,
          yAxisID: 'y'
        },
        {
          label: 'Packet Loss (%)',
          data: [0, 0, 0.2, 0, 0.1, 0, 0],
          borderColor: '#ef4444',
          tension: 0.3,
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { type: 'linear', position: 'left', min: 0, max: 500, title: { display: true, text: 'Latency ms' } },
        y1: { type: 'linear', position: 'right', min: 0, max: 25, grid: { drawOnChartArea: false }, title: { display: true, text: 'Loss %' } }
      }
    }
  });

  if (netTelemetryInterval) clearInterval(netTelemetryInterval);
  netTelemetryInterval = setInterval(() => {
    if (!netChartInstance) return;
    const lat = isNetworkDegraded ? Math.floor(Math.random() * 80 + 380) : Math.floor(Math.random() * 8 + 20);
    const loss = isNetworkDegraded ? (Math.random() * 5 + 15).toFixed(1) : (Math.random() * 0.4).toFixed(1);

    netChartInstance.data.datasets[0].data.shift();
    netChartInstance.data.datasets[0].data.push(lat);
    netChartInstance.data.datasets[1].data.shift();
    netChartInstance.data.datasets[1].data.push(parseFloat(loss));
    netChartInstance.update('none');

    document.getElementById('net-status-lat').textContent = `${lat} ms`;
    document.getElementById('net-status-loss').textContent = `${loss}%`;
  }, 2000);
}

function simulateNetworkFailure() {
  isNetworkDegraded = true;
  document.getElementById('net-connection-status').textContent = 'CRITICAL DEGRADATION';
  document.getElementById('net-connection-status').className = 'badge badge-red';
  document.getElementById('btn-fail-network').style.display = 'none';
  document.getElementById('btn-restore-network').style.display = 'inline-flex';

  showToast('SIMULATION: Network failure triggered! High packet drop and severe latency spike.', 'error');
}

function restoreNetwork() {
  isNetworkDegraded = false;
  document.getElementById('net-connection-status').textContent = 'HEALTHY & STABLE';
  document.getElementById('net-connection-status').className = 'badge badge-green';
  document.getElementById('btn-fail-network').style.display = 'inline-flex';
  document.getElementById('btn-restore-network').style.display = 'none';

  showToast('SIMULATION: Network restored to optimal fiber throughput.', 'success');
}

// ========================================================
// 16. Reports & CSV Export
// ========================================================

function renderReports() {
  const txs = Store.get(STORAGE_KEYS.TRANSACTIONS) || [];
  const students = Store.get(STORAGE_KEYS.STUDENTS) || [];
  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];

  document.getElementById('rep-total-soap').textContent = (14280 + txs.length).toLocaleString();
  document.getElementById('rep-success-rate').textContent = '99.4%';
  document.getElementById('rep-avg-response').textContent = '108 ms';
  document.getElementById('rep-video-hours').textContent = '384.5 hrs';

  // Render Reports Chart
  const ctx = document.getElementById('chart-reports-volume');
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['StudentService', 'HealthcareService', 'ClassroomService', 'VideoSessionService'],
        datasets: [{
          label: 'Total Invocations (Past 30 Days)',
          data: [6420, 4890, 2150, 820],
          backgroundColor: ['#2563eb', '#0d9488', '#7c3aed', '#10b981'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}

function exportCsvReport() {
  const txs = Store.get(STORAGE_KEYS.TRANSACTIONS) || [];
  let csv = 'TransactionID,Service,Operation,Consumer,Status,ResponseTimeMs,Timestamp\n';
  txs.forEach(t => {
    csv += `"${t.id}","${t.service}","${t.operation}","${t.consumer}",${t.status},${t.time},"${t.timestamp}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `unimed_soap_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CSV transaction report generated and downloaded.', 'success');
}

function printReport() {
  window.print();
}

// ========================================================
// 17. Modal Helpers
// ========================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Close modals when clicking overlay backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Mobile Sidebar Toggle
function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.toggle('mobile-open');
}

// ========================================================
// 18. Application Initialization
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  currentUser = Store.get(STORAGE_KEYS.USER) || DEFAULT_USERS.admin;
  updateUserDisplay();

  // Populate doctor select options in booking modal
  const doctors = Store.get(STORAGE_KEYS.DOCTORS) || [];
  const docSelect = document.getElementById('book-apt-doctor');
  if (docSelect) {
    docSelect.innerHTML = doctors.map(d => `<option value="${d.doctorId}">${d.name} (${d.specialization})</option>`).join('');
  }

  // Populate patient select options in booking modal
  const patients = Store.get(STORAGE_KEYS.PATIENTS) || [];
  const patSelect = document.getElementById('book-apt-patient');
  if (patSelect) {
    patSelect.innerHTML = patients.map(p => `<option value="${p.patientId}">${p.name} (${p.patientId})</option>`).join('');
  }

  // Hook navigation clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      if (pageId) {
        navigateTo(pageId);
        // On mobile, close sidebar after clicking nav item
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  });

  // Initial page load
  navigateTo('overview');
  if (window.lucide) lucide.createIcons();
  console.log('[UniMed Connect] Application core initialized successfully.');
});
