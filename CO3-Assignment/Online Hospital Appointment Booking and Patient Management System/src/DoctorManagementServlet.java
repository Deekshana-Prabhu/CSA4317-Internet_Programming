import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet for Hospital Administrators to manage Doctors:
 * Add doctor, Edit doctor, Delete doctor, List doctors.
 */
@WebServlet(name = "DoctorManagementServlet", urlPatterns = {"/DoctorManagementServlet", "/admin/doctors"})
public class DoctorManagementServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private DoctorDAO doctorDAO;

    @Override
    public void init() {
        doctorDAO = new DoctorDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=Admin+session+required");
            return;
        }

        String editIdStr = request.getParameter("editId");
        if (editIdStr != null && !editIdStr.trim().isEmpty()) {
            try {
                int editId = Integer.parseInt(editIdStr.trim());
                Doctor editDoc = doctorDAO.getDoctorById(editId);
                request.setAttribute("editDoctor", editDoc);
            } catch (NumberFormatException ignored) {}
        }

        List<Doctor> doctors = doctorDAO.getAllDoctors();
        request.setAttribute("doctorList", doctors);
        request.setAttribute("specializationList", doctorDAO.getAllSpecializations());

        request.getRequestDispatcher("/admin-doctors.jsp").forward(request, response);
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

        if ("add".equalsIgnoreCase(action)) {
            handleAddDoctor(request, response);
        } else if ("edit".equalsIgnoreCase(action)) {
            handleEditDoctor(request, response);
        } else if ("delete".equalsIgnoreCase(action)) {
            handleDeleteDoctor(request, response);
        } else {
            doGet(request, response);
        }
    }

    private void handleAddDoctor(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String specialization = request.getParameter("specialization");
        String qualification = request.getParameter("qualification");
        String experience = request.getParameter("experience");
        String feeStr = request.getParameter("fee");
        String availableDays = request.getParameter("availableDays");

        if (isEmpty(name) || isEmpty(specialization) || isEmpty(qualification) 
                || isEmpty(experience) || isEmpty(feeStr) || isEmpty(availableDays)) {
            request.setAttribute("errorMessage", "All doctor fields are required.");
            doGet(request, response);
            return;
        }

        BigDecimal fee;
        try {
            fee = new BigDecimal(feeStr.trim());
            if (fee.compareTo(BigDecimal.ZERO) <= 0) {
                request.setAttribute("errorMessage", "Consultation fee must be greater than zero.");
                doGet(request, response);
                return;
            }
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "Invalid fee amount format.");
            doGet(request, response);
            return;
        }

        Doctor d = new Doctor(name.trim(), specialization.trim(), qualification.trim(), 
                              experience.trim(), fee, availableDays.trim());

        boolean added = doctorDAO.addDoctor(d);
        if (added) {
            request.setAttribute("successMessage", "Doctor " + d.getName() + " was successfully added to the system.");
        } else {
            request.setAttribute("errorMessage", "Failed to add doctor to the database.");
        }
        doGet(request, response);
    }

    private void handleEditDoctor(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String doctorIdStr = request.getParameter("doctorId");
        String name = request.getParameter("name");
        String specialization = request.getParameter("specialization");
        String qualification = request.getParameter("qualification");
        String experience = request.getParameter("experience");
        String feeStr = request.getParameter("fee");
        String availableDays = request.getParameter("availableDays");

        if (isEmpty(doctorIdStr) || isEmpty(name) || isEmpty(specialization) 
                || isEmpty(qualification) || isEmpty(experience) || isEmpty(feeStr) || isEmpty(availableDays)) {
            request.setAttribute("errorMessage", "All fields are required to update doctor details.");
            doGet(request, response);
            return;
        }

        int doctorId;
        BigDecimal fee;
        try {
            doctorId = Integer.parseInt(doctorIdStr.trim());
            fee = new BigDecimal(feeStr.trim());
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "Invalid doctor ID or fee amount.");
            doGet(request, response);
            return;
        }

        Doctor d = new Doctor(doctorId, name.trim(), specialization.trim(), qualification.trim(), 
                              experience.trim(), fee, availableDays.trim());

        boolean updated = doctorDAO.updateDoctor(d);
        if (updated) {
            request.setAttribute("successMessage", "Doctor " + d.getName() + " details updated successfully.");
        } else {
            request.setAttribute("errorMessage", "Failed to update doctor details.");
        }
        doGet(request, response);
    }

    private void handleDeleteDoctor(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String doctorIdStr = request.getParameter("doctorId");
        if (doctorIdStr != null && !doctorIdStr.trim().isEmpty()) {
            try {
                int doctorId = Integer.parseInt(doctorIdStr.trim());
                Doctor d = doctorDAO.getDoctorById(doctorId);
                String docName = d != null ? d.getName() : "ID #" + doctorId;
                boolean deleted = doctorDAO.deleteDoctor(doctorId);
                if (deleted) {
                    request.setAttribute("successMessage", "Doctor " + docName + " has been removed.");
                } else {
                    request.setAttribute("errorMessage", "Failed to remove doctor.");
                }
            } catch (NumberFormatException e) {
                request.setAttribute("errorMessage", "Invalid doctor ID.");
            }
        }
        doGet(request, response);
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
