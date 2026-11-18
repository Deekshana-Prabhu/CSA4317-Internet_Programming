<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Prevent browser caching of protected page
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);

    // 1. Session Protection Check: Ensure student is authenticated
    HttpSession userSession = request.getSession(false);
    if (userSession == null || userSession.getAttribute("studentUser") == null) {
        response.sendRedirect("login.html?error=unauthorized");
        return;
    }

    String studentUser = (String) userSession.getAttribute("studentUser");
    String language = (String) userSession.getAttribute("language");
    if (language == null) language = "English";

    Boolean examTaken = (Boolean) userSession.getAttribute("examTaken");
    boolean hasAttempted = (examTaken != null && examTaken.booleanValue());
    Integer prevScore = (Integer) userSession.getAttribute("score");
    Double prevPct = (Double) userSession.getAttribute("percentage");
    String passStatus = (String) userSession.getAttribute("passStatus");
    java.util.Date subTime = (java.util.Date) userSession.getAttribute("examSubmissionTime");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Dashboard | Online Examination Portal</title>
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
        <span class="brand-badge">Student Zone</span>
      </div>
    </div>

    <!-- Active Student Info in Sidebar -->
    <div class="sidebar-user">
      <div class="user-avatar">
        <%= studentUser.substring(0, 1).toUpperCase() %>
      </div>
      <div class="user-info">
        <div class="user-name"><%= studentUser %></div>
        <div class="user-status">
          <span class="status-dot"></span>
          <span>Session Active</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-title">Main Portal</div>
      
      <a href="index.html" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home / Welcome</span>
      </a>

      <a href="dashboard.jsp" class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Student Dashboard</span>
      </a>

      <div class="nav-section-title">Examination</div>

      <a href="instructions.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span>Exam Instructions</span>
      </a>

      <a href="ExamServlet" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Take Online Exam</span>
      </a>

      <a href="result.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Exam Result</span>
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

      <div class="nav-section-title">Account</div>

      <a href="LogoutServlet" class="nav-item" style="color: var(--danger);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="session-indicator-box">
        <strong>Session ID:</strong>
        <span style="font-family: monospace;"><%= userSession.getId().substring(0, Math.min(12, userSession.getId().length())) %>...</span>
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
          <span class="current-page">Dashboard</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="lang-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          <%= language %>
        </div>
        <a href="LogoutServlet" class="btn btn-secondary btn-sm" style="color: var(--danger);">Logout</a>
      </div>
    </header>

    <div class="content-body">
      <!-- Welcome Header Card -->
      <div class="card" style="background: var(--gradient-soft); border-color: #e0e7ff;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="background: var(--accent-purple-soft); color: var(--accent-purple); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-full); text-transform: uppercase;">
              Student Portal Session Active
            </span>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-main); margin-top: 0.5rem;">
              Welcome back, <%= studentUser %>! 👋
            </h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">
              Your authenticated session is active on the server. Review your scheduled examinations and track performance below.
            </p>
          </div>
          <div>
            <a href="session-demo.jsp" class="btn btn-outline-purple btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
              View Session Details
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Row -->
      <div class="grid-4" style="margin-bottom: 1.5rem;">
        <div class="card" style="margin-bottom: 0;">
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Authentication Status</div>
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--success); margin-top: 0.35rem; display: flex; align-items: center; gap: 6px;">
            <span class="status-dot"></span> Active
          </div>
          <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 4px;">HttpSession Verified</div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Session Timeout</div>
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--accent-purple); margin-top: 0.35rem;">
            5 Minutes
          </div>
          <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 4px;">Auto-invalidates on idle</div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Available Exams</div>
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--primary); margin-top: 0.35rem;">
            1 Exam Active
          </div>
          <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 4px;">Java Programming (CS304)</div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Attempt Status</div>
          <div style="font-size: 1.3rem; font-weight: 700; color: <%= hasAttempted ? "var(--success)" : "var(--warning)" %>; margin-top: 0.35rem;">
            <%= hasAttempted ? "Submitted (" + prevScore + "/10)" : "Pending Attempt" %>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 4px;"><%= hasAttempted ? "Grade Evaluated" : "Not yet started" %></div>
        </div>
      </div>

      <!-- Available Examination Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Scheduled Examination
            </h2>
            <div class="card-subtitle">Take your scheduled assessment before the testing window closes.</div>
          </div>
          <span class="badge" style="background: var(--primary-light); color: var(--primary); font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full);">ONLINE</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="background: var(--bg-page); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 0.05em;">Course Code: CS304</div>
              <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin: 0.25rem 0 0.5rem 0;">Java Programming &amp; Web Components</h3>
              <div style="display: flex; gap: 1.5rem; font-size: 0.9rem; color: var(--text-muted); flex-wrap: wrap;">
                <span><strong>Total Questions:</strong> 10 MCQs</span>
                <span><strong>Duration:</strong> 10 Minutes</span>
                <span><strong>Pass Mark:</strong> 5 / 10 (50%)</span>
              </div>
            </div>

            <div>
              <% if (!hasAttempted) { %>
                <a href="instructions.jsp" class="btn btn-primary btn-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Start Examination
                </a>
              <% } else { %>
                <div style="display: flex; gap: 0.75rem;">
                  <a href="result.jsp" class="btn btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    View Result
                  </a>
                  <a href="ExamServlet?action=retake" class="btn btn-secondary">
                    &#8635; Retake Exam
                  </a>
                </div>
              <% } %>
            </div>
          </div>
        </div>
      </div>

      <!-- Previous Examination Results Section -->
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Previous Examination Results
            </h2>
            <div class="card-subtitle">Session-persisted score history and evaluation records.</div>
          </div>
        </div>

        <% if (hasAttempted) { %>
          <div style="background: #ffffff; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-weight: 700; font-size: 1.15rem; color: var(--text-main);">Java Programming (CS304)</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                Submitted on: <%= (subTime != null) ? subTime.toString() : "Recent Attempt" %>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 2rem;">
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Score</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-purple);"><%= prevScore %> / 10</div>
              </div>

              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Percentage</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);"><%= String.format("%.1f", prevPct) %>%</div>
              </div>

              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Status</div>
                <span class="badge" style="background: <%= "PASS".equals(passStatus) ? "var(--success-light)" : "var(--danger-light)" %>; color: <%= "PASS".equals(passStatus) ? "var(--success)" : "var(--danger)" %>; font-weight: 800; font-size: 1rem; padding: 4px 14px; border-radius: var(--radius-full);">
                  <%= passStatus %>
                </span>
              </div>

              <div>
                <a href="result.jsp" class="btn btn-outline-purple btn-sm">Full Report &rarr;</a>
              </div>
            </div>
          </div>
        <% } else { %>
          <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" stroke-width="1.5" style="margin-bottom: 0.75rem;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-main);">No Exam Attempts Recorded In This Session</div>
            <p style="font-size: 0.88rem; margin-top: 4px; max-width: 480px; margin-left: auto; margin-right: auto;">
              You have not attempted the Java Programming exam in the current session. Click the <strong>"Start Examination"</strong> button above when you are ready.
            </p>
          </div>
        <% } %>
      </div>
    </div>
  </main>
</div>

<script src="js/exam.js"></script>
</body>
</html>
