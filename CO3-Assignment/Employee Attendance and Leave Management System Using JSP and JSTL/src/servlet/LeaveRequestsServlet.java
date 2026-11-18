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
 * Loads pending and historical leave requests for Administrator review and decision.
 */
@WebServlet("/LeaveRequestsServlet")
public class LeaveRequestsServlet extends HttpServlet {
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
        if (session == null || session.getAttribute("adminUsername") == null) {
            response.sendRedirect(request.getContextPath() + "/admin-login.jsp?error=unauthorized");
            return;
        }

        List<LeaveApplication> pendingLeaves = leaveDAO.getPendingLeaves();
        List<LeaveApplication> allLeaves = leaveDAO.getAllLeaves();

        int pendingCount = leaveDAO.getPendingLeavesCount();
        int approvedCount = leaveDAO.getApprovedLeavesCount();
        int totalCount = allLeaves.size();
        int rejectedCount = totalCount - (pendingCount + approvedCount);

        request.setAttribute("pendingLeaves", pendingLeaves);
        request.setAttribute("allLeaves", allLeaves);
        request.setAttribute("pendingCount", pendingCount);
        request.setAttribute("approvedCount", approvedCount);
        request.setAttribute("rejectedCount", Math.max(rejectedCount, 0));
        request.setAttribute("totalCount", totalCount);

        String msg = request.getParameter("msg");
        if ("Approved".equalsIgnoreCase(msg)) {
            request.setAttribute("successMessage", "Leave request has been APPROVED successfully.");
        } else if ("Rejected".equalsIgnoreCase(msg)) {
            request.setAttribute("infoMessage", "Leave request has been REJECTED.");
        }

        request.getRequestDispatcher("/leave-requests.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
