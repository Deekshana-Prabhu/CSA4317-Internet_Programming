/**
 * ============================================================================
 * ONLINE EXAMINATION PORTAL - UNIVERSITY EXAMINATION MANAGEMENT SYSTEM
 * Core Application Script (Vanilla JavaScript - HTML5 / CSS3 / DHTML)
 * 
 * Demonstrates:
 * 1. JavaScript DOM Manipulation (getElementById, querySelector, createElement,
 *    appendChild, textContent, innerHTML)
 * 2. JavaScript Date Objects & Timestamps (Countdown timer, drift compensation)
 * 3. Event Handling (Click, submit, change, custom events)
 * 4. Arrays & Objects (Question repositories, response tracking, score structures)
 * 5. Exception Handling (try, catch, finally, throw)
 * 6. Dynamic HTML (DHTML) rendering without page reload (SPA Architecture)
 * ============================================================================
 */

"use strict";

/* ============================================================================
   1. QUESTION DATA REPOSITORIES (Arrays & Objects)
   Each examination contains exactly 10 high-quality, authentic MCQs.
   ============================================================================ */
const EXAM_DATABASE = {
  javascript: {
    id: "javascript",
    title: "JavaScript Fundamentals",
    code: "CS-JS-201",
    totalQuestions: 10,
    timeDurationMinutes: 10,
    passingPercentage: 40,
    questions: [
      {
        id: 1,
        question: "Which of the following statements accurately describes the scoping behavior of variables declared with 'let' in JavaScript?",
        options: [
          "They are hoisted and initialized to undefined across the entire global execution context.",
          "They are block-scoped and reside in the Temporal Dead Zone (TDZ) before their declaration is evaluated.",
          "They are function-scoped and can be redeclared freely within the same lexical environment.",
          "They are permanently attached as enumerable properties to the global window object."
        ],
        correctAnswer: 1,
        explanation: "Variables declared with 'let' are block-scoped to the nearest enclosing pair of curly braces {} and cannot be accessed before lexical binding due to the Temporal Dead Zone (TDZ)."
      },
      {
        id: 2,
        question: "What will be the exact output of evaluating 'typeof null' and 'typeof undefined' in standard JavaScript?",
        options: [
          "'object' and 'undefined'",
          "'null' and 'undefined'",
          "'object' and 'null'",
          "'undefined' and 'undefined'"
        ],
        correctAnswer: 0,
        explanation: "'typeof null' returns 'object' due to a historical legacy artifact in JavaScript's 32-bit type tag implementation, while 'typeof undefined' correctly returns 'undefined'."
      },
      {
        id: 3,
        question: "What distinguishes the strict equality operator (===) from the abstract equality operator (==)?",
        options: [
          "The '===' operator compares both value and data type without performing implicit type coercion.",
          "The '==' operator performs binary bitwise comparison of operand pointers.",
          "The '===' operator converts strings to floating point numbers automatically.",
          "There is no functional distinction; they are interchangeable syntactic aliases."
        ],
        correctAnswer: 0,
        explanation: "Strict equality (===) checks identity of both value and primitive type without implicit coercion, whereas abstract equality (==) coerces types according to ECMAScript coercion rules."
      },
      {
        id: 4,
        question: "Which JavaScript Array method returns a new array with all elements that pass the test implemented by the provided callback function?",
        options: [
          "Array.prototype.forEach()",
          "Array.prototype.map()",
          "Array.prototype.filter()",
          "Array.prototype.reduce()"
        ],
        correctAnswer: 2,
        explanation: "Array.prototype.filter() creates a shallow copy of a portion of the given array, filtered down to just the elements from the given array that pass the predicate test."
      },
      {
        id: 5,
        question: "How do JavaScript Arrow Functions differ fundamentally from traditional function declarations regarding the 'this' keyword?",
        options: [
          "Arrow functions bind 'this' dynamically to the caller object at runtime.",
          "Arrow functions have their own mutable 'this' context created upon every invocation.",
          "Arrow functions do not have their own 'this'; they inherit 'this' lexically from their enclosing execution context.",
          "Arrow functions require the .bind() method to attach 'this' properly."
        ],
        correctAnswer: 2,
        explanation: "Arrow functions lack their own 'this' binding, 'arguments' object, and 'super' keyword; they capture 'this' lexically from their enclosing parent lexical scope."
      },
      {
        id: 6,
        question: "Which DOM method is most suitable for retrieving all elements matching a complex CSS selector string (e.g. '.card > button.btn-primary') as a static NodeList?",
        options: [
          "document.getElementById()",
          "document.getElementsByTagName()",
          "document.querySelectorAll()",
          "document.querySelector()"
        ],
        correctAnswer: 2,
        explanation: "document.querySelectorAll() returns a static NodeList representing all document elements that match the specified CSS selector group."
      },
      {
        id: 7,
        question: "In JavaScript event handling, what is the default order of event propagation across nested DOM tree nodes when 'addEventListener' is invoked without the capture flag?",
        options: [
          "Capturing Phase only (downward from window to target)",
          "Target phase followed by Bubbling Phase (upward to window)",
          "Broadcasting phase across sibling elements simultaneously",
          "Tunneling phase directly to the root html element"
        ],
        correctAnswer: 1,
        explanation: "By default, 'addEventListener(event, handler, false)' attaches handlers to the bubbling phase, where the event triggers on the innermost target element and bubbles upwards to ancestors."
      },
      {
        id: 8,
        question: "What is the primary purpose of the 'finally' block within a JavaScript 'try...catch...finally' statement?",
        options: [
          "It executes only when an uncaught exception is thrown in the catch block.",
          "It always executes after the try and catch blocks finish, regardless of whether an error was thrown or caught.",
          "It prevents any asynchronous Promise rejections from terminating the script.",
          "It automatically rolls back all DOM mutations performed in the try block."
        ],
        correctAnswer: 1,
        explanation: "The 'finally' block contains cleanup code that is guaranteed to execute unconditionally after the 'try' and optional 'catch' blocks complete, even if a return statement is encountered."
      },
      {
        id: 9,
        question: "Which built-in JavaScript object is used to represent and manipulate points in time, dates, and millisecond timestamps?",
        options: [
          "TimeSpan",
          "Chronometer",
          "Date",
          "Moment"
        ],
        correctAnswer: 2,
        explanation: "The standard built-in JavaScript 'Date' object represents a single moment in time in a platform-independent format, containing an integer number of milliseconds since January 1, 1970 UTC."
      },
      {
        id: 10,
        question: "What does the 'async' keyword in an asynchronous function definition signify?",
        options: [
          "It forces the JavaScript engine to spin up a background OS thread.",
          "It guarantees that the function implicitly returns a Promise resolved with its return value.",
          "It synchronously halts browser rendering until the function completes.",
          "It disallows the use of the 'await' operator inside the function body."
        ],
        correctAnswer: 1,
        explanation: "An 'async' function declaration designates a function that operates asynchronously via the event loop, implicitly returning a Promise that resolves to the function's return value."
      }
    ]
  },

  htmlcss: {
    id: "htmlcss",
    title: "HTML and CSS Basics",
    code: "WD-HC-101",
    totalQuestions: 10,
    timeDurationMinutes: 10,
    passingPercentage: 40,
    questions: [
      {
        id: 1,
        question: "Which of the following is a semantic HTML5 element specifically intended to encapsulate standalone, distributable, or self-contained content?",
        options: [
          "<article>",
          "<section>",
          "<div>",
          "<span>"
        ],
        correctAnswer: 0,
        explanation: "The <article> element specifies independent, self-contained content intended to be independently reusable or distributable (such as a blog post, news story, or comment)."
      },
      {
        id: 2,
        question: "In the standard CSS Box Model, in which order are the concentric box layers arranged from the inside out?",
        options: [
          "Content -> Padding -> Border -> Margin",
          "Content -> Border -> Padding -> Margin",
          "Margin -> Border -> Padding -> Content",
          "Padding -> Content -> Margin -> Border"
        ],
        correctAnswer: 0,
        explanation: "From inner to outer edge, the CSS box model consists of: Content area -> Padding -> Border -> Margin."
      },
      {
        id: 3,
        question: "What is the key benefit of applying 'box-sizing: border-box;' in modern CSS design?",
        options: [
          "It removes all borders and padding from the element.",
          "It includes padding and border within the element's specified width and height.",
          "It doubles the margin applied to inline elements.",
          "It forces all flex containers to render in grid mode."
        ],
        correctAnswer: 1,
        explanation: "With 'box-sizing: border-box', the width and height properties include the content, padding, and border, making sizing and responsive calculations consistent and predictable."
      },
      {
        id: 4,
        question: "Which CSS Flexbox property aligns flex items along the primary (main) axis of the flex container?",
        options: [
          "align-items",
          "justify-content",
          "align-content",
          "flex-direction"
        ],
        correctAnswer: 1,
        explanation: "'justify-content' aligns flex items along the main axis of the current line of the flex container."
      },
      {
        id: 5,
        question: "Which CSS position value removes an element from the normal document flow and positions it relative to its nearest positioned ancestor?",
        options: [
          "position: relative;",
          "position: static;",
          "position: absolute;",
          "position: fixed;"
        ],
        correctAnswer: 2,
        explanation: "'position: absolute;' removes the element from normal flow and computes coordinates (top, left, etc.) relative to the nearest positioned ancestor (an ancestor with position other than static)."
      },
      {
        id: 6,
        question: "Which HTML attribute is used to provide alternate descriptive text for an image to assist screen readers and visual fallbacks?",
        options: [
          "title",
          "caption",
          "alt",
          "desc"
        ],
        correctAnswer: 2,
        explanation: "The 'alt' attribute provides an alternative textual representation of an image, required for web accessibility (WCAG) and network failure fallbacks."
      },
      {
        id: 7,
        question: "In CSS selector specificity, which of the following selectors holds the highest specificity weight?",
        options: [
          "Element selector: h1",
          "Class selector: .header-title",
          "ID selector: #main-heading",
          "Universal selector: *"
        ],
        correctAnswer: 2,
        explanation: "ID selectors carry a specificity weight of (0, 1, 0, 0), outranking class/attribute selectors (0, 0, 1, 0) and type/element selectors (0, 0, 0, 1)."
      },
      {
        id: 8,
        question: "Which CSS media query feature is used to detect viewport width and apply responsive styling for mobile devices below 768px?",
        options: [
          "@media screen and (max-width: 768px) { ... }",
          "@media (device-pixel-ratio: 768px) { ... }",
          "@viewport (width <= 768) { ... }",
          "@media print and (screen: 768px) { ... }"
        ],
        correctAnswer: 0,
        explanation: "@media screen and (max-width: 768px) evaluates to true when the browser viewport width is 768 pixels or narrower, activating mobile rules."
      },
      {
        id: 9,
        question: "What is the difference between CSS pseudo-classes (e.g. :hover) and pseudo-elements (e.g. ::before)?",
        options: [
          "Pseudo-classes style an element based on its dynamic state, while pseudo-elements create and style specific virtual sub-parts of an element.",
          "Pseudo-classes can only be applied to hyperlinks, while pseudo-elements apply to images.",
          "Pseudo-elements require JavaScript to function, whereas pseudo-classes are pure CSS.",
          "There is no difference; they are strictly synonymous."
        ],
        correctAnswer: 0,
        explanation: "Pseudo-classes (:hover, :focus, :nth-child) select elements based on state or DOM position, whereas pseudo-elements (::before, ::after, ::placeholder) style distinct virtual elements."
      },
      {
        id: 10,
        question: "Which CSS display property turns an element into a two-dimensional layout container supporting both columns and rows simultaneously?",
        options: [
          "display: inline-block;",
          "display: flex;",
          "display: grid;",
          "display: table-cell;"
        ],
        correctAnswer: 2,
        explanation: "CSS Grid ('display: grid;') is a native two-dimensional layout system designed to manage both rows and columns simultaneously."
      }
    ]
  },

  computer: {
    id: "computer",
    title: "Computer Fundamentals",
    code: "CF-UG-100",
    totalQuestions: 10,
    timeDurationMinutes: 10,
    passingPercentage: 40,
    questions: [
      {
        id: 1,
        question: "Which component of the Central Processing Unit (CPU) is specifically responsible for executing arithmetic operations and logical decisions?",
        options: [
          "Control Unit (CU)",
          "Arithmetic Logic Unit (ALU)",
          "Memory Management Unit (MMU)",
          "Program Counter (PC)"
        ],
        correctAnswer: 1,
        explanation: "The Arithmetic Logic Unit (ALU) performs all arithmetic calculations (addition, subtraction, multiplication) and logical comparisons (AND, OR, NOT) within the CPU."
      },
      {
        id: 2,
        question: "Why is Random Access Memory (RAM) categorized as 'volatile' memory in computer systems?",
        options: [
          "It physically degrades rapidly over prolonged computational use.",
          "Its stored contents are entirely lost when the electrical power is disconnected.",
          "It can only be written to once during manufacturing.",
          "It operates at significantly slower clock speeds than magnetic tape."
        ],
        correctAnswer: 1,
        explanation: "RAM is volatile memory because it relies on electrical current to retain charge states; when the system power is removed, all stored bits are cleared."
      },
      {
        id: 3,
        question: "How many bits are contained in a standard computer byte?",
        options: [
          "4 bits",
          "8 bits",
          "16 bits",
          "32 bits"
        ],
        correctAnswer: 1,
        explanation: "In standard computer architecture, exactly 8 bits make up one byte (capable of representing 256 distinct values from 0 to 255)."
      },
      {
        id: 4,
        question: "What is the primary role of the Operating System's kernel?",
        options: [
          "To provide graphical web browsing capabilities to end users.",
          "To act as the core interface between computer hardware and user software applications, managing memory, CPU, and devices.",
          "To translate high-level source code into binary assembly files.",
          "To compress multimedia files for external flash drive storage."
        ],
        correctAnswer: 1,
        explanation: "The kernel is the foundational heart of the operating system, maintaining direct low-level control over CPU scheduling, memory allocation, peripheral I/O, and system security."
      },
      {
        id: 5,
        question: "What is the fundamental difference between a Compiler and an Interpreter?",
        options: [
          "A compiler translates the entire source code into machine code prior to execution, whereas an interpreter translates and executes source code line-by-line at runtime.",
          "A compiler only executes binary machine code, while an interpreter writes high-level code.",
          "A compiler is hardware, while an interpreter is firmware.",
          "Compilers run slower than interpreters in all production workloads."
        ],
        correctAnswer: 0,
        explanation: "A compiler translates the entire program into standalone machine code before execution, while an interpreter reads, converts, and executes instructions sequentially on the fly."
      },
      {
        id: 6,
        question: "What does the acronym DNS stand for in computer networking?",
        options: [
          "Digital Network Server",
          "Dynamic Node Selector",
          "Domain Name System",
          "Distributed Network Storage"
        ],
        correctAnswer: 2,
        explanation: "The Domain Name System (DNS) translates human-readable domain names (such as university.edu) into numerical IP addresses needed by network routers."
      },
      {
        id: 7,
        question: "In the OSI (Open Systems Interconnection) reference model, how many distinct abstraction layers are defined?",
        options: [
          "4 Layers",
          "5 Layers",
          "7 Layers",
          "9 Layers"
        ],
        correctAnswer: 2,
        explanation: "The OSI model specifies 7 hierarchical layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application."
      },
      {
        id: 8,
        question: "What is the binary equivalent of the decimal number 13?",
        options: [
          "1100",
          "1101",
          "1011",
          "1110"
        ],
        correctAnswer: 1,
        explanation: "In binary: (1 * 8) + (1 * 4) + (0 * 2) + (1 * 1) = 8 + 4 + 0 + 1 = 13 (decimal). Thus, decimal 13 is binary 1101."
      },
      {
        id: 9,
        question: "Which of the following describes the function of computer Cache Memory?",
        options: [
          "A slow, massive magnetic storage area used for archival backup files.",
          "An extremely fast, small SRAM storage located on or near the CPU that holds frequently accessed data and instructions.",
          "A read-only firmware chip used exclusively for the initial system boot sequence.",
          "An optical disk drive used to install software packages."
        ],
        correctAnswer: 1,
        explanation: "CPU Cache (L1, L2, L3) is high-speed static RAM (SRAM) placed directly adjacent to or inside the CPU core to minimize latency when fetching recurring instructions from main memory."
      },
      {
        id: 10,
        question: "What is the primary function of a network Firewall?",
        options: [
          "To extinguish physical fires in enterprise server rooms.",
          "To monitor, filter, and inspect incoming and outgoing network traffic based on predefined security rules.",
          "To boost wireless Wi-Fi signals over long physical distances.",
          "To clean dust and particles from computer cooling fans."
        ],
        correctAnswer: 1,
        explanation: "A firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security protocols to prevent unauthorized access."
      }
    ]
  }
};

