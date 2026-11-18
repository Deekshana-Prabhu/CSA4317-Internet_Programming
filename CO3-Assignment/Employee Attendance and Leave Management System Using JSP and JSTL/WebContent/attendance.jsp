<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Session validation
    if (session == null || session.getAttribute("employeeId") == null) {
        response.sendRedirect("employee-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If attendanceList is missing (direct URL visit), redirect to AttendanceServlet --%>
<c:if test="${empty attendanceList && empty param.startDate}">
    <c:redirect url="AttendanceServlet" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Attendance - EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM</title>
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

            <!-- Nav Options -->
            <nav class="sidebar-nav">
                <div class="nav-section-title">Navigation Menu</div>
                
                <a href="EmployeeDashboardServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>Dashboard</span>
                </a>

                <a href="AttendanceServlet" class="nav-item active">
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
                    <h1>My Attendance Records</h1>
                    <p>Detailed daily log of working days, check-in, check-out, and status</p>
                </div>
                <div class="top-bar-right">
                    <a href="AttendanceServlet?action=mark_today" class="btn btn-primary btn-sm">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Check-in Today
                    </a>
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

                <c:if test="${not empty errorMessage}">
                    <div class="alert alert-danger">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <span>${errorMessage}</span>
                    </div>
                </c:if>

                <!-- DATE-WISE ATTENDANCE FILTER BAR -->
                <form action="AttendanceServlet" method="GET" class="filter-bar">
                    <div class="filter-item">
                        <label class="form-label" for="startDate">From Date</label>
                        <input type="date" id="startDate" name="startDate" class="form-control" value="${filterStartDate}">
                    </div>

                    <div class="filter-item">
                        <label class="form-label" for="endDate">To Date</label>
                        <input type="date" id="endDate" name="endDate" class="form-control" value="${filterEndDate}">
                    </div>

                    <div class="filter-actions">
                        <button type="submit" class="btn btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Filter Records
                        </button>
                        <a href="AttendanceServlet" class="btn btn-outline" title="Clear filter">
                            Reset
                        </a>
                    </div>
                </form>

                <!-- Summary Stats Bar -->
                <div style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 18px; font-size: 13px;">
                        Total Logged: <strong style="color: var(--primary-blue); font-size: 15px;">${totalCount}</strong> days
                    </div>
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 18px; font-size: 13px;">
                        Present: <strong style="color: #059669; font-size: 15px;">${presentCount}</strong> days
                    </div>
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 18px; font-size: 13px;">
                        Absent: <strong style="color: #dc2626; font-size: 15px;">${absentCount}</strong> days
                    </div>
                </div>

                <!-- ATTENDANCE TABLE WITH JSP AND JSTL -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Attendance Logs (Employee ID: ${sessionScope.employeeId})
                        </div>
                    </div>

                    <div class="card-body" style="padding: 0;">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Date</th>
                                        <th>Check-in Time</th>
                                        <th>Check-out Time</th>
                                        <th>Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <%-- JSTL <c:choose> and <c:forEach> to render records dynamically --%>
                                    <c:choose>
                                        <c:when test="${not empty attendanceList}">
                                            <c:forEach var="item" items="${attendanceList}" varStatus="loop">
                                                <tr>
                                                    <td>${loop.index + 1}</td>
                                                    <td><span class="badge badge-outline">${item.employeeId}</span></td>
                                                    <td><strong>${item.employeeName}</strong></td>
                                                    <td><strong>${item.attendanceDate}</strong></td>
                                                    <td>${item.formattedCheckIn}</td>
                                                    <td>${item.formattedCheckOut}</td>
                                                    <td>
                                                        <c:choose>
                                                            <c:when test="${item.status eq 'Present'}">
                                                                <span class="badge badge-present">
                                                                    <span class="badge-dot"></span> Present
                                                                </span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="badge badge-absent">
                                                                    <span class="badge-dot"></span> Absent
                                                                </span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="7" class="empty-state">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                    <h4>No attendance records found</h4>
                                                    <p>There are no attendance records matching your filter criteria.</p>
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
