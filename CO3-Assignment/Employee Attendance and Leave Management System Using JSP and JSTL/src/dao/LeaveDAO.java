package dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import DB.DatabaseConnection;
import model.LeaveApplication;

public class LeaveDAO {

    public static final int DEFAULT_ANNUAL_LEAVE_QUOTA = 20;

    /**
     * Submits a new leave application with default status 'Pending'.
     */
    public boolean applyLeave(LeaveApplication leave) {
        Connection conn = null;
        PreparedStatement ps = null;
        boolean success = false;

        String sql = "INSERT INTO Leave_Applications (employee_id, leave_type, from_date, to_date, number_of_days, reason, status) "
                   + "VALUES (?, ?, ?, ?, ?, ?, 'Pending')";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, leave.getEmployeeId());
            ps.setString(2, leave.getLeaveType());
            ps.setDate(3, leave.getFromDate());
            ps.setDate(4, leave.getToDate());
            ps.setInt(5, leave.getNumberOfDays());
            ps.setString(6, leave.getReason());

            success = ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, null);
        }
        return success;
    }

    /**
     * Retrieves all leave applications submitted by a specific employee.
     */
    public List<LeaveApplication> getLeavesByEmployee(String employeeId) {
        List<LeaveApplication> list = new ArrayList<LeaveApplication>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT l.leave_id, l.employee_id, e.employee_name, l.leave_type, "
                   + "l.from_date, l.to_date, l.number_of_days, l.reason, l.status, l.applied_at "
                   + "FROM Leave_Applications l "
                   + "JOIN Employees e ON l.employee_id = e.employee_id "
                   + "WHERE l.employee_id = ? "
                   + "ORDER BY l.applied_at DESC, l.leave_id DESC";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
            rs = ps.executeQuery();

            while (rs.next()) {
                LeaveApplication app = new LeaveApplication();
                app.setLeaveId(rs.getInt("leave_id"));
                app.setEmployeeId(rs.getString("employee_id"));
                app.setEmployeeName(rs.getString("employee_name"));
                app.setLeaveType(rs.getString("leave_type"));
                app.setFromDate(rs.getDate("from_date"));
                app.setToDate(rs.getDate("to_date"));
                app.setNumberOfDays(rs.getInt("number_of_days"));
                app.setReason(rs.getString("reason"));
                app.setStatus(rs.getString("status"));
                app.setAppliedAt(rs.getTimestamp("applied_at"));
                list.add(app);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves recent leave applications for employee dashboard.
     */
    public List<LeaveApplication> getRecentLeavesByEmployee(String employeeId, int limit) {
        List<LeaveApplication> list = new ArrayList<LeaveApplication>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT l.leave_id, l.employee_id, e.employee_name, l.leave_type, "
                   + "l.from_date, l.to_date, l.number_of_days, l.reason, l.status, l.applied_at "
                   + "FROM Leave_Applications l "
                   + "JOIN Employees e ON l.employee_id = e.employee_id "
                   + "WHERE l.employee_id = ? "
                   + "ORDER BY l.applied_at DESC, l.leave_id DESC LIMIT ?";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
            ps.setInt(2, limit);
            rs = ps.executeQuery();

            while (rs.next()) {
                LeaveApplication app = new LeaveApplication();
                app.setLeaveId(rs.getInt("leave_id"));
                app.setEmployeeId(rs.getString("employee_id"));
                app.setEmployeeName(rs.getString("employee_name"));
                app.setLeaveType(rs.getString("leave_type"));
                app.setFromDate(rs.getDate("from_date"));
                app.setToDate(rs.getDate("to_date"));
                app.setNumberOfDays(rs.getInt("number_of_days"));
                app.setReason(rs.getString("reason"));
                app.setStatus(rs.getString("status"));
                app.setAppliedAt(rs.getTimestamp("applied_at"));
                list.add(app);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves all leave applications for administrator view.
     */
    public List<LeaveApplication> getAllLeaves() {
        List<LeaveApplication> list = new ArrayList<LeaveApplication>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT l.leave_id, l.employee_id, e.employee_name, l.leave_type, "
                   + "l.from_date, l.to_date, l.number_of_days, l.reason, l.status, l.applied_at "
                   + "FROM Leave_Applications l "
                   + "JOIN Employees e ON l.employee_id = e.employee_id "
                   + "ORDER BY CASE WHEN l.status = 'Pending' THEN 1 ELSE 2 END, l.applied_at DESC";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                LeaveApplication app = new LeaveApplication();
                app.setLeaveId(rs.getInt("leave_id"));
                app.setEmployeeId(rs.getString("employee_id"));
                app.setEmployeeName(rs.getString("employee_name"));
                app.setLeaveType(rs.getString("leave_type"));
                app.setFromDate(rs.getDate("from_date"));
                app.setToDate(rs.getDate("to_date"));
                app.setNumberOfDays(rs.getInt("number_of_days"));
                app.setReason(rs.getString("reason"));
                app.setStatus(rs.getString("status"));
                app.setAppliedAt(rs.getTimestamp("applied_at"));
                list.add(app);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves only pending leave applications for admin quick review.
     */
    public List<LeaveApplication> getPendingLeaves() {
        List<LeaveApplication> list = new ArrayList<LeaveApplication>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT l.leave_id, l.employee_id, e.employee_name, l.leave_type, "
                   + "l.from_date, l.to_date, l.number_of_days, l.reason, l.status, l.applied_at "
                   + "FROM Leave_Applications l "
                   + "JOIN Employees e ON l.employee_id = e.employee_id "
                   + "WHERE l.status = 'Pending' "
                   + "ORDER BY l.applied_at ASC";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                LeaveApplication app = new LeaveApplication();
                app.setLeaveId(rs.getInt("leave_id"));
                app.setEmployeeId(rs.getString("employee_id"));
                app.setEmployeeName(rs.getString("employee_name"));
                app.setLeaveType(rs.getString("leave_type"));
                app.setFromDate(rs.getDate("from_date"));
                app.setToDate(rs.getDate("to_date"));
                app.setNumberOfDays(rs.getInt("number_of_days"));
                app.setReason(rs.getString("reason"));
                app.setStatus(rs.getString("status"));
                app.setAppliedAt(rs.getTimestamp("applied_at"));
                list.add(app);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Updates leave status (Approved / Rejected) by admin.
     */
    public boolean updateLeaveStatus(int leaveId, String status) {
        Connection conn = null;
        PreparedStatement ps = null;
        boolean success = false;

        String sql = "UPDATE Leave_Applications SET status = ? WHERE leave_id = ?";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, status);
            ps.setInt(2, leaveId);

            success = ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, null);
        }
        return success;
    }

    /**
     * Counts pending leave requests.
     */
    public int getPendingLeavesCount() {
        int count = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COUNT(*) FROM Leave_Applications WHERE status = 'Pending'";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return count;
    }

    /**
     * Counts approved leave requests.
     */
    public int getApprovedLeavesCount() {
        int count = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COUNT(*) FROM Leave_Applications WHERE status = 'Approved'";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return count;
    }

    /**
     * Calculates total approved leave days taken by an employee.
     */
    public int getApprovedDaysByEmployee(String employeeId) {
        int days = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COALESCE(SUM(number_of_days), 0) FROM Leave_Applications "
                   + "WHERE employee_id = ? AND status = 'Approved'";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
            rs = ps.executeQuery();
            if (rs.next()) {
                days = rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return days;
    }

    /**
     * Returns remaining leave balance for employee.
     */
    public int getRemainingLeaveBalance(String employeeId, int totalQuota) {
        int approvedDays = getApprovedDaysByEmployee(employeeId);
        int remaining = totalQuota - approvedDays;
        return Math.max(remaining, 0);
    }
}
