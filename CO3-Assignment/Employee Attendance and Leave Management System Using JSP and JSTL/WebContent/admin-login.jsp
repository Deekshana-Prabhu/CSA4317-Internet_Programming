<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrator Login - EMPLOYEE MANAGEMENT PORTAL</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="auth-container">
        <div class="auth-card">
            
            <div class="auth-header">
                <div class="auth-brand-icon" style="background: linear-gradient(135deg, var(--lavender-primary), #4f46e5);">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <h2>Administrator Sign In</h2>
                <p>Enterprise Console & HR Approvals</p>
            </div>

            <!-- Sample Credentials Pill -->
            <div class="credentials-pill">
                <span>Sample Admin Credentials:</span>
                <strong style="color: var(--lavender-primary);">admin / admin123</strong>
            </div>

            <!-- Error Alerts -->
            <c:if test="${not empty errorMessage}">
                <div class="alert alert-danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>${errorMessage}</span>
                </div>
            </c:if>

            <c:if test="${param.error eq 'unauthorized'}">
                <div class="alert alert-danger">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>Please sign in as an Administrator to access the Admin Console.</span>
                </div>
            </c:if>

            <!-- Login Form -->
            <form action="AdminLoginServlet" method="POST" id="adminLoginForm" onsubmit="return validateAdminForm()">
                <div class="form-group">
                    <label class="form-label" for="username">
                        Admin Username <span class="required">*</span>
                    </label>
                    <input type="text" 
                           id="username" 
                           name="username" 
                           class="form-control" 
                           placeholder="e.g. admin" 
                           value="${not empty enteredUsername ? enteredUsername : (not empty param.username ? param.username : '')}" 
                           required 
                           autofocus>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">
                        Admin Password <span class="required">*</span>
                    </label>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           class="form-control" 
                           placeholder="Enter admin password" 
                           required>
                </div>

                <button type="submit" class="btn btn-lavender" style="width: 100%; padding: 12px; font-size: 15px; margin-top: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                    Log In to Admin Console
                </button>
            </form>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-light); text-align: center; font-size: 13px; color: var(--text-secondary);">
                <span>Employee account?</span> 
                <a href="employee-login.jsp" style="font-weight: 600; color: var(--primary-blue); margin-left: 4px;">Sign in as Employee</a>
                <br>
                <a href="index.jsp" style="display: inline-block; margin-top: 12px; font-size: 12px; color: var(--text-muted);">
                    &larr; Back to Portal Home
                </a>
            </div>

        </div>
    </div>

    <script>
        function validateAdminForm() {
            var user = document.getElementById("username").value.trim();
            var pass = document.getElementById("password").value.trim();
            if (user === "" || pass === "") {
                alert("Please enter both Administrator Username and Password.");
                return false;
            }
            return true;
        }

        // Quick click on sample credentials to fill in
        document.querySelector(".credentials-pill").style.cursor = "pointer";
        document.querySelector(".credentials-pill").title = "Click to auto-fill sample credentials";
        document.querySelector(".credentials-pill").onclick = function() {
            document.getElementById("username").value = "admin";
            document.getElementById("password").value = "admin123";
        };
    </script>
</body>
</html>
