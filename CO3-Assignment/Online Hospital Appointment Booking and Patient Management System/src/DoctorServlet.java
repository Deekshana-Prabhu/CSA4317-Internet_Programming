import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet to display doctor details and multi-speciality doctor cards.
 * Uses DoctorDAO to fetch dynamic MySQL records for JSTL display.
 */
@WebServlet(name = "DoctorServlet", urlPatterns = {"/DoctorServlet", "/doctors"})
public class DoctorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private DoctorDAO doctorDAO;

    @Override
    public void init() {
        doctorDAO = new DoctorDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String specFilter = request.getParameter("specialization");

        List<Doctor> doctors;
        if (specFilter != null && !specFilter.trim().isEmpty() && !specFilter.equalsIgnoreCase("All")) {
            doctors = doctorDAO.getDoctorsBySpecialization(specFilter.trim());
            request.setAttribute("selectedSpecialization", specFilter.trim());
        } else {
            doctors = doctorDAO.getAllDoctors();
            request.setAttribute("selectedSpecialization", "All");
        }

        List<String> specializations = doctorDAO.getAllSpecializations();

        request.setAttribute("doctorList", doctors);
        request.setAttribute("specializationList", specializations);

        request.getRequestDispatcher("/doctors.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}
