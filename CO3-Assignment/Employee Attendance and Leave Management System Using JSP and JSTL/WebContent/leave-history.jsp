<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Session Authentication Verification
    if (session == null || session.getAttribute("employeeId") == null) {
        response.sendRedirect("employee-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If loaded directly without servlet attributes, redirect to LeaveHistoryServlet --%>
<c:if test="${empty leaveList && empty totalLeaves}">
    <c:redirect url="LeaveHistoryServlet" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave History - EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="app-wrapper">
        
        <!-- VERTICAL SIDEBAR -->
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

            <!-- Employee Info -->
            <div class="sidebar-user">
                <div class="user-avatar">${sessionScope.employeeName.substring(0, 1)}</div>
                <div class="user-info">
                    <div class="user-name">${sessionScope.employeeName}</div>
                    <span class="user-role-badge">ID: ${sessionScope.employeeId}</span>
                </div>
            </div>

            <!-- Sidebar Nav Links -->
            <nav class="sidebar-nav">
                <div class="nav-section-title">Navigation Menu</div>
                
                <a href="EmployeeDashboardServlet" class="nav-item">
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

                <a href="LeaveHistoryServlet" class="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
                    <span>Leave History</span>
                </a>

                <a href="profile.jsp" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Profile</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <a href="LogoutServlet" class="logout-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Log Out</span>
                </a>
            </div>
        </aside>

        <!-- MAIN VIEW -->
        <main class="app-main">
            <header class="top-bar">
                <div class="top-bar-left">
                    <h1>My Leave History & Status</h1>
                    <p>Track all submitted applications and real-time manager approval statuses</p>
                </div>
                <div class="top-bar-right">
                    <a href="apply-leave.jsp" class="btn btn-primary btn-sm">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Application
                    </a>
                </div>
            </header>

            <div class="page-container">

                <!-- Summary Status Pills -->
                <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 20px; font-size: 13px;">
                        Total Applied: <strong style="color: var(--primary-blue); font-size: 16px;">${totalLeaves}</strong>
                    </div>
                    <div style="background: white; border: 1px solid var(--status-pending-border); border-radius: var(--radius-md); padding: 12px 20px; font-size: 13px;">
                        Pending Review: <strong style="color: var(--status-pending-text); font-size: 16px;">${pendingCount}</strong>
                    </div>
                    <div style="background: white; border: 1px solid var(--status-approved-border); border-radius: var(--radius-md); padding: 12px 20px; font-size: 13px;">
                        Approved: <strong style="color: var(--status-approved-text); font-size: 16px;">${approvedCount}</strong>
                    </div>
                    <div style="background: white; border: 1px solid var(--status-rejected-border); border-radius: var(--radius-md); padding: 12px 20px; font-size: 13px;">
                        Rejected: <strong style="color: var(--status-rejected-text); font-size: 16px;">${rejectedCount}</strong>
                    </div>
                </div>

                <!-- LEAVE APPLICATIONS TABLE USING JSTL -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            Submitted Leave Applications (Employee: ${sessionScope.employeeName} &bull; ${sessionScope.employeeId})
                        </div>
                    </div>

                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>App ID</th>
                                        <th>Employee Name</th>
                                        <th>Leave Type</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th>Approval Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <%-- Dynamic display using JSTL <c:choose> and <c:forEach> tags --%>
                                    <c:choose>
                                        <c:when test="${not empty leaveList}">
                                            <c:forEach var="app" items="${leaveList}">
                                                <tr>
                                                    <td><strong style="color: var(--lavender-primary);">#LA-${app.leaveId}</strong></td>
                                                    <td><strong>${app.employeeName}</strong></td>
                                                    <td>
                                                        <span class="badge badge-outline">${app.leaveType}</span>
                                                    </td>
                                                    <td>${app.fromDate}</td>
                                                    <td>${app.toDate}</td>
                                                    <td><strong>${app.numberOfDays}</strong> d</td>
                                                    <td style="max-width: 250px; font-size: 13px; color: var(--text-secondary);" title="${app.reason}">
                                                        ${app.reason}
                                                    </td>
                                                    <td>
                                                        <%-- JSTL choose/when/otherwise for Pending, Approved, Rejected labels --%>
                                                        <c:choose>
                                                            <c:when test="${app.status eq 'Approved'}">
                                                                <span class="badge badge-approved">
                                                                    <span class="badge-dot"></span> Approved
                                                                </span>
                                                            </c:when>
                                                            <c:when test="${app.status eq 'Rejected'}">
                                                                <span class="badge badge-rejected">
                                                                    <span class="badge-dot"></span> Rejected
                                                                </span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="badge badge-pending">
                                                                    <span class="badge-dot"></span> Pending
                                                                </span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="8" class="empty-state">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                                    <h4>No leave applications found</h4>
                                                    <p>You have not submitted any leave applications yet.</p>
                                                    <a href="apply-leave.jsp" class="btn btn-primary btn-sm" style="margin-top: 14px;">Apply for Leave</a>
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
