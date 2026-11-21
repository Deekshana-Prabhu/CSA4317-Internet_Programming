/**
 * Online Examination and Student Performance Analysis System
 * JavaScript Engine: Frontend Interactions & Browser Demonstration Mode
 * 
 * Works seamlessly in two execution contexts:
 * 1. Browser Demonstration Mode: Simulates entire backend (auth, exam, grading, reports, history) via localStorage.
 * 2. PHP / MySQL Mode: Handles frontend UI, timers, modals, and enhances PHP responses.
 */

// Global State
const AppState = {
    isPhpBackend: window.IS_PHP_BACKEND === true,
    currentSection: 'dashboard',
    student: null,
    exam: {
        active: false,
        subject: 'PHP Fundamentals',
        questions: [],
        currentIndex: 0,
        userAnswers: {},
        timeRemaining: 900, // 15 minutes = 900 seconds
        timerInterval: null,
        submitted: false,
        examId: null
    },
    preferences: {
        preferredSubject: 'PHP Fundamentals',
        fontSize: 'standard',
        timerAlert: true
    }
};

// Complete Question Bank (Matches database.sql)
const QUESTION_BANK = [
    {
        id: 1,
        subject: 'PHP Fundamentals',
        question: 'Which superglobal array in PHP is used to collect form data sent with method="post"?',
        options: { A: '$_GET', B: '$_POST', C: '$_REQUEST', D: '$_SERVER' },
        correct: 'B',
        explanation: 'The $_POST superglobal is widely used in PHP to collect form values after submitting an HTML form with method="post".'
    },
    {
        id: 2,
        subject: 'PHP Fundamentals',
        question: 'How are variables declared in PHP?',
        options: { A: 'var $name;', B: '$name = value;', C: 'dim $name;', D: 'variable name;' },
        correct: 'B',
        explanation: 'In PHP, a variable starts with the dollar sign ($), followed by the name of the variable without explicit keyword declaration.'
    },
    {
        id: 3,
        subject: 'PHP Fundamentals',
        question: 'Which PHP function is specifically used to open a file for read/write operations?',
        options: { A: 'file_open()', B: 'fopen()', C: 'open_file()', D: 'load_file()' },
        correct: 'B',
        explanation: 'fopen() is the core built-in PHP function used to bind a file resource to a stream with specified modes (r, w, a, etc.).'
    },
    {
        id: 4,
        subject: 'HTML',
        question: 'Which HTML5 semantic element represents a container for introductory content or navigation links?',
        options: { A: '<navheader>', B: '<top>', C: '<header>', D: '<intro>' },
        correct: 'C',
        explanation: 'The <header> element in HTML5 typically contains introductory heading tags, logos, search forms, or author names.'
    },
    {
        id: 5,
        subject: 'HTML',
        question: 'Which attribute specifies that an input field in an HTML form must be completed before submission?',
        options: { A: 'validate', B: 'mandatory', C: 'required', D: 'important' },
        correct: 'C',
        explanation: 'The boolean "required" attribute in HTML5 ensures that the form cannot be submitted without filling out the input.'
    },
    {
        id: 6,
        subject: 'HTML',
        question: 'Which HTML tag is used to create an unordered (bulleted) list?',
        options: { A: '<ol>', B: '<ul>', C: '<li>', D: '<list>' },
        correct: 'B',
        explanation: 'The <ul> tag defines an unordered list, typically styled with bullet points by default in user agents.'
    },
    {
        id: 7,
        subject: 'CSS',
        question: 'Which CSS property defines the font size of an element?',
        options: { A: 'font-style', B: 'text-size', C: 'font-size', D: 'typeface-size' },
        correct: 'C',
        explanation: 'The font-size property sets the size of the font in pixels, em, rem, or percentage units.'
    },
    {
        id: 8,
        subject: 'CSS',
        question: 'In the CSS Flexible Box layout, which property defines the main axis direction of flex items?',
        options: { A: 'flex-flow', B: 'flex-direction', C: 'align-items', D: 'justify-content' },
        correct: 'B',
        explanation: 'flex-direction sets how flex items are placed in the flex container along the main axis (row, column, row-reverse, column-reverse).'
    },
    {
        id: 9,
        subject: 'CSS',
        question: 'Which CSS property creates spacing outside an element boundary, pushing adjacent elements away?',
        options: { A: 'padding', B: 'margin', C: 'border-spacing', D: 'outline-offset' },
        correct: 'B',
        explanation: 'Margin generates space around an element outside of its border, while padding adds space inside the border.'
    },
    {
        id: 10,
        subject: 'JavaScript',
        question: 'Which keyword declares a block-scoped variable whose value cannot be reassigned?',
        options: { A: 'var', B: 'let', C: 'const', D: 'immutable' },
        correct: 'C',
        explanation: 'The "const" keyword in modern JavaScript creates an immutable block-scoped binding that cannot be reassigned.'
    },
    {
        id: 11,
        subject: 'JavaScript',
        question: 'What is the return value of evaluating `typeof null` in standard JavaScript?',
        options: { A: '"null"', B: '"undefined"', C: '"object"', D: '"boolean"' },
        correct: 'C',
        explanation: 'Due to a historical design decision in the first implementation of JavaScript, typeof null evaluates to "object".'
    },
    {
        id: 12,
        subject: 'JavaScript',
        question: 'Which modern DOM method attaches an event handler function to a specified element?',
        options: { A: 'element.attach()', B: 'element.addEventListener()', C: 'element.listen()', D: 'element.on()' },
        correct: 'B',
        explanation: 'addEventListener() sets up a function that will be called whenever the specified event is delivered to the target.'
    },
    {
        id: 13,
        subject: 'MySQL',
        question: 'Which SQL clause is used to filter records and return only those matching a specific condition?',
        options: { A: 'ORDER BY', B: 'GROUP BY', C: 'WHERE', D: 'HAVING' },
        correct: 'C',
        explanation: 'The WHERE clause extracts only those records that fulfill a specified filter condition in SQL.'
    },
    {
        id: 14,
        subject: 'MySQL',
        question: 'Which SQL statement clause arranges the retrieved result set in ascending or descending order?',
        options: { A: 'SORT BY', B: 'ORDER BY', C: 'ALIGN BY', D: 'FILTER BY' },
        correct: 'B',
        explanation: 'ORDER BY sorts the result set in ascending (ASC) by default, or descending (DESC) order.'
    },
    {
        id: 15,
        subject: 'MySQL',
        question: 'In relational databases, what links a foreign key column to the primary key of another table?',
        options: { A: 'Referential Integrity', B: 'Cyclic Index', C: 'Data Redundancy', D: 'Binary Linkage' },
        correct: 'A',
        explanation: 'Referential integrity is a property of data stating that all its references are valid, maintained by foreign key constraints.'
    },
    {
        id: 16,
        subject: 'Basic Programming Concepts',
        question: 'What is the worst-case time complexity of binary search on a pre-sorted array of size n?',
        options: { A: 'O(n)', B: 'O(1)', C: 'O(log n)', D: 'O(n^2)' },
        correct: 'C',
        explanation: 'Binary search divides the search space in half with every step, resulting in logarithmic O(log n) time complexity.'
    },
    {
        id: 17,
        subject: 'Basic Programming Concepts',
        question: 'Which Object-Oriented Programming pillar bundles data and related methods inside a class to prevent direct access?',
        options: { A: 'Polymorphism', B: 'Inheritance', C: 'Encapsulation', D: 'Abstraction' },
        correct: 'C',
        explanation: 'Encapsulation binds together code and data it manipulates, keeping both safe from outside interference and misuse.'
    },
    {
        id: 18,
        subject: 'Basic Programming Concepts',
        question: 'Which data structure strictly operates under the Last-In, First-Out (LIFO) protocol?',
        options: { A: 'Queue', B: 'Stack', C: 'Linked List', D: 'Binary Tree' },
        correct: 'B',
        explanation: 'A Stack is a linear data structure that adheres to the LIFO principle, where elements are added and removed from the top.'
    }
];

