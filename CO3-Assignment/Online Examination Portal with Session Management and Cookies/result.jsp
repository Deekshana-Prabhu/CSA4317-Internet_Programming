<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.exam.portal.Question" %>
<%
    // Prevent browser caching
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);

    // 1. Session Verification Check
    HttpSession userSession = request.getSession(false);
    if (userSession == null || userSession.getAttribute("studentUser") == null) {
        response.sendRedirect("login.html?error=unauthorized");
        return;
    }

    String studentUser = (String) userSession.getAttribute("studentUser");

    // 2. Check if exam has been taken
    Boolean examTaken = (Boolean) userSession.getAttribute("examTaken");
    if (examTaken == null || !examTaken.booleanValue()) {
        response.sendRedirect("dashboard.jsp");
        return;
    }

    // Retrieve result values calculated by ResultServlet
    Integer totalQuestions = (Integer) userSession.getAttribute("totalQuestions");
    Integer correctCount = (Integer) userSession.getAttribute("correctCount");
    Integer incorrectCount = (Integer) userSession.getAttribute("incorrectCount");
    Integer unansweredCount = (Integer) userSession.getAttribute("unansweredCount");
    Integer score = (Integer) userSession.getAttribute("score");
    Double percentage = (Double) userSession.getAttribute("percentage");
    String passStatus = (String) userSession.getAttribute("passStatus");
    java.util.Date subTime = (java.util.Date) userSession.getAttribute("examSubmissionTime");

    @SuppressWarnings("unchecked")
    Map<Integer, String> userAnswers = (Map<Integer, String>) userSession.getAttribute("userAnswers");
    List<Question> questions = Question.getAllQuestions();

    boolean isPassed = "PASS".equalsIgnoreCase(passStatus);
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examination Results | Online Examination Portal</title>
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
        <span class="brand-badge">Evaluation Center</span>
      </div>
    </div>

    <!-- Active Student Info -->
    <div class="sidebar-user">
      <div class="user-avatar">
        <%= studentUser.substring(0, 1).toUpperCase() %>
      </div>
      <div class="user-info">
        <div class="user-name"><%= studentUser %></div>
        <div class="user-status">
          <span class="status-dot"></span>
          <span>Result Generated</span>
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

      <a href="dashboard.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Student Dashboard</span>
      </a>

      <a href="result.jsp" class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Examination Result</span>
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
          <span class="current-page">Official Assessment Result</span>
        </div>
      </div>
      <div class="header-actions">
        <a href="dashboard.jsp" class="btn btn-secondary btn-sm">&larr; Back to Dashboard</a>
      </div>
    </header>

    <div class="content-body">
      <!-- 7. Attractive Result Summary Card -->
      <div class="result-hero-card">
        <div class="result-badge-icon <%= isPassed ? "pass" : "fail" %>">
          <% if (isPassed) { %>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          <% } else { %>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          <% } %>
        </div>

        <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem;">
          <%= isPassed ? "Congratulations! You Passed!" : "Examination Completed" %>
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 1.5rem;">
          <%= isPassed ? "You have successfully demonstrated proficiency in Java Programming." : "You did not achieve the 50% passing threshold this time. Review your answers below." %>
        </p>

        <!-- Large Score Callout -->
        <div class="score-display">
          <%= score %> <span>/ <%= totalQuestions %></span>
        </div>
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-purple); margin-bottom: 1.75rem;">
          Percentage: <%= String.format("%.1f", percentage) %>% &bull; Status: 
          <span style="color: <%= isPassed ? "var(--success)" : "var(--danger)" %>;"><%= passStatus %></span>
        </div>

        <!-- 4 Metric Cards Row -->
        <div class="grid-4" style="max-width: 800px; margin: 0 auto 2rem auto;">
          <div class="metric-card">
            <div class="metric-num total"><%= totalQuestions %></div>
            <div class="metric-label">Total Questions</div>
          </div>

          <div class="metric-card">
            <div class="metric-num correct"><%= correctCount %></div>
            <div class="metric-label">Correct Answers</div>
          </div>

          <div class="metric-card">
            <div class="metric-num incorrect"><%= incorrectCount %></div>
            <div class="metric-label">Incorrect Answers</div>
          </div>

          <div class="metric-card">
            <div class="metric-num unanswered"><%= unansweredCount %></div>
            <div class="metric-label">Unanswered</div>
          </div>
        </div>

        <!-- Student & Exam Information Details Table -->
        <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); max-width: 650px; margin: 0 auto 2rem auto; text-align: left; padding: 1.25rem 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
            <tr>
              <td style="padding: 0.5rem 0; color: var(--text-muted); font-weight: 600;">Student Username:</td>
              <td style="padding: 0.5rem 0; font-weight: 700; color: var(--text-main); text-align: right;"><%= studentUser %></td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; color: var(--text-muted); font-weight: 600;">Subject / Course:</td>
              <td style="padding: 0.5rem 0; font-weight: 700; color: var(--text-main); text-align: right;">Java Programming (CS304)</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; color: var(--text-muted); font-weight: 600;">Submission Timestamp:</td>
              <td style="padding: 0.5rem 0; font-weight: 600; color: var(--text-main); text-align: right;"><%= (subTime != null) ? subTime.toString() : "Recorded" %></td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; color: var(--text-muted); font-weight: 600;">Evaluation Mode:</td>
              <td style="padding: 0.5rem 0; font-weight: 600; color: var(--accent-purple); text-align: right;">Automated Java Servlet Computation</td>
            </tr>
          </table>
        </div>

        <!-- Action Buttons: View Answers, Dashboard, Logout -->
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" onclick="toggleAnswerReview()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span id="reviewBtnText">View Answers &amp; Explanations</span>
          </button>

          <a href="dashboard.jsp" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Back to Dashboard
          </a>

          <a href="LogoutServlet" class="btn btn-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </a>
        </div>
      </div>

      <!-- DETAILED QUESTION-BY-QUESTION REVIEW SECTION -->
      <div id="answerReviewSection" style="display: none;">
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Detailed Examination Answer Review
              </h2>
              <div class="card-subtitle">Review each question, your selected response, the correct key, and pedagogical explanations.</div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="toggleAnswerReview()">Hide Review</button>
          </div>

          <%
              for (Question q : questions) {
                  int qId = q.getId();
                  String studentAns = (userAnswers != null) ? userAnswers.get(qId) : null;
                  boolean answered = (studentAns != null && !studentAns.isEmpty() && !"UNANSWERED".equalsIgnoreCase(studentAns));
                  boolean isCorrect = (answered && studentAns.equalsIgnoreCase(q.getCorrectAnswer()));
          %>
            <div class="review-item">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span style="font-weight: 700; color: var(--accent-purple); font-size: 0.9rem;">
                  Question <%= qId %> &bull; <%= q.getTopic() %>
                </span>
                
                <% if (isCorrect) { %>
                  <span class="review-badge correct">&check; Correct (+1)</span>
                <% } else if (answered) { %>
                  <span class="review-badge incorrect">&cross; Incorrect (0)</span>
                <% } else { %>
                  <span class="review-badge unanswered">&ominus; Unanswered (0)</span>
                <% } %>
              </div>

              <div style="font-weight: 600; color: var(--text-main); font-size: 1.05rem; margin-bottom: 1rem;">
                <%= q.getQuestionText() %>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.92rem; margin-bottom: 1rem;">
                <div style="padding: 0.4rem 0.75rem; border-radius: 4px; <%= ("A".equals(q.getCorrectAnswer())) ? "background: var(--success-light); font-weight: 600; color: var(--success);" : "" %> <%= (answered && "A".equals(studentAns) && !isCorrect) ? "background: var(--danger-light); color: var(--danger);" : "" %>">
                  A) <%= q.getOptionA() %>
                  <%= ("A".equals(q.getCorrectAnswer())) ? " &check; (Correct Answer)" : "" %>
                  <%= (answered && "A".equals(studentAns) && !isCorrect) ? " &cross; (Your Answer)" : "" %>
                </div>

                <div style="padding: 0.4rem 0.75rem; border-radius: 4px; <%= ("B".equals(q.getCorrectAnswer())) ? "background: var(--success-light); font-weight: 600; color: var(--success);" : "" %> <%= (answered && "B".equals(studentAns) && !isCorrect) ? "background: var(--danger-light); color: var(--danger);" : "" %>">
                  B) <%= q.getOptionB() %>
                  <%= ("B".equals(q.getCorrectAnswer())) ? " &check; (Correct Answer)" : "" %>
                  <%= (answered && "B".equals(studentAns) && !isCorrect) ? " &cross; (Your Answer)" : "" %>
                </div>

                <div style="padding: 0.4rem 0.75rem; border-radius: 4px; <%= ("C".equals(q.getCorrectAnswer())) ? "background: var(--success-light); font-weight: 600; color: var(--success);" : "" %> <%= (answered && "C".equals(studentAns) && !isCorrect) ? "background: var(--danger-light); color: var(--danger);" : "" %>">
                  C) <%= q.getOptionC() %>
                  <%= ("C".equals(q.getCorrectAnswer())) ? " &check; (Correct Answer)" : "" %>
                  <%= (answered && "C".equals(studentAns) && !isCorrect) ? " &cross; (Your Answer)" : "" %>
                </div>

                <div style="padding: 0.4rem 0.75rem; border-radius: 4px; <%= ("D".equals(q.getCorrectAnswer())) ? "background: var(--success-light); font-weight: 600; color: var(--success);" : "" %> <%= (answered && "D".equals(studentAns) && !isCorrect) ? "background: var(--danger-light); color: var(--danger);" : "" %>">
                  D) <%= q.getOptionD() %>
                  <%= ("D".equals(q.getCorrectAnswer())) ? " &check; (Correct Answer)" : "" %>
                  <%= (answered && "D".equals(studentAns) && !isCorrect) ? " &cross; (Your Answer)" : "" %>
                </div>
              </div>

              <!-- Explanation Box -->
              <div class="explanation-box">
                <strong>Concept Explanation:</strong> <%= q.getExplanation() %>
              </div>
            </div>
          <% } %>
        </div>
      </div>

    </div>
  </main>
</div>

<script src="js/exam.js"></script>
<script>
  function toggleAnswerReview() {
    const section = document.getElementById('answerReviewSection');
    const btnText = document.getElementById('reviewBtnText');
    if (section.style.display === 'none' || section.style.display === '') {
      section.style.display = 'block';
      if (btnText) btnText.innerText = 'Hide Answer Review';
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      section.style.display = 'none';
      if (btnText) btnText.innerText = 'View Answers & Explanations';
    }
  }
</script>
</body>
</html>
