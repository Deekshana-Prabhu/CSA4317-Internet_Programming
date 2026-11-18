import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet handling Patient Login, Session Creation, and Cookie Management.
 */
@WebServlet(name = "PatientLoginServlet", urlPatterns = {"/PatientLoginServlet", "/patient-login", "/patient-dashboard"})
public class PatientLoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private PatientDAO patientDAO;
    private AppointmentDAO appointmentDAO;
    private DoctorDAO doctorDAO;

    @Override
    public void init() {
        patientDAO = new PatientDAO();
        appointmentDAO = new AppointmentDAO();
        doctorDAO = new DoctorDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("patient") != null) {
            // Forward to dashboard with populated statistics
            loadDashboardData(request, (Patient) session.getAttribute("patient"));
            request.getRequestDispatcher("/patient.jsp").forward(request, response);
            return;
        }

        // Read Remember Me cookie to pre-fill email if present
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("remember_patient_email".equals(c.getName())) {
                    request.setAttribute("rememberedEmail", c.getValue());
                    request.setAttribute("rememberChecked", "checked");
                }
                if ("patient_lang".equals(c.getName())) {
                    request.setAttribute("patientLang", c.getValue());
                }
            }
        }
        request.setAttribute("activeTab", "login");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String rememberMe = request.getParameter("rememberMe");
        String preferredLang = request.getParameter("preferredLanguage");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Email and Password are required to sign in.");
            request.setAttribute("activeTab", "login");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        Patient patient = patientDAO.loginPatient(email.trim(), password);

        if (patient != null) {
            // Establish HttpSession
            HttpSession session = request.getSession(true);
            session.setAttribute("patient", patient);
            session.setAttribute("userRole", "patient");

            // Handle Remember Me Cookie
            if ("on".equalsIgnoreCase(rememberMe) || "true".equalsIgnoreCase(rememberMe)) {
                Cookie emailCookie = new Cookie("remember_patient_email", patient.getEmail());
                emailCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
                emailCookie.setPath(request.getContextPath().isEmpty() ? "/" : request.getContextPath());
                emailCookie.setHttpOnly(false);
                response.addCookie(emailCookie);
            } else {
                // Clear Remember Me Cookie if unchecked
                Cookie emailCookie = new Cookie("remember_patient_email", "");
                emailCookie.setMaxAge(0);
                emailCookie.setPath(request.getContextPath().isEmpty() ? "/" : request.getContextPath());
                response.addCookie(emailCookie);
            }

            // Handle Preferred Language Cookie
            if (preferredLang != null && !preferredLang.trim().isEmpty()) {
                Cookie langCookie = new Cookie("patient_lang", preferredLang.trim());
                langCookie.setMaxAge(30 * 24 * 60 * 60); // 30 days
                langCookie.setPath(request.getContextPath().isEmpty() ? "/" : request.getContextPath());
                response.addCookie(langCookie);
                session.setAttribute("preferredLang", preferredLang.trim());
            }

            // Populate dashboard attributes and forward
            loadDashboardData(request, patient);
            request.getRequestDispatcher("/patient.jsp").forward(request, response);

        } else {
            request.setAttribute("errorMessage", "Invalid email address or password. Please verify your credentials.");
            request.setAttribute("activeTab", "login");
            request.setAttribute("loginEmail", email.trim());
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }

    private void loadDashboardData(HttpServletRequest request, Patient patient) {
        int[] stats = appointmentDAO.getPatientAppointmentStats(patient.getPatientId());
        request.setAttribute("totalAppointments", stats[0]);
        request.setAttribute("upcomingAppointments", stats[1]);
        request.setAttribute("completedAppointments", stats[2]);

        int totalDoctors = doctorDAO.getTotalDoctorsCount();
        request.setAttribute("availableDoctorsCount", totalDoctors);

        List<Appointment> list = appointmentDAO.getAppointmentsByPatient(patient.getPatientId());
        // Recent 5 appointments
        List<Appointment> recentList = list.size() > 5 ? list.subList(0, 5) : list;
        request.setAttribute("recentAppointments", recentList);
        request.setAttribute("allAppointments", list);
    }
}