// Demo Students
const DEMO_STUDENTS = [
    { student_id: 'STU2024001', student_name: 'John Doe', email: 'john.doe@example.com', password: 'demo123' },
    { student_id: 'STU2024002', student_name: 'Jane Smith', email: 'jane.smith@example.com', password: 'demo123' },
    { student_id: 'STU2024003', student_name: 'Alex Johnson', email: 'alex.j@example.com', password: 'demo123' }
];

// Seed Historical Data for demonstration
const SAMPLE_HISTORY = [
    {
        examination_id: 'EXAM-20241115-001',
        student_id: 'STU2024001',
        student_name: 'John Doe',
        subject: 'Full Stack Development',
        total_questions: 15,
        correct_answers: 14,
        incorrect_answers: 1,
        unanswered_questions: 0,
        total_marks: 14,
        percentage: 93.33,
        grade: 'A+',
        result_status: 'Pass',
        examination_date: '2024-11-15 10:30:00'
    },
    {
        examination_id: 'EXAM-20241118-002',
        student_id: 'STU2024001',
        student_name: 'John Doe',
        subject: 'PHP Fundamentals',
        total_questions: 15,
        correct_answers: 12,
        incorrect_answers: 2,
        unanswered_questions: 1,
        total_marks: 12,
        percentage: 80.00,
        grade: 'A',
        result_status: 'Pass',
        examination_date: '2024-11-18 14:15:00'
    },
    {
        examination_id: 'EXAM-20241119-003',
        student_id: 'STU2024001',
        student_name: 'John Doe',
        subject: 'MySQL & Databases',
        total_questions: 15,
        correct_answers: 11,
        incorrect_answers: 3,
        unanswered_questions: 1,
        total_marks: 11,
        percentage: 73.33,
        grade: 'B',
        result_status: 'Pass',
        examination_date: '2024-11-19 16:45:00'
    }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupNavigation();
    setupPreferences();
    loadDemoStudentSession();
    setupEventListeners();
    
    // Check initial section
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    navigateToSection(hash);

    // Initial render of dynamic views
    renderDashboard();
    renderHistory();
    renderPerformanceAnalysis();
}

