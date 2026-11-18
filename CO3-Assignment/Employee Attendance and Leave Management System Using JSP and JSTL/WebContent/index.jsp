<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMPLOYEE MANAGEMENT PORTAL - Attendance & Leave Management</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="portal-body">

    <!-- Top Navigation -->
    <header class="portal-nav">
        <div style="display: flex; align-items: center; gap: 12px;">
            <div class="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            <div>
                <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary); line-height: 1.1;">TechCorp Systems</h3>
                <span style="font-size: 11px; color: var(--lavender-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Enterprise Portal</span>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            <a href="employee-login.jsp" class="btn btn-outline btn-sm">Employee Portal</a>
            <a href="admin-login.jsp" class="btn btn-primary btn-sm">Admin Portal</a>
        </div>
    </header>

    <!-- Logout / Status Message if redirected -->
    <div style="max-width: 860px; margin: 10px auto 0 auto; padding: 0 24px;">
        <c:if test="${param.msg eq 'logged_out'}">
            <div class="alert alert-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                You have been safely logged out. Thank you!
            </div>
        </c:if>
    </div>

    <!-- Hero Section -->
    <main class="portal-hero">
        <div class="portal-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Smart Attendance & Leave Management
        </div>

        <h1 class="portal-title">EMPLOYEE MANAGEMENT PORTAL</h1>
        <p class="portal-subtitle">
            A unified, secure workplace platform for IT employees and administrators. 
            Track daily work attendance, submit leave applications, and streamline administrative approvals.
        </p>

        <!-- Role Portals Grid -->
        <div class="portal-cards">
            <!-- Employee Portal Card -->
            <div class="portal-card">
                <div class="portal-card-icon bg-blue-soft">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h3>Employee Login</h3>
                <p>
                    Access personal attendance logs, view monthly working stats, apply for leaves, and monitor approval status in real time.
                </p>
                <div class="credentials-pill" style="margin-bottom: 20px;">
                    <span>Demo Login:</span>
                    <strong>EMP101 / emp123</strong>
                </div>
                <a href="employee-login.jsp" class="btn btn-primary" style="width: 100%;">
                    Sign In as Employee
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>

            <!-- Administrator Portal Card -->
            <div class="portal-card">
                <div class="portal-card-icon bg-lavender-soft">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <h3>Administrator Login</h3>
                <p>
                    Manage enterprise employee records, review company-wide attendance rosters, and evaluate pending leave requests.
                </p>
                <div class="credentials-pill" style="margin-bottom: 20px;">
                    <span>Demo Login:</span>
                    <strong style="color: var(--lavender-primary);">admin / admin123</strong>
                </div>
                <a href="admin-login.jsp" class="btn btn-lavender" style="width: 100%;">
                    Sign In as Administrator
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>
        </div>

        <!-- Quick Feature Badges -->
        <div style="margin-top: 50px; display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; color: var(--text-secondary); font-size: 13px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Dynamic JSP & JSTL Core Tags
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                MySQL & PreparedStatement JDBC
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                HttpSession & Cookies Support
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Clean Vertical Sidebar Navigation
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer style="margin-top: auto; padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px; border-top: 1px solid var(--border-color); background-color: #ffffff;">
        EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM &copy; 2026 IT Company Portal. Built with JSP, JSTL, Servlets & MySQL.
    </footer>

</body>
</html>
