import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet to display and manage a Patient's appointment history.
 * Supports viewing appointments and cancelling confirmed appointments.
 */
@WebServlet(name = "MyAppointmentsServlet", urlPatterns = {"/MyAppointmentsServlet", "/my-appointments"})
public class MyAppointmentsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AppointmentDAO appointmentDAO;

    @Override
    public void init() {
        appointmentDAO = new AppointmentDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("patient") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Please+login+to+view+your+appointments");
            return;
        }

        Patient patient = (Patient) session.getAttribute("patient");
        List<Appointment> appointments = appointmentDAO.getAppointmentsByPatient(patient.getPatientId());

        request.setAttribute("appointmentList", appointments);
        request.getRequestDispatcher("/appointments.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("patient") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Session+expired");
            return;
        }

        Patient patient = (Patient) session.getAttribute("patient");
        String action = request.getParameter("action");
        String appointmentId = request.getParameter("appointmentId");

        if ("cancel".equalsIgnoreCase(action) && appointmentId != null && !appointmentId.trim().isEmpty()) {
            Appointment apt = appointmentDAO.getAppointmentById(appointmentId.trim());
            if (apt != null && apt.getPatientId() == patient.getPatientId()) {
                if ("Confirmed".equalsIgnoreCase(apt.getStatus())) {
                    boolean cancelled = appointmentDAO.updateAppointmentStatus(appointmentId.trim(), "Cancelled");
                    if (cancelled) {
                        request.setAttribute("successMessage", "Appointment " + appointmentId.trim() + " has been cancelled successfully.");
                    } else {
                        request.setAttribute("errorMessage", "Unable to cancel appointment. Please try again.");
                    }
                } else {
                    request.setAttribute("errorMessage", "Only Confirmed appointments can be cancelled.");
                }
            } else {
                request.setAttribute("errorMessage", "Appointment not found or unauthorized action.");
            }
        }

        List<Appointment> appointments = appointmentDAO.getAppointmentsByPatient(patient.getPatientId());
        request.setAttribute("appointmentList", appointments);
        request.getRequestDispatcher("/appointments.jsp").forward(request, response);
    }
}
