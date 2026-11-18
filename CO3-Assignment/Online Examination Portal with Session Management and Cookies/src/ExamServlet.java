package com.exam.portal;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * ExamServlet guards the examination interface, ensures active session authentication,
 * prepares the question repository, and prevents duplicate exam attempts.
 */
public class ExamServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Session Protection Check: Verify student is authenticated
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("studentUser") == null) {
            response.sendRedirect("login.html?error=unauthorized");
            return;
        }

        // Allow student to retake if explicitly requested
        String action = request.getParameter("action");
        if ("retake".equalsIgnoreCase(action)) {
            session.removeAttribute("examTaken");
            session.removeAttribute("score");
            session.removeAttribute("correctCount");
            session.removeAttribute("incorrectCount");
            session.removeAttribute("unansweredCount");
            session.removeAttribute("percentage");
            session.removeAttribute("passStatus");
            session.removeAttribute("userAnswers");
        }

        // 2. Prevent Duplicate Submission:
        // If student has already submitted the exam, redirect directly to Result page
        if (session.getAttribute("examTaken") != null && Boolean.TRUE.equals(session.getAttribute("examTaken"))) {
            response.sendRedirect("result.jsp");
            return;
        }

        // 3. Load question list and pass to JSP
        List<Question> questions = Question.getAllQuestions();
        request.setAttribute("questions", questions);

        // Forward to exam.jsp
        request.getRequestDispatcher("exam.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
