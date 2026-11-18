<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%
    // Verify session
    Patient sessionPatient = (Patient) session.getAttribute("patient");
    if (sessionPatient == null) {
        response.sendRedirect(request.getContextPath() + "/index.jsp");
        return;
    }

    // Retrieve appointment from request or session
    Appointment apt = (Appointment) request.getAttribute("appointment");
    if (apt == null) {
        apt = (Appointment) session.getAttribute("latestAppointment");
        request.setAttribute("appointment", apt);
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - Healthcare Hospital</title>
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
                <div class="sidebar-brand-sub">Confirmation</div>
            </div>
        </div>

        <div class="sidebar-user-pill">
            <div class="user-avatar-circle">
                <c:out value="${sessionScope.patient.name.substring(0, 1)}"/>
            </div>
            <div style="overflow: hidden;">
                <div class="user-meta-name"><c:out value="${sessionScope.patient.name}"/></div>
                <div class="user-meta-role">Patient ID #<c:out value="${sessionScope.patient.patientId}"/></div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="sidebar-nav-title">Menu Options</div>
            <a href="${pageContext.request.contextPath}/patient.jsp" class="nav-item">
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

    <!-- MAIN CONTENT -->
    <main class="app-main">
        <header class="app-topbar">
            <div class="topbar-page-info">
                <h2>Booking Confirmation</h2>
                <p>Your appointment has been registered and confirmed in the hospital database.</p>
            </div>
            <div class="topbar-actions">
                <button type="button" onclick="window.print()" class="btn btn-outline-primary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print Receipt
                </button>
            </div>
        </header>

        <div class="app-content">

            <c:choose>
                <c:when test="${not empty appointment}">
                    <div class="receipt-card">
                        
                        <div class="receipt-header">
                            <div class="success-circle">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">Appointment Confirmed!</h3>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
                                Please present your unique Appointment ID at the hospital reception.
                            </p>
                            <div class="receipt-id-box">
                                <c:out value="${appointment.appointmentId}"/>
                            </div>
                        </div>

                        <div class="receipt-grid">
                            <div class="receipt-field">
                                <div class="label">Patient Full Name</div>
                                <div class="val"><c:out value="${appointment.patientName}"/></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Patient Contact</div>
                                <div class="val"><c:out value="${appointment.patientMobile}"/></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Consulting Doctor</div>
                                <div class="val"><c:out value="${appointment.doctorName}"/></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Department</div>
                                <div class="val"><span class="specialization-tag"><c:out value="${appointment.specialization}"/></span></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Scheduled Date</div>
                                <div class="val"><c:out value="${appointment.appointmentDate}"/></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Scheduled Time Slot</div>
                                <div class="val"><c:out value="${appointment.appointmentTime}"/></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Consultation Fee</div>
                                <div class="val"><span class="fee-badge">₹<fmt:formatNumber value="${appointment.fee}" pattern="#,##0.00"/></span></div>
                            </div>
                            <div class="receipt-field">
                                <div class="label">Booking Status</div>
                                <div class="val"><span class="badge badge-confirmed">Confirmed</span></div>
                            </div>
                        </div>

                        <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1.5rem;">
                            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem;">
                                Reason for Consultation
                            </div>
                            <div style="font-size: 0.9rem; color: var(--text-main);">
                                <c:out value="${appointment.reason != null && not empty appointment.reason ? appointment.reason : 'General Medical Consultation'}"/>
                            </div>
                        </div>

                        <div style="display: flex; gap: 1rem;">
                            <a href="${pageContext.request.contextPath}/patient.jsp" class="btn btn-primary" style="flex: 1;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                Return to Dashboard
                            </a>
                            <a href="${pageContext.request.contextPath}/MyAppointmentsServlet" class="btn btn-outline-primary" style="flex: 1;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                View My Appointments
                            </a>
                        </div>

                    </div>
                </c:when>
                <c:otherwise>
                    <div style="text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border);">
                        <h3>No Recent Booking Found</h3>
                        <p style="color: var(--text-muted); margin-top: 0.5rem;">You do not have an active booking session.</p>
                        <a href="${pageContext.request.contextPath}/AppointmentBookingServlet" class="btn btn-primary" style="margin-top: 1rem;">Book an Appointment</a>
                    </div>
                </c:otherwise>
            </c:choose>

        </div>
    </main>

</div>

</body>
</html>
