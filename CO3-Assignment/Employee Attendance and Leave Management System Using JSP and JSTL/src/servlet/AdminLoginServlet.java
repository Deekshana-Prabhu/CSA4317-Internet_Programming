package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.AdminDAO;
import model.Admin;

/**
 * Handles administrator authentication and session initialization.
 */
@WebServlet("/AdminLoginServlet")
public class AdminLoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AdminDAO adminDAO;

    @Override
    public void init() throws ServletException {
        adminDAO = new AdminDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/admin-login.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // Input validation
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please enter both Administrator Username and Password.");
            request.getRequestDispatcher("/admin-login.jsp").forward(request, response);
            return;
        }

        username = username.trim();
        password = password.trim();

        Admin admin = adminDAO.validateAdmin(username, password);

        if (admin != null) {
            // Authentication successful: create admin session
            HttpSession session = request.getSession(true);
            session.setAttribute("loggedInAdmin", admin);
            session.setAttribute("adminId", admin.getAdminId());
            session.setAttribute("adminUsername", admin.getUsername());
            session.setAttribute("adminName", admin.getFullName());
            session.setAttribute("adminEmail", admin.getEmail());
            session.setAttribute("userRole", "ADMIN");

            // Redirect to admin dashboard servlet
            response.sendRedirect(request.getContextPath() + "/AdminDashboardServlet");
        } else {
            // Authentication failed
            request.setAttribute("errorMessage", "Invalid Administrator Username or Password. Please try again.");
            request.setAttribute("enteredUsername", username);
            request.getRequestDispatcher("/admin-login.jsp").forward(request, response);
        }
    }
}
