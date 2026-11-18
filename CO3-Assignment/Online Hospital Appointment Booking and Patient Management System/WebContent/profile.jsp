<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    // Session authorization check
    Patient sessionPatient = (Patient) session.getAttribute("patient");
    if (sessionPatient == null) {
        response.sendRedirect(request.getContextPath() + "/index.jsp?error=Please+login+first");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile & Preferences - Healthcare Hospital</title>
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
                <div class="sidebar-brand-sub">My Profile</div>
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
            <a href="${pageContext.request.contextPath}/PatientProfileServlet" class="nav-item active">
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
                <h2>Patient Profile & Cookie Preferences</h2>
                <p>Manage personal contact details and persistent browser preferences.</p>
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

            <div class="card-box" style="max-width: 800px; margin: 0 auto;">
                <div class="card-box-header">
                    <h3>Personal Information & Settings</h3>
                </div>
                <div class="card-box-body">
                    <form action="${pageContext.request.contextPath}/PatientProfileServlet" method="POST">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="profName">Full Name <span class="required">*</span></label>
                                <input type="text" id="profName" name="name" class="form-control" 
                                       value="<c:out value="${sessionScope.patient.name}"/>" required>
                            </div>
                            <div class="form-group">
                                <label for="profEmail">Registered Email (Read Only)</label>
                                <input type="email" id="profEmail" class="form-control" 
                                       value="<c:out value="${sessionScope.patient.email}"/>" readonly style="background: #f8fafc;">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="profAge">Age <span class="required">*</span></label>
                                <input type="number" id="profAge" name="age" class="form-control" min="1" max="125" 
                                       value="<c:out value="${sessionScope.patient.age}"/>" required>
                            </div>
                            <div class="form-group">
                                <label for="profGender">Gender <span class="required">*</span></label>
                                <select id="profGender" name="gender" class="form-control" required>
                                    <option value="Male" ${sessionScope.patient.gender == 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${sessionScope.patient.gender == 'Female' ? 'selected' : ''}>Female</option>
                                    <option value="Other" ${sessionScope.patient.gender == 'Other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="profMobile">Mobile Number <span class="required">*</span></label>
                                <input type="tel" id="profMobile" name="mobile" class="form-control" pattern="[0-9]{10}" maxlength="10" 
                                       value="<c:out value="${sessionScope.patient.mobile}"/>" required>
                            </div>
                            <div class="form-group">
                                <label for="profLang">Preferred Language (Cookie Remembered)</label>
                                <select id="profLang" name="language" class="form-control">
                                    <option value="English" ${selectedLang == 'English' || sessionScope.preferredLang == 'English' ? 'selected' : ''}>English</option>
                                    <option value="Spanish" ${selectedLang == 'Spanish' || sessionScope.preferredLang == 'Spanish' ? 'selected' : ''}>Español</option>
                                    <option value="French" ${selectedLang == 'French' || sessionScope.preferredLang == 'French' ? 'selected' : ''}>Français</option>
                                    <option value="Hindi" ${selectedLang == 'Hindi' || sessionScope.preferredLang == 'Hindi' ? 'selected' : ''}>हिन्दी</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="profAddress">Residential Address</label>
                            <textarea id="profAddress" name="address" class="form-control" rows="3"><c:out value="${sessionScope.patient.address}"/></textarea>
                        </div>

                        <div style="background: var(--lavender-bg); border: 1px solid #ddd6fe; border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: var(--lavender);">
                            <strong>Privacy & Security Note:</strong> Account passwords are never stored in browser cookies. Only non-sensitive preference tokens (such as language and remember me email) are safely preserved.
                        </div>

                        <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            Save Profile Changes
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </main>

</div>

</body>
</html>
