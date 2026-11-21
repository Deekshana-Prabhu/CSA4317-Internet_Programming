/**
 * SMART CAMPUS – INTEGRATED MANAGEMENT SYSTEM USING JAVA WEB SERVICES
 * Complete Interactive Application Controller, SOAP Simulator & Data Store
 */

// ==========================================================================
// 1. DATA REPOSITORY & INITIAL STATE
// ==========================================================================

const CampusData = {
  // 10+ Detailed Fictional Student Records
  students: [
    {
      studentId: "STU-1001",
      studentName: "Aarav Sharma",
      department: "Computer Science",
      year: "3rd Year",
      email: "aarav.sharma@campus.edu",
      mobileNumber: "+1 (555) 234-5678",
      admissionStatus: "Enrolled",
      cgpa: 3.85,
      attendance: 92.4,
      feePaid: 6500,
      feeTotal: 6500,
      booksIssued: 2
    },
    {
      studentId: "STU-1002",
      studentName: "Sophia Chen",
      department: "Biotechnology",
      year: "2nd Year",
      email: "sophia.chen@campus.edu",
      mobileNumber: "+1 (555) 345-6789",
      admissionStatus: "Enrolled",
      cgpa: 3.92,
      attendance: 96.0,
      feePaid: 6500,
      feeTotal: 6500,
      booksIssued: 1
    },
    {
      studentId: "STU-1003",
      studentName: "Liam Johnson",
      department: "Mechanical Engineering",
      year: "4th Year",
      email: "liam.johnson@campus.edu",
      mobileNumber: "+1 (555) 456-7890",
      admissionStatus: "Enrolled",
      cgpa: 3.48,
      attendance: 84.5,
      feePaid: 5000,
      feeTotal: 6500,
      booksIssued: 0
    },
    {
      studentId: "STU-1004",
      studentName: "Priya Patel",
      department: "Information Technology",
      year: "3rd Year",
      email: "priya.patel@campus.edu",
      mobileNumber: "+1 (555) 567-8901",
      admissionStatus: "Enrolled",
      cgpa: 3.75,
      attendance: 89.2,
      feePaid: 6500,
      feeTotal: 6500,
      booksIssued: 3
    },
    {
      studentId: "STU-1005",
      studentName: "Marcus Miller",
      department: "Electronics & Comm.",
      year: "1st Year",
      email: "marcus.miller@campus.edu",
      mobileNumber: "+1 (555) 678-9012",
      admissionStatus: "Enrolled",
      cgpa: 3.60,
      attendance: 78.1,
      feePaid: 3500,
      feeTotal: 6500,
      booksIssued: 1
    },
    {
      studentId: "STU-1006",
      studentName: "Aisha Al-Mansoor",
      department: "Civil Engineering",
      year: "2nd Year",
      email: "aisha.mansoor@campus.edu",
      mobileNumber: "+1 (555) 789-0123",
      admissionStatus: "Enrolled",
      cgpa: 3.80,
      attendance: 94.0,
      feePaid: 6500,
      feeTotal: 6500,
      booksIssued: 2
    },
    {
      studentId: "STU-1007",
      studentName: "Elena Rostova",
      department: "Computer Science",
      year: "4th Year",
      email: "elena.rostova@campus.edu",
      mobileNumber: "+1 (555) 890-1234",
      admissionStatus: "Enrolled",
      cgpa: 3.95,
      attendance: 98.2,
      feePaid: 6500,
      feeTotal: 6500,
      booksIssued: 1
    },
    {
      studentId: "STU-1008",
      studentName: "David Kim",
      department: "Electrical Engineering",
      year: "3rd Year",
      email: "david.kim@campus.edu",
      mobileNumber: "+1 (555) 901-2345",
      admissionStatus: "Enrolled",
      cgpa: 3.52,
      attendance: 82.0,
      feePaid: 4500,
      feeTotal: 6500,
      booksIssued: 0
    },
    {
      studentId: "STU-1009",
      studentName: "Fatima Zahra",
      department: "Biotechnology",
      year: "1st Year",
      email: "fatima.zahra@campus.edu",
      mobileNumber: "+1 (555) 012-3456",
      admissionStatus: "Enrolled",
      cgpa: 3.88,
      attendance: 91.5,
      feePaid: 6500,
      feeTotal: 6500,
      booksIssued: 2
    },
    {
      studentId: "STU-1010",
      studentName: "Lucas Silva",
      department: "Mechanical Engineering",
      year: "2nd Year",
      email: "lucas.silva@campus.edu",
      mobileNumber: "+1 (555) 123-4567",
      admissionStatus: "Enrolled",
      cgpa: 3.35,
      attendance: 72.4, // Warning: < 75%
      feePaid: 2000,
      feeTotal: 6500,
      booksIssued: 1
    }
  ],

  // Admission Module Records
  admissions: [
    { appId: "ADM-2026-081", name: "Rohan Varma", dept: "Computer Science", score: "96.4%", date: "2026-02-14", status: "Approved" },
    { appId: "ADM-2026-082", name: "Ananya Deshmukh", dept: "Information Technology", score: "94.2%", date: "2026-02-15", status: "Approved" },
    { appId: "ADM-2026-083", name: "Carlos Morales", dept: "Mechanical Engineering", score: "88.5%", date: "2026-02-16", status: "Under Review" },
    { appId: "ADM-2026-084", name: "Zoe Washington", dept: "Biotechnology", score: "91.8%", date: "2026-02-17", status: "Approved" },
    { appId: "ADM-2026-085", name: "Tariq Hassan", dept: "Civil Engineering", score: "85.0%", date: "2026-02-18", status: "Waitlisted" },
    { appId: "ADM-2026-086", name: "Chloe Dupont", dept: "Electronics & Comm.", score: "93.0%", date: "2026-02-19", status: "Approved" }
  ],

  // Attendance Records
  attendanceRecords: [
    { studentId: "STU-1001", name: "Aarav Sharma", totalClasses: 120, attendedClasses: 111, percent: 92.5, status: "Eligible" },
    { studentId: "STU-1002", name: "Sophia Chen", totalClasses: 120, attendedClasses: 115, percent: 95.8, status: "Eligible" },
    { studentId: "STU-1003", name: "Liam Johnson", totalClasses: 120, attendedClasses: 101, percent: 84.2, status: "Eligible" },
    { studentId: "STU-1004", name: "Priya Patel", totalClasses: 120, attendedClasses: 107, percent: 89.2, status: "Eligible" },
    { studentId: "STU-1005", name: "Marcus Miller", totalClasses: 120, attendedClasses: 94, percent: 78.3, status: "Eligible" },
    { studentId: "STU-1006", name: "Aisha Al-Mansoor", totalClasses: 120, attendedClasses: 113, percent: 94.2, status: "Eligible" },
    { studentId: "STU-1007", name: "Elena Rostova", totalClasses: 120, attendedClasses: 118, percent: 98.3, status: "Eligible" },
    { studentId: "STU-1008", name: "David Kim", totalClasses: 120, attendedClasses: 98, percent: 81.7, status: "Eligible" },
    { studentId: "STU-1009", name: "Fatima Zahra", totalClasses: 120, attendedClasses: 110, percent: 91.7, status: "Eligible" },
    { studentId: "STU-1010", name: "Lucas Silva", totalClasses: 120, attendedClasses: 87, percent: 72.5, status: "Attendance Shortage" }
  ],

  // Examination Records
  examinations: [
    { studentId: "STU-1001", name: "Aarav Sharma", subject: "Distributed Cloud Systems", internal: 29, endTerm: 66, total: 95, grade: "A+", result: "Distinction" },
    { studentId: "STU-1002", name: "Sophia Chen", subject: "Genetic Engineering & CRISPR", internal: 28, endTerm: 67, total: 95, grade: "A+", result: "Distinction" },
    { studentId: "STU-1003", name: "Liam Johnson", subject: "Thermodynamics & Heat Transfer", internal: 24, endTerm: 58, total: 82, grade: "A", result: "Passed" },
    { studentId: "STU-1004", name: "Priya Patel", subject: "Enterprise Database Architecture", internal: 27, endTerm: 64, total: 91, grade: "A+", result: "Distinction" },
    { studentId: "STU-1005", name: "Marcus Miller", subject: "Digital Signal Processing", internal: 22, endTerm: 54, total: 76, grade: "B+", result: "Passed" },
    { studentId: "STU-1006", name: "Aisha Al-Mansoor", subject: "Structural Mechanics & Analysis", internal: 26, endTerm: 62, total: 88, grade: "A", result: "Passed" },
    { studentId: "STU-1007", name: "Elena Rostova", subject: "Compiler Design & Automata", internal: 30, endTerm: 68, total: 98, grade: "A+", result: "Distinction" },
    { studentId: "STU-1008", name: "David Kim", subject: "Power Systems & Smart Grids", internal: 23, endTerm: 56, total: 79, grade: "B+", result: "Passed" },
    { studentId: "STU-1009", name: "Fatima Zahra", subject: "Molecular Biochemistry", internal: 28, endTerm: 63, total: 91, grade: "A+", result: "Distinction" },
    { studentId: "STU-1010", name: "Lucas Silva", subject: "Fluid Dynamics & Machines", internal: 20, endTerm: 48, total: 68, grade: "B", result: "Passed" }
  ],

  // Library Books Catalog
  libraryBooks: [
    { bookId: "LIB-BK-401", title: "Distributed Systems: Concepts and Design", author: "George Coulouris", category: "Computer Science", status: "Issued", borrowerId: "STU-1001", borrowerName: "Aarav Sharma", dueDate: "2026-03-05" },
    { bookId: "LIB-BK-402", title: "Molecular Biology of the Cell", author: "Bruce Alberts", category: "Biotechnology", status: "Issued", borrowerId: "STU-1002", borrowerName: "Sophia Chen", dueDate: "2026-03-08" },
    { bookId: "LIB-BK-403", title: "Modern Operating Systems (5th Ed)", author: "Andrew S. Tanenbaum", category: "Computer Science", status: "Available", borrowerId: "-", borrowerName: "-", dueDate: "-" },
    { bookId: "LIB-BK-404", title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", category: "Information Tech", status: "Issued", borrowerId: "STU-1004", borrowerName: "Priya Patel", dueDate: "2026-03-10" },
    { bookId: "LIB-BK-405", title: "Fundamentals of Electric Circuits", author: "Charles K. Alexander", category: "Electronics", status: "Issued", borrowerId: "STU-1005", borrowerName: "Marcus Miller", dueDate: "2026-03-02" },
    { bookId: "LIB-BK-406", title: "Design of Reinforced Concrete Structures", author: "Jack C. McCormac", category: "Civil Engineering", status: "Issued", borrowerId: "STU-1006", borrowerName: "Aisha Al-Mansoor", dueDate: "2026-03-12" },
    { bookId: "LIB-BK-407", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", category: "Computer Science", status: "Available", borrowerId: "-", borrowerName: "-", dueDate: "-" },
    { bookId: "LIB-BK-408", title: "Shigley's Mechanical Engineering Design", author: "Richard G. Budynas", category: "Mechanical", status: "Issued", borrowerId: "STU-1010", borrowerName: "Lucas Silva", dueDate: "2026-03-04" }
  ],

  // Fee Records
  fees: [
    { studentId: "STU-1001", name: "Aarav Sharma", total: 6500, paid: 6500, pending: 0, status: "Paid", receipt: "REC-2026-901" },
    { studentId: "STU-1002", name: "Sophia Chen", total: 6500, paid: 6500, pending: 0, status: "Paid", receipt: "REC-2026-902" },
    { studentId: "STU-1003", name: "Liam Johnson", total: 6500, paid: 5000, pending: 1500, status: "Partial", receipt: "REC-2026-903" },
    { studentId: "STU-1004", name: "Priya Patel", total: 6500, paid: 6500, pending: 0, status: "Paid", receipt: "REC-2026-904" },
    { studentId: "STU-1005", name: "Marcus Miller", total: 6500, paid: 3500, pending: 3000, status: "Partial", receipt: "REC-2026-905" },
    { studentId: "STU-1006", name: "Aisha Al-Mansoor", total: 6500, paid: 6500, pending: 0, status: "Paid", receipt: "REC-2026-906" },
    { studentId: "STU-1007", name: "Elena Rostova", total: 6500, paid: 6500, pending: 0, status: "Paid", receipt: "REC-2026-907" },
    { studentId: "STU-1008", name: "David Kim", total: 6500, paid: 4500, pending: 2000, status: "Partial", receipt: "REC-2026-908" },
    { studentId: "STU-1009", name: "Fatima Zahra", total: 6500, paid: 6500, pending: 0, status: "Paid", receipt: "REC-2026-909" },
    { studentId: "STU-1010", name: "Lucas Silva", total: 6500, paid: 2000, pending: 4500, status: "Overdue", receipt: "REC-2026-910" }
  ],

  // Registered Web Services
  servicesRegistry: [
    {
      name: "StudentInformationService",
      dept: "Central Academic Office",
      desc: "Authoritative provider of student demographics, enrollment statuses, departments, and academic standing.",
      endpoint: "http://localhost:8888/ws/student",
      wsdlUrl: "http://localhost:8888/ws/student?wsdl",
      status: "ONLINE",
      latency: "11ms",
      operations: ["getStudentById", "getAllStudents", "addStudent", "getStudentsByDepartment"]
    },
    {
      name: "AdmissionService",
      dept: "University Admissions Office",
      desc: "Manages student applications, entrance marks verification, admission workflows, and enrollment triggers.",
      endpoint: "http://localhost:8888/ws/admission",
      wsdlUrl: "http://localhost:8888/ws/admission?wsdl",
      status: "ONLINE",
      latency: "14ms",
      operations: ["getApplicationStatus", "approveAdmission", "enrollStudent"]
    },
    {
      name: "AttendanceService",
      dept: "Academic Registry & Faculty",
      desc: "Tracks daily class attendance logs, aggregate percentages, and triggers exam eligibility alerts.",
      endpoint: "http://localhost:8888/ws/attendance",
      wsdlUrl: "http://localhost:8888/ws/attendance?wsdl",
      status: "ONLINE",
      latency: "12ms",
      operations: ["getAttendanceByStudent", "recordClassAttendance", "checkExamEligibility"]
    },
    {
      name: "ExaminationService",
      dept: "Office of the Controller of Exams",
      desc: "Stores internal and end-term exam marks, computes CGPA, generates transcripts, and tracks backlogs.",
      endpoint: "http://localhost:8888/ws/examination",
      wsdlUrl: "http://localhost:8888/ws/examination?wsdl",
      status: "ONLINE",
      latency: "15ms",
      operations: ["getExamMarksByStudent", "publishSemesterResults", "calculateCGPA"]
    },
    {
      name: "LibraryService",
      dept: "University Library System",
      desc: "Maintains campus book catalog, issues borrowing cards, validates student standing, and manages fines.",
      endpoint: "http://localhost:8888/ws/library",
      wsdlUrl: "http://localhost:8888/ws/library?wsdl",
      status: "ONLINE",
      latency: "9ms",
      operations: ["issueBook", "returnBook", "checkBorrowingStatus"]
    },
    {
      name: "FeeManagementService",
      dept: "Bursar & Finance Department",
      desc: "Processes tuition fee payments, manages installment plans, generates receipts, and checks financial clearance.",
      endpoint: "http://localhost:8888/ws/fees",
      wsdlUrl: "http://localhost:8888/ws/fees?wsdl",
      status: "ONLINE",
      latency: "13ms",
      operations: ["getFeeStatusByStudent", "recordPayment", "generateFeeReceipt"]
    }
  ]
};

// ==========================================================================
// 2. SPA ROUTER & NAVIGATION CONTROLLER
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initDashboard();
  renderStudentTable();
  renderAdmissionsTable();
  renderAttendanceTable();
  renderExamTable();
  renderLibraryTable();
  renderFeeTable();
  renderServiceRegistry();
  initServiceTester();
  initWsdlTabs();
  initDeptIntegrationDemo();
  initArchitectureVisualizer();
  initModals();
});

