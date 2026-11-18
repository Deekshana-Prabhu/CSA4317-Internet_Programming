package dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import DB.DatabaseConnection;
import model.Attendance;

public class AttendanceDAO {

    /**
     * Retrieves all attendance records for a specific employee.
     */
    public List<Attendance> getAttendanceByEmployee(String employeeId) {
        List<Attendance> list = new ArrayList<Attendance>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT a.attendance_id, a.employee_id, e.employee_name, a.attendance_date, "
                   + "a.check_in, a.check_out, a.status "
                   + "FROM Attendance a "
                   + "JOIN Employees e ON a.employee_id = e.employee_id "
                   + "WHERE a.employee_id = ? "
                   + "ORDER BY a.attendance_date DESC";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
            rs = ps.executeQuery();

            while (rs.next()) {
                Attendance att = new Attendance();
                att.setAttendanceId(rs.getInt("attendance_id"));
                att.setEmployeeId(rs.getString("employee_id"));
                att.setEmployeeName(rs.getString("employee_name"));
                att.setAttendanceDate(rs.getDate("attendance_date"));
                att.setCheckIn(rs.getTime("check_in"));
                att.setCheckOut(rs.getTime("check_out"));
                att.setStatus(rs.getString("status"));
                list.add(att);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves attendance records for an employee within a date range filter.
     */
    public List<Attendance> getAttendanceByEmployeeAndFilter(String employeeId, String startDate, String endDate) {
        List<Attendance> list = new ArrayList<Attendance>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        StringBuilder sql = new StringBuilder(
            "SELECT a.attendance_id, a.employee_id, e.employee_name, a.attendance_date, "
            + "a.check_in, a.check_out, a.status "
            + "FROM Attendance a "
            + "JOIN Employees e ON a.employee_id = e.employee_id "
            + "WHERE a.employee_id = ? "
        );

        boolean hasStart = startDate != null && !startDate.trim().isEmpty();
        boolean hasEnd = endDate != null && !endDate.trim().isEmpty();

        if (hasStart) {
            sql.append(" AND a.attendance_date >= ?");
        }
        if (hasEnd) {
            sql.append(" AND a.attendance_date <= ?");
        }
        sql.append(" ORDER BY a.attendance_date DESC");

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql.toString());
            int idx = 1;
            ps.setString(idx++, employeeId);
            if (hasStart) {
                ps.setDate(idx++, Date.valueOf(startDate.trim()));
            }
            if (hasEnd) {
                ps.setDate(idx++, Date.valueOf(endDate.trim()));
            }

            rs = ps.executeQuery();
            while (rs.next()) {
                Attendance att = new Attendance();
                att.setAttendanceId(rs.getInt("attendance_id"));
                att.setEmployeeId(rs.getString("employee_id"));
                att.setEmployeeName(rs.getString("employee_name"));
                att.setAttendanceDate(rs.getDate("attendance_date"));
                att.setCheckIn(rs.getTime("check_in"));
                att.setCheckOut(rs.getTime("check_out"));
                att.setStatus(rs.getString("status"));
                list.add(att);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves recent attendance records for employee dashboard.
     */
    public List<Attendance> getRecentAttendanceByEmployee(String employeeId, int limit) {
        List<Attendance> list = new ArrayList<Attendance>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT a.attendance_id, a.employee_id, e.employee_name, a.attendance_date, "
                   + "a.check_in, a.check_out, a.status "
                   + "FROM Attendance a "
                   + "JOIN Employees e ON a.employee_id = e.employee_id "
                   + "WHERE a.employee_id = ? "
                   + "ORDER BY a.attendance_date DESC LIMIT ?";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
            ps.setInt(2, limit);
            rs = ps.executeQuery();

            while (rs.next()) {
                Attendance att = new Attendance();
                att.setAttendanceId(rs.getInt("attendance_id"));
                att.setEmployeeId(rs.getString("employee_id"));
                att.setEmployeeName(rs.getString("employee_name"));
                att.setAttendanceDate(rs.getDate("attendance_date"));
                att.setCheckIn(rs.getTime("check_in"));
                att.setCheckOut(rs.getTime("check_out"));
                att.setStatus(rs.getString("status"));
                list.add(att);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves all attendance records for admin view.
     */
    public List<Attendance> getAllAttendance() {
        List<Attendance> list = new ArrayList<Attendance>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT a.attendance_id, a.employee_id, e.employee_name, a.attendance_date, "
                   + "a.check_in, a.check_out, a.status "
                   + "FROM Attendance a "
                   + "JOIN Employees e ON a.employee_id = e.employee_id "
                   + "ORDER BY a.attendance_date DESC, a.employee_id ASC";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                Attendance att = new Attendance();
                att.setAttendanceId(rs.getInt("attendance_id"));
                att.setEmployeeId(rs.getString("employee_id"));
                att.setEmployeeName(rs.getString("employee_name"));
                att.setAttendanceDate(rs.getDate("attendance_date"));
                att.setCheckIn(rs.getTime("check_in"));
                att.setCheckOut(rs.getTime("check_out"));
                att.setStatus(rs.getString("status"));
                list.add(att);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Retrieves all attendance records with optional employee and date filtering for admin.
     */
    public List<Attendance> getAllAttendanceWithFilter(String empFilter, String startDate, String endDate) {
        List<Attendance> list = new ArrayList<Attendance>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        StringBuilder sql = new StringBuilder(
            "SELECT a.attendance_id, a.employee_id, e.employee_name, a.attendance_date, "
            + "a.check_in, a.check_out, a.status "
            + "FROM Attendance a "
            + "JOIN Employees e ON a.employee_id = e.employee_id "
            + "WHERE 1=1 "
        );

        boolean hasEmp = empFilter != null && !empFilter.trim().isEmpty() && !empFilter.equals("ALL");
        boolean hasStart = startDate != null && !startDate.trim().isEmpty();
        boolean hasEnd = endDate != null && !endDate.trim().isEmpty();

        if (hasEmp) {
            sql.append(" AND a.employee_id = ?");
        }
        if (hasStart) {
            sql.append(" AND a.attendance_date >= ?");
        }
        if (hasEnd) {
            sql.append(" AND a.attendance_date <= ?");
        }
        sql.append(" ORDER BY a.attendance_date DESC, a.employee_id ASC");

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql.toString());
            int idx = 1;
            if (hasEmp) {
                ps.setString(idx++, empFilter.trim());
            }
            if (hasStart) {
                ps.setDate(idx++, Date.valueOf(startDate.trim()));
            }
            if (hasEnd) {
                ps.setDate(idx++, Date.valueOf(endDate.trim()));
            }

            rs = ps.executeQuery();
            while (rs.next()) {
                Attendance att = new Attendance();
                att.setAttendanceId(rs.getInt("attendance_id"));
                att.setEmployeeId(rs.getString("employee_id"));
                att.setEmployeeName(rs.getString("employee_name"));
                att.setAttendanceDate(rs.getDate("attendance_date"));
                att.setCheckIn(rs.getTime("check_in"));
                att.setCheckOut(rs.getTime("check_out"));
                att.setStatus(rs.getString("status"));
                list.add(att);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, rs);
        }
        return list;
    }

    /**
     * Total working days recorded for an employee.
     */
    public int getTotalWorkingDays(String employeeId) {
        int count = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COUNT(*) FROM Attendance WHERE employee_id = ?";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
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
     * Count of present days for an employee.
     */
    public int getPresentDays(String employeeId) {
        int count = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COUNT(*) FROM Attendance WHERE employee_id = ? AND status = 'Present'";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
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
     * Count of absent days for an employee.
     */
    public int getAbsentDays(String employeeId) {
        int count = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COUNT(*) FROM Attendance WHERE employee_id = ? AND status = 'Absent'";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
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
     * Total attendance records across all employees.
     */
    public int getTotalAttendanceCount() {
        int count = 0;
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        String sql = "SELECT COUNT(*) FROM Attendance";

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
     * Records or updates employee check-in / check-out attendance.
     */
    public boolean recordAttendance(String employeeId, Date date, Time checkIn, Time checkOut, String status) {
        Connection conn = null;
        PreparedStatement ps = null;
        boolean success = false;

        String sql = "INSERT INTO Attendance (employee_id, attendance_date, check_in, check_out, status) "
                   + "VALUES (?, ?, ?, ?, ?) "
                   + "ON DUPLICATE KEY UPDATE check_in = COALESCE(?, check_in), "
                   + "check_out = COALESCE(?, check_out), status = ?";

        try {
            conn = DatabaseConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, employeeId);
            ps.setDate(2, date);
            ps.setTime(3, checkIn);
            ps.setTime(4, checkOut);
            ps.setString(5, status);

            ps.setTime(6, checkIn);
            ps.setTime(7, checkOut);
            ps.setString(8, status);

            success = ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeAll(conn, ps, null);
        }
        return success;
    }
}
