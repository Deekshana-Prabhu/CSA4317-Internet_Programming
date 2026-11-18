package com.exam.portal;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * LogoutServlet handles student logout, session invalidation,
 * and optional cookie cleanup.
 */
public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * Handles logout request via GET or POST.
     * Invalidates the active HttpSession and unbinds all session attributes.
     * Optionally clears remembered cookies if clearCookies=true is requested.
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Check if student wants to clear remembered preferences/cookies
        String clearCookies = request.getParameter("clearCookies");
        String contextPath = request.getContextPath();
        String cookiePath = (contextPath == null || contextPath.isEmpty()) ? "/" : contextPath;

        if ("true".equalsIgnoreCase(clearCookies)) {
            // Delete rememberedUser cookie
            Cookie userCookie = new Cookie("rememberedUser", "");
            userCookie.setMaxAge(0);
            userCookie.setPath(cookiePath);
            response.addCookie(userCookie);

            // Delete preferredLang cookie
            Cookie langCookie = new Cookie("preferredLang", "");
            langCookie.setMaxAge(0);
            langCookie.setPath(cookiePath);
            response.addCookie(langCookie);
        }

        // Retrieve existing session without creating a new one
        HttpSession session = request.getSession(false);
        if (session != null) {
            // Invalidate server-side session to clear all attributes
            session.invalidate();
        }

        // Set response headers to prevent browser caching of protected pages
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0
        response.setDateHeader("Expires", 0); // Proxies

        // Redirect to login page with appropriate status parameter
        if ("true".equalsIgnoreCase(clearCookies)) {
            response.sendRedirect("login.html?logout=cleared");
        } else {
            response.sendRedirect("login.html?logout=success");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }
}