function initRouter() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".page-section");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");

  function navigateTo(targetId) {
    if (!targetId || targetId === "#") targetId = "dashboard";
    const cleanId = targetId.replace("#", "");

    // Update nav links
    navLinks.forEach(link => {
      if (link.getAttribute("href") === `#${cleanId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Show active section
    let found = false;
    sections.forEach(sec => {
      if (sec.id === cleanId) {
        sec.classList.add("active");
        found = true;
      } else {
        sec.classList.remove("active");
      }
    });

    if (!found) {
      const defaultSec = document.getElementById("dashboard");
      if (defaultSec) defaultSec.classList.add("active");
    }

    // Scroll top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile sidebar
    if (sidebar && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
  }

  // Handle click events
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("href");
      window.location.hash = target;
      navigateTo(target);
    });
  });

  // Handle hashchange
  window.addEventListener("hashchange", () => {
    navigateTo(window.location.hash);
  });

  // Handle mobile drawer
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Initial load
  const initialHash = window.location.hash || "#dashboard";
  navigateTo(initialHash);
}

// ==========================================================================
// 3. DASHBOARD CONTROLLER & CHARTS
// ==========================================================================

let deptChartInstance = null;
let trendChartInstance = null;

function initDashboard() {
  updateDashboardMetrics();
  initDashboardCharts();
}

function updateDashboardMetrics() {
  const totalStudents = CampusData.students.length;
  const activeDepts = 6;
  
  // Attendance avg
  const avgAttendance = (
    CampusData.attendanceRecords.reduce((acc, curr) => acc + curr.percent, 0) /
    CampusData.attendanceRecords.length
  ).toFixed(1);

  // Fee collection
  const totalFeeExpected = CampusData.fees.reduce((acc, curr) => acc + curr.total, 0);
  const totalFeeCollected = CampusData.fees.reduce((acc, curr) => acc + curr.paid, 0);
  const feePercent = ((totalFeeCollected / totalFeeExpected) * 100).toFixed(1);

  // Update DOM if elements exist
  setElText("dashTotalStudents", `${totalStudents} Enrolled`);
  setElText("dashAttendanceRate", `${avgAttendance}%`);
  setElText("dashFeeCollected", `$${(totalFeeCollected / 1000).toFixed(1)}k (${feePercent}%)`);
}

function initDashboardCharts() {
  const deptCtx = document.getElementById("deptDistributionChart");
  const trendCtx = document.getElementById("enrollmentTrendChart");

  if (deptCtx && window.Chart) {
    if (deptChartInstance) deptChartInstance.destroy();
    deptChartInstance = new Chart(deptCtx, {
      type: "doughnut",
      data: {
        labels: ["Computer Science", "Biotech", "Mechanical", "IT", "ECE", "Civil"],
        datasets: [
          {
            data: [32, 18, 20, 15, 8, 7],
            backgroundColor: [
              "#0284c7", // Blue
              "#7c3aed", // Purple
              "#0d9488", // Teal
              "#38bdf8", // Light Blue
              "#a855f7", // Light Purple
              "#14b8a6"  // Light Teal
            ],
            borderWidth: 2,
            borderColor: "#ffffff"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { size: 11, family: "Inter" }
            }
          }
        },
        cutout: "68%"
      }
    });
  }

  if (trendCtx && window.Chart) {
    if (trendChartInstance) trendChartInstance.destroy();
    trendChartInstance = new Chart(trendCtx, {
      type: "line",
      data: {
        labels: ["2022", "2023", "2024", "2025", "2026 (Est.)"],
        datasets: [
          {
            label: "Enrolled Students",
            data: [2600, 2950, 3300, 3650, 3850],
            borderColor: "#0284c7",
            backgroundColor: "rgba(2, 132, 199, 0.08)",
            tension: 0.35,
            fill: true,
            pointBackgroundColor: "#0284c7",
            pointRadius: 4
          },
          {
            label: "Web Service Invocations (k/day)",
            data: [12, 28, 55, 92, 148],
            borderColor: "#7c3aed",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            tension: 0.35,
            pointBackgroundColor: "#7c3aed",
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { boxWidth: 12, font: { size: 11, family: "Inter" } }
          }
        },
        scales: {
          y: {
            grid: { color: "#f1f5f9" },
            ticks: { font: { size: 10, family: "Inter" } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: "Inter" } }
          }
        }
      }
    });
  }
}

// ==========================================================================
// 4. STUDENT INFORMATION MODULE CONTROLLER
// ==========================================================================

let studentSearchQuery = "";
let studentDeptFilter = "";
let studentYearFilter = "";

function renderStudentTable() {
  const tbody = document.getElementById("studentTableBody");
  if (!tbody) return;

  const filtered = CampusData.students.filter(s => {
    const matchesSearch =
      !studentSearchQuery ||
      s.studentName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearchQuery.toLowerCase());

    const matchesDept = !studentDeptFilter || s.department === studentDeptFilter;
    const matchesYear = !studentYearFilter || s.year === studentYearFilter;

    return matchesSearch && matchesDept && matchesYear;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
          <i class="fa-solid fa-user-slash" style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-light); display:block;"></i>
          No student records matching your search criteria.
        </td>
      </tr>
    `;
    setElText("studentRecordCount", "0 Students");
    return;
  }

  tbody.innerHTML = filtered
    .map(
      s => `
    <tr>
      <td>
        <span class="badge badge-purple" style="font-family:'JetBrains Mono'; font-size:0.78rem;">
          ${escapeHtml(s.studentId)}
        </span>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <div class="user-avatar" style="width:30px; height:30px; font-size:0.75rem;">
            ${s.studentName.charAt(0)}
          </div>
          <span style="font-weight:600; color:var(--text-main);">${escapeHtml(s.studentName)}</span>
        </div>
      </td>
      <td><span class="badge badge-info">${escapeHtml(s.department)}</span></td>
      <td>${escapeHtml(s.year)}</td>
      <td style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(s.email)}</td>
      <td style="font-size:0.8rem;">${escapeHtml(s.mobileNumber)}</td>
      <td>
        <span class="badge badge-success">
          <i class="fa-solid fa-circle-check"></i> ${escapeHtml(s.admissionStatus)}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.35rem;">
          <button class="btn btn-outline btn-xs" title="View Profile" onclick="openStudentProfileModal('${s.studentId}')">
            <i class="fa-regular fa-eye"></i> View
          </button>
          <button class="btn btn-outline btn-xs" title="Edit Student" onclick="openEditStudentModal('${s.studentId}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-outline btn-xs" title="Delete Student" style="color:var(--danger);" onclick="deleteStudent('${s.studentId}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `
    )
    .join("");

  setElText("studentRecordCount", `${filtered.length} of ${CampusData.students.length} Students`);
}

function handleStudentSearch(val) {
  studentSearchQuery = val;
  renderStudentTable();
}

function handleStudentDeptFilter(val) {
  studentDeptFilter = val;
  renderStudentTable();
}

function handleStudentYearFilter(val) {
  studentYearFilter = val;
  renderStudentTable();
}

function deleteStudent(studentId) {
  const index = CampusData.students.findIndex(s => s.studentId === studentId);
  if (index !== -1) {
    const student = CampusData.students[index];
    CampusData.students.splice(index, 1);
    renderStudentTable();
    updateDashboardMetrics();
    showToast(`Student record for ${student.studentName} (${studentId}) removed.`, "danger");
  }
}

function exportStudentsCSV() {
  let csv = "Student ID,Student Name,Department,Year,Email,Mobile Number,Admission Status,CGPA\n";
  CampusData.students.forEach(s => {
    csv += `"${s.studentId}","${s.studentName}","${s.department}","${s.year}","${s.email}","${s.mobileNumber}","${s.admissionStatus}",${s.cgpa}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "smart_campus_students.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Exported students table to CSV successfully!", "success");
}

// ==========================================================================
// 5. DEPARTMENTAL MODULE CONTROLLERS
// ==========================================================================

// A. Admission Management
function renderAdmissionsTable() {
  const tbody = document.getElementById("admissionsTableBody");
  if (!tbody) return;

  tbody.innerHTML = CampusData.admissions
    .map(
      a => `
    <tr>
      <td><span class="badge badge-purple" style="font-family:'JetBrains Mono';">${escapeHtml(a.appId)}</span></td>
      <td><strong>${escapeHtml(a.name)}</strong></td>
      <td><span class="badge badge-info">${escapeHtml(a.dept)}</span></td>
      <td><strong style="color:var(--blue-primary);">${escapeHtml(a.score)}</strong></td>
      <td>${escapeHtml(a.date)}</td>
      <td>
        <span class="badge ${a.status === 'Approved' ? 'badge-success' : a.status === 'Waitlisted' ? 'badge-warning' : 'badge-info'}">
          ${escapeHtml(a.status)}
        </span>
      </td>
      <td>
        ${
          a.status === "Approved"
            ? `<button class="btn btn-teal btn-xs" onclick="enrollAdmissionCandidate('${a.appId}')">
                <i class="fa-solid fa-user-plus"></i> Enroll via SOAP
              </button>`
            : `<button class="btn btn-outline btn-xs" onclick="showToast('Verification documents for ${a.appId} are under review.', 'info')">
                <i class="fa-regular fa-file-lines"></i> Review
              </button>`
        }
      </td>
    </tr>
  `
    )
    .join("");
}

function enrollAdmissionCandidate(appId) {
  const app = CampusData.admissions.find(a => a.appId === appId);
  if (!app) return;

  const newId = `STU-10${CampusData.students.length + 1}`;
  const newStudent = {
    studentId: newId,
    studentName: app.name,
    department: app.dept,
    year: "1st Year",
    email: `${app.name.toLowerCase().replace(" ", ".")}@campus.edu`,
    mobileNumber: "+1 (555) 999-0000",
    admissionStatus: "Enrolled",
    cgpa: 3.80,
    attendance: 100.0,
    feePaid: 6500,
    feeTotal: 6500,
    booksIssued: 0
  };

  // Add to students
  CampusData.students.push(newStudent);
  app.status = "Enrolled";

  // Add corresponding attendance and fee records
  CampusData.attendanceRecords.push({
    studentId: newId,
    name: app.name,
    totalClasses: 1,
    attendedClasses: 1,
    percent: 100.0,
    status: "Eligible"
  });

  CampusData.fees.push({
    studentId: newId,
    name: app.name,
    total: 6500,
    paid: 6500,
    pending: 0,
    status: "Paid",
    receipt: `REC-2026-${911 + CampusData.students.length}`
  });

  renderAdmissionsTable();
  renderStudentTable();
  renderAttendanceTable();
  renderFeeTable();
  updateDashboardMetrics();

  showToast(
    `[SOAP Invocation: addStudent] Candidate ${app.name} enrolled with Student ID: ${newId}!`,
    "success"
  );
}

// B. Attendance Management
function renderAttendanceTable() {
  const tbody = document.getElementById("attendanceTableBody");
  if (!tbody) return;

  tbody.innerHTML = CampusData.attendanceRecords
    .map(
      att => `
    <tr>
      <td><span class="badge badge-purple" style="font-family:'JetBrains Mono';">${escapeHtml(att.studentId)}</span></td>
      <td><strong>${escapeHtml(att.name)}</strong></td>
      <td>${att.totalClasses}</td>
      <td>${att.attendedClasses}</td>
      <td>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <div class="progress-bar-wrap" style="width:90px;">
            <div class="progress-bar-fill ${att.percent >= 85 ? 'green' : att.percent >= 75 ? 'yellow' : 'red'}" 
                 style="width: ${att.percent}%;"></div>
          </div>
          <strong style="font-size:0.8rem; color:${att.percent >= 75 ? 'var(--text-main)' : 'var(--danger)'};">
            ${att.percent.toFixed(1)}%
          </strong>
        </div>
      </td>
      <td>
        <span class="badge ${att.percent >= 75 ? 'badge-success' : 'badge-danger'}">
          ${att.percent >= 75 ? '<i class="fa-solid fa-check"></i> Eligible' : '<i class="fa-solid fa-triangle-exclamation"></i> Shortage Warning'}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-xs" onclick="logAttendance('${att.studentId}')">
          <i class="fa-solid fa-calendar-check"></i> Mark Present
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

function logAttendance(studentId) {
  const att = CampusData.attendanceRecords.find(a => a.studentId === studentId);
  if (!att) return;

  att.totalClasses += 1;
  att.attendedClasses += 1;
  att.percent = (att.attendedClasses / att.totalClasses) * 100;
  att.status = att.percent >= 75 ? "Eligible" : "Attendance Shortage";

  renderAttendanceTable();
  updateDashboardMetrics();
  showToast(`Attendance marked for ${att.name}. Current: ${att.percent.toFixed(1)}%`, "success");
}

// C. Examination Management
function renderExamTable() {
  const tbody = document.getElementById("examTableBody");
  if (!tbody) return;

  tbody.innerHTML = CampusData.examinations
    .map(
      e => `
    <tr>
      <td><span class="badge badge-purple" style="font-family:'JetBrains Mono';">${escapeHtml(e.studentId)}</span></td>
      <td><strong>${escapeHtml(e.name)}</strong></td>
      <td>${escapeHtml(e.subject)}</td>
      <td>${e.internal} / 30</td>
      <td>${e.endTerm} / 70</td>
      <td><strong>${e.total} / 100</strong></td>
      <td><span class="badge badge-teal" style="font-weight:700;">${escapeHtml(e.grade)}</span></td>
      <td>
        <span class="badge ${e.result === 'Distinction' ? 'badge-purple' : 'badge-success'}">
          ${escapeHtml(e.result)}
        </span>
      </td>
    </tr>
  `
    )
    .join("");
}

// D. Library Management
function renderLibraryTable() {
  const tbody = document.getElementById("libraryTableBody");
  if (!tbody) return;

  tbody.innerHTML = CampusData.libraryBooks
    .map(
      b => `
    <tr>
      <td><span class="badge badge-purple" style="font-family:'JetBrains Mono';">${escapeHtml(b.bookId)}</span></td>
      <td><strong>${escapeHtml(b.title)}</strong></td>
      <td style="color:var(--text-muted);">${escapeHtml(b.author)}</td>
      <td><span class="badge badge-info">${escapeHtml(b.category)}</span></td>
      <td>
        <span class="badge ${b.status === 'Available' ? 'badge-success' : 'badge-warning'}">
          ${b.status === 'Available' ? '<i class="fa-solid fa-check"></i> Available' : '<i class="fa-solid fa-book-bookmark"></i> Issued'}
        </span>
      </td>
      <td>${b.borrowerId !== '-' ? `<span class="badge badge-teal">${b.borrowerId} - ${escapeHtml(b.borrowerName)}</span>` : '<span style="color:var(--text-light);">None</span>'}</td>
      <td style="font-size:0.8rem;">${b.dueDate}</td>
      <td>
        ${
          b.status === 'Available'
            ? `<button class="btn btn-outline btn-xs" onclick="openIssueBookModal('${b.bookId}')">
                <i class="fa-solid fa-hand-holding-hand"></i> Issue
               </button>`
            : `<button class="btn btn-outline btn-xs" style="color:var(--teal-primary);" onclick="returnLibraryBook('${b.bookId}')">
                <i class="fa-solid fa-rotate-left"></i> Return
               </button>`
        }
      </td>
    </tr>
  `
    )
    .join("");
}

function returnLibraryBook(bookId) {
  const book = CampusData.libraryBooks.find(b => b.bookId === bookId);
  if (!book) return;

  book.status = "Available";
  book.borrowerId = "-";
  book.borrowerName = "-";
  book.dueDate = "-";

  renderLibraryTable();
  showToast(`Book '${book.title}' has been returned to circulation.`, "success");
}

// E. Fee Management
function renderFeeTable() {
  const tbody = document.getElementById("feeTableBody");
  if (!tbody) return;

  tbody.innerHTML = CampusData.fees
    .map(
      f => `
    <tr>
      <td><span class="badge badge-purple" style="font-family:'JetBrains Mono';">${escapeHtml(f.studentId)}</span></td>
      <td><strong>${escapeHtml(f.name)}</strong></td>
      <td>$${f.total.toLocaleString()}</td>
      <td style="color:var(--teal-primary); font-weight:600;">$${f.paid.toLocaleString()}</td>
      <td style="color:${f.pending > 0 ? 'var(--danger)' : 'var(--text-muted)'}; font-weight:600;">$${f.pending.toLocaleString()}</td>
      <td>
        <span class="badge ${f.status === 'Paid' ? 'badge-success' : f.status === 'Partial' ? 'badge-warning' : 'badge-danger'}">
          ${escapeHtml(f.status)}
        </span>
      </td>
      <td style="font-family:'JetBrains Mono'; font-size:0.75rem;">${escapeHtml(f.receipt)}</td>
      <td>
        ${
          f.pending > 0
            ? `<button class="btn btn-primary btn-xs" onclick="collectFeePayment('${f.studentId}')">
                <i class="fa-solid fa-receipt"></i> Pay $${f.pending}
               </button>`
            : `<button class="btn btn-outline btn-xs" onclick="showToast('Full clearance receipt issued for ${f.name}.', 'info')">
                <i class="fa-solid fa-check-double"></i> Receipt
               </button>`
        }
      </td>
    </tr>
  `
    )
    .join("");
}

function collectFeePayment(studentId) {
  const fee = CampusData.fees.find(f => f.studentId === studentId);
  if (!fee) return;

  fee.paid += fee.pending;
  fee.pending = 0;
  fee.status = "Paid";
  fee.receipt = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  renderFeeTable();
  updateDashboardMetrics();
  showToast(`Payment collected for ${fee.name}. Receipt: ${fee.receipt}`, "success");
}

// ==========================================================================
// 6. SERVICE REGISTRY CONTROLLER
// ==========================================================================

function renderServiceRegistry() {
  const container = document.getElementById("registryCardsGrid");
  if (!container) return;

  container.innerHTML = CampusData.servicesRegistry
    .map(
      srv => `
    <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:0.75rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div class="stat-icon blue" style="width:36px; height:36px; font-size:1rem;">
              <i class="fa-solid fa-server"></i>
            </div>
            <div>
              <h4 style="font-size:0.95rem; font-weight:700;">${escapeHtml(srv.name)}</h4>
              <span style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(srv.dept)}</span>
            </div>
          </div>
          <span class="badge badge-success">
            <span class="status-dot"></span> ${srv.status}
          </span>
        </div>
        <p style="font-size:0.8rem; color:var(--text-body); margin-bottom:1rem; line-height:1.4;">
          ${escapeHtml(srv.desc)}
        </p>
      </div>

      <div style="background-color:var(--bg-subtle); padding:0.75rem; border-radius:var(--radius-md); border:1px solid var(--border-light); font-size:0.75rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
          <span style="color:var(--text-muted);">Endpoint:</span>
          <code style="color:var(--blue-primary); font-size:0.72rem;">${srv.endpoint}</code>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
          <span style="color:var(--text-muted);">WSDL:</span>
          <a href="#wsdl" style="font-weight:600; font-size:0.72rem;">${srv.wsdlUrl}</a>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Avg Latency:</span>
          <span style="color:var(--teal-primary); font-weight:600;">${srv.latency}</span>
        </div>
        <div style="margin-top:0.6rem; padding-top:0.6rem; border-top:1px dashed var(--border-light);">
          <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:0.3rem;">EXPOSED OPERATIONS:</span>
          <div style="display:flex; flex-wrap:wrap; gap:0.3rem;">
            ${srv.operations
              .map(
                op => `<span class="badge badge-purple" style="font-size:0.68rem; font-family:'JetBrains Mono';">${op}()</span>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// ==========================================================================
// 7. INTERACTIVE SERVICE TESTER (SOAP CLIENT SANDBOX)
// ==========================================================================

function initServiceTester() {
  const sendBtn = document.getElementById("sendSoapRequestBtn");
  const studentIdInput = document.getElementById("soapStudentIdInput");
  const operationSelect = document.getElementById("soapOperationSelect");

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      executeSoapTestRequest();
    });
  }

  // Preset pills
  const pills = document.querySelectorAll(".preset-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      const id = pill.getAttribute("data-id");
      if (studentIdInput) studentIdInput.value = id;
      if (operationSelect) operationSelect.value = "getStudentById";
      executeSoapTestRequest();
    });
  });
}

function executeSoapTestRequest() {
  const operationSelect = document.getElementById("soapOperationSelect");
  const studentIdInput = document.getElementById("soapStudentIdInput");
  const requestBox = document.getElementById("soapRawRequest");
  const responseBox = document.getElementById("soapRawResponse");
  const previewBox = document.getElementById("soapResponsePreview");
  const statusBadge = document.getElementById("soapHttpStatus");
  const latencyBadge = document.getElementById("soapLatencyBadge");

  const operation = operationSelect ? operationSelect.value : "getStudentById";
  const studentId = studentIdInput ? studentIdInput.value.trim().toUpperCase() : "STU-1001";

  // Render simulated request SOAP XML
  let requestXml = "";
  if (operation === "getStudentById") {
    requestXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.smartcampus.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getStudentById>
            <studentId>${escapeHtml(studentId)}</studentId>
        </ser:getStudentById>
    </soapenv:Body>
</soapenv:Envelope>`;
  } else {
    requestXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.smartcampus.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getAllStudents/>
    </soapenv:Body>
</soapenv:Envelope>`;
  }

  if (requestBox) requestBox.textContent = requestXml;

  // Show loading state
  if (responseBox) responseBox.textContent = "<!-- Processing SOAP Request via JAX-WS Endpoint... -->";
  if (statusBadge) {
    statusBadge.className = "badge badge-warning";
    statusBadge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> POST 8888...`;
  }

  setTimeout(() => {
    const startTime = performance.now();
    let responseXml = "";
    let isFault = false;

    if (operation === "getStudentById") {
      const student = CampusData.students.find(s => s.studentId === studentId);

      if (student) {
        responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.smartcampus.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getStudentByIdResponse>
            <student>
                <studentId>${escapeHtml(student.studentId)}</studentId>
                <studentName>${escapeHtml(student.studentName)}</studentName>
                <department>${escapeHtml(student.department)}</department>
                <year>${escapeHtml(student.year)}</year>
                <email>${escapeHtml(student.email)}</email>
                <mobileNumber>${escapeHtml(student.mobileNumber)}</mobileNumber>
                <admissionStatus>${escapeHtml(student.admissionStatus)}</admissionStatus>
                <cgpa>${student.cgpa}</cgpa>
            </student>
        </ser:getStudentByIdResponse>
    </soapenv:Body>
</soapenv:Envelope>`;

        if (previewBox) {
          previewBox.innerHTML = `
            <div class="response-card-preview">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <div class="user-avatar" style="width:36px; height:36px; font-size:0.9rem;">
                    ${student.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 style="font-size:1rem; font-weight:700;">${escapeHtml(student.studentName)}</h4>
                    <span class="badge badge-purple" style="font-family:'JetBrains Mono'; font-size:0.72rem;">${student.studentId}</span>
                  </div>
                </div>
                <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> ${student.admissionStatus}</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem; font-size:0.78rem;">
                <div><strong style="color:var(--text-muted);">Department:</strong> ${escapeHtml(student.department)}</div>
                <div><strong style="color:var(--text-muted);">Year:</strong> ${escapeHtml(student.year)}</div>
                <div><strong style="color:var(--text-muted);">Email:</strong> ${escapeHtml(student.email)}</div>
                <div><strong style="color:var(--text-muted);">Mobile:</strong> ${escapeHtml(student.mobileNumber)}</div>
                <div><strong style="color:var(--text-muted);">CGPA:</strong> <span style="color:var(--teal-primary); font-weight:700;">${student.cgpa}</span></div>
                <div><strong style="color:var(--text-muted);">Attendance:</strong> ${student.attendance}%</div>
              </div>
            </div>
          `;
        }
      } else {
        // SOAP Fault Scenario
        isFault = true;
        responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>soapenv:Server</faultcode>
            <faultstring>No student record found with Student ID: ${escapeHtml(studentId)}</faultstring>
            <detail>
                <ser:StudentNotFoundFault xmlns:ser="http://service.smartcampus.com/">
                    <faultInfo>ERROR_STUDENT_NOT_FOUND</faultInfo>
                    <message>The requested student identifier does not exist in the central university registry.</message>
                </ser:StudentNotFoundFault>
            </detail>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>`;

        if (previewBox) {
          previewBox.innerHTML = `
            <div style="background-color:var(--danger-light); border:1px solid rgba(239, 68, 68, 0.3); border-radius:var(--radius-lg); padding:1rem;">
              <h4 style="color:var(--danger); font-size:0.95rem; display:flex; align-items:center; gap:0.4rem; margin-bottom:0.35rem;">
                <i class="fa-solid fa-triangle-exclamation"></i> SOAP Fault Returned: StudentNotFoundFault
              </h4>
              <p style="font-size:0.8rem; color:#7f1d1d; margin-bottom:0.5rem;">
                The service threw <code>com.smartcampus.exception.StudentNotFoundException</code>: No student found with ID <strong>${escapeHtml(studentId)}</strong>.
              </p>
              <span class="badge badge-danger" style="font-family:'JetBrains Mono'; font-size:0.72rem;">HTTP 500 Internal Server Error (SOAP 1.1 Fault)</span>
            </div>
          `;
        }
      }
    } else {
      // getAllStudents
      responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ser="http://service.smartcampus.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:getAllStudentsResponse>
${CampusData.students
  .map(
    s => `            <studentList>
                <studentId>${s.studentId}</studentId>
                <studentName>${escapeHtml(s.studentName)}</studentName>
                <department>${escapeHtml(s.department)}</department>
                <year>${s.year}</year>
                <cgpa>${s.cgpa}</cgpa>
            </studentList>`
  )
  .join("\n")}
        </ser:getAllStudentsResponse>
    </soapenv:Body>
</soapenv:Envelope>`;

      if (previewBox) {
        previewBox.innerHTML = `
          <div style="background-color:var(--teal-subtle); border:1px solid var(--teal-light); border-radius:var(--radius-lg); padding:1rem;">
            <h4 style="color:var(--teal-primary); font-size:0.95rem; margin-bottom:0.35rem;">
              <i class="fa-solid fa-users"></i> Retrieved ${CampusData.students.length} Enrolled Students
            </h4>
            <p style="font-size:0.8rem; color:var(--text-body);">
              All student records serialized into SOAP Array <code>studentList[]</code> successfully.
            </p>
          </div>
        `;
      }
    }

    if (responseBox) responseBox.textContent = responseXml;

    if (statusBadge) {
      if (isFault) {
        statusBadge.className = "badge badge-danger";
        statusBadge.innerHTML = `<i class="fa-solid fa-xmark"></i> 500 SOAP Fault`;
      } else {
        statusBadge.className = "badge badge-success";
        statusBadge.innerHTML = `<i class="fa-solid fa-check"></i> 200 OK (SOAP)`;
      }
    }

    if (latencyBadge) {
      const duration = Math.round(10 + Math.random() * 8);
      latencyBadge.textContent = `${duration} ms`;
    }
  }, 350);
}

