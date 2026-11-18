package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.EmployeeDAO;
import model.Employee;

/**
 * Handles employee authentication, session initialization,
 * and "Remember Me" cookie management.
 */
@WebServlet("/EmployeeLoginServlet")
public class EmployeeLoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private EmployeeDAO employeeDAO;

    @Override
    public void init() throws ServletException {
        employeeDAO = new EmployeeDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Redirect GET requests to the employee login page
        response.sendRedirect(request.getContextPath() + "/employee-login.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String rememberMe = request.getParameter("rememberMe");

        // Input validation
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please enter both Username/Employee ID and Password.");
            request.getRequestDispatcher("/employee-login.jsp").forward(request, response);
            return;
        }

        username = username.trim();
        password = password.trim();

        Employee emp = employeeDAO.validateEmployee(username, password);

        if (emp != null) {
            // Authentication successful: create session
            HttpSession session = request.getSession(true);
            session.setAttribute("loggedInEmployee", emp);
            session.setAttribute("employeeId", emp.getEmployeeId());
            session.setAttribute("employeeName", emp.getEmployeeName());
            session.setAttribute("department", emp.getDepartment());
            session.setAttribute("email", emp.getEmail());
            session.setAttribute("userRole", "EMPLOYEE");

            // Manage "Remember Me" Cookie
            String cookiePath = request.getContextPath().isEmpty() ? "/" : request.getContextPath();
            if ("true".equalsIgnoreCase(rememberMe) || "on".equalsIgnoreCase(rememberMe)) {
                Cookie rememberCookie = new Cookie("rememberEmployee", emp.getUsername());
                rememberCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
                rememberCookie.setPath(cookiePath);
                response.addCookie(rememberCookie);
            } else {
                // Clear existing cookie if unchecked
                Cookie clearCookie = new Cookie("rememberEmployee", "");
                clearCookie.setMaxAge(0);
                clearCookie.setPath(cookiePath);
                response.addCookie(clearCookie);
            }

            // Redirect to employee dashboard servlet
            response.sendRedirect(request.getContextPath() + "/EmployeeDashboardServlet");
        } else {
            // Authentication failed
            request.setAttribute("errorMessage", "Invalid Employee ID/Username or Password. Please try again.");
            request.setAttribute("enteredUsername", username);
            request.getRequestDispatcher("/employee-login.jsp").forward(request, response);
        }
    }
}