/* ============================================================================
   2. APPLICATION STATE MANAGEMENT (Objects & Variables)
   ============================================================================ */

/**
 * Candidate profile information object
 */
let candidateSession = {
  name: "",
  regNumber: "",
  department: "",
  examKey: "",
  examTitle: "",
  examCode: "",
  startTime: null,       // JavaScript Date object
  endTimeTarget: null,   // Timestamp ms
  submittedAt: null,     // JavaScript Date object
  timeTakenFormatted: ""
};

/**
 * Active examination questions & responses
 */
let activeExam = null;
let currentQuestionIndex = 0; // 0 to 9
let userResponses = [];       // Array of 10 response tracking objects
let isExamSubmitted = false;  // Mutex lock to prevent duplicate submissions

/**
 * Timer state variables
 */
const EXAM_DURATION_SECONDS = 10 * 60; // 10 minutes = 600 seconds
let timerIntervalId = null;
let timeRemainingSeconds = EXAM_DURATION_SECONDS;
let isTwoMinuteWarned = false;

/**
 * Final Evaluation Score Object
 */
let evaluationScore = {
  totalQuestions: 10,
  totalMarks: 10,
  correctCount: 0,
  incorrectCount: 0,
  unansweredCount: 0,
  obtainedMarks: 0,
  percentage: 0,
  isPassed: false,
  grade: "",
  performanceRemark: ""
};

