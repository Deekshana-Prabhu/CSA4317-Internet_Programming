import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet for managing Patient Profile and Preferences (Language, Cookies).
 */
@WebServlet(name = "PatientProfileServlet", urlPatterns = {"/PatientProfileServlet", "/profile"})
public class PatientProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private PatientDAO patientDAO;

    @Override
    public void init() {
        patientDAO = new PatientDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("patient") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Please+login+first");
            return;
        }

        Patient sessionPatient = (Patient) session.getAttribute("patient");
        Patient freshPatient = patientDAO.getPatientById(sessionPatient.getPatientId());
        if (freshPatient != null) {
            session.setAttribute("patient", freshPatient);
        }

        // Check preferred language cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("patient_lang".equals(c.getName())) {
                    request.setAttribute("selectedLang", c.getValue());
                }
            }
        }

        request.getRequestDispatcher("/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("patient") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Session+expired");
            return;
        }

        Patient patient = (Patient) session.getAttribute("patient");
        String name = request.getParameter("name");
        String ageStr = request.getParameter("age");
        String gender = request.getParameter("gender");
        String mobile = request.getParameter("mobile");
        String address = request.getParameter("address");
        String language = request.getParameter("language");

        if (name == null || name.trim().isEmpty() || mobile == null || mobile.trim().isEmpty() 
                || ageStr == null || ageStr.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Name, Age, and Mobile number are required fields.");
            doGet(request, response);
            return;
        }

        try {
            int age = Integer.parseInt(ageStr.trim());
            patient.setName(name.trim());
            patient.setAge(age);
            patient.setGender(gender != null ? gender.trim() : patient.getGender());
            patient.setMobile(mobile.trim());
            patient.setAddress(address != null ? address.trim() : "");

            boolean updated = patientDAO.updatePatient(patient);
            if (updated) {
                session.setAttribute("patient", patient);

                // Update preferred language cookie
                if (language != null && !language.trim().isEmpty()) {
                    Cookie langCookie = new Cookie("patient_lang", language.trim());
                    langCookie.setMaxAge(30 * 24 * 60 * 60);
                    langCookie.setPath(request.getContextPath().isEmpty() ? "/" : request.getContextPath());
                    response.addCookie(langCookie);
                    session.setAttribute("preferredLang", language.trim());
                }

                request.setAttribute("successMessage", "Profile details and preferences updated successfully!");
            } else {
                request.setAttribute("errorMessage", "Failed to update profile in database.");
            }
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "Invalid numeric age value.");
        }

        doGet(request, response);
    }
}
