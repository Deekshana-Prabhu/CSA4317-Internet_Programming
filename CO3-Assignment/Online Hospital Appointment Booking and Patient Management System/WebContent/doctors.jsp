<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:if test="${empty doctorList}">
    <c:redirect url="/DoctorServlet"/>
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Available Doctors - Healthcare Hospital</title>
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
                <div class="sidebar-brand-sub">Doctor Directory</div>
            </div>
        </div>

        <c:choose>
            <c:when test="${not empty sessionScope.patient}">
                <div class="sidebar-user-pill">
                    <div class="user-avatar-circle">
                        <c:out value="${sessionScope.patient.name != null ? sessionScope.patient.name.charAt(0) : 'P'}"/>
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
                    <a href="${pageContext.request.contextPath}/DoctorServlet" class="nav-item active">
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
            </c:when>
            <c:otherwise>
                <div class="sidebar-user-pill" style="background: var(--lavender-soft);">
                    <div class="user-avatar-circle" style="background: var(--lavender);">G</div>
                    <div>
                        <div class="user-meta-name">Guest Visitor</div>
                        <div class="user-meta-role">Browse Directory</div>
                    </div>
                </div>
                <nav class="sidebar-nav">
                    <a href="${pageContext.request.contextPath}/index.jsp" class="nav-item">
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Home / Login
                    </a>
                    <a href="${pageContext.request.contextPath}/DoctorServlet" class="nav-item active">
                        <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
                        View Doctors
                    </a>
                </nav>
            </c:otherwise>
        </c:choose>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="app-main">
        <header class="app-topbar">
            <div class="topbar-page-info">
                <h2>Multi-Speciality Hospital Doctors</h2>
                <p>Browse certified clinical specialists, qualifications, consultation hours and schedule appointments.</p>
            </div>
            <div class="topbar-actions">
                <a href="${pageContext.request.contextPath}/AppointmentBookingServlet" class="btn btn-primary btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Book Consultation
                </a>
            </div>
        </header>

        <div class="app-content">

            <!-- Filter Bar by Specialization -->
            <div class="doctor-filter-bar">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                    Department Filter:
                </div>
                <div class="filter-pills-row">
                    <a href="${pageContext.request.contextPath}/DoctorServlet?specialization=All" 
                       class="filter-btn ${selectedSpecialization == 'All' || empty selectedSpecialization ? 'active' : ''}">
                        All Departments
                    </a>
                    <c:forEach var="spec" items="${specializationList}">
                        <a href="${pageContext.request.contextPath}/DoctorServlet?specialization=${spec}" 
                           class="filter-btn ${selectedSpecialization == spec ? 'active' : ''}">
                            <c:out value="${spec}"/>
                        </a>
                    </c:forEach>
                </div>
            </div>

            <!-- Doctor Cards Grid -->
            <div class="doctors-grid">
                <c:choose>
                    <c:when test="${not empty doctorList}">
                        <c:forEach var="doc" items="${doctorList}">
                            <div class="doctor-card">
                                
                                <div class="doctor-card-header">
                                    <div class="doctor-avatar-circle">
                                        <c:choose>
                                            <c:when test="${doc.specialization == 'Cardiology'}">🫀</c:when>
                                            <c:when test="${doc.specialization == 'Dermatology'}">🩺</c:when>
                                            <c:when test="${doc.specialization == 'Neurology'}">🧠</c:when>
                                            <c:when test="${doc.specialization == 'Orthopaedics'}">🦴</c:when>
                                            <c:when test="${doc.specialization == 'Paediatrics'}">👶</c:when>
                                            <c:otherwise>👨‍⚕️</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="doctor-header-meta">
                                        <h3><c:out value="${doc.name}"/></h3>
                                        <span class="specialization-tag"><c:out value="${doc.specialization}"/></span>
                                    </div>
                                </div>

                                <div class="doctor-card-body">
                                    <div class="doc-info-row">
                                        <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                        <div>
                                            <span class="label">Qualification:</span>
                                            <strong><c:out value="${doc.qualification}"/></strong>
                                        </div>
                                    </div>

                                    <div class="doc-info-row">
                                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <div>
                                            <span class="label">Experience:</span>
                                            <strong><c:out value="${doc.experience}"/></strong>
                                        </div>
                                    </div>

                                    <div class="doc-info-row">
                                        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                                        <div>
                                            <span class="label">Available Days:</span>
                                            <span><c:out value="${doc.availableDays}"/></span>
                                        </div>
                                    </div>

                                    <div class="doc-info-row">
                                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <div>
                                            <span class="label">Slots:</span>
                                            <span style="font-size: 0.8rem; color: var(--text-muted);"><c:out value="${doc.availableTimeSlots}"/></span>
                                        </div>
                                    </div>

                                    <div class="doc-info-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border);">
                                        <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                        <div>
                                            <span class="label">Consultation:</span>
                                            <span class="fee-badge">₹<fmt:formatNumber value="${doc.fee}" pattern="#,##0.00"/></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="doctor-card-footer">
                                    <a href="${pageContext.request.contextPath}/AppointmentBookingServlet?doctorId=${doc.doctorId}" 
                                       class="btn btn-primary btn-block">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><polyline points="9 11 12 14 22 4"/></svg>
                                        Book Consultation
                                    </a>
                                </div>

                            </div>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <div style="grid-column: 1 / -1; background: #ffffff; padding: 3rem; text-align: center; border-radius: var(--radius-lg); border: 1px solid var(--border);">
                            <p style="color: var(--text-muted); font-size: 1.1rem;">No doctors found matching the selected specialization.</p>
                            <a href="${pageContext.request.contextPath}/DoctorServlet" class="btn btn-primary btn-sm" style="margin-top: 1rem;">View All Doctors</a>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>

        </div>
    </main>

</div>

</body>
</html>
