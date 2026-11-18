<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:if test="${empty sessionScope.patient}">
    <c:redirect url="/index.jsp?error=Please+login+as+patient"/>
</c:if>
<c:if test="${empty totalAppointments}">
    <c:redirect url="/patient-dashboard"/>
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Dashboard - Healthcare Hospital</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/style.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

<div class="app-wrapper">
    
    <!-- VERTICAL SIDEBAR NAVIGATION -->
    <aside class="app-sidebar">
        <div class="sidebar-header">
            <div class="sidebar-brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 6v12M6 12h12"/>
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
                </svg>
            </div>
            <div>
                <div class="sidebar-brand-title">Healthcare Portal</div>
                <div class="sidebar-brand-sub">Patient Panel</div>
            </div>
        </div>

        <!-- Logged-in Patient Pill -->
        <div class="sidebar-user-pill">
            <div class="user-avatar-circle">
                <c:out value="${sessionScope.patient.name != null ? sessionScope.patient.name.charAt(0) : 'P'}"/>
            </div>
            <div style="overflow: hidden;">
                <div class="user-meta-name"><c:out value="${sessionScope.patient.name}"/></div>
                <div class="user-meta-role">Patient ID #<c:out value="${sessionScope.patient.patientId}"/></div>
            </div>
        </div>

        <!-- Vertical Navigation Links -->
        <nav class="sidebar-nav">
            <div class="sidebar-nav-title">Menu Options</div>
            
            <a href="${pageContext.request.contextPath}/patient.jsp" class="nav-item active">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
            </a>

            <a href="${pageContext.request.contextPath}/DoctorServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                View Doctors
            </a>

            <a href="${pageContext.request.contextPath}/AppointmentBookingServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
                Book Appointment
            </a>

            <a href="${pageContext.request.contextPath}/MyAppointmentsServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                My Appointments
            </a>

            <a href="${pageContext.request.contextPath}/PatientProfileServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                My Profile
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="${pageContext.request.contextPath}/LogoutServlet" class="logout-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
            </a>
        </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="app-main">
        
        <!-- Topbar -->
        <header class="app-topbar">
            <div class="topbar-page-info">
                <h2>Patient Dashboard</h2>
                <p>Welcome back, <strong><c:out value="${sessionScope.patient.name}"/></strong>! Here is your health overview.</p>
            </div>
            <div class="topbar-actions">
                <a href="${pageContext.request.contextPath}/AppointmentBookingServlet" class="btn btn-primary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Book New Consultation
                </a>
                <span class="date-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    Patient Session Active
                </span>
            </div>
        </header>

        <div class="app-content">

            <!-- Alerts -->
            <c:if test="${not empty successMessage}">
                <div class="alert alert-success">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span><c:out value="${successMessage}"/></span>
                </div>
            </c:if>
            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span><c:out value="${errorMessage}"/></span>
                </div>
            </c:if>

            <!-- 4 Dashboard Metric Cards -->
            <div class="stats-grid">
                
                <div class="stat-card blue">
                    <div class="stat-info">
                        <div class="stat-label">Total Appointments</div>
                        <div class="stat-value"><c:out value="${totalAppointments}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                </div>

                <div class="stat-card amber">
                    <div class="stat-info">
                        <div class="stat-label">Upcoming Appointments</div>
                        <div class="stat-value"><c:out value="${upcomingAppointments}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                </div>

                <div class="stat-card lavender">
                    <div class="stat-info">
                        <div class="stat-label">Completed Consultations</div>
                        <div class="stat-value"><c:out value="${completedAppointments}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                </div>

                <div class="stat-card green">
                    <div class="stat-info">
                        <div class="stat-label">Available Doctors</div>
                        <div class="stat-value"><c:out value="${availableDoctorsCount}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
                    </div>
                </div>

            </div>

            <!-- Recent Appointments Table Card -->
            <div class="card-box">
                <div class="card-box-header">
                    <h3>Recent Appointment Records</h3>
                    <a href="${pageContext.request.contextPath}/MyAppointmentsServlet" class="btn btn-outline-primary btn-sm">
                        View All Appointments
                    </a>
                </div>
                <div class="card-box-body" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="hospital-table">
                            <thead>
                                <tr>
                                    <th>Appointment ID</th>
                                    <th>Doctor Name</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Consultation Fee</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty recentAppointments}">
                                        <c:forEach var="apt" items="${recentAppointments}">
                                            <tr>
                                                <td><strong><c:out value="${apt.appointmentId}"/></strong></td>
                                                <td><c:out value="${apt.doctorName}"/></td>
                                                <td><span class="specialization-tag"><c:out value="${apt.specialization}"/></span></td>
                                                <td><c:out value="${apt.appointmentDate}"/></td>
                                                <td><c:out value="${apt.appointmentTime}"/></td>
                                                <td><span class="fee-badge">₹<fmt:formatNumber value="${apt.fee}" pattern="#,##0.00"/></span></td>
                                                <td>
                                                    <c:choose>
                                                        <c:when test="${apt.status == 'Confirmed'}">
                                                            <span class="badge badge-confirmed">Confirmed</span>
                                                        </c:when>
                                                        <c:when test="${apt.status == 'Completed'}">
                                                            <span class="badge badge-completed">Completed</span>
                                                        </c:when>
                                                        <c:otherwise>
                                                            <span class="badge badge-cancelled">Cancelled</span>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <c:if test="${apt.status == 'Confirmed'}">
                                                        <form action="${pageContext.request.contextPath}/MyAppointmentsServlet" method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to cancel this appointment?');">
                                                            <input type="hidden" name="action" value="cancel">
                                                            <input type="hidden" name="appointmentId" value="${apt.appointmentId}">
                                                            <button type="submit" class="btn btn-outline-danger btn-sm">Cancel</button>
                                                        </form>
                                                    </c:if>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <tr>
                                            <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                                                No appointments booked yet. <a href="${pageContext.request.contextPath}/AppointmentBookingServlet" style="color: var(--primary); font-weight: 600;">Book your first consultation today!</a>
                                            </td>
                                        </tr>
                                    </c:otherwise>
                                </c:choose>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Quick Access Specialties Banner -->
            <div style="background: linear-gradient(135deg, var(--primary-soft) 0%, var(--lavender-soft) 100%); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Looking for specialist medical care?</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Consult top doctors across Cardiology, Dermatology, Neurology, Orthopaedics, Paediatrics and General Medicine.</p>
                </div>
                <a href="${pageContext.request.contextPath}/DoctorServlet" class="btn btn-primary">
                    Browse All Specialists
                </a>
            </div>

        </div>
    </main>

</div>

</body>
</html>
