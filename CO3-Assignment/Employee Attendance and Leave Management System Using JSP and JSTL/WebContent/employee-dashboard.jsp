<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Session Authentication Verification
    if (session == null || session.getAttribute("employeeId") == null) {
        response.sendRedirect("employee-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If loaded directly without servlet attributes, redirect to servlet to fetch dynamic data --%>
<c:if test="${empty totalWorkingDays}">
    <c:redirect url="EmployeeDashboardServlet" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Dashboard - EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="app-wrapper">
        
        <!-- VERTICAL SIDEBAR NAVIGATION -->
        <aside class="app-sidebar">
            <div class="sidebar-header">
                <div class="brand-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                </div>
                <div class="brand-text">
                    <h2>IT Employee Portal</h2>
                    <span>Attendance & Leave</span>
                </div>
            </div>

            <!-- Employee Info Widget in Sidebar -->
            <div class="sidebar-user">
                <div class="user-avatar">
                    ${sessionScope.employeeName.substring(0, 1)}
                </div>
                <div class="user-info">
                    <div class="user-name" title="${sessionScope.employeeName}">${sessionScope.employeeName}</div>
                    <span class="user-role-badge">ID: ${sessionScope.employeeId}</span>
                </div>
            </div>

            <!-- Vertical Navigation Menu -->
            <nav class="sidebar-nav">
                <div class="nav-section-title">Navigation Menu</div>
                
                <a href="EmployeeDashboardServlet" class="nav-item active">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>Dashboard</span>
                </a>

                <a href="AttendanceServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>My Attendance</span>
                </a>

                <a href="apply-leave.jsp" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <span>Apply Leave</span>
                </a>

                <a href="LeaveHistoryServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
                    <span>Leave History</span>
                </a>

                <a href="profile.jsp" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Profile</span>
                </a>
            </nav>

            <!-- Sidebar Footer with Logout -->
            <div class="sidebar-footer">
                <a href="LogoutServlet" class="logout-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Log Out</span>
                </a>
            </div>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <main class="app-main">
            
            <!-- Top Sticky Bar -->
            <header class="top-bar">
                <div class="top-bar-left">
                    <h1>Employee Dashboard</h1>
                    <p>Welcome to your personal attendance and leave center</p>
                </div>
                <div class="top-bar-right">
                    <div class="date-pill">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>Department: ${sessionScope.department}</span>
                    </div>
                </div>
            </header>

            <div class="page-container">

                <!-- Welcome Banner -->
                <div style="background: linear-gradient(135deg, #ffffff, #eff6ff 50%, #f5f3ff); border: 1px solid var(--soft-lavender-subtle); border-radius: var(--radius-lg); padding: 24px 28px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: var(--shadow-sm);">
                    <div>
                        <span style="font-size: 12px; font-weight: 700; color: var(--lavender-primary); text-transform: uppercase; letter-spacing: 0.6px;">Employee Overview</span>
                        <h2 style="font-size: 24px; font-weight: 800; color: var(--text-primary); margin-top: 4px;">
                            Welcome back, ${sessionScope.employeeName}!
                        </h2>
                        <p style="font-size: 14px; color: var(--text-secondary); margin-top: 2px;">
                            Employee ID: <strong style="color: var(--primary-blue);">${sessionScope.employeeId}</strong> &bull; Department: <strong>${sessionScope.department}</strong>
                        </p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="AttendanceServlet?action=mark_today" class="btn btn-primary" title="Record check-in for today">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Mark Today's Attendance
                        </a>
                        <a href="apply-leave.jsp" class="btn btn-lavender">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Apply Leave
                        </a>
                    </div>
                </div>

                <!-- 4 CLEAN DASHBOARD METRIC CARDS -->
                <div class="metrics-grid">
                    <!-- Total Working Days -->
                    <div class="metric-card">
                        <div class="metric-data">
                            <h3>Total Working Days</h3>
                            <div class="metric-number">${totalWorkingDays}</div>
                            <span class="metric-sub">Recorded this period</span>
                        </div>
                        <div class="metric-icon-box bg-blue-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                    </div>

                    <!-- Present Days -->
                    <div class="metric-card">
                        <div class="metric-data">
                            <h3>Present Days</h3>
                            <div class="metric-number" style="color: #059669;">${presentDays}</div>
                            <span class="metric-sub" style="color: #059669; font-weight: 600;">Active working days</span>
                        </div>
                        <div class="metric-icon-box bg-green-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                    </div>

                    <!-- Absent Days -->
                    <div class="metric-card">
                        <div class="metric-data">
                            <h3>Absent Days</h3>
                            <div class="metric-number" style="color: #dc2626;">${absentDays}</div>
                            <span class="metric-sub" style="color: #dc2626; font-weight: 600;">Days absent</span>
                        </div>
                        <div class="metric-icon-box bg-rose-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </div>
                    </div>

                    <!-- Remaining Leave Balance -->
                    <div class="metric-card">
                        <div class="metric-data">
                            <h3>Leave Balance</h3>
                            <div class="metric-number" style="color: var(--lavender-primary);">${remainingLeaveBalance} <span style="font-size: 15px; font-weight: 500; color: var(--text-muted);">/ ${totalLeaveQuota}</span></div>
                            <span class="metric-sub">Days available for leave</span>
                        </div>
                        <div class="metric-icon-box bg-lavender-soft">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                    </div>
                </div>

                <!-- TWO-COLUMN SECTION: Recent Attendance & Leave Application Status -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px;">
                    
                    <!-- RECENT ATTENDANCE DETAILS -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Recent Attendance Details
                            </div>
                            <a href="AttendanceServlet" class="btn btn-outline btn-sm">View All &rarr;</a>
                        </div>
                        <div class="card-body" style="padding: 0;">
                            <div class="table-responsive">
                                <table class="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Check-In</th>
                                            <th>Check-Out</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <c:choose>
                                            <c:when test="${not empty recentAttendance}">
                                                <c:forEach var="att" items="${recentAttendance}">
                                                    <tr>
                                                        <td><strong>${att.attendanceDate}</strong></td>
                                                        <td>${att.formattedCheckIn}</td>
                                                        <td>${att.formattedCheckOut}</td>
                                                        <td>
                                                            <c:choose>
                                                                <c:when test="${att.status eq 'Present'}">
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
                                                    <td colspan="4" class="empty-state">
                                                        <p>No recent attendance records found.</p>
                                                    </td>
                                                </tr>
                                            </c:otherwise>
                                        </c:choose>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- LEAVE APPLICATION STATUS SUMMARY -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                Leave Application Status
                            </div>
                            <a href="LeaveHistoryServlet" class="btn btn-outline btn-sm">Full History &rarr;</a>
                        </div>
                        <div class="card-body" style="padding: 0;">
                            <div class="table-responsive">
                                <table class="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Dates</th>
                                            <th>Days</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <c:choose>
                                            <c:when test="${not empty recentLeaves}">
                                                <c:forEach var="leave" items="${recentLeaves}">
                                                    <tr>
                                                        <td><strong>${leave.leaveType}</strong></td>
                                                        <td style="font-size: 13px;">${leave.fromDate} to ${leave.toDate}</td>
                                                        <td><span class="badge badge-outline">${leave.numberOfDays} d</span></td>
                                                        <td>
                                                            <c:choose>
                                                                <c:when test="${leave.status eq 'Approved'}">
                                                                    <span class="badge badge-approved"><span class="badge-dot"></span> Approved</span>
                                                                </c:when>
                                                                <c:when test="${leave.status eq 'Rejected'}">
                                                                    <span class="badge badge-rejected"><span class="badge-dot"></span> Rejected</span>
                                                                </c:when>
                                                                <c:otherwise>
                                                                    <span class="badge badge-pending"><span class="badge-dot"></span> Pending</span>
                                                                </c:otherwise>
                                                            </c:choose>
                                                        </td>
                                                    </tr>
                                                </c:forEach>
                                            </c:when>
                                            <c:otherwise>
                                                <tr>
                                                    <td colspan="4" class="empty-state">
                                                        <p>No leave applications submitted yet.</p>
                                                        <a href="apply-leave.jsp" class="btn btn-primary btn-sm" style="margin-top: 10px;">Apply for Leave</a>
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

            </div>
        </main>
    </div>

</body>
</html>
