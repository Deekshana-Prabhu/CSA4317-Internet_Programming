<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    // Cookie management for Remember Me
    String rememberedUser = "";
    boolean isRemembered = false;
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie c : cookies) {
            if ("rememberEmployee".equals(c.getName()) && c.getValue() != null && !c.getValue().trim().isEmpty()) {
                rememberedUser = c.getValue().trim();
                isRemembered = true;
                break;
            }
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Login - EMPLOYEE MANAGEMENT PORTAL</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="auth-container">
        <div class="auth-card">
            
            <div class="auth-header">
                <div class="auth-brand-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h2>Employee Sign In</h2>
                <p>Welcome back! Access your attendance & leaves</p>
            </div>

            <!-- Sample Credentials Pill -->
            <div class="credentials-pill">
                <span>Sample Credentials:</span>
                <strong>EMP101 / emp123</strong>
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
                    <span>Please sign in first to access your employee dashboard.</span>
                </div>
            </c:if>

            <c:if test="${param.error eq 'session_expired'}">
                <div class="alert alert-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>Your session has expired. Please log in again.</span>
                </div>
            </c:if>

            <!-- Login Form -->
            <form action="EmployeeLoginServlet" method="POST" id="employeeLoginForm" onsubmit="return validateForm()">
                <div class="form-group">
                    <label class="form-label" for="username">
                        Employee ID / Username <span class="required">*</span>
                    </label>
                    <input type="text" 
                           id="username" 
                           name="username" 
                           class="form-control" 
                           placeholder="e.g. EMP101" 
                           value="${not empty enteredUsername ? enteredUsername : (not empty param.username ? param.username : (empty enteredUsername ? rememberedUser : ''))}" 
                           required 
                           autofocus>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">
                        Password <span class="required">*</span>
                    </label>
                    <input type="password" 
                           id="password" 
                           name="password" 
                           class="form-control" 
                           placeholder="Enter your password" 
                           required>
                </div>

                <!-- Remember Me Checkbox -->
                <label class="checkbox-group">
                    <input type="checkbox" name="rememberMe" id="rememberMe" value="true" <%= isRemembered ? "checked" : "" %>>
                    <span>Remember my Employee ID on this computer</span>
                </label>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 15px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                    Log In to Dashboard
                </button>
            </form>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-light); text-align: center; font-size: 13px; color: var(--text-secondary);">
                <span>Administrator account?</span> 
                <a href="admin-login.jsp" style="font-weight: 600; color: var(--lavender-primary); margin-left: 4px;">Sign in as Admin</a>
                <br>
                <a href="index.jsp" style="display: inline-block; margin-top: 12px; font-size: 12px; color: var(--text-muted);">
                    &larr; Back to Portal Home
                </a>
            </div>

        </div>
    </div>

    <script>
        function validateForm() {
            var user = document.getElementById("username").value.trim();
            var pass = document.getElementById("password").value.trim();
            if (user === "" || pass === "") {
                alert("Please enter both Employee ID and Password.");
                return false;
            }
            return true;
        }

        // Quick click on sample credentials to fill in
        document.querySelector(".credentials-pill").style.cursor = "pointer";
        document.querySelector(".credentials-pill").title = "Click to auto-fill sample credentials";
        document.querySelector(".credentials-pill").onclick = function() {
            document.getElementById("username").value = "EMP101";
            document.getElementById("password").value = "emp123";
        };
    </script>
</body>
</html>
