package com.exam.portal;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * ResultServlet processes examination submissions, automatically evaluates
 * student answers against the master answer key, calculates grades and percentages,
 * and maintains the result state in the student's active HttpSession.
 */
public class ResultServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * Handles POST request when student submits the examination.
     * Evaluates all 10 questions, calculates score, and updates session attributes.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Session Protection Check: Ensure student is authenticated
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("studentUser") == null) {
            response.sendRedirect("login.html?error=unauthorized");
            return;
        }

        // 2. Prevent duplicate submission if already evaluated
        if (session.getAttribute("examTaken") != null && Boolean.TRUE.equals(session.getAttribute("examTaken"))) {
            response.sendRedirect("result.jsp");
            return;
        }

        // 3. Retrieve all examination questions
        List<Question> questions = Question.getAllQuestions();
        int totalQuestions = questions.size();
        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;

        // Map to store student's selected answer for each question (questionId -> selectedOption)
        Map<Integer, String> userAnswers = new HashMap<Integer, String>();

        // 4. Automatic Evaluation of submitted responses
        for (Question q : questions) {
            int qId = q.getId();
            String submittedAns = request.getParameter("q" + qId);

            if (submittedAns != null && !submittedAns.trim().isEmpty()) {
                submittedAns = submittedAns.trim().toUpperCase();
                userAnswers.put(qId, submittedAns);

                if (submittedAns.equalsIgnoreCase(q.getCorrectAnswer())) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            } else {
                // No answer was chosen by the student
                userAnswers.put(qId, "UNANSWERED");
                unansweredCount++;
            }
        }

        // 5. Calculate final score, percentage, and Pass/Fail status
        int totalMarks = correctCount; // 1 mark per question
        double percentage = ((double) correctCount / (double) totalQuestions) * 100.0;
        String passStatus = (correctCount >= 5) ? "PASS" : "FAIL"; // 50% pass threshold

        // 6. Save examination result and history into student's HttpSession
        session.setAttribute("totalQuestions", totalQuestions);
        session.setAttribute("correctCount", correctCount);
        session.setAttribute("incorrectCount", incorrectCount);
        session.setAttribute("unansweredCount", unansweredCount);
        session.setAttribute("score", totalMarks);
        session.setAttribute("percentage", percentage);
        session.setAttribute("passStatus", passStatus);
        session.setAttribute("userAnswers", userAnswers);
        session.setAttribute("examTaken", true);
        session.setAttribute("examSubmissionTime", new Date());

        // Redirect to result display page
        response.sendRedirect("result.jsp");
    }

    /**
     * Handles GET request to view results if already taken, otherwise redirects to dashboard.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("studentUser") == null) {
            response.sendRedirect("login.html?error=unauthorized");
            return;
        }

        if (session.getAttribute("examTaken") != null && Boolean.TRUE.equals(session.getAttribute("examTaken"))) {
            response.sendRedirect("result.jsp");
        } else {
            response.sendRedirect("dashboard.jsp");
        }
    }
}
