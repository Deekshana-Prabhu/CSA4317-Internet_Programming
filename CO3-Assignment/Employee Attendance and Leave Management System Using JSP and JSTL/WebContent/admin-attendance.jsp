<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Administrator Session Authentication Check
    if (session == null || session.getAttribute("adminUsername") == null) {
        response.sendRedirect("admin-login.jsp?error=unauthorized");
        return;
    }
%>
<%-- If loaded directly without servlet attributes, redirect to AttendanceServlet --%>
<c:if test="${empty attendanceList && empty totalCount}">
    <c:redirect url="AttendanceServlet?view=all" />
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Attendance Records - Administrator Console</title>
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

                <a href="AttendanceServlet?view=all" class="nav-item active">
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
                    <h1>Company Attendance Records</h1>
                    <p>Comprehensive roster of daily employee check-in and check-out logs</p>
                </div>
            </header>

            <div class="page-container">

                <!-- DATE & EMPLOYEE FILTER BAR -->
                <form action="AttendanceServlet" method="GET" class="filter-bar">
                    <input type="hidden" name="view" value="all">

                    <div class="filter-item">
                        <label class="form-label" for="empFilter">Filter by Employee</label>
                        <select id="empFilter" name="empFilter" class="form-control">
                            <option value="ALL" ${empFilter eq 'ALL' ? 'selected' : ''}>-- All Employees --</option>
                            <option value="EMP101" ${empFilter eq 'EMP101' ? 'selected' : ''}>EMP101 - John Doe</option>
                            <option value="EMP102" ${empFilter eq 'EMP102' ? 'selected' : ''}>EMP102 - Jane Smith</option>
                            <option value="EMP103" ${empFilter eq 'EMP103' ? 'selected' : ''}>EMP103 - Robert Brown</option>
                            <option value="EMP104" ${empFilter eq 'EMP104' ? 'selected' : ''}>EMP104 - Emily Davis</option>
                            <option value="EMP105" ${empFilter eq 'EMP105' ? 'selected' : ''}>EMP105 - Michael Wilson</option>
                        </select>
                    </div>

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
                            Apply Filter
                        </button>
                        <a href="AttendanceServlet?view=all" class="btn btn-outline">
                            Reset
                        </a>
                    </div>
                </form>

                <!-- Summary Counts -->
                <div style="display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 18px; font-size: 13px;">
                        Total Filtered Records: <strong style="color: var(--primary-blue); font-size: 15px;">${totalCount}</strong>
                    </div>
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 18px; font-size: 13px;">
                        Present Count: <strong style="color: #059669; font-size: 15px;">${presentCount}</strong>
                    </div>
                    <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px 18px; font-size: 13px;">
                        Absent Count: <strong style="color: #dc2626; font-size: 15px;">${absentCount}</strong>
                    </div>
                </div>

                <!-- TABLE OF ATTENDANCE LOGS WITH JSTL -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            All Attendance Records
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
                                        <th>Attendance Date</th>
                                        <th>Check-in Time</th>
                                        <th>Check-out Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:choose>
                                        <c:when test="${not empty attendanceList}">
                                            <c:forEach var="att" items="${attendanceList}" varStatus="loop">
                                                <tr>
                                                    <td>${loop.index + 1}</td>
                                                    <td><strong style="color: var(--primary-blue);">${att.employeeId}</strong></td>
                                                    <td><strong>${att.employeeName}</strong></td>
                                                    <td>${att.attendanceDate}</td>
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
                                                <td colspan="7" class="empty-state">
                                                    <h4>No attendance records found</h4>
                                                    <p>Try clearing or changing your filter criteria.</p>
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
