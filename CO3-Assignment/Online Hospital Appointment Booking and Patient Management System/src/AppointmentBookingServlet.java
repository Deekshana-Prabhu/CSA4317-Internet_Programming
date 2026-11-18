import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Random;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet handling Appointment Booking and Duplicate Slot Prevention.
 * Enforces session check, past-date prohibition, slot availability, and confirmation generation.
 */
@WebServlet(name = "AppointmentBookingServlet", urlPatterns = {"/AppointmentBookingServlet", "/booking"})
public class AppointmentBookingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private DoctorDAO doctorDAO;
    private AppointmentDAO appointmentDAO;

    @Override
    public void init() {
        doctorDAO = new DoctorDAO();
        appointmentDAO = new AppointmentDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("patient") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Please+login+to+book+an+appointment");
            return;
        }

        prepareBookingFormData(request);
        request.getRequestDispatcher("/booking.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("patient") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Session+expired.+Please+login+again");
            return;
        }

        Patient currentPatient = (Patient) session.getAttribute("patient");

        String doctorIdStr = request.getParameter("doctorId");
        String appointmentDateStr = request.getParameter("appointmentDate");
        String appointmentTime = request.getParameter("appointmentTime");
        String reason = request.getParameter("reason");

        // Retain form input on error
        request.setAttribute("selectedDoctorId", doctorIdStr);
        request.setAttribute("selectedDate", appointmentDateStr);
        request.setAttribute("selectedTime", appointmentTime);
        request.setAttribute("enteredReason", reason);

        // 1. Required field checks
        if (doctorIdStr == null || doctorIdStr.trim().isEmpty() 
                || appointmentDateStr == null || appointmentDateStr.trim().isEmpty() 
                || appointmentTime == null || appointmentTime.trim().isEmpty()) {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "Doctor, appointment date, and time slot are required fields.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        int doctorId;
        try {
            doctorId = Integer.parseInt(doctorIdStr.trim());
        } catch (NumberFormatException e) {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "Invalid doctor selection.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        Doctor doctor = doctorDAO.getDoctorById(doctorId);
        if (doctor == null) {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "Selected doctor could not be found.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        // 2. Validate past appointment date
        LocalDate apptLocalDate;
        LocalDate today = LocalDate.now();
        try {
            apptLocalDate = LocalDate.parse(appointmentDateStr.trim());
            if (apptLocalDate.isBefore(today)) {
                prepareBookingFormData(request);
                request.setAttribute("errorMessage", "Past appointment dates are not permitted. Please select today or a future date.");
                request.getRequestDispatcher("/booking.jsp").forward(request, response);
                return;
            }
        } catch (DateTimeParseException e) {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "Invalid appointment date format. Please use YYYY-MM-DD.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        Date sqlDate = Date.valueOf(apptLocalDate);

        // 3. Duplicate Booking Prevention: Check if the same patient already has an active appointment for this slot
        if (appointmentDAO.hasPatientAlreadyBookedSlot(currentPatient.getPatientId(), doctorId, sqlDate, appointmentTime.trim())) {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "You already have an active appointment scheduled with " 
                                               + doctor.getName() + " on " + appointmentDateStr + " at " + appointmentTime + ".");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        // 4. Duplicate Booking Prevention: Check if this doctor slot is already booked by another patient
        if (!appointmentDAO.isSlotAvailable(doctorId, sqlDate, appointmentTime.trim())) {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "The selected time slot (" + appointmentTime + ") is already booked for " 
                                               + doctor.getName() + " on " + appointmentDateStr + ". Please choose a different date or time slot.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
            return;
        }

        // 5. Generate Unique Appointment ID (e.g. APT-2026-XXXX)
        String uniqueId = "APT-" + today.getYear() + "-" + (1000 + new Random().nextInt(9000));
        while (appointmentDAO.getAppointmentById(uniqueId) != null) {
            uniqueId = "APT-" + today.getYear() + "-" + (1000 + new Random().nextInt(9000));
        }

        // 6. Create and Save Appointment in MySQL
        Appointment newAppointment = new Appointment();
        newAppointment.setAppointmentId(uniqueId);
        newAppointment.setPatientId(currentPatient.getPatientId());
        newAppointment.setDoctorId(doctorId);
        newAppointment.setAppointmentDate(sqlDate);
        newAppointment.setAppointmentTime(appointmentTime.trim());
        newAppointment.setReason(reason != null ? reason.trim() : "General Consultation");
        newAppointment.setStatus("Confirmed");

        // Display details
        newAppointment.setDoctorName(doctor.getName());
        newAppointment.setSpecialization(doctor.getSpecialization());
        newAppointment.setFee(doctor.getFee());
        newAppointment.setPatientName(currentPatient.getName());
        newAppointment.setPatientEmail(currentPatient.getEmail());
        newAppointment.setPatientMobile(currentPatient.getMobile());

        boolean booked = appointmentDAO.bookAppointment(newAppointment);

        if (booked) {
            // Put in session and request to display on confirmation.jsp
            session.setAttribute("latestAppointment", newAppointment);
            request.setAttribute("appointment", newAppointment);
            request.setAttribute("successMessage", "Your appointment has been successfully booked and confirmed!");
            request.getRequestDispatcher("/confirmation.jsp").forward(request, response);
        } else {
            prepareBookingFormData(request);
            request.setAttribute("errorMessage", "The selected time slot was just booked by another patient. Please choose a different slot.");
            request.getRequestDispatcher("/booking.jsp").forward(request, response);
        }
    }

    private void prepareBookingFormData(HttpServletRequest request) {
        List<Doctor> doctors = doctorDAO.getAllDoctors();
        request.setAttribute("doctorList", doctors);
        request.setAttribute("timeSlots", appointmentDAO.getStandardTimeSlots());
        request.setAttribute("todayDate", LocalDate.now().toString());

        // Pre-select doctor if doctorId passed in query
        String docParam = request.getParameter("doctorId");
        if (docParam != null && !docParam.trim().isEmpty()) {
            request.setAttribute("selectedDoctorId", docParam.trim());
        }
    }
}
