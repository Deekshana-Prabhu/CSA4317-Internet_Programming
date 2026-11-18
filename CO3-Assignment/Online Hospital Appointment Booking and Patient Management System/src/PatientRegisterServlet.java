import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet handling Patient Registration.
 * Validates fields, mobile, email format, password match, and checks duplicate email.
 */
@WebServlet(name = "PatientRegisterServlet", urlPatterns = {"/PatientRegisterServlet", "/register"})
public class PatientRegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private PatientDAO patientDAO;

    @Override
    public void init() {
        patientDAO = new PatientDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setAttribute("activeTab", "register");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String name = request.getParameter("name");
        String ageStr = request.getParameter("age");
        String gender = request.getParameter("gender");
        String email = request.getParameter("email");
        String mobile = request.getParameter("mobile");
        String address = request.getParameter("address");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        // Keep entered fields in request to avoid retyping on validation failure
        request.setAttribute("regName", name);
        request.setAttribute("regAge", ageStr);
        request.setAttribute("regGender", gender);
        request.setAttribute("regEmail", email);
        request.setAttribute("regMobile", mobile);
        request.setAttribute("regAddress", address);
        request.setAttribute("activeTab", "register");

        // 1. Required fields check
        if (isEmpty(name) || isEmpty(ageStr) || isEmpty(gender) || isEmpty(email) 
                || isEmpty(mobile) || isEmpty(address) || isEmpty(password) || isEmpty(confirmPassword)) {
            request.setAttribute("errorMessage", "All registration fields are required.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // 2. Age validation
        int age;
        try {
            age = Integer.parseInt(ageStr.trim());
            if (age <= 0 || age > 125) {
                request.setAttribute("errorMessage", "Please provide a valid age between 1 and 125.");
                request.getRequestDispatcher("/index.jsp").forward(request, response);
                return;
            }
        } catch (NumberFormatException e) {
            request.setAttribute("errorMessage", "Age must be a valid numeric value.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // 3. Email validation
        String emailRegex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        if (!email.trim().matches(emailRegex)) {
            request.setAttribute("errorMessage", "Please enter a valid email address (e.g., patient@example.com).");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // 4. Mobile number validation (10 digits)
        String mobileRegex = "^[0-9]{10}$";
        if (!mobile.trim().matches(mobileRegex)) {
            request.setAttribute("errorMessage", "Mobile number must be a valid 10-digit phone number.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // 5. Password confirmation check
        if (!password.equals(confirmPassword)) {
            request.setAttribute("errorMessage", "Password and Confirm Password do not match.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        if (password.length() < 6) {
            request.setAttribute("errorMessage", "Password must be at least 6 characters in length.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // 6. Duplicate email check
        if (patientDAO.isEmailRegistered(email.trim())) {
            request.setAttribute("errorMessage", "An account with email " + email.trim() + " already exists. Please login instead.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // 7. Save patient details in MySQL using JDBC
        Patient newPatient = new Patient(name.trim(), age, gender.trim(), email.trim(), mobile.trim(), address.trim(), password);
        boolean registered = patientDAO.registerPatient(newPatient);

        if (registered) {
            request.setAttribute("successMessage", "Registration successful! You can now log in with your email and password.");
            request.setAttribute("activeTab", "login");
            request.setAttribute("loginEmail", email.trim());
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        } else {
            request.setAttribute("errorMessage", "Registration failed due to a database error. Please try again.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