// ==========================================================================
// 8. WSDL EXPLORER CONTROLLER
// ==========================================================================

function initWsdlTabs() {
  const tabs = document.querySelectorAll(".wsdl-element-tab");
  const contents = document.querySelectorAll(".wsdl-element-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.style.display = "none");

      tab.classList.add("active");
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.style.display = "block";
    });
  });
}

function copyWsdlToClipboard() {
  const wsdlPre = document.getElementById("wsdlSourcePre");
  if (!wsdlPre) return;

  const text = wsdlPre.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast("WSDL XML copied to clipboard!", "success");
  }).catch(() => {
    showToast("Could not copy WSDL text automatically.", "warning");
  });
}

function downloadWsdlFile() {
  const wsdlPre = document.getElementById("wsdlSourcePre");
  if (!wsdlPre) return;

  const text = wsdlPre.textContent;
  const blob = new Blob([text], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "StudentInformationService.wsdl";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Downloaded StudentInformationService.wsdl", "success");
}

// ==========================================================================
// 9. DEPARTMENTAL INTEGRATION SIMULATOR
// ==========================================================================

function initDeptIntegrationDemo() {
  const runBtn = document.getElementById("runIntegrationSimulationBtn");
  if (runBtn) {
    runBtn.addEventListener("click", () => {
      runIntegrationSimulation();
    });
  }
}

function runIntegrationSimulation() {
  const consumerSelect = document.getElementById("integrationConsumerSelect");
  const studentSelect = document.getElementById("integrationStudentSelect");
  const logContainer = document.getElementById("integrationStepLogs");
  const resultCard = document.getElementById("integrationFinalCard");

  const consumerApp = consumerSelect ? consumerSelect.value : "Attendance Management Application";
  const studentId = studentSelect ? studentSelect.value : "STU-1001";
  const student = CampusData.students.find(s => s.studentId === studentId) || CampusData.students[0];

  if (!logContainer) return;

  logContainer.innerHTML = "";
  if (resultCard) resultCard.style.display = "none";

  const steps = [
    {
      title: "Step 1: Consumer Discovery & JAX-WS Proxy Creation",
      desc: `[${consumerApp}] downloads WSDL from <code>http://localhost:8888/ws/student?wsdl</code> and binds dynamic port proxy.`
    },
    {
      title: "Step 2: SOAP Serialization & HTTP POST Dispatch",
      desc: `Packaging <code>&lt;ser:getStudentById&gt;</code> envelope with parameter <code>studentId='${student.studentId}'</code>; dispatched over port 8888.`
    },
    {
      title: "Step 3: Service Provider Execution & Database Lookup",
      desc: `[StudentInformationServiceImpl] resolves query against concurrent in-memory repository; record for <strong>${student.studentName}</strong> located.`
    },
    {
      title: "Step 4: SOAP Response Serialization & Client View Binding",
      desc: `Response <code>&lt;getStudentByIdResponse&gt;</code> deserialized by [${consumerApp}]; student demographic data rendered cleanly.`
    }
  ];

  let currentStep = 0;
  function processStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const stepEl = document.createElement("div");
      stepEl.className = "activity-item";
      stepEl.style.animation = "fadeIn 0.25s ease";
      stepEl.innerHTML = `
        <div class="activity-icon-wrap" style="background-color:var(--blue-light); color:var(--blue-primary);">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        <div class="activity-desc">
          <p style="font-weight:700; color:var(--text-main); font-size:0.85rem;">${step.title}</p>
          <p style="font-size:0.78rem; color:var(--text-body); margin-top:0.15rem;">${step.desc}</p>
        </div>
      `;
      logContainer.appendChild(stepEl);
      currentStep++;
      setTimeout(processStep, 400);
    } else {
      if (resultCard) {
        resultCard.style.display = "block";
        resultCard.innerHTML = `
          <div style="background:linear-gradient(135deg, #ffffff 0%, var(--teal-subtle) 100%); border:1px solid var(--teal-light); border-radius:var(--radius-lg); padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
              <span class="badge badge-teal"><i class="fa-solid fa-circle-check"></i> Inter-Department Data Synchronized</span>
              <span style="font-size:0.72rem; color:var(--text-muted); font-family:'JetBrains Mono';">SOAP 1.1 Transport Verified</span>
            </div>
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.25rem;">
              ${escapeHtml(student.studentName)} (${student.studentId})
            </h4>
            <p style="font-size:0.8rem; color:var(--text-muted);">
              ${escapeHtml(student.department)} • ${escapeHtml(student.year)} • Enrolled: ${student.admissionStatus}
            </p>
            <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed var(--border-light); font-size:0.8rem; color:var(--text-body);">
              <strong>${consumerApp} Action:</strong> Student identity validated via centralized Java Web Services. Local department records updated without duplicate data entry.
            </div>
          </div>
        `;
      }
      showToast("Inter-departmental SOAP call completed successfully!", "success");
    }
  }

  processStep();
}

