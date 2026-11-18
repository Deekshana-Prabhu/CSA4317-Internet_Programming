package com.exam.portal;

import java.io.IOException;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * LoginServlet handles student authentication, session creation,
 * and HTTP cookie management for the Online Examination Portal.
 */
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * Handles HTTP POST requests for student login.
     * Authenticates student credentials, creates an active HttpSession with a 5-minute timeout,
     * and sets/clears HTTP cookies for "Remember Me" and Preferred Language.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Retrieve credentials and preferences from request parameters
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String rememberMe = request.getParameter("rememberMe");
        String language = request.getParameter("language");

        if (language == null || language.trim().isEmpty()) {
            language = "English";
        }

        // Validate credentials against demonstration account (student101 / student123)
        // Also support admin / admin123 or valid student format
        boolean isAuthenticated = false;
        if (username != null && password != null) {
            String u = username.trim();
            String p = password.trim();

            if (("student101".equalsIgnoreCase(u) && "student123".equals(p)) ||
                ("admin".equalsIgnoreCase(u) && "admin123".equals(p)) ||
                ("student".equalsIgnoreCase(u) && "student123".equals(p))) {
                isAuthenticated = true;
            }
        }

        if (isAuthenticated) {
            // 1. Session Management using HttpSession
            // Retrieve existing session or create a new session
            HttpSession session = request.getSession(true);
            
            // Configure session timeout of 5 minutes (300 seconds) for demonstration
            session.setMaxInactiveInterval(300);
            
            // Store student authentication state and user details in session
            session.setAttribute("studentUser", username.trim());
            session.setAttribute("language", language);
            session.setAttribute("loginTime", new Date());
            session.setAttribute("clientIp", request.getRemoteAddr());

            // 2. Cookie Management
            String contextPath = request.getContextPath();
            String cookiePath = (contextPath == null || contextPath.isEmpty()) ? "/" : contextPath;

            // Handle "Remember Me" cookie
            if (rememberMe != null && ("on".equalsIgnoreCase(rememberMe) || "true".equalsIgnoreCase(rememberMe))) {
                Cookie userCookie = new Cookie("rememberedUser", username.trim());
                userCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days expiration
                userCookie.setPath(cookiePath);
                response.addCookie(userCookie);
            } else {
                // If Remember Me is unchecked, clear any existing rememberedUser cookie
                Cookie userCookie = new Cookie("rememberedUser", "");
                userCookie.setMaxAge(0); // Immediately expire cookie
                userCookie.setPath(cookiePath);
                response.addCookie(userCookie);
            }

            // Store preferred language cookie
            Cookie langCookie = new Cookie("preferredLang", language);
            langCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days expiration
            langCookie.setPath(cookiePath);
            response.addCookie(langCookie);

            // Redirect authenticated student to Dashboard
            response.sendRedirect("dashboard.jsp");

        } else {
            // Invalid credentials: redirect to login page with error indicator
            response.sendRedirect("login.html?error=invalid");
        }
    }

    /**
     * Handles HTTP GET requests by redirecting to login page.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect("login.html");
    }
}
