package servlet;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.LeaveDAO;
import model.LeaveApplication;

/**
 * Retrieves leave application history for the logged-in employee.
 */
@WebServlet("/LeaveHistoryServlet")
public class LeaveHistoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private LeaveDAO leaveDAO;

    @Override
    public void init() throws ServletException {
        leaveDAO = new LeaveDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("employeeId") == null) {
            response.sendRedirect(request.getContextPath() + "/employee-login.jsp?error=unauthorized");
            return;
        }

        String employeeId = (String) session.getAttribute("employeeId");
        List<LeaveApplication> leaveList = leaveDAO.getLeavesByEmployee(employeeId);

        int pendingCount = 0;
        int approvedCount = 0;
        int rejectedCount = 0;

        for (LeaveApplication app : leaveList) {
            if ("Approved".equalsIgnoreCase(app.getStatus())) {
                approvedCount++;
            } else if ("Rejected".equalsIgnoreCase(app.getStatus())) {
                rejectedCount++;
            } else {
                pendingCount++;
            }
        }

        request.setAttribute("leaveList", leaveList);
        request.setAttribute("totalLeaves", leaveList.size());
        request.setAttribute("pendingCount", pendingCount);
        request.setAttribute("approvedCount", approvedCount);
        request.setAttribute("rejectedCount", rejectedCount);

        request.getRequestDispatcher("/leave-history.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