/* ============================================================================
   3. DOM ELEMENT REFERENCES (Demonstrating getElementById & querySelector)
   ============================================================================ */

// SPA Views
const viewWelcome = document.getElementById("view-welcome");
const viewInstructions = document.getElementById("view-instructions");
const viewQuiz = document.getElementById("view-quiz");
const viewResult = document.getElementById("view-result");

// Live Header Clock
const liveClockEl = document.getElementById("live-clock");

// Registration Form Elements
const registrationForm = document.getElementById("registration-form");
const inputStudentName = document.getElementById("student-name");
const inputRegNumber = document.getElementById("reg-number");
const selectDepartment = document.getElementById("department-select");
const selectExam = document.getElementById("exam-select");
const formErrorAlert = document.getElementById("form-error-alert");
const formErrorMsg = document.getElementById("form-error-msg");

// Instructions View Elements
const instStudentName = document.getElementById("inst-student-name");
const instRegNo = document.getElementById("inst-reg-no");
const instDept = document.getElementById("inst-dept");
const instExamName = document.getElementById("inst-exam-name");
const chkDeclaration = document.getElementById("chk-declaration");
const btnBackToWelcome = document.getElementById("btn-back-to-welcome");
const btnStartTest = document.getElementById("btn-start-test");

// Quiz Topbar & Metadata
const quizStudentAvatar = document.getElementById("quiz-student-avatar");
const quizStudentName = document.getElementById("quiz-student-name");
const quizRegNo = document.getElementById("quiz-reg-no");
const quizExamTitle = document.getElementById("quiz-exam-title");
const progressCount = document.getElementById("progress-count");
const progressPercent = document.getElementById("progress-percent");
const progressBarFill = document.getElementById("progress-bar-fill");
const timerBox = document.getElementById("timer-box");
const timerDisplay = document.getElementById("timer-display");
const timerWarningBanner = document.getElementById("timer-warning-banner");

// Question Card Elements
const currentQuestionNumEl = document.getElementById("current-question-num");
const qStatusTag = document.getElementById("q-status-tag");
const qReviewTag = document.getElementById("q-review-tag");
const questionTextEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionQuickIndex = document.getElementById("question-quick-index");

// Question Actions & Navigation
const btnMarkReview = document.getElementById("btn-mark-review");
const btnMarkReviewText = document.getElementById("btn-mark-review-text");
const btnClearAnswer = document.getElementById("btn-clear-answer");
const btnPrevQuestion = document.getElementById("btn-prev-question");
const btnNextQuestion = document.getElementById("btn-next-question");
const btnSubmitExam = document.getElementById("btn-submit-exam");

