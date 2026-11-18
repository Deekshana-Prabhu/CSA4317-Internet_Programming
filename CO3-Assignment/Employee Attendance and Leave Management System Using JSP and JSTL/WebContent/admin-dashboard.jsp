<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Administrator Session Authentication Check
    if (session == null || session.getAttribute("adminUsername") == null) {
        response.sendRedirect("admin-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If loaded directly without servlet attributes, redirect to AdminDashboardServlet --%>
<c:if test="${empty totalEmployees}">
    <c:redirect url="AdminDashboardServlet" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrator Dashboard - EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="app-wrapper">
        
        <!-- VERTICAL SIDEBAR NAVIGATION FOR ADMIN -->
        <aside class="app-sidebar">
            <div class="sidebar-header">
                <div class="brand-icon" style="background: linear-gradient(135deg, var(--lavender-primary), #4f46e5);">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div class="brand-text">
                    <h2>Admin Console</h2>
                    <span style="color: var(--primary-blue);">HR & Management</span>
                </div>
            </div>

            <!-- Admin Profile Widget in Sidebar -->
            <div class="sidebar-user">
                <div class="user-avatar" style="border-color: var(--soft-lavender-border); color: var(--lavender-primary);">
                    ${sessionScope.adminName.substring(0, 1)}
                </div>
                <div class="user-info">
                    <div class="user-name">${sessionScope.adminName}</div>
                    <span class="user-role-badge">Super Admin</span>
                </div>
            </div>

            <!-- Vertical Navigation Menu -->
            <nav class="sidebar-nav">
                <div class="nav-section-title">Admin Management</div>
                
                <a href="AdminDashboardServlet" class="nav-item active">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>Dashboard</span>
                </a>

                <a href="EmployeeDetailsServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <span>Employee Details</span>
                </a>

                <a href="AttendanceServlet?view=all" class="nav-item">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>Attendance Records</span>
                </a>

                <a href="LeaveRequestsServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Leave Requests</span>
                </a>
            </nav>

            <!-- Logout Link -->
            <div class="sidebar-footer">
                <a href="LogoutServlet" class="logout-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Log Out</span>
                </a>
            </div>
        </aside>

        <!-- MAIN ADMIN VIEW -->
        <main class="app-main">
            <header class="top-bar">
                <div class="top-bar-left">
                    <h1>Administrator Dashboard</h1>
                    <p>Company-wide attendance monitoring & employee leave management</p>
                </div>
                <div class="top-bar-right">
                    <div class="date-pill" style="background-color: var(--soft-lavender-bg); border-color: var(--soft-lavender-border); color: var(--lavender-primary);">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>Admin: ${sessionScope.adminUsername}</span>
                    </div>
                </div>
            </header>

            <div class="page-container">

                <!-- Alert Messages -->
                <c:if test="${not empty successMessage}">
                    <div class="alert alert-success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>${successMessage}</span>
                    </div>
                </c:if>

                <c:if test="${not empty infoMessage}">
                    <div class="alert alert-info">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>${infoMessage}</span>
                    </div>
                </c:if>

                <!-- 4 ADMINISTRATOR METRIC CARDS AS REQUIRED -->
                <div class="metrics-grid">
                    <!-- 1. Total Employees -->
                    <div class="metric-card">
                        <div class="metric-data">
                            <h3>Total Employees</h3>
                            <div class="metric-number">${totalEmployees}</div>
                            <span class="metric-sub">Registered workforce</span>
                        </div>
                        <div class="metric-icon-box bg-blue-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                    </div>

                    <!-- 2. Total Attendance Records -->
                    <div class="metric-card">
                        <div class="metric-data">
                            <h3>Attendance Logs</h3>
                            <div class="metric-number">${totalAttendanceRecords}</div>
                            <span class="metric-sub">Total database logs</span>
                        </div>
                        <div class="metric-icon-box bg-lavender-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                    </div>

                    <!-- 3. Pending Leave Requests -->
                    <div class="metric-card" style="border-left: 4px solid var(--status-pending-border);">
                        <div class="metric-data">
                            <h3>Pending Requests</h3>
                            <div class="metric-number" style="color: var(--status-pending-text);">${pendingLeavesCount}</div>
                            <span class="metric-sub" style="color: var(--status-pending-text); font-weight: 600;">Requires approval</span>
                        </div>
                        <div class="metric-icon-box bg-amber-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                    </div>

                    <!-- 4. Approved Leave Requests -->
                    <div class="metric-card" style="border-left: 4px solid var(--status-approved-border);">
                        <div class="metric-data">
                            <h3>Approved Requests</h3>
                            <div class="metric-number" style="color: var(--status-approved-text);">${approvedLeavesCount}</div>
                            <span class="metric-sub" style="color: var(--status-approved-text); font-weight: 600;">Granted leaves</span>
                        </div>
                        <div class="metric-icon-box bg-green-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    </div>
                </div>

                <!-- PENDING LEAVE REQUESTS QUICK ACTION TABLE -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            Pending Leave Requests Awaiting Your Decision
                        </div>
                        <a href="LeaveRequestsServlet" class="btn btn-outline btn-sm">All Requests &rarr;</a>
                    </div>

                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>App ID</th>
                                        <th>Employee Name</th>
                                        <th>Leave Type</th>
                                        <th>Dates</th>
                                        <th>Duration</th>
                                        <th>Reason</th>
                                        <th>Current Status</th>
                                        <th style="text-align: center;">Decision Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty pendingLeaves}">
                                            <c:forEach var="req" items="${pendingLeaves}">
                                                <tr>
                                                    <td><strong style="color: var(--lavender-primary);">#LA-${req.leaveId}</strong></td>
                                                    <td><strong>${req.employeeName}</strong> <span style="font-size: 11px; color: var(--text-muted);">(${req.employeeId})</span></td>
                                                    <td><span class="badge badge-outline">${req.leaveType}</span></td>
                                                    <td style="font-size: 13px;">${req.fromDate} to ${req.toDate}</td>
                                                    <td><strong>${req.numberOfDays}</strong> d</td>
                                                    <td style="max-width: 220px; font-size: 13px; color: var(--text-secondary);" title="${req.reason}">
                                                        ${req.reason}
                                                    </td>
                                                    <td>
                                                        <span class="badge badge-pending">
                                                            <span class="badge-dot"></span> Pending
                                                        </span>
                                                    </td>
                                                    <td style="text-align: center; white-space: nowrap;">
                                                        <!-- Direct 1-Click Approve / Reject -->
                                                        <a href="LeaveApprovalServlet?leaveId=${req.leaveId}&action=approve&source=dashboard" 
                                                           class="btn btn-success btn-sm" 
                                                           onclick="return confirm('Approve this leave request for ${req.employeeName}?')"
                                                           style="margin-right: 6px;">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            Approve
                                                        </a>
                                                        <a href="LeaveApprovalServlet?leaveId=${req.leaveId}&action=reject&source=dashboard" 
                                                           class="btn btn-danger btn-sm"
                                                           onclick="return confirm('Reject this leave request for ${req.employeeName}?')">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            Reject
                                                        </a>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="8" class="empty-state">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                    <h4>No pending requests!</h4>
                                                    <p>All employee leave requests have been reviewed and decided.</p>
                                                </td>
                                            </tr>
                                        </c:otherwise>
                                    </c:choose>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- RECENT ATTENDANCE ACROSS EMPLOYEES -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Recent Company Attendance Activity
                        </div>
                        <a href="AttendanceServlet?view=all" class="btn btn-outline btn-sm">Full Attendance Roster &rarr;</a>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Date</th>
                                        <th>Check-in</th>
                                        <th>Check-out</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty recentAttendance}">
                                            <c:forEach var="item" items="${recentAttendance}">
                                                <tr>
                                                    <td><span class="badge badge-outline">${item.employeeId}</span></td>
                                                    <td><strong>${item.employeeName}</strong></td>
                                                    <td>${item.attendanceDate}</td>
                                                    <td>${item.formattedCheckIn}</td>
                                                    <td>${item.formattedCheckOut}</td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${item.status eq 'Present'}">
                                                                <span class="badge badge-present"><span class="badge-dot"></span> Present</span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="badge badge-absent"><span class="badge-dot"></span> Absent</span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="6" class="empty-state">
                                                    <p>No attendance logs recorded yet.</p>
                                                </td>
                                            </tr>
                                        </c:otherwise>
                                    </c:choose>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>

</body>
</html>
