package com.college.admission;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * RegistrationServlet
 * 
 * Handles new student admission form submissions via HTTP POST method.
 * Demonstrates the standard Java Servlet Life Cycle:
 *  1. init()    - Called once when Servlet is loaded by the Web Server (Tomcat)
 *  2. service() - Dispatches incoming requests (GET, POST)
 *  3. doPost()  - Extracts parameters, validates inputs, checks duplicates, updates data store
 *  4. destroy() - Called when Servlet is undeployed/destroyed to clean up resources
 * 
 * Servlet Architecture:
 *  Browser (HTML Form) ---> Web Server (Apache Tomcat) ---> RegistrationServlet
 *                                                                  |
 *                                                     (Processing: Validation & Storage)
 *                                                                  |
 *  Browser <--------------- Web Server <------------------- Forward to success.jsp
 */
public class RegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private StudentDataStore dataStore;

    /**
     * Servlet Life Cycle Method 1: init()
     * Initializes Servlet configuration and acquires reference to the data store.
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        dataStore = StudentDataStore.getInstance();
        System.out.println("[RegistrationServlet] init() executed: Servlet initialized successfully.");
    }

    /**
     * Servlet Life Cycle Method 2: service()
     * Intercepts and logs incoming HTTP requests before routing to corresponding doXXX() method.
     */
    @Override
    public void service(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        System.out.println("[RegistrationServlet] service() invoked: Processing " + request.getMethod() + " request from " + request.getRemoteAddr());
        super.service(request, response);
    }

    /**
     * Handles HTTP POST requests for student registration form submission.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Ensure character encoding handles UTF-8 data properly
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        // 1. Retrieve all submitted form parameters from HTTP POST request
        String studentName = request.getParameter("studentName");
        String registerNumber = request.getParameter("registerNumber");
        String email = request.getParameter("email");
        String mobile = request.getParameter("mobile");
        String dob = request.getParameter("dob");
        String gender = request.getParameter("gender");
        String address = request.getParameter("address");
        String state = request.getParameter("state");
        String department = request.getParameter("department");
        String preferredDepartment = request.getParameter("preferredDepartment");
        String marks10Str = request.getParameter("marks10");
        String marks12Str = request.getParameter("marks12");

        // 2. Server-side Validation: Check for missing/blank required fields
        if (isNullOrEmpty(studentName) || isNullOrEmpty(registerNumber) || isNullOrEmpty(email) ||
            isNullOrEmpty(mobile) || isNullOrEmpty(dob) || isNullOrEmpty(gender) ||
            isNullOrEmpty(address) || isNullOrEmpty(state) || isNullOrEmpty(department) ||
            isNullOrEmpty(preferredDepartment) || isNullOrEmpty(marks10Str) || isNullOrEmpty(marks12Str)) {
            
            System.err.println("[RegistrationServlet] Validation error: Missing required fields.");
            response.sendRedirect("register.html?error=validation");
            return;
        }

        // Clean & trim inputs
        studentName = studentName.trim();
        registerNumber = registerNumber.trim();
        email = email.trim();
        mobile = mobile.trim();
        address = address.trim();

        // 3. Server-side Validation: Validate numeric marks range (0 - 100)
        double marks10 = 0.0;
        double marks12 = 0.0;
        try {
            marks10 = Double.parseDouble(marks10Str);
            marks12 = Double.parseDouble(marks12Str);
            if (marks10 < 0 || marks10 > 100 || marks12 < 0 || marks12 > 100) {
                System.err.println("[RegistrationServlet] Validation error: Marks out of range (0-100).");
                response.sendRedirect("register.html?error=validation");
                return;
            }
        } catch (NumberFormatException nfe) {
            System.err.println("[RegistrationServlet] Validation error: Non-numeric marks received.");
            response.sendRedirect("register.html?error=validation");
            return;
        }

        // 4. Duplicate Check: Ensure register number is unique
        if (dataStore.isDuplicate(registerNumber)) {
            System.err.println("[RegistrationServlet] Duplicate error: Register number " + registerNumber + " already exists!");
            response.sendRedirect("register.html?error=duplicate&regNo=" + java.net.URLEncoder.encode(registerNumber, "UTF-8"));
            return;
        }

        // 5. Construct Student Model object
        Student newStudent = new Student(
            studentName,
            registerNumber,
            email,
            mobile,
            dob,
            gender,
            address,
            state,
            department,
            marks10,
            marks12,
            preferredDepartment
        );

        // 6. Save student into persistent thread-safe store
        boolean added = dataStore.addStudent(newStudent);
        if (!added) {
            response.sendRedirect("register.html?error=duplicate&regNo=" + java.net.URLEncoder.encode(registerNumber, "UTF-8"));
            return;
        }

        System.out.println("[RegistrationServlet] Student successfully registered: " + newStudent);

        // 7. Store student in request and session scope for dynamic JSP confirmation
        request.setAttribute("student", newStudent);
        HttpSession session = request.getSession(true);
        session.setAttribute("latestStudent", newStudent);

        // 8. Forward request to success.jsp (Servlet Architecture - MVC Pattern)
        RequestDispatcher dispatcher = request.getRequestDispatcher("success.jsp");
        dispatcher.forward(request, response);
    }

    /**
     * Handles HTTP GET requests by redirecting to the registration form page
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.sendRedirect("register.html");
    }

    /**
     * Servlet Life Cycle Method 3: destroy()
     * Called when the Servlet container shuts down or undeploys the application.
     */
    @Override
    public void destroy() {
        System.out.println("[RegistrationServlet] destroy() called: Releasing servlet resources.");
        super.destroy();
    }

    /**
     * Helper method to verify non-empty string values
     */
    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