// ==========================================================================
// 10. ARCHITECTURE VISUALIZER CONTROLLER
// ==========================================================================

function initArchitectureVisualizer() {
  const nodes = document.querySelectorAll(".arch-interactive-node");
  const detailBox = document.getElementById("archNodeDetailContent");

  const descriptions = {
    provider: {
      title: "1. Service Provider (StudentInformationService)",
      role: "Implements and hosts the core business logic and authoritative student database.",
      details: "In our implementation, this is <code>StudentInformationServiceImpl</code> hosted via <code>StudentServicePublisher</code> on <code>http://localhost:8888/ws/student</code>. It creates and publishes the WSDL contract."
    },
    registry: {
      title: "2. Service Registry (Central Catalog)",
      role: "A directory where available university web services, descriptions, and WSDL locations are published.",
      details: "Allows consumers to find endpoints dynamically without hardcoding proprietary dependencies. In standard SOA, this functions analogously to UDDI or an Enterprise Service Bus (ESB) catalog."
    },
    discovery: {
      title: "3. Service Discovery",
      role: "The automated or programmatic lookup process where a client discovers the service contract (WSDL).",
      details: "Consumers read the WSDL file at <code>?wsdl</code> to learn the exact method signatures (<code>getStudentById</code>, <code>getAllStudents</code>), XML Schema types, and binding addresses."
    },
    consumers: {
      title: "4. Service Consumers (Departmental Applications)",
      role: "Independent applications that consume the published service over SOAP/HTTP.",
      details: "Admission, Attendance, Examination, Library, and Fee Management each bind to the StudentInformationService to query student identities, ensure data consistency, and eliminate duplicate entry."
    }
  };

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("highlighted"));
      node.classList.add("highlighted");

      const key = node.getAttribute("data-arch-key");
      const info = descriptions[key];

      if (info && detailBox) {
        detailBox.innerHTML = `
          <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.35rem;">${info.title}</h4>
          <p style="font-size:0.85rem; color:var(--blue-primary); font-weight:600; margin-bottom:0.5rem;">${info.role}</p>
          <p style="font-size:0.82rem; color:var(--text-body); line-height:1.5;">${info.details}</p>
        `;
      }
    });
  });
}