// Sidebar Palette & Stats
const paletteGrid = document.getElementById("palette-grid");
const statCountAnswered = document.getElementById("stat-count-answered");
const statCountReview = document.getElementById("stat-count-review");
const statCountCurrent = document.getElementById("stat-count-current");
const statCountNotvisited = document.getElementById("stat-count-notvisited");
const btnPaletteSubmit = document.getElementById("btn-palette-submit");

// Submission Confirmation Modal
const modalSubmitConfirm = document.getElementById("modal-submit-confirm");
const btnModalClose = document.getElementById("btn-modal-close");
const btnModalCancel = document.getElementById("btn-modal-cancel");
const btnModalConfirmSubmit = document.getElementById("btn-modal-confirm-submit");
const modalAnsweredCount = document.getElementById("modal-answered-count");
const modalUnansweredCount = document.getElementById("modal-unanswered-count");
const modalReviewCount = document.getElementById("modal-review-count");
const modalUnansweredWarning = document.getElementById("modal-unanswered-warning");
const modalUnansweredListMsg = document.getElementById("modal-unanswered-list-msg");
const unansweredQuickLinks = document.getElementById("unanswered-quick-links");

// Timeout Modal
const modalTimeoutNotice = document.getElementById("modal-timeout-notice");

// Result Page Elements
const resultStatusStamp = document.getElementById("result-status-stamp");
const stampText = document.getElementById("stamp-text");
const resStudentName = document.getElementById("res-student-name");
const resRegNumber = document.getElementById("res-reg-number");
const resDepartment = document.getElementById("res-department");
const resExamName = document.getElementById("res-exam-name");
const resExamDate = document.getElementById("res-exam-date");
const resTimeTaken = document.getElementById("res-time-taken");

const scoreRingCircle = document.getElementById("score-ring-circle");
const resPercentage = document.getElementById("res-percentage");
const resScoreFraction = document.getElementById("res-score-fraction");
const verdictBanner = document.getElementById("verdict-banner");
const verdictIcon = document.getElementById("verdict-icon");
const verdictHeading = document.getElementById("verdict-heading");
const verdictGrade = document.getElementById("verdict-grade");
const resPerformanceRemark = document.getElementById("res-performance-remark");

const resStatTotal = document.getElementById("res-stat-total");
const resStatCorrect = document.getElementById("res-stat-correct");
const resStatIncorrect = document.getElementById("res-stat-incorrect");
const resStatUnanswered = document.getElementById("res-stat-unanswered");
const resStatObtained = document.getElementById("res-stat-obtained");

const btnPrintResult = document.getElementById("btn-print-result");
const btnToggleReview = document.getElementById("btn-toggle-review");
const reviewToggleText = document.getElementById("review-toggle-text");
const btnRetakeExam = document.getElementById("btn-retake-exam");
const btnReturnHome = document.getElementById("btn-return-home");

const detailedReviewSection = document.getElementById("detailed-review-section");
const reviewQuestionsList = document.getElementById("review-questions-list");

/* ============================================================================
   4. SYSTEM CLOCK & INITIALIZATION (Demonstrating Date Objects)
   ============================================================================ */

/**
 * Initializes and continuously updates the live header clock
 */
function startLiveSystemClock() {
  function updateTime() {
    // JavaScript Date Object demonstration
    const now = new Date();
    if (liveClockEl) {
      liveClockEl.textContent = now.toLocaleTimeString();
    }
  }
  updateTime();
  setInterval(updateTime, 1000);
}

/**
 * Switches between SPA views smoothly
 * @param {HTMLElement} targetView 
 */
