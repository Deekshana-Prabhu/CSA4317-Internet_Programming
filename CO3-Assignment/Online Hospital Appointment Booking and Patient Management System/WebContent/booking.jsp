<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:if test="${empty sessionScope.patient}">
    <c:redirect url="/index.jsp?error=Please+login+as+a+patient+to+book+an+appointment"/>
</c:if>
<c:if test="${empty doctorList}">
    <c:redirect url="/AppointmentBookingServlet"/>
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Doctor Consultation - Healthcare Hospital</title>
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
                <div class="sidebar-brand-sub">Book Appointment</div>
            </div>
        </div>

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
            <a href="${pageContext.request.contextPath}/DoctorServlet" class="nav-item">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                View Doctors
            </a>
            <a href="${pageContext.request.contextPath}/AppointmentBookingServlet" class="nav-item active">
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
                <h2>Appointment Consultation Booking</h2>
                <p>Select your specialist, choose an available date and time slot, and confirm your visit.</p>
            </div>
        </header>

        <div class="app-content">

            <!-- Alerts -->
            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span><c:out value="${errorMessage}"/></span>
                </div>
            </c:if>

            <div class="booking-layout">
                
                <!-- Left: Booking Form -->
                <div class="card-box">
                    <div class="card-box-header">
                        <h3>Schedule Your Consultation</h3>
                    </div>
                    <div class="card-box-body">
                        <form action="${pageContext.request.contextPath}/AppointmentBookingServlet" method="POST" id="bookingForm">
                            
                            <!-- Patient Name (Readonly from session) -->
                            <div class="form-group">
                                <label for="patientNameDisplay">Patient Name</label>
                                <input type="text" id="patientNameDisplay" class="form-control" 
                                       value="<c:out value="${sessionScope.patient.name}"/> (ID: #${sessionScope.patient.patientId})" 
                                       readonly style="background-color: #f8fafc; font-weight: 600;">
                            </div>

                            <!-- Doctor Selection -->
                            <div class="form-group">
                                <label for="doctorSelect">Select Specialist Doctor <span class="required">*</span></label>
                                <select id="doctorSelect" name="doctorId" class="form-control" required onchange="updateDoctorPreview()">
                                    <option value="">-- Choose a Doctor --</option>
                                    <c:forEach var="doc" items="${doctorList}">
                                        <option value="${doc.doctorId}" 
                                                data-spec="${doc.specialization}"
                                                data-qual="${doc.qualification}"
                                                data-exp="${doc.experience}"
                                                data-fee="${doc.fee}"
                                                data-days="${doc.availableDays}"
                                                ${selectedDoctorId == doc.doctorId ? 'selected' : ''}>
                                            <c:out value="${doc.name}"/> - <c:out value="${doc.specialization}"/> (Fee: ₹${doc.fee})
                                        </option>
                                    </c:forEach>
                                </select>
                            </div>

                            <!-- Appointment Date & Time Slot Row -->
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="appointmentDate">Appointment Date <span class="required">*</span></label>
                                    <input type="date" id="appointmentDate" name="appointmentDate" class="form-control" 
                                           min="${todayDate}" 
                                           value="<c:out value="${not empty selectedDate ? selectedDate : todayDate}"/>" 
                                           required>
                                    <small style="color: var(--text-muted); font-size: 0.75rem;">Past dates are restricted.</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="appointmentTime">Available Time Slot <span class="required">*</span></label>
                                    <select id="appointmentTime" name="appointmentTime" class="form-control" required>
                                        <option value="">-- Select Time Slot --</option>
                                        <c:forEach var="slot" items="${timeSlots}">
                                            <option value="${slot}" ${selectedTime == slot ? 'selected' : ''}>
                                                <c:out value="${slot}"/>
                                            </option>
                                        </c:forEach>
                                    </select>
                                    <small style="color: var(--text-muted); font-size: 0.75rem;">One patient per time slot.</small>
                                </div>
                            </div>

                            <!-- Reason for Consultation -->
                            <div class="form-group">
                                <label for="reason">Reason for Consultation / Symptoms</label>
                                <textarea id="reason" name="reason" class="form-control" rows="3" 
                                          placeholder="Describe symptoms, medical history or reason for your visit (e.g. routine cardiac checkup, skin rash, migraine)..."><c:out value="${enteredReason}"/></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block" style="padding: 0.85rem;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                Confirm Consultation Booking
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Right: Selected Doctor Preview Card & Duplicate Prevention Notice -->
                <div>
                    <div class="card-box" id="doctorPreviewCard" style="display: none;">
                        <div class="card-box-header" style="background: linear-gradient(135deg, var(--primary-soft) 0%, var(--lavender-soft) 100%);">
                            <h3 id="prevDocName" style="color: var(--text-main);">Doctor Information</h3>
                        </div>
                        <div class="card-box-body">
                            <div style="margin-bottom: 0.75rem;">
                                <span class="specialization-tag" id="prevDocSpec">Cardiology</span>
                            </div>
                            <div class="doc-info-row">
                                <span class="label">Qualification:</span>
                                <strong id="prevDocQual">-</strong>
                            </div>
                            <div class="doc-info-row">
                                <span class="label">Experience:</span>
                                <span id="prevDocExp">-</span>
                            </div>
                            <div class="doc-info-row">
                                <span class="label">Consultation:</span>
                                <span class="fee-badge" id="prevDocFee">₹0.00</span>
                            </div>
                            <div class="doc-info-row">
                                <span class="label">Clinic Days:</span>
                                <span id="prevDocDays">-</span>
                            </div>
                        </div>
                    </div>

                    <!-- Booking Policies Box -->
                    <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            Booking & Slot Guidelines
                        </h4>
                        <ul style="font-size: 0.85rem; color: var(--text-muted); padding-left: 1.25rem; line-height: 1.6;">
                            <li><strong>Duplicate Prevention:</strong> If a slot has already been scheduled by another patient, the system prevents double-booking.</li>
                            <li><strong>One Slot Per Patient:</strong> Patients cannot book the same doctor multiple times at the same date and time.</li>
                            <li><strong>Automatic Confirmation:</strong> A unique appointment reference number will be generated immediately.</li>
                            <li><strong>Cancellation Policy:</strong> Confirmed appointments can be cancelled anytime before the scheduled time slot.</li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    </main>

</div>

<script>
    function updateDoctorPreview() {
        const select = document.getElementById('doctorSelect');
        const card = document.getElementById('doctorPreviewCard');
        const selected = select.options[select.selectedIndex];

        if (selected && selected.value) {
            document.getElementById('prevDocName').innerText = selected.text.split(' - ')[0];
            document.getElementById('prevDocSpec').innerText = selected.getAttribute('data-spec') || '';
            document.getElementById('prevDocQual').innerText = selected.getAttribute('data-qual') || '';
            document.getElementById('prevDocExp').innerText = selected.getAttribute('data-exp') || '';
            document.getElementById('prevDocFee').innerText = '₹' + parseFloat(selected.getAttribute('data-fee') || '0').toFixed(2);
            document.getElementById('prevDocDays').innerText = selected.getAttribute('data-days') || '';
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }

    // Trigger on page load if pre-selected
    window.addEventListener('DOMContentLoaded', () => {
        updateDoctorPreview();
    });
</script>

</body>
</html>
