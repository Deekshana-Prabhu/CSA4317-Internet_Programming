import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet handling Administrator Authentication and Dashboard routing.
 */
@WebServlet(name = "AdminLoginServlet", urlPatterns = {"/AdminLoginServlet", "/admin-login", "/admin-dashboard"})
public class AdminLoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AdminDAO adminDAO;
    private AppointmentDAO appointmentDAO;
    private DoctorDAO doctorDAO;
    private PatientDAO patientDAO;

    @Override
    public void init() {
        adminDAO = new AdminDAO();
        appointmentDAO = new AppointmentDAO();
        doctorDAO = new DoctorDAO();
        patientDAO = new PatientDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("admin") != null) {
            loadAdminDashboardData(request);
            request.getRequestDispatcher("/admin.jsp").forward(request, response);
            return;
        }

        request.setAttribute("activeTab", "admin");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Admin username and password are required.");
            request.setAttribute("activeTab", "admin");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        Admin admin = adminDAO.authenticateAdmin(username.trim(), password);

        if (admin != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("admin", admin);
            session.setAttribute("userRole", "admin");

            loadAdminDashboardData(request);
            request.getRequestDispatcher("/admin.jsp").forward(request, response);
        } else {
            request.setAttribute("errorMessage", "Invalid administrator credentials. Access denied.");
            request.setAttribute("activeTab", "admin");
            request.setAttribute("adminUsername", username.trim());
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }

    private void loadAdminDashboardData(HttpServletRequest request) {
        int[] stats = appointmentDAO.getAdminDashboardStats();
        request.setAttribute("totalDoctors", stats[0]);
        request.setAttribute("totalPatients", stats[1]);
        request.setAttribute("totalAppointments", stats[2]);
        request.setAttribute("upcomingAppointments", stats[3]);

        List<Appointment> allAppointments = appointmentDAO.getAllAppointments();
        List<Appointment> recentList = allAppointments.size() > 6 ? allAppointments.subList(0, 6) : allAppointments;
        request.setAttribute("recentAppointments", recentList);
        request.setAttribute("allAppointments", allAppointments);
        request.setAttribute("doctorList", doctorDAO.getAllDoctors());
        request.setAttribute("patientList", patientDAO.getAllPatients());
    }
}