// ==========================================================================
// 11. MODAL WINDOWS & CRUD OPERATIONS
// ==========================================================================

function initModals() {
  // Add Student Form submit
  const addStudentForm = document.getElementById("addStudentForm");
  if (addStudentForm) {
    addStudentForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("newStudentName").value.trim();
      const dept = document.getElementById("newStudentDept").value;
      const year = document.getElementById("newStudentYear").value;
      const email = document.getElementById("newStudentEmail").value.trim();
      const phone = document.getElementById("newStudentPhone").value.trim();
      const gpa = parseFloat(document.getElementById("newStudentGpa").value) || 3.5;

      const newId = `STU-10${CampusData.students.length + 1}`;
      const newStudent = {
        studentId: newId,
        studentName: name,
        department: dept,
        year: year,
        email: email,
        mobileNumber: phone,
        admissionStatus: "Enrolled",
        cgpa: gpa,
        attendance: 90.0,
        feePaid: 6500,
        feeTotal: 6500,
        booksIssued: 0
      };

      CampusData.students.unshift(newStudent);
      renderStudentTable();
      updateDashboardMetrics();
      closeModal("addStudentModal");
      addStudentForm.reset();
      showToast(`Student ${name} registered successfully with ID: ${newId}!`, "success");
    });
  }

  // Edit Student Form submit
  const editStudentForm = document.getElementById("editStudentForm");
  if (editStudentForm) {
    editStudentForm.addEventListener("submit", e => {
      e.preventDefault();
      const id = document.getElementById("editStudentId").value;
      const student = CampusData.students.find(s => s.studentId === id);

      if (student) {
        student.studentName = document.getElementById("editStudentName").value.trim();
        student.department = document.getElementById("editStudentDept").value;
        student.year = document.getElementById("editStudentYear").value;
        student.email = document.getElementById("editStudentEmail").value.trim();
        student.mobileNumber = document.getElementById("editStudentPhone").value.trim();
        student.admissionStatus = document.getElementById("editStudentStatus").value;

        renderStudentTable();
        closeModal("editStudentModal");
        showToast(`Student record for ${student.studentName} updated successfully.`, "success");
      }
    });
  }

  // Issue Book Form submit
  const issueBookForm = document.getElementById("issueBookForm");
  if (issueBookForm) {
    issueBookForm.addEventListener("submit", e => {
      e.preventDefault();
      const bookId = document.getElementById("issueBookId").value;
      const studentId = document.getElementById("issueStudentId").value;
      const book = CampusData.libraryBooks.find(b => b.bookId === bookId);
      const student = CampusData.students.find(s => s.studentId === studentId);

      if (book && student) {
        book.status = "Issued";
        book.borrowerId = student.studentId;
        book.borrowerName = student.studentName;
        book.dueDate = "2026-03-25";

        renderLibraryTable();
        closeModal("issueBookModal");
        showToast(`Book '${book.title}' issued to ${student.studentName} via SOAP verification.`, "success");
      } else {
        showToast("Invalid Student ID or Book ID.", "danger");
      }
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("show");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("show");
}

function openStudentProfileModal(studentId) {
  const student = CampusData.students.find(s => s.studentId === studentId);
  if (!student) return;

  const content = document.getElementById("studentProfileModalContent");
  if (!content) return;

  content.innerHTML = `
    <div style="display:flex; align-items:center; gap:1.25rem; margin-bottom:1.5rem; padding-bottom:1.25rem; border-bottom:1px solid var(--border-light);">
      <div class="user-avatar" style="width:58px; height:58px; font-size:1.5rem;">
        ${student.studentName.charAt(0)}
      </div>
      <div>
        <h3 style="font-size:1.35rem; font-weight:800; color:var(--text-main);">${escapeHtml(student.studentName)}</h3>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.25rem;">
          <span class="badge badge-purple" style="font-family:'JetBrains Mono';">${student.studentId}</span>
          <span class="badge badge-info">${escapeHtml(student.department)}</span>
          <span class="badge badge-success">${escapeHtml(student.admissionStatus)}</span>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
      <div style="background-color:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md);">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">ACADEMIC YEAR</span>
        <strong style="font-size:0.95rem; color:var(--text-main);">${escapeHtml(student.year)}</strong>
      </div>
      <div style="background-color:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md);">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">CUMULATIVE GPA</span>
        <strong style="font-size:0.95rem; color:var(--teal-primary);">${student.cgpa} / 4.00</strong>
      </div>
      <div style="background-color:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md);">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">EMAIL ADDRESS</span>
        <strong style="font-size:0.85rem; color:var(--text-main);">${escapeHtml(student.email)}</strong>
      </div>
      <div style="background-color:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-md);">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">CONTACT NUMBER</span>
        <strong style="font-size:0.85rem; color:var(--text-main);">${escapeHtml(student.mobileNumber)}</strong>
      </div>
    </div>

    <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.75rem;">Connected Departmental Status</h4>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.85rem; text-align:center;">
      <div style="border:1px solid var(--border-light); border-radius:var(--radius-md); padding:0.75rem;">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">ATTENDANCE</span>
        <strong style="font-size:1.1rem; color:var(--blue-primary);">${student.attendance}%</strong>
      </div>
      <div style="border:1px solid var(--border-light); border-radius:var(--radius-md); padding:0.75rem;">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">FEE BALANCE</span>
        <strong style="font-size:1.1rem; color:${student.feeTotal - student.feePaid === 0 ? 'var(--success)' : 'var(--danger)'};">
          $${student.feeTotal - student.feePaid}
        </strong>
      </div>
      <div style="border:1px solid var(--border-light); border-radius:var(--radius-md); padding:0.75rem;">
        <span style="font-size:0.72rem; color:var(--text-muted); display:block;">BOOKS ISSUED</span>
        <strong style="font-size:1.1rem; color:var(--purple-primary);">${student.booksIssued} Books</strong>
      </div>
    </div>
  `;

  openModal("studentProfileModal");
}

function openEditStudentModal(studentId) {
  const student = CampusData.students.find(s => s.studentId === studentId);
  if (!student) return;

  document.getElementById("editStudentId").value = student.studentId;
  document.getElementById("editStudentName").value = student.studentName;
  document.getElementById("editStudentDept").value = student.department;
  document.getElementById("editStudentYear").value = student.year;
  document.getElementById("editStudentEmail").value = student.email;
  document.getElementById("editStudentPhone").value = student.mobileNumber;
  document.getElementById("editStudentStatus").value = student.admissionStatus;

  openModal("editStudentModal");
}

function openIssueBookModal(bookId) {
  const book = CampusData.libraryBooks.find(b => b.bookId === bookId);
  if (!book) return;

  document.getElementById("issueBookId").value = book.bookId;
  document.getElementById("issueBookTitle").textContent = book.title;

  openModal("issueBookModal");
}

// ==========================================================================
// 12. UTILITIES & TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  if (type === "danger") icon = "fa-triangle-exclamation";
  if (type === "purple") icon = "fa-gear";

  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="font-size:1.1rem; color:${type === 'success' ? 'var(--success)' : type === 'danger' ? 'var(--danger)' : 'var(--blue-primary)'};"></i>
    <span style="flex:1;">${escapeHtml(message)}</span>
    <button style="background:none; border:none; color:var(--text-light); cursor:pointer;" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
