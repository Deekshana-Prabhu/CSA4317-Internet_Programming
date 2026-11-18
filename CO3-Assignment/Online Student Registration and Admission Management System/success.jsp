<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.college.admission.Student" %>
<%
    // Retrieve the registered student object from request or session
    Student student = (Student) request.getAttribute("student");
    if (student == null) {
        student = (Student) session.getAttribute("latestStudent");
    }

    // Fallback if accessed directly without forwarding (using query params if present)
    String studentName = (student != null) ? student.getStudentName() : request.getParameter("studentName");
    String registerNumber = (student != null) ? student.getRegisterNumber() : request.getParameter("registerNumber");
    String email = (student != null) ? student.getEmail() : request.getParameter("email");
    String mobile = (student != null) ? student.getMobile() : request.getParameter("mobile");
    String dob = (student != null) ? student.getDob() : request.getParameter("dob");
    String gender = (student != null) ? student.getGender() : request.getParameter("gender");
    String address = (student != null) ? student.getAddress() : request.getParameter("address");
    String state = (student != null) ? student.getState() : request.getParameter("state");
    String department = (student != null) ? student.getDepartment() : request.getParameter("department");
    String prefDept = (student != null) ? student.getPreferredDepartment() : request.getParameter("preferredDepartment");
    
    double marks10 = 0.0;
    double marks12 = 0.0;
    try {
        marks10 = (student != null) ? student.getMarks10() : Double.parseDouble(request.getParameter("marks10"));
    } catch (Exception e) {}
    try {
        marks12 = (student != null) ? student.getMarks12() : Double.parseDouble(request.getParameter("marks12"));
    } catch (Exception e) {}

    // Set fallback defaults if no parameters exist
    if (studentName == null) studentName = "Rahul Sharma";
    if (registerNumber == null) registerNumber = "REG2026001";
    if (email == null) email = "rahul.sharma@example.com";
    if (mobile == null) mobile = "9876543210";
    if (dob == null) dob = "2006-05-14";
    if (gender == null) gender = "Male";
    if (address == null) address = "42, Gandhi Road, Adyar, Chennai - 600020";
    if (state == null) state = "Tamil Nadu";
    if (department == null) department = "AI & ML";
    if (prefDept == null) prefDept = "CSE";
    if (marks10 == 0.0) marks10 = 89.4;
    if (marks12 == 0.0) marks12 = 93.6;
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation | Apex Institute of Technology</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="app-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="college-logo-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="college-info">
          <h1>APEX INSTITUTE</h1>
          <p>Admission Portal</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-label">Main Menu</div>
        <a href="index.html" class="nav-item">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Home / Overview</span>
        </a>
        <a href="register.html" class="nav-item">
          <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          <span>New Registration</span>
        </a>
        <a href="students" class="nav-item">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>Student Details</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="status-card">
          <div class="status-badge">
            <span class="status-pulse"></span>
            <span>Registration Confirmed</span>
          </div>
          <div class="status-text">Session 2026 – 2027</div>
        </div>
      </div>
    </aside>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle navigation menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="portal-title-area">
            <h2>Registration Confirmation</h2>
            <p>Application successfully received and recorded in the database</p>
          </div>
        </div>
        <div class="topbar-right">
          <button onclick="window.print()" class="btn btn-secondary btn-sm">
            <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span>Print Receipt</span>
          </button>
        </div>
      </header>

      <!-- Content Body -->
      <main class="content-body">
        <div class="confirmation-container">
          <!-- Success Banner -->
          <div class="success-banner">
            <div class="success-icon-wrapper">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2>Registration Successful!</h2>
            <p>The student admission record has been successfully processed and stored by RegistrationServlet.</p>
          </div>

          <!-- Student Information Summary Card -->
          <div class="registration-card">
            <div class="reg-card-header">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Candidate Admission Slip</h3>
                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 4px;">Apex Institute of Technology – Academic Year 2026-27</p>
              </div>
              <div class="reg-no-highlight">
                <span class="reg-no-label">Register No:</span>
                <span class="reg-no-val"><%= registerNumber %></span>
              </div>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Full Name</span>
                <span class="detail-value"><%= studentName %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Official Register Number</span>
                <span class="detail-value" style="color: var(--primary-blue); font-weight: 700;"><%= registerNumber %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Email Address</span>
                <span class="detail-value"><%= email %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Contact Number</span>
                <span class="detail-value">+91 <%= mobile %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Date of Birth</span>
                <span class="detail-value"><%= dob %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Gender</span>
                <span class="detail-value"><%= gender %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Residential Address</span>
                <span class="detail-value" style="font-size: 0.95rem; font-weight: 500;"><%= address %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">State</span>
                <span class="detail-value"><%= state %></span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Allocated Department</span>
                <span class="detail-value">
                  <span class="dept-pill"><%= department %></span>
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Preferred Department (Choice 2)</span>
                <span class="detail-value">
                  <span class="dept-pill" style="background: var(--sky-blue-light); color: var(--primary-blue);"><%= prefDept %></span>
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Class 10 Score</span>
                <span class="detail-value">
                  <span class="marks-badge"><%= String.format("%.2f", marks10) %>%</span>
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Class 12 Score</span>
                <span class="detail-value">
                  <span class="marks-badge" style="background: var(--success-bg); color: var(--success);"><%= String.format("%.2f", marks12) %>%</span>
                </span>
              </div>
            </div>

            <!-- Card Actions -->
            <div style="padding: 20px 32px; background: #f8fafc; border-top: 1px solid var(--border-light); display: flex; gap: 14px; justify-content: flex-end; flex-wrap: wrap;">
              <a href="register.html" class="btn btn-secondary">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Register Another Student</span>
              </a>
              <a href="students" class="btn btn-primary">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>View All Student Records</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <script src="js/validation.js"></script>
</body>
</html>
