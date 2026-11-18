<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:if test="${empty sessionScope.admin}">
    <c:redirect url="/index.jsp?activeTab=admin&error=Admin+session+required"/>
</c:if>
<c:if test="${empty doctorList}">
    <c:redirect url="/DoctorManagementServlet"/>
</c:if>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Doctors - Healthcare Hospital Admin</title>
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
            
            <a href="${pageContext.request.contextPath}/admin.jsp" class="nav-item">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
            </a>

            <a href="${pageContext.request.contextPath}/DoctorManagementServlet" class="nav-item active">
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
                <h2>Doctor Directory & Management</h2>
                <p>Register new multi-speciality physicians, update fee schedules, or manage clinical staff.</p>
            </div>
            <div class="topbar-actions">
                <a href="#addDoctorCard" class="btn btn-lavender btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New Doctor Form
                </a>
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

            <!-- EDIT DOCTOR CARD (if edit requested) -->
            <c:if test="${not empty editDoctor}">
                <div class="card-box" style="border: 2px solid var(--primary-light);">
                    <div class="card-box-header" style="background: var(--primary-soft);">
                        <h3>Edit Doctor Record: <c:out value="${editDoctor.name}"/> (ID: #${editDoctor.doctorId})</h3>
                        <a href="${pageContext.request.contextPath}/DoctorManagementServlet" class="btn btn-outline-primary btn-sm">Cancel Edit</a>
                    </div>
                    <div class="card-box-body">
                        <form action="${pageContext.request.contextPath}/DoctorManagementServlet" method="POST">
                            <input type="hidden" name="action" value="edit">
                            <input type="hidden" name="doctorId" value="${editDoctor.doctorId}">

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Doctor Name <span class="required">*</span></label>
                                    <input type="text" name="name" class="form-control" value="<c:out value="${editDoctor.name}"/>" required>
                                </div>
                                <div class="form-group">
                                    <label>Specialization Department <span class="required">*</span></label>
                                    <input type="text" name="specialization" class="form-control" value="<c:out value="${editDoctor.specialization}"/>" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Qualification <span class="required">*</span></label>
                                    <input type="text" name="qualification" class="form-control" value="<c:out value="${editDoctor.qualification}"/>" required>
                                </div>
                                <div class="form-group">
                                    <label>Experience <span class="required">*</span></label>
                                    <input type="text" name="experience" class="form-control" value="<c:out value="${editDoctor.experience}"/>" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Consultation Fee (₹) <span class="required">*</span></label>
                                    <input type="number" step="0.01" name="fee" class="form-control" value="<c:out value="${editDoctor.fee}"/>" required>
                                </div>
                                <div class="form-group">
                                    <label>Available Days <span class="required">*</span></label>
                                    <input type="text" name="availableDays" class="form-control" value="<c:out value="${editDoctor.availableDays}"/>" required>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1.75rem;">
                                Save Doctor Updates
                            </button>
                        </form>
                    </div>
                </div>
            </c:if>

            <!-- DOCTOR LIST TABLE -->
            <div class="card-box">
                <div class="card-box-header">
                    <h3>Active Doctors Directory</h3>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">
                        Total: <strong><c:out value="${doctorList != null ? doctorList.size() : 0}"/></strong> Doctors
                    </span>
                </div>
                <div class="card-box-body" style="padding: 0;">
                    <div class="table-responsive">
                        <table class="hospital-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Doctor Name</th>
                                    <th>Department</th>
                                    <th>Qualification</th>
                                    <th>Experience</th>
                                    <th>Consultation Fee</th>
                                    <th>Available Days</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:choose>
                                    <c:when test="${not empty doctorList}">
                                        <c:forEach var="doc" items="${doctorList}">
                                            <tr>
                                                <td>#<c:out value="${doc.doctorId}"/></td>
                                                <td><strong><c:out value="${doc.name}"/></strong></td>
                                                <td><span class="specialization-tag"><c:out value="${doc.specialization}"/></span></td>
                                                <td><c:out value="${doc.qualification}"/></td>
                                                <td><c:out value="${doc.experience}"/></td>
                                                <td><span class="fee-badge">₹<fmt:formatNumber value="${doc.fee}" pattern="#,##0.00"/></span></td>
                                                <td><c:out value="${doc.availableDays}"/></td>
                                                <td>
                                                    <div style="display: flex; gap: 0.35rem;">
                                                        <a href="${pageContext.request.contextPath}/DoctorManagementServlet?editId=${doc.doctorId}" 
                                                           class="btn btn-outline-primary btn-sm">Edit</a>
                                                        
                                                        <form action="${pageContext.request.contextPath}/DoctorManagementServlet" method="POST" 
                                                              style="display:inline;" onsubmit="return confirm('Are you sure you want to delete doctor ${doc.name}?');">
                                                            <input type="hidden" name="action" value="delete">
                                                            <input type="hidden" name="doctorId" value="${doc.doctorId}">
                                                            <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:when>
                                    <c:otherwise>
                                        <tr>
                                            <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                                                No doctors found in the database.
                                            </td>
                                        </tr>
                                    </c:otherwise>
                                </c:choose>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ADD DOCTOR FORM -->
            <div class="card-box" id="addDoctorCard">
                <div class="card-box-header" style="background: var(--lavender-bg);">
                    <h3 style="color: var(--lavender);">Register New Doctor</h3>
                </div>
                <div class="card-box-body">
                    <form action="${pageContext.request.contextPath}/DoctorManagementServlet" method="POST">
                        <input type="hidden" name="action" value="add">

                        <div class="form-row">
                            <div class="form-group">
                                <label for="addDocName">Doctor Full Name <span class="required">*</span></label>
                                <input type="text" id="addDocName" name="name" class="form-control" placeholder="e.g. Dr. Preeti Varma" required>
                            </div>
                            <div class="form-group">
                                <label for="addDocSpec">Specialization Department <span class="required">*</span></label>
                                <select id="addDocSpec" name="specialization" class="form-control" required>
                                    <option value="">-- Select Specialization --</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopaedics">Orthopaedics</option>
                                    <option value="Paediatrics">Paediatrics</option>
                                    <option value="General Medicine">General Medicine</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="addDocQual">Medical Qualification <span class="required">*</span></label>
                                <input type="text" id="addDocQual" name="qualification" class="form-control" placeholder="e.g. MBBS, MD, DM" required>
                            </div>
                            <div class="form-group">
                                <label for="addDocExp">Clinical Experience <span class="required">*</span></label>
                                <input type="text" id="addDocExp" name="experience" class="form-control" placeholder="e.g. 10 Years" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="addDocFee">Consultation Fee (₹) <span class="required">*</span></label>
                                <input type="number" step="0.01" id="addDocFee" name="fee" class="form-control" placeholder="e.g. 750.00" min="1" required>
                            </div>
                            <div class="form-group">
                                <label for="addDocDays">Available Working Days <span class="required">*</span></label>
                                <input type="text" id="addDocDays" name="availableDays" class="form-control" placeholder="e.g. Monday - Friday" required>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-lavender" style="padding: 0.75rem 2rem;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Doctor Record
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </main>

</div>

</body>
</html>