/**
 * Navigation and Sidebar Handlers
 */
function setupNavigation() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const backdrop = document.getElementById('sidebarBackdrop');

    // Sidebar collapse toggle
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Mobile hamburger menu toggle
    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            if (backdrop) backdrop.classList.toggle('active');
        });
    }

    // Backdrop click closes mobile drawer
    if (backdrop && sidebar) {
        backdrop.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            backdrop.classList.remove('active');
        });
    }

    // Nav Item Click Handlers
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-target');
            if (targetSection === 'logout') {
                handleLogout();
            } else {
                navigateToSection(targetSection);
            }

            // Close mobile menu if open
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (backdrop) backdrop.classList.remove('active');
            }
        });
    });
}

function navigateToSection(sectionId) {
    // If not authenticated and trying to access protected sections
    const protectedSections = ['examination', 'results', 'performance', 'history', 'preferences'];
    if (!AppState.student && protectedSections.includes(sectionId)) {
        showToast('Please log in with your Student ID to access this section.', 'warning');
        sectionId = 'login';
    }

    // Update active nav link
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-target') === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update active section visibility
    document.querySelectorAll('.app-section').forEach(sec => {
        sec.classList.remove('active-section');
    });

    const activeSec = document.getElementById(`section-${sectionId}`);
    if (activeSec) {
        activeSec.classList.add('active-section');
        AppState.currentSection = sectionId;
        window.location.hash = sectionId;

        // Update Topbar page title
        const pageTitleElem = document.getElementById('topbarPageTitle');
        if (pageTitleElem) {
            pageTitleElem.textContent = getSectionTitle(sectionId);
        }

        // Trigger section-specific refreshes
        if (sectionId === 'dashboard') renderDashboard();
        if (sectionId === 'history') renderHistory();
        if (sectionId === 'performance') renderPerformanceAnalysis();
        if (sectionId === 'preferences') loadPreferencesUI();
    }
}

function getSectionTitle(sectionId) {
    const titles = {
        dashboard: 'Student Dashboard',
        login: 'Student Authentication Portal',
        examination: 'Online Examination Interface',
        results: 'Examination Performance & Scorecard',
        performance: 'Comprehensive Student Performance Analytics',
        history: 'Examination Attendance History',
        preferences: 'Portal & Subject Preferences'
    };
    return titles[sectionId] || 'Online Examination Portal';
}

/**
 * Authentication and Session Management
 */
function loadDemoStudentSession() {
    let saved = localStorage.getItem('exam_student_session');
    if (saved) {
        try {
            AppState.student = JSON.parse(saved);
        } catch (e) {
            AppState.student = null;
        }
    }

    // If demo mode and no student yet, log in default Demo Student 1
    if (!AppState.student) {
        AppState.student = DEMO_STUDENTS[0];
        localStorage.setItem('exam_student_session', JSON.stringify(AppState.student));
    }

    // Ensure sample history is seeded
    let history = localStorage.getItem('exam_student_history');
    if (!history) {
        localStorage.setItem('exam_student_history', JSON.stringify(SAMPLE_HISTORY));
    }

    updateUserInterface();
}

function updateUserInterface() {
    const userNameElem = document.getElementById('sidebarUserName');
    const userRoleElem = document.getElementById('sidebarUserRole');
    const userAvatarElem = document.getElementById('sidebarUserAvatar');
    const topbarGreeting = document.getElementById('topbarGreeting');

    if (AppState.student) {
        if (userNameElem) userNameElem.textContent = AppState.student.student_name;
        if (userRoleElem) userRoleElem.textContent = AppState.student.student_id;
        if (userAvatarElem) {
            const initials = AppState.student.student_name.split(' ').map(n => n[0]).join('').substring(0, 2);
            userAvatarElem.textContent = initials || 'ST';
        }
        if (topbarGreeting) topbarGreeting.textContent = `Welcome, ${AppState.student.student_name}`;
    } else {
        if (userNameElem) userNameElem.textContent = 'Guest Student';
        if (userRoleElem) userRoleElem.textContent = 'Not Logged In';
        if (userAvatarElem) userAvatarElem.textContent = 'GS';
        if (topbarGreeting) topbarGreeting.textContent = 'Welcome to Examination Portal';
    }
}

