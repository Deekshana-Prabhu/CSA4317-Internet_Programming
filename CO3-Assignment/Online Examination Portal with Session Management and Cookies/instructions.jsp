<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Prevent browser caching
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);

    // Session Verification
    HttpSession userSession = request.getSession(false);
    if (userSession == null || userSession.getAttribute("studentUser") == null) {
        response.sendRedirect("login.html?error=unauthorized");
        return;
    }

    String studentUser = (String) userSession.getAttribute("studentUser");
    String language = (String) userSession.getAttribute("language");
    if (language == null) language = "English";
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examination Instructions | Online Examination Portal</title>
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
        <span class="brand-badge">Rules &amp; Guidelines</span>
      </div>
    </div>

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

      <a href="dashboard.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Student Dashboard</span>
      </a>

      <div class="nav-section-title">Examination</div>

      <a href="instructions.jsp" class="nav-item active">
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
          <span>Examination</span>
          <span>/</span>
          <span class="current-page">Instructions &amp; Guidelines</span>
        </div>
      </div>
      <div class="header-actions">
        <a href="dashboard.jsp" class="btn btn-secondary btn-sm">&larr; Back to Dashboard</a>
      </div>
    </header>

    <div class="content-body">
      <!-- Instructions Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <h1 class="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Java Programming Online Examination Instructions
            </h1>
            <div class="card-subtitle">Candidate: <strong><%= studentUser %></strong> &bull; Subject Code: <strong>CS304</strong></div>
          </div>
          <span class="badge" style="background: var(--accent-purple-light); color: var(--accent-purple); font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full);">
            Duration: 10 Minutes
          </span>
        </div>

        <!-- Key Examination Metrics -->
        <div class="grid-3" style="margin-bottom: 2rem;">
          <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Questions</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">10 MCQs</div>
            <div style="font-size: 0.78rem; color: var(--text-light);">Equal Marks Each</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Examination Duration</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent-purple);">10 Minutes</div>
            <div style="font-size: 0.78rem; color: var(--text-light);">Countdown with Auto-Submit</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Pass Mark</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--success);">5 / 10</div>
            <div style="font-size: 0.78rem; color: var(--text-light);">50% Passing Threshold</div>
          </div>
        </div>

        <!-- Rules List -->
        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.75rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.25rem;">
            Please read the following instructions carefully:
          </h3>

          <ol style="margin-left: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">
            <li>
              <strong>Total Questions:</strong> The examination contains exactly <strong>10 multiple-choice questions</strong> spanning Java Basics, OOP, Classes &amp; Objects, Inheritance, Exception Handling, Servlets, JSP, JDBC, HttpSession, and HTTP Cookies.
            </li>
            <li>
              <strong>Duration &amp; Timing:</strong> Total examination duration is <strong>10 minutes (600 seconds)</strong>. A live countdown timer is displayed prominently at the top of the examination window.
            </li>
            <li>
              <strong>Marking Scheme:</strong> Each question carries <strong>1 mark</strong>. There is no negative marking for incorrect or unanswered questions.
            </li>
            <li>
              <strong>Selecting Answers:</strong> For each question, <strong>select one correct answer</strong> by clicking on option (A, B, C, or D). You can change or clear your selection at any time prior to final submission.
            </li>
            <li>
              <strong>Timer Expiration &amp; Auto-Submission:</strong> <strong>Submit answers before the timer ends.</strong> If the countdown timer reaches zero (00:00), the examination will automatically submit your saved responses to the server without requiring further action.
            </li>
            <li>
              <strong>Browser Safety:</strong> <strong>Do not refresh or close the examination page unnecessarily.</strong> Navigating away from the page may cause unsubmitted answers to be lost.
            </li>
            <li>
              <strong>Navigation Palette:</strong> You can navigate freely between questions using the <strong>Previous</strong> and <strong>Next</strong> buttons or by directly clicking on any question number (1 through 10) in the Question Palette.
            </li>
            <li>
              <strong>Final Submission Confirmation:</strong> When you click the <strong>Submit Examination</strong> button, a confirmation dialog will summarize the number of questions answered and unanswered before final recording.
            </li>
          </ol>
        </div>

        <!-- Agreement Form -->
        <div style="background: var(--accent-purple-light); border: 1.5px solid var(--accent-purple-soft); border-radius: var(--radius-md); padding: 1.5rem; text-align: center;">
          <label class="form-checkbox" style="display: inline-flex; font-weight: 600; font-size: 1rem; color: var(--text-main); margin-bottom: 1.25rem;">
            <input type="checkbox" id="agreeCheckbox" onchange="toggleStartBtn()">
            <span>I have read, understood, and agree to all the examination rules and guidelines.</span>
          </label>
          <br>
          <a href="ExamServlet" id="startExamBtn" class="btn btn-primary btn-lg" style="pointer-events: none; opacity: 0.5;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            I Agree and Start Exam
          </a>
        </div>
      </div>
    </div>
  </main>
</div>

<script src="js/exam.js"></script>
<script>
  function toggleStartBtn() {
    const cb = document.getElementById('agreeCheckbox');
    const btn = document.getElementById('startExamBtn');
    if (cb.checked) {
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
    } else {
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.5';
    }
  }
</script>
</body>
</html>
