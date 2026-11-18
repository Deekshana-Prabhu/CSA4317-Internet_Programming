<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HEALTHCARE – HOSPITAL APPOINTMENT PORTAL</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/style.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body class="welcome-page">

    <!-- Header Navigation -->
    <header class="welcome-header">
        <a href="${pageContext.request.contextPath}/index.jsp" class="hospital-brand">
            <div class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 6v12M6 12h12"/>
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
                </svg>
            </div>
            <div class="brand-text">
                <h1>HEALTHCARE HOSPITAL</h1>
                <p>Multi-Speciality Appointment & Patient Care Portal</p>
            </div>
        </a>
        <div class="header-right-badges">
            <span class="date-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                24/7 Outpatient & Emergency Booking
            </span>
        </div>
    </header>

    <!-- Main Container -->
    <main class="welcome-container">
        
        <!-- Left: Hospital Info & Specialities -->
        <section class="hero-info">
            <div class="hero-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                Certified Clinical Excellence & Compassionate Care
            </div>
            <h2>Smart Healthcare, <span>Instant Doctor Consultations</span></h2>
            <p class="hero-description">
                Book in-person and specialist clinical consultations with senior doctors across leading medical disciplines. Manage appointments, track consultation history, and experience hassle-free digital healthcare.
            </p>

            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem;">
                Available Multi-Speciality Departments
            </h4>
            <div class="specialities-strip">
                <span class="spec-pill active">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Cardiology
                </span>
                <span class="spec-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>
                    Dermatology
                </span>
                <span class="spec-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L9 22h6l-.69-2.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/></svg>
                    Neurology
                </span>
                <span class="spec-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    Orthopaedics
                </span>
                <span class="spec-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                    Paediatrics
                </span>
                <span class="spec-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    General Medicine
                </span>
            </div>

            <div class="feature-cards-grid">
                <div class="feature-box">
                    <div class="feat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <h4>Real-time Slot Booking</h4>
                    <p>Select your preferred doctor, date, and exclusive time slot with zero double-booking.</p>
                </div>
                <div class="feature-box lavender">
                    <div class="feat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    </div>
                    <h4>Verified Specialists</h4>
                    <p>Qualified medical practitioners with full experience, qualification and transparent fees.</p>
                </div>
            </div>
        </section>

        <!-- Right: Authentication Card (Login / Register / Admin) -->
        <section class="auth-section">
            <div class="auth-card">
                
                <!-- Tab Controls -->
                <div class="auth-tabs">
                    <button type="button" class="auth-tab-btn ${activeTab == null || activeTab == 'login' ? 'active' : ''}" onclick="switchAuthTab('login')">
                        Patient Login
                    </button>
                    <button type="button" class="auth-tab-btn ${activeTab == 'register' ? 'active' : ''}" onclick="switchAuthTab('register')">
                        Patient Registration
                    </button>
                    <button type="button" class="auth-tab-btn admin-tab ${activeTab == 'admin' ? 'active' : ''}" onclick="switchAuthTab('admin')">
                        Admin Login
                    </button>
                </div>

                <div class="auth-body">

                    <!-- Error Alert -->
                    <c:if test="${not empty errorMessage or not empty param.error}">
                        <div class="alert alert-danger">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span><c:out value="${not empty errorMessage ? errorMessage : param.error}"/></span>
                        </div>
                    </c:if>

                    <!-- Success Alert -->
                    <c:if test="${not empty successMessage or not empty param.msg}">
                        <div class="alert alert-success">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span><c:out value="${not empty successMessage ? successMessage : param.msg}"/></span>
                        </div>
                    </c:if>

                    <!-- TAB 1: PATIENT LOGIN FORM -->
                    <div id="tab-login" class="auth-pane ${activeTab == null || activeTab == 'login' ? 'active' : ''}">
                        <div class="auth-title-row">
                            <h3>Patient Sign In</h3>
                            <p>Enter your registered email and password to access your dashboard.</p>
                        </div>
                        <form action="${pageContext.request.contextPath}/PatientLoginServlet" method="POST">
                            <div class="form-group">
                                <label for="loginEmail">Email Address <span class="required">*</span></label>
                                <input type="email" id="loginEmail" name="email" class="form-control" 
                                       placeholder="patient@example.com" 
                                       value="<c:out value="${not empty rememberedEmail ? rememberedEmail : (not empty loginEmail ? loginEmail : '')}"/>" 
                                       required autofocus>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password <span class="required">*</span></label>
                                <input type="password" id="loginPassword" name="password" class="form-control" 
                                       placeholder="Enter your password" required>
                            </div>
                            <div class="form-row" style="margin-bottom: 1.25rem; align-items: center;">
                                <label class="form-check">
                                    <input type="checkbox" name="rememberMe" value="true" ${rememberChecked != null ? 'checked' : ''}>
                                    Remember My Email
                                </label>
                                <div style="text-align: right;">
                                    <select name="preferredLanguage" class="form-control" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; width: auto; display: inline-block;">
                                        <option value="English" ${patientLang == 'English' ? 'selected' : ''}>English</option>
                                        <option value="Spanish" ${patientLang == 'Spanish' ? 'selected' : ''}>Español</option>
                                        <option value="French" ${patientLang == 'French' ? 'selected' : ''}>Français</option>
                                        <option value="Hindi" ${patientLang == 'Hindi' ? 'selected' : ''}>हिन्दी</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                Sign In to Portal
                            </button>
                            <div style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                                New patient? <a href="javascript:void(0)" onclick="switchAuthTab('register')" style="color: var(--primary); font-weight: 600;">Create an account</a>
                            </div>
                        </form>
                    </div>

                    <!-- TAB 2: PATIENT REGISTRATION FORM -->
                    <div id="tab-register" class="auth-pane ${activeTab == 'register' ? 'active' : ''}">
                        <div class="auth-title-row">
                            <h3>Patient Registration</h3>
                            <p>Register as a new patient to schedule appointments online.</p>
                        </div>
                        <form action="${pageContext.request.contextPath}/PatientRegisterServlet" method="POST" id="regForm">
                            <div class="form-group">
                                <label for="regFullName">Full Name <span class="required">*</span></label>
                                <input type="text" id="regFullName" name="name" class="form-control" 
                                       placeholder="e.g. Rajesh Kumar" 
                                       value="<c:out value="${regName != null ? regName : ''}"/>" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="regAge">Age <span class="required">*</span></label>
                                    <input type="number" id="regAge" name="age" class="form-control" 
                                           placeholder="Age" min="1" max="125" 
                                           value="<c:out value="${regAge != null ? regAge : ''}"/>" required>
                                </div>
                                <div class="form-group">
                                    <label for="regGender">Gender <span class="required">*</span></label>
                                    <select id="regGender" name="gender" class="form-control" required>
                                        <option value="">Select Gender</option>
                                        <option value="Male" ${regGender == 'Male' ? 'selected' : ''}>Male</option>
                                        <option value="Female" ${regGender == 'Female' ? 'selected' : ''}>Female</option>
                                        <option value="Other" ${regGender == 'Other' ? 'selected' : ''}>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="regEmailField">Email Address <span class="required">*</span></label>
                                    <input type="email" id="regEmailField" name="email" class="form-control" 
                                           placeholder="name@example.com" 
                                           value="<c:out value="${regEmail != null ? regEmail : ''}"/>" required>
                                </div>
                                <div class="form-group">
                                    <label for="regMobileField">Mobile Number <span class="required">*</span></label>
                                    <input type="tel" id="regMobileField" name="mobile" class="form-control" 
                                           placeholder="10-digit number" pattern="[0-9]{10}" maxlength="10" 
                                           value="<c:out value="${regMobile != null ? regMobile : ''}"/>" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="regAddressField">Address <span class="required">*</span></label>
                                <textarea id="regAddressField" name="address" class="form-control" 
                                          placeholder="Full residential address" rows="2" required><c:out value="${regAddress != null ? regAddress : ''}"/></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="regPass">Password <span class="required">*</span></label>
                                    <input type="password" id="regPass" name="password" class="form-control" 
                                           placeholder="Min 6 characters" minlength="6" required>
                                </div>
                                <div class="form-group">
                                    <label for="regConfirmPass">Confirm Password <span class="required">*</span></label>
                                    <input type="password" id="regConfirmPass" name="confirmPassword" class="form-control" 
                                           placeholder="Repeat password" minlength="6" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                                Register Patient Account
                            </button>
                        </form>
                    </div>

                    <!-- TAB 3: ADMINISTRATOR LOGIN FORM -->
                    <div id="tab-admin" class="auth-pane ${activeTab == 'admin' ? 'active' : ''}">
                        <div class="auth-title-row">
                            <h3 style="color: var(--lavender);">Hospital Administrator Portal</h3>
                            <p>Authorized medical administration and staff access only.</p>
                        </div>
                        <form action="${pageContext.request.contextPath}/AdminLoginServlet" method="POST">
                            <div class="form-group">
                                <label for="adminUsername">Administrator Username <span class="required">*</span></label>
                                <input type="text" id="adminUsername" name="username" class="form-control" 
                                       placeholder="e.g. admin" 
                                       value="<c:out value="${adminUsername != null ? adminUsername : ''}"/>" required>
                            </div>
                            <div class="form-group">
                                <label for="adminPassword">Administrator Password <span class="required">*</span></label>
                                <input type="password" id="adminPassword" name="password" class="form-control" 
                                       placeholder="Admin credentials" required>
                            </div>
                            <button type="submit" class="btn btn-lavender btn-block">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Sign In as Administrator
                            </button>
                            <div style="margin-top: 1rem; padding: 0.75rem; background: var(--lavender-bg); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--lavender);">
                                <strong>Default Administrator:</strong> Username: <code>admin</code> | Password: <code>admin123</code>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>

    </main>

    <script>
        function switchAuthTab(tab) {
            document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.auth-pane').forEach(pane => pane.classList.remove('active'));
            
            if (tab === 'login') {
                document.querySelectorAll('.auth-tab-btn')[0].classList.add('active');
                document.getElementById('tab-login').classList.add('active');
            } else if (tab === 'register') {
                document.querySelectorAll('.auth-tab-btn')[1].classList.add('active');
                document.getElementById('tab-register').classList.add('active');
            } else if (tab === 'admin') {
                document.querySelectorAll('.auth-tab-btn')[2].classList.add('active');
                document.getElementById('tab-admin').classList.add('active');
            }
        }
    </script>
</body>
</html>
