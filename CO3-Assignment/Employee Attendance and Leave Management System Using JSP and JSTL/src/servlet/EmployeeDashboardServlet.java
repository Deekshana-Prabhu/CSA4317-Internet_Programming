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
import model.Employee;
import model.LeaveApplication;

/**
 * Loads metrics, recent attendance, and leave requests for the Employee Dashboard.
 */
@WebServlet("/EmployeeDashboardServlet")
public class EmployeeDashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AttendanceDAO attendanceDAO;
    private LeaveDAO leaveDAO;
    private EmployeeDAO employeeDAO;

    @Override
    public void init() throws ServletException {
        attendanceDAO = new AttendanceDAO();
        leaveDAO = new LeaveDAO();
        employeeDAO = new EmployeeDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Session validation
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("employeeId") == null) {
            response.sendRedirect(request.getContextPath() + "/employee-login.jsp?error=unauthorized");
            return;
        }

        String employeeId = (String) session.getAttribute("employeeId");

        // Refresh employee details if needed
        Employee emp = (Employee) session.getAttribute("loggedInEmployee");
        if (emp == null) {
            emp = employeeDAO.getEmployeeById(employeeId);
            session.setAttribute("loggedInEmployee", emp);
        }

        // Attendance stats
        int totalWorkingDays = attendanceDAO.getTotalWorkingDays(employeeId);
        int presentDays = attendanceDAO.getPresentDays(employeeId);
        int absentDays = attendanceDAO.getAbsentDays(employeeId);

        // Leave balance stats (Standard 20 days annual quota)
        int remainingLeaveBalance = leaveDAO.getRemainingLeaveBalance(employeeId, LeaveDAO.DEFAULT_ANNUAL_LEAVE_QUOTA);
        int approvedLeaveDays = leaveDAO.getApprovedDaysByEmployee(employeeId);

        // Recent records
        List<Attendance> recentAttendance = attendanceDAO.getRecentAttendanceByEmployee(employeeId, 5);
        List<LeaveApplication> recentLeaves = leaveDAO.getRecentLeavesByEmployee(employeeId, 4);

        // Set request attributes
        request.setAttribute("totalWorkingDays", totalWorkingDays);
        request.setAttribute("presentDays", presentDays);
        request.setAttribute("absentDays", absentDays);
        request.setAttribute("remainingLeaveBalance", remainingLeaveBalance);
        request.setAttribute("approvedLeaveDays", approvedLeaveDays);
        request.setAttribute("totalLeaveQuota", LeaveDAO.DEFAULT_ANNUAL_LEAVE_QUOTA);
        request.setAttribute("recentAttendance", recentAttendance);
        request.setAttribute("recentLeaves", recentLeaves);

        // Forward to JSP
        request.getRequestDispatcher("/employee-dashboard.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