function switchView(targetView) {
  const views = [viewWelcome, viewInstructions, viewQuiz, viewResult];
  views.forEach(function (view) {
    if (view) {
      view.classList.remove("active");
    }
  });

  if (targetView) {
    targetView.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ============================================================================
   5. VALIDATION & EXCEPTION HANDLING (try, catch, finally, throw)
   ============================================================================ */

/**
 * Custom Error Class for Form Validation
 */
class ValidationError extends Error {
  constructor(message, fieldElement) {
    super(message);
    this.name = "ValidationError";
    this.fieldElement = fieldElement;
  }
}

/**
 * Validates Candidate Registration Form with comprehensive try...catch...finally
 */
function handleCandidateRegistration(event) {
  event.preventDefault();

  // Reset visual error state
  formErrorAlert.style.display = "none";
  formErrorMsg.textContent = "";
  [inputStudentName, inputRegNumber, selectDepartment, selectExam].forEach(function (el) {
    el.classList.remove("is-invalid");
  });

  try {
    const rawName = inputStudentName.value.trim();
    const rawReg = inputRegNumber.value.trim();
    const rawDept = selectDepartment.value;
    const rawExam = selectExam.value;

    // Validate Student Name
    if (!rawName) {
      throw new ValidationError("Please enter your Student Full Name.", inputStudentName);
    }
    if (rawName.length < 3) {
      throw new ValidationError("Student Name must be at least 3 characters long.", inputStudentName);
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(rawName)) {
      throw new ValidationError("Student Name should contain valid alphabetic characters only.", inputStudentName);
    }

    // Validate Register Number
    if (!rawReg) {
      throw new ValidationError("Please enter your Register / Hall Ticket Number.", inputRegNumber);
    }
    if (rawReg.length < 4 || !/^[a-zA-Z0-9_-]+$/.test(rawReg)) {
      throw new ValidationError("Please enter a valid alphanumeric Register Number (e.g. 26CS1084).", inputRegNumber);
    }

    // Validate Department
    if (!rawDept) {
      throw new ValidationError("Please select your academic department from the dropdown list.", selectDepartment);
    }

    // Validate Examination Choice
    if (!rawExam || !EXAM_DATABASE[rawExam]) {
      throw new ValidationError("Please select a valid scheduled examination paper.", selectExam);
    }

    // Populate candidate session object
    candidateSession.name = rawName;
    candidateSession.regNumber = rawReg.toUpperCase();
    candidateSession.department = rawDept;
    candidateSession.examKey = rawExam;
    candidateSession.examTitle = EXAM_DATABASE[rawExam].title;
    candidateSession.examCode = EXAM_DATABASE[rawExam].code;

    // Prepare Instructions View using DHTML DOM updates
    instStudentName.textContent = candidateSession.name;
    instRegNo.textContent = candidateSession.regNumber;
    instDept.textContent = candidateSession.department;
    instExamName.textContent = `${candidateSession.examTitle} (${candidateSession.examCode})`;

    // Reset declaration checkbox and disable Start Test button initially
    chkDeclaration.checked = false;
    btnStartTest.disabled = true;

    // Transition to Instructions View
    switchView(viewInstructions);

  } catch (err) {
    // Exception caught and displayed gracefully
    formErrorAlert.style.display = "flex";
    if (err instanceof ValidationError) {
      formErrorMsg.textContent = err.message;
      if (err.fieldElement) {
        err.fieldElement.classList.add("is-invalid");
        err.fieldElement.focus();
      }
    } else {
      formErrorMsg.textContent = "An unexpected error occurred during validation: " + err.message;
    }
  } finally {
    // Demonstration of 'finally' block: runs unconditionally
    // console.log("Candidate registration validation cycle executed.");
  }
}

/* ============================================================================
   6. EXAMINATION INITIALIZATION & TIMING (Date Objects)
   ============================================================================ */

/**
 * Initializes examination questions, response arrays, and starts the test
 */
function startExaminationTest() {
  try {
    if (!candidateSession.examKey || !EXAM_DATABASE[candidateSession.examKey]) {
      throw new Error("Invalid examination selected or session expired.");
    }

    activeExam = EXAM_DATABASE[candidateSession.examKey];
    isExamSubmitted = false;
    currentQuestionIndex = 0;

    // Initializing response array (10 objects)
    userResponses = [];
    for (let i = 0; i < activeExam.questions.length; i++) {
      userResponses.push({
        questionId: activeExam.questions[i].id,
        selectedOption: null, // null = unattempted; 0, 1, 2, 3 = selected choice index
        isMarkedForReview: false,
        isVisited: false
      });
    }

    // Mark first question as visited
    userResponses[0].isVisited = true;

    // Record Exam Start Time using JavaScript Date Object
    candidateSession.startTime = new Date();
    // Calculate accurate future timestamp for drift-immune countdown
    candidateSession.endTimeTarget = candidateSession.startTime.getTime() + (EXAM_DURATION_SECONDS * 1000);

    // Update Quiz Topbar
    quizStudentName.textContent = candidateSession.name;
    quizRegNo.textContent = "Reg: " + candidateSession.regNumber;
    quizExamTitle.textContent = activeExam.title;

    // Generate Student Initials Avatar
    const nameParts = candidateSession.name.split(" ");
    let initials = nameParts[0].charAt(0).toUpperCase();
    if (nameParts.length > 1) {
      initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    }
    quizStudentAvatar.textContent = initials;

    // Render Question Palette Grid
    renderQuestionPalette();

    // Render Current Question
    renderCurrentQuestion();

    // Update Progress & Status counters
    updateExamProgressAndCounters();

    // Start Timer
    startExamCountdownTimer();

    // Transition to Quiz Interface
    switchView(viewQuiz);

  } catch (error) {
    alert("Error starting examination: " + error.message);
  }
}

/**
 * Accurate Countdown Timer using JavaScript Date timestamps
 * Ensures resilience against background tab throttling
 */
function startExamCountdownTimer() {
  // Clear any pre-existing timer interval
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }

  isTwoMinuteWarned = false;
  timerBox.classList.remove("timer-warning", "timer-critical");
  timerWarningBanner.style.display = "none";

  function tickTimer() {
    if (isExamSubmitted) {
      clearInterval(timerIntervalId);
      return;
    }

    // Current timestamp via Date.now()
    const nowTimestamp = Date.now();
    const remainingMilliseconds = Math.max(0, candidateSession.endTimeTarget - nowTimestamp);
    timeRemainingSeconds = Math.ceil(remainingMilliseconds / 1000);

    // Format MM:SS
    const minutes = Math.floor(timeRemainingSeconds / 60);
    const seconds = timeRemainingSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

    // Two-minute warning (120 seconds)
    if (timeRemainingSeconds <= 120 && timeRemainingSeconds > 0) {
      if (!isTwoMinuteWarned) {
        isTwoMinuteWarned = true;
        timerBox.classList.add("timer-warning");
        timerWarningBanner.style.display = "flex";
      }
    }

    // Critical warning under 60 seconds
    if (timeRemainingSeconds <= 60 && timeRemainingSeconds > 0) {
      timerBox.classList.add("timer-critical");
    }

    // Auto-submission on time expiration
    if (timeRemainingSeconds <= 0) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
      handleTimeExpirationAutoSubmit();
    }
  }

  tickTimer();
  timerIntervalId = setInterval(tickTimer, 1000);
}

/**
 * Handles Automatic Examination Submission on Timeout
 */
function handleTimeExpirationAutoSubmit() {
  if (isExamSubmitted) return;
  isExamSubmitted = true;

  // Show timeout announcement modal
  modalTimeoutNotice.style.display = "flex";

  // Hide submission confirmation modal if open
  modalSubmitConfirm.style.display = "none";

  // Record submission timestamp
  candidateSession.submittedAt = new Date();

  // Evaluate exam after brief 1.5s notice for candidate awareness
  setTimeout(function () {
    modalTimeoutNotice.style.display = "none";
    finalizeExamAndEvaluateResults();
  }, 1600);
}

/* ============================================================================
   7. DHTML & DOM MANIPULATION: QUESTION & OPTIONS RENDERING
   Demonstrates: createElement, appendChild, textContent, innerHTML, querySelector
   ============================================================================ */

/**
 * Dynamically renders the current question and its four options (A, B, C, D)
 */
function renderCurrentQuestion() {
  if (!activeExam || !activeExam.questions[currentQuestionIndex]) return;

  const currentQ = activeExam.questions[currentQuestionIndex];
  const currentResp = userResponses[currentQuestionIndex];

  // Mark as visited
  currentResp.isVisited = true;

  // Update Question Header elements using textContent
  currentQuestionNumEl.textContent = currentQuestionIndex + 1;
  questionQuickIndex.textContent = `Question ${currentQuestionIndex + 1} of ${activeExam.questions.length}`;

  // Update Question Text using textContent (prevent XSS)
  questionTextEl.textContent = currentQ.question;

  // Update Status Tag
  if (currentResp.selectedOption !== null) {
    qStatusTag.textContent = "Answered";
    qStatusTag.className = "tag tag-status answered";
  } else {
    qStatusTag.textContent = "Not Answered";
    qStatusTag.className = "tag tag-status";
  }

  // Update Review Tag
  if (currentResp.isMarkedForReview) {
    qReviewTag.style.display = "inline-block";
    btnMarkReviewText.textContent = "Unmark Review";
    btnMarkReview.classList.remove("btn-outline-warning");
    btnMarkReview.classList.add("btn-warning");
  } else {
    qReviewTag.style.display = "none";
    btnMarkReviewText.textContent = "Mark for Review";
    btnMarkReview.classList.remove("btn-warning");
    btnMarkReview.classList.add("btn-outline-warning");
  }

  // Update Navigation Buttons State (Previous disabled on first question)
  btnPrevQuestion.disabled = (currentQuestionIndex === 0);
  
  if (currentQuestionIndex === activeExam.questions.length - 1) {
    btnNextQuestion.style.display = "none";
  } else {
    btnNextQuestion.style.display = "inline-flex";
  }

  // Clear previous options container using innerHTML demonstration
  optionsContainer.innerHTML = "";

  // Dynamic Options Generation demonstrating createElement and appendChild
  const optionLetters = ["A", "B", "C", "D"];
  currentQ.options.forEach(function (optionText, optIndex) {
    // 1. Create outer card element
    const optionCard = document.createElement("div");
    optionCard.className = "option-item";
    optionCard.setAttribute("role", "radio");
    optionCard.setAttribute("aria-checked", currentResp.selectedOption === optIndex ? "true" : "false");
    optionCard.setAttribute("tabindex", "0");
    optionCard.dataset.index = optIndex;

    // Check if this option is selected
    if (currentResp.selectedOption === optIndex) {
      optionCard.classList.add("selected");
    }

    // 2. Create Option Badge (A, B, C, D)
    const badge = document.createElement("span");
    badge.className = "option-badge";
    badge.textContent = optionLetters[optIndex];

    // 3. Create Option Label Text
    const label = document.createElement("span");
    label.className = "option-label";
    label.textContent = optionText;

    // 4. Append components to option card
    optionCard.appendChild(badge);
    optionCard.appendChild(label);

    // 5. Attach Click & Keydown Event Listeners
    optionCard.addEventListener("click", function () {
      handleOptionSelection(optIndex);
    });

    optionCard.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOptionSelection(optIndex);
      }
    });

    // 6. Append card into container
    optionsContainer.appendChild(optionCard);
  });

  // Update Palette & Counters
  updateQuestionPaletteActiveState();
  updateExamProgressAndCounters();
}

