import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet for Hospital Administrators to manage:
 * 1. All Appointments and their status (Confirmed, Completed, Cancelled)
 * 2. Registered Patient details
 */
@WebServlet(name = "AppointmentManagementServlet", urlPatterns = {"/AppointmentManagementServlet", "/admin/appointments", "/admin/patients"})
public class AppointmentManagementServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AppointmentDAO appointmentDAO;
    private PatientDAO patientDAO;

    @Override
    public void init() {
        appointmentDAO = new AppointmentDAO();
        patientDAO = new PatientDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Admin+session+required");
            return;
        }

        String servletPath = request.getServletPath();
        String view = request.getParameter("view");

        if ("/admin/patients".equals(servletPath) || "patients".equalsIgnoreCase(view)) {
            // View Registered Patients
            List<Patient> patients = patientDAO.getAllPatients();
            request.setAttribute("patientList", patients);
            request.getRequestDispatcher("/admin-patients.jsp").forward(request, response);
        } else {
            // View All Appointments
            List<Appointment> appointments = appointmentDAO.getAllAppointments();
            request.setAttribute("appointmentList", appointments);
            request.getRequestDispatcher("/admin-appointments.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Admin+session+required");
            return;
        }

        String action = request.getParameter("action");
        String appointmentId = request.getParameter("appointmentId");
        String newStatus = request.getParameter("status");

        if ("updateStatus".equalsIgnoreCase(action) && appointmentId != null && newStatus != null) {
            boolean updated = appointmentDAO.updateAppointmentStatus(appointmentId.trim(), newStatus.trim());
            if (updated) {
                request.setAttribute("successMessage", "Status for appointment " + appointmentId.trim() + " updated to " + newStatus.trim() + ".");
            } else {
                request.setAttribute("errorMessage", "Failed to update appointment status.");
            }
        }

        doGet(request, response);
    }
}
