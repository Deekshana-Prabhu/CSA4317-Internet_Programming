<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Administrator Session Authentication Check
    if (session == null || session.getAttribute("adminUsername") == null) {
        response.sendRedirect("admin-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If loaded directly without servlet attributes, redirect to LeaveRequestsServlet --%>
<c:if test="${empty allLeaves && empty totalCount}">
    <c:redirect url="LeaveRequestsServlet" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leave Requests & Approvals - Administrator Console</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="app-wrapper">
        
        <!-- VERTICAL SIDEBAR -->
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

            <div class="sidebar-user">
                <div class="user-avatar" style="border-color: var(--soft-lavender-border); color: var(--lavender-primary);">
                    ${sessionScope.adminName.substring(0, 1)}
                </div>
                <div class="user-info">
                    <div class="user-name">${sessionScope.adminName}</div>
                    <span class="user-role-badge">Super Admin</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section-title">Admin Management</div>
                
                <a href="AdminDashboardServlet" class="nav-item">
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

                <a href="LeaveRequestsServlet" class="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Leave Requests</span>
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
                    <h1>Employee Leave Requests & Decision Portal</h1>
                    <p>Review leave applications, authorize absences, and update approval statuses</p>
                </div>
            </header>

            <div class="page-container">

                <!-- Alert Messages via JSTL <c:if> -->
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

                <!-- Metric Summary Badges -->
                <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 20px; font-size: 13px;">
                        Total Applications: <strong style="color: var(--primary-blue); font-size: 16px;">${totalCount}</strong>
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

                <!-- SECTION 1: PENDING LEAVE REQUESTS (ACTIONABLE) -->
                <div class="card" style="border-top: 4px solid var(--status-pending-border);">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            Pending Leave Requests Requiring Immediate Action (${pendingCount})
                        </div>
                    </div>

                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>App ID</th>
                                        <th>Employee Name</th>
                                        <th>Employee ID</th>
                                        <th>Leave Type</th>
                                        <th>Duration</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th style="text-align: center;">Decision Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty pendingLeaves}">
                                            <c:forEach var="app" items="${pendingLeaves}">
                                                <tr>
                                                    <td><strong style="color: var(--lavender-primary);">#LA-${app.leaveId}</strong></td>
                                                    <td><strong>${app.employeeName}</strong></td>
                                                    <td><span class="badge badge-outline">${app.employeeId}</span></td>
                                                    <td><span class="badge badge-outline">${app.leaveType}</span></td>
                                                    <td style="font-size: 13px;">${app.fromDate} to ${app.toDate}</td>
                                                    <td><strong>${app.numberOfDays}</strong> d</td>
                                                    <td style="max-width: 240px; font-size: 13px; color: var(--text-secondary);" title="${app.reason}">${app.reason}</td>
                                                    <td style="text-align: center; white-space: nowrap;">
                                                        <a href="LeaveApprovalServlet?leaveId=${app.leaveId}&action=approve&source=requests" 
                                                           class="btn btn-success btn-sm"
                                                           onclick="return confirm('Approve leave for ${app.employeeName}?')">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            Approve
                                                        </a>
                                                        <a href="LeaveApprovalServlet?leaveId=${app.leaveId}&action=reject&source=requests" 
                                                           class="btn btn-danger btn-sm"
                                                           onclick="return confirm('Reject leave for ${app.employeeName}?')">
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
                                                    <p>All leave applications have been processed.</p>
                                                </td>
                                            </tr>
                                        </c:otherwise>
                                    </c:choose>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- SECTION 2: ALL LEAVE APPLICATIONS (HISTORICAL LOG) -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            All Leave Applications History
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
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Action Override</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty allLeaves}">
                                            <c:forEach var="app" items="${allLeaves}">
                                                <tr>
                                                    <td><strong style="color: var(--lavender-primary);">#LA-${app.leaveId}</strong></td>
                                                    <td><strong>${app.employeeName}</strong> <span style="font-size: 11px; color: var(--text-muted);">(${app.employeeId})</span></td>
                                                    <td><span class="badge badge-outline">${app.leaveType}</span></td>
                                                    <td>${app.fromDate}</td>
                                                    <td>${app.toDate}</td>
                                                    <td>${app.numberOfDays} d</td>
                                                    <td style="max-width: 220px; font-size: 13px; color: var(--text-secondary);" title="${app.reason}">${app.reason}</td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${app.status eq 'Approved'}">
                                                                <span class="badge badge-approved"><span class="badge-dot"></span> Approved</span>
                                                            </c:when>
                                                            <c:when test="${app.status eq 'Rejected'}">
                                                                <span class="badge badge-rejected"><span class="badge-dot"></span> Rejected</span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="badge badge-pending"><span class="badge-dot"></span> Pending</span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${app.status eq 'Pending'}">
                                                                <a href="LeaveApprovalServlet?leaveId=${app.leaveId}&action=approve&source=requests" class="btn btn-success btn-sm">Approve</a>
                                                                <a href="LeaveApprovalServlet?leaveId=${app.leaveId}&action=reject&source=requests" class="btn btn-danger btn-sm">Reject</a>
                                                            </c:when>
                                                            <c:when test="${app.status eq 'Approved'}">
                                                                <a href="LeaveApprovalServlet?leaveId=${app.leaveId}&action=reject&source=requests" class="btn btn-outline btn-sm" onclick="return confirm('Revoke and mark as Rejected?')">Reject</a>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <a href="LeaveApprovalServlet?leaveId=${app.leaveId}&action=approve&source=requests" class="btn btn-outline btn-sm" onclick="return confirm('Change status to Approved?')">Approve</a>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="9" class="empty-state">
                                                    <p>No leave applications recorded in system.</p>
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