/**
 * Handles Candidate's Option Selection
 * @param {number} optionIndex 
 */
function handleOptionSelection(optionIndex) {
  if (isExamSubmitted) return;

  userResponses[currentQuestionIndex].selectedOption = optionIndex;
  
  // Re-render current question to update option selection styles
  renderCurrentQuestion();
}

/**
 * Clears the selected answer for the current question
 */
function handleClearAnswer() {
  if (isExamSubmitted) return;

  userResponses[currentQuestionIndex].selectedOption = null;
  renderCurrentQuestion();
}

/**
 * Toggles Mark for Review flag for the current question
 */
function handleToggleMarkForReview() {
  if (isExamSubmitted) return;

  const currentResp = userResponses[currentQuestionIndex];
  currentResp.isMarkedForReview = !currentResp.isMarkedForReview;
  renderCurrentQuestion();
}

/* ============================================================================
   8. QUESTION PALETTE SYSTEM (DHTML Dynamic Navigation 1–10)
   ============================================================================ */

/**
 * Renders Question Palette buttons (1 to 10) dynamically via DOM
 */
function renderQuestionPalette() {
  if (!paletteGrid || !activeExam) return;
  paletteGrid.innerHTML = "";

  activeExam.questions.forEach(function (q, index) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "palette-btn palette-not-visited";
    btn.textContent = index + 1;
    btn.setAttribute("aria-label", `Navigate to Question ${index + 1}`);
    btn.dataset.qIndex = index;

    btn.addEventListener("click", function () {
      navigateToQuestion(index);
    });

    paletteGrid.appendChild(btn);
  });
}

/**
 * Updates visual status colors for palette buttons
 * Statuses:
 * - Grey: Not visited
 * - Blue: Current
 * - Green: Answered
 * - Orange: Marked for Review
 */
function updateQuestionPaletteActiveState() {
  const paletteBtns = paletteGrid.querySelectorAll(".palette-btn");

  paletteBtns.forEach(function (btn, index) {
    const resp = userResponses[index];
    btn.className = "palette-btn"; // Reset base

    if (index === currentQuestionIndex) {
      btn.classList.add("palette-current");
    } else if (resp.isMarkedForReview) {
      btn.classList.add("palette-review");
      if (resp.selectedOption !== null) {
        btn.classList.add("palette-answered");
      }
    } else if (resp.selectedOption !== null) {
      btn.classList.add("palette-answered");
    } else if (resp.isVisited) {
      btn.classList.add("palette-not-visited");
    } else {
      btn.classList.add("palette-not-visited");
    }
  });
}

/**
 * Safely navigates to a specific question index with range validation
 * @param {number} targetIndex 
 */
