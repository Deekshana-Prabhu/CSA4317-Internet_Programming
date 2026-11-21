/**
 * ==============================================================================
 * MediConnect – Database-Driven Smart Healthcare Management System
 * Full-Stack JavaScript Engine: LocalStorage, SOAP Simulation & UI Controller
 * ==============================================================================
 */

// Global App Namespace
const app = {
  // Current active view section
  activeSection: 'dashboard',
  patientViewMode: 'table',
  currentDoctorFilter: 'ALL',
  currentDbTable: 'patients',

  // Charts references
  charts: {
    trends: null,
    dept: null
  },

  // ----------------------------------------------------------------------------
  // INITIALIZATION & SEED DATA
  // ----------------------------------------------------------------------------
  init() {
    this.initDatabase();
    this.setupEventListeners();
    this.initCharts();
    this.renderDashboard();
    this.renderPatients();
    this.renderDoctors();
    this.renderAppointments();
    this.renderLaboratoryReports();
    this.renderPharmacy();
    this.renderReports();
    this.inspectDbTable('patients');
    this.displaySoapSample('request');
    this.renderWsdlViewer();
    this.executeSoapTest(); // Run initial sample test for PAT-1001
    console.log('[✓] MediConnect UI Initialized successfully.');
  },

  // Initialize LocalStorage with rich sample data if not already present
  initDatabase() {
    if (!localStorage.getItem('mc_patients')) {
      const defaultPatients = [
        { patientId: 'PAT-1001', patientName: 'Arthur Pendelton', age: 58, gender: 'Male', bloodGroup: 'O+', mobile: '+1 (555) 019-2831', email: 'arthur.p@example.com', address: '742 Evergreen Terrace, Springfield', doctorName: 'Dr. Sarah Mitchell', department: 'Cardiology' },
        { patientId: 'PAT-1002', patientName: 'Beatrice Montgomery', age: 42, gender: 'Female', bloodGroup: 'A+', mobile: '+1 (555) 018-9921', email: 'b.montgomery@example.com', address: '1204 Elmhurst Avenue, Boston', doctorName: 'Dr. Robert Chen', department: 'Neurology' },
        { patientId: 'PAT-1003', patientName: 'Carlos Santillan', age: 35, gender: 'Male', bloodGroup: 'B+', mobile: '+1 (555) 017-3847', email: 'carlos.s@example.com', address: '4802 Horizon Boulevard, Chicago', doctorName: 'Dr. Elena Rostova', department: 'Orthopedics' },
        { patientId: 'PAT-1004', patientName: 'Daisy Abernathy', age: 9, gender: 'Female', bloodGroup: 'O-', mobile: '+1 (555) 016-1294', email: 'abernathy.family@example.com', address: '88 Pinewood Lane, Seattle', doctorName: 'Dr. Marcus Vance', department: 'Pediatrics' },
        { patientId: 'PAT-1005', patientName: 'Edward Thorne', age: 67, gender: 'Male', bloodGroup: 'AB+', mobile: '+1 (555) 015-8832', email: 'edward.thorne@example.com', address: '315 Harbor Point, San Diego', doctorName: 'Dr. Aisha Patel', department: 'General Medicine' },
        { patientId: 'PAT-1006', patientName: 'Fiona Gallagher', age: 28, gender: 'Female', bloodGroup: 'A-', mobile: '+1 (555) 014-4721', email: 'fiona.g@example.com', address: '627 Maple Street, Austin', doctorName: 'Dr. David Kim', department: 'Dermatology' },
        { patientId: 'PAT-1007', patientName: 'George Washington Clark', age: 51, gender: 'Male', bloodGroup: 'B-', mobile: '+1 (555) 013-9081', email: 'gw.clark@example.com', address: '910 Riverbed Court, Denver', doctorName: 'Dr. Sarah Mitchell', department: 'Cardiology' },
        { patientId: 'PAT-1008', patientName: 'Helena Vance', age: 39, gender: 'Female', bloodGroup: 'O+', mobile: '+1 (555) 012-3498', email: 'h.vance@example.com', address: '1520 Sunset Ridge, Phoenix', doctorName: 'Dr. Aisha Patel', department: 'General Medicine' },
        { patientId: 'PAT-1009', patientName: 'Ian MacLeod', age: 63, gender: 'Male', bloodGroup: 'A+', mobile: '+1 (555) 011-7712', email: 'ian.macleod@example.com', address: '24 High Street, Philadelphia', doctorName: 'Dr. Elena Rostova', department: 'Orthopedics' },
        { patientId: 'PAT-1010', patientName: 'Julia Ramirez', age: 31, gender: 'Female', bloodGroup: 'AB-', mobile: '+1 (555) 010-6644', email: 'julia.ramirez@example.com', address: '703 West End Ave, New York', doctorName: 'Dr. Robert Chen', department: 'Neurology' },
        { patientId: 'PAT-1011', patientName: 'Kevin Sterling', age: 12, gender: 'Male', bloodGroup: 'O+', mobile: '+1 (555) 009-5531', email: 'sterling.parents@example.com', address: '412 Oakridge Way, Atlanta', doctorName: 'Dr. Marcus Vance', department: 'Pediatrics' },
        { patientId: 'PAT-1012', patientName: 'Laura Higgins', age: 47, gender: 'Female', bloodGroup: 'B+', mobile: '+1 (555) 008-2219', email: 'laura.higgins@example.com', address: '190 Birchwood Trail, Portland', doctorName: 'Dr. David Kim', department: 'Dermatology' }
      ];
      localStorage.setItem('mc_patients', JSON.stringify(defaultPatients));
    }

    if (!localStorage.getItem('mc_doctors')) {
      const defaultDoctors = [
        { doctorId: 'DOC-101', doctorName: 'Dr. Sarah Mitchell', specialization: 'Interventional Cardiology', department: 'Cardiology', availability: 'Available', contactEmail: 's.mitchell@mediconnect.org', contactPhone: '+1 (555) 234-5671', roomNo: 'Room 302' },
        { doctorId: 'DOC-102', doctorName: 'Dr. Robert Chen', specialization: 'Cerebrovascular Neurology', department: 'Neurology', availability: 'Available', contactEmail: 'r.chen@mediconnect.org', contactPhone: '+1 (555) 234-5672', roomNo: 'Room 415' },
        { doctorId: 'DOC-103', doctorName: 'Dr. Elena Rostova', specialization: 'Joint Reconstruction & Trauma', department: 'Orthopedics', availability: 'In Surgery', contactEmail: 'e.rostova@mediconnect.org', contactPhone: '+1 (555) 234-5673', roomNo: 'Room 210' },
        { doctorId: 'DOC-104', doctorName: 'Dr. Marcus Vance', specialization: 'Pediatric Pulmonology', department: 'Pediatrics', availability: 'Available', contactEmail: 'm.vance@mediconnect.org', contactPhone: '+1 (555) 234-5674', roomNo: 'Room 108' },
        { doctorId: 'DOC-105', doctorName: 'Dr. Aisha Patel', specialization: 'Internal Medicine & Diabetology', department: 'General Medicine', availability: 'Available', contactEmail: 'a.patel@mediconnect.org', contactPhone: '+1 (555) 234-5675', roomNo: 'Room 102' },
        { doctorId: 'DOC-106', doctorName: 'Dr. David Kim', specialization: 'Clinical & Surgical Dermatology', department: 'Dermatology', availability: 'On Call', contactEmail: 'd.kim@mediconnect.org', contactPhone: '+1 (555) 234-5676', roomNo: 'Room 501' }
      ];
      localStorage.setItem('mc_doctors', JSON.stringify(defaultDoctors));
    }

    if (!localStorage.getItem('mc_appointments')) {
      const defaultAppointments = [
        { appointmentId: 'APT-2001', patientId: 'PAT-1001', patientName: 'Arthur Pendelton', doctorName: 'Dr. Sarah Mitchell', department: 'Cardiology', appointmentDate: '2026-11-21', appointmentTime: '09:30 AM', appointmentStatus: 'Confirmed', notes: 'Routine cardiovascular follow-up post stent placement' },
        { appointmentId: 'APT-2002', patientId: 'PAT-1002', patientName: 'Beatrice Montgomery', doctorName: 'Dr. Robert Chen', department: 'Neurology', appointmentDate: '2026-11-21', appointmentTime: '10:15 AM', appointmentStatus: 'Confirmed', notes: 'Migraine with aura evaluation and EEG review' },
        { appointmentId: 'APT-2003', patientId: 'PAT-1003', patientName: 'Carlos Santillan', doctorName: 'Dr. Elena Rostova', department: 'Orthopedics', appointmentDate: '2026-11-21', appointmentTime: '11:00 AM', appointmentStatus: 'Pending', notes: 'Post-ACL reconstructive rehabilitation check' },
        { appointmentId: 'APT-2004', patientId: 'PAT-1004', patientName: 'Daisy Abernathy', doctorName: 'Dr. Marcus Vance', department: 'Pediatrics', appointmentDate: '2026-11-21', appointmentTime: '02:00 PM', appointmentStatus: 'Confirmed', notes: 'Pediatric annual wellness and asthma management' },
        { appointmentId: 'APT-2005', patientId: 'PAT-1005', patientName: 'Edward Thorne', doctorName: 'Dr. Aisha Patel', department: 'General Medicine', appointmentDate: '2026-11-21', appointmentTime: '03:15 PM', appointmentStatus: 'Completed', notes: 'Type-2 diabetes blood glucose review & medication titration' },
        { appointmentId: 'APT-2006', patientId: 'PAT-1006', patientName: 'Fiona Gallagher', doctorName: 'Dr. David Kim', department: 'Dermatology', appointmentDate: '2026-11-21', appointmentTime: '04:00 PM', appointmentStatus: 'Confirmed', notes: 'Eczema flare-up assessment and topical therapy review' },
        { appointmentId: 'APT-2007', patientId: 'PAT-1007', patientName: 'George Washington Clark', doctorName: 'Dr. Sarah Mitchell', department: 'Cardiology', appointmentDate: '2026-11-22', appointmentTime: '09:00 AM', appointmentStatus: 'Confirmed', notes: 'Hypertension management and ECG reading' },
        { appointmentId: 'APT-2008', patientId: 'PAT-1008', patientName: 'Helena Vance', doctorName: 'Dr. Aisha Patel', department: 'General Medicine', appointmentDate: '2026-11-22', appointmentTime: '10:30 AM', appointmentStatus: 'Pending', notes: 'General wellness assessment and lipid panel discussion' },
        { appointmentId: 'APT-2009', patientId: 'PAT-1009', patientName: 'Ian MacLeod', doctorName: 'Dr. Elena Rostova', department: 'Orthopedics', appointmentDate: '2026-11-22', appointmentTime: '01:30 PM', appointmentStatus: 'Confirmed', notes: 'Osteoarthritis management and joint mobility test' },
        { appointmentId: 'APT-2010', patientId: 'PAT-1010', patientName: 'Julia Ramirez', doctorName: 'Dr. Robert Chen', department: 'Neurology', appointmentDate: '2026-11-23', appointmentTime: '11:15 AM', appointmentStatus: 'Pending', notes: 'Neuropathy screening and reflex response monitoring' },
        { appointmentId: 'APT-2011', patientId: 'PAT-1011', patientName: 'Kevin Sterling', doctorName: 'Dr. Marcus Vance', department: 'Pediatrics', appointmentDate: '2026-11-23', appointmentTime: '03:45 PM', appointmentStatus: 'Confirmed', notes: 'Seasonal bronchitis recovery follow-up' },
        { appointmentId: 'APT-2012', patientId: 'PAT-1012', patientName: 'Laura Higgins', doctorName: 'Dr. David Kim', department: 'Dermatology', appointmentDate: '2026-11-24', appointmentTime: '10:00 AM', appointmentStatus: 'Cancelled', notes: 'Rescheduling requested by patient due to travel' }
      ];
      localStorage.setItem('mc_appointments', JSON.stringify(defaultAppointments));
    }

    if (!localStorage.getItem('mc_laboratory')) {
      const defaultLabReports = [
        { reportId: 'LAB-3001', patientId: 'PAT-1001', patientName: 'Arthur Pendelton', testName: 'Lipid Profile', testDate: '2026-11-19', laboratoryName: 'Central Cardio Pathology Lab', testResult: 'Total Cholesterol: 184 mg/dL (HDL: 52, LDL: 104, Trig: 140)', referenceRange: '< 200 mg/dL', reportStatus: 'Completed' },
        { reportId: 'LAB-3002', patientId: 'PAT-1001', patientName: 'Arthur Pendelton', testName: 'Complete Blood Count', testDate: '2026-11-19', laboratoryName: 'Central Hematology Lab', testResult: 'WBC: 6.8 K/uL, RBC: 4.8 M/uL, Platelets: 240 K/uL', referenceRange: 'WBC: 4.5-11.0 K/uL', reportStatus: 'Completed' },
        { reportId: 'LAB-3003', patientId: 'PAT-1002', patientName: 'Beatrice Montgomery', testName: 'Thyroid Function Test', testDate: '2026-11-18', laboratoryName: 'Endocrine Diagnostics Unit', testResult: 'TSH: 2.14 mIU/L, Free T4: 1.28 ng/dL', referenceRange: 'TSH: 0.4-4.0 mIU/L', reportStatus: 'Completed' },
        { reportId: 'LAB-3004', patientId: 'PAT-1003', patientName: 'Carlos Santillan', testName: 'Hemoglobin Test', testDate: '2026-11-20', laboratoryName: 'BioChem Specialty Diagnostic', testResult: 'Hb: 14.5 g/dL (Normal)', referenceRange: '13.5 - 17.5 g/dL', reportStatus: 'Completed' },
        { reportId: 'LAB-3005', patientId: 'PAT-1004', patientName: 'Daisy Abernathy', testName: 'Complete Blood Count', testDate: '2026-11-20', laboratoryName: 'Pediatric Diagnostic Core', testResult: 'WBC: 7.2 K/uL, Platelets: 285 K/uL', referenceRange: 'WBC: 5.0-12.0 K/uL', reportStatus: 'Completed' },
        { reportId: 'LAB-3006', patientId: 'PAT-1005', patientName: 'Edward Thorne', testName: 'Blood Glucose (Fasting & PP)', testDate: '2026-11-20', laboratoryName: 'Metabolic Health Laboratory', testResult: 'Fasting: 118 mg/dL, Post Prandial: 162 mg/dL', referenceRange: 'Fasting: 70-99 mg/dL', reportStatus: 'Completed' },
        { reportId: 'LAB-3007', patientId: 'PAT-1005', patientName: 'Edward Thorne', testName: 'Hemoglobin Test (HbA1c)', testDate: '2026-11-18', laboratoryName: 'Metabolic Health Laboratory', testResult: 'HbA1c: 6.7% (Fair Glycemic Control)', referenceRange: '< 5.7% (Normal)', reportStatus: 'Completed' },
        { reportId: 'LAB-3008', patientId: 'PAT-1006', patientName: 'Fiona Gallagher', testName: 'Skin Allergy Panel IgE', testDate: '2026-11-21', laboratoryName: 'ImmunoDerm Testing Lab', testResult: 'Total IgE: 145 IU/mL (Moderate elevation)', referenceRange: '< 100 IU/mL', reportStatus: 'Pending' },
        { reportId: 'LAB-3009', patientId: 'PAT-1007', patientName: 'George Washington Clark', testName: 'Lipid Profile', testDate: '2026-11-17', laboratoryName: 'Central Cardio Pathology Lab', testResult: 'Total Cholesterol: 215 mg/dL (Elevated LDL 138)', referenceRange: '< 200 mg/dL', reportStatus: 'Completed' },
        { reportId: 'LAB-3010', patientId: 'PAT-1008', patientName: 'Helena Vance', testName: 'Thyroid Function Test', testDate: '2026-11-21', laboratoryName: 'Endocrine Diagnostics Unit', testResult: 'Sample received in laboratory for TSH/FT3 assay', referenceRange: 'TSH: 0.4-4.0 mIU/L', reportStatus: 'In Analysis' },
        { reportId: 'LAB-3011', patientId: 'PAT-1009', patientName: 'Ian MacLeod', testName: 'Serum Uric Acid & ESR', testDate: '2026-11-16', laboratoryName: 'Rheumatology Clinical Lab', testResult: 'Uric Acid: 6.2 mg/dL, ESR: 18 mm/hr', referenceRange: 'Uric Acid: 3.5-7.2 mg/dL', reportStatus: 'Completed' },
        { reportId: 'LAB-3012', patientId: 'PAT-1010', patientName: 'Julia Ramirez', testName: 'Vitamin B12 & Folate', testDate: '2026-11-19', laboratoryName: 'NeuroVascular Reference Lab', testResult: 'B12: 480 pg/mL, Folate: 11.2 ng/mL', referenceRange: 'B12: 200-900 pg/mL', reportStatus: 'Completed' }
      ];
      localStorage.setItem('mc_laboratory', JSON.stringify(defaultLabReports));
    }

    if (!localStorage.getItem('mc_pharmacy')) {
      const defaultPharmacy = [
        { medicineId: 'MED-4001', medicineName: 'Atorvastatin 20mg', category: 'Antihypertensives', availableStock: 240, prescriptionStatus: 'Prescription Required', unitPrice: 14.50, manufacturer: 'Pfizer Pharma', expiryDate: '2027-08-31' },
        { medicineId: 'MED-4002', medicineName: 'Metformin HCl 500mg', category: 'Antidiabetics', availableStock: 380, prescriptionStatus: 'Prescription Required', unitPrice: 8.25, manufacturer: 'Merck Health', expiryDate: '2027-11-30' },
        { medicineId: 'MED-4003', medicineName: 'Amoxicillin & Clavulanate 625mg', category: 'Antibiotics', availableStock: 150, prescriptionStatus: 'Prescription Required', unitPrice: 18.00, manufacturer: 'GSK Healthcare', expiryDate: '2027-04-15' },
        { medicineId: 'MED-4004', medicineName: 'Levothyroxine Sodium 50mcg', category: 'Endocrine / Thyroid', availableStock: 210, prescriptionStatus: 'Prescription Required', unitPrice: 12.00, manufacturer: 'Abbott Diagnostics', expiryDate: '2028-01-20' },
        { medicineId: 'MED-4005', medicineName: 'Pantoprazole 40mg', category: 'Antacids & Gastro', availableStock: 420, prescriptionStatus: 'Over The Counter', unitPrice: 7.50, manufacturer: 'Sun Pharma', expiryDate: '2027-09-15' },
        { medicineId: 'MED-4006', medicineName: 'Ibuprofen 400mg', category: 'Analgesics & Anti-inflammatory', availableStock: 500, prescriptionStatus: 'Over The Counter', unitPrice: 5.00, manufacturer: 'Bayer Consumer Health', expiryDate: '2028-03-30' },
        { medicineId: 'MED-4007', medicineName: 'Montelukast Sodium 10mg', category: 'Respiratory & Allergy', availableStock: 180, prescriptionStatus: 'Prescription Required', unitPrice: 16.75, manufacturer: 'Merck & Co.', expiryDate: '2027-06-25' },
        { medicineId: 'MED-4008', medicineName: 'Amlodipine Besylate 5mg', category: 'Antihypertensives', availableStock: 290, prescriptionStatus: 'Prescription Required', unitPrice: 9.20, manufacturer: 'Novartis AG', expiryDate: '2027-12-10' },
        { medicineId: 'MED-4009', medicineName: 'Paracetamol 650mg Fast-Release', category: 'Analgesics & Anti-inflammatory', availableStock: 650, prescriptionStatus: 'Over The Counter', unitPrice: 3.50, manufacturer: 'GSK Consumer Health', expiryDate: '2028-05-31' },
        { medicineId: 'MED-4010', medicineName: 'Hydrocortisone Cream 1%', category: 'Dermatologicals', availableStock: 95, prescriptionStatus: 'Over The Counter', unitPrice: 11.00, manufacturer: 'Galderma Labs', expiryDate: '2027-07-20' },
        { medicineId: 'MED-4011', medicineName: 'Vitamin D3 60,000 IU Softgels', category: 'Vitamins & Supplements', availableStock: 320, prescriptionStatus: 'Over The Counter', unitPrice: 15.00, manufacturer: 'Cadila Healthcare', expiryDate: '2028-02-28' },
        { medicineId: 'MED-4012', medicineName: 'Losartan Potassium 50mg', category: 'Antihypertensives', availableStock: 160, prescriptionStatus: 'Prescription Required', unitPrice: 11.50, manufacturer: 'AstraZeneca', expiryDate: '2027-10-18' }
      ];
      localStorage.setItem('mc_pharmacy', JSON.stringify(defaultPharmacy));
    }
  },

  // Helper getters
  getPatients() { return JSON.parse(localStorage.getItem('mc_patients')) || []; },
  savePatients(data) { localStorage.setItem('mc_patients', JSON.stringify(data)); this.updateBadges(); },
  getDoctors() { return JSON.parse(localStorage.getItem('mc_doctors')) || []; },
  saveDoctors(data) { localStorage.setItem('mc_doctors', JSON.stringify(data)); },
  getAppointments() { return JSON.parse(localStorage.getItem('mc_appointments')) || []; },
  saveAppointments(data) { localStorage.setItem('mc_appointments', JSON.stringify(data)); this.updateBadges(); },
  getLaboratoryReports() { return JSON.parse(localStorage.getItem('mc_laboratory')) || []; },
  saveLaboratoryReports(data) { localStorage.setItem('mc_laboratory', JSON.stringify(data)); this.updateBadges(); },
  getPharmacy() { return JSON.parse(localStorage.getItem('mc_pharmacy')) || []; },
  savePharmacy(data) { localStorage.setItem('mc_pharmacy', JSON.stringify(data)); this.updateBadges(); },

  updateBadges() {
    const pCount = this.getPatients().length;
    const aCount = this.getAppointments().length;
    const lCount = this.getLaboratoryReports().length;
    const phCount = this.getPharmacy().length;

    const elP = document.getElementById('badge-patients-count');
    if (elP) elP.textContent = pCount;
    const elA = document.getElementById('badge-appointments-count');
    if (elA) elA.textContent = aCount;
    const elL = document.getElementById('badge-lab-count');
    if (elL) elL.textContent = lCount;
    const elPh = document.getElementById('badge-pharmacy-count');
    if (elPh) elPh.textContent = phCount;

    const kP = document.getElementById('kpi-total-patients');
    if (kP) kP.textContent = pCount;
    const kA = document.getElementById('kpi-today-appointments');
    if (kA) kA.textContent = aCount;
    const kL = document.getElementById('kpi-total-reports');
    if (kL) kL.textContent = lCount;
    const kPh = document.getElementById('kpi-pharmacy-records');
    if (kPh) kPh.textContent = phCount;
  },

  // ----------------------------------------------------------------------------
  // NAVIGATION CONTROLLER
  // ----------------------------------------------------------------------------
  setupEventListeners() {
    // Sidebar nav click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetSection = link.getAttribute('data-section');
        if (targetSection) {
          this.navigateTo(targetSection);
        }
      });
    });

    // Mobile menu toggle
    const mobBtn = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobBtn && sidebar) {
      mobBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Global Search
    const searchInp = document.getElementById('globalSearchInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 1) {
          // If searching, jump to patients or appointments if matching
          if (query.startsWith('pat') || query.startsWith('apt') || query.startsWith('lab') || query.startsWith('med')) {
            if (query.startsWith('pat')) { this.navigateTo('patients'); document.getElementById('patientSearchInput').value = query; this.renderPatients(); }
            else if (query.startsWith('apt')) { this.navigateTo('appointments'); document.getElementById('appointmentSearchInput').value = query; this.renderAppointments(); }
            else if (query.startsWith('lab')) { this.navigateTo('laboratory'); document.getElementById('labSearchInput').value = query; this.renderLaboratoryReports(); }
            else if (query.startsWith('med')) { this.navigateTo('pharmacy'); document.getElementById('pharmacySearchInput').value = query; this.renderPharmacy(); }
          }
        }
      });
    }

    // Filter event listeners
    const pSearch = document.getElementById('patientSearchInput');
    if (pSearch) pSearch.addEventListener('input', () => this.renderPatients());
    const pDept = document.getElementById('patientDeptFilter');
    if (pDept) pDept.addEventListener('change', () => this.renderPatients());
    const pBlood = document.getElementById('patientBloodFilter');
    if (pBlood) pBlood.addEventListener('change', () => this.renderPatients());

    const aptSearch = document.getElementById('appointmentSearchInput');
    if (aptSearch) aptSearch.addEventListener('input', () => this.renderAppointments());
    const aptStatus = document.getElementById('appointmentStatusFilter');
    if (aptStatus) aptStatus.addEventListener('change', () => this.renderAppointments());
    const aptDate = document.getElementById('appointmentDateFilter');
    if (aptDate) aptDate.addEventListener('change', () => this.renderAppointments());

    const labSearch = document.getElementById('labSearchInput');
    if (labSearch) labSearch.addEventListener('input', () => this.renderLaboratoryReports());
    const labTest = document.getElementById('labTestFilter');
    if (labTest) labTest.addEventListener('change', () => this.renderLaboratoryReports());
    const labStatus = document.getElementById('labStatusFilter');
    if (labStatus) labStatus.addEventListener('change', () => this.renderLaboratoryReports());

    const phSearch = document.getElementById('pharmacySearchInput');
    if (phSearch) phSearch.addEventListener('input', () => this.renderPharmacy());
    const phCat = document.getElementById('pharmacyCategoryFilter');
    if (phCat) phCat.addEventListener('change', () => this.renderPharmacy());
    const phRx = document.getElementById('pharmacyRxFilter');
    if (phRx) phRx.addEventListener('change', () => this.renderPharmacy());

    // Notifications button
    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.showToast('Clinical Notification', 'You have 3 diagnostic lab reports pending review and 6 appointments scheduled today.', 'info');
      });
    }
  },

  navigateTo(sectionId) {
    this.activeSection = sectionId;

    // Update nav links active class
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update section visibility
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetEl = document.getElementById(`section-${sectionId}`);
    if (targetEl) {
      targetEl.classList.add('active');
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
    }

    // Update top header title & description
    this.updateHeaderMeta(sectionId);

    // Re-render charts or tables if needed
    if (sectionId === 'dashboard') {
      this.renderDashboard();
    } else if (sectionId === 'patients') {
      this.renderPatients();
    } else if (sectionId === 'doctors') {
      this.renderDoctors();
    } else if (sectionId === 'appointments') {
      this.renderAppointments();
    } else if (sectionId === 'laboratory') {
      this.renderLaboratoryReports();
    } else if (sectionId === 'pharmacy') {
      this.renderPharmacy();
    } else if (sectionId === 'reports') {
      this.renderReports();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateHeaderMeta(sectionId) {
    const titles = {
      'dashboard': { title: '<i class="fa-solid fa-chart-pie" style="color: var(--primary-600);"></i> Hospital Operations Dashboard', desc: 'Connected Care. Smarter Healthcare – Centralized Java Web Service Platform' },
      'patients': { title: '<i class="fa-solid fa-hospital-user" style="color: var(--primary-600);"></i> Patient Information Management', desc: 'Centralized patient health records queryable via JAX-WS Web Services' },
      'doctors': { title: '<i class="fa-solid fa-user-doctor" style="color: var(--teal-600);"></i> Doctor & Department Directory', desc: 'Clinical practitioner directory across six specialized hospital units' },
      'appointments': { title: '<i class="fa-solid fa-calendar-check" style="color: var(--purple-600);"></i> Appointment Management', desc: 'Schedule, track, and update patient clinical consultations' },
      'laboratory': { title: '<i class="fa-solid fa-vial-virus" style="color: var(--teal-600);"></i> Laboratory Report Management', desc: 'Pathology findings, diagnostic observations, and reference intervals' },
      'pharmacy': { title: '<i class="fa-solid fa-prescription-bottle-medical" style="color: var(--danger-solid);"></i> Pharmacy Inventory & Formulary', desc: 'Hospital medication formulary, stock volumes, and prescription controls' },
      'services': { title: '<i class="fa-solid fa-cubes-stacked" style="color: var(--primary-600);"></i> Healthcare Web Service Operations', desc: 'JAX-WS Document-Literal SOAP operations exposed by HealthcareInformationService' },
      'architecture': { title: '<i class="fa-solid fa-network-wired" style="color: var(--primary-600);"></i> Database-Driven Web Service Architecture', desc: 'Multi-tier connection flow from external applications to centralized MySQL' },
      'soap-explorer': { title: '<i class="fa-solid fa-code" style="color: var(--primary-600);"></i> SOAP Message Structure Explorer', desc: 'Anatomical breakdown of SOAP Envelope, Header, Body, and Fault XML' },
      'wsdl-explorer': { title: '<i class="fa-solid fa-file-code" style="color: var(--primary-600);"></i> WSDL Contract Explorer', desc: 'Formal XML service description for HealthcareInformationService.wsdl' },
      'service-testing': { title: '<i class="fa-solid fa-bolt" style="color: var(--primary-600);"></i> Interactive SOAP Service Testing Console', desc: 'Execute real simulated SOAP requests and inspect live XML payloads' },
      'database': { title: '<i class="fa-solid fa-database" style="color: var(--primary-600);"></i> MySQL Database Management', desc: 'Inspect medic_connect_db tables and run interactive SQL queries' },
      'reports': { title: '<i class="fa-solid fa-file-invoice" style="color: var(--primary-600);"></i> Hospital Analytics & Clinical Reports', desc: 'Department workload metrics, blood group registries, and CSV export' }
    };

    const meta = titles[sectionId] || titles['dashboard'];
    const elTitle = document.getElementById('current-section-title');
    const elDesc = document.getElementById('current-section-desc');
    if (elTitle) elTitle.innerHTML = meta.title;
    if (elDesc) elDesc.textContent = meta.desc;
  },

  // ----------------------------------------------------------------------------
  // CHARTS & DASHBOARD
  // ----------------------------------------------------------------------------
  initCharts() {
    const trendCtx = document.getElementById('appointmentsTrendChart');
    if (trendCtx && typeof Chart !== 'undefined') {
      this.charts.trends = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
          datasets: [
            {
              label: 'Patient Admissions',
              data: [65, 78, 90, 85, 96, 114],
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#0284c7',
              pointRadius: 4
            },
            {
              label: 'Appointments Completed',
              data: [50, 68, 79, 72, 88, 102],
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.05)',
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#0d9488',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } },
            tooltip: { padding: 10, cornerRadius: 8 }
          },
          scales: {
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
            x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } }
          }
        }
      });
    }

    const deptCtx = document.getElementById('departmentDistributionChart');
    if (deptCtx && typeof Chart !== 'undefined') {
      this.charts.dept = new Chart(deptCtx, {
        type: 'doughnut',
        data: {
          labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology'],
          datasets: [{
            data: [2, 2, 2, 2, 2, 2], // 12 patients divided across departments
            backgroundColor: [
              '#0284c7', // Sky Blue
              '#0d9488', // Teal
              '#7c3aed', // Soft Purple
              '#f59e0b', // Amber
              '#10b981', // Green
              '#ec4899'  // Pink
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Plus Jakarta Sans', size: 11 } } }
          }
        }
      });
    }
  },

  renderDashboard() {
    this.updateBadges();

    // Render Recent Appointments on Dashboard
    const appts = this.getAppointments().slice(0, 5);
    const tbodyApt = document.getElementById('dashboard-recent-appointments-tbody');
    if (tbodyApt) {
      if (appts.length === 0) {
        tbodyApt.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No recent appointments.</td></tr>`;
      } else {
        tbodyApt.innerHTML = appts.map(a => `
          <tr>
            <td>
              <div style="font-weight: 700; color: var(--primary-700);">${a.patientName}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${a.patientId}</div>
            </td>
            <td>${a.doctorName}</td>
            <td>
              <div>${a.appointmentDate}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${a.appointmentTime}</div>
            </td>
            <td>${this.renderStatusBadge(a.appointmentStatus)}</td>
          </tr>
        `).join('');
      }
    }

    // Render Recent Lab Reports on Dashboard
    const labs = this.getLaboratoryReports().slice(0, 4);
    const labList = document.getElementById('dashboard-recent-lab-list');
    if (labList) {
      labList.innerHTML = labs.map(l => `
        <div style="background: var(--bg-surface-secondary); padding: 10px 14px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border-light);">
          <div>
            <div style="font-weight: 600; font-size: 13px; color: var(--text-main);">${l.testName}</div>
            <div style="font-size: 11.5px; color: var(--text-muted);">${l.patientName} (${l.patientId}) • ${l.testDate}</div>
          </div>
          <div>${this.renderStatusBadge(l.reportStatus)}</div>
        </div>
      `).join('');
    }
  },

  renderStatusBadge(status) {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
      case 'Available':
        return `<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> ${status}</span>`;
      case 'Pending':
      case 'In Analysis':
        return `<span class="badge badge-warning"><i class="fa-solid fa-hourglass-half"></i> ${status}</span>`;
      case 'Cancelled':
      case 'Critical':
        return `<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark"></i> ${status}</span>`;
      case 'In Surgery':
      case 'On Call':
        return `<span class="badge badge-purple"><i class="fa-solid fa-stethoscope"></i> ${status}</span>`;
      default:
        return `<span class="badge badge-info">${status}</span>`;
    }
  },

  // ----------------------------------------------------------------------------
  // PATIENT INFORMATION MANAGEMENT
  // ----------------------------------------------------------------------------
  renderPatients() {
    const patients = this.getPatients();
    const searchInp = document.getElementById('patientSearchInput');
    const deptFilter = document.getElementById('patientDeptFilter');
    const bloodFilter = document.getElementById('patientBloodFilter');

    const query = searchInp ? searchInp.value.trim().toLowerCase() : '';
    const dept = deptFilter ? deptFilter.value : 'ALL';
    const blood = bloodFilter ? bloodFilter.value : 'ALL';

    const filtered = patients.filter(p => {
      const matchQuery = !query || 
        p.patientId.toLowerCase().includes(query) || 
        p.patientName.toLowerCase().includes(query) || 
        p.mobile.toLowerCase().includes(query) ||
        p.doctorName.toLowerCase().includes(query);
      const matchDept = (dept === 'ALL') || (p.department === dept);
      const matchBlood = (blood === 'ALL') || (p.bloodGroup === blood);
      return matchQuery && matchDept && matchBlood;
    });

    const tbody = document.getElementById('patientsTableBody');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">No patients found matching the criteria.</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(p => `
          <tr>
            <td>
              <span class="badge badge-info" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${p.patientId}</span>
            </td>
            <td>
              <div style="font-weight: 700; color: var(--primary-800);">${p.patientName}</div>
              <div style="font-size: 11.5px; color: var(--text-muted);"><i class="fa-solid fa-location-dot" style="font-size: 10px;"></i> ${p.address}</div>
            </td>
            <td>${p.age} yrs / ${p.gender}</td>
            <td><span class="blood-badge">${p.bloodGroup}</span></td>
            <td>
              <div><i class="fa-solid fa-phone" style="font-size: 11px; color: var(--text-dim);"></i> ${p.mobile}</div>
              <div style="font-size: 11px; color: var(--text-muted);"><i class="fa-regular fa-envelope" style="font-size: 11px; color: var(--text-dim);"></i> ${p.email || 'N/A'}</div>
            </td>
            <td><span class="badge badge-teal">${p.department}</span></td>
            <td>
              <div style="font-weight: 600; color: var(--text-main);">${p.doctorName}</div>
            </td>
            <td style="text-align: right; white-space: nowrap;">
              <button class="btn btn-secondary btn-icon btn-sm" title="View Patient Health Record (PHR)" onclick="app.viewPatientProfile('${p.patientId}')">
                <i class="fa-solid fa-eye" style="color: var(--primary-600);"></i>
              </button>
              <button class="btn btn-secondary btn-icon btn-sm" title="Edit Patient Details" onclick="app.editPatient('${p.patientId}')">
                <i class="fa-solid fa-pen-to-square" style="color: var(--teal-600);"></i>
              </button>
              <button class="btn btn-secondary btn-icon btn-sm" title="Delete Patient Record" onclick="app.deletePatient('${p.patientId}')">
                <i class="fa-solid fa-trash" style="color: var(--danger-solid);"></i>
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Also update Cards view
    const cardsContainer = document.getElementById('patientsCardsView');
    if (cardsContainer) {
      cardsContainer.innerHTML = filtered.map(p => `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-info" style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">${p.patientId}</span>
                <h4 style="font-size: 16px; font-weight: 700; color: var(--primary-800); margin-top: 4px;">${p.patientName}</h4>
              </div>
              <span class="blood-badge">${p.bloodGroup}</span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
              <div><i class="fa-solid fa-user" style="width: 16px; color: var(--text-dim);"></i> ${p.age} years, ${p.gender}</div>
              <div><i class="fa-solid fa-stethoscope" style="width: 16px; color: var(--text-dim);"></i> ${p.department} (${p.doctorName})</div>
              <div><i class="fa-solid fa-phone" style="width: 16px; color: var(--text-dim);"></i> ${p.mobile}</div>
              <div><i class="fa-solid fa-location-dot" style="width: 16px; color: var(--text-dim);"></i> ${p.address}</div>
            </div>
          </div>
          <div style="border-top: 1px dashed var(--border-light); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
            <button class="btn btn-outline-primary btn-sm" onclick="app.viewPatientProfile('${p.patientId}')">
              <i class="fa-solid fa-id-card"></i> View Profile
            </button>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-icon btn-sm" onclick="app.editPatient('${p.patientId}')"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-secondary btn-icon btn-sm" onclick="app.deletePatient('${p.patientId}')"><i class="fa-solid fa-trash" style="color: var(--danger-solid);"></i></button>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  setPatientViewMode(mode) {
    this.patientViewMode = mode;
    const tbl = document.getElementById('patientsTableView');
    const crd = document.getElementById('patientsCardsView');
    const btnTbl = document.getElementById('viewModeTableBtn');
    const btnCrd = document.getElementById('viewModeCardBtn');

    if (mode === 'table') {
      if (tbl) tbl.style.display = 'block';
      if (crd) crd.style.display = 'none';
      if (btnTbl) btnTbl.classList.add('btn-primary');
      if (btnCrd) btnCrd.classList.remove('btn-primary');
    } else {
      if (tbl) tbl.style.display = 'none';
      if (crd) crd.style.display = 'grid';
      if (btnTbl) btnTbl.classList.remove('btn-primary');
      if (btnCrd) btnCrd.classList.add('btn-primary');
    }
  },

  openAddPatientModal() {
    document.getElementById('patientModalTitle').innerHTML = '<i class="fa-solid fa-user-plus" style="color: var(--primary-600);"></i> Add New Patient Record';
    document.getElementById('formPatient').reset();

    // Generate next patient ID
    const patients = this.getPatients();
    const nextId = 'PAT-' + (1000 + patients.length + 1);
    document.getElementById('pInputId').value = nextId;
    document.getElementById('pInputId').readOnly = false;

    this.populateDoctorSelect('pInputDoctor', 'Cardiology');
    this.openModal('modalPatient');
  },

  onPatientModalDeptChange() {
    const dept = document.getElementById('pInputDept').value;
    this.populateDoctorSelect('pInputDoctor', dept);
  },

  populateDoctorSelect(selectId, targetDept) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const doctors = this.getDoctors();
    const filteredDocs = targetDept ? doctors.filter(d => d.department === targetDept) : doctors;
    select.innerHTML = filteredDocs.map(d => `<option value="${d.doctorName}">${d.doctorName} (${d.department})</option>`).join('');
  },

  handlePatientSubmit(e) {
    e.preventDefault();
    const patientId = document.getElementById('pInputId').value.trim();
    const patientName = document.getElementById('pInputName').value.trim();
    const age = parseInt(document.getElementById('pInputAge').value, 10);
    const gender = document.getElementById('pInputGender').value;
    const bloodGroup = document.getElementById('pInputBlood').value;
    const mobile = document.getElementById('pInputMobile').value.trim();
    const email = document.getElementById('pInputEmail').value.trim();
    const department = document.getElementById('pInputDept').value;
    const doctorName = document.getElementById('pInputDoctor').value;
    const address = document.getElementById('pInputAddress').value.trim();

    if (!patientId || !patientName || !mobile || !address) {
      this.showToast('Validation Error', 'Please complete all required fields.', 'danger');
      return;
    }

    const patients = this.getPatients();
    const existingIndex = patients.findIndex(p => p.patientId === patientId);

    const record = { patientId, patientName, age, gender, bloodGroup, mobile, email, address, doctorName, department };

    if (existingIndex >= 0) {
      patients[existingIndex] = record;
      this.showToast('Patient Updated', `Record for ${patientName} (${patientId}) updated successfully.`, 'success');
    } else {
      patients.push(record);
      this.showToast('Patient Registered', `New record created for ${patientName} (${patientId}).`, 'success');
    }

    this.savePatients(patients);
    this.closeModal('modalPatient');
    this.renderPatients();
  },

  editPatient(patientId) {
    const patient = this.getPatients().find(p => p.patientId === patientId);
    if (!patient) return;

    document.getElementById('patientModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--teal-600);"></i> Edit Patient: ${patient.patientId}`;
    document.getElementById('pInputId').value = patient.patientId;
    document.getElementById('pInputId').readOnly = true;
    document.getElementById('pInputName').value = patient.patientName;
    document.getElementById('pInputAge').value = patient.age;
    document.getElementById('pInputGender').value = patient.gender;
    document.getElementById('pInputBlood').value = patient.bloodGroup;
    document.getElementById('pInputMobile').value = patient.mobile;
    document.getElementById('pInputEmail').value = patient.email;
    document.getElementById('pInputDept').value = patient.department;
    this.populateDoctorSelect('pInputDoctor', patient.department);
    document.getElementById('pInputDoctor').value = patient.doctorName;
    document.getElementById('pInputAddress').value = patient.address;

    this.openModal('modalPatient');
  },

  deletePatient(patientId) {
    if (confirm(`Are you sure you want to delete patient record ${patientId}?`)) {
      let patients = this.getPatients();
      patients = patients.filter(p => p.patientId !== patientId);
      this.savePatients(patients);
      this.showToast('Record Deleted', `Patient ${patientId} removed from registry.`, 'info');
      this.renderPatients();
    }
  },

  resetPatientData() {
    if (confirm('Reset patient records to default 12 fictional demonstration patients?')) {
      localStorage.removeItem('mc_patients');
      this.initDatabase();
      this.renderPatients();
      this.showToast('Reset Complete', 'Default patient records restored.', 'success');
    }
  },

  viewPatientProfile(patientId) {
    const patient = this.getPatients().find(p => p.patientId === patientId);
    if (!patient) return;

    const appointments = this.getAppointments().filter(a => a.patientId === patientId);
    const labReports = this.getLaboratoryReports().filter(l => l.patientId === patientId);

    const body = document.getElementById('patientDetailsBody');
    if (!body) return;

    body.innerHTML = `
      <div style="display: flex; gap: 18px; margin-bottom: 20px; align-items: center; background: linear-gradient(to right, #f0f9ff, #fff); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--primary-100);">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: var(--primary-600); color: #fff; font-size: 22px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);">
          ${patient.patientName.charAt(0)}
        </div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main);">${patient.patientName}</h3>
            <span class="blood-badge">${patient.bloodGroup}</span>
            <span class="badge badge-info">${patient.patientId}</span>
          </div>
          <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 4px;">
            ${patient.age} years old • ${patient.gender} • Dept: <strong>${patient.department}</strong>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 13px;">
        <div style="background: var(--bg-surface-secondary); padding: 12px; border-radius: var(--radius-md);">
          <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Attending Physician</div>
          <div style="font-weight: 600; color: var(--primary-800); margin-top: 2px;">${patient.doctorName}</div>
        </div>
        <div style="background: var(--bg-surface-secondary); padding: 12px; border-radius: var(--radius-md);">
          <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Contact Details</div>
          <div style="font-weight: 600; color: var(--text-main); margin-top: 2px;">${patient.mobile} • ${patient.email}</div>
        </div>
        <div style="grid-column: 1 / -1; background: var(--bg-surface-secondary); padding: 12px; border-radius: var(--radius-md);">
          <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Residential Address</div>
          <div style="font-weight: 600; color: var(--text-main); margin-top: 2px;">${patient.address}</div>
        </div>
      </div>

      <h5 style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
        <i class="fa-solid fa-calendar-check" style="color: var(--purple-600);"></i> Consultation Appointments (${appointments.length})
      </h5>
      <div style="margin-bottom: 18px; max-height: 140px; overflow-y: auto;">
        ${appointments.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No recorded appointments for this patient.</div>' : `
          <table class="custom-table" style="font-size: 12px;">
            <thead><tr><th>ID</th><th>Date & Time</th><th>Physician</th><th>Status</th></tr></thead>
            <tbody>
              ${appointments.map(a => `
                <tr>
                  <td>${a.appointmentId}</td>
                  <td>${a.appointmentDate} ${a.appointmentTime}</td>
                  <td>${a.doctorName}</td>
                  <td>${this.renderStatusBadge(a.appointmentStatus)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>

      <h5 style="font-size: 13.5px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
        <i class="fa-solid fa-vial-virus" style="color: var(--teal-600);"></i> Diagnostic Pathology Reports (${labReports.length})
      </h5>
      <div style="max-height: 140px; overflow-y: auto;">
        ${labReports.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No lab reports on file.</div>' : `
          <table class="custom-table" style="font-size: 12px;">
            <thead><tr><th>Test</th><th>Date</th><th>Result</th><th>Status</th></tr></thead>
            <tbody>
              ${labReports.map(l => `
                <tr>
                  <td><strong>${l.testName}</strong></td>
                  <td>${l.testDate}</td>
                  <td>${l.testResult}</td>
                  <td>${this.renderStatusBadge(l.reportStatus)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `;

    const btnTest = document.getElementById('btnTestSoapForPatient');
    if (btnTest) {
      btnTest.onclick = () => {
        this.closeModal('modalPatientDetails');
        this.navigateTo('service-testing');
        this.setTesterPreset(patient.patientId);
      };
    }

    this.openModal('modalPatientDetails');
  },

  // ----------------------------------------------------------------------------
  // DOCTOR DIRECTORY
  // ----------------------------------------------------------------------------
  renderDoctors() {
    const doctors = this.getDoctors();
    const filter = this.currentDoctorFilter;
    const filtered = filter === 'ALL' ? doctors : doctors.filter(d => d.department === filter);

    const grid = document.getElementById('doctorsGrid');
    if (!grid) return;

    grid.innerHTML = filtered.map(d => `
      <div class="doctor-card">
        <div class="doctor-card-top">
          <div class="doctor-avatar">
            <i class="fa-solid fa-user-doctor"></i>
          </div>
          <div class="doctor-meta">
            <h4>${d.doctorName}</h4>
            <div class="doctor-specialty">${d.specialization}</div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <span class="badge badge-teal">${d.department}</span>
          ${this.renderStatusBadge(d.availability)}
        </div>

        <ul class="doctor-details-list">
          <li><i class="fa-regular fa-hospital"></i> Consulting Cabin: <strong>${d.roomNo}</strong></li>
          <li><i class="fa-regular fa-envelope"></i> ${d.contactEmail}</li>
          <li><i class="fa-solid fa-phone"></i> ${d.contactPhone}</li>
        </ul>

        <button class="btn btn-primary btn-sm" style="margin-top: auto;" onclick="app.quickBookDoctor('${d.doctorName}', '${d.department}')">
          <i class="fa-regular fa-calendar-plus"></i> Schedule Consultation
        </button>
      </div>
    `).join('');
  },

  filterDoctors(dept) {
    this.currentDoctorFilter = dept;
    document.querySelectorAll('.chip[data-dept]').forEach(chip => {
      if (chip.getAttribute('data-dept') === dept) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
    this.renderDoctors();
  },

  quickBookDoctor(doctorName, department) {
    this.navigateTo('appointments');
    this.openBookAppointmentModal(doctorName, department);
  },

  // ----------------------------------------------------------------------------
  // APPOINTMENT MANAGEMENT
  // ----------------------------------------------------------------------------
  renderAppointments() {
    const appointments = this.getAppointments();
    const searchInp = document.getElementById('appointmentSearchInput');
    const statusFilter = document.getElementById('appointmentStatusFilter');
    const dateFilter = document.getElementById('appointmentDateFilter');

    const query = searchInp ? searchInp.value.trim().toLowerCase() : '';
    const status = statusFilter ? statusFilter.value : 'ALL';
    const date = dateFilter ? dateFilter.value : '';

    const filtered = appointments.filter(a => {
      const matchQuery = !query || 
        a.appointmentId.toLowerCase().includes(query) || 
        a.patientName.toLowerCase().includes(query) || 
        a.doctorName.toLowerCase().includes(query) ||
        a.patientId.toLowerCase().includes(query);
      const matchStatus = (status === 'ALL') || (a.appointmentStatus === status);
      const matchDate = !date || (a.appointmentDate === date);
      return matchQuery && matchStatus && matchDate;
    });

    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">No appointments found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td>
          <span class="badge badge-purple" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${a.appointmentId}</span>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${a.patientName}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${a.patientId}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--primary-700);">${a.doctorName}</div>
        </td>
        <td><span class="badge badge-teal">${a.department}</span></td>
        <td>
          <div style="font-weight: 600;">${a.appointmentDate}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${a.appointmentTime}</div>
        </td>
        <td>${this.renderStatusBadge(a.appointmentStatus)}</td>
        <td style="max-width: 220px; font-size: 12px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${a.notes || 'Routine consultation'}
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <select class="select-control" style="width: auto; padding: 4px 8px; font-size: 11.5px; display: inline-block;" onchange="app.updateAppointmentStatus('${a.appointmentId}', this.value)">
            <option value="" disabled selected>Update</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');
  },

  clearAppointmentFilters() {
    const s = document.getElementById('appointmentSearchInput');
    const st = document.getElementById('appointmentStatusFilter');
    const d = document.getElementById('appointmentDateFilter');
    if (s) s.value = '';
    if (st) st.value = 'ALL';
    if (d) d.value = '';
    this.renderAppointments();
  },

  openBookAppointmentModal(preselectedDoctor, preselectedDept) {
    const form = document.getElementById('formAppointment');
    if (form) form.reset();

    const appts = this.getAppointments();
    const nextId = 'APT-' + (2000 + appts.length + 1);
    document.getElementById('aptInputId').value = nextId;

    // Populate Patients
    const patients = this.getPatients();
    const patSelect = document.getElementById('aptSelectPatient');
    if (patSelect) {
      patSelect.innerHTML = patients.map(p => `<option value="${p.patientId}">${p.patientName} (${p.patientId}) - ${p.department}</option>`).join('');
    }

    // Populate Doctors
    const doctors = this.getDoctors();
    const docSelect = document.getElementById('aptSelectDoctor');
    if (docSelect) {
      docSelect.innerHTML = doctors.map(d => `<option value="${d.doctorName}" data-dept="${d.department}">${d.doctorName} (${d.department})</option>`).join('');
      if (preselectedDoctor) {
        docSelect.value = preselectedDoctor;
      }
    }

    // Default to today
    const dateInput = document.getElementById('aptInputDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }

    this.openModal('modalAppointment');
  },

  handleAppointmentSubmit(e) {
    e.preventDefault();
    const appointmentId = document.getElementById('aptInputId').value.trim();
    const patientId = document.getElementById('aptSelectPatient').value;
    const doctorName = document.getElementById('aptSelectDoctor').value;
    const appointmentStatus = document.getElementById('aptInputStatus').value;
    const appointmentDate = document.getElementById('aptInputDate').value;
    const appointmentTime = document.getElementById('aptInputTime').value.trim();
    const notes = document.getElementById('aptInputNotes').value.trim();

    const patient = this.getPatients().find(p => p.patientId === patientId);
    const doctor = this.getDoctors().find(d => d.doctorName === doctorName);

    if (!appointmentId || !patientId || !doctorName || !appointmentDate || !appointmentTime) {
      this.showToast('Validation Error', 'All appointment fields are mandatory.', 'danger');
      return;
    }

    const newAppointment = {
      appointmentId,
      patientId,
      patientName: patient ? patient.patientName : 'Registered Patient',
      doctorName,
      department: doctor ? doctor.department : (patient ? patient.department : 'General Medicine'),
      appointmentDate,
      appointmentTime,
      appointmentStatus,
      notes: notes || 'Clinical consultation scheduled'
    };

    const appts = this.getAppointments();
    appts.unshift(newAppointment);
    this.saveAppointments(appts);

    this.closeModal('modalAppointment');
    this.renderAppointments();
    this.showToast('Appointment Booked', `Appointment ${appointmentId} confirmed for ${patient ? patient.patientName : patientId}.`, 'success');
  },

  updateAppointmentStatus(appointmentId, newStatus) {
    if (!newStatus) return;
    const appts = this.getAppointments();
    const target = appts.find(a => a.appointmentId === appointmentId);
    if (target) {
      target.appointmentStatus = newStatus;
      this.saveAppointments(appts);
      this.renderAppointments();
      this.showToast('Status Updated', `Appointment ${appointmentId} marked as ${newStatus}.`, 'info');
    }
  },

  // ----------------------------------------------------------------------------
  // LABORATORY REPORT MANAGEMENT
  // ----------------------------------------------------------------------------
  renderLaboratoryReports() {
    const labReports = this.getLaboratoryReports();
    const searchInp = document.getElementById('labSearchInput');
    const testFilter = document.getElementById('labTestFilter');
    const statusFilter = document.getElementById('labStatusFilter');

    const query = searchInp ? searchInp.value.trim().toLowerCase() : '';
    const test = testFilter ? testFilter.value : 'ALL';
    const status = statusFilter ? statusFilter.value : 'ALL';

    const filtered = labReports.filter(l => {
      const matchQuery = !query || 
        l.reportId.toLowerCase().includes(query) || 
        l.patientId.toLowerCase().includes(query) || 
        l.patientName.toLowerCase().includes(query) || 
        l.testName.toLowerCase().includes(query);
      const matchTest = (test === 'ALL') || l.testName.includes(test);
      const matchStatus = (status === 'ALL') || (l.reportStatus === status);
      return matchQuery && matchTest && matchStatus;
    });

    const tbody = document.getElementById('labReportsTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px; color: var(--text-muted);">No lab reports found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(l => `
      <tr>
        <td>
          <span class="badge badge-teal" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${l.reportId}</span>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${l.patientName}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${l.patientId}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--primary-800);">${l.testName}</div>
        </td>
        <td>${l.testDate}</td>
        <td style="font-size: 12px; color: var(--text-muted);">${l.laboratoryName}</td>
        <td>
          <div style="font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-main);">${l.testResult}</div>
        </td>
        <td>
          <span style="font-size: 11.5px; color: var(--text-muted); background: var(--bg-surface-secondary); padding: 3px 6px; border-radius: 4px;">${l.referenceRange || 'N/A'}</span>
        </td>
        <td>${this.renderStatusBadge(l.reportStatus)}</td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="app.viewLabSlip('${l.reportId}')">
            <i class="fa-solid fa-file-lines" style="color: var(--teal-600);"></i> View Slip
          </button>
        </td>
      </tr>
    `).join('');
  },

  openAddLabReportModal() {
    const form = document.getElementById('formLabReport');
    if (form) form.reset();

    const labs = this.getLaboratoryReports();
    const nextId = 'LAB-' + (3000 + labs.length + 1);
    document.getElementById('labInputId').value = nextId;

    const patients = this.getPatients();
    const patSelect = document.getElementById('labSelectPatient');
    if (patSelect) {
      patSelect.innerHTML = patients.map(p => `<option value="${p.patientId}">${p.patientName} (${p.patientId})</option>`).join('');
    }

    const dateInput = document.getElementById('labInputDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    this.openModal('modalLabReport');
  },

  handleLabReportSubmit(e) {
    e.preventDefault();
    const reportId = document.getElementById('labInputId').value.trim();
    const patientId = document.getElementById('labSelectPatient').value;
    const testName = document.getElementById('labInputTestName').value;
    const laboratoryName = document.getElementById('labInputLabName').value.trim();
    const testDate = document.getElementById('labInputDate').value;
    const reportStatus = document.getElementById('labInputStatus').value;
    const testResult = document.getElementById('labInputResult').value.trim();
    const referenceRange = document.getElementById('labInputRange').value.trim();

    const patient = this.getPatients().find(p => p.patientId === patientId);

    const newReport = {
      reportId,
      patientId,
      patientName: patient ? patient.patientName : 'Hospital Patient',
      testName,
      testDate,
      laboratoryName,
      testResult,
      referenceRange,
      reportStatus
    };

    const labs = this.getLaboratoryReports();
    labs.unshift(newReport);
    this.saveLaboratoryReports(labs);

    this.closeModal('modalLabReport');
    this.renderLaboratoryReports();
    this.showToast('Lab Report Added', `Diagnostic report ${reportId} saved successfully.`, 'success');
  },

  viewLabSlip(reportId) {
    const report = this.getLaboratoryReports().find(l => l.reportId === reportId);
    if (!report) return;

    const patient = this.getPatients().find(p => p.patientId === report.patientId);

    const slip = document.getElementById('labSlipBody');
    if (!slip) return;

    slip.innerHTML = `
      <div style="border: 2px solid var(--border-light); border-radius: var(--radius-lg); padding: 24px; background: #fff;">
        
        <!-- Pathology Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--teal-600); padding-bottom: 14px; margin-bottom: 18px;">
          <div>
            <div style="font-size: 20px; font-weight: 800; color: var(--primary-800); letter-spacing: -0.5px;">MediConnect Central Pathology</div>
            <div style="font-size: 12px; color: var(--teal-700); font-weight: 600;">ISO 15189 Certified Clinical Diagnostic Center</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Department of Laboratory Medicine & Biomarkers</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: var(--text-main);">${report.reportId}</div>
            <div style="font-size: 11.5px; color: var(--text-muted);">Date: ${report.testDate}</div>
            <div style="margin-top: 4px;">${this.renderStatusBadge(report.reportStatus)}</div>
          </div>
        </div>

        <!-- Patient Demographics Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--bg-surface-secondary); padding: 12px 16px; border-radius: var(--radius-md); font-size: 12.5px; margin-bottom: 20px;">
          <div><strong>Patient Name:</strong> ${report.patientName}</div>
          <div><strong>Patient ID:</strong> ${report.patientId}</div>
          <div><strong>Age / Gender:</strong> ${patient ? `${patient.age} yrs / ${patient.gender}` : 'N/A'}</div>
          <div><strong>Blood Group:</strong> ${patient ? patient.bloodGroup : 'N/A'}</div>
          <div><strong>Referring Doctor:</strong> ${patient ? patient.doctorName : 'Attending Physician'}</div>
          <div><strong>Laboratory Unit:</strong> ${report.laboratoryName}</div>
        </div>

        <!-- Test Findings Table -->
        <table class="custom-table" style="margin-bottom: 24px;">
          <thead>
            <tr>
              <th>Diagnostic Test Description</th>
              <th>Observed Clinical Result</th>
              <th>Biological Reference Interval</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style="color: var(--primary-800);">${report.testName}</strong></td>
              <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--text-main); font-size: 13.5px;">
                ${report.testResult}
              </td>
              <td style="color: var(--text-muted); font-size: 12.5px;">
                ${report.referenceRange || 'Reference values standardized per WHO protocols'}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Sign-off Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px dashed var(--border-light); padding-top: 18px;">
          <div style="font-size: 11px; color: var(--text-dim); max-width: 320px;">
            Results validated electronically by computerized laboratory information system (LIS). Authenticated via SOAP Web Service interface.
          </div>
          <div style="text-align: center;">
            <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: var(--teal-700);">Dr. A. Vance, MD (Path)</div>
            <div style="font-size: 11px; font-weight: 700; color: var(--text-main); border-top: 1px solid var(--border-medium); padding-top: 3px; margin-top: 2px;">Chief Clinical Pathologist</div>
          </div>
        </div>

      </div>
    `;

    this.openModal('modalViewLabSlip');
  },

  // ----------------------------------------------------------------------------
  // PHARMACY INVENTORY MANAGEMENT
  // ----------------------------------------------------------------------------
  renderPharmacy() {
    const pharmacy = this.getPharmacy();
    const searchInp = document.getElementById('pharmacySearchInput');
    const catFilter = document.getElementById('pharmacyCategoryFilter');
    const rxFilter = document.getElementById('pharmacyRxFilter');

    const query = searchInp ? searchInp.value.trim().toLowerCase() : '';
    const cat = catFilter ? catFilter.value : 'ALL';
    const rx = rxFilter ? rxFilter.value : 'ALL';

    const filtered = pharmacy.filter(m => {
      const matchQuery = !query || 
        m.medicineId.toLowerCase().includes(query) || 
        m.medicineName.toLowerCase().includes(query) || 
        m.manufacturer.toLowerCase().includes(query);
      const matchCat = (cat === 'ALL') || (m.category === cat);
      const matchRx = (rx === 'ALL') || (m.prescriptionStatus === rx);
      return matchQuery && matchCat && matchRx;
    });

    const tbody = document.getElementById('pharmacyTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 30px; color: var(--text-muted);">No medication records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(m => {
      let stockBadge = '<span class="badge badge-success"><i class="fa-solid fa-check"></i> In Stock</span>';
      if (m.availableStock < 100) {
        stockBadge = '<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Critical Low</span>';
      } else if (m.availableStock < 200) {
        stockBadge = '<span class="badge badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> Low Stock</span>';
      }

      return `
        <tr>
          <td><span class="badge badge-info" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${m.medicineId}</span></td>
          <td>
            <div style="font-weight: 700; color: var(--text-main);">${m.medicineName}</div>
          </td>
          <td><span class="badge badge-teal">${m.category}</span></td>
          <td style="font-weight: 700; font-size: 14px;">${m.availableStock} units</td>
          <td>${stockBadge}</td>
          <td>
            <span class="badge ${m.prescriptionStatus === 'Prescription Required' ? 'badge-purple' : 'badge-info'}">
              ${m.prescriptionStatus}
            </span>
          </td>
          <td style="font-weight: 700; color: var(--teal-700);">$${Number(m.unitPrice).toFixed(2)}</td>
          <td style="font-size: 12px; color: var(--text-muted);">${m.manufacturer}</td>
          <td style="font-size: 12px;">${m.expiryDate || '2028-12-31'}</td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" onclick="app.adjustStockPrompt('${m.medicineId}')">
              <i class="fa-solid fa-boxes-stacked"></i> Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  openAddMedicineModal() {
    const form = document.getElementById('formPharmacy');
    if (form) form.reset();

    const ph = this.getPharmacy();
    const nextId = 'MED-' + (4000 + ph.length + 1);
    document.getElementById('medInputId').value = nextId;

    this.openModal('modalPharmacy');
  },

  handlePharmacySubmit(e) {
    e.preventDefault();
    const medicineId = document.getElementById('medInputId').value.trim();
    const medicineName = document.getElementById('medInputName').value.trim();
    const category = document.getElementById('medInputCat').value;
    const availableStock = parseInt(document.getElementById('medInputStock').value, 10);
    const prescriptionStatus = document.getElementById('medInputRx').value;
    const unitPrice = parseFloat(document.getElementById('medInputPrice').value);
    const manufacturer = document.getElementById('medInputMfr').value.trim() || 'General Pharma Labs';
    const expiryDate = document.getElementById('medInputExp').value || '2028-12-31';

    const newItem = { medicineId, medicineName, category, availableStock, prescriptionStatus, unitPrice, manufacturer, expiryDate };

    const ph = this.getPharmacy();
    ph.unshift(newItem);
    this.savePharmacy(ph);

    this.closeModal('modalPharmacy');
    this.renderPharmacy();
    this.showToast('Medicine Registered', `${medicineName} (${medicineId}) added to pharmacy stock.`, 'success');
  },

  adjustStockPrompt(medicineId) {
    const ph = this.getPharmacy();
    const item = ph.find(m => m.medicineId === medicineId);
    if (!item) return;

    const newUnitsStr = prompt(`Enter new stock quantity for ${item.medicineName} (Current: ${item.availableStock}):`, item.availableStock);
    if (newUnitsStr !== null) {
      const newStock = parseInt(newUnitsStr, 10);
      if (!isNaN(newStock) && newStock >= 0) {
        item.availableStock = newStock;
        this.savePharmacy(ph);
        this.renderPharmacy();
        this.showToast('Inventory Adjusted', `${item.medicineName} stock updated to ${newStock} units.`, 'info');
      } else {
        alert('Invalid stock quantity entered.');
      }
    }
  },

  // ----------------------------------------------------------------------------
  // ARCHITECTURE INTERACTIVE SIMULATOR
  // ----------------------------------------------------------------------------
  simulateArchitectureFlow() {
    const btn = document.getElementById('btnSimulateFlow');
    if (btn) btn.disabled = true;

    const tConsumers = document.getElementById('tier-consumers');
    const cSoap = document.getElementById('connector-soap');
    const tService = document.getElementById('tier-service');
    const cJdbc = document.getElementById('connector-jdbc');
    const tDb = document.getElementById('tier-database');

    const steps = [
      { el: tConsumers, text: '[Step 1/5] Doctor Application initiates SOAP request for patient PAT-1001...' },
      { el: cSoap, text: '[Step 2/5] SOAP 1.1 Envelope transmitted over HTTP POST to :8080/ws/healthcare...' },
      { el: tService, text: '[Step 3/5] HealthcareInformationServiceImpl unpacks XML & prepares PreparedStatement...' },
      { el: cJdbc, text: '[Step 4/5] JDBC Driver executes SQL query against MySQL medic_connect_db...' },
      { el: tDb, text: '[Step 5/5] MySQL returns ResultSet -> Serialized into SOAP Response XML -> Received by Doctor App!' }
    ];

    let current = 0;
    const runStep = () => {
      // Clear all styles
      [tConsumers, cSoap, tService, cJdbc, tDb].forEach(e => {
        if (e) {
          e.style.boxShadow = '';
          e.style.borderColor = '';
        }
      });

      if (current < steps.length) {
        const item = steps[current];
        if (item.el) {
          item.el.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.4)';
          item.el.style.borderColor = 'var(--primary-600)';
        }
        this.showToast('Architecture Simulation', item.text, 'info');
        current++;
        setTimeout(runStep, 1100);
      } else {
        if (btn) btn.disabled = false;
        this.showToast('Simulation Complete', 'End-to-end SOAP Web Service flow verified successfully.', 'success');
      }
    };

    runStep();
  },

  showArchDetails(componentKey) {
    const infoMap = {
      'doctor-app': 'The Doctor Application acts as a SOAP Service Consumer. It sends a getPatientById request envelope containing the Patient ID to retrieve clinical demographics before consultation.',
      'lab-app': 'The Laboratory Application consumes getLaboratoryReports to verify existing diagnostic history and associates new pathology findings with centralized patient records.',
      'patient-app': 'Patient Portals consume getAppointments and getPatientById to display upcoming doctor schedules and personal medical profile securely.',
      'pharmacy-app': 'The Pharmacy System queries patient records to verify prescription validity and check medication dispensing records.',
      'jaxws': 'HealthcareInformationService is the JAX-WS annotated Service Endpoint Interface (SEI) defining the SOAP web service contract.',
      'wsdl': 'The WSDL contract describes data types (XSD), input/output messages, portType operations, and HTTP binding endpoints for client generation.',
      'sib': 'HealthcareInformationServiceImpl is the Service Implementation Bean (SIB) implementing business logic and throwing SOAP Faults for missing patient records.',
      'tbl-patients': 'The patients table stores demographic records and enforces referential integrity through foreign key constraints linking to the doctors table.',
      'tbl-doctors': 'The doctors table maintains clinician profiles, departments, and real-time on-duty availability.',
      'tbl-appointments': 'The appointments table tracks clinical consultation bookings with foreign keys to both patients and doctors.',
      'tbl-lab': 'The laboratory_reports table stores quantitative and qualitative test values, reference intervals, and validation status.',
      'tbl-pharmacy': 'The pharmacy table maintains hospital medication supplies, unit pricing, and prescription requirements.'
    };

    const text = infoMap[componentKey] || 'MediConnect Core System Component';
    alert(text);
  },

  // ----------------------------------------------------------------------------
  // SOAP MESSAGE EXPLORER
  // ----------------------------------------------------------------------------
  selectSoapAnatomy(part) {
    document.querySelectorAll('.soap-part-card').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(`soap-card-${part}`);
    if (target) target.classList.add('active');

    if (part === 'envelope') {
      this.displaySoapSample('request');
    } else if (part === 'header') {
      this.displaySoapSample('request');
      this.showToast('SOAP Header', 'Header element demonstrated in the XML viewer. Used for authentication credentials & transaction routing.', 'info');
    } else if (part === 'body') {
      this.displaySoapSample('response');
    } else if (part === 'fault') {
      this.displaySoapSample('fault');
    }
  },

  displaySoapSample(type) {
    const titleEl = document.getElementById('soapExplorerTitle');
    const container = document.getElementById('soapExplorerXmlContainer');
    const countEl = document.getElementById('soapExplorerCharCount');

    let xml = '';
    let title = '';

    if (type === 'request') {
      title = 'SOAP 1.1 Request – getPatientById("PAT-1001")';
      xml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    
    <!-- Optional SOAP Header for Security & Routing -->
    <soapenv:Header>
        <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <wsse:UsernameToken>
                <wsse:Username>clinical_client_01</wsse:Username>
            </wsse:UsernameToken>
        </wsse:Security>
    </soapenv:Header>

    <!-- SOAP Body: Operation Call with Parameters -->
    <soapenv:Body>
        <ser:getPatientById>
            <patientId>PAT-1001</patientId>
        </ser:getPatientById>
    </soapenv:Body>

</soapenv:Envelope>`;
    } else if (type === 'response') {
      title = 'SOAP 1.1 Response – getPatientByIdResponse (HTTP 200 OK)';
      xml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    
    <soapenv:Header/>

    <!-- SOAP Body: Structured Patient Record from MySQL JDBC -->
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

</soapenv:Envelope>`;
    } else if (type === 'fault') {
      title = 'SOAP 1.1 Fault Response – Patient Not Found (HTTP 500)';
      xml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    
    <soapenv:Body>
        <!-- SOAP Fault Element -->
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

</soapenv:Envelope>`;
    } else if (type === 'lab') {
      title = 'SOAP 1.1 Response – getLaboratoryReportsResponse';
      xml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    
    <soapenv:Body>
        <ser:getLaboratoryReportsResponse>
            <laboratoryReport>
                <reportId>LAB-3001</reportId>
                <patientId>PAT-1001</patientId>
                <testName>Lipid Profile</testName>
                <testDate>2026-11-19</testDate>
                <laboratoryName>Central Cardio Pathology Lab</laboratoryName>
                <testResult>Total Cholesterol: 184 mg/dL (HDL: 52, LDL: 104, Trig: 140)</testResult>
                <referenceRange>&lt; 200 mg/dL</referenceRange>
                <reportStatus>Completed</reportStatus>
            </laboratoryReport>
            <laboratoryReport>
                <reportId>LAB-3002</reportId>
                <patientId>PAT-1001</patientId>
                <testName>Complete Blood Count</testName>
                <testDate>2026-11-19</testDate>
                <laboratoryName>Central Hematology Lab</laboratoryName>
                <testResult>WBC: 6.8 K/uL, RBC: 4.8 M/uL, Platelets: 240 K/uL</testResult>
                <referenceRange>WBC: 4.5-11.0 K/uL</referenceRange>
                <reportStatus>Completed</reportStatus>
            </laboratoryReport>
        </ser:getLaboratoryReportsResponse>
    </soapenv:Body>

</soapenv:Envelope>`;
    }

    if (titleEl) titleEl.textContent = title;
    if (container) container.innerHTML = this.syntaxHighlightXml(xml);
    if (countEl) countEl.textContent = `${xml.length} characters`;
  },

  syntaxHighlightXml(xml) {
    const escaped = xml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="xml-comment">$1</span>')
      .replace(/(&lt;soapenv:Fault[\s\S]*?&lt;\/soapenv:Fault&gt;)/g, '<span class="xml-fault">$1</span>')
      .replace(/(&lt;\/?[a-zA-Z0-9_:-]+)(\s|&gt;)/g, '<span class="xml-tag">$1</span>$2')
      .replace(/([a-zA-Z0-9_:-]+)=(&quot;.*?&quot;)/g, '<span class="xml-attr-name">$1</span>=<span class="xml-attr-val">$2</span>');
  },

  copySoapExplorerXml() {
    const container = document.getElementById('soapExplorerXmlContainer');
    if (container) {
      navigator.clipboard.writeText(container.innerText);
      this.showToast('Copied to Clipboard', 'SOAP XML message copied.', 'success');
    }
  },

  // ----------------------------------------------------------------------------
  // WSDL EXPLORER
  // ----------------------------------------------------------------------------
  renderWsdlViewer(section = 'all') {
    const container = document.getElementById('wsdlCodeContainer');
    if (!container) return;

    const fullWsdl = 
`<?xml version="1.0" encoding="UTF-8"?>
<!-- ========================================================================= -->
<!-- Web Services Description Language (WSDL) Contract                         -->
<!-- Service: HealthcareInformationService                                     -->
<!-- Target Namespace: http://service.mediconnect.com/                         -->
<!-- Protocol: SOAP 1.1 / HTTP / Document-Literal Wrapped                       -->
<!-- ========================================================================= -->
<wsdl:definitions 
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://service.mediconnect.com/"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    name="HealthcareInformationService"
    targetNamespace="http://service.mediconnect.com/">

    <!-- ===================================================================== -->
    <!-- 1. DATA TYPES (XML Schema Definition - XSD)                           -->
    <!-- ===================================================================== -->
    <wsdl:types>
        <xs:schema targetNamespace="http://service.mediconnect.com/" elementFormDefault="qualified">

            <!-- Patient Complex Type -->
            <xs:complexType name="patient">
                <xs:sequence>
                    <xs:element name="patientId" type="xs:string"/>
                    <xs:element name="patientName" type="xs:string"/>
                    <xs:element name="age" type="xs:int"/>
                    <xs:element name="gender" type="xs:string"/>
                    <xs:element name="bloodGroup" type="xs:string"/>
                    <xs:element name="mobile" type="xs:string"/>
                    <xs:element name="email" type="xs:string" minOccurs="0"/>
                    <xs:element name="address" type="xs:string" minOccurs="0"/>
                    <xs:element name="doctorName" type="xs:string" minOccurs="0"/>
                    <xs:element name="department" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>

            <!-- Laboratory Report Complex Type -->
            <xs:complexType name="laboratoryReport">
                <xs:sequence>
                    <xs:element name="reportId" type="xs:string"/>
                    <xs:element name="patientId" type="xs:string"/>
                    <xs:element name="testName" type="xs:string"/>
                    <xs:element name="testDate" type="xs:string"/>
                    <xs:element name="laboratoryName" type="xs:string"/>
                    <xs:element name="testResult" type="xs:string"/>
                    <xs:element name="referenceRange" type="xs:string" minOccurs="0"/>
                    <xs:element name="reportStatus" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>

            <!-- Appointment Complex Type -->
            <xs:complexType name="appointment">
                <xs:sequence>
                    <xs:element name="appointmentId" type="xs:string"/>
                    <xs:element name="patientId" type="xs:string"/>
                    <xs:element name="doctorName" type="xs:string"/>
                    <xs:element name="appointmentDate" type="xs:string"/>
                    <xs:element name="appointmentTime" type="xs:string"/>
                    <xs:element name="appointmentStatus" type="xs:string"/>
                    <xs:element name="notes" type="xs:string" minOccurs="0"/>
                </xs:sequence>
            </xs:complexType>

            <!-- SOAP Fault Detail Complex Type -->
            <xs:complexType name="healthcareFault">
                <xs:sequence>
                    <xs:element name="errorCode" type="xs:string"/>
                    <xs:element name="errorMessage" type="xs:string"/>
                    <xs:element name="details" type="xs:string" minOccurs="0"/>
                    <xs:element name="timestamp" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>

            <!-- Element Declarations for Document-Wrapped Operations -->
            <xs:element name="getPatientById">
                <xs:complexType><xs:sequence><xs:element name="patientId" type="xs:string"/></xs:sequence></xs:complexType>
            </xs:element>
            <xs:element name="getPatientByIdResponse">
                <xs:complexType><xs:sequence><xs:element name="patient" type="tns:patient" minOccurs="0"/></xs:sequence></xs:complexType>
            </xs:element>

            <xs:element name="getLaboratoryReports">
                <xs:complexType><xs:sequence><xs:element name="patientId" type="xs:string"/></xs:sequence></xs:complexType>
            </xs:element>
            <xs:element name="getLaboratoryReportsResponse">
                <xs:complexType><xs:sequence><xs:element name="laboratoryReport" type="tns:laboratoryReport" minOccurs="0" maxOccurs="unbounded"/></xs:sequence></xs:complexType>
            </xs:element>

            <xs:element name="getAppointments">
                <xs:complexType><xs:sequence><xs:element name="patientId" type="xs:string"/></xs:sequence></xs:complexType>
            </xs:element>
            <xs:element name="getAppointmentsResponse">
                <xs:complexType><xs:sequence><xs:element name="appointment" type="tns:appointment" minOccurs="0" maxOccurs="unbounded"/></xs:sequence></xs:complexType>
            </xs:element>

            <xs:element name="getAllPatients">
                <xs:complexType><xs:sequence/></xs:complexType>
            </xs:element>
            <xs:element name="getAllPatientsResponse">
                <xs:complexType><xs:sequence><xs:element name="patient" type="tns:patient" minOccurs="0" maxOccurs="unbounded"/></xs:sequence></xs:complexType>
            </xs:element>

            <xs:element name="HealthcareFault" type="tns:healthcareFault"/>
        </xs:schema>
    </wsdl:types>

    <!-- ===================================================================== -->
    <!-- 2. WSDL MESSAGES                                                      -->
    <!-- ===================================================================== -->
    <wsdl:message name="getPatientByIdRequest"><wsdl:part name="parameters" element="tns:getPatientById"/></wsdl:message>
    <wsdl:message name="getPatientByIdResponse"><wsdl:part name="parameters" element="tns:getPatientByIdResponse"/></wsdl:message>

    <wsdl:message name="getLaboratoryReportsRequest"><wsdl:part name="parameters" element="tns:getLaboratoryReports"/></wsdl:message>
    <wsdl:message name="getLaboratoryReportsResponse"><wsdl:part name="parameters" element="tns:getLaboratoryReportsResponse"/></wsdl:message>

    <wsdl:message name="getAppointmentsRequest"><wsdl:part name="parameters" element="tns:getAppointments"/></wsdl:message>
    <wsdl:message name="getAppointmentsResponse"><wsdl:part name="parameters" element="tns:getAppointmentsResponse"/></wsdl:message>

    <wsdl:message name="getAllPatientsRequest"><wsdl:part name="parameters" element="tns:getAllPatients"/></wsdl:message>
    <wsdl:message name="getAllPatientsResponse"><wsdl:part name="parameters" element="tns:getAllPatientsResponse"/></wsdl:message>

    <wsdl:message name="HealthcareServiceException"><wsdl:part name="fault" element="tns:HealthcareFault"/></wsdl:message>

    <!-- ===================================================================== -->
    <!-- 3. PORT TYPE (INTERFACE)                                              -->
    <!-- ===================================================================== -->
    <wsdl:portType name="HealthcareInformationService">
        <wsdl:operation name="getPatientById">
            <wsdl:input message="tns:getPatientByIdRequest"/>
            <wsdl:output message="tns:getPatientByIdResponse"/>
            <wsdl:fault name="HealthcareServiceException" message="tns:HealthcareServiceException"/>
        </wsdl:operation>
        <wsdl:operation name="getLaboratoryReports">
            <wsdl:input message="tns:getLaboratoryReportsRequest"/>
            <wsdl:output message="tns:getLaboratoryReportsResponse"/>
            <wsdl:fault name="HealthcareServiceException" message="tns:HealthcareServiceException"/>
        </wsdl:operation>
        <wsdl:operation name="getAppointments">
            <wsdl:input message="tns:getAppointmentsRequest"/>
            <wsdl:output message="tns:getAppointmentsResponse"/>
            <wsdl:fault name="HealthcareServiceException" message="tns:HealthcareServiceException"/>
        </wsdl:operation>
        <wsdl:operation name="getAllPatients">
            <wsdl:input message="tns:getAllPatientsRequest"/>
            <wsdl:output message="tns:getAllPatientsResponse"/>
            <wsdl:fault name="HealthcareServiceException" message="tns:HealthcareServiceException"/>
        </wsdl:operation>
    </wsdl:portType>

    <!-- ===================================================================== -->
    <!-- 4. SOAP BINDING                                                       -->
    <!-- ===================================================================== -->
    <wsdl:binding name="HealthcareInformationServicePortBinding" type="tns:HealthcareInformationService">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http" style="document"/>
        <wsdl:operation name="getPatientById">
            <soap:operation soapAction="getPatientById"/>
            <wsdl:input><soap:body use="literal"/></wsdl:input>
            <wsdl:output><soap:body use="literal"/></wsdl:output>
            <wsdl:fault name="HealthcareServiceException"><soap:fault name="HealthcareServiceException" use="literal"/></wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="getLaboratoryReports">
            <soap:operation soapAction="getLaboratoryReports"/>
            <wsdl:input><soap:body use="literal"/></wsdl:input>
            <wsdl:output><soap:body use="literal"/></wsdl:output>
            <wsdl:fault name="HealthcareServiceException"><soap:fault name="HealthcareServiceException" use="literal"/></wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="getAppointments">
            <soap:operation soapAction="getAppointments"/>
            <wsdl:input><soap:body use="literal"/></wsdl:input>
            <wsdl:output><soap:body use="literal"/></wsdl:output>
            <wsdl:fault name="HealthcareServiceException"><soap:fault name="HealthcareServiceException" use="literal"/></wsdl:fault>
        </wsdl:operation>
        <wsdl:operation name="getAllPatients">
            <soap:operation soapAction="getAllPatients"/>
            <wsdl:input><soap:body use="literal"/></wsdl:input>
            <wsdl:output><soap:body use="literal"/></wsdl:output>
            <wsdl:fault name="HealthcareServiceException"><soap:fault name="HealthcareServiceException" use="literal"/></wsdl:fault>
        </wsdl:operation>
    </wsdl:binding>

    <!-- ===================================================================== -->
    <!-- 5. SERVICE ENDPOINT DEFINITION                                        -->
    <!-- ===================================================================== -->
    <wsdl:service name="HealthcareInformationService">
        <wsdl:port name="HealthcareInformationServicePort" binding="tns:HealthcareInformationServicePortBinding">
            <soap:address location="http://localhost:8080/ws/healthcare"/>
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>`;

    container.innerHTML = this.syntaxHighlightXml(fullWsdl);
  },

  filterWsdlSection(sec) {
    this.renderWsdlViewer(sec);
    this.showToast('WSDL Explorer', `Filtering WSDL contract to inspect ${sec} element definitions.`, 'info');
  },

  copyWsdlXml() {
    const container = document.getElementById('wsdlCodeContainer');
    if (container) {
      navigator.clipboard.writeText(container.innerText);
      this.showToast('Copied to Clipboard', 'Complete WSDL 1.1 specification copied.', 'success');
    }
  },

  downloadWsdlFile() {
    const container = document.getElementById('wsdlCodeContainer');
    if (!container) return;
    const blob = new Blob([container.innerText], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HealthcareInformationService.wsdl';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Downloaded', 'HealthcareInformationService.wsdl saved to your device.', 'success');
  },

  // ----------------------------------------------------------------------------
  // SERVICE TESTING CONSOLE (SIMULATED & BACKEND COMPATIBLE)
  // ----------------------------------------------------------------------------
  onTesterOperationChange() {
    const op = document.getElementById('testerOperationSelect').value;
    const paramGroup = document.getElementById('testerParamGroup');
    const actionLbl = document.getElementById('lblCurrentSoapAction');

    if (actionLbl) actionLbl.textContent = `"${op}"`;

    if (op === 'getAllPatients') {
      if (paramGroup) paramGroup.style.display = 'none';
    } else {
      if (paramGroup) paramGroup.style.display = 'block';
    }
  },

  setTesterPreset(patientId) {
    const inp = document.getElementById('testerPatientIdInput');
    if (inp) inp.value = patientId;
    this.executeSoapTest();
  },

  testSpecificOperation(opName, patientId) {
    this.navigateTo('service-testing');
    const opSelect = document.getElementById('testerOperationSelect');
    if (opSelect) opSelect.value = opName;
    const inp = document.getElementById('testerPatientIdInput');
    if (inp && patientId) inp.value = patientId;
    this.onTesterOperationChange();
    this.executeSoapTest();
  },

  executeSoapTest() {
    const op = document.getElementById('testerOperationSelect').value;
    const patientIdInp = document.getElementById('testerPatientIdInput');
    const patientId = patientIdInp ? patientIdInp.value.trim() : '';

    const btn = document.getElementById('btnExecuteSoap');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Request...';
    }

    // Simulate realistic 30-55ms network & database query latency
    const latency = Math.floor(Math.random() * 25) + 30;

    setTimeout(() => {
      this.processSoapInvocation(op, patientId, latency);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send SOAP Request';
      }
    }, latency);
  },

  processSoapInvocation(op, patientId, latency) {
    // 1. Build SOAP Request XML
    let reqXml = '';
    if (op === 'getPatientById') {
      reqXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getPatientById>
            <patientId>${patientId}</patientId>
        </ser:getPatientById>
    </soapenv:Body>
</soapenv:Envelope>`;
    } else if (op === 'getLaboratoryReports') {
      reqXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getLaboratoryReports>
            <patientId>${patientId}</patientId>
        </ser:getLaboratoryReports>
    </soapenv:Body>
</soapenv:Envelope>`;
    } else if (op === 'getAppointments') {
      reqXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getAppointments>
            <patientId>${patientId}</patientId>
        </ser:getAppointments>
    </soapenv:Body>
</soapenv:Envelope>`;
    } else if (op === 'getAllPatients') {
      reqXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getAllPatients/>
    </soapenv:Body>
</soapenv:Envelope>`;
    }

    // 2. Query Mock / Central Database
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const labReports = this.getLaboratoryReports();

    let resXml = '';
    let visualHtml = '';
    let isFault = false;

    // Check if ID is empty or equals PAT-9999 or record not found
    if ((op !== 'getAllPatients') && (!patientId || patientId === 'PAT-9999' || !patients.some(p => p.patientId === patientId))) {
      // GENERATE AUTHENTIC SOAP FAULT
      isFault = true;
      const targetId = patientId || 'NULL';
      resXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>soapenv:Client</faultcode>
            <faultstring>Patient Not Found: No healthcare record exists for ID ${targetId}</faultstring>
            <detail>
                <ser:HealthcareFault>
                    <errorCode>ERR-RECORD-NOT-FOUND</errorCode>
                    <errorMessage>Patient with ID '${targetId}' does not exist in medic_connect_db.</errorMessage>
                    <details>Verify patient identification number in registry.</details>
                    <timestamp>${new Date().toISOString()}</timestamp>
                </ser:HealthcareFault>
            </detail>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>`;

      visualHtml = `
        <div style="background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-lg); padding: 22px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 24px; color: var(--danger-solid);"></i>
            <div>
              <h4 style="font-size: 16px; font-weight: 700; color: var(--danger-text);">SOAP Fault Returned (Client Error)</h4>
              <div style="font-size: 12px; color: var(--danger-text);">HTTP/1.1 500 Internal Server Error</div>
            </div>
          </div>
          <div style="background: #fff; padding: 14px; border-radius: var(--radius-md); font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.6; border: 1px solid var(--danger-border);">
            <div><strong>&lt;faultcode&gt;:</strong> soapenv:Client</div>
            <div><strong>&lt;faultstring&gt;:</strong> Patient Not Found: No healthcare record exists for ID ${targetId}</div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--danger-border);">
              <div><strong>&lt;errorCode&gt;:</strong> ERR-RECORD-NOT-FOUND</div>
              <div><strong>&lt;errorMessage&gt;:</strong> Patient with ID '${targetId}' does not exist in medic_connect_db.</div>
              <div><strong>&lt;timestamp&gt;:</strong> ${new Date().toISOString()}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // SUCCESSFUL OPERATION
      if (op === 'getPatientById') {
        const p = patients.find(x => x.patientId === patientId);
        resXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <ser:getPatientByIdResponse>
            <patient>
                <patientId>${p.patientId}</patientId>
                <patientName>${p.patientName}</patientName>
                <age>${p.age}</age>
                <gender>${p.gender}</gender>
                <bloodGroup>${p.bloodGroup}</bloodGroup>
                <mobile>${p.mobile}</mobile>
                <email>${p.email || ''}</email>
                <address>${p.address}</address>
                <doctorName>${p.doctorName}</doctorName>
                <department>${p.department}</department>
            </patient>
        </ser:getPatientByIdResponse>
    </soapenv:Body>
</soapenv:Envelope>`;

        visualHtml = `
          <div class="parsed-result-card">
            <div class="parsed-result-header">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge badge-info" style="font-family: 'JetBrains Mono', monospace; font-size: 12px;">${p.patientId}</span>
                <h4 style="font-size: 17px; font-weight: 700; color: var(--text-main);">${p.patientName}</h4>
              </div>
              <span class="blood-badge">${p.bloodGroup}</span>
            </div>
            <div class="parsed-key-val-grid">
              <div class="parsed-item"><label>Age / Gender</label><span>${p.age} years / ${p.gender}</span></div>
              <div class="parsed-item"><label>Clinical Department</label><span>${p.department}</span></div>
              <div class="parsed-item"><label>Primary Doctor</label><span>${p.doctorName}</span></div>
              <div class="parsed-item"><label>Mobile Phone</label><span>${p.mobile}</span></div>
              <div class="parsed-item"><label>Email</label><span>${p.email || 'N/A'}</span></div>
              <div class="parsed-item"><label>Address</label><span>${p.address}</span></div>
            </div>
          </div>
        `;
      } else if (op === 'getLaboratoryReports') {
        const matches = labReports.filter(l => l.patientId === patientId);
        resXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <ser:getLaboratoryReportsResponse>
${matches.map(l => `            <laboratoryReport>
                <reportId>${l.reportId}</reportId>
                <patientId>${l.patientId}</patientId>
                <testName>${l.testName}</testName>
                <testDate>${l.testDate}</testDate>
                <laboratoryName>${l.laboratoryName}</laboratoryName>
                <testResult>${l.testResult}</testResult>
                <referenceRange>${l.referenceRange || ''}</referenceRange>
                <reportStatus>${l.reportStatus}</reportStatus>
            </laboratoryReport>`).join('\n')}
        </ser:getLaboratoryReportsResponse>
    </soapenv:Body>
</soapenv:Envelope>`;

        visualHtml = `
          <div class="parsed-result-card">
            <div class="parsed-result-header">
              <h4 style="font-size: 15px; font-weight: 700;">Laboratory Reports for ${patientId} (${matches.length} found)</h4>
            </div>
            <div class="table-responsive">
              <table class="custom-table" style="font-size: 12.5px;">
                <thead><tr><th>Report ID</th><th>Test Name</th><th>Date</th><th>Result</th><th>Status</th></tr></thead>
                <tbody>
                  ${matches.map(l => `<tr>
                    <td><span class="badge badge-teal">${l.reportId}</span></td>
                    <td><strong>${l.testName}</strong></td>
                    <td>${l.testDate}</td>
                    <td>${l.testResult}</td>
                    <td>${this.renderStatusBadge(l.reportStatus)}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      } else if (op === 'getAppointments') {
        const matches = appointments.filter(a => a.patientId === patientId);
        resXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <ser:getAppointmentsResponse>
${matches.map(a => `            <appointment>
                <appointmentId>${a.appointmentId}</appointmentId>
                <patientId>${a.patientId}</patientId>
                <doctorName>${a.doctorName}</doctorName>
                <appointmentDate>${a.appointmentDate}</appointmentDate>
                <appointmentTime>${a.appointmentTime}</appointmentTime>
                <appointmentStatus>${a.appointmentStatus}</appointmentStatus>
                <notes>${a.notes || ''}</notes>
            </appointment>`).join('\n')}
        </ser:getAppointmentsResponse>
    </soapenv:Body>
</soapenv:Envelope>`;

        visualHtml = `
          <div class="parsed-result-card">
            <div class="parsed-result-header">
              <h4 style="font-size: 15px; font-weight: 700;">Appointments for ${patientId} (${matches.length} found)</h4>
            </div>
            <div class="table-responsive">
              <table class="custom-table" style="font-size: 12.5px;">
                <thead><tr><th>ID</th><th>Physician</th><th>Date & Time</th><th>Status</th><th>Notes</th></tr></thead>
                <tbody>
                  ${matches.map(a => `<tr>
                    <td><span class="badge badge-purple">${a.appointmentId}</span></td>
                    <td><strong>${a.doctorName}</strong></td>
                    <td>${a.appointmentDate} ${a.appointmentTime}</td>
                    <td>${this.renderStatusBadge(a.appointmentStatus)}</td>
                    <td style="font-size: 11.5px; color: var(--text-muted);">${a.notes || 'N/A'}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      } else if (op === 'getAllPatients') {
        resXml = 
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.mediconnect.com/">
    <soapenv:Body>
        <ser:getAllPatientsResponse>
${patients.map(p => `            <patient>
                <patientId>${p.patientId}</patientId>
                <patientName>${p.patientName}</patientName>
                <age>${p.age}</age>
                <gender>${p.gender}</gender>
                <bloodGroup>${p.bloodGroup}</bloodGroup>
                <mobile>${p.mobile}</mobile>
                <email>${p.email || ''}</email>
                <address>${p.address}</address>
                <doctorName>${p.doctorName}</doctorName>
                <department>${p.department}</department>
            </patient>`).join('\n')}
        </ser:getAllPatientsResponse>
    </soapenv:Body>
</soapenv:Envelope>`;

        visualHtml = `
          <div class="parsed-result-card">
            <div class="parsed-result-header">
              <h4 style="font-size: 15px; font-weight: 700;">All Registered Patients in medic_connect_db (${patients.length} records)</h4>
            </div>
            <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
              <table class="custom-table" style="font-size: 12px;">
                <thead><tr><th>ID</th><th>Name</th><th>Age/Sex</th><th>Blood</th><th>Department</th><th>Doctor</th></tr></thead>
                <tbody>
                  ${patients.map(p => `<tr>
                    <td><span class="badge badge-info">${p.patientId}</span></td>
                    <td><strong>${p.patientName}</strong></td>
                    <td>${p.age} / ${p.gender}</td>
                    <td><span class="blood-badge">${p.bloodGroup}</span></td>
                    <td>${p.department}</td>
                    <td>${p.doctorName}</td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
    }

    // 3. Render Inspection Output
    const reqBox = document.getElementById('testerRequestXmlContainer');
    const resBox = document.getElementById('testerResponseXmlContainer');
    const visBox = document.getElementById('testerVisualResultContainer');
    const statusBadge = document.getElementById('testerHttpStatus');
    const latencyEl = document.getElementById('testerLatency');
    const sizeEl = document.getElementById('testerSize');
    const respSummary = document.getElementById('lblResponseXmlSummary');
    const badgeRes = document.getElementById('badgeResponseXml');

    if (reqBox) reqBox.innerHTML = this.syntaxHighlightXml(reqXml);
    if (resBox) resBox.innerHTML = this.syntaxHighlightXml(resXml);
    if (visBox) visBox.innerHTML = visualHtml;

    if (latencyEl) latencyEl.textContent = `${latency} ms`;
    if (sizeEl) sizeEl.textContent = `${(resXml.length / 1024).toFixed(1)} KB`;

    if (isFault) {
      if (statusBadge) { statusBadge.className = 'badge badge-danger'; statusBadge.textContent = '500 SOAP Fault'; }
      if (respSummary) respSummary.textContent = 'HTTP/1.1 500 Internal Server Error (SOAP Fault)';
      if (badgeRes) { badgeRes.className = 'badge-xml'; badgeRes.style.background = '#ef4444'; }
      this.showToast('SOAP Fault Received', 'Requested record does not exist. Handled via SOAP Fault.', 'danger');
    } else {
      if (statusBadge) { statusBadge.className = 'badge badge-success'; statusBadge.textContent = '200 OK'; }
      if (respSummary) respSummary.textContent = 'HTTP/1.1 200 OK (SOAP Document/Literal)';
      if (badgeRes) { badgeRes.className = 'badge-xml'; badgeRes.style.background = '#0284c7'; }
      this.showToast('SOAP 200 OK', `Operation ${op} completed successfully in ${latency}ms.`, 'success');
    }
  },

  switchTesterTab(tabKey) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const tabMap = {
      'parsed': { btnIdx: 0, id: 'tab-tester-parsed' },
      'requestXml': { btnIdx: 1, id: 'tab-tester-requestXml' },
      'responseXml': { btnIdx: 2, id: 'tab-tester-responseXml' }
    };

    const target = tabMap[tabKey];
    if (target) {
      const btns = document.querySelectorAll('.tab-btn');
      if (btns[target.btnIdx]) btns[target.btnIdx].classList.add('active');
      const el = document.getElementById(target.id);
      if (el) el.classList.add('active');
    }
  },

  copyTesterXml(kind) {
    const id = kind === 'req' ? 'testerRequestXmlContainer' : 'testerResponseXmlContainer';
    const box = document.getElementById(id);
    if (box) {
      navigator.clipboard.writeText(box.innerText);
      this.showToast('Copied', 'XML payload copied to clipboard.', 'success');
    }
  },

  // ----------------------------------------------------------------------------
  // DATABASE MANAGEMENT & SQL SIMULATOR
  // ----------------------------------------------------------------------------
  inspectDbTable(tblName) {
    this.currentDbTable = tblName;

    // Update active chip
    document.querySelectorAll('#section-database .chip').forEach(c => c.classList.remove('active'));
    const targetChip = document.getElementById(`chip-tbl-${tblName}`);
    if (targetChip) targetChip.classList.add('active');

    const titleEl = document.getElementById('dbInspectorTableTitle');
    const descEl = document.getElementById('dbInspectorTableDesc');
    const countEl = document.getElementById('dbInspectorRowCount');
    const tableEl = document.getElementById('dbInspectorTable');

    const meta = {
      'patients': { title: 'Table: patients', desc: 'Centralized patient health records with primary doctor foreign key linkage', data: this.getPatients() },
      'doctors': { title: 'Table: doctors', desc: 'Medical staff directory, clinical department assignment, and room allocation', data: this.getDoctors() },
      'appointments': { title: 'Table: appointments', desc: 'Clinical consultations linking patients and doctors with date/time scheduling', data: this.getAppointments() },
      'laboratory_reports': { title: 'Table: laboratory_reports', desc: 'Pathology diagnostic findings, laboratory units, and reference intervals', data: this.getLaboratoryReports() },
      'pharmacy': { title: 'Table: pharmacy', desc: 'Hospital medication formulary, stock volumes, and prescription controls', data: this.getPharmacy() }
    };

    const cur = meta[tblName] || meta['patients'];
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-table-columns" style="color: var(--primary-600);"></i> ${cur.title}`;
    if (descEl) descEl.textContent = cur.desc;
    if (countEl) countEl.textContent = `${cur.data.length} Rows`;

    if (tableEl && cur.data.length > 0) {
      const keys = Object.keys(cur.data[0]);
      tableEl.innerHTML = `
        <thead>
          <tr>
            ${keys.map(k => `<th>${k}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${cur.data.slice(0, 10).map(row => `
            <tr>
              ${keys.map(k => `<td>${row[k] !== undefined && row[k] !== null ? row[k] : ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      `;
    }
  },

  setSampleSqlQuery(index) {
    const input = document.getElementById('sqlQueryInput');
    if (!input) return;

    const queries = {
      1: "SELECT p.patient_id, p.patient_name, p.age, p.blood_group, p.department, d.doctor_name\nFROM patients p\nLEFT JOIN doctors d ON p.doctor_id = d.doctor_id\nWHERE p.department = 'Cardiology';",
      2: "SELECT l.report_id, p.patient_name, l.test_name, l.test_result, l.report_status\nFROM laboratory_reports l\nJOIN patients p ON l.patient_id = p.patient_id\nORDER BY l.test_date DESC;",
      3: "SELECT a.appointment_id, p.patient_name, a.doctor_name, a.appointment_date, a.appointment_status\nFROM appointments a\nJOIN patients p ON a.patient_id = p.patient_id\nWHERE a.appointment_status = 'Confirmed';",
      4: "SELECT medicine_id, medicine_name, category, available_stock, unit_price\nFROM pharmacy\nWHERE available_stock < 200\nORDER BY available_stock ASC;"
    };

    input.value = queries[index] || queries[1];
  },

  executeSqlQuery() {
    const input = document.getElementById('sqlQueryInput');
    const status = document.getElementById('sqlExecStatus');
    const container = document.getElementById('sqlResultContainer');
    if (!input || !container) return;

    const sql = input.value.trim();
    if (!sql) {
      this.showToast('SQL Error', 'Query string cannot be empty.', 'danger');
      return;
    }

    if (status) status.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing against medic_connect_db...';

    setTimeout(() => {
      let results = [];
      const patients = this.getPatients();
      const appointments = this.getAppointments();
      const lab = this.getLaboratoryReports();
      const pharmacy = this.getPharmacy();

      if (sql.toLowerCase().includes('from laboratory_reports')) {
        results = lab.map(l => ({ report_id: l.reportId, patient_name: l.patientName, test_name: l.testName, test_result: l.testResult, report_status: l.reportStatus }));
      } else if (sql.toLowerCase().includes('from appointments')) {
        results = appointments.map(a => ({ appointment_id: a.appointmentId, patient_name: a.patientName, doctor_name: a.doctorName, appointment_date: a.appointmentDate, appointment_status: a.appointmentStatus }));
      } else if (sql.toLowerCase().includes('from pharmacy')) {
        results = pharmacy.filter(m => m.availableStock < 200).map(m => ({ medicine_id: m.medicineId, medicine_name: m.medicineName, category: m.category, available_stock: m.availableStock, unit_price: m.unitPrice }));
      } else {
        results = patients.map(p => ({ patient_id: p.patientId, patient_name: p.patientName, age: p.age, blood_group: p.bloodGroup, department: p.department, doctor_name: p.doctorName }));
      }

      if (status) status.innerHTML = `<span style="color: var(--success-text); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ${results.length} rows retrieved in 12ms</span>`;

      if (results.length > 0) {
        const keys = Object.keys(results[0]);
        container.innerHTML = `
          <table class="custom-table" style="font-size: 12.5px; border: 1px solid var(--border-light);">
            <thead><tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr></thead>
            <tbody>
              ${results.map(r => `<tr>${keys.map(k => `<td>${r[k]}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        `;
      } else {
        container.innerHTML = '<div style="padding: 16px; color: var(--text-muted);">0 rows returned.</div>';
      }

      this.showToast('SQL Execution Complete', `Retrieved ${results.length} rows successfully.`, 'success');
    }, 180);
  },

  downloadDatabaseSql() {
    const a = document.createElement('a');
    a.href = 'java-backend/database.sql';
    a.download = 'database.sql';
    a.click();
    this.showToast('Downloading', 'database.sql script download started.', 'info');
  },

  testSystemConnectivity() {
    this.showToast('System Diagnostics', 'Pinging SOAP Web Service on port 8080 and MySQL Database medic_connect_db...', 'info');
    setTimeout(() => {
      this.showToast('Diagnostic Report', 'All systems operational: JAX-WS Endpoint HTTP 200, MySQL Driver com.mysql.cj.jdbc.Driver verified.', 'success');
    }, 700);
  },

  // ----------------------------------------------------------------------------
  // REPORTS & ANALYTICS
  // ----------------------------------------------------------------------------
  renderReports() {
    const patients = this.getPatients();
    const appts = this.getAppointments();

    // 1. Department Workload Table
    const depts = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology'];
    const deptWorkload = depts.map(d => {
      const pCount = patients.filter(p => p.department === d).length;
      const aCount = appts.filter(a => a.department === d).length;
      let workload = '<span class="badge badge-success">Optimal</span>';
      if (pCount + aCount >= 4) {
        workload = '<span class="badge badge-warning">High</span>';
      }
      return `
        <tr>
          <td><strong>${d}</strong></td>
          <td>1 Specialist</td>
          <td>${pCount} Active</td>
          <td>${aCount} Consultations</td>
          <td>${workload}</td>
        </tr>
      `;
    }).join('');

    const tbodyDept = document.getElementById('reportDeptWorkloadTbody');
    if (tbodyDept) tbodyDept.innerHTML = deptWorkload;

    // 2. Blood Group Summary
    const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const totalP = patients.length || 1;
    const bloodTbody = document.getElementById('reportBloodGroupTbody');
    if (bloodTbody) {
      bloodTbody.innerHTML = groups.map(bg => {
        const count = patients.filter(p => p.bloodGroup === bg).length;
        const pct = ((count / totalP) * 100).toFixed(1);
        let compat = 'Compatible with matched phenotypes';
        if (bg === 'O-') compat = '<span class="badge badge-success">Universal Red Cell Donor</span>';
        if (bg === 'AB+') compat = '<span class="badge badge-purple">Universal Plasma Donor</span>';

        return `
          <tr>
            <td><span class="blood-badge">${bg}</span></td>
            <td><strong>${count}</strong></td>
            <td>${pct}%</td>
            <td style="font-size: 12px;">${compat}</td>
          </tr>
        `;
      }).join('');
    }
  },

  exportPatientsCsv() {
    const patients = this.getPatients();
    if (patients.length === 0) {
      this.showToast('No Data', 'No patient records available for export.', 'warning');
      return;
    }

    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Blood Group', 'Mobile', 'Email', 'Address', 'Doctor', 'Department'];
    const rows = patients.map(p => [
      `"${p.patientId}"`,
      `"${p.patientName}"`,
      p.age,
      `"${p.gender}"`,
      `"${p.bloodGroup}"`,
      `"${p.mobile}"`,
      `"${p.email || ''}"`,
      `"${p.address}"`,
      `"${p.doctorName}"`,
      `"${p.department}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediconnect_patients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Export Success', 'Patient directory exported to CSV format.', 'success');
  },

  // ----------------------------------------------------------------------------
  // MODALS & TOAST NOTIFICATIONS
  // ----------------------------------------------------------------------------
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('show');
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
    }
  },

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'danger') iconClass = 'fa-solid fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <div class="toast-icon"><i class="${iconClass}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Bootstrap App upon DOM load
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
