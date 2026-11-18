<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.exam.portal.Question" %>
<%
    // Prevent browser caching
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

    // 2. Prevent duplicate exam submission:
    // If student has already taken the exam in this session, redirect to results
    Boolean examTaken = (Boolean) userSession.getAttribute("examTaken");
    if (examTaken != null && examTaken.booleanValue()) {
        response.sendRedirect("result.jsp");
        return;
    }

    // Retrieve questions list
    @SuppressWarnings("unchecked")
    List<Question> questions = (List<Question>) request.getAttribute("questions");
    if (questions == null) {
        questions = Question.getAllQuestions();
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Online Examination: Java Programming | EduExam Portal</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body onload="initExam()">

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
        <span class="brand-badge">Active Exam Session</span>
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
          <span>Exam In Progress</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-title">Navigation</div>
      
      <a href="dashboard.jsp" class="nav-item" onclick="return confirm('Leaving this page will not submit your examination. Continue to Dashboard?');">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Student Dashboard</span>
      </a>

      <a href="exam.jsp" class="nav-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>Online Exam</span>
      </a>

      <a href="instructions.jsp" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span>Instructions</span>
      </a>

      <div class="nav-section-title">Session State</div>
      
      <div style="padding: 0.75rem; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
        Exam: <strong>Java Programming</strong><br>
        Candidate: <strong><%= studentUser %></strong><br>
        Auto-submit enabled at 00:00
      </div>
    </nav>
  </aside>

  <!-- Main Viewport -->
  <main class="app-main">
    <!-- Top Examination Bar with Timer -->
    <div class="exam-topbar">
      <div class="exam-subject-tag">
        <span class="badge" style="background: var(--accent-purple); color: #fff; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-sm);">CS304</span>
        <div>
          <strong style="color: var(--text-main); font-size: 1.05rem;">Java Programming Assessment</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Candidate: <%= studentUser %> &bull; 10 Multiple-Choice Questions</div>
        </div>
      </div>

      <!-- Real-Time Countdown Timer (10 Minutes) -->
      <div class="timer-box" id="examTimerBox">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span id="examTimerDisplay">10:00</span>
      </div>
    </div>

    <!-- Exam Content Body -->
    <div class="content-body" style="padding-top: 0.5rem;">
      <form id="examForm" action="ResultServlet" method="POST">
        <div class="exam-layout">
          
          <!-- LEFT COLUMN: QUESTION DISPLAY CARD (ONE QUESTION AT A TIME) -->
          <div class="card" style="padding: 2rem;">
            <%
                int qIndex = 1;
                for (Question q : questions) {
            %>
              <div class="question-container <%= (qIndex == 1) ? "active" : "" %>" id="question-card-<%= qIndex %>">
                <!-- Question Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                  <span class="question-header-pill">
                    Question <%= qIndex %> of 10 &bull; <%= q.getTopic() %>
                  </span>
                  <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">1 Mark</span>
                </div>

                <!-- Question Statement -->
                <div class="question-text">
                  <%= q.getQuestionText() %>
                </div>

                <!-- 4 Options (A, B, C, D) -->
                <div class="options-list">
                  <!-- Option A -->
                  <div class="option-item" id="option_item_<%= q.getId() %>_A" onclick="selectAnswer(<%= q.getId() %>, 'A')">
                    <input type="radio" class="option-radio" name="q<%= q.getId() %>" id="opt_<%= q.getId() %>_A" value="A">
                    <div class="option-badge">A</div>
                    <div class="option-text"><%= q.getOptionA() %></div>
                  </div>

                  <!-- Option B -->
                  <div class="option-item" id="option_item_<%= q.getId() %>_B" onclick="selectAnswer(<%= q.getId() %>, 'B')">
                    <input type="radio" class="option-radio" name="q<%= q.getId() %>" id="opt_<%= q.getId() %>_B" value="B">
                    <div class="option-badge">B</div>
                    <div class="option-text"><%= q.getOptionB() %></div>
                  </div>

                  <!-- Option C -->
                  <div class="option-item" id="option_item_<%= q.getId() %>_C" onclick="selectAnswer(<%= q.getId() %>, 'C')">
                    <input type="radio" class="option-radio" name="q<%= q.getId() %>" id="opt_<%= q.getId() %>_C" value="C">
                    <div class="option-badge">C</div>
                    <div class="option-text"><%= q.getOptionC() %></div>
                  </div>

                  <!-- Option D -->
                  <div class="option-item" id="option_item_<%= q.getId() %>_D" onclick="selectAnswer(<%= q.getId() %>, 'D')">
                    <input type="radio" class="option-radio" name="q<%= q.getId() %>" id="opt_<%= q.getId() %>_D" value="D">
                    <div class="option-badge">D</div>
                    <div class="option-text"><%= q.getOptionD() %></div>
                  </div>
                </div>

                <!-- Question Bottom Actions -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                  <button type="button" class="btn btn-secondary btn-sm" onclick="clearSelection(<%= q.getId() %>)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Clear Selection
                  </button>

                  <div style="font-size: 0.85rem; color: var(--text-muted);">
                    Question <span style="font-weight: 700; color: var(--accent-purple);"><%= qIndex %></span> of 10
                  </div>
                </div>
              </div>
            <%
                    qIndex++;
                }
            %>

            <!-- Next and Previous Navigation Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1.5px solid var(--border-color);">
              <button type="button" id="prevQuestionBtn" class="btn btn-secondary" onclick="prevQuestion()" disabled>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous Question
              </button>

              <button type="button" id="nextQuestionBtn" class="btn btn-primary" onclick="nextQuestion()">
                Next Question
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <!-- RIGHT COLUMN: QUESTION PALETTE & STATUS SUMMARY -->
          <div class="card palette-card">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Question Palette
            </h3>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Click any number to jump to question.</div>

            <!-- Answered / Unanswered Counter -->
            <div style="display: flex; justify-content: space-between; background: var(--bg-subtle); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.84rem; font-weight: 600; margin-bottom: 1rem;">
              <span style="color: var(--accent-purple);">Answered: <strong id="answered-count-display">0</strong></span>
              <span style="color: var(--text-muted);">Unanswered: <strong id="unanswered-count-display">10</strong></span>
            </div>

            <!-- Question Numbers 1 to 10 -->
            <div class="palette-grid">
              <% for (int i = 1; i <= 10; i++) { %>
                <button type="button" class="palette-btn <%= (i == 1) ? "active" : "" %>" id="palette-btn-<%= i %>" onclick="showQuestion(<%= i %>)">
                  <%= i %>
                </button>
              <% } %>
            </div>

            <!-- Palette Legend -->
            <div class="palette-legend">
              <div class="legend-item">
                <span class="legend-dot answered"></span>
                <span>Answered</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot unanswered"></span>
                <span>Unanswered</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot current"></span>
                <span>Current Question</span>
              </div>
            </div>

            <!-- Final Submission Button -->
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
              <button type="button" class="btn btn-success" style="width: 100%; padding: 0.75rem;" onclick="openSubmitModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Submit Examination
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  </main>
</div>

<!-- SUBMISSION CONFIRMATION MODAL -->
<div class="modal-overlay" id="submitModal">
  <div class="modal-box">
    <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--accent-purple-light); color: var(--accent-purple); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    </div>
    <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Confirm Final Submission</h3>
    
    <p id="modal-summary-text" style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
      Are you sure you want to finish the examination and submit your answers for evaluation?
    </p>

    <div style="display: flex; gap: 1rem; justify-content: center;">
      <button type="button" class="btn btn-secondary" onclick="closeSubmitModal()">
        Cancel &amp; Continue Exam
      </button>
      <button type="button" class="btn btn-success" onclick="confirmExamSubmit()">
        Yes, Submit Exam Now
      </button>
    </div>
  </div>
</div>

<script src="js/exam.js"></script>
</body>
</html>
