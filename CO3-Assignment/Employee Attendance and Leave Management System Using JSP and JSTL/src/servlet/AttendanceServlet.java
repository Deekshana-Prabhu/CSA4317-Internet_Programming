package servlet;

import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.AttendanceDAO;
import model.Attendance;

/**
 * Handles employee attendance view, date-filtering, and quick attendance clock-in.
 * Also supports administrator attendance overview.
 */
@WebServlet("/AttendanceServlet")
public class AttendanceServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AttendanceDAO attendanceDAO;

    @Override
    public void init() throws ServletException {
        attendanceDAO = new AttendanceDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=unauthorized");
            return;
        }

        String userRole = (String) session.getAttribute("userRole");
        String employeeId = (String) session.getAttribute("employeeId");

        // If admin is viewing attendance records
        if ("ADMIN".equals(userRole)) {
            handleAdminAttendance(request, response);
            return;
        }

        // Must be an authenticated employee
        if (employeeId == null) {
            response.sendRedirect(request.getContextPath() + "/employee-login.jsp?error=unauthorized");
            return;
        }

        // Handle quick clock-in / clock-out action if requested
        String action = request.getParameter("action");
        if ("mark_today".equals(action)) {
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();
            Date sqlDate = Date.valueOf(today);
            Time sqlTime = Time.valueOf(now.withNano(0));

            boolean success = attendanceDAO.recordAttendance(employeeId, sqlDate, sqlTime, null, "Present");
            if (success) {
                request.setAttribute("successMessage", "Today's attendance marked successfully as Present at " + sqlTime + "!");
            } else {
                request.setAttribute("errorMessage", "Failed to mark attendance. Please try again.");
            }
        }

        // Filtering parameters
        String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");

        List<Attendance> attendanceList;
        if ((startDate != null && !startDate.trim().isEmpty()) || (endDate != null && !endDate.trim().isEmpty())) {
            attendanceList = attendanceDAO.getAttendanceByEmployeeAndFilter(employeeId, startDate, endDate);
        } else {
            attendanceList = attendanceDAO.getAttendanceByEmployee(employeeId);
        }

        // Calculate counts for the view
        int presentCount = 0;
        int absentCount = 0;
        for (Attendance a : attendanceList) {
            if ("Present".equalsIgnoreCase(a.getStatus())) {
                presentCount++;
            } else if ("Absent".equalsIgnoreCase(a.getStatus())) {
                absentCount++;
            }
        }

        request.setAttribute("attendanceList", attendanceList);
        request.setAttribute("totalCount", attendanceList.size());
        request.setAttribute("presentCount", presentCount);
        request.setAttribute("absentCount", absentCount);
        request.setAttribute("filterStartDate", startDate != null ? startDate : "");
        request.setAttribute("filterEndDate", endDate != null ? endDate : "");

        request.getRequestDispatcher("/attendance.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

    private void handleAdminAttendance(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String empFilter = request.getParameter("empFilter");
        String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");

        List<Attendance> attendanceList = attendanceDAO.getAllAttendanceWithFilter(empFilter, startDate, endDate);

        int presentCount = 0;
        int absentCount = 0;
        for (Attendance a : attendanceList) {
            if ("Present".equalsIgnoreCase(a.getStatus())) {
                presentCount++;
            } else {
                absentCount++;
            }
        }

        request.setAttribute("attendanceList", attendanceList);
        request.setAttribute("totalCount", attendanceList.size());
        request.setAttribute("presentCount", presentCount);
        request.setAttribute("absentCount", absentCount);
        request.setAttribute("empFilter", empFilter != null ? empFilter : "ALL");
        request.setAttribute("filterStartDate", startDate != null ? startDate : "");
        request.setAttribute("filterEndDate", endDate != null ? endDate : "");

        request.getRequestDispatcher("/admin-attendance.jsp").forward(request, response);
    }
}