function navigateToQuestion(targetIndex) {
  try {
    if (targetIndex < 0 || targetIndex >= activeExam.questions.length) {
      throw new RangeError("Question index out of bounds: " + targetIndex);
    }
    currentQuestionIndex = targetIndex;
    renderCurrentQuestion();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Updates overall progress bar and live sidebar statistics
 */
function updateExamProgressAndCounters() {
  let answeredCount = 0;
  let reviewCount = 0;
  let notVisitedCount = 0;

  userResponses.forEach(function (resp, index) {
    if (resp.selectedOption !== null) {
      answeredCount++;
    }
    if (resp.isMarkedForReview) {
      reviewCount++;
    }
    if (!resp.isVisited && index !== currentQuestionIndex) {
      notVisitedCount++;
    }
  });

  const total = activeExam.questions.length;
  const percentageAnswered = Math.round((answeredCount / total) * 100);

  // Update topbar progress
  progressCount.textContent = `${answeredCount}/${total}`;
  progressPercent.textContent = `${percentageAnswered}%`;
  progressBarFill.style.width = `${percentageAnswered}%`;

  // Update sidebar live counters
  statCountAnswered.textContent = answeredCount;
  statCountReview.textContent = reviewCount;
  statCountCurrent.textContent = currentQuestionIndex + 1;
  statCountNotvisited.textContent = notVisitedCount;
}

/* ============================================================================
   9. MANUAL SUBMISSION CONFIRMATION & MANDATORY VALIDATION
   ============================================================================ */

/**
 * Opens Submission Confirmation Modal and verifies mandatory questions
 */
function promptManualSubmissionConfirmation() {
  if (isExamSubmitted) return;

  let answeredCount = 0;
  let unansweredQuestions = [];
  let reviewCount = 0;

  userResponses.forEach(function (resp, index) {
    if (resp.selectedOption !== null) {
      answeredCount++;
    } else {
      unansweredQuestions.push(index + 1); // 1-based question number
    }
    if (resp.isMarkedForReview) {
      reviewCount++;
    }
  });

  // Populate Modal Summary
  modalAnsweredCount.textContent = answeredCount;
  modalUnansweredCount.textContent = unansweredQuestions.length;
  modalReviewCount.textContent = reviewCount;

  // Unanswered Questions Alert Validation
  unansweredQuickLinks.innerHTML = "";
  if (unansweredQuestions.length > 0) {
    modalUnansweredWarning.style.display = "block";
    modalUnansweredListMsg.textContent = 
      `Attention: You have ${unansweredQuestions.length} unanswered mandatory question(s) [Questions: ${unansweredQuestions.join(", ")}]. Click any number below to review:`;

    // Add quick jump buttons for each unanswered question
    unansweredQuestions.forEach(function (qNum) {
      const jumpBtn = document.createElement("button");
      jumpBtn.type = "button";
      jumpBtn.className = "btn-jump-unanswered";
      jumpBtn.textContent = `Go to Q${qNum}`;
      jumpBtn.addEventListener("click", function () {
        closeSubmissionModal();
        navigateToQuestion(qNum - 1);
      });
      unansweredQuickLinks.appendChild(jumpBtn);
    });
  } else {
    modalUnansweredWarning.style.display = "none";
  }

  // Display modal
  modalSubmitConfirm.style.display = "flex";
}

/**
 * Closes the submission modal
 */
function closeSubmissionModal() {
  modalSubmitConfirm.style.display = "none";
}

/**
 * Executes Manual Confirmation and starts finalization
 */
function handleConfirmManualSubmission() {
  closeSubmissionModal();
  if (isExamSubmitted) return;
  isExamSubmitted = true;

  // Record End Timestamp
  candidateSession.submittedAt = new Date();

  // Stop Timer
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }

  // Evaluate
  finalizeExamAndEvaluateResults();
}

/* ============================================================================
   10. RESULT EVALUATION & DHTML SCORECARD PRESENTATION
   Demonstrates:
   - DHTML Result Generation without page reload
   - Circular animated SVG score gauge
   - Pass / Fail criteria (40% = 4 marks)
   - Performance categories
   - Detailed question-wise review with explanations
   ============================================================================ */

/**
 * Evaluates responses, computes scores, and renders DHTML Result page
 */
function finalizeExamAndEvaluateResults() {
  try {
    if (!candidateSession.submittedAt) {
      candidateSession.submittedAt = new Date();
    }
    if (!candidateSession.startTime) {
      candidateSession.startTime = new Date();
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    // Evaluate answers
    activeExam.questions.forEach(function (q, index) {
      const resp = userResponses[index];
      if (resp.selectedOption === null) {
        unansweredCount++;
      } else if (resp.selectedOption === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const totalQuestions = activeExam.questions.length;
    const obtainedMarks = correctCount; // 1 mark each
    const percentage = Math.round((obtainedMarks / totalQuestions) * 100);
    const isPassed = percentage >= activeExam.passingPercentage;

    // Calculate elapsed time
    const startMs = candidateSession.startTime.getTime();
    const endMs = candidateSession.submittedAt ? candidateSession.submittedAt.getTime() : Date.now();
    const totalSecondsSpent = Math.min(EXAM_DURATION_SECONDS, Math.max(1, Math.round((endMs - startMs) / 1000)));
    const spentMinutes = Math.floor(totalSecondsSpent / 60);
    const spentSecs = totalSecondsSpent % 60;
    candidateSession.timeTakenFormatted = `${spentMinutes}m ${spentSecs}s`;

    // Determine Performance Message and Grade
    let grade = "F";
    let performanceRemark = "";

    if (percentage >= 90) {
      grade = "A+ (Distinction)";
      performanceRemark = "90–100% Excellent Performance! Outstanding mastery of the subject matter.";
    } else if (percentage >= 75) {
      grade = "A (Very Good)";
      performanceRemark = "75–89% Very Good! Commendable understanding and problem-solving skills.";
    } else if (percentage >= 60) {
      grade = "B (Good)";
      performanceRemark = "60–74% Good Performance! Solid foundation with room for refinement.";
    } else if (percentage >= 40) {
      grade = "C (Pass)";
      performanceRemark = "40–59% Passed. Met the minimum university qualification criteria.";
    } else {
      grade = "F (Fail)";
      performanceRemark = "Below 40% Better Luck Next Time. Review the detailed solutions below and attempt again.";
    }

    // Populate Evaluation Score Object
    evaluationScore.totalQuestions = totalQuestions;
    evaluationScore.totalMarks = totalQuestions;
    evaluationScore.correctCount = correctCount;
    evaluationScore.incorrectCount = incorrectCount;
    evaluationScore.unansweredCount = unansweredCount;
    evaluationScore.obtainedMarks = obtainedMarks;
    evaluationScore.percentage = percentage;
    evaluationScore.isPassed = isPassed;
    evaluationScore.grade = grade;
    evaluationScore.performanceRemark = performanceRemark;

    // Render DHTML Scorecard Details
    renderDHTMLScorecard();

    // Render Detailed Answer Review
    renderDetailedQuestionReview();

    // Transition smoothly to Result View
    switchView(viewResult);

  } catch (error) {
    console.error("Evaluation error: ", error);
    alert("Evaluation error occurred: " + error.message);
  }
}

/**
 * Updates DOM elements in Result View with Candidate and Score Information
 */
function renderDHTMLScorecard() {
  // Official Candidate Metadata
  const examDateObj = candidateSession.submittedAt || new Date();
  resStudentName.textContent = candidateSession.name;
  resRegNumber.textContent = candidateSession.regNumber;
  resDepartment.textContent = candidateSession.department;
  resExamName.textContent = `${activeExam.title} (${activeExam.code})`;
  resExamDate.textContent = examDateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  resTimeTaken.textContent = candidateSession.timeTakenFormatted;

  // Status Stamp (PASS / FAIL)
  if (evaluationScore.isPassed) {
    resultStatusStamp.className = "result-status-stamp";
    stampText.textContent = "PASS";
    verdictBanner.className = "verdict-banner";
    verdictIcon.textContent = "🎉";
    verdictHeading.textContent = "EXAMINATION PASSED";
    verdictHeading.style.color = "var(--color-success)";
    scoreRingCircle.style.stroke = "var(--color-success)";
  } else {
    resultStatusStamp.className = "result-status-stamp stamp-fail";
    stampText.textContent = "FAIL";
    verdictBanner.className = "verdict-banner verdict-fail";
    verdictIcon.textContent = "⚠️";
    verdictHeading.textContent = "NOT QUALIFIED";
    verdictHeading.style.color = "var(--color-danger)";
    scoreRingCircle.style.stroke = "var(--color-danger)";
  }

  verdictGrade.textContent = `Grade Awarded: ${evaluationScore.grade}`;
  resPerformanceRemark.textContent = evaluationScore.performanceRemark;

  // Circular Score Indicator (SVG Dash Offset Animation)
  // Radius r=72 -> Circumference = 2 * PI * 72 = 452.39
  const circumference = 2 * Math.PI * 72;
  const strokeOffset = circumference - (evaluationScore.percentage / 100) * circumference;

  resPercentage.textContent = `${evaluationScore.percentage}%`;
  resScoreFraction.textContent = `${evaluationScore.obtainedMarks} / ${evaluationScore.totalMarks} Marks`;

  setTimeout(function () {
    scoreRingCircle.style.strokeDashoffset = strokeOffset;
  }, 150);

  // Quantitative Stats Grid
  resStatTotal.textContent = evaluationScore.totalQuestions;
  resStatCorrect.textContent = evaluationScore.correctCount;
  resStatIncorrect.textContent = evaluationScore.incorrectCount;
  resStatUnanswered.textContent = evaluationScore.unansweredCount;
  resStatObtained.textContent = `${evaluationScore.obtainedMarks} / ${evaluationScore.totalMarks}`;
}

/**
 * Dynamically builds the detailed question-wise review list with explanations
 */
function renderDetailedQuestionReview() {
  reviewQuestionsList.innerHTML = "";
  const optionLetters = ["A", "B", "C", "D"];

  activeExam.questions.forEach(function (q, index) {
    const resp = userResponses[index];
    const isCorrect = resp.selectedOption === q.correctAnswer;
    const isSkipped = resp.selectedOption === null;

    // Card Container
    const card = document.createElement("div");
    card.className = "review-question-card";

    if (isCorrect) {
      card.classList.add("status-correct");
    } else if (isSkipped) {
      card.classList.add("status-unanswered");
    } else {
      card.classList.add("status-incorrect");
    }

    // Top Bar (Question # & Status Pill)
    const topBar = document.createElement("div");
    topBar.className = "review-card-top";

    const qNum = document.createElement("span");
    qNum.className = "review-q-num";
    qNum.textContent = `Question ${index + 1} of ${activeExam.questions.length}`;

    const statusPill = document.createElement("span");
    statusPill.className = "review-status-pill";
    if (isCorrect) {
      statusPill.classList.add("correct");
      statusPill.innerHTML = "<span>✓</span> Correct (+1 Mark)";
    } else if (isSkipped) {
      statusPill.classList.add("unanswered");
      statusPill.innerHTML = "<span>⚠️</span> Unanswered (0 Marks)";
    } else {
      statusPill.classList.add("incorrect");
      statusPill.innerHTML = "<span>✕</span> Incorrect (0 Marks)";
    }

    topBar.appendChild(qNum);
    topBar.appendChild(statusPill);

    // Question Text
    const qText = document.createElement("p");
    qText.className = "review-q-text";
    qText.textContent = q.question;

    // Options Comparison
    const optionsGrid = document.createElement("div");
    optionsGrid.className = "review-options-grid";

    q.options.forEach(function (optText, optIdx) {
      const optItem = document.createElement("div");
      optItem.className = "review-opt-item";

      const optBadge = document.createElement("span");
      optBadge.className = "review-opt-badge";
      optBadge.textContent = optionLetters[optIdx];

      const optLabel = document.createElement("span");
      optLabel.className = "review-opt-label";
      optLabel.textContent = optText;

      optItem.appendChild(optBadge);
      optItem.appendChild(optLabel);

      // Highlight states
      if (optIdx === q.correctAnswer) {
        if (resp.selectedOption === optIdx) {
          optItem.classList.add("is-student-correct");
          const tag = document.createElement("span");
          tag.className = "review-tag-indicator tag-correct-answer";
          tag.textContent = "Your Answer (Correct)";
          optItem.appendChild(tag);
        } else {
          optItem.classList.add("is-correct-answer");
          const tag = document.createElement("span");
          tag.className = "review-tag-indicator tag-correct-answer";
          tag.textContent = "Official Correct Answer";
          optItem.appendChild(tag);
        }
      } else if (resp.selectedOption === optIdx) {
        optItem.classList.add("is-student-wrong");
        const tag = document.createElement("span");
        tag.className = "review-tag-indicator tag-your-answer";
        tag.textContent = "Your Answer (Incorrect)";
        optItem.appendChild(tag);
      }

      optionsGrid.appendChild(optItem);
    });

    // Explanation Box
    const explanationBox = document.createElement("div");
    explanationBox.className = "review-explanation";
    const expLabel = document.createElement("strong");
    expLabel.textContent = "Official Explanation:";
    const expText = document.createElement("p");
    expText.textContent = q.explanation;
    explanationBox.appendChild(expLabel);
    explanationBox.appendChild(expText);

    // Assemble Card
    card.appendChild(topBar);
    card.appendChild(qText);
    card.appendChild(optionsGrid);
    card.appendChild(explanationBox);

    reviewQuestionsList.appendChild(card);
  });
}

/**
 * Toggles visibility of the detailed review section
 */
function handleToggleDetailedReview() {
  const isVisible = detailedReviewSection.classList.contains("active");
  if (isVisible) {
    detailedReviewSection.classList.remove("active");
    reviewToggleText.textContent = "View Detailed Answer Key & Review";
  } else {
    detailedReviewSection.classList.add("active");
    reviewToggleText.textContent = "Hide Answer Key & Review";
    detailedReviewSection.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Retakes the current examination paper with a fresh session
 */
function handleRetakeExamination() {
  if (confirm("Are you sure you want to retake this examination? A fresh 10-minute session will begin.")) {
    startExaminationTest();
  }
}

/**
 * Returns to Welcome Screen to select another exam or candidate
 */
function handleReturnHome() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
  isExamSubmitted = false;
  switchView(viewWelcome);
}

/**
 * Prints official examination result scorecard
 */
function handlePrintResult() {
  // Ensure review is expanded for print if desired
  detailedReviewSection.classList.add("active");
  window.print();
}

/* ============================================================================
   11. EVENT LISTENERS BINDING
   ============================================================================ */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Header Clock
  startLiveSystemClock();

  // Registration Form Submission Event
  registrationForm.addEventListener("submit", handleCandidateRegistration);

  // Honor Code Declaration Checkbox
  chkDeclaration.addEventListener("change", function () {
    btnStartTest.disabled = !this.checked;
  });

  // Instructions Back & Start Buttons
  btnBackToWelcome.addEventListener("click", function () {
    switchView(viewWelcome);
  });

  btnStartTest.addEventListener("click", function () {
    startExaminationTest();
  });

  // Quiz Navigation Buttons
  btnPrevQuestion.addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  });

  btnNextQuestion.addEventListener("click", function () {
    if (currentQuestionIndex < activeExam.questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  });

  // Mark for Review & Clear Answer
  btnMarkReview.addEventListener("click", handleToggleMarkForReview);
  btnClearAnswer.addEventListener("click", handleClearAnswer);

  // Submit Buttons
  btnSubmitExam.addEventListener("click", promptManualSubmissionConfirmation);
  btnPaletteSubmit.addEventListener("click", promptManualSubmissionConfirmation);

  // Modal Actions
  btnModalClose.addEventListener("click", closeSubmissionModal);
  btnModalCancel.addEventListener("click", closeSubmissionModal);
  btnModalConfirmSubmit.addEventListener("click", handleConfirmManualSubmission);

  // Close modal when clicking outside dialog
  modalSubmitConfirm.addEventListener("click", function (event) {
    if (event.target === modalSubmitConfirm) {
      closeSubmissionModal();
    }
  });

  // Scorecard Actions
  btnToggleReview.addEventListener("click", handleToggleDetailedReview);
  btnRetakeExam.addEventListener("click", handleRetakeExamination);
  btnReturnHome.addEventListener("click", handleReturnHome);
  btnPrintResult.addEventListener("click", handlePrintResult);

  // Optional keyboard shortcuts for accessibility:
  document.addEventListener("keydown", function (e) {
    // Only in active quiz view
    if (!viewQuiz.classList.contains("active") || isExamSubmitted) return;

    if (e.key === "ArrowLeft" && !e.altKey && currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    } else if (e.key === "ArrowRight" && !e.altKey && currentQuestionIndex < activeExam.questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  });
});
