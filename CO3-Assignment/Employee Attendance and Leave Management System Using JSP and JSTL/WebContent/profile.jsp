<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Session validation
    if (session == null || session.getAttribute("employeeId") == null) {
        response.sendRedirect("employee-login.jsp?error=unauthorized");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Profile - EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM</title>
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

            <div class="sidebar-user">
                <div class="user-avatar">${sessionScope.employeeName.substring(0, 1)}</div>
                <div class="user-info">
                    <div class="user-name">${sessionScope.employeeName}</div>
                    <span class="user-role-badge">ID: ${sessionScope.employeeId}</span>
                </div>
            </div>

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

                <a href="LeaveHistoryServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
                    <span>Leave History</span>
                </a>

                <a href="profile.jsp" class="nav-item active">
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
                    <h1>Employee Profile</h1>
                    <p>Your official employment profile, department details, and account credentials</p>
                </div>
            </header>

            <div class="page-container">

                <div class="card" style="max-width: 800px;">
                    <div class="card-header" style="background: linear-gradient(135deg, var(--light-blue-bg), var(--soft-lavender-bg)); padding: 28px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="width: 72px; height: 72px; border-radius: 50%; background: #ffffff; border: 3px solid var(--primary-blue); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: var(--primary-blue); box-shadow: var(--shadow-md);">
                                ${sessionScope.employeeName.substring(0, 1)}
                            </div>
                            <div>
                                <h2 style="font-size: 22px; font-weight: 800; color: var(--text-primary);">${sessionScope.employeeName}</h2>
                                <p style="font-size: 14px; color: var(--text-secondary); margin-top: 2px;">
                                    ${sessionScope.department} &bull; <span class="badge badge-outline" style="background: white;">${sessionScope.employeeId}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                            
                            <div class="form-group">
                                <label class="form-label">Employee ID</label>
                                <input type="text" class="form-control" value="${sessionScope.employeeId}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" value="${sessionScope.employeeName}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="text" class="form-control" value="${sessionScope.email}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Department</label>
                                <input type="text" class="form-control" value="${sessionScope.department}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">System Username</label>
                                <input type="text" class="form-control" value="${sessionScope.employeeId}" readonly>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Employment Status</label>
                                <div style="padding-top: 8px;">
                                    <span class="badge badge-approved" style="font-size: 13px; padding: 6px 14px;">
                                        <span class="badge-dot"></span> Active Full-Time
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: var(--text-muted);">TechCorp IT Solutions &bull; Employee Attendance & Leave Management</span>
                            <a href="EmployeeDashboardServlet" class="btn btn-primary btn-sm">Return to Dashboard</a>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>

</body>
</html>
