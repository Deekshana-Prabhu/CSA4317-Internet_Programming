package com.exam.portal;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Question Model representing an examination multiple-choice question.
 * Contains the question text, topic, 4 options, correct answer key, and explanation.
 */
public class Question implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String topic;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer; // "A", "B", "C", or "D"
    private String explanation;

    public Question(int id, String topic, String questionText, 
                    String optionA, String optionB, String optionC, String optionD, 
                    String correctAnswer, String explanation) {
        this.id = id;
        this.topic = topic;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }

    public int getId() { return id; }
    public String getTopic() { return topic; }
    public String getQuestionText() { return questionText; }
    public String getOptionA() { return optionA; }
    public String getOptionB() { return optionB; }
    public String getOptionC() { return optionC; }
    public String getOptionD() { return optionD; }
    public String getCorrectAnswer() { return correctAnswer; }
    public String getExplanation() { return explanation; }

    public String getOption(String key) {
        if ("A".equalsIgnoreCase(key)) return optionA;
        if ("B".equalsIgnoreCase(key)) return optionB;
        if ("C".equalsIgnoreCase(key)) return optionC;
        if ("D".equalsIgnoreCase(key)) return optionD;
        return "";
    }

    /**
     * Master repository of all 10 Java Examination Questions.
     * Covers: Java Basics, OOP, Classes/Objects, Inheritance, Exception Handling,
     * Servlets, JSP, JDBC, Session Management, and Cookies.
     */
    public static List<Question> getAllQuestions() {
        List<Question> questions = new ArrayList<Question>();

        questions.add(new Question(
            1,
            "Java Basics",
            "Which component of the Java Architecture is responsible for converting bytecode into machine-specific native instructions at execution time?",
            "JDK (Java Development Kit)",
            "JRE (Java Runtime Environment)",
            "JIT (Just-In-Time) Compiler inside JVM",
            "Java ClassLoader",
            "C",
            "The Just-In-Time (JIT) compiler compiles bytecode into native machine instructions at runtime to optimize execution speed."
        ));

        questions.add(new Question(
            2,
            "Object-Oriented Programming",
            "Which fundamental OOP principle allows a subclass to provide a specific implementation of a method that is already defined in its superclass, resolved at runtime?",
            "Method Overloading",
            "Method Overriding (Dynamic Polymorphism)",
            "Data Encapsulation",
            "Data Abstraction",
            "B",
            "Method Overriding is a mechanism where a subclass provides its own specific implementation of a method defined in its superclass, demonstrating runtime (dynamic) polymorphism."
        ));

        questions.add(new Question(
            3,
            "Classes and Objects",
            "What is the primary role of the 'this' keyword in Java?",
            "Refers to the superclass instance",
            "Invokes static methods of another class",
            "Refers to the current class instance and helps distinguish instance variables from local parameters",
            "Allocates heap memory for new objects",
            "C",
            "In Java, 'this' is a reference variable that refers to the current invoking object, frequently used to resolve name shadowing between instance variables and constructor/method parameters."
        ));

        questions.add(new Question(
            4,
            "Inheritance",
            "In Java, if class Child extends class Parent, which keyword must be used inside Child's constructor to explicitly call the constructor of Parent?",
            "parent()",
            "super()",
            "this()",
            "base()",
            "B",
            "The 'super()' keyword is used in a subclass constructor to explicitly invoke the constructor of its immediate superclass, and it must be the first statement."
        ));

        questions.add(new Question(
            5,
            "Exception Handling",
            "Which block in Java exception handling is guaranteed to execute regardless of whether an exception is caught or unhandled, making it crucial for closing resources?",
            "catch block",
            "throws block",
            "finally block",
            "finalize block",
            "C",
            "The 'finally' block always executes after try-catch blocks (unless System.exit() is invoked), ensuring that critical resources like database connections and streams are properly closed."
        ));

        questions.add(new Question(
            6,
            "Java Servlets",
            "In the Java Servlet lifecycle, which method is invoked exactly ONCE when the servlet container loads and initializes the servlet instance into memory?",
            "service()",
            "init()",
            "doGet()",
            "destroy()",
            "B",
            "The init() method is called only once by the servlet container when the servlet instance is instantiated, before handling any client requests."
        ));

        questions.add(new Question(
            7,
            "JavaServer Pages (JSP)",
            "In JavaServer Pages (JSP), which implicit object directly corresponds to the javax.servlet.http.HttpSession interface and maintains conversational state across requests?",
            "request",
            "application",
            "session",
            "pageContext",
            "C",
            "The JSP implicit object 'session' is of type javax.servlet.http.HttpSession and is automatically available in standard JSP pages unless session='false' is specified in the page directive."
        ));

        questions.add(new Question(
            8,
            "JDBC Database Connectivity",
            "Which JDBC interface represents a precompiled SQL statement that prevents SQL Injection attacks and offers superior performance for repeated queries?",
            "Statement",
            "PreparedStatement",
            "CallableStatement",
            "RowSet",
            "B",
            "PreparedStatement precompiles the SQL query on the database engine, uses parameterized placeholders (?) to safely bind values, and effectively eliminates SQL Injection vulnerabilities."
        ));

        questions.add(new Question(
            9,
            "Session Management (HttpSession)",
            "Which method of the HttpSession interface should be invoked during user logout to terminate the current session and unbind all stored attributes on the server?",
            "session.close()",
            "session.destroy()",
            "session.invalidate()",
            "session.removeAttributeAll()",
            "C",
            "The invalidate() method destroys the current active session on the server side and removes all bound session attributes immediately."
        ));

        questions.add(new Question(
            10,
            "HTTP Cookie Management",
            "In a Java Servlet, what is the correct approach to instruct the client's browser to delete an existing cookie named 'rememberedUser'?",
            "Call userCookie.delete() on the server",
            "Set userCookie.setMaxAge(0), set its matching path, and add it back to HttpServletResponse",
            "Call response.removeCookie(userCookie)",
            "Set userCookie.setValue(null) without modifying MaxAge",
            "B",
            "To delete a cookie in HTTP/Java, you set its Max-Age to 0 (userCookie.setMaxAge(0)), set the identical path, and add it to the HttpServletResponse via response.addCookie()."
        ));

        return questions;
    }
}
