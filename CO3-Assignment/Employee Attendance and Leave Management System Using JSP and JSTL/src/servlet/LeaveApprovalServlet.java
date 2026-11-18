package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.LeaveDAO;

/**
 * Handles administrator approval or rejection of leave applications.
 * Updates the leave status in MySQL.
 */
@WebServlet("/LeaveApprovalServlet")
public class LeaveApprovalServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private LeaveDAO leaveDAO;

    @Override
    public void init() throws ServletException {
        leaveDAO = new LeaveDAO();
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

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminUsername") == null) {
            response.sendRedirect(request.getContextPath() + "/admin-login.jsp?error=unauthorized");
            return;
        }

        String leaveIdStr = request.getParameter("leaveId");
        String action = request.getParameter("action");
        String source = request.getParameter("source"); // "dashboard" or "requests"

        if (leaveIdStr != null && action != null) {
            try {
                int leaveId = Integer.parseInt(leaveIdStr.trim());
                String newStatus;

                if ("approve".equalsIgnoreCase(action)) {
                    newStatus = "Approved";
                } else if ("reject".equalsIgnoreCase(action)) {
                    newStatus = "Rejected";
                } else {
                    newStatus = "Pending";
                }

                boolean updated = leaveDAO.updateLeaveStatus(leaveId, newStatus);

                String redirectTarget = "requests".equalsIgnoreCase(source)
                        ? "/LeaveRequestsServlet?msg=" + newStatus
                        : "/AdminDashboardServlet?msg=" + newStatus;

                if (updated) {
                    response.sendRedirect(request.getContextPath() + redirectTarget);
                    return;
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }

        response.sendRedirect(request.getContextPath() + "/LeaveRequestsServlet?error=failed");
    }
}
