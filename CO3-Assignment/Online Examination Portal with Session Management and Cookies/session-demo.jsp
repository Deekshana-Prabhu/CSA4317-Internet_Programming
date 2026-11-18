<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.http.Cookie" %>
<%
    // Prevent browser caching
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);

    // Retrieve active session if present (do not create new session if unauthenticated)
    HttpSession currentSession = request.getSession(false);
    boolean hasActiveSession = (currentSession != null && currentSession.getAttribute("studentUser") != null);
    
    String sessionUser = hasActiveSession ? (String) currentSession.getAttribute("studentUser") : "No Active Session (Guest)";
    String sessionLang = hasActiveSession ? (String) currentSession.getAttribute("language") : "Not Set";
    String sessionId = hasActiveSession ? currentSession.getId() : "N/A";
    int maxInactive = hasActiveSession ? currentSession.getMaxInactiveInterval() : 0;
    
    java.util.Date creationTime = null;
    java.util.Date lastAccessedTime = null;
    if (hasActiveSession) {
        try {
            creationTime = new java.util.Date(currentSession.getCreationTime());
            lastAccessedTime = new java.util.Date(currentSession.getLastAccessedTime());
        } catch (IllegalStateException e) {
            hasActiveSession = false;
        }
    }

    // Retrieve Cookies from Request
    String cookieUsername = "None (Cookie not set or expired)";
    String cookieLang = "None (Cookie not set or expired)";
    boolean hasUserCookie = false;

    Cookie[] requestCookies = request.getCookies();
    if (requestCookies != null) {
        for (Cookie c : requestCookies) {
            if ("rememberedUser".equals(c.getName())) {
                cookieUsername = c.getValue();
                hasUserCookie = (cookieUsername != null && !cookieUsername.trim().isEmpty());
            } else if ("preferredLang".equals(c.getName())) {
                cookieLang = c.getValue();
            }
        }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Tracking Demonstration: Cookies vs HttpSession | EduExam Portal</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body onload="initSessionDemo(<%= maxInactive %>)">

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
        <span class="brand-badge">Tech Showcase</span>
      </div>
    </div>

    <!-- Active Student / Guest Info in Sidebar -->
    <div class="sidebar-user">
      <div class="user-avatar" style="background: <%= hasActiveSession ? "var(--accent-purple)" : "var(--primary)" %>;">
        <%= hasActiveSession ? sessionUser.substring(0, 1).toUpperCase() : "G" %>
      </div>
      <div class="user-info">
        <div class="user-name"><%= sessionUser %></div>
        <div class="user-status">
          <% if (hasActiveSession) { %>
            <span class="status-dot"></span>
            <span>Session Active</span>
          <% } else { %>
            <span style="color: var(--text-muted);">Guest / No Session</span>
          <% } %>
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

      <% if (hasActiveSession) { %>
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

        <a href="exam.jsp" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Take Online Exam</span>
        </a>
      <% } else { %>
        <a href="login.html" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>Student Login</span>
        </a>
      <% } %>

      <div class="nav-section-title">Technology Showcase</div>

      <a href="session-demo.jsp" class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
        <span>Session vs Cookies Demo</span>
      </a>

      <% if (hasActiveSession) { %>
        <div class="nav-section-title">Account</div>
        <a href="LogoutServlet" class="nav-item" style="color: var(--danger);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </a>
      <% } %>
    </nav>

    <div class="sidebar-footer">
      <div class="session-indicator-box">
        <strong>Session Tracking Demo</strong>
        Server vs Client Architecture
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
          <span>Technology</span>
          <span>/</span>
          <span class="current-page">Session Tracking Demonstration</span>
        </div>
      </div>
      <div class="header-actions">
        <a href="index.html" class="btn btn-secondary btn-sm">&larr; Home</a>
        <% if (hasActiveSession) { %>
          <a href="dashboard.jsp" class="btn btn-primary btn-sm">Dashboard</a>
        <% } else { %>
          <a href="login.html" class="btn btn-primary btn-sm">Login</a>
        <% } %>
      </div>
    </header>

    <div class="content-body">
      <!-- Title Card -->
      <div class="card" style="background: var(--gradient-soft); border-color: #e0e7ff;">
        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.35rem;">
          Session Tracking Demonstration
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Comparative analysis and live real-time inspection of <strong>HTTP Cookies</strong> (Client-Side) vs <strong>HttpSession</strong> (Server-Side).
        </p>
      </div>

      <!-- 10. LIVE DEMONSTRATION SECTION -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="12 6 12 12 16 14"></polygon>
              </svg>
              Live State Inspector
            </h2>
            <div class="card-subtitle">Real-time parameters extracted directly from current HTTP Request and Server Memory.</div>
          </div>
          <span id="sessionStatusBadge" class="badge" style="background: <%= hasActiveSession ? "var(--success-light)" : "var(--danger-light)" %>; color: <%= hasActiveSession ? "var(--success)" : "var(--danger)" %>; font-weight: 800; padding: 4px 12px; border-radius: var(--radius-full);">
            <%= hasActiveSession ? "ACTIVE SESSION" : "NO ACTIVE SESSION" %>
          </span>
        </div>

        <!-- 4 Key Comparison Metrics -->
        <div class="grid-4" style="margin-bottom: 1.5rem;">
          <div class="metric-card">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">HTTP Cookie</div>
            <div style="font-weight: 800; font-size: 1.25rem; color: var(--text-main); margin: 0.4rem 0;">
              <%= hasUserCookie ? cookieUsername : "<span style='color: var(--text-light); font-size: 0.95rem;'>Not Set</span>" %>
            </div>
            <div class="metric-label">Remembered Username</div>
          </div>

          <div class="metric-card">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent-purple); text-transform: uppercase;">HttpSession</div>
            <div style="font-weight: 800; font-size: 1.25rem; color: var(--text-main); margin: 0.4rem 0;">
              <%= hasActiveSession ? sessionUser : "<span style='color: var(--danger); font-size: 0.95rem;'>Unauthenticated</span>" %>
            </div>
            <div class="metric-label">Current Logged-in User</div>
          </div>

          <div class="metric-card">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--success); text-transform: uppercase;">Session Timeout</div>
            <div style="font-weight: 800; font-size: 1.25rem; color: var(--text-main); margin: 0.4rem 0;">
              <%= maxInactive %>s (5 mins)
            </div>
            <div class="metric-label">Inactivity Max Interval</div>
          </div>

          <div class="metric-card">
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--warning); text-transform: uppercase;">Live Countdown</div>
            <div style="font-weight: 800; font-size: 1.25rem; color: var(--accent-purple); margin: 0.4rem 0;" id="sessionCountdownDisplay">
              <%= hasActiveSession ? "05:00" : "00:00" %>
            </div>
            <div class="metric-label">Time to Idle Timeout</div>
          </div>
        </div>

        <!-- Timeout Progress Bar -->
        <% if (hasActiveSession) { %>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">
              <span>Session Inactivity Countdown</span>
              <span>Expires after 300 seconds without activity</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--bg-subtle); border-radius: 4px; overflow: hidden;">
              <div id="sessionProgressBar" style="width: 100%; height: 100%; background: var(--gradient-brand); transition: width 1s linear;"></div>
            </div>
          </div>
        <% } %>

        <!-- Detailed Live Attribute Table -->
        <table class="comparison-table" style="margin-bottom: 1.5rem;">
          <thead>
            <tr>
              <th style="width: 25%;">Tracking Mechanism</th>
              <th style="width: 30%;">Attribute / Parameter</th>
              <th>Live Value from Environment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="tech-pill cookie">HTTP Cookie</span></td>
              <td><strong>rememberedUser</strong></td>
              <td><code><%= cookieUsername %></code></td>
            </tr>
            <tr>
              <td><span class="tech-pill cookie">HTTP Cookie</span></td>
              <td><strong>preferredLang</strong></td>
              <td><code><%= cookieLang %></code></td>
            </tr>
            <tr>
              <td><span class="tech-pill session">HttpSession</span></td>
              <td><strong>session.getId()</strong></td>
              <td><code><%= sessionId %></code></td>
            </tr>
            <tr>
              <td><span class="tech-pill session">HttpSession</span></td>
              <td><strong>session.getAttribute("studentUser")</strong></td>
              <td><code><%= sessionUser %></code></td>
            </tr>
            <tr>
              <td><span class="tech-pill session">HttpSession</span></td>
              <td><strong>session.getAttribute("language")</strong></td>
              <td><code><%= sessionLang %></code></td>
            </tr>
            <tr>
              <td><span class="tech-pill session">HttpSession</span></td>
              <td><strong>session.getCreationTime()</strong></td>
              <td><%= (creationTime != null) ? creationTime.toString() : "N/A" %></td>
            </tr>
            <tr>
              <td><span class="tech-pill session">HttpSession</span></td>
              <td><strong>session.getLastAccessedTime()</strong></td>
              <td><%= (lastAccessedTime != null) ? lastAccessedTime.toString() : "N/A" %></td>
            </tr>
          </tbody>
        </table>

        <!-- Interactive Testing Controls -->
        <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.75rem;">
            Interactive Experimentation Controls:
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.reload()">
              &#8635; Refresh Page (Resets Last Accessed Time)
            </button>

            <% if (hasActiveSession) { %>
              <a href="LogoutServlet" class="btn btn-outline-purple btn-sm">
                Test 1: Standard Logout (Invalidate Session only, Keep Cookies)
              </a>

              <a href="LogoutServlet?clearCookies=true" class="btn btn-danger btn-sm">
                Test 2: Full Logout (Invalidate Session &amp; Clear Cookies)
              </a>
            <% } else { %>
              <a href="login.html" class="btn btn-primary btn-sm">
                Login to Begin Live Session
              </a>
            <% } %>
          </div>
        </div>
      </div>

      <!-- 10. THEORETICAL COMPARISON: COOKIES VS HTTPSESSION -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Architectural Comparison: Cookies vs. HttpSession
            </h2>
            <div class="card-subtitle">Comprehensive breakdown of client-side vs server-side session tracking technologies.</div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Cookies Column -->
          <div style="background: #ffffff; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1rem;">
              <span class="tech-pill cookie" style="font-size: 0.9rem; padding: 4px 10px;">HTTP Cookies</span>
              <strong style="color: var(--primary);">Client-Side Mechanism</strong>
            </div>

            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.92rem; color: var(--text-main);">
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--primary); font-weight: 700;">&bull;</span>
                <span><strong>Storage Location:</strong> Stored locally on the user's web browser disk/memory.</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--primary); font-weight: 700;">&bull;</span>
                <span><strong>Purpose in Portal:</strong> Remembers the student username when "Remember Me" is checked and persists preferred language (English/Tamil).</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--primary); font-weight: 700;">&bull;</span>
                <span><strong>Longevity / Persistence:</strong> Can remain available across multiple browser visits until configured expiration time (e.g. 7 days via <code>cookie.setMaxAge(604800)</code>).</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--primary); font-weight: 700;">&bull;</span>
                <span><strong>Capacity &amp; Overhead:</strong> Restricted to 4KB per cookie. Sent automatically in HTTP headers with every request.</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--primary); font-weight: 700;">&bull;</span>
                <span><strong>Security Profile:</strong> Modifiable on client side; not suitable for sensitive credentials or security tokens.</span>
              </li>
            </ul>
          </div>

          <!-- HttpSession Column -->
          <div style="background: #ffffff; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 1rem;">
              <span class="tech-pill session" style="font-size: 0.9rem; padding: 4px 10px;">HttpSession</span>
              <strong style="color: var(--accent-purple);">Server-Side Mechanism</strong>
            </div>

            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.92rem; color: var(--text-main);">
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--accent-purple); font-weight: 700;">&bull;</span>
                <span><strong>Storage Location:</strong> Stored securely in the Apache Tomcat servlet container memory.</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--accent-purple); font-weight: 700;">&bull;</span>
                <span><strong>Purpose in Portal:</strong> Maintains student authentication state, exam progress, timer bounds, and calculated exam scores.</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--accent-purple); font-weight: 700;">&bull;</span>
                <span><strong>Longevity / Timeout:</strong> Automatically expires after the configured inactivity timeout (<strong>5 minutes / 300 seconds</strong>).</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--accent-purple); font-weight: 700;">&bull;</span>
                <span><strong>Session Invalidation:</strong> Can be explicitly terminated on demand during student logout via <code>session.invalidate()</code>.</span>
              </li>
              <li style="display: flex; gap: 8px;">
                <span style="color: var(--accent-purple); font-weight: 700;">&bull;</span>
                <span><strong>Security Profile:</strong> Highly secure. Client only stores an opaque session identifier (<code>JSESSIONID</code>).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </main>
</div>

<script src="js/exam.js"></script>
</body>
</html>
