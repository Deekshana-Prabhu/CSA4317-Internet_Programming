<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Session Authentication Verification
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
    <title>Apply Leave - EMPLOYEE ATTENDANCE AND LEAVE MANAGEMENT SYSTEM</title>
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

            <!-- Employee Info -->
            <div class="sidebar-user">
                <div class="user-avatar">${sessionScope.employeeName.substring(0, 1)}</div>
                <div class="user-info">
                    <div class="user-name">${sessionScope.employeeName}</div>
                    <span class="user-role-badge">ID: ${sessionScope.employeeId}</span>
                </div>
            </div>

            <!-- Sidebar Nav Links -->
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

                <a href="apply-leave.jsp" class="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <span>Apply Leave</span>
                </a>

                <a href="LeaveHistoryServlet" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
                    <span>Leave History</span>
                </a>

                <a href="profile.jsp" class="nav-item">
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
                    <h1>Submit Leave Application</h1>
                    <p>Request time off with real-time status updates</p>
                </div>
                <div class="top-bar-right">
                    <a href="LeaveHistoryServlet" class="btn btn-outline btn-sm">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
                        View Leave History
                    </a>
                </div>
            </header>

            <div class="page-container">

                <!-- Alert Messages via JSTL <c:if> -->
                <c:if test="${not empty successMessage}">
                    <div class="alert alert-success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <div>
                            <strong>Application Submitted!</strong>
                            <p>${successMessage}</p>
                        </div>
                    </div>
                </c:if>

                <c:if test="${not empty errorMessage}">
                    <div class="alert alert-danger">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <div>
                            <strong>Validation Error:</strong>
                            <p>${errorMessage}</p>
                        </div>
                    </div>
                </c:if>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
                    
                    <!-- LEAVE APPLICATION FORM -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                Leave Application Form
                            </div>
                            <span class="badge badge-pending"><span class="badge-dot"></span> Status: Pending Approval</span>
                        </div>

                        <div class="card-body">
                            <!-- Leave application submitted using POST method as required -->
                            <form action="LeaveApplicationServlet" method="POST" id="leaveForm" onsubmit="return validateLeaveForm()">
                                
                                <div class="form-row">
                                    <!-- Employee ID (Read-only) -->
                                    <div class="form-group">
                                        <label class="form-label" for="employeeId">Employee ID</label>
                                        <input type="text" id="employeeId" name="employeeId" class="form-control" value="${sessionScope.employeeId}" readonly>
                                    </div>

                                    <!-- Employee Name (Read-only) -->
                                    <div class="form-group">
                                        <label class="form-label" for="employeeName">Employee Name</label>
                                        <input type="text" id="employeeName" name="employeeName" class="form-control" value="${sessionScope.employeeName}" readonly>
                                    </div>
                                </div>

                                <!-- Leave Type -->
                                <div class="form-group">
                                    <label class="form-label" for="leaveType">
                                        Leave Type <span class="required">*</span>
                                    </label>
                                    <select id="leaveType" name="leaveType" class="form-control" required>
                                        <option value="" disabled selected>-- Select Leave Type --</option>
                                        <option value="Casual Leave" ${leaveType eq 'Casual Leave' ? 'selected' : ''}>Casual Leave (Short-term / Personal work)</option>
                                        <option value="Medical Leave" ${leaveType eq 'Medical Leave' ? 'selected' : ''}>Medical Leave (Health / Medical reasons)</option>
                                        <option value="Earned Leave" ${leaveType eq 'Earned Leave' ? 'selected' : ''}>Earned Leave (Planned annual vacation)</option>
                                    </select>
                                </div>

                                <div class="form-row">
                                    <!-- From Date -->
                                    <div class="form-group">
                                        <label class="form-label" for="fromDate">
                                            From Date <span class="required">*</span>
                                        </label>
                                        <input type="date" 
                                               id="fromDate" 
                                               name="fromDate" 
                                               class="form-control" 
                                               value="${fromDate}" 
                                               required 
                                               onchange="handleDateChange()">
                                        <span class="form-hint">Start date (past dates not permitted)</span>
                                    </div>

                                    <!-- To Date -->
                                    <div class="form-group">
                                        <label class="form-label" for="toDate">
                                            To Date <span class="required">*</span>
                                        </label>
                                        <input type="date" 
                                               id="toDate" 
                                               name="toDate" 
                                               class="form-control" 
                                               value="${toDate}" 
                                               required 
                                               onchange="handleDateChange()">
                                        <span class="form-hint">Must be on or after start date</span>
                                    </div>

                                    <!-- Number of Days (Calculated) -->
                                    <div class="form-group">
                                        <label class="form-label" for="numberOfDays">Number of Days</label>
                                        <input type="number" 
                                               id="numberOfDays" 
                                               name="numberOfDays" 
                                               class="form-control" 
                                               value="1" 
                                               min="1" 
                                               readonly 
                                               style="background-color: var(--light-blue-bg); font-weight: 700; color: var(--primary-blue);">
                                        <span class="form-hint">Calculated automatically</span>
                                    </div>
                                </div>

                                <!-- Reason for Leave -->
                                <div class="form-group">
                                    <label class="form-label" for="reason">
                                        Reason for Leave <span class="required">*</span>
                                    </label>
                                    <textarea id="reason" 
                                              name="reason" 
                                              class="form-control" 
                                              placeholder="Provide specific details regarding the leave request..." 
                                              required>${reason}</textarea>
                                </div>

                                <div style="display: flex; gap: 12px; margin-top: 10px;">
                                    <button type="submit" class="btn btn-primary" style="padding: 12px 24px;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                        Submit Leave Request
                                    </button>
                                    <button type="reset" class="btn btn-outline" onclick="resetForm()">
                                        Clear Form
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                    <!-- LEAVE POLICY & BALANCE SIDEBAR CARD -->
                    <div>
                        <div class="card">
                            <div class="card-header">
                                <div class="card-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    Leave Policies
                                </div>
                            </div>
                            <div class="card-body" style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                <div style="margin-bottom: 16px;">
                                    <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Casual Leave (CL)</strong>
                                    Permitted up to 2-3 consecutive days for urgent personal matters.
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Medical Leave (ML)</strong>
                                    For health recovery or doctor appointments. Requires medical note for &gt; 3 days.
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Earned Leave (EL)</strong>
                                    Planned vacation time; should ideally be requested at least 3 days in advance.
                                </div>
                                <div style="background-color: var(--soft-lavender-bg); border: 1px solid var(--soft-lavender-border); padding: 12px; border-radius: var(--radius-md); font-size: 12px; color: var(--lavender-primary); font-weight: 500;">
                                    <strong>Note:</strong> All leave requests are submitted with an initial status of <strong>Pending</strong> and must be approved by the Administrator.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    </div>

    <!-- CLIENT-SIDE VALIDATION & AUTOMATIC DAY CALCULATION SCRIPT -->
    <script>
        // Set min date of fromDate and toDate to today
        (function setMinDates() {
            var today = new Date().toISOString().split('T')[0];
            var fromInput = document.getElementById("fromDate");
            var toInput = document.getElementById("toDate");
            fromInput.min = today;
            toInput.min = today;
            if (!fromInput.value) {
                fromInput.value = today;
                toInput.value = today;
            }
            handleDateChange();
        })();

        function handleDateChange() {
            var fromInput = document.getElementById("fromDate");
            var toInput = document.getElementById("toDate");
            var daysInput = document.getElementById("numberOfDays");

            if (fromInput.value) {
                toInput.min = fromInput.value;
            }

            if (fromInput.value && toInput.value) {
                var d1 = new Date(fromInput.value);
                var d2 = new Date(toInput.value);

                if (d2 >= d1) {
                    var diffTime = Math.abs(d2 - d1);
                    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    daysInput.value = diffDays;
                } else {
                    daysInput.value = 0;
                }
            }
        }

        function validateLeaveForm() {
            var leaveType = document.getElementById("leaveType").value;
            var fromDate = document.getElementById("fromDate").value;
            var toDate = document.getElementById("toDate").value;
            var reason = document.getElementById("reason").value.trim();
            var today = new Date().toISOString().split('T')[0];

            if (!leaveType) {
                alert("Please select a Leave Type.");
                return false;
            }

            if (!fromDate || !toDate) {
                alert("Please select both 'From Date' and 'To Date'.");
                return false;
            }

            if (fromDate < today) {
                alert("The 'From Date' cannot be in the past. Please choose today or a future date.");
                return false;
            }

            if (toDate < fromDate) {
                alert("The 'To Date' cannot be earlier than the 'From Date'.");
                return false;
            }

            if (reason === "") {
                alert("Please enter a reason for your leave request.");
                return false;
            }

            return true;
        }

        function resetForm() {
            setTimeout(function() {
                var today = new Date().toISOString().split('T')[0];
                document.getElementById("fromDate").value = today;
                document.getElementById("toDate").value = today;
                handleDateChange();
            }, 50);
        }
    </script>
</body>
</html>
