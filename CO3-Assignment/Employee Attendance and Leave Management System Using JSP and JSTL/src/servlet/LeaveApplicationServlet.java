package servlet;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.LeaveDAO;
import model.LeaveApplication;

/**
 * Validates and processes employee leave applications using the POST method.
 */
@WebServlet("/LeaveApplicationServlet")
public class LeaveApplicationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private LeaveDAO leaveDAO;

    @Override
    public void init() throws ServletException {
        leaveDAO = new LeaveDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/apply-leave.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession(false);

        // Security check
        if (session == null || session.getAttribute("employeeId") == null) {
            response.sendRedirect(request.getContextPath() + "/employee-login.jsp?error=unauthorized");
            return;
        }

        String employeeId = (String) session.getAttribute("employeeId");
        String leaveType = request.getParameter("leaveType");
        String fromDateStr = request.getParameter("fromDate");
        String toDateStr = request.getParameter("toDate");
        String reason = request.getParameter("reason");

        // Validate required fields
        if (leaveType == null || leaveType.trim().isEmpty() ||
            fromDateStr == null || fromDateStr.trim().isEmpty() ||
            toDateStr == null || toDateStr.trim().isEmpty() ||
            reason == null || reason.trim().isEmpty()) {

            request.setAttribute("errorMessage", "All fields are required. Please fill in every field.");
            request.setAttribute("leaveType", leaveType);
            request.setAttribute("fromDate", fromDateStr);
            request.setAttribute("toDate", toDateStr);
            request.setAttribute("reason", reason);
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
            return;
        }

        leaveType = leaveType.trim();
        reason = reason.trim();

        LocalDate fromDate;
        LocalDate toDate;
        LocalDate today = LocalDate.now();

        try {
            fromDate = LocalDate.parse(fromDateStr.trim());
            toDate = LocalDate.parse(toDateStr.trim());
        } catch (Exception e) {
            request.setAttribute("errorMessage", "Invalid date format provided. Please use YYYY-MM-DD.");
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
            return;
        }

        // Validate: do not allow past dates
        if (fromDate.isBefore(today)) {
            request.setAttribute("errorMessage", "Leave start date cannot be in the past. Please select today or a future date.");
            request.setAttribute("leaveType", leaveType);
            request.setAttribute("fromDate", fromDateStr);
            request.setAttribute("toDate", toDateStr);
            request.setAttribute("reason", reason);
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
            return;
        }

        // Validate: ensure end date is not earlier than start date
        if (toDate.isBefore(fromDate)) {
            request.setAttribute("errorMessage", "The 'To Date' cannot be earlier than the 'From Date'.");
            request.setAttribute("leaveType", leaveType);
            request.setAttribute("fromDate", fromDateStr);
            request.setAttribute("toDate", toDateStr);
            request.setAttribute("reason", reason);
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
            return;
        }

        // Calculate number of days (inclusive)
        long calculatedDays = ChronoUnit.DAYS.between(fromDate, toDate) + 1;
        int numberOfDays = (int) calculatedDays;

        // Check against remaining leave balance
        int remainingBalance = leaveDAO.getRemainingLeaveBalance(employeeId, LeaveDAO.DEFAULT_ANNUAL_LEAVE_QUOTA);
        if (numberOfDays > remainingBalance) {
            request.setAttribute("errorMessage", "You requested " + numberOfDays + " day(s), but your remaining leave balance is only "
                                                 + remainingBalance + " day(s).");
            request.setAttribute("leaveType", leaveType);
            request.setAttribute("fromDate", fromDateStr);
            request.setAttribute("toDate", toDateStr);
            request.setAttribute("reason", reason);
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
            return;
        }

        // Create LeaveApplication model object
        LeaveApplication leave = new LeaveApplication();
        leave.setEmployeeId(employeeId);
        leave.setLeaveType(leaveType);
        leave.setFromDate(Date.valueOf(fromDate));
        leave.setToDate(Date.valueOf(toDate));
        leave.setNumberOfDays(numberOfDays);
        leave.setReason(reason);
        leave.setStatus("Pending"); // Initial status Pending

        boolean success = leaveDAO.applyLeave(leave);

        if (success) {
            request.setAttribute("successMessage", "Leave application for " + numberOfDays + " day(s) submitted successfully! Your request is currently Pending administrator approval.");
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
        } else {
            request.setAttribute("errorMessage", "Failed to submit leave application due to a database error. Please try again.");
            request.getRequestDispatcher("/apply-leave.jsp").forward(request, response);
        }
    }
}
