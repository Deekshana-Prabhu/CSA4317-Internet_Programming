<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:if test="${empty sessionScope.admin}">
    <c:redirect url="/index.jsp?activeTab=admin&error=Administrator+login+required"/>
</c:if>
<c:if test="${empty totalDoctors}">
    <c:redirect url="/admin-dashboard"/>
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrator Dashboard - Healthcare Hospital</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/style.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

<div class="app-wrapper">
    
    <!-- VERTICAL SIDEBAR NAVIGATION (ADMIN THEME) -->
    <aside class="app-sidebar admin-theme">
        <div class="sidebar-header">
            <div class="sidebar-brand-icon" style="background: linear-gradient(135deg, var(--lavender) 0%, #4338ca 100%);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
            </div>
            <div>
                <div class="sidebar-brand-title">Hospital Admin</div>
                <div class="sidebar-brand-sub" style="color: var(--lavender);">Operations Center</div>
            </div>
        </div>

        <div class="sidebar-user-pill admin-pill">
            <div class="user-avatar-circle">
                <c:out value="${sessionScope.admin.username != null ? sessionScope.admin.username.charAt(0) : 'A'}"/>
            </div>
            <div style="overflow: hidden;">
                <div class="user-meta-name"><c:out value="${sessionScope.admin.fullName != null ? sessionScope.admin.fullName : sessionScope.admin.username}"/></div>
                <div class="user-meta-role">Admin ID #<c:out value="${sessionScope.admin.adminId}"/></div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="sidebar-nav-title">Management</div>
            
            <a href="${pageContext.request.contextPath}/admin.jsp" class="nav-item active">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
            </a>

            <a href="${pageContext.request.contextPath}/DoctorManagementServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                Manage Doctors
            </a>

            <a href="${pageContext.request.contextPath}/DoctorManagementServlet#addDoctorCard" class="nav-item">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Doctor
            </a>

            <a href="${pageContext.request.contextPath}/AppointmentManagementServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Manage Appointments
            </a>

            <a href="${pageContext.request.contextPath}/AppointmentManagementServlet?view=patients" class="nav-item">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Patient Details
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="${pageContext.request.contextPath}/LogoutServlet" class="logout-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Administrator Sign Out
            </a>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="app-main">
        <header class="app-topbar">
            <div class="topbar-page-info">
                <h2>Hospital Administration Console</h2>
                <p>Signed in as <strong><c:out value="${sessionScope.admin.username}"/></strong> (Administrator Privileges)</p>
            </div>
            <div class="topbar-actions">
                <a href="${pageContext.request.contextPath}/DoctorManagementServlet#addDoctorCard" class="btn btn-lavender btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add New Doctor
                </a>
            </div>
        </header>

        <div class="app-content">

            <!-- 4 Admin Metrics Cards -->
            <div class="stats-grid">
                
                <div class="stat-card blue">
                    <div class="stat-info">
                        <div class="stat-label">Total Doctors</div>
                        <div class="stat-value"><c:out value="${totalDoctors}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    </div>
                </div>

                <div class="stat-card green">
                    <div class="stat-info">
                        <div class="stat-label">Total Patients</div>
                        <div class="stat-value"><c:out value="${totalPatients}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                </div>

                <div class="stat-card lavender">
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
                        <div class="stat-label">Upcoming Consultations</div>
                        <div class="stat-value"><c:out value="${upcomingAppointments}"/></div>
                    </div>
                    <div class="stat-icon-wrap">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                </div>

            </div>

            <!-- Recent Appointments Table -->
            <div class="card-box">
                <div class="card-box-header">
                    <h3>Recent Patient Bookings Across Departments</h3>
                    <a href="${pageContext.request.contextPath}/AppointmentManagementServlet" class="btn btn-outline-primary btn-sm">
                        View & Manage All Bookings
                    </a>
                </div>
                <div class="card-box-body" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="hospital-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient Name</th>
                                    <th>Doctor Name</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty recentAppointments}">
                                        <c:forEach var="apt" items="${recentAppointments}">
                                            <tr>
                                                <td><strong><c:out value="${apt.appointmentId}"/></strong></td>
                                                <td>
                                                    <c:out value="${apt.patientName}"/><br>
                                                    <small style="color: var(--text-muted);"><c:out value="${apt.patientMobile}"/></small>
                                                </td>
                                                <td><c:out value="${apt.doctorName}"/></td>
                                                <td><span class="specialization-tag"><c:out value="${apt.specialization}"/></span></td>
                                                <td><c:out value="${apt.appointmentDate}"/></td>
                                                <td><c:out value="${apt.appointmentTime}"/></td>
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
                                                    <form action="${pageContext.request.contextPath}/AppointmentManagementServlet" method="POST" style="display: flex; gap: 0.35rem;">
                                                        <input type="hidden" name="action" value="updateStatus">
                                                        <input type="hidden" name="appointmentId" value="${apt.appointmentId}">
                                                        <select name="status" class="form-control" style="padding: 0.2rem 0.4rem; font-size: 0.75rem; width: auto;">
                                                            <option value="Confirmed" ${apt.status == 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                                                            <option value="Completed" ${apt.status == 'Completed' ? 'selected' : ''}>Completed</option>
                                                            <option value="Cancelled" ${apt.status == 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                                        </select>
                                                        <button type="submit" class="btn btn-primary btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Save</button>
                                                    </form>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <tr>
                                            <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                                                No appointments booked in the system yet.
                                            </td>
                                        </tr>
                                    </c:otherwise>
                                </c:choose>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Quick Management Shortcuts -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem;">
                    <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">Doctor Records</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Add new specialists, edit consultation fees, modify available days and working slots.</p>
                    <a href="${pageContext.request.contextPath}/DoctorManagementServlet" class="btn btn-outline-primary btn-sm">Manage Doctors</a>
                </div>
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem;">
                    <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">Appointment Management</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">View all scheduled bookings, update visit status to Completed, or handle cancellations.</p>
                    <a href="${pageContext.request.contextPath}/AppointmentManagementServlet" class="btn btn-outline-primary btn-sm">Manage Appointments</a>
                </div>
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem;">
                    <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">Patient Directory</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">View all registered patients, demographic data, phone numbers and communication addresses.</p>
                    <a href="${pageContext.request.contextPath}/AppointmentManagementServlet?view=patients" class="btn btn-outline-primary btn-sm">View Patients</a>
                </div>
            </div>

        </div>
    </main>

</div>

</body>
</html>
