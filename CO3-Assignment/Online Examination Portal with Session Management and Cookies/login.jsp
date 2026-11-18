<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.http.Cookie" %>
<%
    // Server-side Cookie Extraction
    String rememberedUser = "";
    String preferredLang = "English";
    boolean hasRememberedCookie = false;

    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie c : cookies) {
            if ("rememberedUser".equals(c.getName())) {
                rememberedUser = c.getValue();
                hasRememberedCookie = (rememberedUser != null && !rememberedUser.trim().isEmpty());
            } else if ("preferredLang".equals(c.getName())) {
                preferredLang = c.getValue();
            }
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Login (JSP) | Online Examination Portal</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="app-container">
  <!-- Professional Sidebar Navigation -->
  <aside class="app-sidebar" id="appSidebar">
    <div class="sidebar-header">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <div>
        <div class="brand-title">EduExam Portal</div>
        <span class="brand-badge">JSP Session Active</span>
      </div>
    </div>

    <!-- Student Guest Status -->
    <div class="sidebar-user">
      <div class="user-avatar" style="background: var(--primary);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="user-info">
        <div class="user-name"><%= hasRememberedCookie ? rememberedUser : "Guest Student" %></div>
        <div class="user-status" style="color: var(--text-muted);">
          <span><%= hasRememberedCookie ? "Cookie Detected" : "Not Logged In" %></span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-title">Navigation</div>
      
      <a href="index.html" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home / Welcome</span>
      </a>

      <a href="login.jsp" class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        <span>Student Login</span>
      </a>

      <div class="nav-section-title">Examination</div>

      <a href="dashboard.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Student Dashboard</span>
      </a>

      <a href="instructions.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span>Exam Instructions</span>
      </a>

      <div class="nav-section-title">Technology Showcase</div>

      <a href="session-demo.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
        <span>Session vs Cookies Demo</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="session-indicator-box">
        <strong>Session Timeout: 5 min</strong>
        HttpSession &amp; Cookie Guard Active
      </div>
    </div>
  </aside>

  <!-- Main Viewport -->
  <main class="app-main">
    <header class="top-header">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button class="mobile-nav-toggle" onclick="toggleSidebar()" aria-label="Toggle Sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="header-breadcrumbs">
          <span>Portal</span>
          <span>/</span>
          <span class="current-page">Student Authentication (JSP)</span>
        </div>
      </div>
      <div class="header-actions">
        <a href="index.html" class="btn btn-secondary btn-sm">&larr; Back to Home</a>
      </div>
    </header>

    <div class="content-body">
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-header-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h1 class="login-title">Student Portal Login</h1>
          <p class="login-subtitle">Authenticate with Java Servlet &amp; HttpSession</p>

          <!-- Server-side feedback alerts -->
          <% if ("invalid".equals(request.getParameter("error"))) { %>
            <div class="alert alert-danger">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <div><strong>Invalid Credentials!</strong> Incorrect username or password. Try student101 / student123.</div>
            </div>
          <% } else if ("unauthorized".equals(request.getParameter("error"))) { %>
            <div class="alert alert-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <div><strong>Authentication Required!</strong> Please log in to access protected portal pages.</div>
            </div>
          <% } else if ("session_expired".equals(request.getParameter("error"))) { %>
            <div class="alert alert-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div><strong>Session Expired!</strong> Inactive for 5 minutes. Server session was automatically invalidated.</div>
            </div>
          <% } else if ("success".equals(request.getParameter("logout"))) { %>
            <div class="alert alert-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <div><strong>Logged Out!</strong> Active server HttpSession destroyed. Remembered cookies preserved.</div>
            </div>
          <% } else if ("cleared".equals(request.getParameter("logout"))) { %>
            <div class="alert alert-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <div><strong>Logged Out &amp; Cleared!</strong> Server session invalidated and all browser cookies cleared.</div>
            </div>
          <% } %>

          <!-- Cookie Detected Notice -->
          <% if (hasRememberedCookie) { %>
            <div class="alert alert-info" style="font-size: 0.84rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>Cookie Found: Username <strong><%= rememberedUser %></strong> automatically restored!</div>
            </div>
          <% } %>

          <!-- Login Form (POST to LoginServlet) -->
          <form action="LoginServlet" method="POST" id="loginForm">
            <!-- Username Input -->
            <div class="form-group">
              <label for="username" class="form-label">Student Username</label>
              <input type="text" id="username" name="username" class="form-control" 
                     value="<%= rememberedUser %>" 
                     placeholder="e.g. student101" required autocomplete="username">
            </div>

            <!-- Password Input -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" name="password" class="form-control" 
                     placeholder="Enter your password" required autocomplete="current-password">
            </div>

            <!-- Preferred Language Selection -->
            <div class="form-group">
              <label for="language" class="form-label">Preferred Examination Language</label>
              <select id="language" name="language" class="form-control">
                <option value="English" <%= "English".equalsIgnoreCase(preferredLang) ? "selected" : "" %>>English</option>
                <option value="Tamil" <%= "Tamil".equalsIgnoreCase(preferredLang) ? "selected" : "" %>>Tamil (தமிழ்)</option>
              </select>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="form-group" style="display: flex; align-items: center; justify-content: space-between;">
              <label class="form-checkbox">
                <input type="checkbox" id="rememberMe" name="rememberMe" <%= hasRememberedCookie ? "checked" : "" %>>
                <span>Remember Me (HTTP Cookie)</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Login to Examination Portal
            </button>
          </form>

          <!-- Sample Credentials Banner -->
          <div class="demo-credentials-box">
            <strong>Sample Demonstration Credentials:</strong><br>
            Username: <code>student101</code> &bull; Password: <code>student123</code><br>
            <button type="button" class="autofill-btn" onclick="fillSampleCredentials()">
              &#9889; Auto-Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<script src="js/exam.js"></script>
</body>
</html>
