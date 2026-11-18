package servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.AttendanceDAO;
import dao.EmployeeDAO;
import dao.LeaveDAO;
import model.Employee;

/**
 * Loads employee profiles and individual attendance/leave summaries for the Administrator.
 */
@WebServlet("/EmployeeDetailsServlet")
public class EmployeeDetailsServlet extends HttpServlet {
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

        List<Employee> employeeList = employeeDAO.getAllEmployees();

        // Create summary stats map per employee
        List<Map<String, Object>> employeeSummaryList = new ArrayList<Map<String, Object>>();

        for (Employee emp : employeeList) {
            Map<String, Object> summary = new HashMap<String, Object>();
            summary.put("employeeId", emp.getEmployeeId());
            summary.put("employeeName", emp.getEmployeeName());
            summary.put("email", emp.getEmail());
            summary.put("department", emp.getDepartment());
            summary.put("username", emp.getUsername());
            summary.put("createdAt", emp.getCreatedAt());

            int workingDays = attendanceDAO.getTotalWorkingDays(emp.getEmployeeId());
            int presentDays = attendanceDAO.getPresentDays(emp.getEmployeeId());
            int absentDays = attendanceDAO.getAbsentDays(emp.getEmployeeId());
            int approvedLeaveDays = leaveDAO.getApprovedDaysByEmployee(emp.getEmployeeId());
            int remainingLeaves = leaveDAO.getRemainingLeaveBalance(emp.getEmployeeId(), LeaveDAO.DEFAULT_ANNUAL_LEAVE_QUOTA);

            summary.put("workingDays", workingDays);
            summary.put("presentDays", presentDays);
            summary.put("absentDays", absentDays);
            summary.put("approvedLeaveDays", approvedLeaveDays);
            summary.put("remainingLeaves", remainingLeaves);

            employeeSummaryList.add(summary);
        }

        request.setAttribute("employeeList", employeeSummaryList);
        request.setAttribute("totalEmployees", employeeList.size());

        request.getRequestDispatcher("/employee-details.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