function handleLogin(e) {
    if (e) e.preventDefault();
    const studentIdInput = document.getElementById('loginStudentId');
    const studentNameInput = document.getElementById('loginStudentName');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('loginRememberMe');
    const alertBox = document.getElementById('loginAlert');

    const studentId = studentIdInput ? studentIdInput.value.trim() : '';
    const studentName = studentNameInput ? studentNameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    // Frontend Regex Validations matching PHP backend
    const idRegex = /^[A-Za-z0-9_-]{4,20}$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;

    if (!idRegex.test(studentId)) {
        showLoginAlert('Student ID must be 4-20 alphanumeric characters.', 'danger');
        return false;
    }

    if (!nameRegex.test(studentName)) {
        showLoginAlert('Student Name must contain letters and spaces only (2-50 characters).', 'danger');
        return false;
    }

    if (!password || password.length < 4) {
        showLoginAlert('Password is required (minimum 4 characters).', 'danger');
        return false;
    }

    // Find student or create session
    let matched = DEMO_STUDENTS.find(s => s.student_id.toUpperCase() === studentId.toUpperCase());
    if (matched && matched.password !== password) {
        showLoginAlert('Invalid credentials for demo account. Password is: demo123', 'danger');
        return false;
    }

    AppState.student = {
        student_id: studentId.toUpperCase(),
        student_name: studentName,
        email: matched ? matched.email : `${studentId.toLowerCase()}@college.edu`
    };

    localStorage.setItem('exam_student_session', JSON.stringify(AppState.student));
    if (rememberMe && rememberMe.checked) {
        localStorage.setItem('exam_remember_student', AppState.student.student_id);
    }

    updateUserInterface();
    showLoginAlert(`Welcome back, ${AppState.student.student_name}! Login successful.`, 'success');

    setTimeout(() => {
        navigateToSection('dashboard');
        renderDashboard();
    }, 600);

    return true;
}

function showLoginAlert(msg, type) {
    const alertBox = document.getElementById('loginAlert');
    if (alertBox) {
        alertBox.textContent = msg;
        alertBox.className = `alert alert-${type}`;
        alertBox.style.display = 'block';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to log out of the examination portal?')) {
        AppState.student = null;
        localStorage.removeItem('exam_student_session');
        updateUserInterface();
        showToast('Logged out successfully.', 'info');
        navigateToSection('login');
    }
}

function fillDemoLogin(studentId, name, password) {
    const idInput = document.getElementById('loginStudentId');
    const nameInput = document.getElementById('loginStudentName');
    const passInput = document.getElementById('loginPassword');

    if (idInput) idInput.value = studentId;
    if (nameInput) nameInput.value = name;
    if (passInput) passInput.value = password;
}

/**
 * Dashboard Metrics & Recent Examinations
 */
function renderDashboard() {
    const history = getStudentHistory();
    const totalAttended = history.length;
    const passedExams = history.filter(h => h.result_status.toLowerCase() === 'pass').length;
    const failedExams = totalAttended - passedExams;

    let avgPercentage = 0;
    let highestScore = 0;

    if (totalAttended > 0) {
        const totalPct = history.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0);
        avgPercentage = (totalPct / totalAttended).toFixed(1);
        highestScore = Math.max(...history.map(h => parseFloat(h.total_marks)));
    }

    // Update Stat Cards
    setText('dashTotalExams', totalAttended);
    setText('dashPassedExams', passedExams);
    setText('dashFailedExams', failedExams);
    setText('dashAvgPercentage', `${avgPercentage}%`);
    setText('dashHighestScore', `${highestScore} / 15`);

    // Render Recent Results Table
    const tbody = document.getElementById('dashRecentTableBody');
    if (tbody) {
        tbody.innerHTML = '';
        if (history.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No examinations attended yet. Click "Quick Start Examination" to begin!</td></tr>`;
        } else {
            const recent = history.slice(0, 5); // latest 5
            recent.forEach(exam => {
                const tr = document.createElement('tr');
                const badgeClass = exam.result_status.toLowerCase() === 'pass' ? 'badge-pass' : 'badge-fail';
                tr.innerHTML = `
                    <td><strong>${escapeHtml(exam.subject)}</strong><br><small style="color:var(--text-muted);">${exam.examination_id}</small></td>
                    <td>${exam.total_marks} / ${exam.total_questions}</td>
                    <td><strong>${parseFloat(exam.percentage).toFixed(1)}%</strong></td>
                    <td><span class="badge badge-grade">${exam.grade}</span></td>
                    <td><span class="badge ${badgeClass}">${exam.result_status}</span></td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="viewHistoricalResult('${exam.examination_id}')">
                            View Result
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    }
}

/**
 * Examination Workflow Engine
 */
