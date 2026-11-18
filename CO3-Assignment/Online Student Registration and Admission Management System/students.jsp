<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.college.admission.Student" %>
<%@ page import="com.college.admission.StudentDataStore" %>
<%
    // Retrieve students list from request attribute passed by StudentDetailsServlet
    @SuppressWarnings("unchecked")
    List<Student> studentList = (List<Student>) request.getAttribute("studentList");
    
    // If accessed directly without going through servlet, fetch directly from data store
    if (studentList == null) {
        studentList = StudentDataStore.getInstance().getAllStudents();
    }

    String message = (String) request.getAttribute("message");
    String searchQuery = request.getParameter("search");
    if (searchQuery == null) searchQuery = "";
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Records | Apex Institute of Technology</title>
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
        <a href="students" class="nav-item active">
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>Student Details</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="status-card">
          <div class="status-badge">
            <span class="status-pulse"></span>
            <span>Live Database</span>
          </div>
          <div class="status-text">Synchronized via Servlet</div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
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
            <h2>Registered Students Directory</h2>
            <p>View, search, and manage candidate admission records</p>
          </div>
        </div>
        <div class="topbar-right">
          <a href="register.html" class="btn btn-primary btn-sm">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Register New Student</span>
          </a>
        </div>
      </header>

      <!-- Content Body -->
      <main class="content-body">
        <!-- Optional Success/Notification Alert -->
        <% if (message != null && !message.isEmpty()) { %>
          <div class="alert alert-success">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span><%= message %></span>
          </div>
        <% } %>

        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="header-icon">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3>Enrolled Candidates</h3>
                <p>Showing all active admission applicants</p>
              </div>
            </div>
            <div>
              <span class="session-pill" id="studentCountBadge">
                <%= (studentList != null ? studentList.size() : 0) %> Students
              </span>
            </div>
          </div>

          <div class="card-body">
            <!-- Table Toolbar (Search Box & Department Filter) -->
            <div class="table-toolbar">
              <form action="students" method="GET" class="search-box-container" style="margin: 0;">
                <div class="search-input-wrapper">
                  <span class="search-icon">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </span>
                  <input type="text" id="studentSearchInput" name="search" placeholder="Search by Register No or Name..." value="<%= searchQuery %>">
                </div>
                <button type="submit" class="btn btn-secondary btn-sm" title="Server GET Search">
                  <span>Search</span>
                </button>
                <% if (!searchQuery.isEmpty()) { %>
                  <a href="students" class="btn btn-sm btn-reset" title="Clear Search Filter">Clear</a>
                <% } %>
              </form>

              <!-- Department Filter Dropdown -->
              <div>
                <select id="departmentFilter" class="form-control no-icon" style="padding: 9px 14px; font-size: 0.85rem; width: auto; min-width: 180px;">
                  <option value="">All Departments</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="IT">IT</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            </div>

            <!-- Student Records Table -->
            <% if (studentList == null || studentList.isEmpty()) { %>
              <div class="empty-state">
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                </div>
                <h4>No Student Records Found</h4>
                <p>There are currently no admission records matching your criteria. You can register a candidate now.</p>
                <a href="register.html" class="btn btn-primary">
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  <span>Register First Student</span>
                </a>
              </div>
            <% } else { %>
              <div class="table-responsive">
                <table class="data-table" id="studentsTable">
                  <thead>
                    <tr>
                      <th style="width: 50px;">#</th>
                      <th>Register No</th>
                      <th>Student Name</th>
                      <th>Contact Info</th>
                      <th>Department</th>
                      <th>10th (%)</th>
                      <th>12th (%)</th>
                      <th>Preferred Dept</th>
                      <th style="text-align: center; width: 110px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <% 
                      int index = 1;
                      for (Student s : studentList) { 
                    %>
                      <tr class="student-row" 
                          data-regno="<%= s.getRegisterNumber() %>" 
                          data-name="<%= s.getStudentName() %>"
                          data-dept="<%= s.getDepartment() %>">
                        <td><strong><%= index++ %></strong></td>
                        <td>
                          <span class="reg-badge"><%= s.getRegisterNumber() %></span>
                        </td>
                        <td>
                          <strong><%= s.getStudentName() %></strong>
                          <div style="font-size: 0.775rem; color: var(--text-light);"><%= s.getGender() %> | DOB: <%= s.getDob() %></div>
                        </td>
                        <td>
                          <div style="font-size: 0.85rem;"><%= s.getEmail() %></div>
                          <div style="font-size: 0.775rem; color: var(--text-light);">+91 <%= s.getMobile() %></div>
                        </td>
                        <td>
                          <span class="dept-pill"><%= s.getDepartment() %></span>
                        </td>
                        <td>
                          <span class="marks-badge"><%= String.format("%.1f", s.getMarks10()) %>%</span>
                        </td>
                        <td>
                          <span class="marks-badge" style="background: var(--success-bg); color: var(--success);"><%= String.format("%.1f", s.getMarks12()) %>%</span>
                        </td>
                        <td>
                          <span class="dept-pill" style="background: var(--sky-blue-light); color: var(--primary-blue); font-size: 0.8rem;"><%= s.getPreferredDepartment() %></span>
                        </td>
                        <td style="text-align: center;">
                          <div class="table-actions" style="justify-content: center;">
                            <!-- View Button -->
                            <button type="button" class="btn-icon view" title="View Full Details" 
                              onclick='openStudentModal({
                                name: "<%= s.getStudentName().replace("\"", "\\\"") %>",
                                regNo: "<%= s.getRegisterNumber().replace("\"", "\\\"") %>",
                                email: "<%= s.getEmail().replace("\"", "\\\"") %>",
                                mobile: "<%= s.getMobile().replace("\"", "\\\"") %>",
                                dob: "<%= s.getDob() %>",
                                gender: "<%= s.getGender() %>",
                                address: "<%= s.getAddress().replace("\"", "\\\"").replace("\n", " ") %>",
                                state: "<%= s.getState() %>",
                                department: "<%= s.getDepartment() %>",
                                preferredDepartment: "<%= s.getPreferredDepartment() %>",
                                marks10: <%= s.getMarks10() %>,
                                marks12: <%= s.getMarks12() %>
                              })'>
                              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>

                            <!-- Delete Button -->
                            <button type="button" class="btn-icon delete" title="Delete Student Record"
                              onclick='confirmDelete("<%= s.getRegisterNumber() %>", "<%= s.getStudentName().replace("\"", "\\\"") %>")'>
                              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    <% } %>
                  </tbody>
                </table>
              </div>
            <% } %>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Student Full Details View Modal -->
  <div class="modal-overlay" id="studentDetailModal">
    <div class="modal-card">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="header-icon" style="width: 32px; height: 32px;">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3>Student Profile Overview</h3>
        </div>
        <button class="modal-close-btn" onclick="closeStudentModal()" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="modal-body">
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid var(--border-light);">
          <div>
            <h4 id="modalStudentName" style="font-size: 1.3rem; font-weight: 700; color: var(--text-main);">Rahul Sharma</h4>
            <p style="font-size: 0.85rem; color: var(--text-light);"><span id="modalGender">Male</span> • DOB: <span id="modalDob">2006-05-14</span></p>
          </div>
          <div class="reg-badge" id="modalRegNo" style="font-size: 1rem; padding: 6px 12px; background: var(--lavender-light); color: var(--lavender-dark);">REG2026001</div>
        </div>

        <div class="details-grid" style="padding: 0; gap: 16px;">
          <div class="detail-item">
            <span class="detail-label">Email Address</span>
            <span class="detail-value" id="modalEmail" style="font-size: 0.95rem;">rahul.sharma@example.com</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Mobile Number</span>
            <span class="detail-value" id="modalMobile" style="font-size: 0.95rem;">9876543210</span>
          </div>

          <div class="detail-item" style="grid-column: 1 / -1;">
            <span class="detail-label">Residential Address</span>
            <span class="detail-value" id="modalAddress" style="font-size: 0.95rem; font-weight: normal;">42, Gandhi Road, Chennai</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">State</span>
            <span class="detail-value" id="modalState">Tamil Nadu</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Enrolled Department</span>
            <span class="detail-value">
              <span class="dept-pill" id="modalDepartment">AI & ML</span>
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Preferred Secondary Dept</span>
            <span class="detail-value">
              <span class="dept-pill" id="modalPrefDepartment" style="background: var(--sky-blue-light); color: var(--primary-blue);">CSE</span>
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Class 10 Marks</span>
            <span class="detail-value">
              <span class="marks-badge" id="modalMarks10">89.4%</span>
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Class 12 Marks</span>
            <span class="detail-value">
              <span class="marks-badge" id="modalMarks12" style="background: var(--success-bg); color: var(--success);">93.6%</span>
            </span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="closeStudentModal()">Close Window</button>
      </div>
    </div>
  </div>

  <script src="js/validation.js"></script>
</body>
</html>
