<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Administrator Session Authentication Check
    if (session == null || session.getAttribute("adminUsername") == null) {
        response.sendRedirect("admin-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If loaded directly without servlet attributes, redirect to EmployeeDetailsServlet --%>
<c:if test="${empty employeeList && empty totalEmployees}">
    <c:redirect url="EmployeeDetailsServlet" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Details - Administrator Console</title>
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

                <a href="EmployeeDetailsServlet" class="nav-item active">
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
                    <h1>Registered Employee Details</h1>
                    <p>Directory of staff members, contact information, and attendance summaries</p>
                </div>
                <div class="top-bar-right">
                    <span class="date-pill">Total Workforce: ${totalEmployees} Members</span>
                </div>
            </header>

            <div class="page-container">

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                            Registered IT Personnel Directory
                        </div>
                    </div>

                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Email Address</th>
                                        <th>Department</th>
                                        <th>Username</th>
                                        <th>Present / Absent</th>
                                        <th>Leave Balance</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty employeeList}">
                                            <c:forEach var="emp" items="${employeeList}">
                                                <tr>
                                                    <td><strong style="color: var(--primary-blue);">${emp.employeeId}</strong></td>
                                                    <td>
                                                        <div style="font-weight: 700; color: var(--text-primary);">${emp.employeeName}</div>
                                                    </td>
                                                    <td style="color: var(--text-secondary); font-size: 13px;">${emp.email}</td>
                                                    <td>
                                                        <span class="badge badge-outline" style="background-color: var(--light-blue-bg); border-color: var(--light-blue-border); color: var(--primary-blue);">
                                                            ${emp.department}
                                                        </span>
                                                    </td>
                                                    <td style="font-family: monospace; font-size: 13px; color: var(--text-secondary);">${emp.username}</td>
                                                    <td>
                                                        <span class="badge badge-present" style="font-size: 11px;">${emp.presentDays} P</span>
                                                        <span class="badge badge-absent" style="font-size: 11px; margin-left: 4px;">${emp.absentDays} A</span>
                                                    </td>
                                                    <td>
                                                        <strong style="color: var(--lavender-primary);">${emp.remainingLeaves}</strong>
                                                        <span style="font-size: 11px; color: var(--text-muted);">/ 20 days</span>
                                                    </td>
                                                    <td>
                                                        <a href="AttendanceServlet?empFilter=${emp.employeeId}&view=all" class="btn btn-outline btn-sm" title="View attendance logs for this employee">
                                                            View Logs
                                                        </a>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="8" class="empty-state">
                                                    <h4>No registered employees found</h4>
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
