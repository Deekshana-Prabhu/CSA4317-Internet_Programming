package com.college.admission;

import java.io.IOException;
import java.util.List;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * StudentDetailsServlet
 * 
 * Retrieves and serves registered student records using the HTTP GET method.
 * Demonstrates the standard Java Servlet Life Cycle:
 *  1. init()    - Called once when the Servlet is initialized
 *  2. service() - Handles incoming HTTP requests and dispatches to doGet
 *  3. doGet()   - Processes search filtering, record deletion, and fetches records
 *  4. destroy() - Called when the Servlet is destroyed
 * 
 * Servlet Architecture:
 *  Browser (GET request) ---> Web Server (Tomcat) ---> StudentDetailsServlet
 *                                                              |
 *                                           (Processing: Fetch / Search / Delete)
 *                                                              |
 *  Browser <----------------- Web Server <------------- Forward to students.jsp
 */
public class StudentDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private StudentDataStore dataStore;

    /**
     * Servlet Life Cycle Method 1: init()
     * Initializes Servlet configuration and links to the persistent data store.
     */
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        dataStore = StudentDataStore.getInstance();
        System.out.println("[StudentDetailsServlet] init() executed: Servlet initialized successfully.");
    }

    /**
     * Servlet Life Cycle Method 2: service()
     * Dispatches incoming client requests to appropriate HTTP methods.
     */
    @Override
    public void service(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        System.out.println("[StudentDetailsServlet] service() invoked: Method = " + request.getMethod());
        super.service(request, response);
    }

    /**
     * Handles HTTP GET requests to retrieve and display student information.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String action = request.getParameter("action");
        String regNo = request.getParameter("regNo");
        String searchQuery = request.getParameter("search");
        String feedbackMessage = null;

        // 1. Process Delete Request: GET ?action=delete&regNo=...
        if ("delete".equalsIgnoreCase(action) && regNo != null && !regNo.trim().isEmpty()) {
            boolean deleted = dataStore.deleteStudent(regNo.trim());
            if (deleted) {
                feedbackMessage = "Student record with Register No: " + regNo.trim() + " was deleted successfully.";
                System.out.println("[StudentDetailsServlet] " + feedbackMessage);
            } else {
                feedbackMessage = "Record with Register No: " + regNo.trim() + " could not be found.";
            }
        }

        // 2. Process Search / Filter Request: GET ?search=...
        List<Student> students;
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            students = dataStore.searchStudents(searchQuery.trim());
            System.out.println("[StudentDetailsServlet] Search performed for query '" + searchQuery + "': Found " + students.size() + " matches.");
        } else {
            students = dataStore.getAllStudents();
            System.out.println("[StudentDetailsServlet] Retrieved all registered students: Total = " + students.size());
        }

        // 3. Attach student list and feedback notification to request scope
        request.setAttribute("studentList", students);
        if (feedbackMessage != null) {
            request.setAttribute("message", feedbackMessage);
        }

        // 4. Forward to JSP View (students.jsp) for clean dynamic presentation
        RequestDispatcher dispatcher = request.getRequestDispatcher("students.jsp");
        dispatcher.forward(request, response);
    }

    /**
     * Also forwards POST requests to doGet for consistent retrieval
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }

    /**
     * Servlet Life Cycle Method 3: destroy()
     * Called when the servlet container stops or application is removed.
     */
    @Override
    public void destroy() {
        System.out.println("[StudentDetailsServlet] destroy() called: Releasing servlet resources.");
        super.destroy();
    }
}
