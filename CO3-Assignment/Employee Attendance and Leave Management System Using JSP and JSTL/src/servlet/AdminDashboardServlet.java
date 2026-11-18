package servlet;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.AttendanceDAO;
import dao.EmployeeDAO;
import dao.LeaveDAO;
import model.Attendance;
import model.LeaveApplication;

/**
 * Loads administrative metrics and pending requests for the Administrator Dashboard.
 */
@WebServlet("/AdminDashboardServlet")
public class AdminDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private EmployeeDAO employeeDAO;
    private AttendanceDAO attendanceDAO;
    private LeaveDAO leaveDAO;

    @Override
    public void init() throws ServletException {
        employeeDAO = new EmployeeDAO();
        attendanceDAO = new AttendanceDAO();
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

        // Metrics for dashboard cards
        int totalEmployees = employeeDAO.getTotalEmployeesCount();
        int totalAttendanceRecords = attendanceDAO.getTotalAttendanceCount();
        int pendingLeavesCount = leaveDAO.getPendingLeavesCount();
        int approvedLeavesCount = leaveDAO.getApprovedLeavesCount();

        // Pending leave requests for quick action
        List<LeaveApplication> pendingLeaves = leaveDAO.getPendingLeaves();

        // Recent attendance activity
        List<Attendance> recentAttendance = attendanceDAO.getAllAttendance();
        if (recentAttendance.size() > 6) {
            recentAttendance = recentAttendance.subList(0, 6);
        }

        request.setAttribute("totalEmployees", totalEmployees);
        request.setAttribute("totalAttendanceRecords", totalAttendanceRecords);
        request.setAttribute("pendingLeavesCount", pendingLeavesCount);
        request.setAttribute("approvedLeavesCount", approvedLeavesCount);
        request.setAttribute("pendingLeaves", pendingLeaves);
        request.setAttribute("recentAttendance", recentAttendance);

        // Optional status update alert
        String msg = request.getParameter("msg");
        if ("Approved".equalsIgnoreCase(msg)) {
            request.setAttribute("successMessage", "Leave request has been successfully APPROVED.");
        } else if ("Rejected".equalsIgnoreCase(msg)) {
            request.setAttribute("infoMessage", "Leave request has been REJECTED.");
        }

        request.getRequestDispatcher("/admin-dashboard.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