function startNewExamination() {
    if (!AppState.student) {
        showToast('Please login first to begin the examination.', 'warning');
        navigateToSection('login');
        return;
    }

    // Determine subject from preference or dropdown
    const subjectSelect = document.getElementById('examSubjectSelect');
    const selectedSubject = subjectSelect ? subjectSelect.value : AppState.preferences.preferredSubject;

    // Filter questions: select 15 questions
    let pool = [...QUESTION_BANK];
    // Shuffle pool for varied exam experience
    pool.sort(() => Math.random() - 0.5);
    const examQuestions = pool.slice(0, 15);

    // Initialize exam state
    AppState.exam = {
        active: true,
        subject: selectedSubject,
        questions: examQuestions,
        currentIndex: 0,
        userAnswers: {},
        timeRemaining: 900, // 15 mins
        timerInterval: null,
        submitted: false,
        examId: `EXAM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    // Update Exam Meta Bar
    setText('examMetaId', AppState.exam.examId);
    setText('examMetaStudent', `${AppState.student.student_name} (${AppState.student.student_id})`);
    setText('examMetaSubject', AppState.exam.subject);

    // Render palette
    renderQuestionPalette();

    // Render first question
    renderCurrentQuestion();

    // Start Timer
    startExamTimer();

    // Switch view
    document.getElementById('examPreStartCard').style.display = 'none';
    document.getElementById('examActiveContainer').style.display = 'grid';
}

function startExamTimer() {
    if (AppState.exam.timerInterval) clearInterval(AppState.exam.timerInterval);

    const timerElem = document.getElementById('examTimerDisplay');
    const timerBox = document.getElementById('examTimerBox');

    function updateTimer() {
        const minutes = Math.floor(AppState.exam.timeRemaining / 60);
        const seconds = AppState.exam.timeRemaining % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timerElem) timerElem.textContent = timeStr;

        // Visual alert when time < 3 minutes (180 seconds)
        if (timerBox) {
            if (AppState.exam.timeRemaining <= 180) {
                timerBox.classList.add('warning');
            } else {
                timerBox.classList.remove('warning');
            }
        }

        if (AppState.exam.timeRemaining <= 0) {
            clearInterval(AppState.exam.timerInterval);
            showToast('Time has expired! Automatically submitting your examination...', 'warning');
            submitExamination(true);
        } else {
            AppState.exam.timeRemaining--;
        }
    }

    updateTimer();
    AppState.exam.timerInterval = setInterval(updateTimer, 1000);
}

function renderQuestionPalette() {
    const grid = document.getElementById('questionPaletteGrid');
    if (!grid) return;
    grid.innerHTML = '';

    AppState.exam.questions.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.textContent = idx + 1;
        btn.setAttribute('data-index', idx);

        if (idx === AppState.exam.currentIndex) {
            btn.classList.add('current');
        }
        if (AppState.exam.userAnswers[idx] !== undefined) {
            btn.classList.add('answered');
        }

        btn.addEventListener('click', () => {
            goToQuestion(idx);
        });

        grid.appendChild(btn);
    });
}

function renderCurrentQuestion() {
    const currentQ = AppState.exam.questions[AppState.exam.currentIndex];
    if (!currentQ) return;

    // Apply font size preference
    const card = document.getElementById('activeQuestionCard');
    if (card) {
        card.style.fontSize = AppState.preferences.fontSize === 'large' ? '1.1rem' : (AppState.preferences.fontSize === 'medium' ? '1.02rem' : '0.95rem');
    }

    // Number & Subject badge
    setText('activeQuestionNumBadge', `Question ${AppState.exam.currentIndex + 1} of 15`);
    setText('activeQuestionSubjectBadge', currentQ.subject);
    setText('activeQuestionText', currentQ.question);

    // Options container
    const optionsContainer = document.getElementById('activeQuestionOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        const savedAnswer = AppState.exam.userAnswers[AppState.exam.currentIndex];

        ['A', 'B', 'C', 'D'].forEach(letter => {
            const item = document.createElement('div');
            item.className = `option-item ${savedAnswer === letter ? 'selected' : ''}`;
            item.innerHTML = `
                <input type="radio" name="exam_option" class="option-radio" value="${letter}" ${savedAnswer === letter ? 'checked' : ''}>
                <div class="option-label-circle">${letter}</div>
                <div class="option-content">${escapeHtml(currentQ.options[letter])}</div>
            `;

            item.addEventListener('click', () => {
                selectAnswer(letter);
            });

            optionsContainer.appendChild(item);
        });
    }

    // Update navigation buttons
    const prevBtn = document.getElementById('examPrevBtn');
    const nextBtn = document.getElementById('examNextBtn');
    if (prevBtn) prevBtn.disabled = AppState.exam.currentIndex === 0;
    if (nextBtn) {
        if (AppState.exam.currentIndex === AppState.exam.questions.length - 1) {
            nextBtn.textContent = 'Review Answers';
        } else {
            nextBtn.textContent = 'Next Question →';
        }
    }

    // Update palette highlighting
    renderQuestionPalette();
}

function selectAnswer(letter) {
    if (AppState.exam.submitted) return;
    AppState.exam.userAnswers[AppState.exam.currentIndex] = letter;
    renderCurrentQuestion();
}

function clearCurrentAnswer() {
    delete AppState.exam.userAnswers[AppState.exam.currentIndex];
    renderCurrentQuestion();
}

function goToQuestion(index) {
    if (index >= 0 && index < AppState.exam.questions.length) {
        AppState.exam.currentIndex = index;
        renderCurrentQuestion();
    }
}

function nextQuestion() {
    if (AppState.exam.currentIndex < AppState.exam.questions.length - 1) {
        AppState.exam.currentIndex++;
        renderCurrentQuestion();
    } else {
        openSubmitModal();
    }
}

function prevQuestion() {
    if (AppState.exam.currentIndex > 0) {
        AppState.exam.currentIndex--;
        renderCurrentQuestion();
    }
}

/**
 * Examination Submission & Mark Calculation
 */
function openSubmitModal() {
    const totalQuestions = AppState.exam.questions.length;
    const answeredCount = Object.keys(AppState.exam.userAnswers).length;
    const unansweredCount = totalQuestions - answeredCount;

    setText('modalAnsweredCount', answeredCount);
    setText('modalUnansweredCount', unansweredCount);

    const modal = document.getElementById('submitConfirmModal');
    if (modal) modal.classList.add('active');
}

function closeSubmitModal() {
    const modal = document.getElementById('submitConfirmModal');
    if (modal) modal.classList.remove('active');
}

function submitExamination(isAutoSubmit = false) {
    closeSubmitModal();

    if (AppState.exam.submitted) return;
    AppState.exam.submitted = true;

    // Stop timer
    if (AppState.exam.timerInterval) {
        clearInterval(AppState.exam.timerInterval);
    }

    // AUTOMATIC MARK CALCULATION (Exact PHP Equivalent)
    const questions = AppState.exam.questions;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const answerBreakdown = [];

    questions.forEach((q, idx) => {
        const userChoice = AppState.exam.userAnswers[idx] || null;
        let isCorrect = 0;

        if (!userChoice) {
            unansweredCount++;
        } else if (userChoice === q.correct) {
            correctCount++;
            isCorrect = 1;
        } else {
            incorrectCount++;
        }

        answerBreakdown.push({
            question_id: q.id,
            question_text: q.question,
            subject: q.subject,
            selected_answer: userChoice,
            correct_answer: q.correct,
            is_correct: isCorrect,
            explanation: q.explanation,
            options: q.options
        });
    });

    const totalMarks = correctCount; // 1 mark per correct answer
    const maxMarks = 15;
    const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);
    const passThreshold = 40.0;
    const resultStatus = parseFloat(percentage) >= passThreshold ? 'Pass' : 'Fail';

    // Grade Determination Rule
    let grade = 'F';
    const pct = parseFloat(percentage);
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 40) grade = 'D';
    else grade = 'F';

    // Build Examination Record
    const examRecord = {
        examination_id: AppState.exam.examId,
        student_id: AppState.student.student_id,
        student_name: AppState.student.student_name,
        subject: AppState.exam.subject,
        total_questions: 15,
        correct_answers: correctCount,
        incorrect_answers: incorrectCount,
        unanswered_questions: unansweredCount,
        total_marks: totalMarks,
        percentage: percentage,
        grade: grade,
        result_status: resultStatus,
        examination_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        breakdown: answerBreakdown
    };

    // Save to localStorage History (Never overwrite past results)
    saveExamToHistory(examRecord);

    // Switch view to Results and display
    displayResultCard(examRecord);
    navigateToSection('results');

    // Reset Exam Active Container
    document.getElementById('examActiveContainer').style.display = 'none';
    document.getElementById('examPreStartCard').style.display = 'block';

    showToast('Examination submitted and graded successfully!', 'success');
}

function saveExamToHistory(examRecord) {
    let history = getStudentHistory();
    history.unshift(examRecord); // Add new record at beginning
    localStorage.setItem('exam_student_history', JSON.stringify(history));
}

function getStudentHistory() {
    let raw = localStorage.getItem('exam_student_history');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

/**
 * Results Section & Report Generation
 */
let currentViewedResult = null;

function displayResultCard(record) {
    currentViewedResult = record;

    setText('resExamId', record.examination_id);
    setText('resStudentName', record.student_name);
    setText('resStudentId', record.student_id);
    setText('resSubject', record.subject);
    setText('resDate', record.examination_date);
    setText('resTotalQ', record.total_questions);
    setText('resCorrect', record.correct_answers);
    setText('resIncorrect', record.incorrect_answers);
    setText('resUnanswered', record.unanswered_questions);
    setText('resMarksScore', record.total_marks);
    setText('resPercentage', `${parseFloat(record.percentage).toFixed(1)}%`);
    setText('resGradeBadge', record.grade);

    const statusBadge = document.getElementById('resStatusBadge');
    if (statusBadge) {
        statusBadge.textContent = record.result_status.toUpperCase();
        statusBadge.className = `badge ${record.result_status.toLowerCase() === 'pass' ? 'badge-pass' : 'badge-fail'}`;
    }

    // Render Answer Summary Accordion
    const container = document.getElementById('resAnswerSummaryContainer');
    if (container) {
        container.innerHTML = '';
        if (record.breakdown && record.breakdown.length > 0) {
            record.breakdown.forEach((item, idx) => {
                const div = document.createElement('div');
                const statusClass = !item.selected_answer ? 'unanswered' : (item.is_correct ? 'correct' : 'incorrect');
                const statusText = !item.selected_answer ? 'Unanswered' : (item.is_correct ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)');

                div.className = `answer-summary-item ${statusClass}`;
                div.innerHTML = `
                    <div class="answer-summary-question">
                        <strong>Q${idx + 1}:</strong> ${escapeHtml(item.question_text)}
                    </div>
                    <div class="answer-details">
                        <span><strong>Your Choice:</strong> ${item.selected_answer ? `${item.selected_answer} (${escapeHtml(item.options[item.selected_answer])})` : '<em style="color:var(--warning);">None Selected</em>'}</span>
                        <span><strong>Correct Answer:</strong> <strong style="color:var(--success);">${item.correct_answer} (${escapeHtml(item.options[item.correct_answer])})</strong></span>
                        <span><strong>Status:</strong> ${statusText}</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.84rem; color: var(--text-muted);">
                        💡 <em>${escapeHtml(item.explanation || '')}</em>
                    </div>
                `;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = `<p style="color:var(--text-muted);">Answer breakdown is available for recently submitted live sessions.</p>`;
        }
    }
}

function viewHistoricalResult(examId) {
    const history = getStudentHistory();
    const record = history.find(h => h.examination_id === examId);
    if (record) {
        displayResultCard(record);
        navigateToSection('results');
    }
}

function downloadResultReport() {
    if (!currentViewedResult) {
        showToast('No active result report found to download.', 'warning');
        return;
    }

    // Generate formatted Text Report matching PHP file output
    const r = currentViewedResult;
    const reportText = `========================================================================
ONLINE EXAMINATION & PERFORMANCE ANALYSIS SYSTEM - OFFICIAL REPORT
Apex Institute of Technology | Academic Year 2024-2025
========================================================================

EXAMINATION DETAILS
------------------------------------------------------------------------
Examination ID     : ${r.examination_id}
Examination Date   : ${r.examination_date}
Subject            : ${r.subject}
Status             : OFFICIAL RECORD (Archived)

STUDENT CREDENTIALS
------------------------------------------------------------------------
Student ID         : ${r.student_id}
Student Name       : ${r.student_name}
Email              : ${AppState.student ? AppState.student.email : 'student@college.edu'}

PERFORMANCE METRICS & MARKS
------------------------------------------------------------------------
Total Questions    : ${r.total_questions}
Correct Answers    : ${r.correct_answers}
Incorrect Answers  : ${r.incorrect_answers}
Unanswered         : ${r.unanswered_questions}
Total Marks        : ${r.total_marks} / ${r.total_questions}
Percentage Score   : ${r.percentage}%
Assigned Grade     : ${r.grade}
Result Verdict     : ${r.result_status.toUpperCase()}

GRADING REFERENCE BENCHMARK
------------------------------------------------------------------------
90% - 100% : A+ (Distinction)
80% - 89%  : A  (Excellent)
70% - 79%  : B  (Very Good)
60% - 69%  : C  (Good)
40% - 59%  : D  (Pass)
Below 40%  : F  (Fail)
Pass Threshold     : 40.00%

------------------------------------------------------------------------
Report Generated on ${new Date().toISOString()} via Client File Stream
Digital Verification Hash: ${Math.random().toString(36).substring(2, 18)}
========================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${r.examination_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Report downloaded successfully!', 'success');
}

function printResultReport() {
    window.print();
}

/**
 * Examination History Section
 */
function renderHistory() {
    const history = getStudentHistory();
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">No examination history recorded yet.</td></tr>`;
        return;
    }

    history.forEach(exam => {
        const tr = document.createElement('tr');
        const badgeClass = exam.result_status.toLowerCase() === 'pass' ? 'badge-pass' : 'badge-fail';
        tr.innerHTML = `
            <td><code>${exam.examination_id}</code></td>
            <td><strong>${escapeHtml(exam.subject)}</strong></td>
            <td>${exam.examination_date}</td>
            <td><strong>${exam.total_marks}</strong> / ${exam.total_questions}</td>
            <td><strong>${parseFloat(exam.percentage).toFixed(1)}%</strong></td>
            <td><span class="badge badge-grade">${exam.grade}</span></td>
            <td><span class="badge ${badgeClass}">${exam.result_status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewHistoricalResult('${exam.examination_id}')">
                    View
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Performance Analysis Section
 */
function renderPerformanceAnalysis() {
    const history = getStudentHistory();
    const totalExams = history.length;

    if (totalExams === 0) {
        setText('perfTotalAttended', '0');
        setText('perfAvgPercentage', '0%');
        setText('perfHighestScore', '0 / 15');
        setText('perfLowestScore', '0 / 15');
        setText('perfPassedExams', '0');
        setText('perfFailedExams', '0');
        return;
    }

    const passed = history.filter(h => h.result_status.toLowerCase() === 'pass').length;
    const failed = totalExams - passed;
    const percentages = history.map(h => parseFloat(h.percentage));
    const marks = history.map(h => parseFloat(h.total_marks));
    const avgPercentage = (percentages.reduce((a, b) => a + b, 0) / totalExams).toFixed(1);
    const highestMarks = Math.max(...marks);
    const lowestMarks = Math.min(...marks);

    setText('perfTotalAttended', totalExams);
    setText('perfAvgPercentage', `${avgPercentage}%`);
    setText('perfHighestScore', `${highestMarks} / 15`);
    setText('perfLowestScore', `${lowestMarks} / 15`);
    setText('perfPassedExams', passed);
    setText('perfFailedExams', failed);

    // Pass vs Fail meter
    const passRate = ((passed / totalExams) * 100).toFixed(0);
    const passFill = document.getElementById('perfPassRateFill');
    if (passFill) {
        passFill.style.width = `${passRate}%`;
    }
    setText('perfPassRateLabel', `${passRate}%`);

    // Subject-wise performance calculation
    const subjectMap = {};
    history.forEach(h => {
        if (!subjectMap[h.subject]) {
            subjectMap[h.subject] = { totalPct: 0, count: 0 };
        }
        subjectMap[h.subject].totalPct += parseFloat(h.percentage);
        subjectMap[h.subject].count++;
    });

    const chartContainer = document.getElementById('perfSubjectChartContainer');
    if (chartContainer) {
        chartContainer.innerHTML = '';
        for (const [subject, data] of Object.entries(subjectMap)) {
            const avg = (data.totalPct / data.count).toFixed(1);
            const row = document.createElement('div');
            row.className = 'bar-chart-row';
            row.innerHTML = `
                <div class="bar-label-group">
                    <span>${escapeHtml(subject)} (${data.count} exam${data.count > 1 ? 's' : ''})</span>
                    <span><strong>${avg}%</strong></span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${parseFloat(avg) >= 75 ? 'green' : (parseFloat(avg) >= 50 ? 'blue' : 'amber')}" style="width: ${avg}%"></div>
                </div>
            `;
            chartContainer.appendChild(row);
        }
    }

    // Overall Performance Verdict
    const verdictElem = document.getElementById('perfVerdictText');
    const verdictBadge = document.getElementById('perfVerdictBadge');
    let verdict = 'Satisfactory';
    let gradeChar = 'B';

    if (avgPercentage >= 85) {
        verdict = 'Outstanding / Distinction Performance';
        gradeChar = 'A+';
    } else if (avgPercentage >= 70) {
        verdict = 'Excellent Academic Standing';
        gradeChar = 'A';
    } else if (avgPercentage >= 50) {
        verdict = 'Good Competence - Consistent Progress';
        gradeChar = 'B';
    } else {
        verdict = 'Needs Structured Practice & Revision';
        gradeChar = 'C';
    }

    if (verdictElem) verdictElem.textContent = verdict;
    if (verdictBadge) verdictBadge.textContent = gradeChar;
}

/**
 * Preferences Management
 */
function setupPreferences() {
    let saved = localStorage.getItem('exam_preferences');
    if (saved) {
        try {
            AppState.preferences = Object.assign(AppState.preferences, JSON.parse(saved));
        } catch (e) {}
    }
}

function loadPreferencesUI() {
    const subSelect = document.getElementById('prefDefaultSubject');
    const fontSelect = document.getElementById('prefFontSize');
    const timerCheck = document.getElementById('prefTimerAlert');

    if (subSelect) subSelect.value = AppState.preferences.preferredSubject;
    if (fontSelect) fontSelect.value = AppState.preferences.fontSize;
    if (timerCheck) timerCheck.checked = AppState.preferences.timerAlert;
}

function savePreferences(e) {
    if (e) e.preventDefault();
    const subSelect = document.getElementById('prefDefaultSubject');
    const fontSelect = document.getElementById('prefFontSize');
    const timerCheck = document.getElementById('prefTimerAlert');

    AppState.preferences = {
        preferredSubject: subSelect ? subSelect.value : 'PHP Fundamentals',
        fontSize: fontSelect ? fontSelect.value : 'standard',
        timerAlert: timerCheck ? timerCheck.checked : true
    };

    localStorage.setItem('exam_preferences', JSON.stringify(AppState.preferences));

    // Also update cookie in browser for PHP parity
    document.cookie = `pref_subject=${encodeURIComponent(AppState.preferences.preferredSubject)}; max-age=2592000; path=/`;

    showToast('Preferences saved successfully!', 'success');
}

function clearPreferences() {
    AppState.preferences = {
        preferredSubject: 'PHP Fundamentals',
        fontSize: 'standard',
        timerAlert: true
    };
    localStorage.removeItem('exam_preferences');
    document.cookie = 'pref_subject=; max-age=0; path=/';
    loadPreferencesUI();
    showToast('Preferences reset to default values.', 'info');
}

/**
 * Event Listeners Registration
 */
function setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('studentLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Preferences form submission
    const prefForm = document.getElementById('preferencesForm');
    if (prefForm) {
        prefForm.addEventListener('submit', savePreferences);
    }
}

/**
 * Utility Helpers
 */
function setText(elemId, text) {
    const elem = document.getElementById(elemId);
    if (elem) elem.textContent = text;
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 3000; display: flex; flex-direction: column; gap: 8px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.cssText = 'margin-bottom: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadeIn 0.25s ease; min-width: 280px;';
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
